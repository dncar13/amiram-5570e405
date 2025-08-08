const { createClient } = require('@supabase/supabase-js');

/**
 * Auto Welcome Email Service
 * 
 * This script checks for new user profiles and sends welcome emails
 * to users who haven't received them yet.
 * 
 * Run this script periodically (e.g., every 5-10 minutes) to ensure
 * all new users receive welcome emails.
 */

async function autoSendWelcomeEmails() {
    console.log('🚀 Starting auto welcome email service...');
    console.log('⏰ Time:', new Date().toLocaleString('he-IL'));
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
        // Check for new profiles in the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        console.log('📊 Checking for new profiles since:', twentyFourHoursAgo.toLocaleString('he-IL'));
        
        const { data: recentProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .gte('created_at', twentyFourHoursAgo.toISOString())
            .order('created_at', { ascending: false });
        
        if (profilesError) {
            console.error('❌ Error fetching recent profiles:', profilesError);
            return;
        }
        
        if (!recentProfiles || recentProfiles.length === 0) {
            console.log('✅ No new profiles found in the last 24 hours');
            return;
        }
        
        console.log(`📝 Found ${recentProfiles.length} recent profiles to check`);
        
        let emailsSent = 0;
        let emailsAlreadySent = 0;
        let emailsErrors = 0;
        
        for (const profile of recentProfiles) {
            console.log(`\n👤 Checking user: ${profile.email} (created: ${new Date(profile.created_at).toLocaleString('he-IL')})`);
            
            // Check if welcome email was already sent
            const { data: existingEmail, error: emailError } = await supabase
                .from('email_logs')
                .select('id, status, sent_at')
                .eq('recipient_email', profile.email)
                .eq('email_type', 'welcome')
                .limit(1);
            
            if (emailError) {
                console.error(`❌ Error checking email logs for ${profile.email}:`, emailError);
                emailsErrors++;
                continue;
            }
            
            if (existingEmail && existingEmail.length > 0) {
                const emailLog = existingEmail[0];
                console.log(`✅ Welcome email already sent (Status: ${emailLog.status}, Sent: ${emailLog.sent_at ? new Date(emailLog.sent_at).toLocaleString('he-IL') : 'N/A'})`);
                emailsAlreadySent++;
                continue;
            }
            
            // Send welcome email
            console.log(`📧 Sending welcome email to: ${profile.email}`);
            
            const { data: emailResult, error: sendError } = await supabase.functions.invoke('email-service', {
                body: {
                    to: profile.email,
                    type: 'welcome',
                    firstName: profile.display_name || profile.email.split('@')[0],
                    userId: profile.user_id
                }
            });
            
            if (sendError) {
                console.error(`❌ Failed to send welcome email to ${profile.email}:`, sendError);
                emailsErrors++;
            } else if (emailResult?.status === 'success') {
                console.log(`✅ Welcome email sent successfully to ${profile.email}`);
                emailsSent++;
            } else {
                console.error(`❌ Unexpected response for ${profile.email}:`, emailResult);
                emailsErrors++;
            }
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY:');
        console.log(`📝 Total profiles checked: ${recentProfiles.length}`);
        console.log(`📧 New emails sent: ${emailsSent}`);
        console.log(`✅ Emails already sent: ${emailsAlreadySent}`);
        console.log(`❌ Errors: ${emailsErrors}`);
        console.log('='.repeat(50));
        
        if (emailsSent > 0) {
            console.log(`🎉 Successfully sent ${emailsSent} welcome emails!`);
        }
        
    } catch (error) {
        console.error('💥 Unexpected error in auto welcome email service:', error);
    }
}

// If run directly (not imported)
if (require.main === module) {
    autoSendWelcomeEmails()
        .then(() => {
            console.log('🏁 Auto welcome email service completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Auto welcome email service failed:', error);
            process.exit(1);
        });
}

module.exports = { autoSendWelcomeEmails };
