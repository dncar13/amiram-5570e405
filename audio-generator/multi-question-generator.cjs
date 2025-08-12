// advanced-question-generator.js - Professional Multi-Type Question Generator with TTS
require('dotenv').config({ path: './.env' });
const { synthesizeBatch, synthesizeToUrl, validateAudioUrl } = require('../new_questions/text-to-speech.cjs');
const { mapTopicsForQuestions, getAvailableTopics } = require('../new_questions/topic-mapper.cjs');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

// Validate required environment variables early
function validateEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY'
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
validateEnvironment();

// Graceful shutdown support
let isShuttingDown = false;
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
async function gracefulShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n⏹️ Graceful shutdown initiated...');
  // Complete in-flight tasks naturally; short-lived script will exit soon
}

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI Configuration
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';
const MAX_RETRIES = 3;

// Base URL for validation
const BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:8080';

// TTS Configuration
const DEFAULT_VOICE = process.env.VOICE_NAME || 'en-US-Wavenet-F';
const DEFAULT_LANG = process.env.VOICE_LANG || 'en-US';
const DEFAULT_SPEAKING_RATE = parseFloat(process.env.SPEAKING_RATE || '1.0');
const DEFAULT_PITCH = parseFloat(process.env.PITCH || '0.0');

// ============================================
// Utility Functions
// ============================================

// Timeout wrapper for external calls
async function withTimeout(promise, timeoutMs = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
}

// Structured logger (minimal use to avoid noisy diff)
class Logger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ timestamp, level, message, ...data }));
  }
  static info(message, data) { this.log('INFO', message, data); }
  static warn(message, data) { this.log('WARN', message, data); }
  static error(message, data) { this.log('ERROR', message, data); }
}

// Simple metrics collector
class Metrics {
  constructor() { this.counters = {}; this.timers = {}; }
  increment(name) { this.counters[name] = (this.counters[name] || 0) + 1; }
  async time(name, fn) {
    const start = Date.now();
    try { return await fn(); }
    finally { this.timers[name] = Date.now() - start; }
  }
  getSummary() { return { counters: this.counters, timers: this.timers }; }
}
const metrics = new Metrics();

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate stable ID from text
function generateStableId(prefix, text, additionalSalt = '') {
  // Use SHA-256 and include optional salt + timestamp for uniqueness
  const hash = crypto
    .createHash('sha256')
    .update(prefix || '')
    .update(text || '')
    .update(additionalSalt || '')
    .update(Date.now().toString())
    .digest('hex')
    .slice(0, 16);
  return `${prefix}_${hash}`;
}

// Shuffle answer options while tracking correct answer
function shuffleWithAnswer(options, correctIndex) {
  const arr = options.map((text, i) => ({ 
    text, 
    isCorrect: i === correctIndex 
  }));
  
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  const shuffledOptions = arr.map(o => o.text);
  const newCorrect = arr.findIndex(o => o.isCorrect);
  
  return { shuffledOptions, newCorrect };
}

// Validate correct answer index
function validateCorrectAnswer(correctAnswer, optionsLength) {
  if (typeof correctAnswer !== 'number' || 
      correctAnswer < 0 || 
      correctAnswer >= optionsLength) {
    throw new Error(`Invalid correctAnswer: ${correctAnswer} for ${optionsLength} options`);
  }
}

// Parse CLI arguments
function parseArgs() {
  const args = {
    types: ['lc', 'cont', 'wf', 'gc'], // all by default
    chapter: 'chapter_1',
    dryRun: false,
    verbose: false,
    aiGenerate: false, // new flag for AI generation
    aiTopics: true     // new flag for AI topic detection
  };
  
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--types=')) {
      args.types = arg.split('=')[1].split(',').map(t => t.trim());
    } else if (arg.startsWith('--chapter=')) {
      args.chapter = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--verbose') {
      args.verbose = true;
    } else if (arg === '--ai-generate') {
      args.aiGenerate = true;
    } else if (arg === '--no-ai-topics') {
      args.aiTopics = false;
    }
  });
  
  return args;
}

// Simple rate limiter to avoid TTS/API throttling
class RateLimiter {
  constructor(maxRequests = 5, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.queue = [];
  }
  async throttle() {
    const now = Date.now();
    this.queue = this.queue.filter((t) => now - t < this.windowMs);
    if (this.queue.length >= this.maxRequests) {
      const oldest = this.queue[0];
      const wait = this.windowMs - (now - oldest);
      await new Promise((r) => setTimeout(r, wait));
      return this.throttle();
    }
    this.queue.push(now);
  }
}
const ttsLimiter = new RateLimiter(5, 1000); // 5 requests/sec

// Chunked processing helper to reduce memory spikes
async function* processInChunks(items, chunkSize = 10) {
  for (let i = 0; i < items.length; i += chunkSize) {
    yield items.slice(i, i + chunkSize);
  }
}

