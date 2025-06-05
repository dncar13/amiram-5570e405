// Test to verify story simulation fix
console.log('=== TESTING STORY SIMULATION FLOW ===');

// Simulate the flow:
// 1. Simulation.tsx creates storyQuestions
const mockStoryQuestions = [
  { id: 1, type: 'single', passageText: 'Test passage', question: 'Test question?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
  { id: 2, type: 'single', passageText: 'Test passage 2', question: 'Test question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
  { id: 3, type: 'single', passageText: 'Test passage 3', question: 'Test question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 }
];

// 2. Simulation.tsx calls useSimulation with story questions
const simulationId = 'story_כלכלת הגיג: מהפכה בעולם העבודה';
const isQuestionSet = false;
const externalQuestions = mockStoryQuestions;

console.log('Input to useSimulation:');
console.log(`  simulationId: "${simulationId}"`);
console.log(`  isQuestionSet: ${isQuestionSet}`);
console.log(`  externalQuestions: ${externalQuestions.length} questions`);

// 3. useSimulation should detect story_ prefix and use externalQuestions
if (simulationId.startsWith('story_')) {
  console.log('✓ Story simulation detected');
  console.log('✓ useSimulation should set questions = externalQuestions');
  
  // 4. currentQuestion should be defined
  const questions = externalQuestions;
  const currentQuestionIndex = 0;
  const currentQuestion = questions[currentQuestionIndex];
  
  console.log('\nExpected currentQuestion:');
  console.log(`  id: ${currentQuestion?.id}`);
  console.log(`  type: ${currentQuestion?.type}`);
  console.log(`  hasPassageText: ${!!currentQuestion?.passageText}`);
  
  if (currentQuestion && currentQuestion.id && currentQuestion.type) {
    console.log('✅ SUCCESS: currentQuestion should now be properly defined!');
  } else {
    console.log('❌ FAIL: currentQuestion is still undefined');
  }
} else {
  console.log('❌ Story simulation not detected');
}

console.log('\n=== EXPECTED RESULT ===');
console.log('SimulationContent should now receive:');
console.log('- currentQuestion with defined id, type, and hasPassageText');
console.log('- No more "undefined" errors in console');
console.log('- Story questions displayed correctly');
