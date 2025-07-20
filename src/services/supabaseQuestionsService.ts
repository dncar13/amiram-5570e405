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

function getCacheKey(filters: QuestionsFilters, userIsPremium: boolean): string {
  return JSON.stringify({ ...filters, userIsPremium })
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
    id: dbQuestion.id,
    text: dbQuestion.question_text,
    options: Array.isArray(dbQuestion.answer_options) 
      ? dbQuestion.answer_options 
      : JSON.parse(dbQuestion.answer_options || '[]'),
    correctAnswer: parseInt(dbQuestion.correct_answer),
    explanation: dbQuestion.explanation || '',
    difficulty: dbQuestion.difficulty as 'easy' | 'medium' | 'hard',
    type: dbQuestion.type as 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'vocabulary',
    passageText: dbQuestion.passage_content,
    passageTitle: dbQuestion.passage_title,
    topicId: dbQuestion.topic_id,
    is_premium: dbQuestion.is_premium || false,
    ai_generated: dbQuestion.ai_generated || false,
    generation_model: dbQuestion.generation_model || undefined,
    batch_id: dbQuestion.batch_id || undefined,
    quality_score: dbQuestion.quality_score || undefined,
    tags: [],
    metadata: dbQuestion.metadata || {}
  }
}

/**
 * Enhanced main function - fetches questions with premium filtering
 */
export async function getQuestionsFromDB(filters: QuestionsFilters = {}, userIsPremium: boolean = false): Promise<QuestionsResponse> {
  const cacheKey = getCacheKey(filters, userIsPremium)
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached questions', { premium: userIsPremium })
    return cached
  }

  try {
    console.log('🔍 Fetching questions from database...', { filters, premium: userIsPremium })

    // Build query
    let query = supabase
      .from('questions')
      .select('*')

    // Apply premium filtering - free users only see non-premium questions
    if (!userIsPremium) {
      query = query.or('is_premium.is.null,is_premium.eq.false')
      console.log('🔒 Filtering out premium questions for free user')
    } else {
      console.log('👑 Premium user - showing all questions including premium')
    }

    // Apply other filters
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

    console.log(`✅ Fetched ${questions.length} questions (Premium: ${userIsPremium})`)
    return result

  } catch (error) {
    console.error('❌ Error in getQuestionsFromDB:', error)
    throw error
  }
}

/**
 * Get questions by type with premium filtering
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
 * Enhanced specialty functions with premium filtering
 */
export async function getVocabularyQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📚 Fetching vocabulary questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('vocabulary', difficulty, userIsPremium)
}

export async function getReadingQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📖 Fetching reading comprehension questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('reading-comprehension', difficulty, userIsPremium)
}

export async function getRestatementQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('🔄 Fetching restatement questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('restatement', difficulty, userIsPremium)
}

export async function getSentenceCompletionQuestions(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📝 Fetching sentence completion questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('sentence-completion', difficulty, userIsPremium)
}

/**
 * Get simulation questions (mixed types) with premium filtering
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
 * Check if user has premium access
 */
export async function checkUserPremiumStatus(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, end_date')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('end_date', new Date().toISOString())
      .single()

    return !!subscription
  } catch (error) {
    console.error('Error checking premium status:', error)
    return false
  }
}

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
      const metadata = question.metadata as any;
      const setId = metadata?.set_id;
      if (!setId) return acc;

      if (!acc[setId]) {
        acc[setId] = {
          set_id: setId,
          set_number: metadata?.set_number || 1,
          set_type: metadata?.set_type || question.type,
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
 * Fetch ALL questions for admin panel (bypasses premium filtering)
 */
export async function getQuestionsFromDBAdmin(filters: QuestionsFilters = {}): Promise<QuestionsResponse> {
  const cacheKey = getCacheKey(filters, true) + '_admin_all'
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached admin questions')
    return cached
  }

  try {
    console.log('🔍 [ADMIN] Fetching ALL questions from database (including premium)...', filters)

    // Build query - NO premium filtering for admin
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
      // Handle both regular setId and premium set filtering
      if (filters.setId.includes('premium')) {
        query = query.filter('metadata->set_id', 'eq', filters.setId)
      } else {
        query = query.eq('set_id', filters.setId)
      }
    }

    // Apply pagination
    const limit = filters.limit || 1000
    const offset = filters.offset || 0
    
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: questions, error, count } = await query

    if (error) {
      console.error('❌ [ADMIN] Error fetching questions:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ [ADMIN] Fetched ${questions?.length || 0} questions from database`)
    console.log(`🔍 [ADMIN] Premium questions found:`, questions?.filter(q => q.is_premium).length || 0)

    const transformedQuestions = questions?.map(transformQuestion) || []
    
    const result: QuestionsResponse = {
      questions: transformedQuestions,
      total: count || transformedQuestions.length,
      hasMore: (count || 0) > offset + transformedQuestions.length
    }

    setCachedData(cacheKey, result)
    return result

  } catch (error) {
    console.error('❌ [ADMIN] Error in getQuestionsFromDBAdmin:', error)
    return {
      questions: [],
      total: 0,
      hasMore: false
    }
  }
}

/**
 * Get questions by type (for backward compatibility)
 */
export async function getQuestionsByTypeOld(type: string, difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
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
export async function getVocabularyQuestionsOld(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('📚 Fetching vocabulary questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('vocabulary', difficulty, userIsPremium)
}

/**
 * Get reading comprehension questions with passages
 */
export async function getReadingQuestionsOld(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
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
export async function getRestatementQuestionsOld(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
  console.log('🔄 Fetching restatement questions...', { difficulty, premium: userIsPremium })
  return getQuestionsByType('restatement', difficulty, userIsPremium)
}

/**
 * Get sentence completion questions
 */
export async function getSentenceCompletionQuestionsOld(difficulty?: string, userIsPremium: boolean = false): Promise<Question[]> {
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
export async function getSimulationQuestionsOld(count: number = 50, userIsPremium: boolean = false): Promise<Question[]> {
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
function shuffleArrayOld<T>(array: T[]): T[] {
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
export function clearQuestionsCacheOld(): void {
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

// Note: getQuestionsByPremiumSet and getAvailablePremiumSets are already exported above
