// Debug database triggers and recent user registrations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.bfqP7jPQPZ7MYP3AThL8xJ8HqhOkj5Q5J5jQy6w4Wl0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugUserRegistration() {
  console.log('🔍 Debugging user registration and email triggers...\n');
  
  try {
    // Check recent user registrations (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentUsers, error: usersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 10
    });
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    console.log('👥 Recent users in auth.users:');
    if (recentUsers.users.length === 0) {
      console.log('❌ No users found');
    } else {
      recentUsers.users.slice(0, 5).forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - Created: ${user.created_at} - Confirmed: ${user.email_confirmed_at || 'NOT CONFIRMED'}`);
      });
    }
    
    console.log('\n📧 Checking if any emails were sent for these users...');
    
    // Check email logs for these users
    const userEmails = recentUsers.users.slice(0, 5).map(u => u.email);
    
    for (const email of userEmails) {
      const { data: emailLogs } = await supabase
        .from('email_logs')
        .select('*')
        .eq('recipient_email', email)
        .order('sent_at', { ascending: false });
        
      if (emailLogs && emailLogs.length > 0) {
        console.log(`✅ ${email}: ${emailLogs.length} emails found`);
        emailLogs.forEach(log => {
          console.log(`   - ${log.email_type}: ${log.status} at ${log.sent_at}`);
        });
      } else {
        console.log(`❌ ${email}: No emails found in logs`);
      }
    }
    
    // Test the trigger manually
    console.log('\n🧪 Testing welcome email trigger manually...');
    
    const testResult = await supabase.functions.invoke('email-service', {
      body: {
        type: 'welcome',
        to: 'test-trigger@example.com',
        firstName: 'בדיקת טריגר'
      }
    });
    
    console.log('Manual trigger test result:', testResult);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugUserRegistration();
