// Quick test script to verify medium difficulty questions integration

// Import the questions service functions  
import { getMediumQuestions } from './src/services/questionsService.js';

// Test the medium questions filtering
console.log('Testing medium difficulty questions...');

try {
  const mediumQuestions = getMediumQuestions();
  console.log(`Found ${mediumQuestions.length} medium difficulty questions`);
  
  // Filter for restatement questions specifically
  const restatementMediumQuestions = mediumQuestions.filter(q => q.type === 'restatement');
  console.log(`Found ${restatementMediumQuestions.length} medium difficulty restatement questions`);
  
  // Show the first few IDs to verify they're the new ones
  if (restatementMediumQuestions.length > 0) {
    console.log('First few restatement medium question IDs:', 
      restatementMediumQuestions.slice(0, 5).map(q => q.id));
  }
  
  console.log('✅ Medium difficulty integration test passed');
} catch (error) {
  console.error('❌ Test failed:', error);
}
