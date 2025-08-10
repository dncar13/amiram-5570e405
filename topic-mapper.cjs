// topic-mapper.cjs - AI-powered topic mapping for question classification
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Topic mapping based on existing topicsData.ts structure
const TOPIC_MAPPING = {
  // Reading Comprehension topics (categoryId: 1)
  reading_comprehension: {
    academic: 2,      // Reading Comprehension - Intermediate
    workplace: 2,     // Reading Comprehension - Intermediate  
    daily_life: 1,    // Reading Comprehension - Basic
    technology: 2,    // Reading Comprehension - Intermediate
    health: 2,        // Reading Comprehension - Intermediate
    general: 1        // Reading Comprehension - Basic
  },
  
  // Grammar topics (categoryId: 2)
  grammar_in_context: {
    conditionals: 5,     // Grammar - Modal Verbs & Conditionals
    modal_verbs: 5,      // Grammar - Modal Verbs & Conditionals
    passive_voice: 3,    // Grammar - Verb Tenses
    reported_speech: 3,  // Grammar - Verb Tenses
    perfect_tenses: 3,   // Grammar - Verb Tenses
    relative_clauses: 4, // Grammar - Sentence Structure
    verb_tenses: 3,      // Grammar - Verb Tenses
    sentence_structure: 4, // Grammar - Sentence Structure
    general: 3           // Grammar - Verb Tenses (default)
  },
  
  // Vocabulary topics (categoryId: 3)
  word_formation: {
    academic: 7,         // Vocabulary - Academic Words
    business: 7,         // Vocabulary - Academic Words
    scientific: 7,       // Vocabulary - Academic Words
    common: 6,           // Vocabulary - Common Words
    phrases: 8,          // Vocabulary - Collocations & Phrases
    collocations: 8,     // Vocabulary - Collocations & Phrases
    general: 6           // Vocabulary - Common Words (default)
  },
  
  // Listening topics (need to be added to topicsData)
  listening_comprehension: {
    academic: 11,        // New: Listening - Academic Content
    workplace: 12,       // New: Listening - Workplace Situations
    daily_life: 13,      // New: Listening - Daily Conversations
    general: 13          // New: Listening - Daily Conversations (default)
  },
  
  listening_continuation: {
    logical_reasoning: 14, // New: Listening - Logical Completion
    context_understanding: 14, // New: Listening - Logical Completion
    general: 14           // New: Listening - Logical Completion (default)
  }
};

