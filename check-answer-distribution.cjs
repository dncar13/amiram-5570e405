const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAnswerDistribution() {
  console.log('🔍 בודק התפלגות תשובות נכונות...\n');
  
  try {
    // בדיקה כללית
    const { data: overall } = await supabase
      .from('questions')
      .select('correct_answer');
    
    if (!overall) {
      console.log('❌ לא נמצאו שאלות');
      return;
    }
    
    console.log('📊 התפלגות כללית:');
    const overallDist = {};
    overall.forEach(q => {
      const answer = q.correct_answer;
      overallDist[answer] = (overallDist[answer] || 0) + 1;
    });
    
    Object.keys(overallDist).sort().forEach(answer => {
      const count = overallDist[answer];
      const percentage = ((count / overall.length) * 100).toFixed(2);
      const letter = ['A', 'B', 'C', 'D'][parseInt(answer)] || answer;
      console.log(`   ${letter} (${answer}): ${count} שאלות (${percentage}%)`);
    });
    
    console.log(`\nסה"כ: ${overall.length} שאלות\n`);
    
    // בדיקה לפי סוג ורמה
    const { data: detailed } = await supabase
      .from('questions')
      .select('type, difficulty, correct_answer');
    
    if (detailed) {
      console.log('📋 התפלגות לפי סוג ורמה:');
      
      const groups = {};
      detailed.forEach(q => {
        const key = `${q.type}_${q.difficulty}`;
        if (!groups[key]) groups[key] = {};
        groups[key][q.correct_answer] = (groups[key][q.correct_answer] || 0) + 1;
      });
      
      Object.keys(groups).sort().forEach(groupKey => {
        const [type, difficulty] = groupKey.split('_');
        const dist = groups[groupKey];
        const total = Object.values(dist).reduce((a, b) => a + b, 0);
        
        console.log(`\n🎯 ${type} - ${difficulty} (${total} שאלות):`);
        
        ['0', '1', '2', '3'].forEach(answer => {
          const count = dist[answer] || 0;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : '0.00';
          const letter = ['A', 'B', 'C', 'D'][parseInt(answer)];
          
          // זיהוי הטיה
          const bias = percentage > 35 ? ' ⚠️ הטיה גבוהה!' : percentage > 30 ? ' ⚡ הטיה קלה' : '';
          console.log(`     ${letter}: ${count} (${percentage}%)${bias}`);
        });
      });
    }
    
    // זיהוי הטיות קריטיות
    console.log('\n🚨 הטיות קריטיות (מעל 35%):');
    let foundBias = false;
    
    if (detailed) {
      const groups = {};
      detailed.forEach(q => {
        const key = `${q.type}_${q.difficulty}`;
        if (!groups[key]) groups[key] = {};
        groups[key][q.correct_answer] = (groups[key][q.correct_answer] || 0) + 1;
      });
      
      Object.keys(groups).forEach(groupKey => {
        const [type, difficulty] = groupKey.split('_');
        const dist = groups[groupKey];
        const total = Object.values(dist).reduce((a, b) => a + b, 0);
        
        ['0', '1', '2', '3'].forEach(answer => {
          const count = dist[answer] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          if (percentage > 35) {
            const letter = ['A', 'B', 'C', 'D'][parseInt(answer)];
            console.log(`   ${type} ${difficulty}: ${letter} (${percentage.toFixed(2)}%) - ${count}/${total} שאלות`);
            foundBias = true;
          }
        });
      });
    }
    
    if (!foundBias) {
      console.log('   ✅ לא נמצאו הטיות קריטיות');
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  }
}

checkAnswerDistribution();
