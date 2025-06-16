// בדיקה מהירה של השאלות
const fs = require('fs');
const path = require('path');

console.log('🔍 בודק את קבצי השאלות...\n');

// בדיקת קבצי restatement
const restatementFiles = [
  './questions-for-lovable/restatement/easy/restatement-easy-2025-06-11.ts',
  './questions-for-lovable/restatement/medium/restatement-medium-2025-06-11.ts',
  './questions-for-lovable/restatement/hard/restatement-hard-2025-06-11.ts'
];

console.log('📁 קבצי Restatement:');
restatementFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const questionMatches = content.match(/{\s*"type":/g);
    const questionCount = questionMatches ? questionMatches.length : 0;
    console.log(`✅ ${file}: ${questionCount} שאלות`);
  } else {
    console.log(`❌ ${file}: קובץ לא קיים`);
  }
});

// בדיקת קבצי sentence completion
const sentenceFiles = [
  './questions-for-lovable/sentence-completion/easy/sentence-completion-easy-2025-06-11.ts',
  './questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11.ts',
  './questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11.ts'
];

console.log('\n📁 קבצי Sentence Completion:');
sentenceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const questionMatches = content.match(/{\s*"type":/g);
    const questionCount = questionMatches ? questionMatches.length : 0;
    console.log(`✅ ${file}: ${questionCount} שאלות`);
  } else {
    console.log(`❌ ${file}: קובץ לא קיים`);
  }
});

// בדיקת קבצי vocabulary
const vocabFiles = [
  './questions-for-lovable/vocabulary/easy/vocabulary-easy-2025-06-11.ts',
  './questions-for-lovable/vocabulary/medium/vocabulary-medium-2025-06-11.ts',
  './questions-for-lovable/vocabulary/hard/vocabulary-hard-2025-06-11.ts'
];

console.log('\n📁 קבצי Vocabulary:');
vocabFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const questionMatches = content.match(/{\s*"type":/g);
    const questionCount = questionMatches ? questionMatches.length : 0;
    console.log(`✅ ${file}: ${questionCount} שאלות`);
  } else {
    console.log(`❌ ${file}: קובץ לא קיים`);
  }
});

console.log('\n🔍 בודק את קבצי הייבוא...');

// בדיקת קבצי הייבוא
const importFiles = [
  './src/data/questions/by-type/restatementQuestionsNew.ts',
  './src/data/questions/by-type/sentenceCompletionQuestions.ts',
  './src/data/questions/by-type/vocabularyQuestions.ts'
];

importFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}: קיים`);
  } else {
    console.log(`❌ ${file}: לא קיים`);
  }
});
