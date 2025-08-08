const { createClient } = require('@supabase/supabase-js');

async function checkEmailLogsStructure() {
    console.log('Checking email_logs table structure...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Get a sample record to see the structure
    const { data: sample, error } = await supabase
        .from('email_logs')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error querying email_logs:', error);
        return;
    }
    
    console.log('Sample email_logs record structure:');
    if (sample && sample.length > 0) {
        console.log(Object.keys(sample[0]));
        console.log('Sample record:', sample[0]);
    } else {
        console.log('No records found');
    }
    
    // Let's create a simple fixed version
    console.log('\nCreating fixed monitoring for new users...');
    
    const monitorNewUsers = async () => {
        console.log('Checking for new users without welcome emails (fixed version)...');
        
        // Get recent profiles (last hour)
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        const { data: recentProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .gte('created_at', oneHourAgo.toISOString())
            .order('created_at', { ascending: false });
        
        if (profilesError) {
            console.error('Error fetching recent profiles:', profilesError);
            return;
        }
        
        if (!recentProfiles || recentProfiles.length === 0) {
            console.log('No recent profiles found');
            return;
        }
        
        console.log(`Found ${recentProfiles.length} recent profiles`);
        
        for (const profile of recentProfiles) {
            // Check if welcome email was already sent using recipient_email instead of user_id
            const { data: existingEmail, error: emailError } = await supabase
                .from('email_logs')
                .select('id')
                .eq('recipient_email', profile.email)
                .eq('email_type', 'welcome')
                .limit(1);
            
            if (emailError) {
                console.error(`Error checking email for ${profile.email}:`, emailError);
                continue;
            }
            
            if (!existingEmail || existingEmail.length === 0) {
                console.log(`Sending welcome email to new user: ${profile.email}`);
                
                const { data: emailResult, error: sendError } = await supabase.functions.invoke('email-service', {
                    body: {
                        to: profile.email,
                        type: 'welcome',
                        firstName: profile.display_name,
                        userId: profile.user_id
                    }
                });
                
                if (sendError) {
                    console.error(`Failed to send welcome email to ${profile.email}:`, sendError);
                } else {
                    console.log(`✅ Welcome email sent to ${profile.email}:`, emailResult);
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log(`✓ ${profile.email} already has welcome email`);
            }
        }
    };
    
    // Run the monitor
    await monitorNewUsers();
}

checkEmailLogsStructure().catch(console.error);
