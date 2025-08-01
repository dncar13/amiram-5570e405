// enhanced-question-generator.mjs - Enhanced AMIRAM Question Generator v4.0 (ES Module)
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import cliProgress from 'cli-progress';
import archiver from 'archiver';
import Anthropic from '@anthropic-ai/sdk';

// Load .env file from parent directory (where the main project is)
const envPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../.env');
dotenv.config({ path: envPath });

// Initialize Claude API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase client (only if env vars are provided)
const supabase = process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Configuration
const CONFIG = {
  model: 'claude-sonnet-4-20250514',
  outputDir: './questions',
  hebrewOutputDir: path.join(path.dirname(new URL(import.meta.url).pathname), '../questions-hebrew'),
  batchSize: 5,
  maxRetries: 3,
  delayBetweenRequests: 2000,
  uploadRateLimit: 100, // ms between uploads
  maxUploadRetries: 5
};

// ========== ENHANCED CONFIGURATION ==========
const ENHANCED_CONFIG = {
  // הגדרות הסבר בלבד - ללא תרגומים!
  explanationSettings: {
    'easy': {
      explanationLength: { min: 30, max: 50 },
      includeExamples: false,
      includeGrammarRules: false,
      includeCommonMistakes: false
    },
    'medium': {
      explanationLength: { min: 50, max: 100 },
      includeExamples: true,
      exampleCount: 1,
      includeGrammarRules: true,
      includeCommonMistakes: false
    },
    'hard': {
      explanationLength: { min: 100, max: 150 },
      includeExamples: true,
      exampleCount: 2,
      includeGrammarRules: true,
      includeCommonMistakes: true,
      includeUsageTips: true
    }
  }
};

// ID ranges
const ID_RANGES = {
  'sentence-completion': { start: 2020, end: 2999, current: 2020 },
  'restatement': { start: 3000, end: 3999, current: 3000 },
  'vocabulary': { start: 4000, end: 4999, current: 4000 },
  'reading-comprehension': { start: 5000, end: 5999, current: 5000 }
};

// ========== UTILITY FUNCTIONS ==========

// Load saved IDs
async function loadIds() {
  try {
    const data = await fs.readFile('./last-ids.json', 'utf8');
    const saved = JSON.parse(data);
    Object.keys(saved).forEach(key => {
      if (ID_RANGES[key]) {
        ID_RANGES[key].current = saved[key].current || ID_RANGES[key].start;
      }
    });
  } catch (e) {
    // First time - use defaults
  }
}

// Save current IDs
async function saveIds() {
  await fs.writeFile('./last-ids.json', JSON.stringify(ID_RANGES, null, 2));
}

// Generate unique batch ID
function generateBatchId() {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Hebrew text validation
function validateHebrewText(text) {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) && text.length > 10;
}

// Question structure validation
function validateQuestion(question) {
  return (
    question.options && question.options.length === 4 &&
    question.correctAnswer >= 0 && question.correctAnswer <= 3 &&
    validateHebrewText(question.explanation) &&
    (question.type !== 'sentence-completion' || question.text.includes('______'))
  );
}

// Enhanced validation for new features
function validateEnhancedQuestion(question) {
  const basicValidation = validateQuestion(question);
  
  if (!basicValidation) return false;
  
  // בדיקות נוספות לתוכן משופר
  if (question.difficulty === 'medium' && question.examples && question.examples.length === 0) {
    console.log(`⚠️ Missing examples in medium question ${question.id}`);
    return false;
  }
  
  if (question.difficulty === 'hard') {
    if (!question.examples || question.examples.length < 2) {
      console.log(`⚠️ Missing examples in hard question ${question.id}`);
      return false;
    }
    
    if (!question.commonMistakes) {
      console.log(`⚠️ Missing common mistakes section in hard question ${question.id}`);
      return false;
    }
  }
  
  return true;
}