// ============================================
// AI Generation Function
// ============================================
async function generateQuestionsWithAI(type, count = 5, topic = 'general', retries = MAX_RETRIES) {
  const prompts = {
    listening_comprehension: `Create ${count} listening comprehension passages with questions. Each passage should be 30-90 seconds when spoken.

Format each as JSON:
{
  "id": "lec_CHAPTER_TYPE_NUMBER",
  "type": "listening_comprehension", 
  "durationTargetSec": 30-90,
  "audioScript": "Natural spoken English passage",
  "questions": [
    {
      "q": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0-3,
      "explanationHe": "הסבר בעברית"
    }
  ],
  "metadata": {
    "topic": "${topic}",
    "level": "B1/B2",
    "voice": "${DEFAULT_VOICE}",
    "speakingRate": ${DEFAULT_SPEAKING_RATE}
  }
}

Topics: academic, daily life, workplace, technology, health.
Ensure natural conversational flow and realistic scenarios.`,

    listening_continuation: `Create ${count} listening continuation questions. These test logical sentence completion.

Format each as JSON:
{
  "id": "cont_CHAPTER_NUMBER",
  "type": "listening_continuation",
  "text": "Sentence with blank ending ______",
  "options": ["logical completion", "absurd option 1", "absurd option 2", "absurd option 3"],
  "correctAnswer": 0,
  "explanationHe": "הסבר למה התשובה נכונה",
  "difficulty": "easy/medium/hard"
}

Make sure only ONE option is logical, others should be clearly wrong but not offensive.`,

    word_formation: `Create ${count} word formation questions testing English morphology.

Format each as JSON:
{
  "id": "wf_CHAPTER_NUMBER",
  "type": "word_formation", 
  "sentence": "Sentence with blank ______",
  "options": ["base form", "noun form", "adjective form", "adverb form"],
  "correctAnswer": 0-3,
  "lemma": "base word",
  "posTarget": "noun/adjective/adverb/verb",
  "explanationHe": "הסבר בעברית על הטופס הנדרש",
  "difficulty": "easy/medium/hard"
}

Focus on common word families: decide/decision, analyze/analysis, create/creative/creativity.`,

    grammar_in_context: `Create ${count} grammar in context questions testing advanced English grammar.

Format each as JSON:
{
  "id": "gc_CHAPTER_NUMBER",
  "type": "grammar_in_context",
  "text": "Sentence with grammar blank ______",
  "options": ["correct form", "wrong form 1", "wrong form 2", "wrong form 3"],
  "correctAnswer": 0-3,
  "grammarRule": "Explanation of the grammar rule",
  "explanationHe": "הסבר בעברית",
  "examplesEn": ["Example 1", "Example 2"],
  "difficulty": "easy/medium/hard"
}

Cover: conditionals, passive voice, reported speech, modal verbs, perfect tenses, relative clauses.`
  };

  try {
    console.log(`🤖 Generating ${count} ${type} questions with Claude...`);
    
  const response = await withTimeout(anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompts[type] + '\n\nRespond ONLY with valid JSON array of questions.'
      }]
  }), 60000);

    const content = response.content[0].text || '';
    
    // Try to parse/repair JSON response
    let questions;
    try {
      questions = JSON.parse(content);
      if (!Array.isArray(questions)) questions = [questions];
    } catch (_e) {
      // Attempt to extract JSON array from mixed content
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          questions = JSON.parse(match[0]);
        } catch (_e2) {
          // Attempt simple fixes
          const fixed = match[0]
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/\u2018|\u2019|\u201C|\u201D/g, '"')
            .replace(/'/g, '"');
          questions = JSON.parse(fixed);
        }
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      if (retries > 0) {
        console.log(`🔄 Retrying AI generation (${retries} attempts left)...`);
  metrics.increment('ai.retry');
        await new Promise((r) => setTimeout(r, 1000));
        return generateQuestionsWithAI(type, count, topic, retries - 1);
      }
      throw new Error('Failed to generate valid questions');
    }

    // Validate and clean questions
    questions.forEach((q, i) => {
      if (!q.id) q.id = `ai_${type}_${Date.now()}_${i}`;
      if (!q.type) q.type = type;
      
      // Validate correctAnswer
      if (q.options && q.correctAnswer !== undefined) {
        validateCorrectAnswer(q.correctAnswer, q.options.length);
      }
    });

    console.log(`✅ Generated ${questions.length} questions with AI`);
    return questions;

  } catch (error) {
    // Backoff on rate-related errors
    if (retries > 0 && /rate|timeout|overloaded/i.test(error.message || '')) {
      metrics.increment('ai.retry');
      await new Promise((r) => setTimeout(r, 2000));
      return generateQuestionsWithAI(type, count, topic, retries - 1);
    }
    console.error(`❌ AI generation failed:`, error.message);
    throw error;
  }
}

// ============================================
// 1. LISTENING COMPREHENSION Questions
// ============================================
function generateListeningComprehensionQuestions() {
  const questions = [
    // Short passage (~30 seconds)
    {
      id: 'lec_ch1_short_1',
      type: 'listening_comprehension',
      durationTargetSec: 30,
      audioScript: "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting. Mike suggests they could go together since he's been wanting to try the new coffee stand there. They agree to meet at 9 AM at the market entrance.",
      questions: [
        {
          q: "What is the main reason Sarah wants to go to the farmers market?",
          options: [
            "To try the new coffee stand",
            "To buy vegetables for a dinner party",
            "To meet Mike for breakfast",
            "To sell her own produce"
          ],
          correctAnswer: 1,
          explanationHe: "שרה מזכירה במפורש שהיא צריכה ירקות טריים למסיבת ארוחת ערב שהיא מארחת."
        }
      ],
      metadata: {
        topic: "daily_life",
        level: "B1",
        voice: DEFAULT_VOICE,
        speakingRate: DEFAULT_SPEAKING_RATE
      }
    },
    
    // Medium passage (~60 seconds)
    {
      id: 'lec_ch1_medium_1',
      type: 'listening_comprehension',
      durationTargetSec: 60,
      audioScript: "Good morning, class. Today we'll discuss the importance of sleep for academic performance. Recent studies show that students who get at least eight hours of sleep perform significantly better on exams than those who sleep less. The brain uses sleep time to consolidate memories and process information from the day. During deep sleep, neural connections are strengthened, making it easier to recall information later. That's why pulling an all-nighter before an exam is actually counterproductive. You might think you're studying more, but without proper sleep, your brain can't effectively store that information. I recommend establishing a regular sleep schedule, especially during exam periods.",
      questions: [
        {
          q: "According to the speaker, what happens during deep sleep?",
          options: [
            "The brain creates new memories",
            "Neural connections are strengthened",
            "Students dream about their studies",
            "The body produces more energy"
          ],
          correctAnswer: 1,
          explanationHe: "הדובר מציין שבמהלך שינה עמוקה, הקשרים העצביים מתחזקים, מה שמקל על היזכרות במידע."
        },
        {
          q: "What does the speaker say about all-nighters?",
          options: [
            "They are essential for exam success",
            "They help consolidate memories",
            "They are counterproductive for learning",
            "They should be done regularly"
          ],
          correctAnswer: 2,
          explanationHe: "הדובר אומר במפורש שלילות ללא שינה הם למעשה לא פרודוקטיביים כי המוח לא יכול לאחסן מידע ביעילות."
        }
      ],
      metadata: {
        topic: "academic",
        level: "B2",
        voice: DEFAULT_VOICE,
        speakingRate: DEFAULT_SPEAKING_RATE
      }
    },
    
    // Long passage (~90 seconds)
    {
      id: 'lec_ch1_long_1',
      type: 'listening_comprehension',
      durationTargetSec: 90,
      audioScript: "Welcome to our workshop on remote work productivity. As more companies embrace flexible work arrangements, it's crucial to understand how to maintain efficiency outside the traditional office. First, let's talk about workspace. Creating a dedicated work area, even if it's just a corner of your living room, helps your brain switch into work mode. This doesn't mean you need expensive equipment – a simple desk and comfortable chair are sufficient. Next, time management becomes even more critical when working from home. Without the structure of an office environment, it's easy to blur the lines between work and personal time. I recommend using the Pomodoro Technique: work for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout. Communication is another key aspect. When you're not physically present with your team, proactive communication becomes essential. Schedule regular check-ins, respond promptly to messages, and don't hesitate to clarify expectations. Finally, remember to set boundaries. Just because you're home doesn't mean you're always available. Establish clear working hours and stick to them. This helps prevent work from consuming your entire day and maintains a healthy work-life balance.",
      questions: [
        {
          q: "What is the main topic of this workshop?",
          options: [
            "Office design and decoration",
            "Remote work productivity",
            "Team building exercises",
            "Company communication policies"
          ],
          correctAnswer: 1,
          explanationHe: "הדובר פותח בברכה לסדנה על פרודוקטיביות בעבודה מרחוק."
        },
        {
          q: "How long does the speaker recommend working before taking a break?",
          options: [
            "15 minutes",
            "25 minutes",
            "45 minutes",
            "60 minutes"
          ],
          correctAnswer: 1,
          explanationHe: "הדובר ממליץ על טכניקת פומודורו: עבודה למשך 25 דקות ואז הפסקה של 5 דקות."
        }
      ],
      metadata: {
        topic: "workplace",
        level: "B2",
        voice: DEFAULT_VOICE,
        speakingRate: DEFAULT_SPEAKING_RATE
      }
    }
  ];

  // Shuffle options for each sub-question
  questions.forEach(q => {
    q.questions.forEach(subQ => {
      const { shuffledOptions, newCorrect } = shuffleWithAnswer(
        subQ.options, 
        subQ.correctAnswer
      );
      subQ.options = shuffledOptions;
      subQ.correctAnswer = newCorrect;
    });
  });

  return questions;
}

