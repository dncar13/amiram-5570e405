#!/usr/bin/env node
// Generate unique MP3 files for each question using Google Cloud TTS
require('dotenv').config({ path: './.env' });

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// Set up Google Cloud credentials 
process.env.GOOGLE_APPLICATION_CREDENTIALS = './amiram-463020-c7a69ce9848f.json';

const client = new TextToSpeechClient();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

class MP3Regenerator {
  constructor() {
    this.stats = {
      deleted: 0,
      generated: 0,
      errors: 0,
      byType: {}
    };
  }

  async generateMP3(text, outputPath, options = {}) {
    const {
      voice = 'en-US-Studio-Q',
      languageCode = 'en-US',
      addPauses = false
    } = options;

    // For word formation and grammar questions, convert blanks to pauses
    let processedText = text;
    if (addPauses) {
      processedText = text.replace(/_+/g, '... '); // Replace blanks with pause
    }

    const request = {
      input: { text: processedText },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: 'MP3' }
    };

    console.log(`🎵 Generating: ${outputPath}`);
    console.log(`📝 Text: "${processedText.substring(0, 60)}${processedText.length > 60 ? '...' : ''}"`);

    const [response] = await client.synthesizeSpeech(request);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Save MP3 file
    await fs.writeFile(outputPath, response.audioContent, 'binary');
    console.log(`✅ MP3 saved: ${outputPath}`);
    
