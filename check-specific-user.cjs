const { createClient } = require('@supabase/supabase-js');

async function checkUserRegistration() {
    console.log('בדיקת רישום משתמש: amiram.academy@gmail.com');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const testEmail = 'amiram.academy@gmail.com';
    
    try {
        // בדיקה אם המשתמש קיים בטבלת profiles
        console.log('🔍 בודק אם המשתמש קיים בטבלת profiles...');
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', testEmail)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (profileError) {
            console.error('❌ שגיאה בבדיקת profiles:', profileError);
        } else if (profile && profile.length > 0) {
            const userProfile = profile[0];
            console.log('✅ משתמש נמצא בטבלת profiles:');
            console.log(`   📧 Email: ${userProfile.email}`);
            console.log(`   👤 Display Name: ${userProfile.display_name}`);
            console.log(`   🆔 User ID: ${userProfile.user_id}`);
            console.log(`   📅 Created: ${new Date(userProfile.created_at).toLocaleString('he-IL')}`);
            console.log(`   📅 Updated: ${new Date(userProfile.updated_at).toLocaleString('he-IL')}`);
            
            // בדיקה אם נשלח מייל קבלת פנים
            console.log('\n📧 בודק אם נשלח מייל קבלת פנים...');
            const { data: emailLogs, error: emailError } = await supabase
                .from('email_logs')
                .select('*')
                .eq('recipient_email', testEmail)
                .eq('email_type', 'welcome')
                .order('created_at', { ascending: false });
            
            if (emailError) {
                console.error('❌ שגיאה בבדיקת email_logs:', emailError);
            } else if (emailLogs && emailLogs.length > 0) {
                console.log(`✅ נמצאו ${emailLogs.length} מיילי קבלת פנים:`);
                emailLogs.forEach((log, index) => {
                    console.log(`   ${index + 1}. Status: ${log.status}, Created: ${new Date(log.created_at).toLocaleString('he-IL')}`);
                    if (log.sent_at) {
                        console.log(`      Sent: ${new Date(log.sent_at).toLocaleString('he-IL')}`);
                    }
                    if (log.error_message) {
                        console.log(`      Error: ${log.error_message}`);
                    }
                });
            } else {
                console.log('❌ לא נמצא מייל קבלת פנים למשתמש זה!');
                
                // ננסה לשלוח מייל עכשיו
                console.log('\n📤 שולח מייל קבלת פנים עכשיו...');
                const { data: emailResult, error: sendError } = await supabase.functions.invoke('email-service', {
                    body: {
                        to: testEmail,
                        type: 'welcome',
                        firstName: userProfile.display_name || testEmail.split('@')[0],
                        userId: userProfile.user_id
                    }
                });
                
                if (sendError) {
                    console.error('❌ שגיאה בשליחת מייל:', sendError);
                } else {
                    console.log('✅ מייל נשלח בהצלחה:', emailResult);
                }
            }
        } else {
            console.log('❌ משתמש לא נמצא בטבלת profiles');
        }
        
        // בדיקה כללית של מיילים אחרונים
        console.log('\n📊 בדיקת מיילים אחרונים במערכת (30 דקות אחרונות):');
        const thirtyMinutesAgo = new Date();
        thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
        
        const { data: recentEmails, error: recentError } = await supabase
            .from('email_logs')
            .select('*')
            .gte('created_at', thirtyMinutesAgo.toISOString())
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (recentError) {
            console.error('❌ שגיאה בבדיקת מיילים אחרונים:', recentError);
        } else if (recentEmails && recentEmails.length > 0) {
            console.log(`📧 נמצאו ${recentEmails.length} מיילים אחרונים:`);
            recentEmails.forEach((email, index) => {
                console.log(`   ${index + 1}. ${email.recipient_email} - ${email.email_type} - ${email.status} (${new Date(email.created_at).toLocaleTimeString('he-IL')})`);
            });
        } else {
            console.log('📧 לא נמצאו מיילים חדשים ב-30 הדקות האחרונות');
        }
        
        // בדיקת משתמשים חדשים
        console.log('\n👥 בדיקת משתמשים חדשים (30 דקות אחרונות):');
        const { data: recentProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .gte('created_at', thirtyMinutesAgo.toISOString())
            .order('created_at', { ascending: false });
        
        if (profilesError) {
            console.error('❌ שגיאה בבדיקת משתמשים חדשים:', profilesError);
        } else if (recentProfiles && recentProfiles.length > 0) {
            console.log(`👤 נמצאו ${recentProfiles.length} משתמשים חדשים:`);
            recentProfiles.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.email} - ${new Date(profile.created_at).toLocaleString('he-IL')}`);
            });
        } else {
            console.log('👤 לא נמצאו משתמשים חדשים ב-30 הדקות האחרונות');
        }
        
    } catch (error) {
        console.error('💥 שגיאה כללית:', error);
    }
}

checkUserRegistration().catch(console.error);
