#!/usr/bin/env node
// Stable, content-based ID strategy for TTS audio files
const crypto = require('crypto');

/**
 * Normalize text so trivial whitespace changes don't create new files
 */
function normText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')  // Multiple spaces -> single space
    .replace(/[_]{2,}/g, '______')  // Multiple underscores -> single blank marker
    .trim();
}

/**
 * Generate unique ID per audio file based on content and settings
 */
function audioStableId({ type, lang, voice, text, variant = '' }) {
  const normalizedText = normText(text);
  const base = `${type}||${lang}||${voice}||${normalizedText}||${variant}`;
  return crypto.createHash('md5').update(base, 'utf8').digest('hex').slice(0, 12);
}

/**
 * Convert text to SSML with proper blank handling
 */
function textToSSML(text, pauseMs = 0) {
  if (pauseMs <= 0) {
    // No pauses - return plain text (for comprehension)
    return { text: normText(text) };
  }

  // Convert blanks to SSML breaks (for word formation / grammar)
  const pauseTime = pauseMs >= 1000 ? `${pauseMs/1000}s` : `${pauseMs}ms`;
  const withBreaks = normText(text).replace(/_+/g, `<break time="${pauseTime}"/>`);
  return { ssml: `<speak>${withBreaks}</speak>` };
}

/**
 * Generate audio config for different question types
 */
function getAudioConfig(questionType) {
  const configs = {
    listening_comprehension: {
      subfolder: 'comprehension',
      pauseMs: 0,  // No blanks in comprehension
      voice: process.env.VOICE_NAME || 'en-US-Wavenet-F',
      lang: process.env.VOICE_LANG || 'en-US'
    },
    word_formation: {
      subfolder: 'word-formation',
      pauseMs: 700,  // Short pause for blanks
      voice: process.env.VOICE_NAME || 'en-US-Wavenet-F',
      lang: process.env.VOICE_LANG || 'en-US'
    },
    grammar_in_context: {
      subfolder: 'grammar-context',
      pauseMs: 700,  // Short pause for blanks
      voice: process.env.VOICE_NAME || 'en-US-Wavenet-F',
      lang: process.env.VOICE_LANG || 'en-US'
    }
  };

  return configs[questionType] || configs.word_formation;
}

/**
 * Generate audio file path and ID for a question
 */
function generateAudioInfo(question) {
  const config = getAudioConfig(question.type);
  
  let text, variant = '';
  
  // Extract text to synthesize based on question type
  if (question.type === 'listening_comprehension') {
    // Use audio_script from metadata
    text = question.metadata?.audio_script || question.question_text;
  } else {
    // Use question text for word formation and grammar
    text = question.question_text;
  }
  
  const audioId = audioStableId({
    type: question.type,
    lang: config.lang,
    voice: config.voice,
    text: text,
    variant: variant
  });
  
  return {
    audioId,
    filePath: `${config.subfolder}/${audioId}`,
    fileName: `${audioId}.mp3`,
    url: `/audioFiles/${config.subfolder}/${audioId}.mp3`,
    text: text,
    ssmlInput: textToSSML(text, config.pauseMs),
    config: config
  };
}

/**
 * Group listening comprehension questions by shared audio script
 */
function groupComprehensionByAudio(questions) {
  const groups = new Map();
  
  for (const question of questions) {
    const audioScript = question.metadata?.audio_script;
    if (!audioScript) continue;
    
    const audioId = audioStableId({
      type: 'listening_comprehension',
      lang: process.env.VOICE_LANG || 'en-US',
      voice: process.env.VOICE_NAME || 'en-US-Wavenet-F',
      text: audioScript,
      variant: ''
    });
    
    if (!groups.has(audioId)) {
      groups.set(audioId, {
        audioId,
        audioScript,
        filePath: `comprehension/${audioId}`,
        fileName: `${audioId}.mp3`,
        url: `/audioFiles/comprehension/${audioId}.mp3`,
        questions: []
      });
    }
    
    groups.get(audioId).questions.push(question);
  }
  
  return Array.from(groups.values());
}

// Test the strategy
function testStrategy() {
  console.log('🧪 Testing Audio ID Strategy');
  console.log('='.repeat(40));
  
  const testQuestions = [
    {
      type: 'listening_comprehension',
      question_text: 'What is the main topic?',
      metadata: { audio_script: 'Sarah and Mike are discussing their weekend plans. Sarah mentions going to the farmers market.' }
    },
    {
      type: 'word_formation',
      question_text: 'The company\'s ______ policy has been successful.',
    },
    {
      type: 'grammar_in_context',
      question_text: 'If I ______ you, I would accept the offer.',
    }
  ];
  
  console.log('Individual question audio info:');
  testQuestions.forEach((q, i) => {
    const info = generateAudioInfo(q);
    console.log(`${i + 1}. ${q.type}`);
    console.log(`   Text: "${info.text.substring(0, 50)}..."`);
    console.log(`   Audio ID: ${info.audioId}`);
    console.log(`   File Path: ${info.filePath}`);
    console.log(`   URL: ${info.url}`);
    console.log(`   SSML: ${JSON.stringify(info.ssmlInput)}`);
  });
  
  console.log('\nComprehension grouping test:');
  const comprehensionQuestions = testQuestions.filter(q => q.type === 'listening_comprehension');
  const groups = groupComprehensionByAudio(comprehensionQuestions);
  
  groups.forEach((group, i) => {
    console.log(`Group ${i + 1}:`);
    console.log(`   Audio ID: ${group.audioId}`);
    console.log(`   Questions: ${group.questions.length}`);
    console.log(`   Script: "${group.audioScript.substring(0, 50)}..."`);
  });
}

if (require.main === module) {
  testStrategy();
}

module.exports = {
  audioStableId,
  normText,
  textToSSML,
  getAudioConfig,
  generateAudioInfo,
  groupComprehensionByAudio
};