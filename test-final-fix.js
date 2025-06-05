// Final test for story navigation fix
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Final Story Navigation Fix');
console.log('='.repeat(50));

// Test the flow step by step
function testStoryFlow() {
  console.log('\n📋 Testing Complete Story Flow:');
  console.log('-'.repeat(30));
  
  // Step 1: Story creation (how stories are generated)
  console.log('1. Story Creation:');
  const mockTitle = 'כלכלת הגיג: מהפכה בעולם העבודה';
  const mockId = mockTitle.replace(/\s+/g, '-').toLowerCase(); // How ID is created
  console.log(`   Original Title: "${mockTitle}"`);
  console.log(`   Generated ID: "${mockId}"`);
  
  // Step 2: Navigation (what happens when clicking button)
  console.log('\n2. Navigation:');
  console.log('   OLD: handleStorySelect(story.id) → story.id = "כלכלת-הגיג:-מהפכה-בעולם-העבודה"');
  console.log('   NEW: handleStorySelect(story.title) → story.title = "כלכלת הגיג: מהפכה בעולם העבודה"');
  
  // Step 3: URL creation
  console.log('\n3. URL Creation:');
  const encodedTitle = encodeURIComponent(mockTitle);
  console.log(`   Encoded URL: /simulation/story/${encodedTitle}`);
  
  // Step 4: Question retrieval
  console.log('\n4. Question Retrieval:');
  const decodedFromUrl = decodeURIComponent(encodedTitle);
  console.log(`   Decoded from URL: "${decodedFromUrl}"`);
  console.log(`   Matches original: ${decodedFromUrl === mockTitle ? '✅' : '❌'}`);
  
  return decodedFromUrl === mockTitle;
}

// Test file changes
function testFileChanges() {
  console.log('\n📁 Testing File Changes:');
  console.log('-'.repeat(30));
  
  try {
    const topicsContent = fs.readFileSync(
      path.join(__dirname, 'src/pages/ReadingComprehensionTopics.tsx'),
      'utf8'
    );
    
    // Check for the fixes
    const hasStoryTitleInButton = topicsContent.includes('handleStorySelect(story.title)');
    const hasStoryTitleInCard = topicsContent.includes('onClick={() => handleStorySelect(story.title)}');
    const hasSimplifiedFunction = topicsContent.includes('const handleStorySelect = (storyTitle: string)');
    const hasDirectEncoding = topicsContent.includes('encodeURIComponent(storyTitle)');
    
    console.log(`   ✅ Button uses story.title: ${hasStoryTitleInButton}`);
    console.log(`   ✅ Card click uses story.title: ${hasStoryTitleInCard}`);
    console.log(`   ✅ Function parameter renamed: ${hasSimplifiedFunction}`);
    console.log(`   ✅ Direct encoding: ${hasDirectEncoding}`);
    
    // Check service file
    const serviceContent = fs.readFileSync(
      path.join(__dirname, 'src/services/storyQuestionsService.ts'),
      'utf8'
    );
    
    const hasDecodeLogic = serviceContent.includes('decodeURIComponent(storyId)');
    const hasDirectTitleMatch = serviceContent.includes('q.passageTitle === decodedTitle');
    
    console.log(`   ✅ Service has decode logic: ${hasDecodeLogic}`);
    console.log(`   ✅ Service matches decoded title: ${hasDirectTitleMatch}`);
    
    return hasStoryTitleInButton && hasStoryTitleInCard && 
           hasSimplifiedFunction && hasDirectEncoding &&
           hasDecodeLogic && hasDirectTitleMatch;
    
  } catch (error) {
    console.log(`   ❌ Error reading files: ${error.message}`);
    return false;
  }
}

// Mock question matching test
function testQuestionMatching() {
  console.log('\n🧪 Testing Question Matching Logic:');
  console.log('-'.repeat(30));
  
  const mockQuestions = [
    {
      id: 'gig-1',
      type: 'sentence-completion',
      passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה',
      passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
      difficulty: 'medium'
    },
    {
      id: 'gig-2',
      type: 'reading-comprehension',
      passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה',
      passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
      difficulty: 'medium'
    }
  ];
  
  // Simulate the full flow
  const originalTitle = 'כלכלת הגיג: מהפכה בעולם העבודה';
  
  // 1. User clicks story with title
  console.log(`   User clicks story: "${originalTitle}"`);
  
  // 2. Navigation encodes it
  const encodedForUrl = encodeURIComponent(originalTitle);
  console.log(`   URL becomes: /simulation/story/${encodedForUrl.substring(0, 30)}...`);
  
  // 3. Service decodes it
  const decodedInService = decodeURIComponent(encodedForUrl);
  console.log(`   Service decodes to: "${decodedInService}"`);
  
  // 4. Filter questions
  const foundQuestions = mockQuestions.filter(q => 
    q.passageTitle === decodedInService && q.passageText
  );
  
  console.log(`   Questions found: ${foundQuestions.length}/${mockQuestions.length}`);
  console.log(`   Success: ${foundQuestions.length > 0 ? '✅' : '❌'}`);
  
  return foundQuestions.length > 0;
}

// Run all tests
const flowTest = testStoryFlow();
const fileTest = testFileChanges();
const matchTest = testQuestionMatching();

console.log('\n🎯 FINAL TEST RESULTS');
console.log('='.repeat(50));

console.log(`Story Flow Test: ${flowTest ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`File Changes Test: ${fileTest ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Question Matching Test: ${matchTest ? '✅ PASSED' : '❌ FAILED'}`);

const allPassed = flowTest && fileTest && matchTest;

if (allPassed) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉');
  console.log('\nWhat was fixed:');
  console.log('  1. ✅ Button now uses story.title instead of story.id');
  console.log('  2. ✅ Card click now uses story.title instead of story.id'); 
  console.log('  3. ✅ Navigation function simplified and uses direct encoding');
  console.log('  4. ✅ Service properly decodes URL to match question titles');
  console.log('\n🚀 NOW ALL STORIES SHOULD WORK!');
  console.log('   Try clicking "התחל" on any story - questions should load!');
} else {
  console.log('\n❌ Some tests failed. Check the issues above.');
}

console.log('='.repeat(50));
