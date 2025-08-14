const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkTableSchema() {
  console.log('🔍 בודק מבנה טבלת questions...\n');
  
  try {
    // קח דוגמה אחת לראות את השדות
    const { data: sample, error } = await supabase
      .from('questions')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    if (!sample || sample.length === 0) {
      console.log('❌ לא נמצאו שאלות');
      return;
    }
    
    console.log('📋 שדות בטבלה:');
    Object.keys(sample[0]).forEach(key => {
      console.log(`   - ${key}: ${typeof sample[0][key]}`);
    });
    
    console.log('\n📝 דוגמה לשאלה:');
    const q = sample[0];
    console.log(`ID: ${q.id}`);
    console.log(`Type: ${q.type}`);
    console.log(`Difficulty: ${q.difficulty}`);
    console.log(`Correct Answer: ${q.correct_answer}`);
    console.log(`Answer Options: ${q.answer_options ? JSON.stringify(q.answer_options).substring(0, 100) + '...' : 'N/A'}`);
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  }
}

checkTableSchema();
