
import { Question } from '../../types/questionTypes';

// Import restatement questions from the questions-for-lovable directory
import easyQuestions from '../../../questions-for-lovable/restatement/easy/restatement-easy-2025-06-11';
import mediumQuestions from '../../../questions-for-lovable/restatement/medium/restatement-medium-2025-06-11';
import hardQuestions from '../../../questions-for-lovable/restatement/hard/restatement-hard-2025-06-11';

// Combine all restatement questions
export const restatementQuestionsNew: Question[] = [
  ...easyQuestions,
  ...mediumQuestions, 
  ...hardQuestions
];

console.log(`[Restatement] Loaded ${restatementQuestionsNew.length} restatement questions`);
console.log(`[Restatement] Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
