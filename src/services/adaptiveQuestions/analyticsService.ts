/**
 * Analytics Service
 * 
 * Provides detailed analytics and insights for user performance,
 * system optimization, and premium user features.
 */

import { supabase } from '../supabaseClient';
import { DifficultyLevel, SessionType } from './types';

export class AnalyticsService {

  /**
   * Get comprehensive dashboard analytics for a user
   */
  async getDashboardAnalytics(userId: string): Promise<{
    overview: {
      totalQuestionsAnswered: number;
      overallAccuracy: number;
      totalPracticeTime: number;
      currentStreak: number;
      longestStreak: number;
    };
    progressByDifficulty: Array<{
      difficulty: DifficultyLevel;
      questionsAnswered: number;
      totalAvailable: number;
      accuracy: number;
      timeSpent: number;
      lastPracticed: Date | null;
    }>;
    recentActivity: Array<{
      date: string;
      questionsAnswered: number;
      accuracy: number;
      timeSpent: number;
    }>;
    performanceTrends: {
      accuracyTrend: Array<{ date: string; accuracy: number }>;
      speedTrend: Array<{ date: string; avgTimePerQuestion: number }>;
      volumeTrend: Array<{ date: string; questionsAnswered: number }>;
    };
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      earnedAt: Date;
      icon: string;
    }>;
  }> {
    try {
      const [overview, progressByDifficulty, recentActivity, performanceTrends, achievements] = 
        await Promise.all([
          this.getOverviewStats(userId),
          this.getProgressByDifficulty(userId),
          this.getRecentActivity(userId),
          this.getPerformanceTrends(userId),
          this.getUserAchievements(userId)
        ]);

      return {
        overview,
        progressByDifficulty,
        recentActivity,
        performanceTrends,
        achievements
      };

    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance comparison analytics
   */
  async getPerformanceComparison(
    userId: string,
    compareWith: 'average' | 'top10' | 'friends' = 'average'
  ): Promise<{
    userStats: {
      accuracy: number;
      speed: number;
      consistency: number;
      coverage: number;
    };
    comparisonStats: {
      accuracy: number;
      speed: number;
      consistency: number;
      coverage: number;
    };
    rank: {
      overall: number;
      accuracy: number;
      speed: number;
      totalUsers: number;
    };
  }> {
    try {
      const userStats = await this.getUserComparisonStats(userId);
      const comparisonStats = await this.getComparisonGroupStats(compareWith);
      const rank = await this.getUserRanking(userId);

      return {
        userStats,
        comparisonStats,
        rank
      };

    } catch (error) {
      console.error('Error getting performance comparison:', error);
      throw error;
    }
  }

  /**
   * Get detailed topic/question type analytics
   */
  async getTopicAnalytics(userId: string): Promise<{
    byQuestionType: Array<{
      type: string;
      questionsAnswered: number;
      accuracy: number;
      averageTime: number;
      improvement: number; // percentage change from last period
    }>;
    weakestAreas: Array<{
      area: string;
      accuracy: number;
      questionsAnswered: number;
      recommendedAction: string;
    }>;
    strongestAreas: Array<{
      area: string;
      accuracy: number;
      questionsAnswered: number;
    }>;
    masteryProgress: Array<{
      topic: string;
      masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      questionsRemaining: number;
      estimatedTimeToMaster: number; // hours
    }>;
  }> {
    try {
      const [byQuestionType, weakestAreas, strongestAreas, masteryProgress] = await Promise.all([
        this.getQuestionTypeStats(userId),
        this.getWeakestAreas(userId),
        this.getStrongestAreas(userId),
        this.getMasteryProgress(userId)
      ]);

      return {
        byQuestionType,
        weakestAreas,
        strongestAreas,
        masteryProgress
      };

    } catch (error) {
      console.error('Error getting topic analytics:', error);
      throw error;
    }
  }

  /**
   * Get learning velocity and prediction analytics
   */
  async getLearningAnalytics(userId: string): Promise<{
    learningVelocity: {
      questionsPerDay: number;
      accuracyImprovement: number; // per week
      speedImprovement: number; // per week
      consistencyScore: number; // 0-100
    };
    predictions: {
      estimatedTimeToComplete: {
        easy: number; // days
        medium: number;
        hard: number;
      };
      projectedAccuracy: {
        oneWeek: number;
        oneMonth: number;
        threeMonths: number;
      };
      readinessScore: number; // 0-100, readiness for exam
    };
    recommendations: Array<{
      type: 'session_length' | 'difficulty' | 'focus_area' | 'schedule';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      estimatedImpact: string;
    }>;
  }> {
    try {
      const [learningVelocity, predictions, recommendations] = await Promise.all([
        this.getLearningVelocity(userId),
        this.getPredictions(userId),
        this.getPersonalizedRecommendations(userId)
      ]);

      return {
        learningVelocity,
        predictions,
        recommendations
      };

    } catch (error) {
      console.error('Error getting learning analytics:', error);
      throw error;
    }
  }

  /**
   * Get system-wide analytics (for admins)
   */
  async getSystemAnalytics(): Promise<{
    userEngagement: {
      activeUsers: number;
      newUsers: number;
      retentionRate: number;
      averageSessionLength: number;
    };
    questionMetrics: {
      totalQuestionsAnswered: number;
      averageAccuracy: number;
      mostDifficultQuestions: Array<{ id: number; accuracy: number }>;
      leastDifficultQuestions: Array<{ id: number; accuracy: number }>;
    };
    performanceMetrics: {
      algorithmEfficiency: number;
      averageLoadTime: number;
      errorRate: number;
    };
  }> {
    try {
      const [userEngagement, questionMetrics, performanceMetrics] = await Promise.all([
        this.getUserEngagementMetrics(),
        this.getQuestionMetrics(),
        this.getPerformanceMetrics()
      ]);

      return {
        userEngagement,
        questionMetrics,
        performanceMetrics
      };

    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw error;
    }
  }

  /**
   * Get user analytics for dashboard display
   */
  async getUserAnalytics(userId: string): Promise<{
    overall: {
      accuracy: number;
      totalQuestions: number;
      currentStreak: number;
      averageTime: number;
    };
    byDifficulty?: {
      [key: string]: {
        accuracy: number;
      };
    };
  }> {
    try {
      const [overview, difficultyStats] = await Promise.all([
        this.getOverviewStats(userId),
        this.getProgressByDifficulty(userId)
      ]);

      // Build byDifficulty object
      const byDifficulty: { [key: string]: { accuracy: number } } = {};
      difficultyStats.forEach(stat => {
        byDifficulty[stat.difficulty] = {
          accuracy: stat.accuracy
        };
      });

      return {
        overall: {
          accuracy: overview.overallAccuracy,
          totalQuestions: overview.totalQuestionsAnswered,
          currentStreak: overview.currentStreak,
          averageTime: overview.totalPracticeTime > 0 ? 
            overview.totalPracticeTime / overview.totalQuestionsAnswered : 0
        },
        byDifficulty: Object.keys(byDifficulty).length > 0 ? byDifficulty : undefined
      };

    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Private helper methods

  private async getOverviewStats(userId: string) {
    const { data } = await supabase
      .from('user_progress_summary')
      .select('*')
      .eq('user_id', userId);

    if (!data || data.length === 0) {
      return {
        totalQuestionsAnswered: 0,
        overallAccuracy: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }

    const totals = data.reduce((acc, item) => ({
      questionsAnswered: acc.questionsAnswered + item.questions_seen,
      questionsCorrect: acc.questionsCorrect + item.questions_correct,
      practiceTime: acc.practiceTime + item.total_practice_time,
      currentStreak: Math.max(acc.currentStreak, item.current_streak_days),
      longestStreak: Math.max(acc.longestStreak, item.longest_streak_days)
    }), {
      questionsAnswered: 0,
      questionsCorrect: 0,
      practiceTime: 0,
      currentStreak: 0,
      longestStreak: 0
    });

    return {
      totalQuestionsAnswered: totals.questionsAnswered,
      overallAccuracy: totals.questionsAnswered > 0 ? 
        (totals.questionsCorrect / totals.questionsAnswered) * 100 : 0,
      totalPracticeTime: totals.practiceTime,
      currentStreak: totals.currentStreak,
      longestStreak: totals.longestStreak
    };
  }

  private async getProgressByDifficulty(userId: string) {
    const { data } = await supabase
      .from('user_progress_summary')
      .select('*')
      .eq('user_id', userId);

    if (!data) return [];

    return data.map(item => ({
      difficulty: item.difficulty as DifficultyLevel,
      questionsAnswered: item.questions_seen,
      totalAvailable: item.total_questions_available,
      accuracy: item.average_accuracy,
      timeSpent: item.total_practice_time,
      lastPracticed: item.last_practice_date ? new Date(item.last_practice_date) : null
    }));
  }

  private async getRecentActivity(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
      .from('user_question_history')
      .select('last_seen_at, is_correct, time_spent_seconds')
      .eq('user_id', userId)
      .gte('last_seen_at', thirtyDaysAgo.toISOString());

    if (!data) return [];

    // Group by date
    const dailyStats = new Map();
    
    data.forEach(item => {
      const date = item.last_seen_at.split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, {
          questionsAnswered: 0,
          correct: 0,
          timeSpent: 0
        });
      }
      
      const stats = dailyStats.get(date);
      stats.questionsAnswered++;
      if (item.is_correct) stats.correct++;
      stats.timeSpent += item.time_spent_seconds;
    });

    return Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      questionsAnswered: stats.questionsAnswered,
      accuracy: stats.questionsAnswered > 0 ? (stats.correct / stats.questionsAnswered) * 100 : 0,
      timeSpent: stats.timeSpent
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getPerformanceTrends(userId: string) {
    // This would implement more sophisticated trend analysis
    // For now, returning placeholder structure
    return {
      accuracyTrend: [],
      speedTrend: [],
      volumeTrend: []
    };
  }

  private async getUserAchievements(userId: string) {
    // This would query a user achievements table
    // For now, returning placeholder
    return [];
  }

  private async getUserComparisonStats(userId: string) {
    // Implementation for user comparison stats
    return {
      accuracy: 0,
      speed: 0,
      consistency: 0,
      coverage: 0
    };
  }

  private async getComparisonGroupStats(compareWith: string) {
    // Implementation for comparison group stats
    return {
      accuracy: 0,
      speed: 0,
      consistency: 0,
      coverage: 0
    };
  }

  private async getUserRanking(userId: string) {
    // Implementation for user ranking
    return {
      overall: 0,
      accuracy: 0,
      speed: 0,
      totalUsers: 0
    };
  }

  private async getQuestionTypeStats(userId: string) {
    const { data } = await supabase
      .from('user_question_history')
      .select(`
        questions!inner(type),
        is_correct,
        time_spent_seconds
      `)
      .eq('user_id', userId);

    if (!data) return [];

    const typeStats = new Map();
    
    data.forEach(item => {
      const type = item.questions.type;
      if (!typeStats.has(type)) {
        typeStats.set(type, {
          total: 0,
          correct: 0,
          totalTime: 0
        });
      }
      
      const stats = typeStats.get(type);
      stats.total++;
      if (item.is_correct) stats.correct++;
      stats.totalTime += item.time_spent_seconds;
    });

    return Array.from(typeStats.entries()).map(([type, stats]) => ({
      type,
      questionsAnswered: stats.total,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      averageTime: stats.total > 0 ? stats.totalTime / stats.total : 0,
      improvement: 0 // Would calculate from historical data
    }));
  }

  private async getWeakestAreas(userId: string) {
    const typeStats = await this.getQuestionTypeStats(userId);
    return typeStats
      .filter(stat => stat.accuracy < 70 && stat.questionsAnswered >= 5)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map(stat => ({
        area: stat.type,
        accuracy: stat.accuracy,
        questionsAnswered: stat.questionsAnswered,
        recommendedAction: this.getRecommendedAction(stat.accuracy)
      }));
  }

  private async getStrongestAreas(userId: string) {
    const typeStats = await this.getQuestionTypeStats(userId);
    return typeStats
      .filter(stat => stat.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3)
      .map(stat => ({
        area: stat.type,
        accuracy: stat.accuracy,
        questionsAnswered: stat.questionsAnswered
      }));
  }

  private async getMasteryProgress(userId: string) {
    // Implementation for mastery progress calculation
    return [];
  }

  private async getLearningVelocity(userId: string) {
    // Implementation for learning velocity calculation
    return {
      questionsPerDay: 0,
      accuracyImprovement: 0,
      speedImprovement: 0,
      consistencyScore: 0
    };
  }

  private async getPredictions(userId: string) {
    // Implementation for ML-based predictions
    return {
      estimatedTimeToComplete: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      projectedAccuracy: {
        oneWeek: 0,
        oneMonth: 0,
        threeMonths: 0
      },
      readinessScore: 0
    };
  }

  private async getPersonalizedRecommendations(userId: string) {
    // Implementation for personalized recommendations
    return [];
  }

  private async getUserEngagementMetrics() {
    // Implementation for user engagement metrics
    return {
      activeUsers: 0,
      newUsers: 0,
      retentionRate: 0,
      averageSessionLength: 0
    };
  }

  private async getQuestionMetrics() {
    // Implementation for question metrics
    return {
      totalQuestionsAnswered: 0,
      averageAccuracy: 0,
      mostDifficultQuestions: [],
      leastDifficultQuestions: []
    };
  }

  private async getPerformanceMetrics() {
    // Implementation for performance metrics
    return {
      algorithmEfficiency: 0,
      averageLoadTime: 0,
      errorRate: 0
    };
  }

  private getRecommendedAction(accuracy: number): string {
    if (accuracy < 50) return 'Focus on fundamentals and review explanations';
    if (accuracy < 70) return 'Practice more questions in this area';
    return 'Continue practicing to maintain proficiency';
  }
}