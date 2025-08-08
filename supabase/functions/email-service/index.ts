import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper for creating Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseKey);
};

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'thank-you' | 'subscription-end';
  to: string;
  firstName: string;
  subscriptionType?: string;
}

interface EmailTemplateData {
  subject: string;
  html: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EMAIL-SERVICE] ${step}${detailsStr}`);
};

const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    // Priority 1: Use direct SMTP with nodemailer-like implementation
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpPort = Deno.env.get('SMTP_PORT') || '587';
    const smtpFromName = Deno.env.get('SMTP_FROM_NAME') || 'אמירם - צוות התמיכה';
    const smtpFromEmail = Deno.env.get('SMTP_FROM_EMAIL') || 'support@amiram.net';

    if (smtpHost && smtpUser && smtpPassword) {
      logStep('Using direct SMTP for email sending', { 
        host: smtpHost, 
        port: smtpPort,
        user: smtpUser,
        to: to,
        subject: subject.substring(0, 50) + '...'
      });

      try {
        // Use SMTP directly with a more reliable implementation
        const emailData = {
          from: `${smtpFromName} <${smtpFromEmail}>`,
          to: to,
          subject: subject,
          html: html,
          smtp: {
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: false, // true for 465, false for other ports
            auth: {
              user: smtpUser,
              pass: smtpPassword
            }
          }
        };

        // Use Resend API instead of unreliable SMTP
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (resendApiKey) {
          logStep('Using Resend API for email sending', { to });
          
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${smtpFromName} <${smtpFromEmail}>`,
              to: [to],
              subject: subject,
              html: html,
            })
          });

          if (resendResponse.ok) {
            const result = await resendResponse.json();
            logStep('Email sent successfully via Resend', { to, id: result.id });
            return true;
          } else {
            const error = await resendResponse.text();
            logStep('Resend API failed', { error, status: resendResponse.status });
            throw new Error(`Resend failed: ${error}`);
          }
        }

        // Fallback: Use a simpler email service
        logStep('No Resend API key, using Gmail SMTP fallback', { to });
        
        // Simple Gmail SMTP approach (for testing)
        const gmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'gmail',
            template_id: 'template_default',
            user_id: 'public_key',
            template_params: {
              to_email: to,
              from_name: smtpFromName,
              subject: subject,
              message: html
            }
          })
        });

        if (gmailResponse.ok) {
          logStep('Email sent via EmailJS Gmail service', { to });
          return true;
        } else {
          logStep('EmailJS Gmail failed', { status: gmailResponse.status });
          throw new Error('EmailJS Gmail failed');
        }
      } catch (smtpError) {
        logStep('Direct SMTP failed, trying fallback methods', { error: smtpError.message });
      }
    } else {
      logStep('SMTP credentials not fully configured, trying API services', {
        hasHost: !!smtpHost,
        hasUser: !!smtpUser,
        hasPassword: !!smtpPassword
      });
    }

    // Priority 2: Using Resend API (if available)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${smtpFromName} <${smtpFromEmail}>`,
          to: [to],
          subject: subject,
          html: html,
        })
      });

      if (response.ok) {
        logStep('Email sent successfully via Resend', { to, subject });
        return true;
      } else {
        const error = await response.text();
        logStep('Resend API failed', { error, status: response.status });
      }
    }

    // Priority 3: Using SendGrid API (if available)
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (sendgridApiKey) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: to }],
            subject: subject
          }],
          from: { email: smtpFromEmail, name: smtpFromName },
          content: [{
            type: 'text/html',
            value: html
          }]
        })
      });

      if (response.ok) {
        logStep('Email sent successfully via SendGrid', { to, subject });
        return true;
      } else {
        const error = await response.text();
        logStep('SendGrid API failed', { error, status: response.status });
      }
    }

    // If all methods failed, log the email for debugging
    logStep('All email services failed or not configured', {
      to,
      subject,
      htmlLength: html.length,
      smtpConfigured: !!(smtpHost && smtpUser && smtpPassword),
      resendConfigured: !!resendApiKey,
      sendgridConfigured: !!sendgridApiKey,
      note: 'Email content logged for debugging'
    });

    // Log email content for debugging purposes
    logStep('Email content preview', {
      to,
      subject,
      fromName: smtpFromName,
      fromEmail: smtpFromEmail,
      htmlPreview: html.substring(0, 200) + '...'
    });

    // Return false to indicate email was not sent
    return false;

  } catch (error) {
    logStep('Error in email sending process', { error: error.message, to, subject });
    return false;
  }
};

