/**
 * Progress Tracking Service
 * 
 * Handles user progress tracking, analytics, and performance metrics
 * for the adaptive question delivery system.
 */

import { supabase } from '../supabaseClient';
import {
  UserProgress,
  ProgressSummary,
  QuestionInteraction,
  DifficultyLevel,
  SessionType,
  DatabaseProgressSummary,
  DatabaseQuestionHistory,
  DatabaseSimulationSession
} from './types';
import {
  ALGORITHM_CONFIG,
  ACHIEVEMENTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from './constants';

export class ProgressTrackingService {

  /**
   * Record a question interaction and update progress
   */
  async recordQuestionInteraction(interaction: {
    userId: string;
    questionId: number;
    answerSelected?: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
    simulationSessionId?: string;
    simulationType: SessionType;
    difficulty: DifficultyLevel;
    flagged?: boolean;
    notes?: string;
  }): Promise<void> {
    try {
      // Insert question interaction record
      const { error: insertError } = await supabase
        .from('user_question_history')
        .insert({
          user_id: interaction.userId,
          question_id: interaction.questionId,
          answer_selected: interaction.answerSelected,
          is_correct: interaction.isCorrect,
          time_spent_seconds: interaction.timeSpentSeconds,
          simulation_session_id: interaction.simulationSessionId,
          simulation_type: interaction.simulationType,
          difficulty: interaction.difficulty,
          flagged: interaction.flagged || false,
          notes: interaction.notes,
          last_seen_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error(`Failed to record interaction: ${insertError.message}`);
      }

      // Progress summary is automatically updated by database trigger
      // But we can also update streak information here
      await this.updateStreakInformation(interaction.userId, interaction.difficulty);

    } catch (error) {
      console.error('Error recording question interaction:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive progress for a user
   */
  async getUserProgress(
    userId: string,
    difficulty?: DifficultyLevel
  ): Promise<ProgressSummary[]> {
    try {
      let query = supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', userId);

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data: progressData, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch progress: ${error.message}`);
      }

      if (!progressData || progressData.length === 0) {
        // Return empty progress for new users
        const difficulties: DifficultyLevel[] = difficulty ? [difficulty] : ['easy', 'medium', 'hard'];
        return difficulties.map(diff => this.createEmptyProgressSummary(userId, diff));
      }

      // Convert database records to progress summaries
      const summaries: ProgressSummary[] = [];
      
      for (const dbProgress of progressData) {
        const progress = this.convertDbProgressToUserProgress(dbProgress);
        const recentActivity = await this.getRecentActivity(userId, dbProgress.difficulty as DifficultyLevel);
        const recommendations = await this.generateRecommendations(progress, recentActivity);

        summaries.push({
          difficulty: dbProgress.difficulty as DifficultyLevel,
          progress,
          recentActivity,
          recommendations
        });
      }

      return summaries;

    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  /**
   * Get detailed question history for a user
   */
  async getQuestionHistory(
    userId: string,
    options: {
      difficulty?: DifficultyLevel;
      limit?: number;
      includeCorrectOnly?: boolean;
      includeIncorrectOnly?: boolean;
      timeRange?: 'week' | 'month' | 'all';
    } = {}
  ): Promise<QuestionInteraction[]> {
    try {
      let query = supabase
        .from('user_question_history')
        .select(`
          *,
          questions!inner(*)
        `)
        .eq('user_id', userId)
        .order('last_seen_at', { ascending: false });

      // Apply filters
      if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty);
      }

      if (options.includeCorrectOnly) {
        query = query.eq('is_correct', true);
      } else if (options.includeIncorrectOnly) {
        query = query.eq('is_correct', false);
      }

      if (options.timeRange) {
        const cutoffDate = new Date();
        if (options.timeRange === 'week') {
          cutoffDate.setDate(cutoffDate.getDate() - 7);
        } else if (options.timeRange === 'month') {
          cutoffDate.setDate(cutoffDate.getDate() - 30);
        }
        
        if (options.timeRange !== 'all') {
          query = query.gte('last_seen_at', cutoffDate.toISOString());
        }
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch question history: ${error.message}`);
      }

      return (data || []).map(this.convertDbHistoryToInteraction);

    } catch (error) {
      console.error('Error fetching question history:', error);
      throw error;
    }
  }

  /**
   * Reset progress for a specific difficulty level
   */
  async resetProgress(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<void> {
    try {
      // Delete question history for this difficulty
      const { error: historyError } = await supabase
        .from('user_question_history')
        .delete()
        .eq('user_id', userId)
        .eq('difficulty', difficulty);

      if (historyError) {
        throw new Error(`Failed to reset question history: ${historyError.message}`);
      }

      // Update progress summary with reset date
      const { error: progressError } = await supabase
        .from('user_progress_summary')
        .upsert({
          user_id: userId,
          difficulty: difficulty,
          total_questions_available: await this.getTotalQuestionsForDifficulty(difficulty),
          questions_seen: 0,
          questions_correct: 0,
          questions_incorrect: 0,
          questions_flagged: 0,
          average_accuracy: 0,
          average_time_per_question: 0,
          total_practice_time: 0,
          current_streak_days: 0,
          longest_streak_days: 0,
          last_practice_date: null,
          first_question_date: null,
          last_reset_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (progressError) {
        throw new Error(`Failed to reset progress summary: ${progressError.message}`);
      }

    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }

  /**
   * Get overall statistics across all difficulties
   */
  async getOverallStatistics(userId: string): Promise<{
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    totalPracticeTime: number;
    currentStreak: number;
    achievements: string[];
  }> {
    try {
      const progressSummaries = await this.getUserProgress(userId);
      
      let totalAnswered = 0;
      let totalCorrect = 0;
      let totalTime = 0;
      let maxStreak = 0;

      for (const summary of progressSummaries) {
        totalAnswered += summary.progress.questionsSeen;
        totalCorrect += summary.progress.questionsCorrect;
        totalTime += summary.progress.totalPracticeTime;
        maxStreak = Math.max(maxStreak, summary.progress.currentStreakDays);
      }

      const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
      const achievements = await this.calculateAchievements(userId, progressSummaries);

      return {
        totalQuestionsAnswered: totalAnswered,
        overallAccuracy: Math.round(overallAccuracy * 100) / 100,
        totalPracticeTime: totalTime,
        currentStreak: maxStreak,
        achievements
      };

    } catch (error) {
      console.error('Error fetching overall statistics:', error);
      throw error;
    }
  }

  /**
   * Update streak information for a user
   */
  private async updateStreakInformation(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<void> {
    try {
      // Get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single();

      if (!currentProgress) return;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreakDays = currentProgress.current_streak_days;
      
      // If last practice was yesterday, increment streak
      if (currentProgress.last_practice_date === yesterdayStr) {
        newStreakDays += 1;
      }
      // If last practice was not yesterday and not today, reset streak
      else if (currentProgress.last_practice_date !== today) {
        newStreakDays = 1;
      }
      
      const longestStreak = Math.max(currentProgress.longest_streak_days, newStreakDays);

      // Update streak information
      await supabase
        .from('user_progress_summary')
        .update({
          current_streak_days: newStreakDays,
          longest_streak_days: longestStreak,
          last_practice_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('difficulty', difficulty);

    } catch (error) {
      console.error('Error updating streak information:', error);
    }
  }

  /**
   * Get recent activity for recommendations
   */
  private async getRecentActivity(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<{
    questionsThisWeek: number;
    averageAccuracyThisWeek: number;
    practiceTimeThisWeek: number;
    streakDays: number;
  }> {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('user_question_history')
        .select('is_correct, time_spent_seconds')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .gte('last_seen_at', oneWeekAgo.toISOString());

      if (error || !data) {
        return {
          questionsThisWeek: 0,
          averageAccuracyThisWeek: 0,
          practiceTimeThisWeek: 0,
          streakDays: 0
        };
      }

      const questionsThisWeek = data.length;
      const correctThisWeek = data.filter(d => d.is_correct).length;
      const practiceTimeThisWeek = data.reduce((sum, d) => sum + d.time_spent_seconds, 0);
      const averageAccuracyThisWeek = questionsThisWeek > 0 ? 
        (correctThisWeek / questionsThisWeek) * 100 : 0;

      // Get streak from progress summary
      const { data: progressData } = await supabase
        .from('user_progress_summary')
        .select('current_streak_days')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single();

      return {
        questionsThisWeek,
        averageAccuracyThisWeek: Math.round(averageAccuracyThisWeek * 100) / 100,
        practiceTimeThisWeek,
        streakDays: progressData?.current_streak_days || 0
      };

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return {
        questionsThisWeek: 0,
        averageAccuracyThisWeek: 0,
        practiceTimeThisWeek: 0,
        streakDays: 0
      };
    }
  }

  /**
   * Generate personalized recommendations
   */
  private async generateRecommendations(
    progress: UserProgress,
    recentActivity: any
  ): Promise<{
    suggestedSessionType: SessionType;
    focusAreas: string[];
    nextMilestone: string;
  }> {
    const recommendations = {
      suggestedSessionType: 'quick' as SessionType,
      focusAreas: [] as string[],
      nextMilestone: ''
    };

    // Determine suggested session type
    if (progress.questionsSeen === 0) {
      recommendations.suggestedSessionType = 'quick';
    } else if (progress.averageAccuracy < 60) {
      recommendations.suggestedSessionType = 'review_mistakes';
    } else if (recentActivity.questionsThisWeek < 5) {
      recommendations.suggestedSessionType = 'practice';
    } else {
      recommendations.suggestedSessionType = 'full';
    }

    // Determine focus areas
    if (progress.averageAccuracy < 70) {
      recommendations.focusAreas.push('Accuracy improvement');
    }
    
    if (progress.averageTimePerQuestion > 90) {
      recommendations.focusAreas.push('Speed improvement');
    }
    
    if (recentActivity.streakDays === 0) {
      recommendations.focusAreas.push('Consistency building');
    }

    const unseenPercentage = ((progress.totalQuestionsAvailable - progress.questionsSeen) / progress.totalQuestionsAvailable) * 100;
    if (unseenPercentage > 50) {
      recommendations.focusAreas.push('New content exploration');
    }

    // Determine next milestone
    const milestones = ALGORITHM_CONFIG.PROGRESS_MILESTONES;
    const nextMilestone = milestones.find(m => m > progress.questionsSeen);
    
    if (nextMilestone) {
      recommendations.nextMilestone = `Answer ${nextMilestone} questions in ${progress.difficulty} difficulty`;
    } else {
      recommendations.nextMilestone = `Master all ${progress.totalQuestionsAvailable} questions`;
    }

    return recommendations;
  }

  /**
   * Calculate user achievements
   */
  private async calculateAchievements(
    userId: string,
    progressSummaries: ProgressSummary[]
  ): Promise<string[]> {
    const achievements: string[] = [];

    for (const summary of progressSummaries) {
      const progress = summary.progress;

      // Question count achievements
      if (progress.questionsSeen >= 1) achievements.push(ACHIEVEMENTS.FIRST_QUESTION.id);
      if (progress.questionsSeen >= 25) achievements.push(ACHIEVEMENTS.QUESTIONS_25.id);
      if (progress.questionsSeen >= 100) achievements.push(ACHIEVEMENTS.QUESTIONS_100.id);
      if (progress.questionsSeen >= 300) achievements.push(ACHIEVEMENTS.QUESTIONS_300.id);

      // Streak achievements
      if (progress.currentStreakDays >= 7) achievements.push(ACHIEVEMENTS.STREAK_7.id);
      if (progress.currentStreakDays >= 30) achievements.push(ACHIEVEMENTS.STREAK_30.id);

      // Accuracy achievements
      if (progress.averageAccuracy >= 90) achievements.push(ACHIEVEMENTS.ACCURACY_90.id);
    }

    // Check for perfect sessions
    const { data: perfectSessions } = await supabase
      .from('simulation_sessions')
      .select('score_percentage')
      .eq('user_id', userId)
      .eq('score_percentage', 100)
      .limit(1);

    if (perfectSessions && perfectSessions.length > 0) {
      achievements.push(ACHIEVEMENTS.PERFECT_SESSION.id);
    }

    return [...new Set(achievements)]; // Remove duplicates
  }

  /**
   * Helper: Convert database progress to UserProgress type
   */
  private convertDbProgressToUserProgress(dbProgress: DatabaseProgressSummary): UserProgress {
    return {
      userId: dbProgress.user_id,
      difficulty: dbProgress.difficulty as DifficultyLevel,
      totalQuestionsAvailable: dbProgress.total_questions_available,
      questionsSeen: dbProgress.questions_seen,
      questionsCorrect: dbProgress.questions_correct,
      questionsIncorrect: dbProgress.questions_incorrect,
      questionsFlagged: dbProgress.questions_flagged,
      averageAccuracy: dbProgress.average_accuracy,
      averageTimePerQuestion: dbProgress.average_time_per_question,
      totalPracticeTime: dbProgress.total_practice_time,
      currentStreakDays: dbProgress.current_streak_days,
      longestStreakDays: dbProgress.longest_streak_days,
      lastPracticeDate: dbProgress.last_practice_date ? new Date(dbProgress.last_practice_date) : null,
      firstQuestionDate: dbProgress.first_question_date ? new Date(dbProgress.first_question_date) : null,
      lastResetDate: dbProgress.last_reset_date ? new Date(dbProgress.last_reset_date) : null,
      updatedAt: new Date(dbProgress.updated_at)
    };
  }

  /**
   * Helper: Convert database history to QuestionInteraction type
   */
  private convertDbHistoryToInteraction(dbHistory: any): QuestionInteraction {
    return {
      id: dbHistory.id,
      userId: dbHistory.user_id,
      questionId: dbHistory.question_id,
      answerSelected: dbHistory.answer_selected,
      isCorrect: dbHistory.is_correct,
      timeSpentSeconds: dbHistory.time_spent_seconds,
      simulationSessionId: dbHistory.simulation_session_id,
      simulationType: dbHistory.simulation_type as SessionType,
      difficulty: dbHistory.difficulty as DifficultyLevel,
      flagged: dbHistory.flagged,
      notes: dbHistory.notes,
      lastSeenAt: new Date(dbHistory.last_seen_at),
      createdAt: new Date(dbHistory.created_at)
    };
  }

  /**
   * Helper: Create empty progress summary for new users
   */
  private async createEmptyProgressSummary(
    userId: string,
    difficulty: DifficultyLevel
  ): Promise<ProgressSummary> {
    const totalQuestions = await this.getTotalQuestionsForDifficulty(difficulty);
    
    const progress: UserProgress = {
      userId,
      difficulty,
      totalQuestionsAvailable: totalQuestions,
      questionsSeen: 0,
      questionsCorrect: 0,
      questionsIncorrect: 0,
      questionsFlagged: 0,
      averageAccuracy: 0,
      averageTimePerQuestion: 0,
      totalPracticeTime: 0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      lastPracticeDate: null,
      firstQuestionDate: null,
      lastResetDate: null,
      updatedAt: new Date()
    };

    return {
      difficulty,
      progress,
      recentActivity: {
        questionsThisWeek: 0,
        averageAccuracyThisWeek: 0,
        practiceTimeThisWeek: 0,
        streakDays: 0
      },
      recommendations: {
        suggestedSessionType: 'quick',
        focusAreas: ['Start with easy questions'],
        nextMilestone: 'Answer your first question!'
      }
    };
  }

  /**
   * Helper: Get total questions available for a difficulty
   */
  private async getTotalQuestionsForDifficulty(difficulty: DifficultyLevel): Promise<number> {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', difficulty);

    if (error) {
      console.error('Error counting questions:', error);
      return 0;
    }

    return count || 0;
  }
}