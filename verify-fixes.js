// Simple verification script for our story fixes
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Reading Comprehension Fixes');
console.log('='.repeat(50));

// Check if our fixes are in place
const filesToCheck = [
  {
    path: 'src/services/storyQuestionsService.ts',
    description: 'Story Questions Service',
    fixes: [
      'q.passageText && q.passageTitle', // Fixed filter criteria
      'q.passageTitle === story.title && q.passageText' // Fixed question retrieval
    ]
  },
  {
    path: 'src/pages/ReadingComprehensionTopics.tsx',
    description: 'Reading Comprehension Topics Page',
    fixes: [
      'ml-1' // Fixed RTL button spacing
    ]
  },
  {
    path: 'src/data/questions/by-type/gigEconomyReadingQuestions.ts',
    description: 'Gig Economy Questions',
    fixes: [
      'passageTitle: "כלכלת הגיג: מהפכה בעולם העבודה"', // Has correct title
      'type: \'sentence-completion\'', // Has multiple question types
      'type: \'reading-comprehension\'',
      'type: \'restatement\''
    ]
  }
];

let allGood = true;

filesToCheck.forEach(file => {
  console.log(`\n📁 Checking ${file.description}:`);
  const fullPath = path.join(__dirname, file.path);
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    file.fixes.forEach(fix => {
      if (content.includes(fix)) {
        console.log(`   ✅ Found: ${fix}`);
      } else {
        console.log(`   ❌ Missing: ${fix}`);
        allGood = false;
      }
    });
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All fixes verified successfully!');
  console.log('✅ The reading comprehension system should now work correctly:');
  console.log('   • Story cards should be clickable');
  console.log('   • "התחל" button should be properly aligned');
  console.log('   • Gig economy story should load questions correctly');
} else {
  console.log('⚠️  Some fixes may be missing. Please review the output above.');
}
console.log('='.repeat(50));
