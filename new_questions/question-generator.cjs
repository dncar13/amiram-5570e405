// enhanced-question-generator.js - Enhanced AMIRAM Question Generator v4.0
require('dotenv').config({ path: '../.env' });
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cliProgress = require('cli-progress');
const archiver = require('archiver');
const Anthropic = require('@anthropic-ai/sdk');

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
  hebrewOutputDir: './questions-hebrew',
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
6. Include grammar rules and usage tips

Return ONLY a valid JSON array:
[{
  "type": "restatement",
  "text": "Original: 'Complex sentence here'",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0,
  "explanation": "Hebrew explanation here",
  "examples": ["example1", "example2"],
  "grammarRule": "Grammar rule here",
  "commonMistakes": "Common mistakes here",
  "usageTip": "Usage tip here",
  "difficulty": "hard"
}]`;
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
    
    let questions = JSON.parse(cleanedResponse);
    
    if (!Array.isArray(questions)) {
      questions = [questions];
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
    throw error;
  }
}

// Save questions in enhanced JSON format with metadata
async function saveEnhancedHebrewQuestions(questions, category, difficulty, isPremium = false, batchId = null) {
  const timestamp = new Date().toISOString();
  const dir = path.join(CONFIG.hebrewOutputDir, category, difficulty);
  await fs.mkdir(dir, { recursive: true });
  
  const filename = `enhanced_questions_${isPremium ? 'premium' : 'free'}_${timestamp.slice(0, 10)}_${timestamp.slice(11, 19).replace(/:/g, '-')}.json`;
  const filepath = path.join(dir, filename);
  
  // חישוב סטטיסטיקות תוכן
  const contentStats = {
    totalQuestions: questions.length,
    withExamples: questions.filter(q => q.examples).length,
    withGrammarRules: questions.filter(q => q.grammarRule).length,
    withCommonMistakes: questions.filter(q => q.commonMistakes).length,
    averageExplanationLength: questions.reduce((sum, q) => sum + q.explanation.length, 0) / questions.length
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
    correct_answer: question.correctAnswer.toString(),
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

function getTopicId(topic) {
  // Map topics to IDs (you can customize this)
  const topicMap = {
    'sentence-completion': 1,
    'restatement': 2,
    'Third Conditional': 101,
    'Subjunctive Mood': 102,
    'Past Perfect': 103,
    // Add more mappings as needed
  };
  return topicMap[topic] || 1;
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

async function checkDuplicates(batchId) {
  console.log(`\n🔍 Checking for duplicates in batch: ${batchId}`);
  
  if (!supabase) {
    console.error('❌ Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file.');
    return;
  }
  
  const files = await findBatchFiles(batchId);
  const duplicates = [];
  
  for (const file of files) {
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    
    for (const question of data.questions) {
      const { data: existing } = await supabase
        .from('questions')
        .select('id')
        .eq('id', question.id)
        .single();
      
      if (existing) {
        duplicates.push(question.id);
      }
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`⚠️ Found ${duplicates.length} duplicates:`);
    duplicates.forEach(id => console.log(`  - ${id}`));
  } else {
    console.log(`✅ No duplicates found for batch ${batchId}`);
  }
  
  return duplicates;
}

// ========== VALIDATION SYSTEM ==========

async function validateQuestions(directory) {
  console.log(`\n✅ Validating questions in: ${directory}`);
  
  const results = {
    totalFiles: 0,
    totalQuestions: 0,
    validQuestions: 0,
    issues: []
  };
  
  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name.endsWith('.json')) {
          results.totalFiles++;
          
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const data = JSON.parse(content);
            
            if (data.questions) {
              for (const question of data.questions) {
                results.totalQuestions++;
                
                // Use enhanced validation
                if (validateEnhancedQuestion(question)) {
                  results.validQuestions++;
                } else {
                  results.issues.push({
                    file: fullPath,
                    questionId: question.id,
                    issues: getValidationIssues(question)
                  });
                }
              }
            }
          } catch (e) {
            results.issues.push({
              file: fullPath,
              questionId: 'N/A',
              issues: ['Invalid JSON format']
            });
          }
        }
      }
    } catch (e) {
      console.log(`⚠️ Cannot access directory: ${dir}`);
    }
  }
  
  await scanDirectory(directory);
  
  // Display results
  console.log(`\n📊 Validation Results:`);
  console.log(`✅ Validated ${results.totalQuestions} questions in ${results.totalFiles} files`);
  
  if (results.issues.length > 0) {
    console.log(`❌ Found ${results.issues.length} issues:`);
    results.issues.forEach(issue => {
      console.log(`  - ${issue.questionId}: ${issue.issues.join(', ')}`);
    });
  }
  
  const successRate = ((results.validQuestions / results.totalQuestions) * 100).toFixed(1);
  console.log(`📊 Success rate: ${successRate}%`);
  
  return results;
}

function getValidationIssues(question) {
  const issues = [];
  
  if (!question.options || question.options.length !== 4) {
    issues.push('Invalid options array');
  }
  
  if (question.correctAnswer < 0 || question.correctAnswer > 3) {
    issues.push('correctAnswer out of range');
  }
  
  if (!validateHebrewText(question.explanation)) {
    issues.push('Hebrew explanation invalid or too short');
  }
  
  if (question.type === 'sentence-completion' && !question.text.includes('______')) {
    issues.push('Missing blank in sentence-completion question');
  }
  
  return issues;
}

// ========== MANAGEMENT TOOLS ==========

async function generateStats() {
  console.log(`\n📊 Enhanced Question Generator Statistics\n`);
  
  const stats = {
    totalFiles: 0,
    totalQuestions: 0,
    premiumQuestions: 0,
    freeQuestions: 0,
    byType: {},
    byDifficulty: {},
    enhancedFeatures: {
      withExamples: 0,
      withGrammarRules: 0,
      withCommonMistakes: 0,
      withUsageTips: 0
    },
    latestBatch: null,
    latestGenerated: null
  };
  
  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name.endsWith('.json')) {
          stats.totalFiles++;
          
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const data = JSON.parse(content);
            
            if (data.questions) {
              stats.totalQuestions += data.questions.length;
              
              // Track latest
              if (!stats.latestGenerated || data.metadata.generated > stats.latestGenerated) {
                stats.latestGenerated = data.metadata.generated;
                stats.latestBatch = data.metadata.batch_id;
              }
              
              // Count by premium/free
              if (data.metadata.is_premium) {
                stats.premiumQuestions += data.questions.length;
              } else {
                stats.freeQuestions += data.questions.length;
              }
              
              // Count by type
              const type = data.metadata.type;
              stats.byType[type] = (stats.byType[type] || 0) + data.questions.length;
              
              // Count by difficulty
              const difficulty = data.metadata.difficulty;
              stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + data.questions.length;
              
              // Count enhanced features
              data.questions.forEach(q => {
                if (q.examples) stats.enhancedFeatures.withExamples++;
                if (q.grammarRule) stats.enhancedFeatures.withGrammarRules++;
                if (q.commonMistakes) stats.enhancedFeatures.withCommonMistakes++;
                if (q.usageTip) stats.enhancedFeatures.withUsageTips++;
              });
            }
          } catch (e) {
            // Skip invalid files
          }
        }
      }
    } catch (e) {
      // Skip directories that don't exist
    }
  }
  
  await scanDirectory(CONFIG.hebrewOutputDir);
  
  // Display stats
  console.log(`📁 Total files: ${stats.totalFiles}`);
  console.log(`📝 Total questions: ${stats.totalQuestions.toLocaleString()}`);
  console.log(`💎 Premium questions: ${stats.premiumQuestions.toLocaleString()} (${((stats.premiumQuestions / stats.totalQuestions) * 100).toFixed(1)}%)`);
  console.log(`🆓 Free questions: ${stats.freeQuestions.toLocaleString()} (${((stats.freeQuestions / stats.totalQuestions) * 100).toFixed(1)}%)\n`);
  
  console.log(`📋 By Type:`);
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count.toLocaleString()} questions`);
  });
  
  console.log(`\n🎯 By Difficulty:`);
  Object.entries(stats.byDifficulty).forEach(([difficulty, count]) => {
    console.log(`  - ${difficulty}: ${count.toLocaleString()} questions`);
  });
  
  console.log(`\n✨ Enhanced Features:`);
  console.log(`  - With examples: ${stats.enhancedFeatures.withExamples} (${((stats.enhancedFeatures.withExamples / stats.totalQuestions) * 100).toFixed(1)}%)`);
  console.log(`  - With grammar rules: ${stats.enhancedFeatures.withGrammarRules} (${((stats.enhancedFeatures.withGrammarRules / stats.totalQuestions) * 100).toFixed(1)}%)`);
  console.log(`  - With common mistakes: ${stats.enhancedFeatures.withCommonMistakes} (${((stats.enhancedFeatures.withCommonMistakes / stats.totalQuestions) * 100).toFixed(1)}%)`);
  console.log(`  - With usage tips: ${stats.enhancedFeatures.withUsageTips} (${((stats.enhancedFeatures.withUsageTips / stats.totalQuestions) * 100).toFixed(1)}%)`);
  
  console.log(`\n🕐 Last generated: ${stats.latestGenerated ? new Date(stats.latestGenerated).toLocaleString() : 'N/A'}`);
  console.log(`📦 Latest batch: ${stats.latestBatch || 'N/A'}`);
  
  return stats;
}