// ============================================
// 2. LISTENING CONTINUATION Questions
// ============================================
function generateListeningContinuationQuestions() {
  const questions = [
    {
      id: 'cont_ch1_01',
      type: 'listening_continuation',
      text: "The museum announced a new exhibition opening next month, and to celebrate ______",
      options: [
        "they will offer free admission for the first week",
        "all museums worldwide will close permanently",
        "visitors must pay triple the normal price",
        "the building will be demolished immediately"
      ],
      correctAnswer: 0,
      explanationHe: "כאשר מוזיאון חוגג פתיחת תערוכה חדשה, הגיוני שיציעו כניסה חינם כדי למשוך מבקרים.",
      difficulty: "easy"
    },
    {
      id: 'cont_ch1_02',
      type: 'listening_continuation',
      text: "After months of negotiations, the two companies finally reached an agreement, but before signing the contract ______",
      options: [
        "they scheduled a final review with their legal teams",
        "both companies declared bankruptcy",
        "they decided to start a cooking show together",
        "all employees were sent to Antarctica"
      ],
      correctAnswer: 0,
      explanationHe: "לפני חתימה על חוזה עסקי חשוב, סביר שהחברות ירצו סקירה משפטית אחרונה.",
      difficulty: "medium"
    },
    {
      id: 'cont_ch1_03',
      type: 'listening_continuation',
      text: "The chef had prepared everything perfectly for the evening service, but just as the first customers arrived ______",
      options: [
        "he discovered the main refrigerator had stopped working",
        "he won the lottery and continued cooking happily",
        "all the food transformed into gold",
        "the restaurant floated away into space"
      ],
      correctAnswer: 0,
      explanationHe: "המילה 'but' מרמזת על בעיה, וכשל במקרר הוא סיבוך ריאלי במטבח מסעדה.",
      difficulty: "medium"
    },
    {
      id: 'cont_ch1_04',
      type: 'listening_continuation',
      text: "The research team had been working on the vaccine for three years, and when the clinical trials showed positive results ______",
      options: [
        "they immediately began preparing for the next phase of testing",
        "they threw all their research in the trash",
        "they decided vaccines were unnecessary",
        "they opened a pizza restaurant instead"
      ],
      correctAnswer: 0,
      explanationHe: "תוצאות חיוביות בניסויים קליניים מובילות באופן טבעי לשלב הבא של בדיקות.",
      difficulty: "hard"
    }
  ];

  // Shuffle options for each question
  questions.forEach(q => {
    const { shuffledOptions, newCorrect } = shuffleWithAnswer(
      q.options, 
      q.correctAnswer
    );
    q.options = shuffledOptions;
    q.correctAnswer = newCorrect;
  });

  return questions;
}

