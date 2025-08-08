const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://llyunioulzfbgqvmeaxq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjcxMTMsImV4cCI6MjA0ODc0MzExM30.3mhPHWYQkpjmT9P5WGSMtIq0MDbmhGN9hR8kDGdCKwc'
);

async function testEmailServiceSimple() {
  console.log('🧪 Testing email-service-simple function...');
  
  try {
    const { data, error } = await supabase.functions.invoke('email-service-simple', {
      body: {
        type: 'welcome',
        to: 'amiram.academy@gmail.com',
        firstName: 'בדיקה מהפונקציה החדשה'
      },
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjcxMTMsImV4cCI6MjA0ODc0MzExM30.3mhPHWYQkpjmT9P5WGSMtIq0MDbmhGN9hR8kDGdCKwc'
      }
    });
    
    if (error) {
      console.error('❌ Error from function:', error);
    } else {
      console.log('✅ Function response:', data);
    }
    
  } catch (error) {
    console.error('❌ Network/JS error:', error);
  }
}

testEmailServiceSimple();
