import { getReadingQuestions } from '../src/services/supabaseQuestionsService.js';

async function testService() {
  console.log('🧪 Testing getReadingQuestions() service...\n');
  
  try {
    const questions = await getReadingQuestions();
    console.log(`✅ Total questions returned: ${questions.length}`);
    
    // Group by passage title to count unique stories
    const storyGroups = questions.reduce((acc: any, question) => {
      const title = question.passageTitle || 'Unknown';
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(question);
      return acc;
    }, {});
    
    console.log(`📚 Unique stories found: ${Object.keys(storyGroups).length}\n`);
    
    console.log('📋 Stories list:');
    Object.entries(storyGroups).forEach(([title, questions]: [string, any], i) => {
      const difficulty = questions[0]?.difficulty || 'unknown';
      console.log(`   ${i + 1}. "${title}" (${difficulty}) - ${questions.length} questions`);
    });
    
    console.log(`\n🎯 SUCCESS: Service now returns ${Object.keys(storyGroups).length} unique stories!`);
    
  } catch (error) {
    console.error('❌ Service test failed:', error);
  }
}

testService().catch(console.error);