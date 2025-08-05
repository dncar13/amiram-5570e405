const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure NodeMailer with Zoho SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'support@amiram.net',
    pass: 'YhpVaMpFKKYz'
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

// Main email sending function
function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: '"Amiram Academy" <support@amiram.net>',
    to,
    subject,
    html
  });
}

// Enhanced email service with database logging
async function sendEmailWithLogging(type, to, firstName, subscriptionType = null) {
  try {
    console.log(`📧 Sending ${type} email to ${to}`);

    // Check if email was already sent recently
    const { data: recentEmail } = await supabase
      .from('email_logs')
      .select('id')
      .eq('email_type', type)
      .eq('recipient_email', to)
      .eq('status', 'sent')
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1)
      .single();

    if (recentEmail) {
      console.log(`⚠️ Email already sent recently: ${type} to ${to}`);
      return { success: false, reason: 'already_sent_recently' };
    }

    // Get email template
    const template = getEmailTemplate(type, firstName, subscriptionType);

    // Send email
    const result = await sendMail(to, template.subject, template.html);
    
    // Log successful email
    await supabase
      .from('email_logs')
      .insert({
        email_type: type,
        recipient_email: to,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

    console.log(`✅ Email sent successfully: ${type} to ${to}`);
    return { success: true, result };

  } catch (error) {
    console.error(`❌ Error sending email: ${type} to ${to}`, error);
    
    // Log failed email
    await supabase
      .from('email_logs')
      .insert({
        email_type: type,
        recipient_email: to,
        sent_at: new Date().toISOString(),
        status: 'failed',
        error_message: error.message
      });

    return { success: false, error: error.message };
  }
}

// Function to process expired subscriptions and send end-of-subscription emails
async function processExpiredSubscriptions() {
  try {
    console.log('🔍 Checking for expired subscriptions...');

    // Get subscriptions that expired today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();

    const { data: expiredSubscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        end_date,
        profiles!inner(email, display_name)
      `)
      .eq('status', 'active')
      .gte('end_date', yesterday.toISOString())
      .lt('end_date', today.toISOString());

    if (error) {
      console.error('❌ Error fetching expired subscriptions:', error);
      return;
    }

    if (!expiredSubscriptions || expiredSubscriptions.length === 0) {
      console.log('✅ No expired subscriptions found for today');
      return;
    }

    console.log(`📊 Found ${expiredSubscriptions.length} expired subscriptions`);

    // Process each expired subscription
    for (const subscription of expiredSubscriptions) {
      const firstName = subscription.profiles.display_name || 
                       subscription.profiles.email.split('@')[0];

      // Send subscription-end email
      const emailResult = await sendEmailWithLogging(
        'subscription-end',
        subscription.profiles.email,
        firstName
      );

      if (emailResult.success) {
        // Update subscription status to expired
        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('id', subscription.id);
      }
    }

    console.log('✅ Finished processing expired subscriptions');

  } catch (error) {
    console.error('❌ Error processing expired subscriptions:', error);
  }
}

// Export functions for use in other modules
module.exports = {
  sendMail,
  sendEmailWithLogging,
  processExpiredSubscriptions,
  getEmailTemplate
};

// Example usage if run directly
if (require.main === module) {
  console.log('🚀 Amiram Academy Email Service Starting...');
  
  // Example: Send welcome email
  // sendEmailWithLogging('welcome', 'user@example.com', 'ישראל');
  
  // Example: Send thank-you email
  // sendEmailWithLogging('thank-you', 'user@example.com', 'ישראל', 'חודשי');
  
  // Example: Send subscription-end email
  // sendEmailWithLogging('subscription-end', 'user@example.com', 'ישראל');
  
  // Example: Process expired subscriptions (run this daily)
  // processExpiredSubscriptions();
}