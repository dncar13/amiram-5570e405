import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [EMAIL-SERVICE] ${step}${detailsStr}`);
};

// SMTP sending using Deno SMTP client
const sendEmailViaZohoSMTP = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpFromName = Deno.env.get('SMTP_FROM_NAME') || 'אמירם אקדמי';
    const smtpFromEmail = Deno.env.get('SMTP_FROM_EMAIL') || smtpUser || 'support@amiram.net';

    if (!smtpHost || !smtpUser || !smtpPassword) {
      logStep('SMTP configuration incomplete', {
        hasHost: !!smtpHost,
        hasUser: !!smtpUser,
        hasPassword: !!smtpPassword
      });
      return false;
    }

    logStep('Sending email via Zoho SMTP', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      to: to,
      subject: subject
    });

    // Create SMTP client
    const client = new SmtpClient();

    // Connect to SMTP server - use 465 for SSL or 587 for STARTTLS
    if (smtpPort === 465) {
      await client.connectTLS({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPassword,
      });
    } else {
      // For port 587, use STARTTLS
      await client.connect({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPassword,
      });
    }

    // Send email
    await client.send({
      from: `${smtpFromName} <${smtpFromEmail}>`,
      to: to,
      subject: subject,
      content: html,
      html: html,
    });

    // Close connection
    await client.close();

    logStep('Email sent successfully via Zoho SMTP', { to, subject });
    return true;

  } catch (error) {
    logStep('SMTP sending failed', { error: error.message, to });
    console.error('SMTP Error details:', error);
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

    default:
      return {
        subject: 'הודעה מאמירם אקדמי',
        html: `
<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
  <p>שלום ${firstName},</p>
  <p>תודה שאתה חלק מקהילת אמירם אקדמי!</p>
  <br>
  <p>בברכה,<br>
  <b>צוות אמירם אקדמי</b><br>
  <a href="mailto:support@amiram.net">support@amiram.net</a>
  </p>
</div>`
      };
  }
};

// Log email to database
const logEmailSent = async (to: string, type: string, subject: string, status: 'sent' | 'failed', errorMessage?: string) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase
      .from('email_logs')
      .insert({
        recipient_email: to,
        email_type: type,
        status: status,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        error_message: errorMessage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      logStep('Failed to log email to database', { error: error.message, to });
    } else {
      logStep('Email logged to database', { to, type, status });
    }
  } catch (error) {
    logStep('Error logging email to database', { error: error.message, to });
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    logStep('Email service request received', { method: req.method });

    const { type, to, firstName, subscriptionType }: EmailRequest = await req.json();

    // Validate required fields
    if (!type || !to || !firstName) {
      logStep('Missing required fields', { type, to, firstName });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, to, firstName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep('Processing email request', { type, to, firstName });

    // Get email template
    const template = getEmailTemplate(type, firstName, subscriptionType);
    logStep('Email template generated', { type, subject: template.subject });

    // Send email
    const emailSent = await sendEmailViaZohoSMTP(to, template.subject, template.html);
    
    if (emailSent) {
      // Log successful email
      await logEmailSent(to, type, template.subject, 'sent');
      
      logStep('Email sent successfully', { to, type });
      return new Response(
        JSON.stringify({ status: 'success', message: 'Email sent successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Log failed email
      await logEmailSent(to, type, template.subject, 'failed', 'SMTP sending failed');
      
      logStep('Email sending failed', { to, type });
      return new Response(
        JSON.stringify({ status: 'error', message: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    logStep('Email service error', { error: error.message });
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
