const { classifySubject } = require('./src/services/subjectClassificationService.ts');
const { getFilteredStories, getAvailableSubjects } = require('./src/services/storyQuestionsService.ts');

// Test subject classification
console.log('Testing subject classification...');

// Test sample texts
const testTexts = [
  {
    title: "כלכלת השוק",
    text: "השוק החופשי מבוסס על עקרונות של היצע וביקוש",
    expected: "economics"
  },
  {
    title: "טכנולוגיה מתקדמת",
    text: "בינה מלאכותית ורובוטיקה משנים את העולם",
    expected: "technology"
  },
  {
    title: "בריאות הציבור",
    text: "מערכת הבריאות והרפואה המודרנית",
    expected: "health"
  }
];

testTexts.forEach(test => {
  const result = classifySubject(test.text, test.title);
  console.log(`Text: "${test.title}"`);
  console.log(`Expected: ${test.expected}, Got: ${result}`);
  console.log(`✓ ${result === test.expected ? 'PASS' : 'FAIL'}`);
  console.log('---');
});

// Test story filtering
console.log('\nTesting story filtering...');
const allStories = getFilteredStories('all', 'all');
console.log(`Total stories: ${allStories.length}`);

const easyStories = getFilteredStories('easy', 'all');
console.log(`Easy stories: ${easyStories.length}`);

const availableSubjects = getAvailableSubjects();
console.log(`Available subjects: ${availableSubjects.join(', ')}`);

console.log('\nSubject classification test completed!');
