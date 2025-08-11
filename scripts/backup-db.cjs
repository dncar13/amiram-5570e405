#!/usr/bin/env node
// Backup affected questions before TTS rebuild
require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function backupQuestions() {
  console.log('💾 Backing up questions before TTS rebuild...');
  
  try {
    // Get all affected questions
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .in('type', ['listening_comprehension', 'word_formation', 'grammar_in_context']);

    if (error) throw error;

    const backup = {
      timestamp: new Date().toISOString(),
      branch: 'tts-rebuild',
      totalQuestions: questions.length,
      byType: {
        listening_comprehension: questions.filter(q => q.type === 'listening_comprehension').length,
        word_formation: questions.filter(q => q.type === 'word_formation').length,
        grammar_in_context: questions.filter(q => q.type === 'grammar_in_context').length
      },
      questions: questions
    };

    // Save backup
    const backupDir = path.join(__dirname, '../backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const filename = `questions-backup-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
    const backupPath = path.join(backupDir, filename);
    
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup saved: ${backupPath}`);
    console.log(`📊 Backed up ${backup.totalQuestions} questions:`);
    console.log(`   - Listening Comprehension: ${backup.byType.listening_comprehension}`);
    console.log(`   - Word Formation: ${backup.byType.word_formation}`);
    console.log(`   - Grammar in Context: ${backup.byType.grammar_in_context}`);

    return backupPath;
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

if (require.main === module) {
  backupQuestions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { backupQuestions };