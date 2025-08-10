// advanced-listening-generator.js - Advanced Listening Questions Generator v1.0
// Generates 4 types of listening questions: Comprehension, Continuation, Word Formation, Grammar in Context
require('dotenv').config({ path: '../.env' });
const { synthesizeBatch, validateAudioUrl, toSSML } = require('./text-to-speech.cjs');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Configuration
const CONFIG = {
  model: 'claude-3-5-sonnet-20241022',
  voice: 'en-US-Wavenet-F',
  speakingRate: 1.0, // 140-160 wpm target
  audioDir: '../public/audioFiles/listening',
  batchSize: 5,
  maxRetries: 3
};

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate stable ID from text
function generateStableId(text, type, index = 1) {
  const prefix = {
    'listening_comprehension': 'lec',
    'listening_continuation': 'cont', 
    'word_formation': 'wf',
    'grammar_in_context': 'gc'
  }[type] || 'aud';
  
  const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 8);
  return `${prefix}_ch1_${index}_${hash}`;
}

// LISTENING COMPREHENSION GENERATOR
async function generateListeningComprehension(chapter = 1, count = 3) {
  console.log(`🎧 Generating ${count} listening comprehension questions for chapter ${chapter}`);
  
  const prompt = `Generate ${count} listening comprehension audio scripts for English learners preparing for AMIRAT/Amirant exam.

Requirements:
- 3 audio clips: SHORT (30 sec), MEDIUM (60 sec), LONG (90 sec)
- Topics: everyday/academic light (campus, work, travel, health, tech basics)
- Speaking rate: 140-160 wpm, natural intonation
- Voice: female American English (en-US-Wavenet-F)

Questions per clip:
- SHORT: 1 question
- MEDIUM: 2 questions  
- LONG: 2 questions

Question types distribution:
- Main Idea (1-2 per conversation/lecture)
- Specific Detail (at least 2)
- Inference/Implication (1)
- Speaker Attitude/Purpose/Next step (1)
- For lectures: Organization/Sequence

Guidelines:
- Original content, avoid unnecessary numbers/names
- Reasonable distractors, not ridiculous; 4 options
- Hebrew explanations after verification, include citation/paraphrase from audio
- Script should be textual; no brackets needed
- Audio is the entire text (no underscores)

JSON format:
{
  "items": [
    {
      "id": "lec_ch1_short_1",
      "type": "listening_comprehension", 
      "durationTargetSec": 30,
      "audioScript": "Two colleagues discuss their upcoming project deadline. Sarah mentions that they're running behind schedule because...",
      "questions": [
        {
          "q": "What is the main reason they're behind schedule?",
          "options": ["Budget cuts", "Supplier delay", "Team member illness", "Equipment failure"],
          "correctAnswer": 1,
          "explanationHe": "בקטע נאמר במפורש שהספק איחר באספקת החומרים הנדרשים"
        }
      ],
      "metadata": {
        "topic": "workplace",
        "level": "B1", 
        "voice": "en-US-Wavenet-F",
        "questionTypes": ["specific_detail"]
      }
    }
  ]
}

Generate realistic, practical scenarios that test listening comprehension skills effectively.`;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const data = JSON.parse(jsonMatch[0]);
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Failed to generate listening comprehension:', error.message);
    throw error;
  }
}

// LISTENING CONTINUATION GENERATOR  
async function generateListeningContinuation(chapter = 1, count = 4) {
  console.log(`🔄 Generating ${count} listening continuation questions for chapter ${chapter}`);
  
  const prompt = `Generate ${count} listening continuation questions for English learners.

Requirements:
- 4 clips of ~20 seconds each
- Each clip: sentence/idea stops → learner chooses most appropriate continuation based on content/logic/tone
- Use ______ for pause location in text (will convert to SSML <break time="1s"/>)

Guidelines:
- Sentences with clear context and "pivot point"
- 4 continuations: one natural, three close but wrong (contradiction, inconsistent, missing details)
- No riddles; don't rely on external knowledge
- Everything should be inferred from the clip

JSON format:
{
  "items": [
    {
      "id": "cont_ch1_01",
      "type": "listening_continuation",
      "text": "The city council voted to approve the new park, but before construction begins, ______",
      "options": [
        "they must complete an environmental review.",
        "the mayor will resign immediately.", 
        "all residents will move out of the area.",
        "the budget for schools will be cut in half."
      ],
      "correctAnswer": 0,
      "explanationHe": "המשך טבעי והגיוני אחרי אישור פרויקט ציבורי הוא בדיקת סביבה",
      "tts": { "useSSMLPause": true, "pauseMs": 1000 }
    }
  ]
}

Create realistic scenarios with logical flow and clear continuation points.`;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const data = JSON.parse(jsonMatch[0]);
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Failed to generate listening continuation:', error.message);
    throw error;
  }
}

