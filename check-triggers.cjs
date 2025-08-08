const { createClient } = require('@supabase/supabase-js');

async function checkUserTriggers() {
    console.log('Checking user registration triggers...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Check recent users to see if any were created recently
    console.log('Checking recent user registrations...');
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (usersError) {
        console.error('Error querying profiles:', usersError);
    } else {
        console.log('Recent user profiles:', users);
    }
    
    // Check if there are any email logs for recent users
    console.log('\nChecking email logs for recent activity...');
    const { data: emailLogs, error: emailError } = await supabase
        .from('email_logs')
        .select('*')
        .eq('email_type', 'welcome')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (emailError) {
        console.error('Error querying email logs:', emailError);
    } else {
        console.log('Recent welcome email logs:', emailLogs);
    }
    
    // Let's create a test trigger manually
    console.log('\nTesting manual trigger simulation...');
    
    // Simulate what happens when a user registers
    const testUser = {
        id: 'test-user-' + Date.now(),
        email: 'test-trigger@example.com',
        firstName: 'Test User'
    };
    
    console.log('Simulating user registration for:', testUser.email);
    
    const { data: triggerResult, error: triggerError } = await supabase.functions.invoke('email-service', {
        body: {
            to: testUser.email,
            type: 'welcome',
            firstName: testUser.firstName,
            userId: testUser.id
        }
    });
    
    if (triggerError) {
        console.error('Manual trigger failed:', triggerError);
    } else {
        console.log('Manual trigger success:', triggerResult);
    }
    
    // Check if the manual email was logged
    setTimeout(async () => {
        console.log('\nChecking if manual email was logged...');
        const { data: newLogs, error: newLogsError } = await supabase
            .from('email_logs')
            .select('*')
            .eq('recipient_email', testUser.email)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (newLogsError) {
            console.error('Error checking new logs:', newLogsError);
        } else {
            console.log('New email log:', newLogs);
        }
    }, 2000);
}

checkUserTriggers().catch(console.error);
