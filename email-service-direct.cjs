#!/usr/bin/env node

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SMTP configuration for Zoho
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@amiram.net',
    pass: 'szVXKueY109g'
  }
});

// Email templates
const getEmailTemplate = (type, firstName, subscriptionType) => {
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
const logEmailSent = async (to, type, subject, status, errorMessage) => {
  try {
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
      console.error('Failed to log email to database:', error);
    } else {
      console.log(`✅ Email logged to database: ${to} - ${type} - ${status}`);
    }
  } catch (error) {
    console.error('Error logging email to database:', error);
  }
};

// Send email function
const sendEmail = async (type, to, firstName, subscriptionType) => {
  try {
    console.log(`📧 Sending ${type} email to ${to}...`);
    
    const template = getEmailTemplate(type, firstName, subscriptionType);
    
    const info = await transporter.sendMail({
      from: '"אמירם אקדמי" <support@amiram.net>',
      to: to,
      subject: template.subject,
      html: template.html,
    });
    
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    
    // Log successful email
    await logEmailSent(to, type, template.subject, 'sent');
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error(`❌ Failed to send ${type} email to ${to}:`, error);
    
    // Log failed email
    await logEmailSent(to, type, getEmailTemplate(type, firstName, subscriptionType).subject, 'failed', error.message);
    
    return { success: false, error: error.message };
  }
};

// Find and send missing welcome emails
const sendMissingWelcomeEmails = async () => {
  try {
    console.log('🔍 Looking for users without welcome emails...');
    
    // Get users who don't have welcome email logs
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('email, raw_user_meta_data, created_at')
      .not('email', 'is', null)
      .not('confirmed_at', 'is', null);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    const { data: emailLogs, error: logsError } = await supabase
      .from('email_logs')
      .select('recipient_email')
      .eq('email_type', 'welcome');
    
    if (logsError) {
      console.error('Error fetching email logs:', logsError);
      return;
    }
    
    const emailsWithWelcome = new Set(emailLogs.map(log => log.recipient_email));
    const usersWithoutWelcome = users.filter(user => !emailsWithWelcome.has(user.email));
    
    console.log(`Found ${usersWithoutWelcome.length} users without welcome emails`);
    
    for (const user of usersWithoutWelcome) {
      const firstName = user.raw_user_meta_data?.display_name || 
                       user.raw_user_meta_data?.name || 
                       user.email.split('@')[0];
      
      console.log(`Sending welcome email to: ${user.email}`);
      const result = await sendEmail('welcome', user.email, firstName);
      
      if (result.success) {
        console.log(`✅ Welcome email sent to ${user.email}`);
      } else {
        console.error(`❌ Failed to send welcome email to ${user.email}:`, result.error);
      }
      
      // Wait a bit between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('Error in sendMissingWelcomeEmails:', error);
  }
};

// Main function
const main = async () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node email-service-direct.cjs send welcome <email> <firstName>');
    console.log('  node email-service-direct.cjs send thank-you <email> <firstName> [subscriptionType]');
    console.log('  node email-service-direct.cjs find-missing');
    return;
  }
  
  const command = args[0];
  
  if (command === 'send' && args.length >= 4) {
    const [, type, email, firstName, subscriptionType] = args;
    const result = await sendEmail(type, email, firstName, subscriptionType);
    console.log('Result:', result);
  } else if (command === 'find-missing') {
    await sendMissingWelcomeEmails();
  } else {
    console.log('Invalid command or missing arguments');
  }
};

// If this script is run directly, execute main function
if (require.main === module) {
  main().catch(console.error);
}

// Export functions for use in other modules
module.exports = {
  sendEmail,
  sendMissingWelcomeEmails,
  logEmailSent
};
