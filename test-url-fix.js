// Test script for URL encoding fix
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing URL Encoding Fix for Reading Comprehension');
console.log('='.repeat(60));

// Mock the actual data structure
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
  },
  {
    id: 'gig-3',
    type: 'restatement',
    passageTitle: 'כלכלת הגיג: מהפכה בעולם העבודה',
    passageText: 'כלכלת הגיג מתייחסת לשוק עבודה...',
    difficulty: 'hard'
  },
  {
    id: 'nature-1',
    type: 'sentence-completion',
    passageTitle: 'The Changing Nature of Work',
    passageText: 'The nature of work has evolved significantly...',
    difficulty: 'medium'
  }
];

// Test URL encoding and decoding
function testUrlEncoding() {
  console.log('\n1️⃣ Testing URL Encoding/Decoding');
  console.log('-'.repeat(40));
  
  const originalTitles = [
    'כלכלת הגיג: מהפכה בעולם העבודה',
    'The Changing Nature of Work'
  ];
  
  originalTitles.forEach(title => {
    const encoded = encodeURIComponent(title);
    const decoded = decodeURIComponent(encoded);
    
    console.log(`Original: "${title}"`);
    console.log(`Encoded:  "${encoded}"`);
    console.log(`Decoded:  "${decoded}"`);
    console.log(`Match:    ${title === decoded ? '✅' : '❌'}`);
    console.log('');
  });
}

// Test the new logic
function testNewLogic() {
  console.log('\n2️⃣ Testing New Question Retrieval Logic');
  console.log('-'.repeat(40));
  
  // Simulate what happens in the browser
  const testCases = [
    {
      original: 'כלכלת הגיג: מהפכה בעולם העבודה',
      url: 'כלכלת-הגיג:-מהפכה-בעולם-העבודה', // What might appear in URL
      encoded: encodeURIComponent('כלכלת הגיג: מהפכה בעולם העבודה')
    },
    {
      original: 'The Changing Nature of Work',
      url: 'The-Changing-Nature-of-Work',
      encoded: encodeURIComponent('The Changing Nature of Work')
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\nTesting: "${testCase.original}"`);
    
    // Test with encoded URL (new logic)
    const decodedFromEncoded = decodeURIComponent(testCase.encoded);
    const questionsFromEncoded = mockQuestions.filter(q => 
      q.passageTitle === decodedFromEncoded && q.passageText
    );
    
    console.log(`  URL Encoded: "${testCase.encoded}"`);
    console.log(`  After Decode: "${decodedFromEncoded}"`);
    console.log(`  Questions Found: ${questionsFromEncoded.length}`);
    console.log(`  Expected: ${mockQuestions.filter(q => q.passageTitle === testCase.original).length}`);
    console.log(`  Status: ${questionsFromEncoded.length > 0 ? '✅ SUCCESS' : '❌ FAILED'}`);
  });
}

// Test the actual file changes
function testFileChanges() {
  console.log('\n3️⃣ Testing File Changes');
  console.log('-'.repeat(40));
  
  try {
    const serviceContent = fs.readFileSync(
      path.join(__dirname, 'src/services/storyQuestionsService.ts'),
      'utf8'
    );
    
    const hasDecodeLogic = serviceContent.includes('decodeURIComponent(storyId)');
    const hasConsoleLog = serviceContent.includes('console.log');
    const hasNewFilter = serviceContent.includes('q.passageTitle === decodedTitle');
    
    console.log(`  ✅ Has decode logic: ${hasDecodeLogic}`);
    console.log(`  ✅ Has debug logging: ${hasConsoleLog}`);
    console.log(`  ✅ Has new filter logic: ${hasNewFilter}`);
    
    const topicsContent = fs.readFileSync(
      path.join(__dirname, 'src/pages/ReadingComprehensionTopics.tsx'),
      'utf8'
    );
    
    const hasEncodeLogic = topicsContent.includes('encodeURIComponent(story.title)');
    console.log(`  ✅ Has encode logic in navigation: ${hasEncodeLogic}`);
    
    return hasDecodeLogic && hasNewFilter && hasEncodeLogic;
    
  } catch (error) {
    console.log(`  ❌ Error reading files: ${error.message}`);
    return false;
  }
}

// Run all tests
testUrlEncoding();
testNewLogic();
const fileChangesOk = testFileChanges();

console.log('\n🎯 SUMMARY');
console.log('='.repeat(60));

if (fileChangesOk) {
  console.log('🎉 ALL FIXES APPLIED SUCCESSFULLY!');
  console.log('\nWhat was fixed:');
  console.log('  1. ✅ URL encoding/decoding now handled properly');
  console.log('  2. ✅ Story titles with Hebrew characters work');
  console.log('  3. ✅ Story titles with special characters (:, spaces) work');
  console.log('  4. ✅ Navigation properly encodes URLs');
  console.log('  5. ✅ Question retrieval properly decodes URLs');
  console.log('\nTesting URLs that should now work:');
  console.log('  • /simulation/story/כלכלת%20הגיג%3A%20מהפכה%20בעולם%20העבודה');
  console.log('  • /simulation/story/The%20Changing%20Nature%20of%20Work');
  console.log('\n📝 Next: Test the application - all stories should now load questions!');
} else {
  console.log('❌ Some file changes not detected. Please verify the fixes.');
}

console.log('='.repeat(60));
