const { createClient } = require('@supabase/supabase-js');

async function testDirectEmail() {
    console.log('🧪 בדיקת שליחת מייל ישירה עם כתובת חדשה');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // נשתמש בכתובת מייל אחרת כדי לעקוף את מנגנון האנטי-דופליקציה
    const testEmail = `test-direct-${Date.now()}@example.com`;
    
    console.log(`📧 שולח מייל בדיקה ל-${testEmail}...`);
    
    try {
        // שליחה דרך email-service (עם מייל שעדיין לא נשלח)
        const { data: serviceResult, error: serviceError } = await supabase.functions.invoke('email-service', {
            body: {
                to: testEmail,
                type: 'welcome',
                firstName: 'בדיקה ישירה',
                userId: 'test-direct-' + Date.now()
            }
        });
        
        if (serviceError) {
            console.error('❌ שגיאה ב-email-service:', serviceError);
        } else {
            console.log('✅ תוצאת email-service:', serviceResult);
        }
        
        // שליחה דרך nodemailer-smtp
        console.log('\n📧 שולח מייל דרך nodemailer-smtp ל-danielpogod@gmail.com...');
        
        const { data: smtpResult, error: smtpError } = await supabase.functions.invoke('nodemailer-smtp', {
            body: {
                to: 'danielpogod@gmail.com',
                subject: 'בדיקת מייל ישירה - אמירם אקדמי',
                html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #19a7ce;">🧪 בדיקת מייל ישירה</h2>
                    <p>שלום דניאל,</p>
                    <p>זהו מייל בדיקה ישירה דרך nodemailer-smtp לצורך בדיקת הגדרות SMTP.</p>
                    <p><strong>זמן שליחה:</strong> ${new Date().toLocaleString('he-IL')}</p>
                    <p><strong>מטרה:</strong> לוודא שהגדרות SMTP עובדות תקין</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        מייל זה נשלח מ-support@amiram.net במסגרת בדיקת מערכת המיילים של אמירם אקדמי.
                    </p>
                </div>
                `
            }
        });
        
        if (smtpError) {
            console.error('❌ שגיאה ב-nodemailer-smtp:', smtpError);
        } else {
            console.log('✅ תוצאת nodemailer-smtp:', smtpResult);
        }
        
        // בדיקת לוגים לאחר השליחה
        console.log('\n⏳ המתנה 3 שניות לבדיקת לוגים...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const { data: latestLogs, error: logsError } = await supabase
            .from('email_logs')
            .select('*')
            .eq('recipient_email', testEmail)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (logsError) {
            console.error('❌ שגיאה בבדיקת לוגים:', logsError);
        } else if (latestLogs && latestLogs.length > 0) {
            const log = latestLogs[0];
            console.log('\n📋 לוג המייל החדש:');
            console.log(`   📧 Email: ${log.recipient_email}`);
            console.log(`   ✅ Status: ${log.status}`);
            console.log(`   📅 Created: ${new Date(log.created_at).toLocaleString('he-IL')}`);
            console.log(`   📤 Sent: ${log.sent_at ? new Date(log.sent_at).toLocaleString('he-IL') : 'לא נשלח'}`);
            console.log(`   ❌ Error: ${log.error_message || 'אין'}`);
        } else {
            console.log('\n❌ לא נוצר לוג חדש');
        }
        
    } catch (error) {
        console.error('💥 שגיאה בבדיקה:', error);
    }
}

testDirectEmail().catch(console.error);
