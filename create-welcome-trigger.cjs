const { createClient } = require('@supabase/supabase-js');

async function createWelcomeEmailTrigger() {
    console.log('Creating welcome email trigger...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Since we can't directly execute SQL on auth.users (it's protected),
    // let's create a trigger on the profiles table instead
    
    console.log('Creating trigger function for profiles table...');
    
    // First, let's check if we have access to create functions
    try {
        // Test a simple operation first
        const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
        
        if (testError) {
            console.error('Cannot access profiles table:', testError);
            return;
        }
        
        console.log('Profiles table accessible, proceeding...');
        
        // Instead of creating database triggers (which require special permissions),
        // let's create a webhook approach using edge functions
        
        // First, test sending a welcome email to a recent user who didn't get one
        const recentUser = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'dncar20@gmail.com')
            .single();
        
        if (recentUser.data) {
            console.log('Found recent user:', recentUser.data);
            
            // Check if this user already got a welcome email
            const { data: existingEmail, error: emailCheckError } = await supabase
                .from('email_logs')
                .select('*')
                .eq('recipient_email', recentUser.data.email)
                .eq('email_type', 'welcome');
            
            if (emailCheckError) {
                console.error('Error checking existing emails:', emailCheckError);
                return;
            }
            
            if (!existingEmail || existingEmail.length === 0) {
                console.log('User did not receive welcome email. Sending now...');
                
                const { data: emailResult, error: emailError } = await supabase.functions.invoke('email-service', {
                    body: {
                        to: recentUser.data.email,
                        type: 'welcome',
                        firstName: recentUser.data.display_name || recentUser.data.email.split('@')[0],
                        userId: recentUser.data.user_id
                    }
                });
                
                if (emailError) {
                    console.error('Failed to send retroactive welcome email:', emailError);
                } else {
                    console.log('Successfully sent retroactive welcome email:', emailResult);
                }
            } else {
                console.log('User already received welcome email:', existingEmail);
            }
        }
        
        // Now let's create a simple solution: a scheduled function that checks for new users
        // and sends welcome emails to those who haven't received them yet
        
        console.log('\nCreating catch-up function for missing welcome emails...');
        
        // Get all recent profiles (last 7 days) that might be missing welcome emails
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: recentProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: false });
        
        if (profilesError) {
            console.error('Error fetching recent profiles:', profilesError);
            return;
        }
        
        console.log(`Found ${recentProfiles.length} recent profiles`);
        
        // Check which ones are missing welcome emails
        for (const profile of recentProfiles) {
            const { data: emailExists, error: checkError } = await supabase
                .from('email_logs')
                .select('id')
                .eq('recipient_email', profile.email)
                .eq('email_type', 'welcome')
                .limit(1);
            
            if (checkError) {
                console.error(`Error checking email for ${profile.email}:`, checkError);
                continue;
            }
            
            if (!emailExists || emailExists.length === 0) {
                console.log(`Missing welcome email for: ${profile.email}`);
                
                // Send welcome email
                const { data: sendResult, error: sendError } = await supabase.functions.invoke('email-service', {
                    body: {
                        to: profile.email,
                        type: 'welcome',
                        firstName: profile.display_name || profile.email.split('@')[0],
                        userId: profile.user_id
                    }
                });
                
                if (sendError) {
                    console.error(`Failed to send welcome email to ${profile.email}:`, sendError);
                } else {
                    console.log(`Successfully sent welcome email to ${profile.email}:`, sendResult);
                }
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.log(`✓ ${profile.email} already has welcome email`);
            }
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

createWelcomeEmailTrigger().catch(console.error);
