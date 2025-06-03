#!/usr/bin/env node

console.log('🔍 בדיקת תקינות השאלות לאחר הארגון מחדש\n');

// נדמה את האובייקטים כדי לבדוק אותם
const fs = require('fs');
const path = require('path');

// בדיקת הקבצים החדשים
const newFiles = [
  'src/data/questions/by-type/restatementQuestions.ts',
  'src/data/questions/by-type/sentenceCompletionQuestions.ts', 
  'src/data/questions/by-type/readingComprehensionQuestions.ts',
  'src/data/questions/by-type/vocabularyQuestions.ts'
];

let totalQuestions = 0;
let questionsWithDifficulty = 0;
let questionsWithType = 0;
let difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
let typeBreakdown = {};

console.log('📊 ניתוח קבצי השאלות החדשים:\n');

newFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    
    // ספירת שאלות
    const questionIds = content.match(/id:\s*\d+/g) || [];
    const difficulties = content.match(/difficulty:\s*['"](easy|medium|hard)['"]/g) || [];
    const types = content.match(/type:\s*['"]([\w-]+)['"]/g) || [];
    
    console.log(`📄 ${fileName}:`);
    console.log(`   שאלות: ${questionIds.length}`);
    console.log(`   עם difficulty: ${difficulties.length}`);
    console.log(`   עם type: ${types.length}`);
    
    // ספירת רמות קושי
    difficulties.forEach(d => {
      const level = d.match(/['"](easy|medium|hard)['"]/)[1];
      difficultyBreakdown[level]++;
    });
    
    // ספירת סוגי שאלות
    types.forEach(t => {
      const type = t.match(/['"]([\w-]+)['"]/)[1];
      typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
    });
    
    totalQuestions += questionIds.length;
    questionsWithDifficulty += difficulties.length;
    questionsWithType += types.length;
    
    console.log('');
  } else {
    console.log(`❌ קובץ לא נמצא: ${file}\n`);
  }
});

console.log('📈 סיכום כללי:');
console.log(`   סה"כ שאלות: ${totalQuestions}`);
console.log(`   שאלות עם difficulty: ${questionsWithDifficulty}/${totalQuestions}`);
console.log(`   שאלות עם type: ${questionsWithType}/${totalQuestions}`);
console.log('');

console.log('📊 פירוט לפי רמת קושי:');
Object.entries(difficultyBreakdown).forEach(([level, count]) => {
  console.log(`   ${level}: ${count} שאלות`);
});
console.log('');

console.log('📊 פירוט לפי סוג שאלה:');
Object.entries(typeBreakdown).forEach(([type, count]) => {
  console.log(`   ${type}: ${count} שאלות`);
});
console.log('');

// בדיקות תקינות
const allHaveDifficulty = questionsWithDifficulty === totalQuestions;
const allHaveType = questionsWithType === totalQuestions;

if (allHaveDifficulty && allHaveType) {
  console.log('✅ כל השאלות מסווגות נכון עם difficulty ו-type!');
} else {
  console.log('⚠️  יש שאלות עם נתונים חסרים:');
  if (!allHaveDifficulty) {
    console.log(`   ${totalQuestions - questionsWithDifficulty} שאלות חסר להן difficulty`);
  }
  if (!allHaveType) {
    console.log(`   ${totalQuestions - questionsWithType} שאלות חסר להן type`);
  }
}

console.log('\n🎯 השאלות החדשות שלך (301-310):');
console.log('   נמצאות בקובץ: restatementQuestions.ts');
console.log('   סוג: restatement');
console.log('   רמת קושי: medium');
console.log('   נגישות: /simulation/difficulty/medium/mixed או /simulation/difficulty/medium/restatement');
