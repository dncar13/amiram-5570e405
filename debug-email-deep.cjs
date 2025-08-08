const { createClient } = require('@supabase/supabase-js');

async function deepEmailDebugging() {
    console.log('🔍 בדיקה מעמיקה של מערכת המיילים');
    console.log('⏰ זמן נוכחי:', new Date().toLocaleString('he-IL'));
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
        // 1. בדיקת הגדרות SMTP
        console.log('\n1️⃣ בדיקת פונקציית המיילים...');
        
        // שליחת מייל בדיקה למייל הפרטי שלך (שאתה יודע שעובד)
        console.log('📧 שולח מייל בדיקה ל-danielpogod@gmail.com...');
        
        const { data: testResult, error: testError } = await supabase.functions.invoke('email-service', {
            body: {
                to: 'danielpogod@gmail.com',
                type: 'welcome',
                firstName: 'דניאל בדיקה',
                userId: 'test-debug-' + Date.now()
            }
        });
        
        if (testError) {
            console.error('❌ שגיאה בשליחת מייל בדיקה:', testError);
        } else {
            console.log('✅ תוצאת מייל בדיקה:', testResult);
        }
        
        // 2. בדיקת המייל לאמירם אקדמי
        console.log('\n2️⃣ שליחת מייל חוזר ל-amiram.academy@gmail.com...');
        
        const { data: academyResult, error: academyError } = await supabase.functions.invoke('email-service', {
            body: {
                to: 'amiram.academy@gmail.com',
                type: 'welcome',
                firstName: 'אמירם אקדמי',
                userId: 'test-academy-' + Date.now()
            }
        });
        
        if (academyError) {
            console.error('❌ שגיאה בשליחת מייל לאמירם אקדמי:', academyError);
        } else {
            console.log('✅ תוצאת מייל לאמירם אקדמי:', academyResult);
        }
        
        // 3. בדיקת לוגים חדשים
        console.log('\n3️⃣ המתנה 3 שניות ובדיקת לוגים...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const { data: newLogs, error: logsError } = await supabase
            .from('email_logs')
            .select('*')
            .in('recipient_email', ['danielpogod@gmail.com', 'amiram.academy@gmail.com'])
            .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 דקות אחרונות
            .order('created_at', { ascending: false });
        
        if (logsError) {
            console.error('❌ שגיאה בבדיקת לוגים:', logsError);
        } else {
            console.log(`📋 נמצאו ${newLogs?.length || 0} לוגים ב-5 הדקות האחרונות:`);
            newLogs?.forEach((log, index) => {
                console.log(`   ${index + 1}. ${log.recipient_email} - ${log.status} - ${new Date(log.created_at).toLocaleTimeString('he-IL')}`);
                if (log.error_message) {
                    console.log(`      ❌ שגיאה: ${log.error_message}`);
                }
            });
        }
        
        // 4. בדיקת SMTP ישירה עם nodemailer במקום edge function
        console.log('\n4️⃣ בדיקת SMTP ישירה...');
        
        try {
            const { data: smtpResult, error: smtpError } = await supabase.functions.invoke('nodemailer-smtp', {
                body: {
                    to: 'danielpogod@gmail.com',
                    subject: 'בדיקת SMTP ישירה - אמירם אקדמי',
                    html: `
                    <div dir="rtl" style="font-family:Arial,sans-serif;">
                        <h2>בדיקת SMTP ישירה</h2>
                        <p>זהו מייל בדיקה ישירה דרך nodemailer-smtp</p>
                        <p>זמן שליחה: ${new Date().toLocaleString('he-IL')}</p>
                    </div>
                    `
                }
            });
            
            if (smtpError) {
                console.error('❌ שגיאה ב-SMTP ישיר:', smtpError);
            } else {
                console.log('✅ תוצאת SMTP ישיר:', smtpResult);
            }
        } catch (smtpErr) {
            console.error('❌ שגיאה בקריאה ל-nodemailer-smtp:', smtpErr);
        }
        
        // 5. סיכום ומסקנות
        console.log('\n5️⃣ סיכום הבדיקה:');
        console.log('='.repeat(50));
        
        if (testResult?.status === 'success' && academyResult?.status === 'success') {
            console.log('✅ פונקציית המיילים מדווחת על הצלחה');
            console.log('❓ אך המיילים לא מגיעים - יכול להיות:');
            console.log('   1. בעיה עם ספק המיילים (Zoho)');
            console.log('   2. חסימה של המיילים כספאם');
            console.log('   3. בעיה בהגדרות DNS/SPF/DKIM');
            console.log('   4. הגבלת תעבורה מצד Zoho');
        } else {
            console.log('❌ יש בעיה בפונקציית המיילים עצמה');
        }
        
        console.log('\n📋 המלצות לתיקון:');
        console.log('1. בדוק את הגדרות Zoho SMTP');
        console.log('2. בדוק SPF/DKIM records של amiram.net');
        console.log('3. שקול מעבר לספק מיילים אחר (SendGrid/Resend)');
        console.log('4. הוסף לוגינג מפורט יותר לפונקציית המיילים');
        
    } catch (error) {
        console.error('💥 שגיאה כללית בבדיקה:', error);
    }
}

deepEmailDebugging().catch(console.error);
