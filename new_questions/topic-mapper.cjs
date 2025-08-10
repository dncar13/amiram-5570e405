// topic-mapper.cjs - AI-powered topic detection and mapping for AMIRAM questions
require('dotenv').config({ path: '../.env' });
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Topic mapping - maps detected topics to database topic IDs
const TOPIC_MAPPING = {
  // Grammar and structure topics (1-5)
  'vocabulary': 1,
  'basic_grammar': 2,
  'tenses': 3,
  'sentence_structure': 4,
  'modal_verbs': 5,
  
  // Language skills topics (6-10)  
  'common_words': 6,
  'academic_vocabulary': 7,
  'business_english': 8,
  'phrasal_verbs': 9,
  'collocations': 10,
  
  // Listening topics (21-24)
  'academic_listening': 21,
  'workplace_listening': 22, 
  'daily_conversation': 23,
  'logical_completion': 24
};

// Default fallback topics by question type
const DEFAULT_TOPICS = {
  'listening_comprehension': 21, // Academic listening
  'listening_continuation': 24,  // Logical completion
  'word_formation': 6,          // Common words
  'grammar_in_context': 3       // Tenses
};

/**
 * Detect topic for a single question using Claude AI
 */
async function detectQuestionTopic(question, questionType) {
  const prompt = `Analyze this ${questionType} question and determine its main topic/theme.

Question details:
- Type: ${questionType}
- Content: ${getQuestionContent(question)}

Available topics (choose the MOST appropriate):
- vocabulary: Basic vocabulary and word meanings
- basic_grammar: Fundamental grammar rules  
- tenses: Verb tenses and time expressions
- sentence_structure: Sentence formation and syntax
- modal_verbs: Modal verbs and conditional structures
- common_words: Everyday vocabulary and usage
- academic_vocabulary: Academic and formal language
- business_english: Professional and workplace language
- phrasal_verbs: Phrasal verbs and idiomatic expressions
- collocations: Word combinations and partnerships
- academic_listening: Academic lectures and discussions
- workplace_listening: Professional workplace conversations
- daily_conversation: Everyday conversations and situations
- logical_completion: Logical reasoning and sentence completion

Respond with ONLY the topic name (e.g., "academic_vocabulary") - no explanation.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const detectedTopic = response.content[0].text.trim().toLowerCase();
    
    // Validate detected topic exists in mapping
    if (TOPIC_MAPPING[detectedTopic]) {
      return {
        topic: detectedTopic,
        topicId: TOPIC_MAPPING[detectedTopic],
        confidence: 'high',
        source: 'ai_detected'
      };
    } else {
      console.warn(`⚠️ Unknown topic detected: ${detectedTopic}, using default`);
      return getDefaultTopic(questionType);
    }
    
  } catch (error) {
    console.error(`❌ Topic detection failed:`, error.message);
    return getDefaultTopic(questionType);
  }
}

/**
 * Get fallback topic for question type
 */
function getDefaultTopic(questionType) {
  const topicId = DEFAULT_TOPICS[questionType] || 1;
  const topic = Object.keys(TOPIC_MAPPING).find(k => TOPIC_MAPPING[k] === topicId) || 'vocabulary';
  
  return {
    topic,
    topicId,
    confidence: 'fallback',
    source: 'default_mapping'
  };
}

/**
 * Extract content from question for analysis
 */
function getQuestionContent(question) {
  if (question.audioScript) {
    // Listening comprehension
    return `Audio: "${question.audioScript}" Questions: ${question.questions?.map(q => q.q).join('; ') || ''}`;
  } else if (question.text) {
    // Listening continuation or grammar
    return `Text: "${question.text}" Options: ${question.options?.join(', ') || ''}`;
  } else if (question.sentence) {
    // Word formation
    return `Sentence: "${question.sentence}" Target: ${question.posTarget} Options: ${question.options?.join(', ') || ''}`;
  } else {
    return JSON.stringify(question).substring(0, 200);
  }
}

/**
 * Process multiple questions with batching and rate limiting
 */
async function mapTopicsForQuestions(questions, questionType, options = {}) {
  const { 
    batchSize = 3, 
    delayMs = 1000, 
    enableAI = true,
    verbose = false 
  } = options;
  
  console.log(`🏷️ Mapping topics for ${questions.length} ${questionType} questions...`);
  
  if (!enableAI) {
    console.log(`🤖 AI topic detection disabled, using defaults`);
    return questions.map(q => ({
      ...q,
      ...getDefaultTopic(questionType)
    }));
  }
  
  const results = [];
  
  // Process in batches to respect API rate limits
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    console.log(`📦 Processing topic batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}`);
    
    const batchPromises = batch.map(async (question) => {
      const topicInfo = await detectQuestionTopic(question, questionType);
      
      if (verbose) {
        console.log(`  📋 ${question.id}: ${topicInfo.topic} (ID: ${topicInfo.topicId}) [${topicInfo.confidence}]`);
      }
      
      return {
        ...question,
        detectedTopic: topicInfo.topic,
        topicId: topicInfo.topicId,
        topicInfo: topicInfo
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Rate limiting delay between batches
    if (i + batchSize < questions.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // Log topic distribution
  const topicDistribution = {};
  results.forEach(q => {
    const topic = q.detectedTopic || 'unknown';
    topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
  });
  
  console.log(`📊 Topic distribution for ${questionType}:`, topicDistribution);
  
  return results;
}

/**
 * Get all available topics with their IDs
 */
function getAvailableTopics() {
  return TOPIC_MAPPING;
}

/**
 * Get topic ID by name
 */
function getTopicId(topicName) {
  return TOPIC_MAPPING[topicName.toLowerCase()] || 1;
}

module.exports = {
  detectQuestionTopic,
  mapTopicsForQuestions,
  getDefaultTopic,
  getAvailableTopics,
  getTopicId,
  TOPIC_MAPPING,
  DEFAULT_TOPICS
};