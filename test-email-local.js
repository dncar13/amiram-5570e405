// Simple test script to test email functionality locally
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:8081';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailService() {
  console.log('🧪 Testing email service...');
  
  try {
    const { data, error } = await supabase.functions.invoke('email-service', {
      body: {
        type: 'welcome',
        to: 'dncar13@gmail.com',
        firstName: 'דניאל'
      }
    });

    if (error) {
      console.error('❌ Error calling email service:', error);
    } else {
      console.log('✅ Email service response:', data);
    }
  } catch (error) {
    console.error('❌ Failed to call email service:', error);
  }
}

// Run the test
testEmailService();
