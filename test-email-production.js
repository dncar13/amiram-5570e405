// Test script to test production email functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProductionEmailService() {
  console.log('🧪 Testing production email service...');
  
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
      
      // Try to get the error response body
      if (error.context && error.context.body) {
        try {
          const errorBody = await error.context.text();
          console.log('Error body:', errorBody);
        } catch (e) {
          console.log('Could not read error body');
        }
      }
    } else {
      console.log('✅ Email service response:', data);
    }
  } catch (error) {
    console.error('❌ Failed to call email service:', error);
  }
}

// Run the test
testProductionEmailService();
