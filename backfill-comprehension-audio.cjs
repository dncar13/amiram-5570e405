#!/usr/bin/env node
// Script to backfill audio for listening comprehension questions
require('dotenv').config({ path: './.env' });
const { backfillComprehensionAudio } = require('./multi-question-generator.cjs');

async function main() {
  console.log('🎧 Starting Listening Comprehension Audio Backfill');
  console.log('=' .repeat(50));
  
  try {
    const result = await backfillComprehensionAudio();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 BACKFILL SUMMARY');
    console.log('='.repeat(50));
    
    if (result) {
      console.log(`✅ Success: ${result.success}`);
      console.log(`📝 Total questions processed: ${result.totalQuestions}`);
      console.log(`🎵 Unique audio segments: ${result.uniqueSegments}`);
    }
    
    console.log('\n🎉 Backfill completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();