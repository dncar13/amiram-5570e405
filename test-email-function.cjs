const { createClient } = require('@supabase/supabase-js');

async function testEmailFunction() {
    console.log('Testing email function with detailed error handling...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
        const { data, error } = await supabase.functions.invoke('email-service', {
            body: {
                to: 'danielpogod@gmail.com',
                type: 'welcome',
                userId: 'test-user-id',
                userName: 'Test User'
            }
        });
        
        if (error) {
            console.error('Email function error:', error);
            
            // Try to get the response body for more details
            if (error.context && error.context.body) {
                try {
                    const reader = error.context.body.getReader();
                    const result = await reader.read();
                    const text = new TextDecoder().decode(result.value);
                    console.log('Error response body:', text);
                } catch (readError) {
                    console.log('Could not read error response body:', readError);
                }
            }
        } else {
            console.log('Email function success:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testEmailFunction().catch(console.error);
