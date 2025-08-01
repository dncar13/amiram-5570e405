// Quick test to verify the fix works
// This can be run in the browser console when the admin panel is loaded

async function testQuestionsFix() {
  try {
    console.log('Testing questions fix...');
    
    // Test the database service function
    const { getAllQuestions } = await import('./src/services/questionsService.js');
    const questions = await getAllQuestions();
    
    console.log(`✅ Successfully loaded ${questions.length} questions from database`);
    console.log(`Premium questions: ${questions.filter(q => q.is_premium).length}`);
    console.log(`Free questions: ${questions.filter(q => !q.is_premium).length}`);
    
    if (questions.length > 1000) {
      console.log('🎉 SUCCESS: The fix worked! We now have more than 1,000 questions.');
    } else {
      console.log('⚠️ WARNING: Still showing 1,000 or fewer questions.');
    }
    
    return questions;
  } catch (error) {
    console.error('❌ Error testing questions fix:', error);
  }
}

// Export for testing
window.testQuestionsFix = testQuestionsFix;