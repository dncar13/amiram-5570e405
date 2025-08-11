#!/usr/bin/env node
// Comprehensive TTS rebuild script
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const { generateAudioInfo, groupComprehensionByAudio } = require('./audio-id-strategy.cjs');
const { synthesizeToUrl } = require('./local-tts-service.cjs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

class TTSRebuilder {
  constructor() {
    this.stats = {
      totalQuestions: 0,
      successful: 0,
      failed: 0,
      byType: {
        listening_comprehension: { total: 0, successful: 0, failed: 0 },
        word_formation: { total: 0, successful: 0, failed: 0 },
        grammar_in_context: { total: 0, successful: 0, failed: 0 }
      },
      audioFiles: {
        unique: 0,
        duplicatesAvoided: 0
      },
      errors: []
    };
  }

  async loadQuestions() {
    console.log('📚 Loading questions from database...');
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .in('type', ['listening_comprehension', 'word_formation', 'grammar_in_context'])
      .order('type', { ascending: true });

    if (error) throw error;

    this.stats.totalQuestions = questions.length;
    
    console.log(`✅ Loaded ${questions.length} questions:`);
    const byType = {};
    for (const type of ['listening_comprehension', 'word_formation', 'grammar_in_context']) {
      const count = questions.filter(q => q.type === type).length;
      byType[type] = count;
      this.stats.byType[type].total = count;
      console.log(`   - ${type}: ${count}`);
    }

    return questions;
  }

  async processListeningComprehension(questions) {
    console.log('\n🎧 Processing Listening Comprehension...');
    
    const comprehensionQuestions = questions.filter(q => q.type === 'listening_comprehension');
    if (comprehensionQuestions.length === 0) {
      console.log('   No listening comprehension questions found.');
      return;
    }

    const groups = groupComprehensionByAudio(comprehensionQuestions);
    console.log(`   📊 Grouped ${comprehensionQuestions.length} questions into ${groups.length} audio segments`);
    
    this.stats.audioFiles.duplicatesAvoided += comprehensionQuestions.length - groups.length;

    for (const group of groups) {
      try {
        console.log(`\n   🎵 Segment ${group.audioId} (${group.questions.length} questions)`);
        console.log(`   📝 "${group.audioScript.substring(0, 60)}${group.audioScript.length > 60 ? '...' : ''}"`);

        // Synthesize audio
        const audioResult = await synthesizeToUrl(
          group.filePath, 
          group.audioScript,
          { subfolder: 'comprehension', pauseMs: 0 }
        );

        console.log(`   ✅ Audio: ${audioResult.url}`);

        // Update all questions in this group
        for (const question of group.questions) {
          const updatedMetadata = {
            ...(question.metadata || {}),
            audio_url: audioResult.url,
            audio_generated: true,
            audio_size: audioResult.size,
            segmentId: group.audioId,
            audio_placeholder: audioResult.placeholder || false
          };

          const { error } = await supabase
            .from('questions')
            .update({ metadata: updatedMetadata })
            .eq('id', question.id);

          if (error) {
            console.error(`   ❌ DB update failed for ${question.id}:`, error.message);
            this.stats.byType.listening_comprehension.failed++;
            this.stats.failed++;
            this.stats.errors.push(`LC-${question.id}: ${error.message}`);
          } else {
            this.stats.byType.listening_comprehension.successful++;
            this.stats.successful++;
          }
        }

        this.stats.audioFiles.unique++;
        
      } catch (error) {
        console.error(`   ❌ Failed to process segment ${group.audioId}:`, error.message);
        for (const question of group.questions) {
          this.stats.byType.listening_comprehension.failed++;
          this.stats.failed++;
        }
        this.stats.errors.push(`LC-segment-${group.audioId}: ${error.message}`);
      }
    }
  }

  async processWordFormation(questions) {
    console.log('\n📝 Processing Word Formation...');
    
    const wfQuestions = questions.filter(q => q.type === 'word_formation');
    if (wfQuestions.length === 0) {
      console.log('   No word formation questions found.');
      return;
    }

    console.log(`   📊 Processing ${wfQuestions.length} individual questions`);

    for (const question of wfQuestions) {
      try {
        const audioInfo = generateAudioInfo(question);
        console.log(`   🎵 ${audioInfo.audioId}: "${audioInfo.text.substring(0, 40)}..."`);

        // Synthesize audio
        const audioResult = await synthesizeToUrl(
          audioInfo.filePath,
          audioInfo.text,
          { subfolder: 'word-formation', pauseMs: 700 }
        );

        // Update question
        const updatedMetadata = {
          ...(question.metadata || {}),
          audio_url: audioResult.url,
          audio_generated: true,
          audio_size: audioResult.size,
          segmentId: audioInfo.audioId,
          audio_placeholder: audioResult.placeholder || false
        };

        const { error } = await supabase
          .from('questions')
          .update({ metadata: updatedMetadata })
          .eq('id', question.id);

        if (error) {
          console.error(`   ❌ DB update failed for ${question.id}:`, error.message);
          this.stats.byType.word_formation.failed++;
          this.stats.failed++;
          this.stats.errors.push(`WF-${question.id}: ${error.message}`);
        } else {
          console.log(`   ✅ ${audioInfo.audioId}`);
          this.stats.byType.word_formation.successful++;
          this.stats.successful++;
          this.stats.audioFiles.unique++;
        }

      } catch (error) {
        console.error(`   ❌ Failed to process question ${question.id}:`, error.message);
        this.stats.byType.word_formation.failed++;
        this.stats.failed++;
        this.stats.errors.push(`WF-${question.id}: ${error.message}`);
      }
    }
  }

  async processGrammarInContext(questions) {
    console.log('\n📝 Processing Grammar in Context...');
    
    const gcQuestions = questions.filter(q => q.type === 'grammar_in_context');
    if (gcQuestions.length === 0) {
      console.log('   No grammar in context questions found.');
      return;
    }

    console.log(`   📊 Processing ${gcQuestions.length} individual questions`);

    for (const question of gcQuestions) {
      try {
        const audioInfo = generateAudioInfo(question);
        console.log(`   🎵 ${audioInfo.audioId}: "${audioInfo.text.substring(0, 40)}..."`);

        // Synthesize audio
        const audioResult = await synthesizeToUrl(
          audioInfo.filePath,
          audioInfo.text,
          { subfolder: 'grammar-context', pauseMs: 700 }
        );

        // Update question
        const updatedMetadata = {
          ...(question.metadata || {}),
          audio_url: audioResult.url,
          audio_generated: true,
          audio_size: audioResult.size,
          segmentId: audioInfo.audioId,
          audio_placeholder: audioResult.placeholder || false
        };

        const { error } = await supabase
          .from('questions')
          .update({ metadata: updatedMetadata })
          .eq('id', question.id);

        if (error) {
          console.error(`   ❌ DB update failed for ${question.id}:`, error.message);
          this.stats.byType.grammar_in_context.failed++;
          this.stats.failed++;
          this.stats.errors.push(`GC-${question.id}: ${error.message}`);
        } else {
          console.log(`   ✅ ${audioInfo.audioId}`);
          this.stats.byType.grammar_in_context.successful++;
          this.stats.successful++;
          this.stats.audioFiles.unique++;
        }

      } catch (error) {
        console.error(`   ❌ Failed to process question ${question.id}:`, error.message);
        this.stats.byType.grammar_in_context.failed++;
        this.stats.failed++;
        this.stats.errors.push(`GC-${question.id}: ${error.message}`);
      }
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TTS REBUILD SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`📝 Total Questions: ${this.stats.totalQuestions}`);
    console.log(`✅ Successful: ${this.stats.successful}`);
    console.log(`❌ Failed: ${this.stats.failed}`);
    console.log(`📈 Success Rate: ${((this.stats.successful / this.stats.totalQuestions) * 100).toFixed(1)}%`);
    
    console.log('\n📊 By Type:');
    for (const [type, stats] of Object.entries(this.stats.byType)) {
      console.log(`   ${type}:`);
      console.log(`     Total: ${stats.total}`);
      console.log(`     Successful: ${stats.successful}`);
      console.log(`     Failed: ${stats.failed}`);
    }
    
    console.log('\n🎵 Audio Files:');
    console.log(`   Unique files created: ${this.stats.audioFiles.unique}`);
    console.log(`   Duplicates avoided: ${this.stats.audioFiles.duplicatesAvoided}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.stats.errors.slice(0, 10).forEach(error => {
        console.log(`   - ${error}`);
      });
      if (this.stats.errors.length > 10) {
        console.log(`   ... and ${this.stats.errors.length - 10} more errors`);
      }
    }
    
    console.log('\n🎯 Status:', this.stats.failed === 0 ? '✅ ALL SUCCESSFUL!' : '⚠️ Some failures occurred');
  }

  async rebuild() {
    console.log('🚀 TTS REBUILD STARTING');
    console.log('='.repeat(50));
    
    try {
      const questions = await this.loadQuestions();
      
      await this.processListeningComprehension(questions);
      await this.processWordFormation(questions);
      await this.processGrammarInContext(questions);
      
      this.printSummary();
      
      return this.stats.failed === 0;
      
    } catch (error) {
      console.error('\n❌ Rebuild failed:', error.message);
      console.error(error.stack);
      throw error;
    }
  }
}

if (require.main === module) {
  const rebuilder = new TTSRebuilder();
  rebuilder.rebuild()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}

module.exports = { TTSRebuilder };