// Progress bar helper
function createProgressBar(total, name) {
  const bar = new cliProgress.SingleBar({
    format: `🔄 ${name} |{bar}| {percentage}% | {value}/{total} | ETA: {eta_formatted}`,
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true
  });
  bar.start(total, 0);
  return bar;
}

// ========== CORRECTED PROMPT BUILDERS ==========

function buildEasyPrompt(category, count, settings) {
  return `Generate ${count} EASY ${category} questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH (question text and options)
2. ONLY the explanation should be in Hebrew
3. Each sentence has exactly ONE blank marked as '______'
4. Provide exactly 4 answer options
5. Write BRIEF Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
6. Focus on basic grammar

Return ONLY a valid JSON array:
[{
  "type": "${category}",
  "text": "I ______ my homework yesterday evening.",
  "options": ["do", "did", "doing", "done"],
  "correctAnswer": 1,
  "explanation": "התשובה הנכונה היא 'did' כי המילה 'yesterday' מצביעה על זמן עבר פשוט.",
  "difficulty": "easy"
}]`;
}

function buildMediumPrompt(category, count, settings) {
  return `Generate ${count} MEDIUM ${category} questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH (question text and options)
2. ONLY the explanation should be in Hebrew
3. Each sentence has exactly ONE blank marked as '______'
4. Provide exactly 4 answer options
5. Write detailed Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
6. Include ONE practical example in the explanation
7. Explain the grammar rule clearly in Hebrew

Return ONLY a valid JSON array:
[{
  "type": "${category}",
  "text": "If she ______ harder, she would have passed the exam.",
  "options": ["studied", "had studied", "studies", "would study"],
  "correctAnswer": 1,
  "explanation": "התשובה הנכונה היא 'had studied'. זהו משפט תנאי מסוג שלישי (Third Conditional) המתאר מצב היפותטי בעבר. המבנה: If + Past Perfect, would have + Past Participle. דוגמה נוספת: If I had known, I would have come.",
  "grammarRule": "Third Conditional: If + had + V3, would have + V3",
  "difficulty": "medium"
}]`;
}

function buildHardPrompt(category, count, settings) {
  return `Generate ${count} HARD ${category} questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH (question text and options)
2. ONLY the explanation should be in Hebrew (but can include English examples)
3. Each sentence has exactly ONE blank marked as '______'
4. Provide exactly 4 answer options
5. Write comprehensive Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
6. Include 2 practical examples
7. Add common mistakes section
8. Include usage tips

Return ONLY a valid JSON array:
[{
  "type": "${category}",
  "text": "The committee insisted that the proposal ______ before the deadline.",
  "options": ["is submitted", "be submitted", "was submitted", "will be submitted"],
  "correctAnswer": 1,
  "explanation": "התשובה הנכונה היא 'be submitted'. אחרי פעלים של דרישה או המלצה (insist, suggest, recommend) משתמשים ב-Subjunctive Mood. הפועל מופיע בצורת הבסיס ללא הטיות, גם בגוף שלישי. זהו מבנה פורמלי הנפוץ באנגלית אקדמית וכתובה.",
  "examples": [
    "The doctor recommended that she take the medicine.",
    "They demanded that he apologize immediately."
  ],
  "grammarRule": "Subjunctive: demand/suggest/insist + that + subject + base verb",
  "commonMistakes": "טעות נפוצה: להוסיף 's' בגוף שלישי. זכרו - תמיד צורת הבסיס!",
  "usageTip": "בדיבור יומיומי אפשר להשתמש ב-'should be submitted' כחלופה.",
  "difficulty": "hard"
}]`;
}

// Prompt builders for restatement questions
function buildEasyRestatePrompt(category, count, settings) {
  return `Generate ${count} EASY restatement questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH
2. Present an original sentence followed by 4 restatement options
3. Only ONE option should preserve the exact same meaning
4. Write BRIEF Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
5. Focus on basic synonyms and simple paraphrasing

Return ONLY a valid JSON array:
[{
  "type": "restatement",
  "text": "Original: 'The weather is too cold for swimming.'",
  "options": [
    "The weather is perfect for swimming.",
    "It's too warm to go swimming.",
    "The weather is so cold that we can't swim.",
    "We should swim because it's cold."
  ],
  "correctAnswer": 2,
  "explanation": "התשובה הנכונה היא משפט 3 כי 'too cold for' שקול ל-'so cold that we can't'. שניהם מבטאים שהקור מונע שחייה.",
  "difficulty": "easy"
}]`;
}

