import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'

// Import the app's Question type
import { Question } from '@/data/types/questionTypes'

export interface QuestionsFilters {
  type?: string
  difficulty?: string
  topicId?: number
  setId?: string
  limit?: number
  offset?: number
}

export interface QuestionsResponse {
  questions: Question[]
  total: number
  hasMore: boolean
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

function getCacheKey(filters: QuestionsFilters): string {
  return JSON.stringify(filters)
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Transform database question to app format
 */
function transformQuestion(dbQuestion: any): Question {
  return {
    id: dbQuestion.id, // Keep as string (UUID) to match database format
    text: dbQuestion.question_text,
    options: Array.isArray(dbQuestion.answer_options) 
      ? dbQuestion.answer_options 
      : JSON.parse(dbQuestion.answer_options || '[]'),
    correctAnswer: parseInt(dbQuestion.correct_answer), // Convert string back to number
    explanation: dbQuestion.explanation || '',
    difficulty: dbQuestion.difficulty as 'easy' | 'medium' | 'hard',
    type: dbQuestion.type as 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'vocabulary',
    passageText: dbQuestion.passage_content,
    passageTitle: dbQuestion.passage_title,
    topicId: dbQuestion.topic_id,
    tags: [], // We can extract from metadata if needed
    metadata: dbQuestion.metadata || {}
  }
}

/**
 * Get questions by premium set
 */
export async function getQuestionsByPremiumSet(setId: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('👑 Fetching premium set questions...', { setId, premium: userIsPremium });
  
  if (!userIsPremium) {
    console.log('⛔ User is not premium - denying access to premium set');
    return [];
  }

  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_premium', true)
      .filter('metadata->set_id', 'eq', setId)
      .order('metadata->set_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching premium set questions:', error);
      return [];
    }

    const transformedQuestions = questions?.map(q => transformQuestion(q)) || [];
    console.log(`✅ Fetched ${transformedQuestions.length} questions from premium set ${setId}`);
    
    return transformedQuestions;
  } catch (error) {
    console.error('❌ Error in getQuestionsByPremiumSet:', error);
    return [];
  }
}

/**
 * Get all available premium sets
 */
export async function getAvailablePremiumSets(userIsPremium: boolean = false): Promise<any[]> {
  console.log('📋 Fetching available premium sets...', { premium: userIsPremium });
  
  if (!userIsPremium) {
    return [];
  }

  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('metadata, type, difficulty, is_premium')
      .eq('is_premium', true)
      .not('metadata->set_id', 'is', null);

    if (error) {
      console.error('❌ Error fetching premium sets:', error);
      return [];
    }

    // Group questions by set_id to create set summaries
    const setsMap = questions?.reduce((acc: any, question) => {
      const setId = question.metadata?.set_id;
      if (!setId) return acc;

      if (!acc[setId]) {
        acc[setId] = {
          set_id: setId,
          set_number: question.metadata?.set_number || 1,
          set_type: question.metadata?.set_type || question.type,
          difficulty: question.difficulty,
          questions: []
        };
      }
      
      acc[setId].questions.push(question);
      return acc;
    }, {}) || {};

    const sets = Object.values(setsMap).map((set: any) => ({
      ...set,
      question_count: set.questions.length,
      questions: undefined // Remove questions array from response
    }));

    console.log(`✅ Found ${sets.length} premium sets`);
    return sets;
  } catch (error) {
    console.error('❌ Error in getAvailablePremiumSets:', error);
    return [];
  }
}

/**
 * Fetch questions from Supabase with optional filters
 */
export async function getQuestionsFromDB(filters: QuestionsFilters = {}, userIsPremium: boolean = false): Promise<QuestionsResponse> {
  const cacheKey = getCacheKey(filters) + (userIsPremium ? '_premium' : '_free')
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached questions')
    return cached
  }

  try {
    console.log('🔍 Fetching questions from database...', filters, 'Premium:', userIsPremium)

    // Build query
    let query = supabase
      .from('questions')
      .select('*')

    // Apply premium filtering - free users only see non-premium questions
    if (!userIsPremium) {
      query = query.or('is_premium.is.null,is_premium.eq.false')
    }

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }
    
    if (filters.topicId) {
      query = query.eq('topic_id', filters.topicId)
    }
    
    if (filters.setId) {
      // Handle both regular setId and premium set filtering
      if (filters.setId.includes('premium')) {
        query = query.filter('metadata->set_id', 'eq', filters.setId)
      } else {
        query = query.eq('set_id', filters.setId)
      }
    }

    // Apply pagination
    const limit = filters.limit || 50
    const offset = filters.offset || 0
    
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data: questions, error, count } = await query

    if (error) {
      console.error('❌ Error fetching questions:', error)
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }

    if (!questions) {
      return { questions: [], total: 0, hasMore: false }
    }

    // Transform questions
    const transformedQuestions = questions.map(q => transformQuestion(q))

    const result: QuestionsResponse = {
      questions: transformedQuestions,
      total: count || questions.length,
      hasMore: questions.length === limit
    }

    // Cache the result
    setCachedData(cacheKey, result)

    console.log(`✅ Fetched ${questions.length} questions from database (Premium: ${userIsPremium})`)
    return result

  } catch (error) {
    console.error('❌ Error in getQuestionsFromDB:', error)
    throw error
  }
}

