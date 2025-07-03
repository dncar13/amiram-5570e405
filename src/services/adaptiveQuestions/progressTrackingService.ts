
/**
 * Progress Tracking Service
 * 
 * Handles user progress tracking and analytics with Supabase
 */

import { supabase } from '@/services/supabaseClient';
import { 
  UserProgress, 
  QuestionAnswer,
  DifficultyLevel 
} from './types';

export class ProgressTrackingService {
  async getUserProgress(userId: string, difficulty: DifficultyLevel): Promise<UserProgress | null> {
    try {
      // Get user progress summary for this difficulty
      const { data: progressData, error } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching user progress:', error);
        throw error;
      }

      if (!progressData) {
        // Create initial progress record if none exists
        const initialProgress = {
          user_id: userId,
          difficulty,
          total_questions_available: 0,
          questions_seen: 0,
          questions_correct: 0,
          questions_incorrect: 0,
          questions_flagged: 0,
          average_accuracy: 0,
          average_time_per_question: 0,
          total_practice_time: 0,
          current_streak_days: 0,
          longest_streak_days: 0,
          last_practice_date: new Date().toISOString().split('T')[0]
        };

        const { data: newProgress, error: insertError } = await supabase
          .from('user_progress_summary')
          .insert(initialProgress)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating initial progress:', insertError);
          throw insertError;
        }

        return this.convertToUserProgress(newProgress);
      }

      return this.convertToUserProgress(progressData);
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw new Error('Failed to get user progress');
    }
  }

  async recordAnswer(answer: {
    userId: string;
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    sessionId: string;
    difficulty: DifficultyLevel;
  }): Promise<void> {
    try {
      const { userId, questionId, selectedAnswer, isCorrect, timeSpent, sessionId, difficulty } = answer;

      // Record in user_question_history
      const { error: historyError } = await supabase
        .from('user_question_history')
        .insert({
          user_id: userId,
          question_id: questionId,
          answer_selected: selectedAnswer,
          is_correct: isCorrect,
          time_spent_seconds: timeSpent,
          simulation_session_id: sessionId,
          difficulty,
          last_seen_at: new Date().toISOString()
        });

      if (historyError) {
        console.error('Error recording answer history:', historyError);
        throw historyError;
      }

      // Update progress summary
      await this.updateProgressSummary(userId, difficulty, isCorrect, timeSpent);

      console.log('Answer recorded successfully:', { questionId, isCorrect, timeSpent });
    } catch (error) {
      console.error('Error recording answer:', error);
      throw new Error('Failed to record answer');
    }
  }

  private async updateProgressSummary(
    userId: string, 
    difficulty: DifficultyLevel, 
    isCorrect: boolean, 
    timeSpent: number
  ): Promise<void> {
    try {
      // Get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single();

      if (!currentProgress) {
        // Create if doesn't exist
        await supabase
          .from('user_progress_summary')
          .insert({
            user_id: userId,
            difficulty,
            total_questions_available: 0,
            questions_seen: 1,
            questions_correct: isCorrect ? 1 : 0,
            questions_incorrect: isCorrect ? 0 : 1,
            questions_flagged: 0,
            average_accuracy: isCorrect ? 100 : 0,
            average_time_per_question: timeSpent,
            total_practice_time: timeSpent,
            current_streak_days: isCorrect ? 1 : 0,
            longest_streak_days: isCorrect ? 1 : 0,
            last_practice_date: new Date().toISOString().split('T')[0]
          });
      } else {
        // Update existing
        const newQuestionsSeen = currentProgress.questions_seen + 1;
        const newQuestionsCorrect = currentProgress.questions_correct + (isCorrect ? 1 : 0);
        const newQuestionsIncorrect = currentProgress.questions_incorrect + (isCorrect ? 0 : 1);
        const newTotalTime = currentProgress.total_practice_time + timeSpent;
        const newAccuracy = (newQuestionsCorrect / newQuestionsSeen) * 100;
        const newAvgTime = newTotalTime / newQuestionsSeen;
        const newStreak = isCorrect ? currentProgress.current_streak_days + 1 : 0;

        await supabase
          .from('user_progress_summary')
          .update({
            questions_seen: newQuestionsSeen,
            questions_correct: newQuestionsCorrect,
            questions_incorrect: newQuestionsIncorrect,
            average_accuracy: newAccuracy,
            average_time_per_question: Math.round(newAvgTime),
            total_practice_time: newTotalTime,
            current_streak_days: newStreak,
            longest_streak_days: Math.max(newStreak, currentProgress.longest_streak_days),
            last_practice_date: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('difficulty', difficulty);
      }
    } catch (error) {
      console.error('Error updating progress summary:', error);
      throw error;
    }
  }

  private convertToUserProgress(data: any): UserProgress {
    return {
      userId: data.user_id,
      difficulty: data.difficulty,
      totalQuestionsAvailable: data.total_questions_available,
      questionsSeen: data.questions_seen,
      questionsCorrect: data.questions_correct,
      questionsIncorrect: data.questions_incorrect,
      questionsFlagged: data.questions_flagged,
      averageAccuracy: data.average_accuracy,
      averageTimePerQuestion: data.average_time_per_question,
      totalPracticeTime: data.total_practice_time,
      currentStreakDays: data.current_streak_days,
      longestStreakDays: data.longest_streak_days,
      lastPracticeDate: new Date(data.last_practice_date),
      firstQuestionDate: new Date(data.created_at),
      lastResetDate: null,
      updatedAt: new Date(data.updated_at)
    };
  }
}
