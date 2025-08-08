const { createClient } = require('@supabase/supabase-js');

async function checkLatestEmailStatus() {
    console.log('בדיקת סטטוס המייל האחרון שנשלח ל-amiram.academy@gmail.com');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
        // בדיקת המייל האחרון שנשלח למשתמש
        const { data: emailLog, error } = await supabase
            .from('email_logs')
            .select('*')
            .eq('recipient_email', 'amiram.academy@gmail.com')
            .eq('email_type', 'welcome')
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) {
            console.error('❌ שגיאה בבדיקת email_logs:', error);
            return;
        }
        
        if (emailLog && emailLog.length > 0) {
            const log = emailLog[0];
            console.log('📧 פרטי המייל האחרון:');
            console.log(`   📅 נוצר: ${new Date(log.created_at).toLocaleString('he-IL')}`);
            console.log(`   📤 נשלח: ${log.sent_at ? new Date(log.sent_at).toLocaleString('he-IL') : 'לא נשלח'}`);
            console.log(`   ✅ סטטוס: ${log.status}`);
            console.log(`   ❌ שגיאה: ${log.error_message || 'אין'}`);
            console.log(`   🔄 עודכן: ${new Date(log.updated_at).toLocaleString('he-IL')}`);
            
            if (log.status === 'sent' && log.sent_at) {
                console.log('\n🎉 המייל נשלח בהצלחה!');
                console.log('📍 בדוק את תיבת הדואר הנכנס ותיקיית ספאם של amiram.academy@gmail.com');
                
                // חישוב זמן משליחה
                const sentTime = new Date(log.sent_at);
                const now = new Date();
                const minutesAgo = Math.round((now - sentTime) / (1000 * 60));
                console.log(`⏰ המייל נשלח לפני ${minutesAgo} דקות`);
            } else {
                console.log('❌ המייל לא נשלח או שיש בעיה');
            }
        } else {
            console.log('❌ לא נמצא מייל למשתמש זה');
        }
        
        // בדיקה כללית של מיילים שנשלחו ב-10 הדקות האחרונות
        console.log('\n📊 מיילים שנשלחו ב-10 הדקות האחרונות:');
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
        
        const { data: recentEmails, error: recentError } = await supabase
            .from('email_logs')
            .select('recipient_email, email_type, status, sent_at')
            .gte('created_at', tenMinutesAgo.toISOString())
            .eq('status', 'sent')
            .order('sent_at', { ascending: false });
        
        if (recentError) {
            console.error('❌ שגיאה בבדיקת מיילים אחרונים:', recentError);
        } else if (recentEmails && recentEmails.length > 0) {
            console.log(`📧 נשלחו ${recentEmails.length} מיילים ב-10 הדקות האחרונות:`);
            recentEmails.forEach((email, index) => {
                const sentTime = new Date(email.sent_at);
                console.log(`   ${index + 1}. ${email.recipient_email} - ${email.email_type} (${sentTime.toLocaleTimeString('he-IL')})`);
            });
        } else {
            console.log('📧 לא נשלחו מיילים ב-10 הדקות האחרונות');
        }
        
    } catch (error) {
        console.error('💥 שגיאה כללית:', error);
    }
}

checkLatestEmailStatus().catch(console.error);
