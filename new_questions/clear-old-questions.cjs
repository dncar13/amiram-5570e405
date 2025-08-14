// clear-old-questions.cjs - Remove old smoke test questions
require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function clearOldSmokeTestQuestions() {
  console.log('🧹 Clearing old smoke test questions...');
  
  try {
    // First, get all listening_continuation questions to filter manually
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, metadata, type')
      .eq('type', 'listening_continuation');
    
    if (error) throw error;
    
    // Filter for smoketest questions
    const smokeTestQuestions = questions.filter(q => 
      q.metadata && q.metadata.listening_set === 'smoketest'
    );
    
    console.log(`Found ${smokeTestQuestions.length} smoke test questions to delete`);
    
    if (smokeTestQuestions.length > 0) {
      const idsToDelete = smokeTestQuestions.map(q => q.id);
      
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) throw deleteError;
      
      console.log(`✅ Deleted ${smokeTestQuestions.length} old smoke test questions`);
    } else {
      console.log('No old smoke test questions found');
    }
    
  } catch (error) {
    console.error('❌ Error clearing questions:', error.message);
    throw error;
  }
}

clearOldSmokeTestQuestions().catch(console.error);