// WORD FORMATION GENERATOR
async function generateWordFormation(chapter = 1, count = 10) {
  console.log(`📝 Generating ${count} word formation questions for chapter ${chapter}`);
  
  const prompt = `Generate ${count} word formation questions for English learners.

Requirements:
- Complete one word according to grammatical/semantic context (adjective, noun, verb in correct form, derivative)
- Difficulty distribution: Easy/Medium/Hard: 40/40/20
- Provide lemma/root and specify POS (part of speech)
- Distractors from same word family (remark, remarkable, remarkably, remarking)
- Hebrew explanation: rule + contextual reasoning

JSON format:
{
  "items": [
    {
      "id": "wf_ch1_07",
      "type": "word_formation",
      "sentence": "The scientist's discovery was truly ______, changing the way we understand physics.",
      "options": ["remarked", "remarkable", "remarking", "remarks"],
      "correctAnswer": 1,
      "lemma": "remark",
      "posTarget": "adjective", 
      "explanationHe": "'remarkable' היא צורת תואר המתארת את ה-discovery. אחרי 'truly' נדרש תואר",
      "difficulty": "medium"
    }
  ]
}

Create varied contexts testing different word formation patterns and grammatical rules.`;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const data = JSON.parse(jsonMatch[0]);
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Failed to generate word formation:', error.message);
    throw error;
  }
}

// GRAMMAR IN CONTEXT GENERATOR
async function generateGrammarInContext(chapter = 1, count = 10) {
  console.log(`📚 Generating ${count} grammar in context questions for chapter ${chapter}`);
  
  const prompt = `Generate ${count} grammar in context questions for English learners.

Requirements:
- Test grammatical structures within real sentence/mini-paragraph (Subjunctive, Conditionals, Passive, Reported Speech, Modals, Relative Clauses etc.)
- Difficulty distribution: Easy/Medium/Hard: 40/40/20
- Sentence/short passage with four options; one completely correct
- Hebrew explanation will include rule + additional example

JSON format:
{
  "items": [
    {
      "id": "gc_ch1_03", 
      "type": "grammar_in_context",
      "text": "The committee insisted that the proposal ______ before the deadline.",
      "options": ["is submitted", "be submitted", "was submitted", "will be submitted"],
      "correctAnswer": 1,
      "grammarRule": "Subjunctive: insist/suggest/recommend + that + subject + base verb",
      "explanationHe": "אחרי פעלים של דרישה/המלצה משתמשים ב-Subjunctive: 'be submitted'",
      "examplesEn": [
        "The doctor recommended that she take the medicine.",
        "They demanded that he apologize immediately."
      ],
      "difficulty": "hard"
    }
  ]
}

Focus on practical grammar rules that learners commonly struggle with.`;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const data = JSON.parse(jsonMatch[0]);
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Failed to generate grammar in context:', error.message);
    throw error;
  }
}

// AUDIO GENERATION AND PROCESSING
async function processAudioForQuestions(questions, type) {
  console.log(`🔊 Processing audio for ${questions.length} ${type} questions`);
  
  const audioItems = [];
  
  questions.forEach((q, index) => {
    if (type === 'listening_comprehension') {
      // For comprehension, use the full audioScript
      audioItems.push({
        id: q.id || generateStableId(q.audioScript, type, index + 1),
        text: q.audioScript,
        targetDuration: q.durationTargetSec || 30
      });
    } else if (type === 'listening_continuation') {
      // For continuation, convert ______ to pause
      const textWithPause = q.text.replace(/_{4,}/g, '______');
      audioItems.push({
        id: q.id || generateStableId(q.text, type, index + 1),
        text: textWithPause,
        targetDuration: 20
      });
    }
    // Word formation and grammar don't need audio
  });
  
  if (audioItems.length === 0) {
    console.log('ℹ️ No audio required for this question type');
    return questions;
  }
  
  // Generate audio
  const { results, errors } = await synthesizeBatch(audioItems);
  
  if (errors.length > 0) {
    console.log(`⚠️ Audio generation errors:`, errors);
  }
  
  // Merge audio results back to questions
  questions.forEach(q => {
    const audioResult = results.find(r => r.id === q.id);
    if (audioResult && audioResult.audioResult) {
      q.audioUrl = audioResult.audioResult.url;
      q.audioSize = audioResult.audioResult.size;
      console.log(`✅ Audio attached to ${q.id}: ${q.audioUrl}`);
    }
  });
  
  return questions;
}

