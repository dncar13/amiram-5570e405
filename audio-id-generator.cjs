// audio-id-generator.cjs
// Stable audio IDs to ensure each MP3 is unique where it should be

const crypto = require('crypto');

/**
 * Normalize text for consistent hashing
 */
function normalize(s) { 
  return String(s).replace(/\s+/g, ' ').trim(); 
}

/**
 * Generate unique/stable audio file ID
 * @param {object} params - { type, voice, text, variant? }
 * @returns {string} 12-character hash
 */
function audioId({ type, voice, text, variant = '' }) {
  const base = `${type}||${voice}||${normalize(text)}||${variant}`;
  return crypto.createHash('md5').update(base, 'utf8').digest('hex').slice(0, 12);
}

/**
 * Generate audio info for listening comprehension (grouped by script)
 */
function getComprehensionAudioInfo(audioScript, voice = process.env.VOICE_NAME || 'en-US-Wavenet-F') {
  const id = audioId({ 
    type: 'comprehension', 
    voice, 
    text: audioScript 
  });
  
  return {
    id,
    fileName: `${id}.mp3`,
    localPath: `public/audioFiles/comprehension/${id}.mp3`,
    gcsPath: `audio/comprehension/${id}.mp3`,
    publicUrl: `/audioFiles/comprehension/${id}.mp3`,
    text: audioScript,
    pauseMs: 0
  };
}

/**
 * Generate audio info for word formation questions
 */
function getWordFormationAudioInfo(questionText, voice = process.env.VOICE_NAME || 'en-US-Wavenet-F') {
  const id = audioId({ 
    type: 'word_formation', 
    voice, 
    text: questionText 
  });
  
  return {
    id,
    fileName: `${id}.mp3`,
    localPath: `public/audioFiles/word-formation/${id}.mp3`,
    gcsPath: `audio/word-formation/${id}.mp3`,
    publicUrl: `/audioFiles/word-formation/${id}.mp3`,
    text: questionText,
    pauseMs: 700
  };
}

/**
 * Generate audio info for grammar in context questions
 */
function getGrammarContextAudioInfo(questionText, voice = process.env.VOICE_NAME || 'en-US-Wavenet-F') {
  const id = audioId({ 
    type: 'grammar_in_context', 
    voice, 
    text: questionText 
  });
  
  return {
    id,
    fileName: `${id}.mp3`,
    localPath: `public/audioFiles/grammar-context/${id}.mp3`,
    gcsPath: `audio/grammar-context/${id}.mp3`,
    publicUrl: `/audioFiles/grammar-context/${id}.mp3`,
    text: questionText,
    pauseMs: 700
  };
}

/**
 * Group listening comprehension questions by identical audioScript
 */
function groupComprehensionByScript(questions) {
  const groups = new Map();
  
  for (const question of questions) {
    const audioScript = question.metadata?.audio_script;
    if (!audioScript) {
      console.warn(`⚠️ Question ${question.id} missing audio_script`);
      continue;
    }
    
    const audioInfo = getComprehensionAudioInfo(audioScript);
    const key = audioInfo.id;
    
    if (!groups.has(key)) {
      groups.set(key, {
        audioInfo,
        questions: []
      });
    }
    
    groups.get(key).questions.push(question);
  }
  
  return Array.from(groups.values());
}

// Test the ID generator
function testAudioIds() {
  console.log('🧪 Testing Audio ID Generation');
  console.log('='.repeat(40));
  
  // Test same text generates same ID
  const text1 = "The company's ______ policy has been successful.";
  const text2 = "The company's   ______   policy has been successful."; // extra spaces
  
  const id1 = audioId({ type: 'word_formation', voice: 'en-US-Wavenet-F', text: text1 });
  const id2 = audioId({ type: 'word_formation', voice: 'en-US-Wavenet-F', text: text2 });
  
  console.log('Same content test:');
  console.log(`Text 1 ID: ${id1}`);
  console.log(`Text 2 ID: ${id2}`);
  console.log(`Same ID: ${id1 === id2 ? '✅' : '❌'}`);
  
  // Test different types generate different IDs
  const id3 = audioId({ type: 'grammar_in_context', voice: 'en-US-Wavenet-F', text: text1 });
  console.log(`\nDifferent type ID: ${id3}`);
  console.log(`Different from WF: ${id1 !== id3 ? '✅' : '❌'}`);
  
  // Test comprehension grouping
  const mockQuestions = [
    {
      id: 'q1',
      metadata: { audio_script: 'Sarah and Mike are discussing plans.' }
    },
    {
      id: 'q2', 
      metadata: { audio_script: 'Sarah and Mike are discussing plans.' } // same script
    },
    {
      id: 'q3',
      metadata: { audio_script: 'Today we will talk about sleep.' } // different script
    }
  ];
  
  const groups = groupComprehensionByScript(mockQuestions);
  console.log(`\nComprehension grouping:`);
  console.log(`Groups created: ${groups.length}`);
  console.log(`Group 1: ${groups[0].questions.length} questions, ID: ${groups[0].audioInfo.id}`);
  console.log(`Group 2: ${groups[1].questions.length} questions, ID: ${groups[1].audioInfo.id}`);
}

if (require.main === module) {
  testAudioIds();
}

module.exports = {
  audioId,
  normalize,
  getComprehensionAudioInfo,
  getWordFormationAudioInfo,
  getGrammarContextAudioInfo,
  groupComprehensionByScript
};