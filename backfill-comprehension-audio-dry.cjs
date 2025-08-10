#!/usr/bin/env node
// Dry run version to see what questions need audio generation
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

function segmentIdFromScript(script) {
  return 'lec_' + crypto.createHash('md5').update(script.trim()).digest('hex').slice(0, 12);
}

async function analyzeComprehensionQuestions() {
  console.log('🔍 Analyzing listening comprehension questions...');
  
  try {
    const { data: rows, error } = await supabase
      .from('questions')
      .select('id, question_text, metadata, type')
      .eq('type', 'listening_comprehension');

    if (error) throw error;

    console.log(`📝 Found ${rows.length} listening comprehension questions total`);
    
    // Find questions with audioScript but no audioUrl
    const missing = (rows || []).filter(r => {
      const audioScript = r.metadata && r.metadata.audio_script;
      const audioUrl = r.metadata && r.metadata.audio_url;
      return audioScript && !audioUrl;
    });

    const hasAudio = (rows || []).filter(r => {
      const audioUrl = r.metadata && r.metadata.audio_url;
      return audioUrl;
    });

    console.log(`✅ Questions with audio: ${hasAudio.length}`);
    console.log(`❌ Questions missing audio: ${missing.length}`);

    if (!missing.length) {
      console.log('✅ No missing comprehension audio found.');
      return;
    }

    console.log('\n📋 Questions missing audio:');
    console.log('='.repeat(50));

    // Group by audioScript to show what will be synthesized
    const scriptGroups = new Map();
    for (const row of missing) {
      const script = row.metadata.audio_script.trim();
      const segmentId = segmentIdFromScript(script);
      
      if (!scriptGroups.has(segmentId)) {
        scriptGroups.set(segmentId, {
          segmentId,
          script,
          questions: []
        });
      }
      scriptGroups.get(segmentId).questions.push(row);
    }

    console.log(`🎯 Would process ${scriptGroups.size} unique audio segments:`);
    
    let segmentNum = 1;
    for (const [segmentId, group] of scriptGroups) {
      console.log(`\n${segmentNum}. Segment: ${segmentId}`);
      console.log(`   Questions: ${group.questions.length}`);
      console.log(`   Script: "${group.script.substring(0, 100)}${group.script.length > 100 ? '...' : ''}"`);
      console.log(`   Would create: /audioFiles/comprehension/${segmentId}.mp3`);
      
      group.questions.forEach((q, i) => {
        console.log(`   - Q${i+1}: "${q.question_text.substring(0, 60)}${q.question_text.length > 60 ? '...' : ''}"`);
      });
      
      segmentNum++;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`📝 Total questions: ${rows.length}`);
    console.log(`✅ Already have audio: ${hasAudio.length}`);
    console.log(`❌ Missing audio: ${missing.length}`);
    console.log(`🎵 Unique segments to synthesize: ${scriptGroups.size}`);
    
    return {
      total: rows.length,
      withAudio: hasAudio.length,
      missingAudio: missing.length,
      uniqueSegments: scriptGroups.size,
      scriptGroups: Array.from(scriptGroups.values())
    };

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🎧 Listening Comprehension Audio Analysis');
  console.log('=' .repeat(50));
  
  try {
    const result = await analyzeComprehensionQuestions();
    
    if (result && result.missingAudio > 0) {
      console.log('\n💡 To generate the missing audio:');
      console.log('1. Set up Google Cloud TTS credentials');
      console.log('2. Configure AUDIO_BUCKET environment variable');
      console.log('3. Run: node backfill-comprehension-audio.cjs');
    }
    
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

main();