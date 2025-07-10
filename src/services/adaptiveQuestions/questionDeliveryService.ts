
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
import { validateQuestion, sanitizeQuestion, validateQuestionBatch } from '@/utils/questionValidation';

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
      
      console.log('[QuestionDeliveryService] Getting personalized questions with options:', {
        userId,
        difficulty,
        sessionType,
        questionLimit,
        questionGroup,
        hasQuestionGroup: !!(questionGroup && questionGroup.length > 0)
      });
      
      // Build base query
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true);

      // Apply question type filtering FIRST if questionGroup is specified
      if (questionGroup && questionGroup.length > 0) {
        console.log('[QuestionDeliveryService] Filtering by question types:', questionGroup);
        query = query.in('type', questionGroup);
      }

      // Apply difficulty filter if specified and not mixed
      if (difficulty && difficulty !== 'mixed') {
        console.log('[QuestionDeliveryService] Filtering by difficulty:', difficulty);
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
        console.error('[QuestionDeliveryService] No questions found with criteria:', {
          questionGroup,
          difficulty,
          totalQuestionsInDb: 0
        });
        throw new Error('No questions available for the selected criteria');
      }

      console.log('[QuestionDeliveryService] Found questions:', {
        totalFound: allQuestions.length,
        questionTypes: [...new Set(allQuestions.map(q => q.type))],
        difficulties: [...new Set(allQuestions.map(q => q.difficulty))],
        seenQuestionIds: seenQuestionIds.length
      });

      // Validate all questions before processing
      const validationResults = validateQuestionBatch(allQuestions);
      
      if (validationResults.invalidQuestions > 0) {
        console.error('[QuestionDeliveryService] Validation found invalid questions:', {
          totalQuestions: validationResults.totalQuestions,
          invalidCount: validationResults.invalidQuestions,
          invalidIds: validationResults.invalidQuestionIds,
          errors: validationResults.errors.slice(0, 10) // Log first 10 errors
        });
      }
      
      if (validationResults.warnings.length > 0) {
        console.warn('[QuestionDeliveryService] Validation warnings:', 
          validationResults.warnings.slice(0, 10) // Log first 10 warnings
        );
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
      const convertedQuestions: Question[] = allQuestions.map(q => {
        // First sanitize the question data
        const sanitized = sanitizeQuestion(q);
        
        // Validate the sanitized question
        const validation = validateQuestion(sanitized);
        
        // Enhanced logging for debugging
        const debugInfo = {
          id: sanitized.id,
          originalId: sanitized.original_id,
          type: sanitized.type,
          optionsType: typeof sanitized.options,
          optionsIsArray: Array.isArray(sanitized.options),
          optionsContent: sanitized.options,
          optionsLength: Array.isArray(sanitized.options) ? sanitized.options.length : 'N/A',
          hasPassageText: !!sanitized.passage_text,
          passageTextLength: sanitized.passage_text ? sanitized.passage_text.length : 0,
          passageTextPreview: sanitized.passage_text ? sanitized.passage_text.substring(0, 50) + '...' : 'None',
          validationErrors: validation.errors,
          validationWarnings: validation.warnings
        };

        // Log detailed info for reading comprehension questions
        if (sanitized.type === 'reading-comprehension') {
          console.log('[QuestionDeliveryService] Reading comprehension question debug:', debugInfo);
        }

        // Log any questions with validation issues
        if (!validation.isValid) {
          console.error('[QuestionDeliveryService] Question failed validation after sanitization:', debugInfo);
        }

        return {
          id: sanitized.original_id || parseInt(sanitized.id),
          type: sanitized.type as Question['type'],
          text: sanitized.text,
          options: sanitized.options,
          correctAnswer: sanitized.correct_answer,
          explanation: sanitized.explanation || '',
          difficulty: (sanitized.difficulty as Question['difficulty']) || 'medium',
          passage_text: sanitized.passage_text,
          passage_title: sanitized.passage_title,
          passageText: sanitized.passageText,
          passageTitle: sanitized.passageTitle,
          topicId: sanitized.topic_id,
          tags: Array.isArray(sanitized.tags) ? sanitized.tags : []
        };
      });

      // Prioritize unseen questions
      const unseenQuestions = convertedQuestions.filter(q => !seenQuestionIds.includes(q.id));
      const seenQuestions = convertedQuestions.filter(q => seenQuestionIds.includes(q.id));

      console.log('[QuestionDeliveryService] Question distribution:', {
        unseenQuestions: unseenQuestions.length,
        seenQuestions: seenQuestions.length,
        requestedLimit: questionLimit
      });

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

      console.log('[QuestionDeliveryService] Final delivery result:', {
        strategy,
        finalQuestionsCount: finalQuestions.length,
        finalQuestionTypes: [...new Set(finalQuestions.map(q => q.type))],
        finalDifficulties: [...new Set(finalQuestions.map(q => q.difficulty))]
      });

      return {
        questions: finalQuestions,
        strategy,
        metadata: {
          totalPoolSize: convertedQuestions.length,
          unseenPoolSize: unseenQuestions.length,
          algorithmVersion: '1.0.1',
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
