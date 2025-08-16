// create-dummy-audio.cjs
// יוצר קבצי דמה לבדיקה

const fs = require('fs');
const path = require('path');

// ====== רשימת המילים מקובץ הנתונים ======
const vocabData = require('./src/data/vocab-static.json');
const words = vocabData.words.map(w => w.word);

console.log(`🎯 יוצר קבצי אודיו דמה עבור ${words.length} מילים...`);

// נתיב לשמירת הקבצים
const outputDir = path.join(__dirname, 'public', 'audio', 'spelling');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createDummyMp3(word) {
  try {
    // יוצר קובץ דמה פשוט
    const dummyContent = Buffer.from(`Audio for ${word} (dummy file)`, 'utf8');
    const filePath = path.join(outputDir, `${word}.mp3`);
    fs.writeFileSync(filePath, dummyContent);
    console.log(`🎭 נוצר קובץ דמה: ${word}.mp3`);
  } catch (error) {
    console.error(`❌ שגיאה ביצירת קובץ עבור "${word}":`, error);
  }
}

console.log(`📁 תיקיית יעד: ${outputDir}`);

for (let i = 0; i < words.length; i++) {
  const word = words[i];
  console.log(`[${i + 1}/${words.length}] מעבד: ${word}`);
  createDummyMp3(word);
}

console.log("🎯 סיום יצירת כל קבצי האודיו הדמה");
console.log(`📂 הקבצים נשמרו ב: ${outputDir}`);
console.log("💡 לשימוש אמיתי: הגדר Google Cloud credentials והפעל create-spelling-mp3.cjs");
