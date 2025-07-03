/**
 * Question Delivery Service - Core Algorithm
 * 
 * Implements intelligent question selection with:
 * - 30-day recency tracking
 * - Smart delivery strategies
 * - Performance optimization
 * - Fallback mechanisms
 */

import { supabase } from '../supabaseClient';
import { Question } from '@/data/types/questionTypes';
import {
  QuestionDeliveryOptions,
  DeliveryResult,
  DeliveryStrategy,
  DifficultyLevel,
  SessionType,
  DatabaseQuestionHistory
} from './types';
import {
  DELIVERY_STRATEGIES,
  ALGORITHM_CONFIG,
  ERROR_MESSAGES
} from './constants';

export class QuestionDeliveryService {

  /**
   * Main entry point for getting personalized questions
   */
  async getPersonalizedQuestions(options: QuestionDeliveryOptions): Promise<DeliveryResult> {
    const startTime = Date.now();
    
    try {
      // Validate input parameters
      this.validateDeliveryOptions(options);
      
      // Get available question pool for difficulty
      const questionPool = await this.getQuestionPool(
        options.difficulty, 
        options.topicFilter,
        options.excludeQuestionIds
      );
      
      if (questionPool.length === 0) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_QUESTIONS);
      }
      
      // Get user's question history for this difficulty
      const userHistory = await this.getUserQuestionHistory(
        options.userId,
        options.difficulty
      );
      
      // Determine optimal delivery strategy
      const strategy = options.deliveryStrategy || 
        await this.determineOptimalStrategy(
          options,
          questionPool.length,
          userHistory.length
        );
      
      // Select questions using chosen strategy
      const selectedQuestions = await this.selectQuestionsByStrategy(
        strategy,
        questionPool,
        userHistory,
        options
      );
      
      const selectionTime = Date.now() - startTime;
      
      // Log delivery for analytics
      await this.logQuestionDelivery(
        options.userId,
        strategy,
        selectedQuestions,
        questionPool.length,
        selectionTime
      );
      
