const { createClient } = require('@supabase/supabase-js');

// Read the migration file and execute it directly
const fs = require('fs');
const path = require('path');

async function executeMigration() {
    console.log('Loading environment...');
    
    // Load environment variables
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTcxNjU3MSwiZXhwIjoyMDM3MjkyNTcxfQ.o2rjx4LdjmSQoU_uGiB_KmOx2JB1LiQOT6TLOEYBi5Q';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, 'supabase/migrations/20250807104558_fix_email_logs_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration...');
    
    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
        
        if (error) {
            console.error('Migration failed:', error);
            return;
        }
        
        console.log('Migration executed successfully!');
        console.log('Result:', data);
        
        // Test the email_logs table
        console.log('\nTesting email_logs table...');
        const { data: logs, error: logsError } = await supabase
            .from('email_logs')
            .select('*')
            .limit(5);
            
        if (logsError) {
            console.error('Error querying email_logs:', logsError);
        } else {
            console.log('Email logs count:', logs.length);
            console.log('Latest logs:', logs);
        }
        
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Alternative: Execute SQL directly
async function executeDirectSQL() {
    console.log('Executing SQL directly...');
    
    const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTcxNjU3MSwiZXhwIjoyMDM3MjkyNTcxfQ.o2rjx4LdjmSQoU_uGiB_KmOx2JB1LiQOT6TLOEYBi5Q';
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // First, check if email_logs table exists
    const { data: tables, error: tableError } = await supabase
        .rpc('exec_sql', { 
            sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs';`
        });
    
    if (tableError) {
        console.error('Error checking tables:', tableError);
        return;
    }
    
    console.log('Table check result:', tables);
    
    // Create the email_logs table if it doesn't exist
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.email_logs (
            id BIGSERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            email_address TEXT NOT NULL,
            email_type TEXT NOT NULL,
            subject TEXT,
            template_used TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            error_message TEXT,
            sent_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Service role can access email_logs" ON public.email_logs;
        CREATE POLICY "Service role can access email_logs" ON public.email_logs
            FOR ALL USING (auth.role() = 'service_role');
    `;
    
    const { data: createResult, error: createError } = await supabase
        .rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
        console.error('Error creating table:', createError);
        return;
    }
    
    console.log('Table creation result:', createResult);
    
    // Test inserting a log entry
    console.log('Testing email_logs insertion...');
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
        console.error('Error inserting test log:', insertError);
    } else {
        console.log('Test log inserted successfully:', insertData);
    }
}

// Run both functions
executeDirectSQL().catch(console.error);
