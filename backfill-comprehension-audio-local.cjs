#!/usr/bin/env node
// Local fallback version - creates placeholder audio files and updates database
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

function segmentIdFromScript(script) {
  return 'lec_' + crypto.createHash('md5').update(script.trim()).digest('hex').slice(0, 12);
}

async function createPlaceholderAudio(segmentId) {
  const audioDir = path.join(__dirname, 'public', 'audioFiles', 'comprehension');
  const audioFile = path.join(audioDir, `${segmentId}.mp3`);
  
  // Create directory if it doesn't exist
  await fs.mkdir(audioDir, { recursive: true });
  
  // Copy a placeholder audio file (we'll use an existing one)
  const placeholderFile = path.join(__dirname, 'public', 'audioFiles', 'listening-comprehension', 'firstQ.mp3');
  
  try {
    await fs.copyFile(placeholderFile, audioFile);
    return `/audioFiles/comprehension/${segmentId}.mp3`;
  } catch (error) {
    console.warn(`⚠️ Could not create placeholder file: ${error.message}`);
    // Create a simple text file as placeholder
    await fs.writeFile(audioFile.replace('.mp3', '.txt'), `Placeholder for audio segment: ${segmentId}`);
    return `/audioFiles/comprehension/${segmentId}.txt`;
  }
}

async function backfillComprehensionAudioLocal() {
  console.log('🔍 Searching for listening comprehension questions missing audio (LOCAL MODE)...');
  
  try {
    const { data: rows, error } = await supabase
      .from('questions')
      .select('id, question_text, metadata, type')
      .eq('type', 'listening_comprehension');

    if (error) throw error;

    // Find questions with audioScript but no audioUrl
    const missing = (rows || []).filter(r => {
      const audioScript = r.metadata && r.metadata.audio_script;
      const audioUrl = r.metadata && r.metadata.audio_url;
      return audioScript && !audioUrl;
    });

    if (!missing.length) {
      console.log('✅ No missing comprehension audio found.');
      return;
    }

    console.log(`📝 Found ${missing.length} questions missing audio. Grouping by script...`);

    // Group by audioScript to avoid duplicate synthesis
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

    console.log(`🎯 Processing ${scriptGroups.size} unique audio segments...`);

    // Process each unique segment
    for (const [segmentId, group] of scriptGroups) {
      try {
        console.log(`🎵 Creating placeholder audio for segment: ${segmentId} (${group.questions.length} questions)`);
        console.log(`📝 Script preview: "${group.script.substring(0, 100)}${group.script.length > 100 ? '...' : ''}"`);

        // Create placeholder audio file
        const audioUrl = await createPlaceholderAudio(segmentId);
        console.log(`✅ Placeholder created: ${audioUrl}`);

        // Update all questions that share this script
        for (const question of group.questions) {
          const updatedMetadata = {
            ...(question.metadata || {}),
            segmentId: segmentId,
            audio_generated: true,
            audio_url: audioUrl,
            audio_placeholder: true, // Mark as placeholder
            audio_size: 1024 // Placeholder size
          };

          const { error: updateError } = await supabase
            .from('questions')
            .update({ metadata: updatedMetadata })
            .eq('id', question.id);

          if (updateError) throw updateError;
        }

        console.log(`🎧 Updated ${group.questions.length} question(s) for segment ${segmentId}`);

      } catch (error) {
        console.error(`❌ Failed to process segment ${segmentId}:`, error.message);
        continue; // Continue with next segment
      }
    }

    console.log('✅ Local comprehension audio backfill complete.');
    console.log('💡 To generate real TTS audio, set up Google Cloud credentials and run the full backfill.');
    
    // Return summary
    return {
      totalQuestions: missing.length,
      uniqueSegments: scriptGroups.size,
      success: true,
      placeholder: true
    };

  } catch (error) {
    console.error('❌ Backfill failed:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🎧 Starting Listening Comprehension Audio Backfill (LOCAL MODE)');
  console.log('=' .repeat(50));
  
  try {
    const result = await backfillComprehensionAudioLocal();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 BACKFILL SUMMARY (LOCAL MODE)');
    console.log('='.repeat(50));
    
    if (result) {
      console.log(`✅ Success: ${result.success}`);
      console.log(`📝 Total questions processed: ${result.totalQuestions}`);
      console.log(`🎵 Unique audio segments: ${result.uniqueSegments}`);
      console.log(`🔄 Placeholder files created: ${result.placeholder}`);
    }
    
    console.log('\n🎉 Local backfill completed successfully!');
    console.log('💡 The app should now work with placeholder audio files.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();