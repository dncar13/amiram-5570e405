// סקריפט לספירת שאלות לפי רמת קושי
const fs = require('fs');
const path = require('path');

console.log('🔍 ספירת שאלות לפי רמת קושי\n');

const questionFiles = [
  'src/data/questions/questions1to50.ts',
  'src/data/questions/restatementQuestions.ts', 
  'src/data/questions/vocabularyQuestions.ts',
  'src/data/questions/restatementMediumQuestions.ts'
];

let totalMediumQuestions = 0;
let totalAllQuestions = 0;

questionFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // ספירת כל השאלות
    const allQuestions = (content.match(/id:\s*\d+/g) || []).length;
    
    // ספירת שאלות medium
    const mediumQuestions = (content.match(/difficulty:\s*['"](medium)['"][^}]*}/gms) || []).length;
    
    console.log(`📄 ${path.basename(file)}:`);
    console.log(`   כל השאלות: ${allQuestions}`);
    console.log(`   שאלות medium: ${mediumQuestions}`);
    console.log('');
    
    totalMediumQuestions += mediumQuestions;
    totalAllQuestions += allQuestions;
  } else {
    console.log(`❌ קובץ לא נמצא: ${file}`);
  }
});

console.log('📊 סיכום:');
console.log(`   סה"כ שאלות במערכת: ${totalAllQuestions}`);
console.log(`   סה"כ שאלות ברמה medium: ${totalMediumQuestions}`);
console.log(`   השאלות החדשות שלך: 10 (IDs 301-310)`);

if (totalMediumQuestions === 21) {
  console.log('\n✅ זה מסביר למה יש 21 שאלות ברמה medium!');
  console.log('המערכת מציגה את כל השאלות ברמה medium, לא רק את השאלות החדשות שלך.');
} else {
  console.log(`\n🤔 צפינו ל-21 שאלות medium אבל מצאנו ${totalMediumQuestions}`);
}