async function cleanup(olderThanDays = 7) {
  console.log(`\n🧹 Cleaning up files older than ${olderThanDays} days...`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  let deletedCount = 0;
  
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
            
            if (data.metadata && data.metadata.generated) {
              const fileDate = new Date(data.metadata.generated);
              if (fileDate < cutoffDate) {
                await fs.unlink(fullPath);
                deletedCount++;
                console.log(`🗑️ Deleted: ${fullPath}`);
              }
            }
          } catch (e) {
            // Skip invalid files
          }
        }
      }
    } catch (e) {
      // Skip directories that don't exist
    }
  }
  
  await scanDirectory(CONFIG.hebrewOutputDir);
  
  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} files`);
}

async function createBackup(format = 'zip', outputPath = null) {
  if (!outputPath) {
    outputPath = `backup-${new Date().toISOString().slice(0, 10)}.${format}`;
  }
  
  console.log(`\n💾 Creating backup: ${outputPath}`);
  
  const output = require('fs').createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✅ Backup created: ${outputPath} (${archive.pointer()} bytes)`);
      resolve(outputPath);
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    
    // Add Hebrew questions directory
    archive.directory(CONFIG.hebrewOutputDir, 'questions-hebrew');
    
    // Add configuration files
    archive.file('package.json', { name: 'package.json' });
    archive.file('last-ids.json', { name: 'last-ids.json' });
    archive.file('.env', { name: '.env' });
    
    archive.finalize();
  });
}