// Detect topic using AI analysis
async function detectTopicWithAI(questionType, content, retries = 2) {
  const prompts = {
    listening_comprehension: `Analyze this listening comprehension passage and classify its topic:

"${content}"

Choose the most appropriate category:
- academic: educational, scientific, research content
- workplace: business, professional, office situations  
- daily_life: everyday conversations, personal situations
- technology: tech-related content
- health: medical, wellness topics
- general: other topics

Respond with just the category name.`,

    listening_continuation: `Analyze this listening continuation question and classify its reasoning type:

"${content}"

Choose the most appropriate category:
- logical_reasoning: requires logical thinking and inference
- context_understanding: focuses on understanding context and implications
- general: other types

Respond with just the category name.`,

    word_formation: `Analyze this word formation question and classify its vocabulary domain:

"${content}"

Choose the most appropriate category:
- academic: academic, formal, or technical vocabulary
- business: business, professional terminology
- scientific: scientific, technical terms
- common: everyday, basic vocabulary
- phrases: multi-word expressions, idioms
- collocations: word combinations, fixed phrases
- general: other vocabulary

Respond with just the category name.`,

    grammar_in_context: `Analyze this grammar question and identify the main grammar focus:

"${content}"

Choose the most appropriate category:
- conditionals: if-clauses, hypothetical situations
- modal_verbs: can, could, should, must, might, etc.
- passive_voice: passive constructions
- reported_speech: indirect speech, say/tell constructions
- perfect_tenses: present/past/future perfect
- relative_clauses: who, which, that, where, when
- verb_tenses: general tense usage
- sentence_structure: word order, sentence patterns
- general: other grammar topics

Respond with just the category name.`
  };

  try {
    console.log(`🤖 Detecting topic for ${questionType} using AI...`);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: prompts[questionType] || prompts.general
      }]
    });

    const detectedTopic = response.content[0].text.trim().toLowerCase();
    console.log(`📋 AI detected topic: ${detectedTopic}`);
    
    // Validate the detected topic exists in our mapping
    const mapping = TOPIC_MAPPING[questionType];
    if (mapping && mapping[detectedTopic]) {
      return detectedTopic;
    } else {
      console.warn(`⚠️ Unknown topic "${detectedTopic}", using default`);
      return 'general';
    }
    
  } catch (error) {
    console.error(`❌ AI topic detection failed:`, error.message);
    if (retries > 0) {
      console.log(`🔄 Retrying topic detection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return detectTopicWithAI(questionType, content, retries - 1);
    }
    return 'general'; // Fallback to general
  }
}

// Map question to topic ID
function mapQuestionToTopicId(questionType, detectedTopic = 'general') {
  const mapping = TOPIC_MAPPING[questionType];
  
  if (!mapping) {
    console.warn(`⚠️ No mapping found for question type: ${questionType}`);
    return null;
  }
  
  const topicId = mapping[detectedTopic] || mapping.general;
  
  if (!topicId) {
    console.warn(`⚠️ No topic ID found for ${questionType}:${detectedTopic}`);
    return null;
  }
  
  console.log(`📍 Mapped ${questionType}:${detectedTopic} → topic ID ${topicId}`);
  return topicId;
}

// Get topic info by ID (for validation)
function getTopicInfo(topicId) {
  // This would ideally come from your database, but for now we'll use static data
  const topics = {
    1: { title: "Reading Comprehension - Basic", categoryId: 1, tags: ["reading", "basic"] },
    2: { title: "Reading Comprehension - Intermediate", categoryId: 1, tags: ["reading", "intermediate"] },
    3: { title: "Grammar - Verb Tenses", categoryId: 2, tags: ["grammar", "verbs"] },
    4: { title: "Grammar - Sentence Structure", categoryId: 2, tags: ["grammar", "structure"] },
    5: { title: "Grammar - Modal Verbs & Conditionals", categoryId: 2, tags: ["grammar", "modals"] },
    6: { title: "Vocabulary - Common Words", categoryId: 3, tags: ["vocabulary", "basic"] },
    7: { title: "Vocabulary - Academic Words", categoryId: 3, tags: ["vocabulary", "academic"] },
    8: { title: "Vocabulary - Collocations & Phrases", categoryId: 3, tags: ["vocabulary", "phrases"] },
    
    // New listening topics (to be added to database)
    11: { title: "Listening - Academic Content", categoryId: 4, tags: ["listening", "academic"] },
    12: { title: "Listening - Workplace Situations", categoryId: 4, tags: ["listening", "workplace"] },
    13: { title: "Listening - Daily Conversations", categoryId: 4, tags: ["listening", "daily"] },
    14: { title: "Listening - Logical Completion", categoryId: 4, tags: ["listening", "reasoning"] }
  };
  
  return topics[topicId] || null;
}

// Enhanced question processing with topic detection
async function processQuestionWithTopic(question, useAI = true) {
  try {
    let detectedTopic = 'general';
    
    if (useAI) {
      // Extract content for AI analysis
      let contentToAnalyze = '';
      
      if (question.type === 'listening_comprehension') {
        contentToAnalyze = question.audioScript || '';
      } else if (question.type === 'listening_continuation') {
        contentToAnalyze = question.text || '';
      } else if (question.type === 'word_formation') {
        contentToAnalyze = question.sentence || '';
      } else if (question.type === 'grammar_in_context') {
        contentToAnalyze = question.text || '';
      }
      
      if (contentToAnalyze) {
        detectedTopic = await detectTopicWithAI(question.type, contentToAnalyze);
      }
    }
    
    // Map to topic ID
    const topicId = mapQuestionToTopicId(question.type, detectedTopic);
    const topicInfo = getTopicInfo(topicId);
    
    // Return enhanced question with topic metadata
    return {
      ...question,
      topicId,
      detectedTopic,
      topicInfo,
      metadata: {
        ...question.metadata,
        detectedTopic,
        topicId,
        categoryId: topicInfo?.categoryId,
        topicTags: topicInfo?.tags || []
      }
    };
    
  } catch (error) {
    console.error(`❌ Topic processing failed for question ${question.id}:`, error.message);
    
    // Fallback: assign default topic
    const fallbackTopicId = mapQuestionToTopicId(question.type, 'general');
    return {
      ...question,
      topicId: fallbackTopicId,
      detectedTopic: 'general',
      metadata: {
        ...question.metadata,
        detectedTopic: 'general',
        topicId: fallbackTopicId,
        processingError: error.message
      }
    };
  }
}

// Process batch of questions with topic detection
async function processQuestionsWithTopics(questions, useAI = true, maxConcurrency = 3) {
  console.log(`🎯 Processing ${questions.length} questions for topic detection (AI: ${useAI})`);
  
  const results = [];
  const errors = [];
  
  // Process in smaller batches to respect API limits
  for (let i = 0; i < questions.length; i += maxConcurrency) {
    const batch = questions.slice(i, i + maxConcurrency);
    console.log(`📦 Processing topic batch ${Math.floor(i / maxConcurrency) + 1} (${batch.length} items)`);
    
    const batchPromises = batch.map(async (question) => {
      try {
        return await processQuestionWithTopic(question, useAI);
      } catch (error) {
        console.error(`❌ Topic processing failed for ${question.id}:`, error.message);
        errors.push({ questionId: question.id, error: error.message });
        return question; // Return original question on error
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Brief pause between batches for API rate limiting
    if (i + maxConcurrency < questions.length && useAI) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const successCount = results.filter(q => q.topicId).length;
  console.log(`✅ Topic processing complete: ${successCount}/${questions.length} successfully mapped`);
  
  if (errors.length > 0) {
    console.log(`⚠️ Topic detection errors:`, errors);
  }
  
  return { results, errors, summary: { total: questions.length, successful: successCount, failed: errors.length } };
}

// Generate SQL for missing listening topics
function generateListeningTopicsSQL() {
  return `
-- Add new listening topics to support audio questions
INSERT INTO topics (id, title, description, difficulty, category_id, estimated_time, tags, order_index, recommended) VALUES
(11, 'Listening - Academic Content', 'הבנת הנשמע ברמה אקדמית - הרצאות ודיונים', 'medium', 4, 45, ARRAY['listening', 'academic'], 11, true),
(12, 'Listening - Workplace Situations', 'הבנת הנשמע בסביבת עבודה - פגישות ושיחות מקצועיות', 'medium', 4, 40, ARRAY['listening', 'workplace'], 12, true),
(13, 'Listening - Daily Conversations', 'הבנת הנשמע יומיומית - שיחות חברתיות ומצבי חיים', 'easy', 4, 35, ARRAY['listening', 'daily'], 13, true),
(14, 'Listening - Logical Completion', 'השלמת משפטים בהקשר הגיוני - חשיבה לוגית', 'medium', 4, 30, ARRAY['listening', 'reasoning'], 14, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  updated_at = NOW();

-- Add listening category if not exists
INSERT INTO categories (id, name, description, icon, color, order_index) VALUES
(4, 'Listening Skills', 'הבנת הנשמע ועיבוד מידע אודיטיבי', 'headphones', 'bg-green-500', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
`;
}

module.exports = {
  detectTopicWithAI,
  mapQuestionToTopicId,
  processQuestionWithTopic,
  processQuestionsWithTopics,
  getTopicInfo,
  generateListeningTopicsSQL,
  TOPIC_MAPPING
};
