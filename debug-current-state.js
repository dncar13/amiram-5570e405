// Quick debug script to test current state
const fs = require('fs');
const path = require('path');

console.log('🔍 Debug: Current State Analysis');
console.log('='.repeat(50));

// Test the story questions service
try {
  const serviceContent = fs.readFileSync(path.join(__dirname, 'src/services/storyQuestionsService.ts'), 'utf8');
  
  console.log('\n📋 Story Questions Service Analysis:');
  console.log('Has passageTitle && passageText filter:', serviceContent.includes('passageText && passageTitle'));
  console.log('Has old reading-comprehension filter:', serviceContent.includes("q.type === 'reading-comprehension' && q.passageText"));
  
  // Check the fix for getQuestionsByStory
  console.log('Has correct getQuestionsByStory filter:', serviceContent.includes('q.passageTitle === story.title && q.passageText'));
  console.log('Has old getQuestionsByStory filter:', serviceContent.includes("q.type === 'reading-comprehension' && q.passageTitle === story.title"));
  
} catch (error) {
  console.error('Error reading storyQuestionsService.ts:', error.message);
}

// Test the topics page
try {
  const topicsContent = fs.readFileSync(path.join(__dirname, 'src/pages/ReadingComprehensionTopics.tsx'), 'utf8');
  
  console.log('\n📋 Topics Page Analysis:');
  console.log('Has ml-1 (correct RTL):', topicsContent.includes('ml-1'));
  console.log('Has mr-1 (incorrect RTL):', topicsContent.includes('mr-1'));
  
} catch (error) {
  console.error('Error reading ReadingComprehensionTopics.tsx:', error.message);
}

// Test data structure
try {
  const questionsContent = fs.readFileSync(path.join(__dirname, 'src/data/questions/by-type/gigEconomyReadingQuestions.ts'), 'utf8');
  
  console.log('\n📋 Gig Economy Questions Analysis:');
  console.log('Has sentence-completion type:', questionsContent.includes("type: 'sentence-completion'"));
  console.log('Has reading-comprehension type:', questionsContent.includes("type: 'reading-comprehension'"));
  console.log('Has restatement type:', questionsContent.includes("type: 'restatement'"));
  console.log('Has passageTitle:', questionsContent.includes('passageTitle:'));
  
} catch (error) {
  console.error('Error reading gigEconomyReadingQuestions.ts:', error.message);
}

console.log('\n🎯 Summary: All fixes should be in place if no "false" values appear above');