      return {
        questions: selectedQuestions,
        strategy,
        metadata: {
          totalPoolSize: questionPool.length,
          unseenPoolSize: await this.getUnseenQuestionCount(options.userId, options.difficulty),
          algorithmVersion: 'v1.0',
          selectionTimeMs: selectionTime,
          weightFactors: DELIVERY_STRATEGIES[strategy].weightFactors
        }
      };
      
    } catch (error) {
      console.error('Question delivery error:', error);
      throw error;
    }
  }

  /**
   * Get available questions for a difficulty level
   */
  private async getQuestionPool(
    difficulty: DifficultyLevel,
    topicFilter?: string[],
    excludeIds?: number[]
  ): Promise<Question[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('difficulty', difficulty);
    
    // Apply topic filter if specified
    if (topicFilter && topicFilter.length > 0) {
      query = query.in('type', topicFilter);
    }
    
    // Exclude specific question IDs if specified
    if (excludeIds && excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch question pool: ${error.message}`);
    }
    
    const questions = data || [];
    
    // For mixed mode with multiple question types, ensure balanced representation
    if (topicFilter && topicFilter.length > 1) {
      return this.balanceQuestionTypes(questions, topicFilter);
    }
    
    return questions;
  }

  /**
   * Balance question types for mixed mode
   */
  private balanceQuestionTypes(questions: Question[], requestedTypes: string[]): Question[] {
    // Group questions by type
    const questionsByType = new Map<string, Question[]>();
    
    questions.forEach(question => {
      if (!questionsByType.has(question.type)) {
        questionsByType.set(question.type, []);
      }
      questionsByType.get(question.type)!.push(question);
    });
    
    // Find the minimum count across all requested types
    let minCount = Infinity;
    requestedTypes.forEach(type => {
      const count = questionsByType.get(type)?.length || 0;
      if (count > 0) {
        minCount = Math.min(minCount, count);
      }
    });
    
    // If we have no questions for any type, return empty array
    if (minCount === Infinity || minCount === 0) {
      return questions; // Fallback to all questions
    }
    
    // Take equal amounts from each type to ensure balance
    const balancedQuestions: Question[] = [];
    requestedTypes.forEach(type => {
      const typeQuestions = questionsByType.get(type) || [];
      // Shuffle the questions for this type to get variety
      const shuffled = [...typeQuestions].sort(() => Math.random() - 0.5);
      // Take up to minCount questions from this type
      balancedQuestions.push(...shuffled.slice(0, Math.min(minCount, typeQuestions.length)));
    });
    
    // Shuffle the final balanced array
    return balancedQuestions.sort(() => Math.random() - 0.5);
  }

  /**
   * Get user's question interaction history
   */
  private async getUserQuestionHistory(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<DatabaseQuestionHistory[]> {
    const { data, error } = await supabase
      .from('user_question_history')
      .select('*')
      .eq('user_id', userId)
      .eq('difficulty', difficulty)
      .order('last_seen_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch user history: ${error.message}`);
    }
    
    return data || [];
  }

  /**
   * Determine the optimal delivery strategy based on user state
   */
  private async determineOptimalStrategy(
    options: QuestionDeliveryOptions,
    totalQuestions: number,
    userHistoryCount: number
  ): Promise<DeliveryStrategy> {
    const unseenCount = await this.getUnseenQuestionCount(options.userId, options.difficulty);
    const coveragePercentage = (userHistoryCount / totalQuestions) * 100;
    
    // Strategy decision logic
    if (options.sessionType === 'review_mistakes') {
      return 'mistake_review';
    }
    
    if (options.sessionType === 'unseen_only') {
      return unseenCount > 0 ? 'unseen_priority' : 'fallback_reshuffle';
    }
    
    if (unseenCount >= options.questionLimit) {
      return 'unseen_priority';
    }
    
    if (unseenCount < ALGORITHM_CONFIG.MIN_UNSEEN_POOL_SIZE) {
      return 'fallback_reshuffle';
    }
    
    if (coveragePercentage > 80) {
      return 'spaced_repetition';
    }
    
    return 'random_weighted';
  }

  /**
   * Select questions using the specified strategy
   */
  private async selectQuestionsByStrategy(
    strategy: DeliveryStrategy,
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    options: QuestionDeliveryOptions
  ): Promise<Question[]> {
    
    const strategyConfig = DELIVERY_STRATEGIES[strategy];
    const weights = strategyConfig.weightFactors;
    
    switch (strategy) {
      case 'unseen_priority':
        return this.selectUnseenPriority(questionPool, userHistory, options.questionLimit);
      
      case 'random_weighted':
        return this.selectRandomWeighted(questionPool, userHistory, options.questionLimit, weights);
      
      case 'spaced_repetition':
        return this.selectSpacedRepetition(questionPool, userHistory, options.questionLimit, weights);
      
      case 'fallback_reshuffle':
        return this.selectFallbackReshuffle(questionPool, userHistory, options.questionLimit);
      
      case 'mistake_review':
        return this.selectMistakeReview(questionPool, userHistory, options.questionLimit);
      
      default:
        throw new Error(`Unknown delivery strategy: ${strategy}`);
    }
  }

  /**
   * Unseen Priority Strategy - Prioritize questions not seen in 30 days
   */
  private selectUnseenPriority(
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    limit: number
  ): Question[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ALGORITHM_CONFIG.UNSEEN_THRESHOLD_DAYS);
    
    // Get questions seen in the last 30 days
    const recentQuestionIds = new Set(
      userHistory
        .filter(h => new Date(h.last_seen_at) > thirtyDaysAgo)
        .map(h => h.question_id)
    );
    
    // Prioritize unseen questions
    const unseenQuestions = questionPool.filter(q => !recentQuestionIds.has(q.id));
    const seenQuestions = questionPool.filter(q => recentQuestionIds.has(q.id));
    
    // Shuffle both pools
    const shuffledUnseen = this.shuffleArray([...unseenQuestions]);
    const shuffledSeen = this.shuffleArray([...seenQuestions]);
    
    // Take from unseen first, then seen if needed
    const selected = [];
    selected.push(...shuffledUnseen.slice(0, limit));
    
    if (selected.length < limit) {
      selected.push(...shuffledSeen.slice(0, limit - selected.length));
    }
    
    return selected.slice(0, limit);
  }

  /**
   * Random Weighted Strategy - Weighted random with slight unseen preference
   */
  private selectRandomWeighted(
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    limit: number,
    weights: Record<string, number>
  ): Question[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ALGORITHM_CONFIG.UNSEEN_THRESHOLD_DAYS);
    
    const historyMap = new Map(
      userHistory.map(h => [h.question_id, h])
    );
    
    // Calculate weights for each question
    const weightedQuestions = questionPool.map(question => {
      const history = historyMap.get(question.id);
      let weight = weights.randomness || 1.0;
      
      if (!history) {
        // Unseen question
        weight *= weights.unseenWeight || 2.0;
      } else {
        const daysSinceLastSeen = Math.floor(
          (Date.now() - new Date(history.last_seen_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Apply recency weight
        weight *= Math.max(0.1, daysSinceLastSeen / 30) * (weights.recentWeight || 0.5);
        
        // Apply accuracy weight
        if (history.is_correct === false) {
          weight *= weights.accuracyWeight || 1.0;
        }
      }
      
      return { question, weight };
    });
    
    // Weighted random selection
    const selected = this.weightedRandomSelection(weightedQuestions, limit);
    return selected.map(item => item.question);
  }

  /**
   * Spaced Repetition Strategy - Optimize review timing
   */
  private selectSpacedRepetition(
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    limit: number,
    weights: Record<string, number>
  ): Question[] {
    const historyMap = new Map(
      userHistory.map(h => [h.question_id, h])
    );
    
    const weightedQuestions = questionPool.map(question => {
      const history = historyMap.get(question.id);
      let weight = weights.randomness || 0.5;
      
      if (!history) {
        // New question gets high priority
        weight *= weights.unseenWeight || 3.0;
      } else {
        const daysSinceLastSeen = Math.floor(
          (Date.now() - new Date(history.last_seen_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Spaced repetition curve - questions should be reviewed at increasing intervals
        const optimalInterval = history.is_correct ? 
          Math.min(30, Math.pow(2, Math.floor(daysSinceLastSeen / 7))) : // Correct: exponential backoff
          Math.min(7, Math.max(1, daysSinceLastSeen / 2)); // Incorrect: more frequent review
        
        const timeDelta = Math.abs(daysSinceLastSeen - optimalInterval);
        const timeDecayWeight = Math.exp(-timeDelta * (weights.timeDecayWeight || 0.1));
        
        weight *= timeDecayWeight;
        
        // Boost incorrect answers
        if (history.is_correct === false) {
          weight *= weights.accuracyWeight || 3.0;
        }
      }
      
      return { question, weight };
    });
    
    const selected = this.weightedRandomSelection(weightedQuestions, limit);
    return selected.map(item => item.question);
  }

  /**
   * Fallback Reshuffle Strategy - When all questions have been seen recently
   */
  private selectFallbackReshuffle(
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    limit: number
  ): Question[] {
    // Simple random selection when all questions have been seen
    const shuffled = this.shuffleArray([...questionPool]);
    return shuffled.slice(0, limit);
  }

  /**
   * Mistake Review Strategy - Focus on previously incorrect answers
   */
  private selectMistakeReview(
    questionPool: Question[],
    userHistory: DatabaseQuestionHistory[],
    limit: number
  ): Question[] {
    // Get questions that were answered incorrectly
    const incorrectQuestionIds = new Set(
      userHistory
        .filter(h => h.is_correct === false)
        .map(h => h.question_id)
    );
    
    const mistakeQuestions = questionPool.filter(q => incorrectQuestionIds.has(q.id));
    const otherQuestions = questionPool.filter(q => !incorrectQuestionIds.has(q.id));
    
    // Prioritize mistake questions
    const shuffledMistakes = this.shuffleArray([...mistakeQuestions]);
    const shuffledOthers = this.shuffleArray([...otherQuestions]);
    
    const selected = [];
    selected.push(...shuffledMistakes.slice(0, limit));
    
    if (selected.length < limit) {
      selected.push(...shuffledOthers.slice(0, limit - selected.length));
    }
    
    return selected.slice(0, limit);
  }

  /**
   * Weighted random selection algorithm
   */
  private weightedRandomSelection<T>(
    items: Array<{ question: T; weight: number }>,
    count: number
  ): Array<{ question: T; weight: number }> {
    const selected: Array<{ question: T; weight: number }> = [];
    const remaining = [...items];
    
    for (let i = 0; i < count && remaining.length > 0; i++) {
      const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
      const random = Math.random() * totalWeight;
      
      let currentWeight = 0;
      let selectedIndex = 0;
      
      for (let j = 0; j < remaining.length; j++) {
        currentWeight += remaining[j].weight;
        if (random <= currentWeight) {
          selectedIndex = j;
          break;
        }
      }
      
      selected.push(remaining[selectedIndex]);
      remaining.splice(selectedIndex, 1);
    }
    
    return selected;
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get count of unseen questions for a user/difficulty
   */
  private async getUnseenQuestionCount(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_unseen_questions', {
        p_user_id: userId,
        p_difficulty: difficulty,
        p_limit: 1000, // High limit to count all
        p_days_threshold: ALGORITHM_CONFIG.UNSEEN_THRESHOLD_DAYS
      });
    
    if (error) {
      console.error('Error getting unseen question count:', error);
      return 0;
    }
    
    return data?.length || 0;
  }

  /**
   * Log question delivery for analytics
   */
  private async logQuestionDelivery(
    userId: string,
    strategy: DeliveryStrategy,
    questions: Question[],
    totalPoolSize: number,
    deliveryTimeMs: number
  ): Promise<void> {
    try {
      const unseenCount = await this.getUnseenQuestionCount(
        userId,
        questions[0]?.difficulty as DifficultyLevel
      );
      
      await supabase
        .from('question_delivery_log')
        .insert({
          user_id: userId,
          difficulty: questions[0]?.difficulty || 'medium',
          total_pool_size: totalPoolSize,
          unseen_pool_size: unseenCount,
          algorithm_version: 'v1.0',
          selection_strategy: strategy,
          weight_factors: DELIVERY_STRATEGIES[strategy].weightFactors,
          questions_delivered: questions.map(q => q.id),
          delivery_time_ms: deliveryTimeMs
        });
    } catch (error) {
      // Log delivery tracking errors but don't fail the main operation
      console.error('Failed to log question delivery:', error);
    }
  }

  /**
   * Validate delivery options
   */
  private validateDeliveryOptions(options: QuestionDeliveryOptions): void {
    if (!options.userId) {
      throw new Error('User ID is required');
    }
    
    if (!['easy', 'medium', 'hard'].includes(options.difficulty)) {
      throw new Error(ERROR_MESSAGES.INVALID_DIFFICULTY);
    }
    
    if (options.questionLimit <= 0 || options.questionLimit > 100) {
      throw new Error('Question limit must be between 1 and 100');
    }
    
    const validSessionTypes: SessionType[] = [
      'quick', 'full', 'custom', 'practice', 'review_mistakes', 'unseen_only'
    ];
    
    if (!validSessionTypes.includes(options.sessionType)) {
      throw new Error(ERROR_MESSAGES.INVALID_SESSION_TYPE);
    }
  }
}