/**
 * Get questions by type (for backward compatibility)
 */
export async function getQuestionsByType(type: string, difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  const filters: QuestionsFilters = { type }
  if (difficulty) {
    filters.difficulty = difficulty
  }
  
  const response = await getQuestionsFromDB(filters, userIsPremium)
  return response.questions
}

/**
 * Get vocabulary questions specifically
 */
export async function getVocabularyQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📚 Fetching vocabulary questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('vocabulary', difficulty, userIsPremium)
}

/**
 * Get reading comprehension questions with passages
 */
export async function getReadingQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📖 Fetching reading comprehension questions...', { difficulty })
  
  try {
    // Use direct query with passages join for reading comprehension
    let query = supabase
      .from('questions')
      .select(`
        *,
        passages:passage_id (
          id,
          title,
          content
        )
      `)
      .eq('type', 'reading-comprehension')
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    // Execute query
    const { data: questions, error } = await query.limit(100)
    
    if (error) {
      console.error('❌ Error fetching reading questions:', error)
      // Fallback to simple query if join fails
      console.log('🔄 Falling back to simple query...')
      const fallbackFilters: QuestionsFilters = { 
        type: 'reading-comprehension',
        limit: 100
      }
      if (difficulty) {
        fallbackFilters.difficulty = difficulty
      }
      const response = await getQuestionsFromDB(fallbackFilters, userIsPremium)
      return response.questions
    }
    
    if (!questions) {
      return []
    }
    
    // Transform questions with passage data from join
    const transformedQuestions = questions.map(q => {
      const transformed = transformQuestion(q)
      
      // Override passage data with joined data if available
      if (q.passages) {
        transformed.passageText = q.passages.content
        transformed.passageTitle = q.passages.title
      }
      
      return transformed
    })
    
    console.log(`✅ Fetched ${transformedQuestions.length} reading questions with passage data`)
    return transformedQuestions
    
  } catch (error) {
    console.error('❌ Error in getReadingQuestions:', error)
    // Final fallback to basic question fetch
    const filters: QuestionsFilters = { 
      type: 'reading-comprehension',
      limit: 100
    }
    if (difficulty) {
      filters.difficulty = difficulty
    }
    const response = await getQuestionsFromDB(filters, userIsPremium)
    return response.questions
  }
}

/**
 * Get restatement questions
 */
export async function getRestatementQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('🔄 Fetching restatement questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('restatement', difficulty, userIsPremium)
}

/**
 * Get sentence completion questions
 */
export async function getSentenceCompletionQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📝 Fetching sentence completion questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('sentence-completion', difficulty, userIsPremium)
}

/**
 * Get all available question types
 */
export async function getQuestionTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('type')
    
    if (error) throw error

    // Extract unique types manually
    const uniqueTypes = [...new Set(data?.map(item => item.type) || [])]
    return uniqueTypes
  } catch (error) {
    console.error('❌ Error fetching question types:', error)
    return ['vocabulary', 'restatement', 'sentence-completion', 'reading-comprehension']
  }
}

/**
 * Get questions for simulation (mixed types)
 */
export async function getSimulationQuestions(count: number = 50, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('🎯 Fetching simulation questions...', { count, premium: userIsPremium })
  
  try {
    // Get a balanced mix of question types
    const typeCounts = Math.floor(count / 4)
    const remainder = count % 4
    
    const vocabularyPromise = getVocabularyQuestions(undefined, userIsPremium).then(q => q.slice(0, typeCounts))
    const restatementPromise = getRestatementQuestions(undefined, userIsPremium).then(q => q.slice(0, typeCounts))
    const sentencePromise = getSentenceCompletionQuestions(undefined, userIsPremium).then(q => q.slice(0, typeCounts))
    const readingPromise = getReadingQuestions(undefined, userIsPremium).then(q => q.slice(0, typeCounts + remainder))
    
    const [vocab, restate, sentence, reading] = await Promise.all([
      vocabularyPromise,
      restatementPromise, 
      sentencePromise,
      readingPromise
    ])
    
    // Combine and shuffle
    const allQuestions = [...vocab, ...restate, ...sentence, ...reading]
    return shuffleArray(allQuestions).slice(0, count)
    
  } catch (error) {
    console.error('❌ Error fetching simulation questions:', error)
    throw error
  }
}

/**
 * Utility function to shuffle array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Clear cache (useful for testing or force refresh)
 */
export function clearQuestionsCache(): void {
  cache.clear()
  console.log('🧹 Questions cache cleared')
}

/**
 * Preload common question sets for better performance
 */
export async function preloadCommonQuestions(): Promise<void> {
  console.log('🚀 Preloading common question sets...')
  
  try {
    // Preload most common question types
    await Promise.all([
      getVocabularyQuestions('easy'),
      getVocabularyQuestions('medium'),
      getRestatementQuestions('easy'),
      getSentenceCompletionQuestions('easy')
    ])
    
    console.log('✅ Common questions preloaded')
  } catch (error) {
    console.error('❌ Error preloading questions:', error)
  }
}

export {
  getQuestionsByPremiumSet,
  getAvailablePremiumSets
};