// ============================================
// 3. WORD FORMATION Questions
// ============================================
function generateWordFormationQuestions() {
  const questions = [
    {
      id: 'wf_ch1_01',
      type: 'word_formation',
      sentence: "The company's ______ to expand internationally was met with enthusiasm from investors.",
      options: ["decide", "decision", "decisive", "decisively"],
      correctAnswer: 1,
      lemma: "decide",
      posTarget: "noun",
      explanationHe: "נדרש שם עצם אחרי 's possessive. 'decision' היא צורת שם העצם של 'decide'.",
      difficulty: "easy"
    },
    {
      id: 'wf_ch1_02',
      type: 'word_formation',
      sentence: "The scientist made a ______ discovery that changed our understanding of genetics.",
      options: ["revolution", "revolutionary", "revolutionize", "revolutionarily"],
      correctAnswer: 1,
      lemma: "revolution",
      posTarget: "adjective",
      explanationHe: "נדרש שם תואר לתאר את 'discovery'. 'revolutionary' פירושו מהפכני.",
      difficulty: "medium"
    },
    {
      id: 'wf_ch1_03',
      type: 'word_formation',
      sentence: "The team worked ______ to meet the deadline.",
      options: ["tireless", "tirelessly", "tire", "tiring"],
      correctAnswer: 1,
      lemma: "tire",
      posTarget: "adverb",
      explanationHe: "נדרש תואר הפועל לתאר איך הם עבדו. 'tirelessly' = ללא לאות.",
      difficulty: "easy"
    },
    {
      id: 'wf_ch1_04',
      type: 'word_formation',
      sentence: "Her ______ of the situation proved to be completely accurate.",
      options: ["analyze", "analysis", "analytical", "analytically"],
      correctAnswer: 1,
      lemma: "analyze",
      posTarget: "noun",
      explanationHe: "אחרי 'Her' ולפני 'of' נדרש שם עצם. 'analysis' היא צורת שם העצם.",
      difficulty: "medium"
    },
    {
      id: 'wf_ch1_05',
      type: 'word_formation',
      sentence: "The manager's ______ skills helped resolve the conflict quickly.",
      options: ["diplomacy", "diplomatic", "diplomatically", "diplomat"],
      correctAnswer: 1,
      lemma: "diplomacy",
      posTarget: "adjective",
      explanationHe: "נדרש תואר לתאר את 'skills'. 'diplomatic' = דיפלומטי.",
      difficulty: "medium"
    },
    {
      id: 'wf_ch1_06',
      type: 'word_formation',
      sentence: "The new policy aims to ______ waste in manufacturing processes.",
      options: ["minimal", "minimize", "minimum", "minimally"],
      correctAnswer: 1,
      lemma: "minimum",
      posTarget: "verb",
      explanationHe: "אחרי 'to' נדרש infinitive. 'minimize' = למזער.",
      difficulty: "easy"
    },
    {
      id: 'wf_ch1_07',
      type: 'word_formation',
      sentence: "The artist's work showed remarkable ______ and attention to detail.",
      options: ["create", "creation", "creative", "creativity"],
      correctAnswer: 3,
      lemma: "create",
      posTarget: "noun",
      explanationHe: "נדרש שם עצם abstract אחרי 'remarkable'. 'creativity' = יצירתיות.",
      difficulty: "hard"
    },
    {
      id: 'wf_ch1_08',
      type: 'word_formation',
      sentence: "The committee will ______ review all applications before making a decision.",
      options: ["care", "careful", "carefully", "careless"],
      correctAnswer: 2,
      lemma: "care",
      posTarget: "adverb",
      explanationHe: "נדרש תואר הפועל לתאר את הפועל 'review'. 'carefully' = בזהירות.",
      difficulty: "easy"
    },
    {
      id: 'wf_ch1_09',
      type: 'word_formation',
      sentence: "The ______ of the new technology exceeded all expectations.",
      options: ["perform", "performance", "performer", "performing"],
      correctAnswer: 1,
      lemma: "perform",
      posTarget: "noun",
      explanationHe: "אחרי 'The' ולפני 'of' נדרש שם עצם. 'performance' = ביצועים.",
      difficulty: "medium"
    },
    {
      id: 'wf_ch1_10',
      type: 'word_formation',
      sentence: "His ______ to learn new languages impressed everyone.",
      options: ["able", "ability", "ably", "unable"],
      correctAnswer: 1,
      lemma: "able",
      posTarget: "noun",
      explanationHe: "אחרי 'His' נדרש שם עצם. 'ability' = יכולת.",
      difficulty: "easy"
    }
  ];

  // Shuffle options for each question
  questions.forEach(q => {
    const { shuffledOptions, newCorrect } = shuffleWithAnswer(
      q.options, 
      q.correctAnswer
    );
    q.options = shuffledOptions;
    q.correctAnswer = newCorrect;
  });

  return questions;
}

// ============================================
// 4. GRAMMAR IN CONTEXT Questions
// ============================================
function generateGrammarInContextQuestions() {
  const questions = [
    {
      id: 'gc_ch1_01',
      type: 'grammar_in_context',
      text: "If I ______ you, I would accept the job offer.",
      options: ["am", "was", "were", "will be"],
      correctAnswer: 2,
      grammarRule: "Second Conditional: If + past simple, would + base verb (use 'were' for all subjects)",
      explanationHe: "במשפט תנאי מסוג שני, משתמשים ב-'were' לכל הגופים אחרי If.",
      examplesEn: [
        "If she were here, she would help us.",
        "If I were rich, I would travel the world."
      ],
      difficulty: "medium"
    },
    {
      id: 'gc_ch1_02',
      type: 'grammar_in_context',
      text: "The report ______ by the end of next week.",
      options: ["will complete", "will be completed", "will have completed", "completes"],
      correctAnswer: 1,
      grammarRule: "Future Passive: will be + past participle",
      explanationHe: "הדוח יושלם (סביל) - משתמשים ב-Future Passive כי הדוח מקבל את הפעולה.",
      examplesEn: [
        "The building will be finished next month.",
        "The results will be announced tomorrow."
      ],
      difficulty: "medium"
    },
    {
      id: 'gc_ch1_03',
      type: 'grammar_in_context',
      text: "She insisted that he ______ the meeting on time.",
      options: ["attends", "attend", "attended", "will attend"],
      correctAnswer: 1,
      grammarRule: "Subjunctive: insist/suggest/recommend + that + subject + base verb",
      explanationHe: "אחרי פעלים של דרישה/המלצה משתמשים ב-Subjunctive: base form של הפועל.",
      examplesEn: [
        "The doctor recommended that she take the medicine.",
        "They demanded that he apologize immediately."
      ],
      difficulty: "hard"
    },
    {
      id: 'gc_ch1_04',
      type: 'grammar_in_context',
      text: "I've been working here ______ 2019.",
      options: ["for", "since", "from", "during"],
      correctAnswer: 1,
      grammarRule: "Present Perfect Continuous with time: since + point in time, for + duration",
      explanationHe: "משתמשים ב-'since' עם נקודת זמן (2019), ו-'for' עם משך זמן.",
      examplesEn: [
        "I've lived here since January.",
        "She's been studying for three hours."
      ],
      difficulty: "easy"
    },
    {
      id: 'gc_ch1_05',
      type: 'grammar_in_context',
      text: "The children ______ to the park when it started raining.",
      options: ["walked", "were walking", "have walked", "had walked"],
      correctAnswer: 1,
      grammarRule: "Past Continuous for interrupted action: was/were + -ing",
      explanationHe: "Past Continuous מתאר פעולה שהתרחשה כשפעולה אחרת קטעה אותה.",
      examplesEn: [
        "I was reading when the phone rang.",
        "They were eating dinner when we arrived."
      ],
      difficulty: "medium"
    },
    {
      id: 'gc_ch1_06',
      type: 'grammar_in_context',
      text: "______ the weather improves, we'll have to cancel the picnic.",
      options: ["If", "Unless", "When", "Because"],
      correctAnswer: 1,
      grammarRule: "Unless = if not (negative condition)",
      explanationHe: "'Unless' פירושו 'אם לא' - אם מזג האוויר לא ישתפר, נבטל את הפיקניק.",
      examplesEn: [
        "Unless you study, you won't pass.",
        "I won't go unless you come with me."
      ],
      difficulty: "medium"
    },
    {
      id: 'gc_ch1_07',
      type: 'grammar_in_context',
      text: "She asked me where ______ the previous night.",
      options: ["I go", "I went", "I had gone", "did I go"],
      correctAnswer: 2,
      grammarRule: "Reported Speech: past simple → past perfect",
      explanationHe: "בדיבור עקיף, Past Simple הופך ל-Past Perfect.",
      examplesEn: [
        "He said he had seen the movie.",
        "She told me she had finished the work."
      ],
      difficulty: "hard"
    },
    {
      id: 'gc_ch1_08',
      type: 'grammar_in_context',
      text: "This is the house ______ I grew up.",
      options: ["which", "where", "that", "when"],
      correctAnswer: 1,
      grammarRule: "Relative adverbs: where for places, when for time, why for reasons",
      explanationHe: "משתמשים ב-'where' עבור מקומות ב-relative clauses.",
      examplesEn: [
        "That's the restaurant where we met.",
        "I remember the day when we graduated."
      ],
      difficulty: "easy"
    },
    {
      id: 'gc_ch1_09',
      type: 'grammar_in_context',
      text: "You ______ bring your passport; a driver's license is sufficient.",
      options: ["mustn't", "needn't", "shouldn't", "couldn't"],
      correctAnswer: 1,
      grammarRule: "Modal verbs: needn't = not necessary, mustn't = prohibited",
      explanationHe: "'needn't' = לא חייב/לא הכרחי. 'mustn't' = אסור.",
      examplesEn: [
        "You needn't worry about it.",
        "You mustn't smoke here."
      ],
      difficulty: "medium"
    },
    {
      id: 'gc_ch1_10',
      type: 'grammar_in_context',
      text: "By next month, they ______ married for ten years.",
      options: ["will be", "will have been", "are", "have been"],
      correctAnswer: 1,
      grammarRule: "Future Perfect: will have + past participle (for completed actions by a future time)",
      explanationHe: "Future Perfect מתאר פעולה שתושלם עד נקודה עתידית.",
      examplesEn: [
        "By tomorrow, I will have finished the project.",
        "She will have graduated by June."
      ],
      difficulty: "hard"
    }
  ];

  // Shuffle options for each question
  questions.forEach(q => {
    const { shuffledOptions, newCorrect } = shuffleWithAnswer(
      q.options, 
      q.correctAnswer
    );
    q.options = shuffledOptions;
    q.correctAnswer = newCorrect;
  });

  return questions;
}

