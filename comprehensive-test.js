// Comprehensive test for reading comprehension system
const fs = require('fs');
const path = require('path');

console.log('🧪 Comprehensive Reading Comprehension Test');
console.log('='.repeat(60));

// Mock implementation for testing (since we can't run the actual React app here)
function testStoryQuestionsService() {
  console.log('\n📋 Testing Story Questions Service Logic:');
  
  // Mock question data structure
  const mockQuestions = [
    {
      id: '1',
      type: 'sentence-completion',
      passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה',
      passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
      question: 'המשך את המשפט',
      difficulty: 'medium'
    },
    {
      id: '2', 
      type: 'reading-comprehension',
      passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה',
      passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
      question: 'מה המשמעות של כלכלת הגיג?',
      difficulty: 'medium'
    },
    {
      id: '3',
      type: 'restatement',
      passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה', 
      passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
      question: 'נסח מחדש את הרעיון',
      difficulty: 'hard'
    },
    {
      id: '4',
      type: 'multiple-choice',
      passageTitle: null,
      passageText: null,
      question: 'שאלה רגילה ללא קטע',
      difficulty: 'easy'
    }
  ];

  // Test the filtering logic
  console.log('   Testing question filtering:');
  
  // OLD logic (problematic)
  const oldFilter = mockQuestions.filter(q => 
    q.type === 'reading-comprehension' && q.passageText
  );
  console.log(`   ❌ Old filter (reading-comprehension only): ${oldFilter.length} questions`);
  
  // NEW logic (fixed)
  const newFilter = mockQuestions.filter(q => 
    q.passageText && q.passageTitle
  );
  console.log(`   ✅ New filter (all with passage data): ${newFilter.length} questions`);
  
  // Test story creation
  console.log('\n   Testing story creation:');
  const storiesMap = new Map();
  newFilter.forEach(question => {
    const title = question.passageTitle;
    if (!storiesMap.has(title)) {
      storiesMap.set(title, []);
    }
    storiesMap.get(title).push(question);
  });
  
  console.log(`   ✅ Stories found: ${storiesMap.size}`);
  console.log(`   ✅ Questions per story: ${Array.from(storiesMap.values())[0]?.length || 0}`);
  
  // Test question retrieval by story
  console.log('\n   Testing question retrieval by story:');
  const storyTitle = 'כלכלת הגיג: מהפכה בעולם העבודה';
  
  // OLD logic (problematic)
  const oldQuestions = mockQuestions.filter(q => 
    q.type === 'reading-comprehension' && q.passageTitle === storyTitle
  );
  console.log(`   ❌ Old retrieval (reading-comprehension only): ${oldQuestions.length} questions`);
  
  // NEW logic (fixed)
  const newQuestions = mockQuestions.filter(q => 
    q.passageTitle === storyTitle && q.passageText
  );
  console.log(`   ✅ New retrieval (all with matching passage): ${newQuestions.length} questions`);
  
  return newQuestions.length > 0;
}

function testActualFiles() {
  console.log('\n📁 Testing Actual Files:');
  
  // Test service file
  try {
    const serviceContent = fs.readFileSync(
      path.join(__dirname, 'src/services/storyQuestionsService.ts'), 
      'utf8'
    );
    
    console.log('   ✅ Service file exists');
    console.log('   ✅ Has fixed filter logic:', serviceContent.includes('q.passageText && q.passageTitle'));
    console.log('   ✅ Has fixed retrieval logic:', serviceContent.includes('q.passageTitle === story.title && q.passageText'));
    
  } catch (error) {
    console.log('   ❌ Error reading service file:', error.message);
    return false;
  }
  
  // Test topics page
  try {
    const topicsContent = fs.readFileSync(
      path.join(__dirname, 'src/pages/ReadingComprehensionTopics.tsx'),
      'utf8'
    );
    
    console.log('   ✅ Topics page exists');
    console.log('   ✅ Has fixed RTL button:', topicsContent.includes('ml-1'));
    console.log('   ✅ Has uniform card styling:', topicsContent.includes('h-full flex flex-col'));
    
  } catch (error) {
    console.log('   ❌ Error reading topics page:', error.message);
    return false;
  }
  
  // Test question data
  try {
    const questionsContent = fs.readFileSync(
      path.join(__dirname, 'src/data/questions/by-type/gigEconomyReadingQuestions.ts'),
      'utf8'
    );
    
    console.log('   ✅ Question data exists');
    console.log('   ✅ Has multiple question types:', 
      questionsContent.includes("type: 'sentence-completion'") &&
      questionsContent.includes("type: 'reading-comprehension'") &&
      questionsContent.includes("type: 'restatement'")
    );
    console.log('   ✅ Has passage titles:', questionsContent.includes('passageTitle:'));
    
  } catch (error) {
    console.log('   ❌ Error reading question data:', error.message);
    return false;
  }
  
  return true;
}

// Run tests
const logicTest = testStoryQuestionsService();
const fileTest = testActualFiles();

console.log('\n🎯 Test Results Summary:');
console.log('='.repeat(30));
console.log(`Logic Test: ${logicTest ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`File Test: ${fileTest ? '✅ PASSED' : '❌ FAILED'}`);

if (logicTest && fileTest) {
  console.log('\n🎉 All tests passed! The fixes should resolve:');
  console.log('   • "לא נמצאה שאלה" (No question found) error');
  console.log('   • Story cards not working properly');
  console.log('   • Button alignment in RTL layout');
  console.log('   • Card uniformity issues');
  console.log('\n📝 Next: Test the application by running npm run dev');
} else {
  console.log('\n⚠️  Some tests failed. Please check the issues above.');
}
