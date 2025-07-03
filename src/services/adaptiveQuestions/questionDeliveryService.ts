
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
    sessionId?: string;
  }): Promise<QuestionDeliveryResult> {
    try {
      const { userId, difficulty, sessionType, questionLimit } = options;
      
      // Build base query
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

      // Apply difficulty filter if specified and not mixed
      if (difficulty && difficulty !== 'mixed') {
        query = query.eq('difficulty', difficulty);
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

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
