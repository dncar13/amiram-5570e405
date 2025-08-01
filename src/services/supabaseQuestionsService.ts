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
    // Premium fields from database
    is_premium: dbQuestion.is_premium || false,
    ai_generated: dbQuestion.ai_generated || false,
    generation_model: dbQuestion.generation_model || undefined,
    batch_id: dbQuestion.batch_id || undefined,
    quality_score: dbQuestion.quality_score || undefined,
    tags: [], // We can extract from metadata if needed
    metadata: dbQuestion.metadata || {}
  }
}

/**
 * Get questions by set (all questions are now premium)
 */
export async function getQuestionsByPremiumSet(setId: string, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('👑 Fetching set questions...', { setId });
  
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .filter('metadata->set_id', 'eq', setId)
      .order('metadata->set_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching set questions:', error);
      return [];
    }

    const transformedQuestions = questions?.map(q => transformQuestion(q)) || [];
    console.log(`✅ Fetched ${transformedQuestions.length} questions from set ${setId}`);
    
    return transformedQuestions;
  } catch (error) {
    console.error('❌ Error in getQuestionsByPremiumSet:', error);
    return [];
  }
}

/**
 * Get all available sets (all sets are now available)
 */
export async function getAvailablePremiumSets(userIsPremium: boolean = true): Promise<any[]> {
  console.log('📋 Fetching available sets...');
  
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('metadata, type, difficulty, is_premium')
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
  const cacheKey = getCacheKey(filters) + '_admin_all'
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached admin questions')
    return cached
  }

  try {
    console.log('🔍 [ADMIN] Fetching ALL questions from database (including premium)...', filters)

    // First, get accurate count with a separate query
    let countQuery = supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })

    // Apply same filters to count query
    if (filters.type) {
      countQuery = countQuery.eq('type', filters.type)
    }
    if (filters.difficulty) {
      countQuery = countQuery.eq('difficulty', filters.difficulty)
    }
    if (filters.topicId) {
      countQuery = countQuery.eq('topic_id', filters.topicId)
    }
    if (filters.setId) {
      if (filters.setId.includes('premium')) {
        countQuery = countQuery.filter('metadata->set_id', 'eq', filters.setId)
      } else {
        countQuery = countQuery.eq('set_id', filters.setId)
      }
    }

    const { count: totalCount, error: countError } = await countQuery
    
    if (countError) {
      console.error('❌ [ADMIN] Error getting question count:', countError)
    } else {
      console.log(`📊 [ADMIN] Total questions in database: ${totalCount}`)
    }

    // Build main query - NO premium filtering for admin
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

    // FIFO Logic: Newest questions first (created_at DESC)
    query = query.order('created_at', { ascending: false })
    
    // For admin panel, set a high limit to bypass Supabase's default 1000-row limit
    // This ensures we get ALL questions, not just the first 1000
    query = query.limit(50000) // Set high limit to get all possible questions

    const { data: questions, error } = await query

    if (error) {
      console.error('❌ [ADMIN] Error fetching questions:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ [ADMIN] Fetched ${questions?.length || 0} questions from database`)
    console.log(`🔍 [ADMIN] Premium questions found:`, questions?.filter(q => q.is_premium).length || 0)
    console.log(`📊 [ADMIN] Using accurate count: ${totalCount} (vs fetched: ${questions?.length || 0})`)

    const transformedQuestions = questions?.map(transformQuestion) || []
    
    const result: QuestionsResponse = {
      questions: transformedQuestions,
      total: totalCount || transformedQuestions.length, // Use accurate count from separate query
      hasMore: false // Admin panel gets all questions, no pagination
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
 * Fetch questions from Supabase with UNIFIED PREMIUM SYSTEM
 * - Free users: only see is_premium = false (20 questions)
 * - Premium users: see ALL questions (676 premium + 20 free)
 */
export async function getQuestionsFromDB(filters: QuestionsFilters = {}, userIsPremium: boolean = false): Promise<QuestionsResponse> {
  const cacheKey = getCacheKey(filters) + (userIsPremium ? '_premium' : '_free')
  const cached = getCachedData<QuestionsResponse>(cacheKey)
  
  if (cached) {
    console.log('📦 Returning cached questions for', userIsPremium ? 'PREMIUM' : 'FREE', 'user')
    return cached
  }

  try {
    console.log('🔍 Fetching questions from database...', filters, 'Premium user:', userIsPremium)

    // Build query with unified premium system
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

    // UNIFIED PREMIUM FILTERING with FIFO ordering:
    // Free users only see free questions, premium users see everything
    if (!userIsPremium) {
      query = query.eq('is_premium', false)
      console.log('🆓 Filtering for FREE questions only (FIFO: newest first)')
    } else {
      console.log('👑 Loading ALL questions for PREMIUM user (FIFO: newest first)')
    }

    // FIFO Logic: Always serve newest questions first
    query = query.order('created_at', { ascending: false })

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
export async function getQuestionsByType(type: string, difficulty?: string, userIsPremium: boolean = true): Promise<Question[]> {
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
export async function getVocabularyQuestions(difficulty?: string, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('📚 Fetching vocabulary questions...', { difficulty })
  return getQuestionsByType('vocabulary', difficulty, userIsPremium)
}

/**
 * Get reading comprehension questions with passages
 */
export async function getReadingQuestions(difficulty?: string, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('📖 Fetching reading comprehension questions...', { difficulty })
  
  try {
    // Use direct query with passages join for reading comprehension - FIFO ordering
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
    
    // FIFO Logic: Newest questions first
    query = query.order('created_at', { ascending: false })
    
    // Execute query with reasonable limit
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
export async function getRestatementQuestions(difficulty?: string, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('🔄 Fetching restatement questions...', { difficulty })
  return getQuestionsByType('restatement', difficulty, userIsPremium)
}

/**
 * Get sentence completion questions
 */
export async function getSentenceCompletionQuestions(difficulty?: string, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('📝 Fetching sentence completion questions...', { difficulty })
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
export async function getSimulationQuestions(count: number = 50, userIsPremium: boolean = true): Promise<Question[]> {
  console.log('🎯 Fetching simulation questions...', { count })
  
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

// Note: getQuestionsByPremiumSet and getAvailablePremiumSets are already exported above
