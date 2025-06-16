// Script to check questions count and types
const fs = require('fs');
const path = require('path');

// Count questions in restatement files
function countQuestionsInFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    console.log(`Checking file: ${fullPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = content.match(/"type":\s*"[^"]+"/g);
    return matches ? matches.length : 0;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return 0;
  }
}

// Check all restatement files
const restatementEasy = 'questions-for-lovable/restatement/easy/restatement-easy-2025-06-11.ts';
const restatementMedium = 'questions-for-lovable/restatement/medium/restatement-medium-2025-06-11.ts';
const restatementHard = 'questions-for-lovable/restatement/hard/restatement-hard-2025-06-11.ts';

console.log('=== RESTATEMENT QUESTIONS COUNT ===');
console.log(`Easy: ${countQuestionsInFile(restatementEasy)}`);
console.log(`Medium: ${countQuestionsInFile(restatementMedium)}`);
console.log(`Hard: ${countQuestionsInFile(restatementHard)}`);

// Check question types in easy file
console.log('\n=== QUESTION TYPES IN EASY FILE ===');
try {
  const fullPath = path.join(__dirname, restatementEasy);
  const content = fs.readFileSync(fullPath, 'utf8');
  const restatementMatches = content.match(/"type":\s*"restatement"/g);
  const sentenceCompletionMatches = content.match(/"type":\s*"sentence-completion"/g);
  
  console.log(`Restatement questions: ${restatementMatches ? restatementMatches.length : 0}`);
  console.log(`Sentence completion questions: ${sentenceCompletionMatches ? sentenceCompletionMatches.length : 0}`);
} catch (error) {
  console.error('Error checking question types:', error.message);
}