    return response.audioContent.length;
  }

  async deleteOldMP3s() {
    console.log('🗑️ Deleting old MP3 files...');
    
    const directories = [
      'public/audioFiles/comprehension',
      'public/audioFiles/word-formation', 
      'public/audioFiles/grammar-context'
    ];

    for (const dir of directories) {
      const fullDir = path.join(__dirname, dir);
      try {
        const files = await fs.readdir(fullDir);
        const mp3Files = files.filter(f => f.endsWith('.mp3'));
        
        for (const file of mp3Files) {
          await fs.unlink(path.join(fullDir, file));
          this.stats.deleted++;
          console.log(`  ✅ Deleted ${dir}/${file}`);
        }
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn(`⚠️ Error cleaning ${dir}:`, error.message);
        }
      }
    }

    console.log(`🗑️ Deleted ${this.stats.deleted} old MP3 files`);
  }

  async processListeningComprehension() {
    console.log('\n🎧 Processing Listening Comprehension...');
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('type', 'listening_comprehension');

    if (error) throw error;
    
    this.stats.byType.listening_comprehension = { total: questions.length, processed: 0 };
    console.log(`Found ${questions.length} listening comprehension questions`);

    for (const question of questions) {
      try {
        // Use the audio script from metadata, or fall back to question text
        const audioScript = question.metadata?.audio_script || question.question_text;
        
        if (!audioScript) {
          console.warn(`⚠️ Question ${question.id} has no audio script`);
          continue;
        }

        // Generate unique filename based on question ID
        const fileName = `lc_${question.id.replace(/-/g, '_')}.mp3`;
        const outputPath = path.join(__dirname, 'public/audioFiles/comprehension', fileName);
        
        // Generate MP3 (no pauses for comprehension)
        const audioSize = await this.generateMP3(audioScript, outputPath, {
          voice: 'en-US-Wavenet-F',
          addPauses: false
        });

        // Update database with new audio URL
        const audioUrl = `/audioFiles/comprehension/${fileName}`;
        const { error: updateError } = await supabase
          .from('questions')
          .update({ 
            metadata: {
              ...(question.metadata || {}),
              audio_url: audioUrl,
              audio_generated: true,
              audio_size: audioSize
            }
          })
          .eq('id', question.id);

        if (updateError) throw updateError;

        this.stats.generated++;
        this.stats.byType.listening_comprehension.processed++;
        console.log(`✅ Updated question ${question.id} with ${audioUrl}`);

      } catch (error) {
        console.error(`❌ Error processing LC question ${question.id}:`, error.message);
        this.stats.errors++;
      }
    }
  }

  async processWordFormation() {
    console.log('\n📝 Processing Word Formation...');
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('type', 'word_formation');

    if (error) throw error;
    
    this.stats.byType.word_formation = { total: questions.length, processed: 0 };
    console.log(`Found ${questions.length} word formation questions`);

    for (const question of questions) {
      try {
        const questionText = question.question_text;
        
        if (!questionText) {
          console.warn(`⚠️ Question ${question.id} has no question text`);
          continue;
        }

        // Generate unique filename based on question ID
        const fileName = `wf_${question.id.replace(/-/g, '_')}.mp3`;
        const outputPath = path.join(__dirname, 'public/audioFiles/word-formation', fileName);
        
        // Generate MP3 (with pauses for blanks)
        const audioSize = await this.generateMP3(questionText, outputPath, {
          voice: 'en-US-Wavenet-F',
          addPauses: true
        });

        // Update database with new audio URL
        const audioUrl = `/audioFiles/word-formation/${fileName}`;
        const { error: updateError } = await supabase
          .from('questions')
          .update({ 
            metadata: {
              ...(question.metadata || {}),
              audio_url: audioUrl,
              audio_generated: true,
              audio_size: audioSize
            }
          })
          .eq('id', question.id);

        if (updateError) throw updateError;

        this.stats.generated++;
        this.stats.byType.word_formation.processed++;
        console.log(`✅ Updated question ${question.id} with ${audioUrl}`);

      } catch (error) {
        console.error(`❌ Error processing WF question ${question.id}:`, error.message);
        this.stats.errors++;
      }
    }
  }

  async processGrammarContext() {
    console.log('\n📝 Processing Grammar in Context...');
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('type', 'grammar_in_context');

    if (error) throw error;
    
    this.stats.byType.grammar_in_context = { total: questions.length, processed: 0 };
    console.log(`Found ${questions.length} grammar in context questions`);

    for (const question of questions) {
      try {
        const questionText = question.question_text;
        
        if (!questionText) {
          console.warn(`⚠️ Question ${question.id} has no question text`);
          continue;
        }

        // Generate unique filename based on question ID
        const fileName = `gc_${question.id.replace(/-/g, '_')}.mp3`;
        const outputPath = path.join(__dirname, 'public/audioFiles/grammar-context', fileName);
        
        // Generate MP3 (with pauses for blanks)
        const audioSize = await this.generateMP3(questionText, outputPath, {
          voice: 'en-US-Wavenet-F',
          addPauses: true
        });

        // Update database with new audio URL
        const audioUrl = `/audioFiles/grammar-context/${fileName}`;
        const { error: updateError } = await supabase
          .from('questions')
          .update({ 
            metadata: {
              ...(question.metadata || {}),
              audio_url: audioUrl,
              audio_generated: true,
              audio_size: audioSize
            }
          })
          .eq('id', question.id);

        if (updateError) throw updateError;

        this.stats.generated++;
        this.stats.byType.grammar_in_context.processed++;
        console.log(`✅ Updated question ${question.id} with ${audioUrl}`);

      } catch (error) {
        console.error(`❌ Error processing GC question ${question.id}:`, error.message);
        this.stats.errors++;
      }
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 MP3 REGENERATION SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`🗑️ Old files deleted: ${this.stats.deleted}`);
    console.log(`🎵 New MP3s generated: ${this.stats.generated}`);
    console.log(`❌ Errors: ${this.stats.errors}`);
    
    console.log('\n📊 By Type:');
    for (const [type, stats] of Object.entries(this.stats.byType)) {
      console.log(`   ${type}:`);
      console.log(`     Total: ${stats.total}`);
      console.log(`     Processed: ${stats.processed}`);
    }
    
    const success = this.stats.errors === 0;
    console.log(`\n🎯 Result: ${success ? '✅ ALL SUCCESSFUL!' : '⚠️ Some errors occurred'}`);
    return success;
  }

  async regenerateAll() {
    console.log('🚀 UNIQUE MP3 REGENERATION STARTING');
    console.log('='.repeat(50));
    console.log(`🎤 Using Google Cloud TTS with voice: en-US-Wavenet-F`);
    
    try {
      // Step 1: Delete old MP3s
      await this.deleteOldMP3s();
      
      // Step 2: Generate new MP3s for each question type
      await this.processListeningComprehension();
      await this.processWordFormation();
      await this.processGrammarContext();
      
      // Step 3: Print summary
      return this.printSummary();
      
    } catch (error) {
      console.error(`\n❌ Regeneration failed: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }
}

if (require.main === module) {
  const regenerator = new MP3Regenerator();
  regenerator.regenerateAll()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}

module.exports = { MP3Regenerator };