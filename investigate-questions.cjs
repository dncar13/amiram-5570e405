const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function investigateQuestions() {
  console.log('🔍 בודק תקינות השאלות...\n');
  
  try {
    // קח כמה דוגמאות מכל סוג
    const types = ['restatement', 'reading-comprehension', 'sentence-completion'];
    
    for (const type of types) {
      console.log(`\n📋 דוגמאות מ-${type}:`);
      
      const { data: sample, error } = await supabase
        .from('questions')
        .select('id, question_text, answer_options, correct_answer')
        .eq('type', type)
        .limit(3);
      
      if (error) throw error;
      
      sample.forEach((q, i) => {
        console.log(`\n${i + 1}. ID: ${q.id.substring(0, 8)}...`);
        console.log(`   Question: ${q.question_text.substring(0, 100)}...`);
        console.log(`   Answer Options Type: ${typeof q.answer_options}`);
        console.log(`   Answer Options: ${JSON.stringify(q.answer_options)}`);
        console.log(`   Correct Answer: ${q.correct_answer} (type: ${typeof q.correct_answer})`);
      });
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  }
}

investigateQuestions();
