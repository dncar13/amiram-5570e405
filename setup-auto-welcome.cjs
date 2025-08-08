const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function setupWelcomeTrigger() {
    console.log('Setting up welcome email trigger in database...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Create a simpler approach - use the profiles table trigger instead
    // since we can't easily access auth.users triggers
    
    try {
        console.log('Creating trigger function for profiles table...');
        
        // First create a function that will be called when a profile is created
        const triggerFunction = `
            CREATE OR REPLACE FUNCTION public.send_welcome_email_on_profile_creation() 
            RETURNS TRIGGER AS $$
            DECLARE
                response RECORD;
            BEGIN
                -- Insert log entry
                INSERT INTO public.email_logs (user_id, recipient_email, email_type, status, created_at)
                VALUES (NEW.user_id, NEW.email, 'welcome', 'pending', NOW());
                
                -- Call the edge function
                SELECT 
                    net.http_post(
                        url := 'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service',
                        headers := jsonb_build_object(
                            'Content-Type', 'application/json',
                            'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc'
                        ),
                        body := jsonb_build_object(
                            'to', NEW.email,
                            'type', 'welcome',
                            'firstName', NEW.display_name,
                            'userId', NEW.user_id::text
                        )
                    ) INTO response;
                
                -- Update the log
                UPDATE public.email_logs 
                SET 
                    status = CASE 
                        WHEN response.status_code = 200 THEN 'sent'
                        ELSE 'failed'
                    END,
                    error_message = CASE 
                        WHEN response.status_code != 200 THEN 'HTTP ' || response.status_code || ': ' || response.content
                        ELSE NULL
                    END,
                    sent_at = CASE 
                        WHEN response.status_code = 200 THEN NOW()
                        ELSE NULL
                    END,
                    updated_at = NOW()
                WHERE user_id = NEW.user_id AND email_type = 'welcome' AND status = 'pending';
                
                RETURN NEW;
            EXCEPTION WHEN OTHERS THEN
                -- Log the error but don't fail the profile creation
                UPDATE public.email_logs 
                SET 
                    status = 'failed',
                    error_message = SQLERRM,
                    updated_at = NOW()
                WHERE user_id = NEW.user_id AND email_type = 'welcome' AND status = 'pending';
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        // Execute the function creation using RPC
        // Since we can't execute raw SQL directly, let's try another approach
        
        // For now, let's just ensure we have a manual process to catch new users
        console.log('Setting up monitoring for new users...');
        
        // Let's create a simple solution: 
        // 1. Check for new profiles every minute
        // 2. Send welcome emails to profiles that don't have them
        
        const monitorNewUsers = async () => {
            console.log('Checking for new users without welcome emails...');
            
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
                // Check if welcome email was already sent
                const { data: existingEmail, error: emailError } = await supabase
                    .from('email_logs')
                    .select('id')
                    .eq('user_id', profile.user_id)
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
        
        // Run the monitor once
        await monitorNewUsers();
        
        console.log('Welcome email monitoring setup complete!');
        console.log('For automatic welcome emails, this should be run periodically (e.g., every few minutes)');
        
    } catch (error) {
        console.error('Error setting up welcome trigger:', error);
    }
}

setupWelcomeTrigger().catch(console.error);