// ============================================
// Audio Validation Function
// ============================================
async function validateGeneratedAudio(questions, verbose = false) {
  const validationResults = [];
  
  for (const question of questions) {
    if (question.audioUrl) {
      // Handle relative URLs
      const fullUrl = question.audioUrl.startsWith('http') 
        ? question.audioUrl 
        : `${BASE_URL}${question.audioUrl}`;
      
      if (verbose) {
        console.log(`🔍 Validating: ${fullUrl}`);
      }
      
      const validation = await validateAudioUrl(fullUrl);
      validationResults.push({
        questionId: question.id || question.stable_id,
        ...validation
      });
      
      if (validation.accessible && validation.isAudio && validation.sizeOk) {
        if (verbose) {
          console.log(`✅ ${question.id}: HTTP ${validation.status}, ${validation.contentType}, ${validation.contentLength} bytes`);
        }
      } else {
        console.warn(`⚠️ Audio validation failed for ${question.id}:`);
        console.warn(`   Status: ${validation.status}, Audio: ${validation.isAudio}, Size OK: ${validation.sizeOk}`);
        if (validation.error) {
          console.warn(`   Error: ${validation.error}`);
        }
      }
    }
  }
  
  return validationResults;
}

// Database Upload with Upsert and Topic Mapping
async function uploadQuestionsToDatabase(questions, chapterId, questionType, dryRun = false) {
  console.log(`\n💾 ${dryRun ? '[DRY RUN] Would upload' : 'Uploading'} ${questions.length} ${questionType} questions for chapter ${chapterId}`);
  
  if (dryRun) {
    console.log(`📝 Sample data structure:`);
    if (questions.length > 0) {
      const sample = questions[0];
      console.log(JSON.stringify(sample, null, 2).substring(0, 500) + '...');
    }
    return [];
  }
  
  try {
    const dbQuestions = questions.map(q => {
      // Validate correct answer before upload
      if (q.options && q.correctAnswer !== undefined) {
        validateCorrectAnswer(q.correctAnswer, q.options.length);
      }
      
      const baseQuestion = {
        id: generateUUID(),
        stable_id: q.id, // Main stable_id field
        type: q.type,
        difficulty: q.difficulty || 'medium',
        topic_id: q.topicId, // NEW: Link to topic
        is_premium: false,
        ai_generated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Handle different question types with enhanced metadata
      if (q.type === 'listening_comprehension') {
        return {
          ...baseQuestion,
          question_text: q.questions && q.questions[0] ? q.questions[0].text : 'Listening comprehension question',
          answer_options: null, // LC has sub-questions
          correct_answer: null,
          explanation: null,
          audio_url: q.audioUrl, // Add to top-level field
          metadata: {
            ...q.metadata,
            audio_script: q.audioScript, // The text to be read aloud
            questions: q.questions, // Store sub-questions
            durationTargetSec: q.durationTargetSec,
            audio_url: q.audioUrl,
            chapter: chapterId,
            detectedTopic: q.detectedTopic,
            topicInfo: q.topicInfo
          }
        };
      } else if (q.type === 'listening_continuation') {
        return {
          ...baseQuestion,
          question_text: q.text,
          answer_options: q.options,
          correct_answer: q.correctAnswer.toString(),
          explanation: q.explanationHe,
          audio_url: q.audioUrl, // Add to top-level field
          metadata: {
            audio_url: q.audioUrl,
            chapter: chapterId,
            detectedTopic: q.detectedTopic,
            topicInfo: q.topicInfo
          }
        };
      } else if (q.type === 'word_formation') {
        return {
          ...baseQuestion,
          question_text: q.sentence,
          answer_options: q.options,
          correct_answer: q.correctAnswer.toString(),
          explanation: q.explanationHe,
          audio_url: q.audioUrl, // Add to top-level field
          metadata: {
            lemma: q.lemma,
            posTarget: q.posTarget,
            audio_url: q.audioUrl,
            chapter: chapterId,
            detectedTopic: q.detectedTopic,
            topicInfo: q.topicInfo
          }
        };
      } else if (q.type === 'grammar_in_context') {
        return {
          ...baseQuestion,
          question_text: q.text,
          answer_options: q.options,
          correct_answer: q.correctAnswer.toString(),
          explanation: q.explanationHe,
          audio_url: q.audioUrl, // Add to top-level field
          metadata: {
            grammarRule: q.grammarRule,
            examplesEn: q.examplesEn,
            audio_url: q.audioUrl,
            chapter: chapterId,
            detectedTopic: q.detectedTopic,
            topicInfo: q.topicInfo
          }
        };
      }
    });

    // Upsert to handle duplicates
    const { data, error } = await supabase
      .from('questions')
      .upsert(dbQuestions, { 
        onConflict: 'stable_id',
        returning: 'minimal' 
      });

    if (error) throw error;

    console.log(`✅ Successfully uploaded ${dbQuestions.length} questions with topic mapping`);
    
    // Log topic distribution
    const topicDistribution = {};
    dbQuestions.forEach(q => {
      const topic = q.metadata?.detectedTopic || 'unknown';
      topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
    });
    console.log(`📊 Topic distribution:`, topicDistribution);
    
    return dbQuestions;
  } catch (error) {
    console.error(`❌ Failed to upload ${questionType} questions:`, error.message);
    throw error;
  }
}

// ============================================
// Main Generation Function
// ============================================
async function generateAllQuestionTypes(options = {}) {
  const { types, chapter, dryRun, verbose, aiGenerate, aiTopics } = {
    types: ['lc', 'cont', 'wf', 'gc'],
    chapter: 'chapter_1',
    dryRun: false,
    verbose: false,
    aiGenerate: false,
    aiTopics: true,
    ...options
  };
  
  console.log(`\n🎯 Starting Multi-Type Question Generation`);
  console.log(`📁 Chapter: ${chapter}`);
  console.log(`📝 Types: ${types.join(', ')}`);
  console.log(`🤖 AI Generation: ${aiGenerate ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🎯 AI Topic Detection: ${aiTopics ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
  console.log(`${'='.repeat(50)}\n`);
  
  try {
    const results = {
      listening_comprehension: [],
      listening_continuation: [],
      word_formation: [],
      grammar_in_context: []
    };
    
    const audioValidations = [];

    // Generate Listening Comprehension if requested
    if (types.includes('lc')) {
      console.log(`\n📚 Generating Listening Comprehension questions...`);
      
      let lcQuestions = aiGenerate 
        ? await generateQuestionsWithAI('listening_comprehension', 3)
        : generateListeningComprehensionQuestions();
      
      // Apply topic detection
      if (aiTopics && lcQuestions.length > 0) {
        console.log(`🎯 Detecting topics for listening comprehension questions...`);
        lcQuestions = await mapTopicsForQuestions(lcQuestions, 'listening_comprehension', {
          enableAI: aiTopics,
          verbose: verbose
        });
      }
      
      // Generate audio for listening comprehension (with deduplication)
      console.log(`🔊 Generating TTS audio for listening comprehension...`);
      
      // Group questions by audioScript to avoid duplicate synthesis
      const scriptMap = new Map();
      lcQuestions.forEach(q => {
        const script = q.audioScript;
        if (!scriptMap.has(script)) {
          scriptMap.set(script, {
            segmentId: `lec_${chapter}_${crypto.createHash('md5').update(script).digest('hex').slice(0, 8)}`,
            script: script,
            questions: []
          });
        }
        scriptMap.get(script).questions.push(q);
      });
      
    // Generate audio for each unique segment
      for (const segment of scriptMap.values()) {
        if (isShuttingDown) break;
        try {
      await ttsLimiter.throttle();
          const audioResult = await withTimeout(
            synthesizeToUrl(segment.segmentId, segment.script, 'listening-comprehension'),
            45000
          );
          metrics.increment('tts.success');
          
          // Assign the same audioUrl to all questions sharing this segment
          segment.questions.forEach(q => {
            q.audioUrl = audioResult.url;
            q.segmentId = segment.segmentId;
          });
          
          if (verbose) {
            console.log(`✅ Audio generated for segment ${segment.segmentId}: ${audioResult.url} (shared by ${segment.questions.length} questions)`);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to generate audio for segment ${segment.segmentId}:`, error.message);
          metrics.increment('tts.fail');
        }
      }
      
      // Validate audio
      const lcValidations = await validateGeneratedAudio(lcQuestions, verbose);
      audioValidations.push(...lcValidations);
      
      results.listening_comprehension = lcQuestions;
    }

    // Generate Listening Continuation if requested
    if (types.includes('cont')) {
      console.log(`\n📚 Generating Listening Continuation questions...`);
      
      let contQuestions = aiGenerate
        ? await generateQuestionsWithAI('listening_continuation', 5)
        : generateListeningContinuationQuestions();
      
      // Apply topic detection
      if (aiTopics && contQuestions.length > 0) {
        console.log(`🎯 Detecting topics for listening continuation questions...`);
        contQuestions = await mapTopicsForQuestions(contQuestions, 'listening_continuation', {
          enableAI: aiTopics,
          verbose: verbose
        });
      }
      
      // Generate audio
  console.log(`🔊 Generating TTS audio...`);
  if (!isShuttingDown) await ttsLimiter.throttle();
      const contAudioItems = contQuestions.map(q => ({
        id: q.id,
        text: q.text,
        type: 'listening-continuation'
      }));
      
  const { results: contAudioResults } = await withTimeout(synthesizeBatch(contAudioItems, 3), 45000);
      
      // Merge audio URLs
      contQuestions.forEach(q => {
        const audioResult = contAudioResults.find(r => r.id === q.id);
        if (audioResult && audioResult.audioResult) {
          q.audioUrl = audioResult.audioResult.url;
        }
      });
      
      // Validate audio
      const contValidations = await validateGeneratedAudio(contQuestions, verbose);
      audioValidations.push(...contValidations);
      
      results.listening_continuation = contQuestions;
    }

    // Generate Word Formation if requested
    if (types.includes('wf')) {
      console.log(`\n📚 Generating Word Formation questions...`);
      let wfQuestions = aiGenerate
        ? await generateQuestionsWithAI('word_formation', 10)
        : generateWordFormationQuestions();
        
      // Apply topic detection
      if (aiTopics && wfQuestions.length > 0) {
        console.log(`🎯 Detecting topics for word formation questions...`);
        wfQuestions = await mapTopicsForQuestions(wfQuestions, 'word_formation', {
          enableAI: aiTopics,
          verbose: verbose
        });
      }
      
      // Generate audio for word formation questions
      console.log(`🔊 Generating TTS audio for word formation questions...`);
      for await (const chunk of processInChunks(wfQuestions, 10)) {
        if (isShuttingDown) break;
        for (const question of chunk) {
          try {
            await ttsLimiter.throttle();
            const audioResult = await withTimeout(
              synthesizeToUrl(question.id, question.sentence, 'word-formation'),
              45000
            );
            question.audioUrl = audioResult.url;
            if (verbose) {
              console.log(`✅ Audio generated for ${question.id}: ${audioResult.url}`);
            }
            metrics.increment('tts.success');
          } catch (error) {
            console.warn(`⚠️ Failed to generate audio for ${question.id}:`, error.message);
            metrics.increment('tts.fail');
          }
        }
      }
      
      results.word_formation = wfQuestions;
    }

    // Generate Grammar in Context if requested
    if (types.includes('gc')) {
      console.log(`\n📚 Generating Grammar in Context questions...`);
      let gcQuestions = aiGenerate
        ? await generateQuestionsWithAI('grammar_in_context', 10)
        : generateGrammarInContextQuestions();
        
      // Apply topic detection
      if (aiTopics && gcQuestions.length > 0) {
        console.log(`🎯 Detecting topics for grammar in context questions...`);
        gcQuestions = await mapTopicsForQuestions(gcQuestions, 'grammar_in_context', {
          enableAI: aiTopics,
          verbose: verbose
        });
      }
      
      // Generate audio for grammar in context questions
      console.log(`🔊 Generating TTS audio for grammar in context questions...`);
      for await (const chunk of processInChunks(gcQuestions, 10)) {
        if (isShuttingDown) break;
        for (const question of chunk) {
          try {
            await ttsLimiter.throttle();
            const audioResult = await withTimeout(
              synthesizeToUrl(question.id, question.text, 'grammar-in-context'),
              45000
            );
            question.audioUrl = audioResult.url;
            if (verbose) {
              console.log(`✅ Audio generated for ${question.id}: ${audioResult.url}`);
            }
            metrics.increment('tts.success');
          } catch (error) {
            console.warn(`⚠️ Failed to generate audio for ${question.id}:`, error.message);
            metrics.increment('tts.fail');
          }
        }
      }
      
      results.grammar_in_context = gcQuestions;
    }

    // Upload to database (or skip if dry run)
    if (!dryRun) {
      console.log(`\n💾 Uploading questions to database...`);
      
      for (const [type, questions] of Object.entries(results)) {
        if (questions.length > 0) {
          await uploadQuestionsToDatabase(questions, chapter, type, dryRun);
        }
      }
    }

    // Generate summary report
    const totalQuestions = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    const totalWithAudio = results.listening_comprehension.filter(q => q.audioUrl).length + 
                          results.listening_continuation.filter(q => q.audioUrl).length +
                          results.word_formation.filter(q => q.audioUrl).length +
                          results.grammar_in_context.filter(q => q.audioUrl).length;
    const validAudio = audioValidations.filter(v => v.accessible && v.isAudio && v.sizeOk).length;
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 GENERATION SUMMARY`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📁 Chapter: ${chapter}`);
    console.log(`🤖 AI Generation: ${aiGenerate ? 'ENABLED' : 'DISABLED'}`);
    console.log(`🎯 AI Topic Detection: ${aiTopics ? 'ENABLED' : 'DISABLED'}`);
    console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
    console.log(`\n📈 Questions Generated:`);
    
    if (results.listening_comprehension.length > 0) {
      console.log(`  • Listening Comprehension: ${results.listening_comprehension.length}`);
    }
    if (results.listening_continuation.length > 0) {
      console.log(`  • Listening Continuation: ${results.listening_continuation.length}`);
    }
    if (results.word_formation.length > 0) {
      console.log(`  • Word Formation: ${results.word_formation.length}`);
    }
    if (results.grammar_in_context.length > 0) {
      console.log(`  • Grammar in Context: ${results.grammar_in_context.length}`);
    }
    
    console.log(`\n📊 Totals:`);
    console.log(`  • Total Questions: ${totalQuestions}`);
    console.log(`  • Questions with Audio: ${totalWithAudio}`);
    console.log(`  • Valid Audio Files: ${validAudio}/${audioValidations.length}`);
    console.log(`  • Questions with Topics: ${Object.values(results).flat().filter(q => q.topicId).length}`);
  const metricsSummary = metrics.getSummary();
  console.log(`  • Metrics counters: ${JSON.stringify(metricsSummary.counters)}`);
  console.log(`  • Metrics timers: ${JSON.stringify(metricsSummary.timers)}`);
    
    // Topic distribution summary
    const allQuestions = Object.values(results).flat();
    const topicDistribution = {};
    allQuestions.forEach(q => {
      if (q.detectedTopic) {
        topicDistribution[q.detectedTopic] = (topicDistribution[q.detectedTopic] || 0) + 1;
      }
    });
    
    if (Object.keys(topicDistribution).length > 0) {
      console.log(`\n📊 Topic Distribution:`);
      Object.entries(topicDistribution).forEach(([topic, count]) => {
        console.log(`  • ${topic}: ${count} questions`);
      });
    }
    
    // Warnings for failed validations
    const failedValidations = audioValidations.filter(v => !v.accessible || !v.isAudio || !v.sizeOk);
    if (failedValidations.length > 0) {
      console.log(`\n⚠️ Audio Validation Warnings:`);
      failedValidations.forEach(v => {
        console.log(`  • ${v.questionId}: ${v.error || 'Validation failed'}`);
      });
    }
    
    return {
      chapter,
      results,
      audioValidations,
      aiGenerated: aiGenerate,
      topicMapped: aiTopics,
      topicDistribution,
      summary: {
        total: totalQuestions,
        withAudio: totalWithAudio,
        validAudio,
        withTopics: allQuestions.filter(q => q.topicId).length,
        byType: {
          listening_comprehension: results.listening_comprehension.length,
          listening_continuation: results.listening_continuation.length,
          word_formation: results.word_formation.length,
          grammar_in_context: results.grammar_in_context.length
        }
      }
    };
    
  } catch (error) {
    console.error(`\n❌ Generation failed:`, error.message);
    if (error.stack && verbose) {
      console.error(error.stack);
    }
    throw error;
  }
}

