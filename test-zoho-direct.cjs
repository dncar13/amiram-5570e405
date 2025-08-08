const nodemailer = require('nodemailer');

// הגדרות SMTP ל-ZOHO
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: 'support@amiram.net', // המייל שלך ב-ZOHO
    pass: 'szVXKueY109g'         // הסיסמה הספציפית לאפליקציה
  }
});

// פונקציית שליחה
async function sendMail() {
  try {
    console.log('מתחיל לשלוח מייל...');
    const info = await transporter.sendMail({
      from: '"Amiram Academy" <support@amiram.net>',
      to: 'amiram.academy@gmail.com', // לכתובת הבדיקה שלך
      subject: 'בדיקה - Zoho SMTP עובד!',
      text: 'המייל הזה נשלח דרך Zoho SMTP!',
      html: '<b>המייל הזה נשלח דרך Zoho SMTP!</b>',
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Info:', info);
  } catch (err) {
    console.error('Failed to send:', err);
  }
}

sendMail();
