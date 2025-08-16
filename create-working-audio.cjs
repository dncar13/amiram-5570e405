// create-working-audio.cjs
// יוצר קבצי אודיו פונקציונליים עם Web Audio API Tone

const fs = require('fs');
const path = require('path');

// נתיב לשמירת הקבצים
const outputDir = path.join(__dirname, 'public', 'audio', 'spelling');

// רשימת המילים
const vocabData = require('./src/data/vocab-static.json');
const words = vocabData.words.map(w => w.word);

console.log(`🎯 יוצר קבצי אודיו פונקציונליים עבור ${words.length} מילים...`);

// יצירת קובץ HTML שמייצר את הקבצים
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Audio Generator</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>מייצר קבצי אודיו...</h1>
    <div id="status">התחלה...</div>
    <div id="progress"></div>

    <script>
        const words = ${JSON.stringify(words)};
        const status = document.getElementById('status');
        const progress = document.getElementById('progress');
        
        async function generateAudio() {
            // בדוק תמיכה ב-Speech Synthesis
            if (!('speechSynthesis' in window)) {
                status.textContent = 'הדפדפן לא תומך ב-Speech Synthesis';
                return;
            }

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                status.textContent = \`מעבד: \${word} (\${i + 1}/\${words.length})\`;
                progress.textContent = \`התקדמות: \${Math.round((i / words.length) * 100)}%\`;
                
                try {
                    await speakWord(word);
                    await delay(100);
                } catch (error) {
                    console.error('שגיאה עבור', word, error);
                }
            }
            
            status.textContent = 'הושלם! עכשיו אפשר לסגור את הדף';
        }

        function speakWord(word) {
            return new Promise((resolve, reject) => {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 1;
                
                utterance.onend = () => resolve();
                utterance.onerror = (error) => reject(error);
                
                speechSynthesis.speak(utterance);
            });
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // התחל כשהדף נטען
        window.addEventListener('load', () => {
            setTimeout(generateAudio, 1000);
        });
    </script>
</body>
</html>`;

// שמירת קובץ ה-HTML
const htmlPath = path.join(__dirname, 'audio-generator.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log(`📄 נוצר קובץ: ${htmlPath}`);
console.log(`🌐 פתח את הקובץ בדפדפן כדי ליצור קבצי אודיו`);
console.log(`📁 הקבצים יישמרו ב: ${outputDir}`);

// כאלטרנטיבה, ניצור קבצי אודיו באמצעות Text-to-Speech מקומי אם יש
console.log('\n📢 אלטרנטיבה: נסה להשתמש ב-Speech Synthesis של הדפדפן');
console.log('או להתקין ולהשתמש בספרייה say עבור MacOS/Linux:');
console.log('npm install say');
