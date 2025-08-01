import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function testQuery() {
  console.log('🔍 Testing database query...');
  
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, type, difficulty, batch_id, metadata')
    .eq('batch_id', 'batch_test_sample_12345')
    .limit(5);
  
  if (error) {
    console.error('❌ Query error:', error);
  } else {
    console.log('✅ Successfully queried database!');
    console.log(`📊 Found ${data.length} questions:`);
    data.forEach(q => {
      console.log(`  - ${q.metadata.custom_id}: ${q.question_text.substring(0, 50)}...`);
    });
  }
}

testQuery();