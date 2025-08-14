// generate-demo-audio.cjs - Generate audio files for demo questions
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Demo questions with audio scripts
const demoAudioScripts = [
  {
    stable_id: 'demo_lc_01',
    type: 'listening_comprehension',
    audio_script: "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting. Mike suggests they could go together since he's been wanting to try the new coffee stand there. They agree to meet at 9 AM at the market entrance."
  },
  {
    stable_id: 'demo_lc_02', 
    type: 'listening_comprehension',
    audio_script: "Good morning, class. Today we'll discuss the importance of sleep for academic performance. Recent studies show that students who get at least eight hours of sleep perform significantly better on exams than those who sleep less. The brain uses sleep time to consolidate memories and process information from the day. During deep sleep, neural connections are strengthened, making it easier to recall information later."
  }
];

// Simple TTS function using browser-compatible approach
function generateSimpleAudioFile(text, filename) {
  const audioDir = path.join(__dirname, 'public', 'audioFiles', 'listening-comprehension');
  
  // Ensure directory exists
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
  
  const filePath = path.join(audioDir, filename);
  
  // For now, create a placeholder text file indicating the audio script
  // In a real implementation, this would use Google Cloud TTS
  const placeholder = `Audio placeholder for: ${filename}
Text to speech: "${text}"

To implement: Use text-to-speech.cjs with Google Cloud credentials`;
  
  fs.writeFileSync(filePath.replace('.mp3', '.txt'), placeholder);
  console.log(`📝 Created placeholder for ${filename}`);
  
  return `/audioFiles/listening-comprehension/${filename}`;
}

async function main() {
  console.log('🎵 Generating demo audio files...');
  
  // Initialize Supabase
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  );
  
  for (const demo of demoAudioScripts) {
    const filename = `${demo.stable_id}.mp3`;
    const audioUrl = generateSimpleAudioFile(demo.audio_script, filename);
    
    // Update database with audio_url
    try {
      const { error } = await supabase
        .from('listening_questions')
        .update({ audio_url: audioUrl })
        .eq('stable_id', demo.stable_id);
      
      if (error) {
        console.error(`❌ Error updating ${demo.stable_id}:`, error.message);
      } else {
        console.log(`✅ Updated ${demo.stable_id} with audio_url: ${audioUrl}`);
      }
    } catch (err) {
      console.error(`❌ Error updating database for ${demo.stable_id}:`, err.message);
    }
  }
  
  console.log('\n🎯 Demo audio generation complete!');
  console.log('📋 Next steps:');
  console.log('1. Set up Google Cloud credentials to generate real audio files');
  console.log('2. Run text-to-speech.cjs to convert placeholders to actual MP3s');
  console.log('3. Audio files will be available at /audioFiles/listening-comprehension/');
}

main().catch(console.error);
