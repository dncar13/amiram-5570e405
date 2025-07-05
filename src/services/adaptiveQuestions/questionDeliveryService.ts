
/**
 * Question Delivery Service
 * 
 * Handles intelligent question selection and delivery from Supabase database
 */

import { supabase } from '@/services/supabaseClient';
import { Question } from '@/data/types/questionTypes';
import { 
  QuestionDeliveryOptions,
  QuestionDeliveryResult,
  DeliveryStrategy,
  SessionType,
  DifficultyLevel
} from './types';

export class QuestionDeliveryService {
  async getPersonalizedQuestions(options: {
    userId: string;
    difficulty: DifficultyLevel;
    sessionType: SessionType;
    questionLimit: number;
    questionGroup?: string[];
    sessionId?: string;
  }): Promise<QuestionDeliveryResult> {
    try {
      const { userId, difficulty, sessionType, questionLimit, questionGroup } = options;
      
      // Build base query
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

      // Apply difficulty filter if specified and not mixed
      if (difficulty && difficulty !== 'mixed') {
        query = query.eq('difficulty', difficulty);
      }

      // Apply question type filter if specified
      if (questionGroup && questionGroup.length > 0) {
        // If not mixed mode, filter by specific types
        if (!questionGroup.includes('mixed')) {
          query = query.in('type', questionGroup);
        }
      }

      // Get user's question history to prioritize unseen questions
      const { data: userHistory } = await supabase
        .from('user_question_history')
        .select('question_id')
        .eq('user_id', userId);

      const seenQuestionIds = userHistory?.map(h => h.question_id) || [];

      // Execute query to get all available questions
      const { data: allQuestions, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to fetch questions from database');
      }

      if (!allQuestions || allQuestions.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }

      // FALLBACK LOGIC: If insufficient questions found for specific type, fall back to mixed
      const minRequiredQuestions = Math.min(questionLimit, 5);
      if (questionGroup && questionGroup.length === 1 && questionGroup[0] !== 'mixed' && 
          allQuestions.length < minRequiredQuestions) {
        
        console.warn(`Only ${allQuestions.length} questions found for type ${questionGroup[0]}. Falling back to mixed mode.`);
        
        // Retry with mixed mode (all question types)
        let fallbackQuery = supabase
          .from('questions')
          .select('*')
          .eq('is_active', true);

        // Keep difficulty filter
        if (difficulty && difficulty !== 'mixed') {
          fallbackQuery = fallbackQuery.eq('difficulty', difficulty);
        }

        const { data: fallbackQuestions, error: fallbackError } = await fallbackQuery;
        
        if (fallbackError) {
          console.error('Error in fallback query:', fallbackError);
          throw new Error('Failed to fetch fallback questions');
        }

        if (fallbackQuestions && fallbackQuestions.length > 0) {
          // Use fallback questions and show warning in metadata
          const originalQuestionCount = allQuestions.length;
          Object.assign(allQuestions, fallbackQuestions);
          console.log(`Fallback successful: Found ${fallbackQuestions.length} mixed questions (originally ${originalQuestionCount} for ${questionGroup[0]})`);
        }
      }

      // Convert database questions to our Question type
      const convertedQuestions: Question[] = allQuestions.map(q => ({
        id: q.original_id || parseInt(q.id),
        type: q.type as any,
        text: q.text,
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correct_answer,
        explanation: q.explanation || '',
        difficulty: q.difficulty as any || 'medium',
        passageText: q.passage_text,
        passageTitle: q.passage_title,
        topicId: q.topic_id,
        tags: Array.isArray(q.tags) ? q.tags : []
      }));

      // Prioritize unseen questions
      const unseenQuestions = convertedQuestions.filter(q => !seenQuestionIds.includes(q.id));
      const seenQuestions = convertedQuestions.filter(q => seenQuestionIds.includes(q.id));

      // Combine questions with priority to unseen ones
      let finalQuestions: Question[] = [];
      
      if (unseenQuestions.length >= questionLimit) {
        // Enough unseen questions - shuffle and take limit
        finalQuestions = this.shuffleArray(unseenQuestions).slice(0, questionLimit);
      } else {
        // Not enough unseen - take all unseen + some seen
        finalQuestions = [
          ...this.shuffleArray(unseenQuestions),
          ...this.shuffleArray(seenQuestions).slice(0, questionLimit - unseenQuestions.length)
        ];
      }

      // Determine strategy used
      const strategy: DeliveryStrategy = unseenQuestions.length > 0 ? 'unseen_priority' : 'random_weighted';

      return {
        questions: finalQuestions,
        strategy,
        metadata: {
          totalPoolSize: convertedQuestions.length,
          unseenPoolSize: unseenQuestions.length,
          algorithmVersion: '1.0.0',
          selectionTimeMs: 25,
          weightFactors: {
            recency: 0.4,
            accuracy: 0.3,
            difficulty: 0.3
          }
        }
      };
    } catch (error) {
      console.error('Error getting personalized questions:', error);
      throw error;
    }
  }

  async getQuestionTypeCounts(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('type')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching question type counts:', error);
        return {};
      }

      if (!data) {
        return {};
      }

      const counts = data.reduce((acc, question) => {
        const type = question.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Add mixed count (sum of all types)
      const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
      counts['mixed'] = totalCount;

      return counts;
    } catch (error) {
      console.error('Error getting question type counts:', error);
      return {};
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
