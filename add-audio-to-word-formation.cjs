require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
const ttsClient = new TextToSpeechClient();

async function addAudioToWordFormation() {
  console.log('🎤 מוסיף אודיו לשאלות Word Formation עם הפסקות...');
  
  // קבלת 3 שאלות ראשונות לבדיקה
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('type', 'sentence-completion')
    .is('audio_url', null)
    .limit(3);
    
  console.log(`📝 נמצאו ${questions.length} שאלות ללא אודיו`);
  
  for (const question of questions) {
    try {
      console.log(`\n🔊 מעבד: ${question.id}`);
      console.log(`📝 שאלה מקורית: ${question.question_text}`);
      
      // חילוץ המשפט מתוך השאלה
      let audioText = question.question_text;
      
      // ניקוי הטקסט - הסרת הוראות והשארת רק המשפט
      audioText = audioText
        .replace(/Complete.*?:/g, '') // הסרת Complete:
        .replace(/Choose.*?:/g, '') // הסרת Choose:
        .replace(/Fill.*?:/g, '') // הסרת Fill:
        .replace(/^.*?['"](.*)['"].*$/g, '$1') // חילוץ המשפט מתוך ציטוטים
        .trim();
      
      // החלפת קווים תחתונים בהפסקות SSML
      audioText = audioText.replace(/_+/g, '<break time="1.5s"/>');
      
      console.log(`🎧 טקסט לאודיו: ${audioText}`);
      
      // יצירת SSML מלא
      const ssmlText = `<speak>${audioText}</speak>`;
      
      // יצירת אודיו עם SSML
      const request = {
        input: { ssml: ssmlText },
        voice: { languageCode: 'en-US', name: 'en-US-Standard-A' },
        audioConfig: { audioEncoding: 'MP3' },
      };
      
      const [response] = await ttsClient.synthesizeSpeech(request);
      
      // שמירה ב-Storage
      const filename = `word_formation_${question.id}_${Date.now()}.mp3`;
      const storagePath = `word-formation/${filename}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(storagePath, response.audioContent, {
          contentType: 'audio/mpeg'
        });
        
      if (uploadError) {
        console.error(`❌ שגיאה בהעלאה: ${uploadError.message}`);
        continue;
      }
      
      // קבלת URL ציבורי
      const { data: urlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(storagePath);
        
      // עדכון מסד הנתונים
      const { error: updateError } = await supabase
        .from('questions')
        .update({ audio_url: urlData.publicUrl })
        .eq('id', question.id);
        
      if (updateError) {
        console.error(`❌ שגיאה בעדכון: ${updateError.message}`);
        continue;
      }
      
      console.log(`✅ ${question.id}: אודיו נוצר עם הפסקות!`);
      console.log(`🔗 URL: ${urlData.publicUrl}`);
      
    } catch (error) {
      console.error(`❌ שגיאה עבור ${question.id}:`, error.message);
    }
  }
  
  console.log('\n🎉 סיימתי להוסיף אודיו עם הפסקות!');
}

addAudioToWordFormation();