function buildMediumRestatePrompt(category, count, settings) {
  return `Generate ${count} MEDIUM restatement questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH
2. Present an original sentence followed by 4 restatement options
3. Only ONE option should preserve the exact same meaning
4. Write detailed Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
5. Include ONE example showing similar meaning relationships

Return ONLY a valid JSON array:
[{
  "type": "restatement",
  "text": "Original: 'Despite his lack of experience, he performed exceptionally well.'",
  "options": [
    "Because he lacked experience, he didn't perform well.",
    "He performed exceptionally well even though he lacked experience.",
    "His experience helped him perform exceptionally well.",
    "He performed poorly due to his lack of experience."
  ],
  "correctAnswer": 1,
  "explanation": "התשובה הנכונה היא משפט 2. 'Despite' ו-'even though' מבטאים ניגוד דומה - הוא הצליח למרות חוסר הניסיון. דוגמה נוספת: 'Despite the rain' = 'Even though it rained'.",
  "grammarRule": "Contrast connectors: Despite/In spite of + noun = Even though + clause",
  "difficulty": "medium"
}]`;
}

function buildHardRestatePrompt(category, count, settings) {
  return `Generate ${count} HARD restatement questions for the AMIRAM English exam.

REQUIREMENTS:
1. ALL content in ENGLISH
2. Present an original sentence followed by 4 restatement options
3. Only ONE option should preserve the exact same meaning
4. Write comprehensive Hebrew explanations (${settings.explanationLength.min}-${settings.explanationLength.max} words)
5. Include 2 examples and common mistakes

Return ONLY a valid JSON array with all the required fields for hard level...`;
}

// ========== MAIN GENERATION FUNCTION ==========

async function generateEnhancedHebrewQuestions(category, difficulty, count = 10, isPremium = false) {
  console.log(`\n🎯 Generating ${count} Enhanced ${category} questions (${difficulty}${isPremium ? ' - Premium' : ''})...`);
  
  const settings = ENHANCED_CONFIG.explanationSettings[difficulty];
  
  const enhancedPrompts = {
    'sentence-completion': {
      'easy': buildEasyPrompt(category, count, settings),
      'medium': buildMediumPrompt(category, count, settings),
      'hard': buildHardPrompt(category, count, settings)
    },
    'restatement': {
      'easy': buildEasyRestatePrompt(category, count, settings),
      'medium': buildMediumRestatePrompt(category, count, settings),
      'hard': buildHardRestatePrompt(category, count, settings)
    }
  };

  try {
    const message = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: difficulty === 'hard' ? 3072 : 2048,
      temperature: 0.7,
      messages: [{ role: "user", content: enhancedPrompts[category][difficulty] }]
    });

    const responseText = message.content[0].text;
    const cleanedResponse = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/m, '')
      .trim();
    
    let questions;
    try {
      questions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Response snippet:', cleanedResponse.substring(0, 200) + '...');
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    // Validate the parsed response
    if (!questions) {
      throw new Error('API returned null or undefined response');
    }
    
    if (!Array.isArray(questions)) {
      questions = [questions];
    }
    
    // Additional validation to ensure we have valid questions
    if (questions.length === 0) {
      throw new Error('API returned empty array');
    }
    
    // Check that all questions are valid objects
    const invalidQuestions = questions.filter(q => !q || typeof q !== 'object');
    if (invalidQuestions.length > 0) {
      throw new Error(`API returned ${invalidQuestions.length} invalid question(s)`);
    }
    
    // Generate IDs
    questions.forEach((q, i) => {
      const typePrefix = category === 'sentence-completion' ? 'sc' : 'rst';
      q.id = `${typePrefix}_${isPremium ? 'prem' : 'free'}_${String(ID_RANGES[category].current + i - ID_RANGES[category].start + 1).padStart(3, '0')}`;
      
      q.tags = [
        "grammar", 
        difficulty === "hard" ? "advanced" : difficulty === "medium" ? "intermediate" : "basic",
        isPremium ? "premium" : "free"
      ];
      
      // Metadata about enhanced features
      q.enhancedFeatures = {
        explanationLevel: difficulty,
        hasExamples: settings.includeExamples,
        hasGrammarRules: settings.includeGrammarRules,
        hasCommonMistakes: settings.includeCommonMistakes
      };
    });
    
    ID_RANGES[category].current += questions.length;
    
    return questions;
  } catch (error) {
    console.error('❌ Error generating enhanced questions:', error.message);
    console.error('❌ Stack trace:', error.stack);
    throw error;
  }
}

