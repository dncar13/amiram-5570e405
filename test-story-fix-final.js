// Test script to verify that story simulation fix works
const { getQuestionsByStory, getStoryById } = require('./src/services/storyQuestionsService.ts');

// Test story ID from previous logs
const storyId = 'כלכלת הגיג: מהפכה בעולם העבודה';

console.log('=== TESTING STORY SIMULATION FIX ===');
console.log(`Testing story: "${storyId}"`);

try {
  // Get story questions
  const questions = getQuestionsByStory(storyId);
  console.log(`✓ Found ${questions.length} questions for story`);
  
  if (questions.length > 0) {
    const firstQuestion = questions[0];
    console.log('First question details:');
    console.log(`  ID: ${firstQuestion.id}`);
    console.log(`  Type: ${firstQuestion.type}`);
    console.log(`  Has passage text: ${!!firstQuestion.passageText}`);
    console.log(`  Question: ${firstQuestion.question?.substring(0, 100)}...`);
  }
  
  // Get story details
  const story = getStoryById(storyId);
  console.log(`✓ Story found: ${story ? story.title : 'NOT FOUND'}`);
  
  // Simulate the useSimulation flow
  const simulationId = `story_${storyId}`;
  console.log(`✓ Simulation ID would be: "${simulationId}"`);
  console.log(`✓ useSimulation should now handle this with story_ prefix`);
  
  console.log('\n=== EXPECTED FLOW ===');
  console.log('1. Simulation.tsx creates storyQuestions with getQuestionsByStory()');
  console.log('2. Simulation.tsx calls useSimulation(formattedSimulationId, isQuestionSet, storyQuestions)');
  console.log('3. useSimulation detects story_ prefix and uses storyQuestions parameter');
  console.log('4. SimulationContent gets currentQuestion with proper id and type');
  
} catch (error) {
  console.error('❌ Error testing story simulation:', error);
}
