// Check email logs for recent activity
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmailLogs() {
  console.log('📧 Checking recent email logs...');
  
  try {
    // Check recent welcome emails
    const { data: welcomeEmails, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_type', 'welcome')
      .order('sent_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching email logs:', error);
      return;
    }

    console.log('\n🎉 Recent welcome emails sent:');
    if (welcomeEmails.length === 0) {
      console.log('❌ No welcome emails found in logs');
    } else {
      welcomeEmails.forEach((email, index) => {
        console.log(`${index + 1}. ${email.recipient_email} - ${email.status} - ${email.sent_at}`);
      });
    }

    // Check all email types from today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayEmails } = await supabase
      .from('email_logs')
      .select('*')
      .gte('sent_at', today)
      .order('sent_at', { ascending: false });

    console.log(`\n📅 All emails sent today (${today}):`);
    if (todayEmails && todayEmails.length > 0) {
      todayEmails.forEach((email, index) => {
        console.log(`${index + 1}. [${email.email_type}] ${email.recipient_email} - ${email.status}`);
      });
    } else {
      console.log('❌ No emails sent today');
    }

  } catch (error) {
    console.error('❌ Failed to check email logs:', error);
  }
}

checkEmailLogs();