// Save questions in enhanced JSON format with metadata
async function saveEnhancedHebrewQuestions(questions, category, difficulty, isPremium = false, batchId = null) {
  const timestamp = new Date().toISOString();
  const dir = path.join(CONFIG.hebrewOutputDir, category, difficulty);
  await fs.mkdir(dir, { recursive: true });
  
  const filename = `enhanced_questions_${isPremium ? 'premium' : 'free'}_${timestamp.slice(0, 10)}.json`;
  const filepath = path.join(dir, filename);
  
  // חישוב סטטיסטיקות תוכן
  const contentStats = {
    totalQuestions: questions.length,
    withExamples: questions.filter(q => q.examples && q.examples.length > 0).length,
    withGrammarRules: questions.filter(q => q.grammarRule).length,
    withCommonMistakes: questions.filter(q => q.commonMistakes).length,
    averageExplanationLength: questions.length > 0 ? 
      questions.reduce((sum, q) => sum + (q.explanation ? q.explanation.length : 0), 0) / questions.length 
      : 0
  };
  
  const output = {
    metadata: {
      generated: timestamp,
      type: category,
      difficulty: difficulty,
      count: questions.length,
      topic: difficulty === 'easy' ? 'Basic Grammar' : difficulty === 'medium' ? 'Intermediate Grammar' : 'Advanced Grammar',
      tags: isPremium ? ["grammar", "vocabulary", "premium", "enhanced"] : ["grammar", "vocabulary", "enhanced"],
      model: CONFIG.model,
      is_premium: isPremium,
      batch_id: batchId || generateBatchId(),
      version: "enhanced_hybrid_v1",
      contentStats: contentStats
    },
    questions: questions
  };
  
  await fs.writeFile(filepath, JSON.stringify(output, null, 2));
  console.log(`✅ Saved enhanced file: ${filepath}`);
  console.log(`📊 Content stats: ${contentStats.withExamples} with examples, ${contentStats.withGrammarRules} with rules`);
  
  return filepath;
}

// ========== DATABASE FORMAT ==========

