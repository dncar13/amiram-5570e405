// Check database triggers and functions
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseState() {
  console.log('🔍 Checking database triggers and functions...\n');
  
  try {
    // Check if email_logs table exists and what data it has
    const { data: emailLogs, error: logsError } = await supabase
      .from('email_logs')
      .select('email_type, status, recipient_email, sent_at')
      .order('sent_at', { ascending: false })
      .limit(20);
    
    if (logsError) {
      console.error('❌ Error accessing email_logs:', logsError);
    } else {
      console.log('📊 Email logs table status:');
      if (emailLogs.length === 0) {
        console.log('❌ email_logs table is empty - no emails have been logged');
      } else {
        console.log(`✅ Found ${emailLogs.length} email log entries:`);
        emailLogs.forEach((log, index) => {
          console.log(`${index + 1}. [${log.email_type}] ${log.recipient_email} - ${log.status} - ${log.sent_at}`);
        });
      }
    }
    
    console.log('\n🧪 Testing email service directly...');
    
    // Test email service with different email to avoid "already sent" issue
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: emailResult, error: emailError } = await supabase.functions.invoke('email-service', {
      body: {
        type: 'welcome',
        to: testEmail,
        firstName: 'בדיקה ישירה'
      }
    });
    
    if (emailError) {
      console.error('❌ Email service error:', emailError);
    } else {
      console.log('✅ Email service response:', emailResult);
    }
    
    // Check if this email was logged
    setTimeout(async () => {
      const { data: newLogs } = await supabase
        .from('email_logs')
        .select('*')
        .eq('recipient_email', testEmail);
      
      console.log(`\n📝 Log entry for ${testEmail}:`, newLogs);
    }, 2000);
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkDatabaseState();
