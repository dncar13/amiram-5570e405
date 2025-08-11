#!/usr/bin/env node
// regenerate-audio.cjs - Regenerate MP3 audio for existing questions using Google Cloud TTS
require('dotenv').config({ path: './.env' });

const { createClient } = require('@supabase/supabase-js');
const { synthesizeMp3 } = require('./tts-helper.cjs');
const { 
  groupComprehensionByScript, 
  getWordFormationAudioInfo, 
  getGrammarContextAudioInfo 
} = require('./audio-id-generator.cjs');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const storage = new Storage();
const BUCKET = process.env.AUDIO_BUCKET || 'my-amiranet-audio';
const USE_GCS = !!process.env.GOOGLE_APPLICATION_CREDENTIALS && !!process.env.AUDIO_BUCKET;

class AudioRegenerator {
  constructor() {
    this.stats = {
      totalQuestions: 0,
      processedQuestions: 0,
      audioFilesCreated: 0,
      duplicatesAvoided: 0,
      errors: [],
      byType: {}
    };
  }

  async saveAudio(audioInfo, buffer) {
    if (USE_GCS) {
      return await this.saveToGCS(audioInfo, buffer);
    } else {
      return await this.saveLocally(audioInfo, buffer);
    }
  }

  async saveToGCS(audioInfo, buffer) {
    const file = storage.bucket(BUCKET).file(audioInfo.gcsPath);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'audio/mpeg',
        cacheControl: 'public, max-age=31536000' // 1 year
      },
      resumable: false
    });

    // Try to make public
    try {
      await file.makePublic();
      console.log(`☁️ Saved to GCS: gs://${BUCKET}/${audioInfo.gcsPath}`);
      return `https://storage.googleapis.com/${BUCKET}/${audioInfo.gcsPath}`;
    } catch (publicError) {
      console.warn(`⚠️ Could not make public, using signed URL: ${publicError.message}`);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
      });
      return signedUrl;
    }
  }

  async saveLocally(audioInfo, buffer) {
    const fullPath = path.join(__dirname, audioInfo.localPath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    console.log(`💾 Saved locally: ${audioInfo.localPath}`);
    return audioInfo.publicUrl;
  }

  async updateQuestionAudio(questionId, audioUrl, audioInfo, size) {
    const { error } = await supabase
      .from('questions')
      .update({ 
        metadata: supabase.sql`
          COALESCE(metadata, '{}'::jsonb) || ${JSON.stringify({
            audio_url: audioUrl,
            audio_generated: true,
            audio_size: size,
            segmentId: audioInfo.id,
            audio_placeholder: false
          })}::jsonb
        `
      })
      .eq('id', questionId);

    if (error) {
      throw new Error(`DB update failed for ${questionId}: ${error.message}`);
    }
  }

  async synthesizeComprehension(questions) {
    console.log(`\n🎧 Processing ${questions.length} Listening Comprehension questions...`);
    
    const groups = groupComprehensionByScript(questions);
    console.log(`📊 Grouped into ${groups.length} audio segments`);
    
    this.stats.duplicatesAvoided += questions.length - groups.length;
    this.stats.byType.listening_comprehension = {
      total: questions.length,
      groups: groups.length,
      processed: 0
    };

    for (const group of groups) {
      const { audioInfo, questions: groupQuestions } = group;
      
      console.log(`\n🎵 Segment ${audioInfo.id} (${groupQuestions.length} questions)`);
      console.log(`📝 "${audioInfo.text.substring(0, 80)}${audioInfo.text.length > 80 ? '...' : ''}"`);
      
      try {
        // Synthesize MP3
        const { buffer, size } = await synthesizeMp3(audioInfo.text, { pauseMs: audioInfo.pauseMs });
        
        // Save to storage
        const audioUrl = await this.saveAudio(audioInfo, buffer);
        console.log(`🔗 URL: ${audioUrl}`);
        
        // Update all questions in this group
        for (const question of groupQuestions) {
          await this.updateQuestionAudio(question.id, audioUrl, audioInfo, size);
          this.stats.byType.listening_comprehension.processed++;
          this.stats.processedQuestions++;
        }
        
        this.stats.audioFilesCreated++;
        console.log(`✅ Updated ${groupQuestions.length} questions`);
        
      } catch (error) {
        console.error(`❌ Failed to process segment ${audioInfo.id}: ${error.message}`);
        this.stats.errors.push(`LC-${audioInfo.id}: ${error.message}`);
      }
    }
  }

  async synthesizeWordFormation(questions) {
    console.log(`\n📝 Processing ${questions.length} Word Formation questions...`);
    
    this.stats.byType.word_formation = {
      total: questions.length,
      processed: 0
    };

    for (const question of questions) {
      const audioInfo = getWordFormationAudioInfo(question.question_text);
      
      console.log(`🎵 ${audioInfo.id}: "${audioInfo.text.substring(0, 50)}..."`);
      
      try {
        // Synthesize MP3 with pause for blanks
        const { buffer, size } = await synthesizeMp3(audioInfo.text, { pauseMs: audioInfo.pauseMs });
        
        // Save to storage
        const audioUrl = await this.saveAudio(audioInfo, buffer);
        
        // Update question
        await this.updateQuestionAudio(question.id, audioUrl, audioInfo, size);
        
        this.stats.byType.word_formation.processed++;
        this.stats.processedQuestions++;
        this.stats.audioFilesCreated++;
        
        console.log(`✅ ${audioInfo.id}`);
        
      } catch (error) {
        console.error(`❌ Failed to process question ${question.id}: ${error.message}`);
        this.stats.errors.push(`WF-${question.id}: ${error.message}`);
      }
    }
  }

  async synthesizeGrammar(questions) {
    console.log(`\n📝 Processing ${questions.length} Grammar in Context questions...`);
    
    this.stats.byType.grammar_in_context = {
      total: questions.length,
      processed: 0
    };

    for (const question of questions) {
      const audioInfo = getGrammarContextAudioInfo(question.question_text);
      
      console.log(`🎵 ${audioInfo.id}: "${audioInfo.text.substring(0, 50)}..."`);
      
      try {
        // Synthesize MP3 with pause for blanks
        const { buffer, size } = await synthesizeMp3(audioInfo.text, { pauseMs: audioInfo.pauseMs });
        
        // Save to storage
        const audioUrl = await this.saveAudio(audioInfo, buffer);
        
        // Update question
        await this.updateQuestionAudio(question.id, audioUrl, audioInfo, size);
        
        this.stats.byType.grammar_in_context.processed++;
        this.stats.processedQuestions++;
        this.stats.audioFilesCreated++;
        
        console.log(`✅ ${audioInfo.id}`);
        
      } catch (error) {
        console.error(`❌ Failed to process question ${question.id}: ${error.message}`);
        this.stats.errors.push(`GC-${question.id}: ${error.message}`);
      }
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUDIO REGENERATION SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`🎯 Storage: ${USE_GCS ? 'Google Cloud Storage' : 'Local Files'}`);
    console.log(`📝 Total Questions: ${this.stats.totalQuestions}`);
    console.log(`✅ Questions Processed: ${this.stats.processedQuestions}`);
    console.log(`🎵 Audio Files Created: ${this.stats.audioFilesCreated}`);
    console.log(`🔄 Duplicates Avoided: ${this.stats.duplicatesAvoided}`);
    console.log(`❌ Errors: ${this.stats.errors.length}`);
    
    console.log('\n📊 By Type:');
    for (const [type, stats] of Object.entries(this.stats.byType)) {
      console.log(`   ${type}:`);
      console.log(`     Total: ${stats.total}`);
      console.log(`     Processed: ${stats.processed}`);
      if (stats.groups) {
        console.log(`     Audio Groups: ${stats.groups}`);
      }
    }
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.slice(0, 5).forEach(error => {
        console.log(`   - ${error}`);
      });
      if (this.stats.errors.length > 5) {
        console.log(`   ... and ${this.stats.errors.length - 5} more`);
      }
    }
    
    const success = this.stats.errors.length === 0;
    console.log(`\n🎯 Result: ${success ? '✅ ALL SUCCESSFUL!' : '⚠️ Some errors occurred'}`);
    return success;
  }

  async regenerateAll() {
    console.log('🚀 AUDIO REGENERATION STARTING');
    console.log('='.repeat(60));
    console.log(`🎯 Storage: ${USE_GCS ? 'Google Cloud Storage' : 'Local Files'}`);
    console.log(`🎤 Voice: ${process.env.VOICE_NAME || 'en-US-Wavenet-F'}`);
    
    try {
      // Load all questions
      console.log('\n📚 Loading questions from database...');
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .in('type', ['listening_comprehension', 'word_formation', 'grammar_in_context'])
        .order('type', { ascending: true });

      if (error) throw error;
      
      this.stats.totalQuestions = questions.length;
      console.log(`✅ Loaded ${questions.length} questions`);
      
      // Group by type
      const byType = {
        listening_comprehension: questions.filter(q => q.type === 'listening_comprehension'),
        word_formation: questions.filter(q => q.type === 'word_formation'),
        grammar_in_context: questions.filter(q => q.type === 'grammar_in_context')
      };
      
      // Process each type
      await this.synthesizeComprehension(byType.listening_comprehension);
      await this.synthesizeWordFormation(byType.word_formation);
      await this.synthesizeGrammar(byType.grammar_in_context);
      
      return this.printSummary();
      
    } catch (error) {
      console.error(`\n❌ Regeneration failed: ${error.message}`);
      console.error(error.stack);
      throw error;
    }
  }
}

if (require.main === module) {
  console.log('🔧 Environment Check:');
  console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'SET' : 'NOT SET'}`);
  console.log(`   AUDIO_BUCKET: ${process.env.AUDIO_BUCKET || 'NOT SET'}`);
  console.log(`   VOICE_NAME: ${process.env.VOICE_NAME || 'DEFAULT'}`);
  console.log(`   USE_GCS: ${USE_GCS ? 'YES' : 'NO'}`);
  
  const regenerator = new AudioRegenerator();
  regenerator.regenerateAll()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}

module.exports = { AudioRegenerator };