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
 * Fetch questions from Supabase with optional filters
 */
export async function getQuestionsFromDB(filters: QuestionsFilters = {}): Promise<QuestionsResponse> {
  const cacheKey = getCacheKey(filters)
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached questions')
    return cached
  }

  try {
    console.log('🔍 Fetching questions from database...', filters)

    // Build query - simplified to avoid foreign key issues
    let query = supabase
      .from('questions')
      .select('*')

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
      query = query.eq('set_id', filters.setId)
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

    console.log(`✅ Fetched ${questions.length} questions from database`)
    return result

  } catch (error) {
    console.error('❌ Error in getQuestionsFromDB:', error)
    throw error
  }
}

/**
 * Get questions by type (for backward compatibility)
 */
export async function getQuestionsByType(type: string, difficulty?: string): Promise<Question[]> {
  const filters: QuestionsFilters = { type }
  if (difficulty) {
    filters.difficulty = difficulty
  }
  
  const response = await getQuestionsFromDB(filters)
  return response.questions
}

/**
 * Get vocabulary questions specifically
 */
export async function getVocabularyQuestions(difficulty?: string): Promise<Question[]> {
  console.log('📚 Fetching vocabulary questions...', { difficulty })
  return getQuestionsByType('vocabulary', difficulty)
}

/**
 * Get reading comprehension questions with passages
 */
export async function getReadingQuestions(difficulty?: string): Promise<Question[]> {
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
      const response = await getQuestionsFromDB(fallbackFilters)
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
    const response = await getQuestionsFromDB(filters)
    return response.questions
  }
}

/**
 * Get restatement questions
 */
export async function getRestatementQuestions(difficulty?: string): Promise<Question[]> {
  console.log('🔄 Fetching restatement questions...', { difficulty })
  return getQuestionsByType('restatement', difficulty)
}

/**
 * Get sentence completion questions
 */
export async function getSentenceCompletionQuestions(difficulty?: string): Promise<Question[]> {
  console.log('📝 Fetching sentence completion questions...', { difficulty })
  return getQuestionsByType('sentence-completion', difficulty)
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
export async function getSimulationQuestions(count: number = 50): Promise<Question[]> {
  console.log('🎯 Fetching simulation questions...', { count })
  
  try {
    // Get a balanced mix of question types
    const typeCounts = Math.floor(count / 4)
    const remainder = count % 4
    
    const vocabularyPromise = getVocabularyQuestions().then(q => q.slice(0, typeCounts))
    const restatementPromise = getRestatementQuestions().then(q => q.slice(0, typeCounts))
    const sentencePromise = getSentenceCompletionQuestions().then(q => q.slice(0, typeCounts))
    const readingPromise = getReadingQuestions().then(q => q.slice(0, typeCounts + remainder))
    
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