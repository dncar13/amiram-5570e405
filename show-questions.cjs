// show-questions.cjs - Display generated questions without saving to database
require('dotenv').config();
const { 
  generateWordFormationQuestions,
  generateGrammarInContextQuestions,
  generateListeningComprehensionQuestions,
  generateListeningContinuationQuestions
} = require('./multi-question-generator.cjs');

async function showQuestions() {
  console.log('🎯 Generated Questions Preview\n');
  console.log('='.repeat(60));
  
  // Word Formation Questions
  console.log('\n📚 WORD FORMATION QUESTIONS (10 questions)');
  console.log('='.repeat(60));
  const wfQuestions = generateWordFormationQuestions();
  
  wfQuestions.forEach((q, index) => {
    console.log(`\n${index + 1}. ${q.sentence}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
    console.log(`   ✅ Correct: ${q.options[q.correctAnswer]} (${q.correctAnswer + 1})`);
    console.log(`   💡 Explanation: ${q.explanationHe}`);
    console.log(`   📋 Target: ${q.posTarget} (${q.lemma})`);
    console.log(`   🏷️ Difficulty: ${q.difficulty}`);
  });
  
  // Grammar in Context Questions
  console.log('\n\n📚 GRAMMAR IN CONTEXT QUESTIONS (10 questions)');
  console.log('='.repeat(60));
  const gcQuestions = generateGrammarInContextQuestions();
  
  gcQuestions.forEach((q, index) => {
    console.log(`\n${index + 1}. ${q.text}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
    console.log(`   ✅ Correct: ${q.options[q.correctAnswer]} (${q.correctAnswer + 1})`);
    console.log(`   💡 Explanation: ${q.explanationHe}`);
    console.log(`   📖 Rule: ${q.grammarRule}`);
    console.log(`   📚 Examples: ${q.examplesEn.join(' / ')}`);
    console.log(`   🏷️ Difficulty: ${q.difficulty}`);
  });
  
  // Listening Comprehension Questions
  console.log('\n\n📚 LISTENING COMPREHENSION QUESTIONS (3 passages)');
  console.log('='.repeat(60));
  const lcQuestions = generateListeningComprehensionQuestions();
  
  lcQuestions.forEach((q, index) => {
    console.log(`\n${index + 1}. Audio Script (${q.durationTargetSec}s):`);
    console.log(`   "${q.audioScript}"`);
    console.log(`   📊 Topic: ${q.metadata.topic} | Level: ${q.metadata.level}`);
    
    q.questions.forEach((subQ, subIndex) => {
      console.log(`\n   Question ${subIndex + 1}: ${subQ.q}`);
      console.log(`   Options: ${subQ.options.join(' | ')}`);
      console.log(`   ✅ Correct: ${subQ.options[subQ.correctAnswer]} (${subQ.correctAnswer + 1})`);
      console.log(`   💡 Explanation: ${subQ.explanationHe}`);
    });
  });
  
  // Listening Continuation Questions
  console.log('\n\n📚 LISTENING CONTINUATION QUESTIONS (4 questions)');
  console.log('='.repeat(60));
  const contQuestions = generateListeningContinuationQuestions();
  
  contQuestions.forEach((q, index) => {
    console.log(`\n${index + 1}. ${q.text}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
    console.log(`   ✅ Correct: ${q.options[q.correctAnswer]} (${q.correctAnswer + 1})`);
    console.log(`   💡 Explanation: ${q.explanationHe}`);
    console.log(`   🏷️ Difficulty: ${q.difficulty}`);
  });
  
  // Summary
  console.log('\n\n📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`📝 Total Questions Generated: ${wfQuestions.length + gcQuestions.length + lcQuestions.length + contQuestions.length}`);
  console.log(`   • Word Formation: ${wfQuestions.length}`);
  console.log(`   • Grammar in Context: ${gcQuestions.length}`);
  console.log(`   • Listening Comprehension: ${lcQuestions.length} passages with ${lcQuestions.reduce((sum, q) => sum + q.questions.length, 0)} sub-questions`);
  console.log(`   • Listening Continuation: ${contQuestions.length}`);
  
  console.log('\n🎉 All questions generated successfully!');
  console.log('💡 To save to database, first run the SQL migration in Supabase SQL Editor');
  console.log('📄 Then use: node multi-question-generator.cjs --types=wf,gc,lc,cont');
}

if (require.main === module) {
  showQuestions().catch(console.error);
}

module.exports = { showQuestions };