// UPLOAD TO DATABASE
async function uploadQuestionsToDatabase(questions, type, chapter = 1) {
  console.log(`💾 Uploading ${questions.length} ${type} questions to database`);
  
  try {
    const dbQuestions = questions.map(q => ({
      id: generateUUID(),
      question_text: q.audioScript || q.text || q.sentence,
      answer_options: q.options || (q.questions ? q.questions[0].options : []),
      correct_answer: (q.correctAnswer !== undefined ? q.correctAnswer : q.questions?.[0]?.correctAnswer || 0).toString(),
      explanation: q.explanationHe || q.questions?.[0]?.explanationHe || '',
      type: type,
      difficulty: q.difficulty || 'medium',
      is_premium: false,
      ai_generated: true,
      metadata: {
        stable_id: q.id,
        audio_generated: !!q.audioUrl,
        audio_size: q.audioSize || null,
        audio_url: q.audioUrl,
        chapter: chapter,
        grammar_rule: q.grammarRule,
        lemma: q.lemma,
        pos_target: q.posTarget,
        topic: q.metadata?.topic,
        duration_target: q.durationTargetSec,
        question_types: q.metadata?.questionTypes
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Handle multiple questions per item (for listening comprehension)
    const allDbQuestions = [];
    dbQuestions.forEach(dbQ => {
      const originalQ = questions.find(q => q.id === dbQ.metadata.stable_id);
      if (originalQ && originalQ.questions && originalQ.questions.length > 1) {
        // Multiple questions for this audio clip
        originalQ.questions.forEach((subQ, idx) => {
          allDbQuestions.push({
            ...dbQ,
            id: generateUUID(),
            question_text: subQ.q,
            answer_options: subQ.options,
            correct_answer: subQ.correctAnswer.toString(),
            explanation: subQ.explanationHe,
            metadata: {
              ...dbQ.metadata,
              stable_id: `${originalQ.id}_q${idx + 1}`,
              parent_audio_id: originalQ.id,
              question_index: idx + 1
            }
          });
        });
      } else {
        allDbQuestions.push(dbQ);
      }
    });

    const { data, error } = await supabase
      .from('questions')
      .insert(allDbQuestions)
      .select('id');

    if (error) throw error;

    console.log(`✅ Successfully uploaded ${data.length} questions to database`);
    return data;
    
  } catch (error) {
    console.error('❌ Failed to upload questions:', error.message);
    throw error;
  }
}

// MAIN GENERATOR FUNCTION
async function generateAdvancedListeningQuestions(type, chapter = 1, options = {}) {
  console.log(`\n🚀 Starting Advanced Listening Questions Generation`);
  console.log(`📋 Type: ${type}, Chapter: ${chapter}`);
  
  try {
    let questions = [];
    
    switch (type) {
      case 'listening_comprehension':
        questions = await generateListeningComprehension(chapter, options.count || 3);
        questions = await processAudioForQuestions(questions, type);
        break;
        
      case 'listening_continuation':
        questions = await generateListeningContinuation(chapter, options.count || 4);
        questions = await processAudioForQuestions(questions, type);
        break;
        
      case 'word_formation':
        questions = await generateWordFormation(chapter, options.count || 10);
        break;
        
      case 'grammar_in_context':
        questions = await generateGrammarInContext(chapter, options.count || 10);
        break;
        
      default:
        throw new Error(`Unknown question type: ${type}`);
    }
    
    // Upload to database if requested
    if (options.upload !== false) {
      await uploadQuestionsToDatabase(questions, type, chapter);
    }
    
    // Generate summary
    console.log(`\n📊 Generation Summary:`);
    console.log(`🆔 Type: ${type}`);
    console.log(`📝 Questions Generated: ${questions.length}`);
    console.log(`🔊 Audio Files: ${questions.filter(q => q.audioUrl).length}`);
    
    return {
      type,
      chapter,
      questions,
      summary: {
        total: questions.length,
        withAudio: questions.filter(q => q.audioUrl).length
      }
    };
    
  } catch (error) {
    console.error(`\n❌ Generation failed:`, error.message);
    throw error;
  }
}

// CLI INTERFACE
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(`
🎧 Advanced Listening Questions Generator v1.0

Usage:
  node advanced-listening-generator.js <type> [chapter] [count]

Types:
  listening_comprehension  - Generate lecture/conversation questions with audio
  listening_continuation   - Generate continuation questions with audio  
  word_formation          - Generate word formation questions (no audio)
  grammar_in_context      - Generate grammar questions (no audio)
  
Examples:
  node advanced-listening-generator.js listening_comprehension 1 3
  node advanced-listening-generator.js listening_continuation 1 4
  node advanced-listening-generator.js word_formation 1 10
  node advanced-listening-generator.js grammar_in_context 1 10
`);
    return;
  }
  
  const type = command;
  const chapter = parseInt(args[1]) || 1;
  const count = parseInt(args[2]) || (type.includes('listening') ? (type === 'listening_comprehension' ? 3 : 4) : 10);
  
  try {
    const result = await generateAdvancedListeningQuestions(type, chapter, { count });
    console.log(`\n🎉 Generation completed successfully!`);
    console.log(`Generated ${result.summary.total} questions with ${result.summary.withAudio} audio files`);
    
  } catch (error) {
    console.error(`\n💥 Generation failed:`, error.message);
    process.exit(1);
  }
}

// Export functions for use in other modules
module.exports = {
  generateAdvancedListeningQuestions,
  generateListeningComprehension,
  generateListeningContinuation,
  generateWordFormation,
  generateGrammarInContext,
  processAudioForQuestions,
  uploadQuestionsToDatabase
};

// Run if called directly
if (require.main === module) {
  main();
}