const getEmailTemplate = (type: string, firstName: string, subscriptionType?: string): EmailTemplateData => {
  switch (type) {
    case 'welcome':
      return {
        subject: 'ברוך הבא לאמירם אקדמי!',
        html: `
<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
  <p>שלום <b>${firstName}</b>,</p>
  <p>שמחים שבחרת להצטרף לאמירם אקדמי!</p>
  <p>
    החשבון שלך נוצר בהצלחה, ואתה מוזמן להתחיל לתרגל ולהתקדם לעבר ציון גבוה במבחן אמירם.
  </p>
  <p>
    <b>רגע לפני שמתחילים, חשוב לנו שתדע:</b><br>
    באתר תמצא עשרות מאמרים מקצועיים בנושאי דקדוק, כתיבה, אוצר מילים וטיפים חשובים להצלחה במבחן.<br>
    אנחנו ממליצים בחום להתחיל בקריאת המאמרים ולהעמיק בהם – במקביל לתרגול במבחנים והסימולציות שבמערכת.
  </p>
  <p>
    <a href="https://amiram.net/" style="background:#19a7ce;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-bottom:8px;">כניסה למערכת</a><br>
    <a href="https://amiram.net/articles" style="color:#19a7ce;text-decoration:underline;font-weight:bold;">מאמרים באתר</a>
  </p>
  <p>במידה ויש לך שאלות או זקוק לעזרה – אנחנו כאן בשבילך.</p>
  <br>
  <p>בהצלחה בלימודים!<br>
  <b>צוות אמירם אקדמי</b><br>
  <a href="mailto:support@amiram.net">support@amiram.net</a><br>
  <a href="https://amiram.net/" style="color:#19a7ce;">amiram.net</a>
  </p>
</div>`
      };

    case 'thank-you':
      return {
        subject: 'תודה רבה שרכשת מנוי באמירם אקדמי!',
        html: `
<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
  <p>שלום <b>${firstName}</b>,</p>
  <p>תודה רבה שרכשת מנוי <b>${subscriptionType || 'פרימיום'}</b> באמירם אקדמי!</p>
  <p>
    הגישה שלך למערכת נפתחה, וכעת תוכל ליהנות מכל התרגולים, הסימולציות והמאמרים המקצועיים באתר – ללא הגבלה, לכל אורך תקופת המנוי.
  </p>
  <p>
    אנחנו ממליצים לשלב בין תרגול במבחנים לבין קריאה במאמרים כדי להפיק את המירב מהלימודים ולהגיע מוכן וממוקד למבחן האמיתי.
  </p>
  <p>
    <a href="https://amiram.net/dashboard" style="background:#19a7ce;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-bottom:8px;">כניסה לאזור האישי שלך</a><br>
    <a href="https://amiram.net/articles" style="color:#19a7ce;text-decoration:underline;font-weight:bold;">מאגר המאמרים</a>
  </p>
  <br>
  <p>בהצלחה בלימודים!<br>
  <b>צוות אמירם אקדמי</b><br>
  <a href="mailto:support@amiram.net">support@amiram.net</a><br>
  <a href="https://amiram.net/" style="color:#19a7ce;">amiram.net</a>
  </p>
</div>`
      };

    case 'subscription-end':
      return {
        subject: 'הצעה מיוחדת לחידוש המנוי שלך!',
        html: `
<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
  <p>שלום <b>${firstName}</b>,</p>
  <p>
    שמחנו ללוות אותך בתקופת המנוי שלך באמירם אקדמי,<br>
    ומקווים שנעזרת בתרגולים, הסימולציות והמאמרים כדי להתקדם לקראת ציון גבוה במבחן.
  </p>
  <p>
    אם עדיין לא הגעת ליעד שלך, או שאתה רוצה להמשיך לתרגל ולהתחזק,<br>
    אנחנו מזמינים אותך להצטרף שוב – עם <b style="color:#19a7ce;">70% הנחה מיוחדת</b> על כל סוג מנוי חדש!
  </p>
  <p>
    <b>כל מה שצריך לעשות:</b><br>
    פשוט השב/י למייל הזה, וצוות התמיכה שלנו ישלח לך קופון אישי להנחה.
  </p>
  <p>
    <a href="https://amiram.net/articles" style="background:#19a7ce;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-bottom:8px;">התחל מהמאמרים שלנו</a><br>
    <a href="https://amiram.net/" style="color:#19a7ce;text-decoration:underline;font-weight:bold;">תרגל סימולציות</a>
  </p>
  <br>
  <p>
    אנחנו כאן לכל שאלה או בקשה – נשמח לעזור לך להצליח!
  </p>
  <br>
  <p>
    בהצלחה,<br>
    <b>צוות אמירם אקדמי</b><br>
    <a href="mailto:support@amiram.net">support@amiram.net</a><br>
    <a href="https://amiram.net/" style="color:#19a7ce;">amiram.net</a><br>
    <a href="https://www.facebook.com/profile.php?id=61577951978169" style="color:#1877f2;text-decoration:underline;" target="_blank">הפייסבוק שלנו</a>
  </p>
</div>`
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

const logEmailSent = async (supabaseClient: SupabaseClient, emailType: string, to: string, success: boolean) => {
  try {
    const { error } = await supabaseClient
      .from('email_logs')
      .insert({
        email_type: emailType,
        recipient_email: to,
        sent_at: new Date().toISOString(),
        status: success ? 'sent' : 'failed'
      });

    if (error) {
      logStep('Warning: Failed to log email', error);
    }
  } catch (error) {
    logStep('Warning: Failed to log email', error);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Email service request received", { 
      method: req.method, 
      url: req.url 
    });

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request payload
    const emailRequest: EmailRequest = await req.json();
    logStep("Email request received", emailRequest);

    // Validate request
    if (!emailRequest.type || !emailRequest.to || !emailRequest.firstName) {
      return new Response(JSON.stringify({ error: "Missing required fields: type, to, firstName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email was already sent recently (prevent duplicates)
    const { data: recentEmail } = await supabaseClient
      .from('email_logs')
      .select('id')
      .eq('email_type', emailRequest.type)
      .eq('recipient_email', emailRequest.to)
      .eq('status', 'sent')
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1)
      .single();

    if (recentEmail) {
      logStep('Email already sent recently', { type: emailRequest.type, to: emailRequest.to });
      return new Response(JSON.stringify({
        status: "already_sent",
        message: "Email already sent in the last 24 hours"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get email template
    const template = getEmailTemplate(emailRequest.type, emailRequest.firstName, emailRequest.subscriptionType);

    // Send email
    const emailSent = await sendEmail(emailRequest.to, template.subject, template.html);

    // Log the email attempt
    await logEmailSent(supabaseClient, emailRequest.type, emailRequest.to, emailSent);

    if (emailSent) {
      logStep("Email sent successfully", { type: emailRequest.type, to: emailRequest.to });
      return new Response(JSON.stringify({
        status: "success",
        message: "Email sent successfully"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({
        status: "error",
        message: "Failed to send email"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    logStep("Email service error", error);
    
    return new Response(JSON.stringify({
      status: "error",
      message: "Email service processing failed",
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});