const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableSchema() {
  console.log('🔍 Checking questions table schema...');
  
  try {
    // Get table structure
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error fetching questions:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('\n📋 Available columns in questions table:');
      const columns = Object.keys(data[0]);
      columns.forEach(col => {
        console.log(`   • ${col}: ${typeof data[0][col]}`);
      });
      
      console.log('\n📄 Sample question data:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️ No data found in questions table');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkTableSchema();
