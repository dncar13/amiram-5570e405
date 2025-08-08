const { createClient } = require('@supabase/supabase-js');

async function testEmailLogsTable() {
    console.log('Testing email_logs table...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Check if email_logs table exists by trying to query it
    console.log('Checking if email_logs table exists...');
    const { data: logs, error: logsError } = await supabase
        .from('email_logs')
        .select('*')
        .limit(1);
    
    if (logsError) {
        console.error('email_logs table does not exist or is not accessible:', logsError);
        
        // Try to create it manually using a simple approach
        console.log('Attempting to create email_logs table...');
        
        // Insert a test record to trigger table creation (if auto-creation is enabled)
        const { data: insertData, error: insertError } = await supabase
            .from('email_logs')
            .insert({
                email_address: 'test@example.com',
                email_type: 'welcome',
                subject: 'ברוכים הבאים לאמירם!',
                status: 'pending'
            })
            .select();
        
        if (insertError) {
            console.error('Cannot create/insert into email_logs:', insertError);
        } else {
            console.log('Successfully inserted test record:', insertData);
        }
    } else {
        console.log('email_logs table exists! Found', logs.length, 'records');
        console.log('Sample records:', logs);
    }
    
    // Test the edge function directly
    console.log('\nTesting email service function directly...');
    
    const { data: functionData, error: functionError } = await supabase.functions.invoke('email-service', {
        body: {
            to: 'danielpogod@gmail.com',
            type: 'welcome',
            userId: 'test-user-id',
            userName: 'Test User'
        }
    });
    
    if (functionError) {
        console.error('Email function error:', functionError);
    } else {
        console.log('Email function response:', functionData);
    }
    
    // Check email logs again after function call
    console.log('\nChecking email_logs after function call...');
    const { data: logsAfter, error: logsAfterError } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (logsAfterError) {
        console.error('Error querying email_logs after function call:', logsAfterError);
    } else {
        console.log('Latest email logs:', logsAfter);
    }
}

testEmailLogsTable().catch(console.error);
