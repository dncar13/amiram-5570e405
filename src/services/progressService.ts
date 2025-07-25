/**
 * Progress Service - Handles all user progress tracking with Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/data/types/questionTypes';

export interface UserProgressData {
  user_id: string;
  question_id: string;
  answered_correctly: boolean;
  answered_at?: string;
  time_spent?: number; // in seconds
}

export interface UserProgressStats {
  total_questions_answered: number;
  total_correct_answers: number;
  accuracy_percentage: number;
  total_time_spent: number;
  questions_by_type: Record<string, { correct: number; total: number; accuracy: number }>;
  questions_by_difficulty: Record<string, { correct: number; total: number; accuracy: number }>;
  recent_activity: UserProgressData[];
}

export interface SimulationSession {
  user_id: string;
  session_type: 'practice' | 'simulation' | 'exam' | 'story';
  topic_id?: number;
  difficulty?: string;
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  completed_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Progress Service Class
 */
export class ProgressService {
  
  /**
   * Save user progress for a single question
   */
  static async saveUserProgress(data: UserProgressData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Saving user progress:', data);
      
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: data.user_id,
          question_id: data.question_id,
          answered_correctly: data.answered_correctly,
          answered_at: data.answered_at || new Date().toISOString(),
          time_spent: data.time_spent || 0
        });
      
      if (error) {
        console.error('❌ Error saving user progress:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ User progress saved successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Exception in saveUserProgress:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get user progress for a specific question
   */
  static async getUserProgressForQuestion(
    userId: string, 
    questionId: string
  ): Promise<UserProgressData[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .order('answered_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching user progress for question:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserProgressForQuestion:', error);
      return [];
    }
  }

  /**
   * Get comprehensive user progress statistics
   */
  static async getUserProgressStats(userId: string): Promise<UserProgressStats | null> {
    try {
      console.log('📊 Fetching user progress stats for:', userId);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          questions:question_id (
            id,
            type,
            difficulty,
            question_text
          )
        `)
        .eq('user_id', userId)
        .order('answered_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching user progress stats:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        return {
          total_questions_answered: 0,
          total_correct_answers: 0,
          accuracy_percentage: 0,
          total_time_spent: 0,
          questions_by_type: {},
          questions_by_difficulty: {},
          recent_activity: []
        };
      }
      
      // Calculate statistics
      const totalQuestions = data.length;
      const totalCorrect = data.filter(p => p.answered_correctly).length;
      const totalTime = data.reduce((sum, p) => sum + (p.time_spent || 0), 0);
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      
      // Group by type
      const typeStats: Record<string, { correct: number; total: number; accuracy: number }> = {};
      const difficultyStats: Record<string, { correct: number; total: number; accuracy: number }> = {};
      
      data.forEach(progress => {
        const question = progress.questions as any;
        if (question) {
          // Type statistics
          if (!typeStats[question.type]) {
            typeStats[question.type] = { correct: 0, total: 0, accuracy: 0 };
          }
          typeStats[question.type].total++;
          if (progress.answered_correctly) {
            typeStats[question.type].correct++;
          }
          
          // Difficulty statistics
          if (!difficultyStats[question.difficulty]) {
            difficultyStats[question.difficulty] = { correct: 0, total: 0, accuracy: 0 };
          }
          difficultyStats[question.difficulty].total++;
          if (progress.answered_correctly) {
            difficultyStats[question.difficulty].correct++;
          }
        }
      });
      
      // Calculate accuracy for each group
      Object.keys(typeStats).forEach(type => {
        const stats = typeStats[type];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });
      
      Object.keys(difficultyStats).forEach(difficulty => {
        const stats = difficultyStats[difficulty];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });
      
      const stats: UserProgressStats = {
        total_questions_answered: totalQuestions,
        total_correct_answers: totalCorrect,
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        total_time_spent: totalTime,
        questions_by_type: typeStats,
        questions_by_difficulty: difficultyStats,
        recent_activity: data.slice(0, 20) // Last 20 activities
      };
      
      console.log('📈 User progress stats calculated:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Exception in getUserProgressStats:', error);
      return null;
    }
  }

  /**
   * Save a complete simulation session
   */
  static async saveSimulationSession(session: SimulationSession): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Saving simulation session:', session);
      
      const { error } = await supabase
        .from('simulation_sessions')
        .insert({
          user_id: session.user_id,
          session_type: session.session_type,
          topic_id: session.topic_id,
          difficulty: session.difficulty,
          questions_answered: session.questions_answered,
          correct_answers: session.correct_answers,
          total_questions: session.total_questions,
          time_spent: session.time_spent,
          completed_at: session.completed_at || new Date().toISOString(),
          metadata: session.metadata || {}
        });
      
      if (error) {
        console.error('❌ Error saving simulation session:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Simulation session saved successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Exception in saveSimulationSession:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get user's simulation history
   */
  static async getUserSimulationHistory(
    userId: string,
    limit: number = 50
  ): Promise<SimulationSession[]> {
    try {
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('❌ Error fetching simulation history:', error);
        return [];
      }
      
       return (data || []) as SimulationSession[];
    } catch (error) {
      console.error('❌ Exception in getUserSimulationHistory:', error);
      return [];
    }
  }

  /**
   * Migrate localStorage data to Supabase for a specific user
   */
  static async migrateLocalStorageToSupabase(userId: string): Promise<{ success: boolean; migrated: number; error?: string }> {
    try {
      console.log('🔄 Starting localStorage to Supabase migration for user:', userId);
      
      let migratedCount = 0;
      
      // Get current user's email from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, migrated: 0, error: 'User not authenticated' };
      }
      
      const userEmail = user.email;
      
      // Migrate activity history
      const activityKey = `activity_history_${userEmail}`;
      const activityData = localStorage.getItem(activityKey);
      
      if (activityData) {
        try {
          const activities = JSON.parse(activityData);
          console.log(`📦 Found ${activities.length} activity records to migrate`);
          
          for (const activity of activities) {
            if (activity.questionId && activity.status) {
              const progressData: UserProgressData = {
                user_id: userId,
                question_id: activity.questionId,
                answered_correctly: activity.status === 'correct',
                answered_at: activity.date || new Date().toISOString(),
                time_spent: activity.time || 0
              };
              
              const result = await this.saveUserProgress(progressData);
              if (result.success) {
                migratedCount++;
              } else {
                console.warn('⚠️ Failed to migrate activity:', activity, result.error);
              }
            }
          }
        } catch (parseError) {
          console.error('❌ Error parsing activity data:', parseError);
        }
      }
      
      console.log(`✅ Migration completed. Migrated ${migratedCount} records`);
      return { success: true, migrated: migratedCount };
      
    } catch (error) {
      console.error('❌ Exception in migrateLocalStorageToSupabase:', error);
      return { success: false, migrated: 0, error: (error as Error).message };
    }
  }

  /**
   * Get user's topic progress
   */
  static async getUserTopicProgress(
    userId: string,
    topicId?: number
  ): Promise<Record<string, { correct: number; total: number; accuracy: number }>> {
    try {
      let query = supabase
        .from('user_progress')
        .select(`
          *,
          questions:question_id (
            id,
            type,
            difficulty,
            topic_id
          )
        `)
        .eq('user_id', userId);
      
      if (topicId) {
        query = query.eq('questions.topic_id', topicId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching topic progress:', error);
        return {};
      }
      
      if (!data || data.length === 0) {
        return {};
      }
      
      // Group by topic
      const topicStats: Record<string, { correct: number; total: number; accuracy: number }> = {};
      
      data.forEach(progress => {
        const question = progress.questions as any;
        if (question && question.topic_id) {
          const topicKey = `topic_${question.topic_id}`;
          if (!topicStats[topicKey]) {
            topicStats[topicKey] = { correct: 0, total: 0, accuracy: 0 };
          }
          topicStats[topicKey].total++;
          if (progress.answered_correctly) {
            topicStats[topicKey].correct++;
          }
        }
      });
      
      // Calculate accuracy
      Object.keys(topicStats).forEach(topic => {
        const stats = topicStats[topic];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });
      
      return topicStats;
      
    } catch (error) {
      console.error('❌ Exception in getUserTopicProgress:', error);
      return {};
    }
  }

  /**
   * Check if user has answered a specific question
   */
  static async hasUserAnsweredQuestion(
    userId: string,
    questionId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .limit(1);
      
      if (error) {
        console.error('❌ Error checking if user answered question:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('❌ Exception in hasUserAnsweredQuestion:', error);
      return false;
    }
  }

  /**
   * Get user's daily activity
   */
  static async getUserDailyActivity(
    userId: string,
    days: number = 30
  ): Promise<Record<string, { correct: number; total: number; accuracy: number }>> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('answered_at', startDate.toISOString())
        .lte('answered_at', endDate.toISOString())
        .order('answered_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching daily activity:', error);
        return {};
      }
      
      if (!data || data.length === 0) {
        return {};
      }
      
      // Group by day
      const dailyStats: Record<string, { correct: number; total: number; accuracy: number }> = {};
      
      data.forEach(progress => {
        const day = new Date(progress.answered_at).toDateString();
        if (!dailyStats[day]) {
          dailyStats[day] = { correct: 0, total: 0, accuracy: 0 };
        }
        dailyStats[day].total++;
        if (progress.answered_correctly) {
          dailyStats[day].correct++;
        }
      });
      
      // Calculate accuracy
      Object.keys(dailyStats).forEach(day => {
        const stats = dailyStats[day];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });
      
      return dailyStats;
      
    } catch (error) {
      console.error('❌ Exception in getUserDailyActivity:', error);
      return {};
    }
  }

  /**
   * Get weekly progress data for charts
   */
  static async getWeeklyProgressData(
    userId: string,
    weeks: number = 4
  ): Promise<Array<{ week: string; correct: number; wrong: number; total: number }>> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (weeks * 7));
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('answered_at', startDate.toISOString())
        .order('answered_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching weekly progress:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Group by week
      const weeklyStats: Record<string, { correct: number; wrong: number; total: number }> = {};
      
      data.forEach(progress => {
        const date = new Date(progress.answered_at);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = `שבוע ${weekStart.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}`;
        
        if (!weeklyStats[weekKey]) {
          weeklyStats[weekKey] = { correct: 0, wrong: 0, total: 0 };
        }
        
        weeklyStats[weekKey].total++;
        if (progress.answered_correctly) {
          weeklyStats[weekKey].correct++;
        } else {
          weeklyStats[weekKey].wrong++;
        }
      });
      
      return Object.entries(weeklyStats).map(([week, stats]) => ({
        week,
        ...stats
      }));
      
    } catch (error) {
      console.error('❌ Exception in getWeeklyProgressData:', error);
      return [];
    }
  }

  /**
   * Get topic performance data for charts
   */
  static async getTopicPerformanceData(
    userId: string
  ): Promise<Array<{ topic: string; score: number; questions: number }>> {
    try {
      const topicProgress = await this.getUserTopicProgress(userId);
      
      return Object.entries(topicProgress).map(([topicKey, stats]) => ({
        topic: this.getTopicDisplayName(topicKey),
        score: Math.round(stats.accuracy),
        questions: stats.total
      }));
      
    } catch (error) {
      console.error('❌ Exception in getTopicPerformanceData:', error);
      return [];
    }
  }

  /**
   * Get difficulty breakdown data for pie charts
   */
  static async getDifficultyBreakdownData(
    userId: string
  ): Promise<Array<{ name: string; value: number; color: string }>> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          questions:question_id (
            id,
            difficulty
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Error fetching difficulty breakdown:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      const difficultyStats = { easy: 0, medium: 0, hard: 0 };
      
      data.forEach(progress => {
        const question = progress.questions as any;
        if (question && question.difficulty) {
          difficultyStats[question.difficulty as keyof typeof difficultyStats]++;
        }
      });
      
      const total = Object.values(difficultyStats).reduce((sum, count) => sum + count, 0);
      
      if (total === 0) {
        return [];
      }
      
      return [
        { name: 'קל', value: Math.round((difficultyStats.easy / total) * 100), color: '#10B981' },
        { name: 'בינוני', value: Math.round((difficultyStats.medium / total) * 100), color: '#F59E0B' },
        { name: 'קשה', value: Math.round((difficultyStats.hard / total) * 100), color: '#EF4444' },
      ].filter(item => item.value > 0);
      
    } catch (error) {
      console.error('❌ Exception in getDifficultyBreakdownData:', error);
      return [];
    }
  }

  /**
   * Helper function to get display name for topics
   */
  private static getTopicDisplayName(topicKey: string): string {
    const topicMap: Record<string, string> = {
      'topic_1': 'השלמת משפטים',
      'topic_2': 'הבנת הנקרא',
      'topic_3': 'אוצר מילים',
      'topic_4': 'ניסוח מחדש',
      'topic_5': 'דקדוק',
      'topic_6': 'כתיבה',
      'topic_7': 'הבנת הנשמע'
    };
    
    return topicMap[topicKey] || topicKey.replace('topic_', 'נושא ');
  }

  /**
   * Test function to manually trigger profile creation
   */
  static async testProfileCreation() {
    try {
      console.log('🔍 [testProfileCreation] Starting profile creation test...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ [testProfileCreation] No authenticated user found');
        return;
      }
      
      console.log('👤 [testProfileCreation] Current user:', user.email);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      console.log('📊 [testProfileCreation] Profile exists?', !!profile);
      console.log('📊 [testProfileCreation] Profile data:', profile);
      
      if (profileError) {
        console.error('❌ [testProfileCreation] Error checking profile:', profileError);
      }
      
      if (!profile) {
        console.log('🔧 [testProfileCreation] Creating profile manually...');
        
        // Manually create profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            display_name: user.email?.split('@')[0] || 'User'
          });
          
        console.log('🎯 [testProfileCreation] Manual profile creation:', insertError ? `Failed: ${insertError.message}` : 'Success');
        
        if (!insertError) {
          // Verify creation
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          console.log('✅ [testProfileCreation] New profile created:', newProfile);
        }
      }
    } catch (error) {
      console.error('❌ [testProfileCreation] Exception:', error);
    }
  }
}

export default ProgressService;