// ========== BATCH COMMANDS ==========

async function batchEnhancedAll(isPremium = false, count = 20) {
  console.log(`\n🚀 Starting ENHANCED batch generation for all types and difficulties`);
  console.log(`📊 Questions per file: ${count}`);
  console.log(`💎 Premium mode: ${isPremium ? 'Yes' : 'No'}`);
  console.log(`🎨 Using hybrid approach: Easy (basic) → Medium (+ examples) → Hard (full package)`);
  
  const types = ['sentence-completion', 'restatement'];
  const difficulties = ['easy', 'medium', 'hard'];
  const totalFiles = types.length * difficulties.length;
  
  const batchId = generateBatchId();
  console.log(`🔢 Batch ID: ${batchId}`);
  
  const progressBar = createProgressBar(totalFiles, 'Enhanced Batch Generation');
  
  let completedFiles = 0;
  const results = [];
  
  for (const type of types) {
    for (const difficulty of difficulties) {
      try {
        progressBar.update(completedFiles, {
          type: type,
          difficulty: difficulty,
          features: difficulty === 'easy' ? 'basic' : difficulty === 'medium' ? 'examples' : 'full',
          eta_formatted: `${Math.ceil((totalFiles - completedFiles) * 45 / 60)}m`
        });
        
        const questions = await generateEnhancedHebrewQuestions(type, difficulty, count, isPremium);
        const filePath = await saveEnhancedHebrewQuestions(questions, type, difficulty, isPremium, batchId);
        
        results.push({
          type,
          difficulty,
          count: questions.length,
          features: ENHANCED_CONFIG.explanationSettings[difficulty],
          filePath
        });
        
        completedFiles++;
        progressBar.increment();
        
        // Delay מותאם לגודל התוכן
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
  
  // Display enhanced summary
  displayEnhancedSummary(results, batchId);
  
  return batchId;
}

function displayEnhancedSummary(results, batchId) {
  console.log(`\n📊 Enhanced Batch Generation Summary:`);
  console.log('┌─────────────────────┬────────────┬───────────┬─────────────────────┬──────────────────────────────┐');
  console.log('│ Type                │ Difficulty │ Questions │ Enhanced Features   │ Status                       │');
  console.log('├─────────────────────┼────────────┼───────────┼─────────────────────┼──────────────────────────────┤');
  
  let totalQuestions = 0;
  let totalWithExamples = 0;
  
  results.forEach(result => {
    totalQuestions += result.count;
    
    let features = 'Basic';
    if (result.difficulty === 'medium') {
      features = '📚 Examples';
      totalWithExamples += result.count;
    } else if (result.difficulty === 'hard') {
      features = '📚 Ex + ⚠️ Tips + 📖 Rules';
      totalWithExamples += result.count;
    }
    
    const status = result.count > 0 ? '✅ Complete' : '❌ Failed';
    console.log(`│ ${result.type.padEnd(19)} │ ${result.difficulty.padEnd(10)} │ ${result.count.toString().padEnd(9)} │ ${features.padEnd(19)} │ ${status.padEnd(28)} │`);
  });
  
  console.log('└─────────────────────┴────────────┴───────────┴─────────────────────┴──────────────────────────────┘');
  console.log(`\n🎯 Total Questions Generated: ${totalQuestions}`);
  console.log(`📚 Questions with enhanced features: ${totalWithExamples} (${((totalWithExamples / totalQuestions) * 100).toFixed(1)}%)`);
  console.log(`💰 Estimated cost efficiency: ~${((totalWithExamples * 0.5 + (totalQuestions - totalWithExamples) * 0.3) / totalQuestions).toFixed(1)}x base cost`);
  console.log(`🔢 Batch ID: ${batchId}`);
  console.log(`\n💡 Tip: Use 'upload-batch ${batchId}' to upload to database`);
}

async function customBatch(types, difficulties, count, isPremium = false) {
  console.log(`\n🚀 Starting custom enhanced batch generation`);
  console.log(`📋 Types: ${types.join(', ')}`);
  console.log(`🎯 Difficulties: ${difficulties.join(', ')}`);
  console.log(`📊 Questions per file: ${count}`);
  console.log(`💎 Premium mode: ${isPremium ? 'Yes' : 'No'}`);
  
  const totalFiles = types.length * difficulties.length;
  const batchId = generateBatchId();
  
  console.log(`🔢 Batch ID: ${batchId}`);
  
  const progressBar = createProgressBar(totalFiles, 'Custom Enhanced Batch');
  
  let completedFiles = 0;
  const results = [];
  
  for (const type of types) {
    for (const difficulty of difficulties) {
      try {
        const questions = await generateEnhancedHebrewQuestions(type, difficulty, count, isPremium);
        const filePath = await saveEnhancedHebrewQuestions(questions, type, difficulty, isPremium, batchId);
        
        results.push({
          type,
          difficulty,
          count: questions.length,
          filePath
        });
        
        completedFiles++;
        progressBar.increment();
        
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
        
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
  
  console.log(`\n✅ Custom enhanced batch generation complete!`);
  console.log(`🔢 Batch ID: ${batchId}`);
  
  return batchId;
}

// ========== ENHANCED HELP SYSTEM ==========

function showHelp(category = null) {
  if (category === 'enhanced') {
    console.log(`\n🔥 Enhanced Generation Features\n`);
    console.log(`📊 Enhancement by difficulty:`);
    console.log(`  Easy:   Basic explanations only (30-50 words Hebrew)`);
    console.log(`  Medium: + 1 example + grammar rule (50-100 words)`);
    console.log(`  Hard:   + 2 examples + common mistakes + usage tips (100-150 words)\n`);
    
    console.log(`💡 Key Features:`);
    console.log(`  - ALL questions in English only`);
    console.log(`  - Hebrew explanations with progressive detail`);
    console.log(`  - Smart cost optimization (~1.5x base cost)`);
    console.log(`  - Database-ready format\n`);
    
    return;
  }
  
  if (category === 'batch-commands') {
    console.log(`\n🚀 Enhanced Batch Commands Help\n`);
    console.log(`📝 hebrew-json-enhanced [type] [difficulty] [count] [--premium]`);
    console.log(`   Generate enhanced questions with progressive features`);
    console.log(`   Shortcut: hje`);
    console.log(`   Example: node enhanced-question-generator.js hje sentence-completion medium 20 --premium\n`);
    
    console.log(`📦 batch-enhanced-all [--premium] [--count=N]`);
    console.log(`   Generate all types and difficulties with enhancement`);
    console.log(`   Example: node enhanced-question-generator.js batch-enhanced-all --premium --count=30\n`);
    
    console.log(`🎯 custom-batch --types=T1,T2 --difficulties=D1,D2 --count=N [--premium]`);
    console.log(`   Generate custom combinations with enhancement`);
    console.log(`   Example: node enhanced-question-generator.js custom-batch --types=sentence-completion --difficulties=medium,hard --count=25 --premium\n`);
    
    return;
  }
  
  if (category === 'database') {
    console.log(`\n💾 Database Commands Help\n`);
    console.log(`💾 upload-batch [batch-id]`);
    console.log(`   Upload enhanced questions to Supabase`);
    console.log(`   Includes all enhanced fields (examples, rules, tips)`);
    console.log(`   Example: node enhanced-question-generator.js upload-batch batch_1234567890_abc123def\n`);
    
    console.log(`🔍 check-duplicates --batch-id=xxx`);
    console.log(`   Check for duplicate questions before uploading`);
    console.log(`   Example: node enhanced-question-generator.js check-duplicates --batch-id=batch_1234567890_abc123def\n`);
    
    console.log(`📊 Required Environment Variables:`);
    console.log(`   SUPABASE_URL=your_supabase_url`);
    console.log(`   SUPABASE_ANON_KEY=your_supabase_anon_key`);
    console.log(`   ANTHROPIC_API_KEY=your_claude_api_key\n`);
    
    return;
  }
  
  if (category === 'validation') {
    console.log(`\n✅ Enhanced Validation Commands Help\n`);
    console.log(`✅ validate-questions [directory]`);
    console.log(`   Validate enhanced question format and features`);
    console.log(`   Example: node enhanced-question-generator.js validate-questions questions-hebrew/\n`);
    
    console.log(`📊 Enhanced Validation Checks:`);
    console.log(`   Basic checks:`);
    console.log(`   - Exactly 4 answer options`);
    console.log(`   - correctAnswer between 0-3`);
    console.log(`   - Valid Hebrew text in explanations (>10 characters)`);
    console.log(`   - Proper blank format for sentence-completion (______)\n`);
    
    console.log(`   Enhanced checks:`);
    console.log(`   - Medium questions must have examples`);
    console.log(`   - Hard questions must have 2+ examples`);
    console.log(`   - Hard questions must have common mistakes`);
    console.log(`   - Grammar rules format validation\n`);
    
    return;
  }
  
  // Main help
  console.log(`\n📚 Enhanced Question Generator v4.0\n`);
  console.log(`🔥 ENHANCED HEBREW COMMANDS:`);
  console.log(`  hebrew-json-enhanced (hje) [type] [difficulty] [count] [--premium]  Enhanced generation`);
  console.log(`  batch-enhanced-all [--premium] [--count=N]                        Generate all with enhancement`);
  console.log(`  custom-batch --types=T1,T2 --difficulties=D1,D2 --count=N         Custom enhanced generation\n`);
  
  console.log(`🧪 TESTING COMMANDS:`);
  console.log(`  sample-test                                                       Generate 6 sample questions for testing`);
  console.log(`\n💾 DATABASE COMMANDS:`);
  console.log(`  upload-batch [batch-id]                                           Upload to Supabase`);
  console.log(`  check-duplicates --batch-id=xxx                                   Check for duplicates\n`);
  
  console.log(`✅ VALIDATION COMMANDS:`);
  console.log(`  validate-questions [directory]                                    Validate enhanced format\n`);
  
  console.log(`🛠️ MANAGEMENT COMMANDS:`);
  console.log(`  stats                                                            Show enhanced statistics`);
  console.log(`  cleanup --older-than=7d                                          Remove old files`);
  console.log(`  backup --format=zip --output=backup.zip                          Create backup\n`);
  
  console.log(`📚 DETAILED HELP:`);
  console.log(`  help enhanced         Show enhancement features`);
  console.log(`  help batch-commands   Show detailed batch commands`);
  console.log(`  help database        Show database integration`);
  console.log(`  help validation      Show validation system\n`);
  
  console.log(`💎 Categories: sentence-completion, restatement`);
  console.log(`🎯 Difficulties: easy, medium, hard\n`);
  
  console.log(`💡 Common Usage Examples:\n`);
  console.log(`📝 Generate enhanced test set (180 questions):`);
  console.log(`  node enhanced-question-generator.js batch-enhanced-all --count=30 --premium\n`);
  console.log(`💾 Upload to database:`);
  console.log(`  node enhanced-question-generator.js upload-batch batch_xxx\n`);
  console.log(`✅ Quality check:`);
  console.log(`  node enhanced-question-generator.js validate-questions questions-hebrew/\n`);
  console.log(`📊 View enhanced statistics:`);
  console.log(`  node enhanced-question-generator.js stats\n`);
}

// ========== MAIN FUNCTION ==========

async function main() {
  const [command, ...args] = process.argv.slice(2);
  
  if (!command || command === 'help') {
    showHelp(args[0]);
    return;
  }

  await loadIds();
  
  try {
    // ENHANCED: Hebrew JSON Enhanced command
    if (command === 'hebrew-json-enhanced' || command === 'hje') {
      const [type, difficulty, count] = args;
      const isPremium = args.includes('--premium');
      
      if (!type || !difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
        console.error('❌ Usage: hebrew-json-enhanced [type] [difficulty] [count] [--premium]');
        console.error('   Shortcut: hje');
        return;
      }
      

if (command === 'auto-complete') {
  const countArg = args.find(arg => arg.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1]) : 50;
  const autoUpload = args.includes('--upload');
  
  console.log(`\n🚀 FULL AUTO MODE - Zero effort, maximum results!`);
  console.log(`📊 Questions per file: ${count}`);
  console.log(`💎 Mode: Premium (automatic)`);
  console.log(`🎯 Total questions: ${count * 6} (${count} × 6 categories)`);
  console.log(`📤 Auto-upload: ${autoUpload ? 'Yes' : 'No'}`);
  
  try {
    // Step 1: Generate everything
    console.log(`\n🔥 Step 1: Generating all questions...`);
    const batchId = await batchEnhancedAll(true, count); // Force premium
    
    // Step 2: Auto-upload if requested
    if (autoUpload) {
      console.log(`\n📤 Step 2: Auto-uploading to database...`);
      await uploadBatch(batchId);
      
      console.log(`\n✅ COMPLETE SUCCESS! 🎉`);
      console.log(`📝 Generated: ${count * 6} premium questions`);
      console.log(`💾 Uploaded to database: Yes`);
      console.log(`🔢 Batch ID: ${batchId}`);
      console.log(`\n🎯 You're done! Everything is ready.`);
    } else {
      console.log(`\n✅ GENERATION COMPLETE! 🎉`);
      console.log(`📝 Generated: ${count * 6} premium questions`);
      console.log(`🔢 Batch ID: ${batchId}`);
      console.log(`\n💡 To upload to database, run:`);
      console.log(`node question-generator.js upload-batch ${batchId}`);
    }
    
  } catch (error) {
    console.error(`❌ Auto-complete failed: ${error.message}`);
    console.log(`\n🔧 Try with smaller count: --count=30`);
  }
  
  return;
}



      if (!['sentence-completion', 'restatement'].includes(type)) {
        console.error('❌ Invalid type. Use: sentence-completion, restatement');
        return;
      }
      
      const questionCount = parseInt(count) || 10;
      const batchId = generateBatchId();
      
      console.log(`\n🚀 Starting Enhanced Hebrew JSON generation...`);
      console.log(`📋 Type: ${type}`);
      console.log(`🎯 Difficulty: ${difficulty}`);
      console.log(`📊 Count: ${questionCount}`);
      console.log(`💎 Premium: ${isPremium ? 'Yes' : 'No'}`);
      console.log(`✨ Enhanced Features: ${difficulty === 'easy' ? 'Basic' : difficulty === 'medium' ? 'Examples + Rules' : 'Full Package'}`);
      console.log(`🔢 Batch ID: ${batchId}`);
      
      const questions = await generateEnhancedHebrewQuestions(type, difficulty, questionCount, isPremium);
      const filePath = await saveEnhancedHebrewQuestions(questions, type, difficulty, isPremium, batchId);
      
      await saveIds();
      
      console.log(`\n✅ Enhanced Hebrew JSON generation complete!`);
      console.log(`📁 File saved: ${filePath}`);
      console.log(`📝 Questions generated: ${questions.length}`);
      
      // הצג דוגמה של שאלה משופרת
      if (questions.length > 0) {
        console.log(`\n📋 Sample enhanced question:`);
        console.log(JSON.stringify(questions[0], null, 2));
      }
      
      return;
    }
    
    // ENHANCED: Batch Enhanced All command
    if (command === 'batch-enhanced-all') {
      const isPremium = args.includes('--premium');
      const countArg = args.find(arg => arg.startsWith('--count='));
      const count = countArg ? parseInt(countArg.split('=')[1]) : 20;
      
      const batchId = await batchEnhancedAll(isPremium, count);
      console.log(`\n✅ Enhanced batch generation complete! Use this command to upload:`);
      console.log(`node enhanced-question-generator.js upload-batch ${batchId}`);
      return;
    }
    
    // Custom Batch command (works with enhanced)
    if (command === 'custom-batch') {
      const typesArg = args.find(arg => arg.startsWith('--types='));
      const difficultiesArg = args.find(arg => arg.startsWith('--difficulties='));
      const countArg = args.find(arg => arg.startsWith('--count='));
      const isPremium = args.includes('--premium');
      
      if (!typesArg || !difficultiesArg || !countArg) {
        console.error('❌ Usage: custom-batch --types=T1,T2 --difficulties=D1,D2 --count=N [--premium]');
        return;
      }
      
      const types = typesArg.split('=')[1].split(',');
      const difficulties = difficultiesArg.split('=')[1].split(',');
      const count = parseInt(countArg.split('=')[1]);
      
      const batchId = await customBatch(types, difficulties, count, isPremium);
      console.log(`\n✅ Custom enhanced batch complete! Use this command to upload:`);
      console.log(`node enhanced-question-generator.js upload-batch ${batchId}`);
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
      console.log(`node question-generator.js upload-batch ${batchId}`);
      return;
    }
    
    // Check Duplicates command
    if (command === 'check-duplicates') {
      const batchIdArg = args.find(arg => arg.startsWith('--batch-id='));
      if (!batchIdArg) {
        console.error('❌ Usage: check-duplicates --batch-id=xxx');
        return;
      }
      
      const batchId = batchIdArg.split('=')[1];
      await checkDuplicates(batchId);
      return;
    }
    
    // Validate Questions command
    if (command === 'validate-questions') {
      const directory = args[0] || CONFIG.hebrewOutputDir;
      await validateQuestions(directory);
      return;
    }
    
    // Stats command
    if (command === 'stats') {
      await generateStats();
      return;
    }
    
    // Cleanup command
    if (command === 'cleanup') {
      const olderThanArg = args.find(arg => arg.startsWith('--older-than='));
      const days = olderThanArg ? parseInt(olderThanArg.split('=')[1]) : 7;
      await cleanup(days);
      return;
    }
    
    // Backup command
    if (command === 'backup') {
      const formatArg = args.find(arg => arg.startsWith('--format='));
      const outputArg = args.find(arg => arg.startsWith('--output='));
      const format = formatArg ? formatArg.split('=')[1] : 'zip';
      const output = outputArg ? outputArg.split('=')[1] : null;
      
      await createBackup(format, output);
      return;
    }
    
    console.log('❌ Unknown command. Use "help" for available commands.');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main().catch(console.error);
}

// Export for testing
module.exports = {
  generateEnhancedHebrewQuestions,
  saveEnhancedHebrewQuestions,
  validateEnhancedQuestion,
  formatForDatabase,
  batchEnhancedAll
};