// ============================================
// Database Setup Function
// ============================================
async function setupDatabase() {
  console.log(`\n🔧 Setting up database schema...`);
  try {
    // Check permissions/column presence without attempting DDL
    const { error } = await supabase
      .from('questions')
      .select('stable_id')
      .limit(1);
    if (error && /column|stable_id/i.test(error.message || '')) {
      console.warn(`⚠️ Column 'stable_id' not found. Please add it manually:`);
      console.log(`   ALTER TABLE questions ADD COLUMN stable_id TEXT;`);
      console.log(`   CREATE UNIQUE INDEX questions_stable_id_idx ON questions(stable_id);`);
      return false;
    }
    console.log(`✅ Database schema ready`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Database setup warning:`, error.message);
    return false;
  }
}

// ============================================
// CLI Execution
// ============================================
if (require.main === module) {
  const args = parseArgs();
  
  // Setup database first (optional, can fail gracefully)
  setupDatabase().then(() => {
    // Generate questions
    return generateAllQuestionTypes(args);
  }).then((result) => {
    console.log(`\n✅ Generation completed successfully!`);
    process.exit(0);
  }).catch((error) => {
    console.error(`\n❌ Fatal error:`, error.message);
    process.exit(1);
  });
}

// ============================================
// AUDIO BACKFILL FUNCTIONS
// ============================================

// Generate segment ID from audio script for consistency
function segmentIdFromScript(script) {
  return 'lec_' + crypto.createHash('md5').update(script.trim()).digest('hex').slice(0, 12);
}

// Backfill audio for Listening Comprehension questions
async function backfillComprehensionAudio() {
  console.log('🔍 Searching for listening comprehension questions missing audio...');
  
  try {
    const { data: rows, error } = await supabase
      .from('questions')
      .select('id, question_text, metadata, type')
      .eq('type', 'listening_comprehension');

    if (error) throw error;

    // Find questions with audioScript but no audioUrl
    const missing = (rows || []).filter(r => {
      const audioScript = r.metadata && r.metadata.audio_script;
      const audioUrl = r.metadata && r.metadata.audio_url;
      return audioScript && !audioUrl;
    });

    if (!missing.length) {
      console.log('✅ No missing comprehension audio found.');
      return;
    }

    console.log(`📝 Found ${missing.length} questions missing audio. Grouping by script...`);

    // Group by audioScript to avoid duplicate synthesis
    const scriptGroups = new Map();
    for (const row of missing) {
      const script = row.metadata.audio_script.trim();
      const segmentId = segmentIdFromScript(script);
      
      if (!scriptGroups.has(segmentId)) {
        scriptGroups.set(segmentId, {
          segmentId,
          script,
          questions: []
        });
      }
      scriptGroups.get(segmentId).questions.push(row);
    }

    console.log(`🎯 Processing ${scriptGroups.size} unique audio segments...`);

  // Process each unique segment
  for (const [segmentId, group] of scriptGroups) {
      try {
        console.log(`🎵 Synthesizing audio for segment: ${segmentId} (${group.questions.length} questions)`);
        console.log(`📝 Script preview: "${group.script.substring(0, 100)}${group.script.length > 100 ? '...' : ''}"`);

        // Synthesize audio using the new pattern
    await ttsLimiter.throttle();
    const { url, size } = await synthesizeToUrl(segmentId, group.script, {
          folder: 'comprehension',
          pauseForUnderscoreMs: 0 // No pauses for comprehension
        });

        console.log(`✅ Audio synthesized: ${url}`);

        // Update all questions that share this script
        const updates = group.questions.map(q => ({
          id: q.id,
          audioUrl: url,
          metadata: {
            ...(q.metadata || {}),
            segmentId: segmentId,
            audio_generated: true,
            audio_size: size,
            audio_url: url // Also store in metadata for compatibility
          }
        }));

        // Update in batches of 100 in parallel with safety
        const updatePromises = [];
        while (updates.length > 0) {
          const batch = updates.splice(0, 100);
          updatePromises.push(
            supabase
              .from('questions')
              .upsert(batch, { onConflict: 'id' })
              .then(({ error }) => {
                if (error) throw error;
                return batch.length;
              })
          );
        }
        const settled = await Promise.allSettled(updatePromises);
        const successful = settled
          .filter((r) => r.status === 'fulfilled')
          .reduce((sum, r) => sum + r.value, 0);
        const failed = settled.filter((r) => r.status === 'rejected').length;
        console.log(`🗃️ Upserted ${successful} records (failed batches: ${failed}) for segment ${segmentId}`);

        console.log(`🎧 Updated ${group.questions.length} question(s) for segment ${segmentId}`);
        
        // Brief pause between segments to be respectful to the API
        if (scriptGroups.size > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`❌ Failed to process segment ${segmentId}:`, error.message);
        continue; // Continue with next segment
      }
    }

    console.log('✅ Comprehension audio backfill complete.');
    
    // Return summary
    return {
      totalQuestions: missing.length,
      uniqueSegments: scriptGroups.size,
      success: true
    };

  } catch (error) {
    console.error('❌ Backfill failed:', error.message);
    throw error;
  }
}

module.exports = {
  generateAllQuestionTypes,
  generateQuestionsWithAI,
  generateListeningComprehensionQuestions,
  generateListeningContinuationQuestions,
  generateWordFormationQuestions,
  generateGrammarInContextQuestions,
  uploadQuestionsToDatabase,
  shuffleWithAnswer,
  validateCorrectAnswer,
  parseArgs,
  backfillComprehensionAudio,
  segmentIdFromScript
};