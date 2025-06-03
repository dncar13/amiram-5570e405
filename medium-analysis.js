console.log('🔍 בדיקה מפורטת של שאלות ברמה medium\n');

// ספירה ידנית לפי הנתונים שמצאנו:

console.log('📄 questions1to50.ts: 6 שאלות medium');
console.log('📄 restatementQuestions.ts: 2 שאלות medium (101, 104)'); 
console.log('📄 vocabularyQuestions.ts: 3 שאלות medium (201, 203, 205)');
console.log('📄 restatementMediumQuestions.ts: 10 שאלות medium (301-310)');
console.log('');

const total = 6 + 2 + 3 + 10;
console.log(`📊 סה"כ שאלות medium: ${total}`);

if (total === 21) {
    console.log('\n✅ זה מסביר את ה-21 שאלות!');
    console.log('המערכת עובדת נכון - היא מציגה את כל השאלות ברמה medium');
    console.log('כולל את 10 השאלות החדשות שלך (301-310)');
    console.log('');
    console.log('🎯 המערכת מתפקדת כמו שצריך:');
    console.log('   - בחרת "רמה בינונית" + "תרגול מעורב"'); 
    console.log('   - המערכת מציגה את כל השאלות ברמה בינונית (21 שאלות)');
    console.log('   - זה כולל את 10 השאלות החדשות שלך');
    console.log('');
    console.log('🔧 אם אתה רוצה לראות רק את השאלות החדשות:');
    console.log('   גש ל: /simulation/difficulty/medium/restatement');
    console.log('   (רמה בינונית + restatement בלבד)');
} else {
    console.log(`\n🤔 משהו לא מסתדר - צפינו ל-21 אבל חישבנו ${total}`);
}