function formatForDatabase(question, batchId) {
  // Generate proper UUID for database
  const dbId = generateUUID();
  
  // Create metadata object
  const metadata = {
    custom_id: question.id, // Store original custom ID
    tags: question.tags || [],
    enhanced_features: question.enhancedFeatures || {},
    grammar_rule: question.grammarRule || null,
    examples: question.examples || null,
    common_mistakes: question.commonMistakes || null,
    usage_tip: question.usageTip || null
  };
  
  return {
    id: dbId, // Use UUID for database
    question_text: question.text,
    answer_options: question.options,
    correct_answer: (question.correctAnswer ?? 0).toString(),
    explanation: question.explanation,
    type: question.type,
    difficulty: question.difficulty,
    is_premium: question.tags && question.tags.includes('premium'),
    ai_generated: true,
    generation_model: 'claude-sonnet-4-20250514',
    batch_id: batchId,
    quality_score: question.difficulty === 'hard' ? 95 : question.difficulty === 'medium' ? 90 : 85,
    metadata: metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// ========== SUPABASE INTEGRATION ==========

async function uploadBatch(batchId) {
  console.log(`\n💾 Starting upload for batch: ${batchId}`);
  
  if (!supabase) {
    console.error('❌ Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file.');
    return;
  }
  
  try {
    // Find all files with this batch ID
    const files = await findBatchFiles(batchId);
    if (files.length === 0) {
      console.log(`⚠️ No files found for batch ID: ${batchId}`);
      return;
    }
    
    console.log(`📝 Found ${files.length} files to upload`);
    
    let totalQuestions = 0;
    let uploadedCount = 0;
    
    // Count total questions first
    for (const file of files) {
      const data = JSON.parse(await fs.readFile(file, 'utf8'));
      totalQuestions += data.questions.length;
    }
    
    const progressBar = createProgressBar(totalQuestions, 'Uploading to Supabase');
    
    for (const file of files) {
      const data = JSON.parse(await fs.readFile(file, 'utf8'));
      
      for (const question of data.questions) {
        // Format for database
        const dbQuestion = formatForDatabase(question, batchId);
        
        // Check for duplicates using custom_id in metadata
        const { data: existing } = await supabase
          .from('questions')
          .select('id, metadata')
          .eq('metadata->custom_id', question.id)
          .maybeSingle();
        
        if (existing) {
          console.log(`⚠️ Skipping duplicate: ${question.id} (DB ID: ${existing.id})`);
          progressBar.increment();
          continue;
        }
        
        // Upload with retry logic
        let retries = 0;
        let uploaded = false;
        
        while (retries < CONFIG.maxUploadRetries && !uploaded) {
          try {
            const { data: insertedData, error } = await supabase
              .from('questions')
              .insert(dbQuestion)
              .select('id');
            
            if (error) {
              console.error(`❌ Supabase error for ${question.id}:`, {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
              });
              throw error;
            }
            
            uploaded = true;
            uploadedCount++;
            console.log(`✅ Uploaded ${question.id} → ${insertedData[0].id}`);
            progressBar.increment();
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, CONFIG.uploadRateLimit));
            
          } catch (error) {
            retries++;
            console.log(`⚠️ Upload failed for ${question.id}, retry ${retries}/${CONFIG.maxUploadRetries}`);
            console.log(`   Error: ${error.message}`);
            
            if (retries >= CONFIG.maxUploadRetries) {
              console.log(`❌ Failed to upload ${question.id} after ${CONFIG.maxUploadRetries} retries`);
              console.log(`   Final error: ${error.message}`);
              progressBar.increment();
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
          }
        }
      }
    }
    
    progressBar.stop();
    console.log(`\n✅ Upload complete! ${uploadedCount}/${totalQuestions} questions uploaded successfully`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

async function findBatchFiles(batchId) {
  const files = [];
  
  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name.endsWith('.json')) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const data = JSON.parse(content);
            if (data.metadata && data.metadata.batch_id === batchId) {
              files.push(fullPath);
            }
          } catch (e) {
            // Skip invalid JSON files
          }
        }
      }
    } catch (e) {
      // Skip directories that don't exist
    }
  }
  
  await scanDirectory(CONFIG.hebrewOutputDir);
  return files;
}

// ========== MAIN FUNCTION ==========

