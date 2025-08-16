// create-spelling-mp3.js
// הפעלה: node create-spelling-mp3.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');

// נטען את המפתח ישירות מהקובץ JSON שלך
const keyFile = path.join(__dirname, 'amiram-463020-c7a69ce9848f.json');
const client = new textToSpeech.TextToSpeechClient({ keyFilename: keyFile });

// ====== רשימת המילים מקובץ הנתונים ======
const vocabData = require('./src/data/vocab-static.json');
const words = vocabData.words.map(w => w.word);

console.log(`🎯 יוצר קבצי MP3 עבור ${words.length} מילים...`);

// נתיב לשמירת הקבצים
const outputDir = path.join(__dirname, 'public', 'audio', 'spelling');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createMp3(word) {
  try {
    const request = {
      input: { text: word },
      voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const filePath = path.join(outputDir, `${word}.mp3`);
    fs.writeFileSync(filePath, response.audioContent, 'binary');
    console.log(`✅ נוצר קובץ: ${word}.mp3`);
  } catch (error) {
    console.error(`❌ שגיאה ביצירת MP3 עבור "${word}":`, error);
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log(`📁 תיקיית יעד: ${outputDir}`);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    console.log(`[${i + 1}/${words.length}] מעבד: ${word}`);
    await createMp3(word);
    
    // השהיה קצרה כדי לא לעומס את ה-API
    if (i < words.length - 1) {
      await delay(100);
    }
  }
  
  console.log("🎯 סיום יצירת כל קבצי ה-MP3");
  console.log(`📂 הקבצים נשמרו ב: ${outputDir}`);
})();
