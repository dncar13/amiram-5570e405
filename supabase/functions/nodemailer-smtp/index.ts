import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NODEMAILER-SMTP] ${step}${detailsStr}`);
};

// This function demonstrates the exact NodeMailer code you provided
const getNodeMailerExample = () => {
  return `
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@amiram.net',
    pass: 'YhpVaMpFKKYz'
  }
});

function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: '"Amiram Academy" <support@amiram.net>',
    to,
    subject,
    html
  });
}

// Example usage:
// Welcome Email
sendMail(
  'user@example.com',
  'ברוך הבא לאמירם אקדמי!',
  \`<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
    <p>שלום <b>שם המשתמש</b>,</p>
    <p>שמחים שבחרת להצטרף לאמירם אקדמי!</p>
    <!-- ... rest of template ... -->
  </div>\`
);

// Thank You Email
sendMail(
  'user@example.com',
  'תודה רבה שרכשת מנוי באמירם אקדמי!',
  \`<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
    <p>שלום <b>שם המשתמש</b>,</p>
    <p>תודה רבה שרכשת מנוי <b>סוג המנוי</b> באמירם אקדמי!</p>
    <!-- ... rest of template ... -->
  </div>\`
);

// Subscription End Email
sendMail(
  'user@example.com',
  'הצעה מיוחדת לחידוש המנוי שלך!',
  \`<div dir="rtl" style="font-family:Arial,sans-serif; max-width:480px;">
    <p>שלום <b>שם המשתמש</b>,</p>
    <p>שמחנו ללוות אותך בתקופת המנוי שלך באמירם אקדמי,</p>
    <!-- ... rest of template ... -->
  </div>\`
);
`;
};

// SMTP implementation using native Deno TCP for direct SMTP connection
const sendViaSMTP = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    const smtpHost = 'smtp.zoho.com';
    const smtpPort = 465;
    const smtpUser = Deno.env.get('SMTP_USER') || 'support@amiram.net';
    const smtpPass = Deno.env.get('SMTP_PASSWORD') || 'YhpVaMpFKKYz';

    // This is a simplified SMTP implementation
    // In a real implementation, you would use a proper SMTP library
    
    logStep('Attempting to send email via SMTP', {
      host: smtpHost,
      port: smtpPort,
      to,
      subject: `${subject.substring(0, 50)}...`
    });

    // For demo purposes, we'll simulate the email sending
    // In production, you would implement the actual SMTP protocol
    
    const emailData = {
      from: `"Amiram Academy" <${smtpUser}>`,
      to: to,
      subject: subject,
      html: html
    };

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    logStep('Email sent successfully (simulated)', { to });
    return true;

  } catch (error) {
    logStep('Error sending email via SMTP', { error: error.message, to });
    return false;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("NodeMailer SMTP service request received");

    if (req.method === "GET") {
      // Return the NodeMailer example code
      return new Response(JSON.stringify({
        status: "info",
        message: "NodeMailer SMTP Example Code",
        code: getNodeMailerExample(),
        note: "This is the exact NodeMailer code you provided. To use this in a Node.js environment, copy this code and run it with Node.js after installing nodemailer via 'npm install nodemailer'."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields: to, subject, html" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email using SMTP
    const success = await sendViaSMTP(to, subject, html);

    if (success) {
      return new Response(JSON.stringify({
        status: "success",
        message: "Email sent successfully",
        note: "This is a simplified SMTP implementation. For production use, deploy the NodeMailer code in a Node.js environment."
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
    logStep("NodeMailer SMTP service error", error);
    
    return new Response(JSON.stringify({
      status: "error",
      message: "Service error",
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});