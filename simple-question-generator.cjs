// simple-question-generator.cjs - Generate questions without Google Cloud TTS
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

// Generate stable ID from text
function generateStableId(prefix, text) {
  return prefix + '_' + crypto.createHash('md5').update(text).digest('hex').slice(0, 10);
}

// Parse command line arguments
function parseArgs() {
  const args = {
    types: ['lc', 'wf', 'gc'], // Skip continuation for now
    count: 5,
    verbose: false
  };
  
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--types=')) {
      args.types = arg.split('=')[1].split(',').map(t => t.trim());
    } else if (arg.startsWith('--count=')) {
      args.count = parseInt(arg.split('=')[1]);
    } else if (arg === '--verbose') {
      args.verbose = true;
    }
  });
  
  return args;
}

// Generate questions with AI
async function generateQuestionsWithAI(type, count = 5) {
  console.log(`🤖 Generating ${count} ${type} questions with AI...`);

  let prompt = '';
  let topicId = 21;
  
  if (type === 'lc') {
    topicId = 23;
    prompt = `Generate ${count} listening comprehension questions. Each question should have:
1. An audio script (2-3 sentences of spoken English)
2. A question about the content
3. 4 multiple choice answers
4. An explanation in Hebrew

Format as JSON array with: question_text, answer_options (array), correct_answer (0-3), explanation, audio_script`;
  } else if (type === 'wf') {
    topicId = 21;
    prompt = `Generate ${count} word formation questions. Each question should have:
1. A sentence with a blank
2. 4 word formation options
3. The correct form
4. An explanation in Hebrew

Format as JSON array with: question_text, answer_options (array), correct_answer (0-3), explanation`;
  } else if (type === 'gc') {
    topicId = 22;
    prompt = `Generate ${count} grammar in context questions. Each question should have:
1. A sentence with a blank
2. 4 grammar options 
3. The correct choice
4. An explanation in Hebrew

Format as JSON array with: question_text, answer_options (array), correct_answer (0-3), explanation`;
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error('No JSON array found in AI response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    // Format questions for database
    return questions.map((q, index) => ({
      question_text: q.question_text,
      answer_options: q.answer_options,
      correct_answer: q.correct_answer.toString(),
      explanation: q.explanation,
      difficulty: 'medium',
      topic_id: topicId,
      type: type === 'lc' ? 'listening_comprehension' : 
            type === 'wf' ? 'word_formation' : 'grammar_context',
      ai_generated: true,
      stable_id: generateStableId(type, q.question_text),
      metadata: q.audio_script ? { audio_script: q.audio_script } : null
    }));

  } catch (error) {
    console.error(`❌ Error generating ${type} questions:`, error.message);
    return [];
  }
}

// Upload questions to database
async function uploadQuestions(questions) {
  if (!questions.length) {
    console.log('⚠️ No questions to upload');
    return;
  }

  console.log(`📤 Uploading ${questions.length} questions to database...`);

  try {
    const { data, error } = await supabase
      .from('listening_questions')
      .insert(questions)
      .select();

    if (error) {
      console.error('❌ Upload error:', error.message);
      return;
    }

    console.log(`✅ Uploaded ${data.length} questions successfully`);
    return data;

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

// Main function
async function main() {
  const args = parseArgs();
  
  console.log('🚀 Simple Question Generator');
  console.log(`📋 Types: ${args.types.join(', ')}`);
  console.log(`🔢 Count: ${args.count} per type`);
  console.log('');

  const allQuestions = [];

  for (const type of args.types) {
    const questions = await generateQuestionsWithAI(type, args.count);
    allQuestions.push(...questions);
    
    if (args.verbose) {
      console.log(`Generated ${type} questions:`, questions.length);
    }
  }

  console.log(`\n📊 Total questions generated: ${allQuestions.length}`);

  if (allQuestions.length > 0) {
    await uploadQuestions(allQuestions);
  }

  console.log('\n✅ Generation complete!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateQuestionsWithAI, uploadQuestions };
