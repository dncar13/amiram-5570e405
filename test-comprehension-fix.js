// Test script to verify the listening comprehension fix
import { getQuestionsByType } from './src/services/questionsService.js';

async function testComprehensionFix() {
  console.log('🧪 Testing Listening Comprehension Fix');
  console.log('='.repeat(40));
  
  try {
    // Test fetching listening comprehension questions
    console.log('📝 Fetching listening_comprehension questions...');
    const questions = await getQuestionsByType('listening_comprehension', 5);
    
    console.log(`✅ Found ${questions.length} questions`);
    
    questions.forEach((q, i) => {
      console.log(`\n${i + 1}. Question ID: ${q.id}`);
      console.log(`   Text: ${q.question_text?.substring(0, 60)}...`);
      console.log(`   Audio URL (direct): ${q.audio_url || 'MISSING'}`);
      console.log(`   Audio URL (metadata): ${q.metadata?.audio_url || 'MISSING'}`);
      console.log(`   Audio Script: ${q.metadata?.audio_script ? 'PRESENT' : 'MISSING'}`);
      
      if (q.metadata?.audio_url) {
        console.log(`   ✅ Has audio URL in metadata`);
      } else if (q.audio_url) {
        console.log(`   ✅ Has direct audio URL`);
      } else {
        console.log(`   ❌ NO AUDIO URL FOUND`);
      }
    });
    
    const withAudio = questions.filter(q => q.audio_url || q.metadata?.audio_url);
    const withoutAudio = questions.filter(q => !q.audio_url && !q.metadata?.audio_url);
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Questions with audio: ${withAudio.length}`);
    console.log(`❌ Questions without audio: ${withoutAudio.length}`);
    
    if (withoutAudio.length === 0) {
      console.log(`\n🎉 SUCCESS: All questions have audio URLs!`);
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

testComprehensionFix();