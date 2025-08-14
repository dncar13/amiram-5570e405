#!/usr/bin/env node
// Purge old audio files from local and GCS storage
require('dotenv').config({ path: './.env' });
const { Storage } = require('@google-cloud/storage');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const storage = new Storage();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = process.env.AUDIO_BUCKET || 'my-amiranet-audio';
const PREFIX = process.env.AUDIO_PREFIX || 'audio/';
const subfolders = ['comprehension', 'word-formation', 'grammar-context'];

async function purgeLocalAudio() {
  console.log('🗑️ Purging local audio files...');
  
  const basePath = path.join(__dirname, '../public/audioFiles');
  
  for (const subfolder of subfolders) {
    const fullPath = path.join(basePath, subfolder);
    try {
      const files = await fs.readdir(fullPath);
      const mp3Files = files.filter(f => f.endsWith('.mp3'));
      
      console.log(`  📁 ${subfolder}: found ${mp3Files.length} MP3 files`);
      
      for (const file of mp3Files) {
        await fs.unlink(path.join(fullPath, file));
        console.log(`    ✅ Deleted ${file}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`  ⚠️ Error accessing ${fullPath}:`, error.message);
      } else {
        console.log(`  📁 ${subfolder}: directory doesn't exist, skipping`);
      }
    }
  }
}

async function purgeGCSAudio() {
  console.log('☁️ Purging GCS audio files...');
  
  if (!BUCKET) { 
    console.log('No bucket set. Skipping GCS purge.'); 
    return; 
  }

  try {
    // Test bucket access
    const bucket = storage.bucket(BUCKET);
    await bucket.exists();
    console.log(`  📦 Connected to bucket: ${BUCKET}`);
    
    for (const subfolder of subfolders) {
      const prefix = `${PREFIX}${subfolder}/`;
      console.log(`  🗑️ Purging: gs://${BUCKET}/${prefix}`);
      
      try {
        const [files] = await bucket.getFiles({ prefix });
        console.log(`    Found ${files.length} files to delete`);
        
        if (files.length > 0) {
          await Promise.all(files.map(file => 
            file.delete().catch(err => 
              console.warn(`    ⚠️ Failed to delete ${file.name}:`, err.message)
            )
          ));
          console.log(`    ✅ Deleted ${files.length} files`);
        }
      } catch (error) {
        console.warn(`    ⚠️ Error purging ${prefix}:`, error.message);
      }
    }
  } catch (error) {
    console.warn('  ⚠️ GCS purge failed:', error.message);
    console.log('  💡 Continuing with local purge only...');
  }
}

async function nullDBAudioUrls() {
  console.log('🗃️ Nullifying audio URLs in database metadata...');
  
  try {
    // Get all affected questions first
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, type, metadata')
      .in('type', ['listening_comprehension', 'word_formation', 'grammar_in_context']);

    if (fetchError) throw fetchError;

    console.log(`  📝 Found ${questions.length} questions to update`);

    let updated = 0;
    for (const question of questions) {
      const cleanMetadata = {
        ...question.metadata,
        audio_url: null,
        audio_generated: false,
        segmentId: null,
        audio_size: null,
        audio_placeholder: null
      };

      const { error } = await supabase
        .from('questions')
        .update({ metadata: cleanMetadata })
        .eq('id', question.id);

      if (error) {
        console.warn(`    ⚠️ Failed to update ${question.id}:`, error.message);
      } else {
        updated++;
      }
    }

    const byType = {
      listening_comprehension: questions.filter(q => q.type === 'listening_comprehension').length,
      word_formation: questions.filter(q => q.type === 'word_formation').length,
      grammar_in_context: questions.filter(q => q.type === 'grammar_in_context').length
    };

    console.log(`  ✅ Updated ${updated}/${questions.length} questions:`);
    console.log(`    - Listening Comprehension: ${byType.listening_comprehension}`);
    console.log(`    - Word Formation: ${byType.word_formation}`);
    console.log(`    - Grammar in Context: ${byType.grammar_in_context}`);

  } catch (error) {
    console.error('  ❌ Database metadata cleanup failed:', error.message);
    throw error;
  }
}

async function purgeAll() {
  console.log('🧹 AUDIO PURGE STARTING');
  console.log('='.repeat(40));
  
  try {
    await purgeLocalAudio();
    console.log();
    await purgeGCSAudio();
    console.log();
    await nullDBAudioUrls();
    
    console.log('\n✅ Purge completed successfully!');
    console.log('🎯 Ready for fresh TTS generation.');
    
  } catch (error) {
    console.error('\n❌ Purge failed:', error.message);
    throw error;
  }
}

if (require.main === module) {
  purgeAll()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { purgeAll, purgeLocalAudio, purgeGCSAudio, nullDBAudioUrls };