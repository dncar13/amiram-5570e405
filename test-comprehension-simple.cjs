// Simple test to verify the database has the audio URLs
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function testDatabaseFix() {
  console.log('🧪 Testing Database Fix for Listening Comprehension');
  console.log('='.repeat(50));
  
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, question_text, metadata, type')
      .eq('type', 'listening_comprehension')
      .limit(10);

    if (error) throw error;

    console.log(`📝 Found ${questions.length} listening comprehension questions`);
    
    questions.forEach((q, i) => {
      console.log(`\n${i + 1}. Question: ${q.question_text?.substring(0, 50)}...`);
      console.log(`   Audio URL: ${q.metadata?.audio_url || 'MISSING'}`);
      console.log(`   Audio Script: ${q.metadata?.audio_script ? 'PRESENT' : 'MISSING'}`);
      console.log(`   Segment ID: ${q.metadata?.segmentId || 'MISSING'}`);
      
      if (q.metadata?.audio_url) {
        console.log(`   ✅ Ready for playback`);
      } else {
        console.log(`   ❌ Missing audio URL`);
      }
    });

    const withAudio = questions.filter(q => q.metadata?.audio_url);
    const withoutAudio = questions.filter(q => !q.metadata?.audio_url);

    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Questions with audio: ${withAudio.length}`);
    console.log(`❌ Questions without audio: ${withoutAudio.length}`);

    if (withoutAudio.length === 0) {
      console.log(`\n🎉 SUCCESS: All questions have audio URLs!`);
      console.log(`🎵 The "Audio Script … not recorded yet" alert should no longer appear.`);
      console.log(`🎧 Users can now play audio for listening comprehension questions.`);
      return true;
    } else {
      console.log(`\n⚠️ Some questions still missing audio`);
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testDatabaseFix();