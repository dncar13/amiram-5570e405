const { createClient } = require('@supabase/supabase-js');

async function testEmailFunctionFixed() {
    console.log('Testing email function with correct parameters...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
        console.log('Sending email with correct parameters...');
        const { data, error } = await supabase.functions.invoke('email-service', {
            body: {
                to: 'danielpogod@gmail.com',
                type: 'welcome',
                firstName: 'דניאל',
                userId: 'test-user-id-123'
            }
        });
        
        if (error) {
            console.error('Email function error:', error);
        } else {
            console.log('Email function success:', data);
        }
        
        // Check email logs after function call
        console.log('\nChecking email_logs after function call...');
        const { data: logsAfter, error: logsAfterError } = await supabase
            .from('email_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
        
        if (logsAfterError) {
            console.error('Error querying email_logs:', logsAfterError);
        } else {
            console.log('Latest email logs:', logsAfter);
        }
        
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testEmailFunctionFixed().catch(console.error);