async function main() {
  const [command, ...args] = process.argv.slice(2);
  
  if (!command || command === 'help') {
    console.log(`\n📚 Enhanced Question Generator v4.0\n`);
    console.log(`🧪 TESTING COMMANDS:`);
    console.log(`  sample-test                                    Generate 6 sample questions for testing`);
    console.log(`\n🚀 PRODUCTION COMMANDS:`);
    console.log(`  batch-enhanced-all --premium --count=167      Generate full production batch`);
    console.log(`  retry-single --type=TYPE --difficulty=DIFF --count=N  Retry specific type/difficulty`);
    console.log(`\n💾 DATABASE COMMANDS:`);
    console.log(`  upload-batch [batch-id]                       Upload to Supabase`);
    console.log(`\n💡 Usage Examples:`);
    console.log(`  node question-generator.mjs sample-test`);
    console.log(`  node question-generator.mjs batch-enhanced-all --premium --count=167`);
    console.log(`  node question-generator.mjs upload-batch batch_xxx\n`);
    return;
  }

  await loadIds();
  
  try {
    // Sample Test command - generate one question per type/difficulty for testing
    if (command === 'sample-test') {
      console.log(`\n🧪 Generating sample test questions...`);
      
      const types = ['sentence-completion', 'restatement'];
      const difficulties = ['easy', 'medium', 'hard'];
      const batchId = generateBatchId();
      
      console.log(`🔢 Sample Test Batch ID: ${batchId}`);
      
      for (const type of types) {
        for (const difficulty of difficulties) {
          try {
            console.log(`\n🎯 Generating ${type} - ${difficulty}...`);
            const questions = await generateEnhancedHebrewQuestions(type, difficulty, 1, true); // 1 premium question each
            await saveEnhancedHebrewQuestions(questions, type, difficulty, true, batchId);
            
            // Show sample database format
            console.log(`\n📋 Sample database object for ${type}-${difficulty}:`);
            const dbFormat = formatForDatabase(questions[0], batchId);
            console.log(JSON.stringify(dbFormat, null, 2));
            
          } catch (error) {
            console.error(`❌ Failed to generate ${type}-${difficulty}: ${error.message}`);
          }
        }
      }
      
      await saveIds();
      
      console.log(`\n✅ Sample test generation complete!`);
      console.log(`🔢 Batch ID: ${batchId}`);
      console.log(`\n💡 To test upload, run:`);
      console.log(`node question-generator.mjs upload-batch ${batchId}`);
      return;
    }
    
    // Upload Batch command
    if (command === 'upload-batch') {
      const batchId = args[0];
      if (!batchId) {
        console.error('❌ Usage: upload-batch [batch-id]');
        return;
      }
      
      await uploadBatch(batchId);
      return;
    }
    
    // Retry Single command - generate specific type/difficulty combination
    if (command === 'retry-single') {
      const typeArg = args.find(arg => arg.startsWith('--type='));
      const diffArg = args.find(arg => arg.startsWith('--difficulty='));
      const countArg = args.find(arg => arg.startsWith('--count='));
      const isPremium = args.includes('--premium');
      
      if (!typeArg || !diffArg || !countArg) {
        console.error('❌ Usage: retry-single --type=TYPE --difficulty=DIFFICULTY --count=N [--premium]');
        console.error('   Types: sentence-completion, restatement');
        console.error('   Difficulties: easy, medium, hard');
        return;
      }
      
      const type = typeArg.split('=')[1];
      const difficulty = diffArg.split('=')[1];
      const count = parseInt(countArg.split('=')[1]);
      
      if (!['sentence-completion', 'restatement'].includes(type)) {
        console.error('❌ Invalid type. Use: sentence-completion, restatement');
        return;
      }
      
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        console.error('❌ Invalid difficulty. Use: easy, medium, hard');
        return;
      }
      
      if (isNaN(count) || count <= 0) {
        console.error('❌ Invalid count. Must be a positive number');
        return;
      }
      
      console.log(`\n🔄 Retrying generation for ${type} - ${difficulty}`);
      console.log(`📊 Questions to generate: ${count}`);
      console.log(`💎 Premium mode: ${isPremium ? 'Yes' : 'No'}`);
      
      const batchId = generateBatchId();
      console.log(`🔢 New Batch ID: ${batchId}`);
      
      try {
        console.log(`\n🎯 Generating ${count} ${type} - ${difficulty} questions...`);
        
        // Generate one question at a time for maximum reliability
        const allQuestions = [];
        
        for (let i = 0; i < count; i++) {
          console.log(`  📝 Question ${i + 1}/${count}...`);
          
          const batchQuestions = await generateEnhancedHebrewQuestions(type, difficulty, 1, isPremium);
          allQuestions.push(...batchQuestions);
          
          // Small delay between questions
          if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        const filePath = await saveEnhancedHebrewQuestions(allQuestions, type, difficulty, isPremium, batchId);
        
        await saveIds();
        
        console.log(`\n✅ Successfully generated ${allQuestions.length} questions!`);
        console.log(`📁 Saved to: ${filePath}`);
        console.log(`🔢 Batch ID: ${batchId}`);
        console.log(`\n💡 To upload to Supabase, run:`);
        console.log(`node question-generator.mjs upload-batch ${batchId}`);
        
      } catch (error) {
        console.error(`\n❌ Failed to generate ${type} ${difficulty}: ${error.message}`);
        console.error('💡 Try reducing the count or check your API key');
      }
      
      return;
    }
    
    // Generate full production batch
    if (command === 'batch-enhanced-all') {
      const isPremium = args.includes('--premium');
      const countArg = args.find(arg => arg.startsWith('--count='));
      const count = countArg ? parseInt(countArg.split('=')[1]) : 167;
      
      console.log(`\n🚀 Starting FULL PRODUCTION batch generation`);
      console.log(`📊 Questions per file: ${count}`);
      console.log(`💎 Premium mode: ${isPremium ? 'Yes' : 'No'}`);
      console.log(`🎯 Total questions: ${count * 6} (2 types × 3 difficulties)`);
      
      const types = ['sentence-completion', 'restatement'];
      const difficulties = ['easy', 'medium', 'hard'];
      const totalFiles = types.length * difficulties.length;
      
      const batchId = generateBatchId();
      console.log(`🔢 Batch ID: ${batchId}`);
      
      const progressBar = createProgressBar(totalFiles, 'Production Generation');
      
      let completedFiles = 0;
      const results = [];
      
      for (const type of types) {
        for (const difficulty of difficulties) {
          try {
            console.log(`\n🎯 Generating ${count} ${type} - ${difficulty} questions...`);
            
            // Generate one question at a time for maximum reliability
            const allQuestions = [];
            
            for (let i = 0; i < count; i++) {
              console.log(`  📝 Question ${i + 1}/${count}...`);
              
              const batchQuestions = await generateEnhancedHebrewQuestions(type, difficulty, 1, isPremium);
              allQuestions.push(...batchQuestions);
              
              // Small delay between questions
              if (i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
            
            const questions = allQuestions;
            const filePath = await saveEnhancedHebrewQuestions(questions, type, difficulty, isPremium, batchId);
            
            results.push({
              type,
              difficulty,
              count: questions.length,
              filePath
            });
            
            completedFiles++;
            progressBar.increment();
            
            // Delay between generations to avoid rate limits
            const delay = difficulty === 'hard' ? 3000 : difficulty === 'medium' ? 2500 : 2000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
          } catch (error) {
            console.error(`\n❌ Failed: ${type} ${difficulty} - ${error.message}`);
            results.push({
              type,
              difficulty,
              count: 0,
              filePath: 'FAILED'
            });
            completedFiles++;
            progressBar.increment();
          }
        }
      }
      
      progressBar.stop();
      await saveIds();
      
      // Display summary
      const totalGenerated = results.reduce((sum, r) => sum + r.count, 0);
      console.log(`\n🎉 PRODUCTION BATCH COMPLETE!`);
      console.log(`📝 Total questions generated: ${totalGenerated}`);
      console.log(`🔢 Batch ID: ${batchId}`);
      console.log(`\n💡 To upload all questions, run:`);
      console.log(`node question-generator.mjs upload-batch ${batchId}`);
      
      return;
    }
    
    console.log('❌ Unknown command. Use "help" for available commands.');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run
main().catch(console.error);

// Export for testing
export {
  generateEnhancedHebrewQuestions,
  saveEnhancedHebrewQuestions,
  validateEnhancedQuestion,
  formatForDatabase
};