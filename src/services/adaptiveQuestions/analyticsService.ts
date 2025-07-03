
/**
 * Analytics Service
 * 
 * Handles user analytics and performance tracking
 */

import { supabase } from '@/services/supabaseClient';
import { UserAnalytics, DifficultyLevel } from './types';

export class AnalyticsService {
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    try {
      // Get overall statistics
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error fetching user progress for analytics:', progressError);
        throw progressError;
      }

      // Calculate overall stats
      let totalQuestions = 0;
      let totalCorrect = 0;
      let totalTime = 0;
      let maxStreak = 0;
      const byDifficulty: { [key: string]: { accuracy: number } } = {};

      if (progressData && progressData.length > 0) {
        progressData.forEach(progress => {
          totalQuestions += progress.questions_seen;
          totalCorrect += progress.questions_correct;
          totalTime += progress.total_practice_time;
          maxStreak = Math.max(maxStreak, progress.current_streak_days);

          byDifficulty[progress.difficulty] = {
            accuracy: progress.average_accuracy
          };
        });
      }

      const overall = {
        accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
        totalQuestions,
        currentStreak: maxStreak,
        averageTime: totalQuestions > 0 ? totalTime / totalQuestions : 0
      };

      return {
        overall,
        byDifficulty
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw new Error('Failed to get user analytics');
    }
  }

  async recordSessionAnalytics(userId: string, sessionData: {
    sessionId: string;
    questionsAnswered: number;
    questionsCorrect: number;
    sessionDuration: number;
    difficulty: DifficultyLevel;
  }): Promise<void> {
    try {
      // This could be used to record more detailed analytics
      // For now, we rely on the progress tracking service
      console.log('Session analytics recorded:', sessionData);
    } catch (error) {
      console.error('Error recording session analytics:', error);
      throw new Error('Failed to record session analytics');
    }
  }
}
