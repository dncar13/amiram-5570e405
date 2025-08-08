const { createClient } = require('@supabase/supabase-js');

async function simulateUserSignup() {
    console.log('Simulating user signup flow...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I';
    
    const supabase = createClient(supabaseUrl, anonKey);
    
    // Generate a unique test email
    const testEmail = `test-signup-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    
    console.log('Attempting to sign up with:', testEmail);
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                emailRedirectTo: 'http://localhost:8080/'
            }
        });
        
        if (error) {
            console.error('Signup failed:', error);
            return;
        }
        
        console.log('Signup successful:', {
            user: data.user?.id,
            email: data.user?.email,
            created_at: data.user?.created_at
        });
        
        // Wait a moment and then check email logs
        console.log('Waiting 3 seconds before checking email logs...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Switch to service role to check email logs
        const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
        const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
        
        console.log('Checking email logs for:', testEmail);
        const { data: emailLogs, error: emailError } = await adminSupabase
            .from('email_logs')
            .select('*')
            .eq('recipient_email', testEmail)
            .order('created_at', { ascending: false });
        
        if (emailError) {
            console.error('Error checking email logs:', emailError);
        } else if (emailLogs && emailLogs.length > 0) {
            console.log('✅ Welcome email was sent!', emailLogs[0]);
        } else {
            console.log('❌ No welcome email found in logs');
        }
        
        // Also check recent profiles
        console.log('Checking profiles table...');
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('*')
            .eq('email', testEmail)
            .single();
        
        if (profileError) {
            console.log('No profile found yet (this is normal for new signups)');
        } else {
            console.log('Profile created:', profile);
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

simulateUserSignup().catch(console.error);
