/**
 * User Preferences Service
 * 
 * Manages user customization settings for the adaptive question delivery system.
 * Handles preferences for delivery behavior, UI settings, and notifications.
 */

import { supabase } from '../supabaseClient';
import { UserPreferences } from './types';
import { DEFAULT_USER_PREFERENCES, ERROR_MESSAGES } from './constants';

export class UserPreferencesService {

  /**
   * Get user preferences with fallback to defaults
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found, create with defaults
          return await this.createDefaultPreferences(userId);
        }
        throw new Error(`Failed to fetch preferences: ${error.message}`);
      }

      return this.convertDbPreferencesToUserPreferences(data);

    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Return defaults if there's an error
      return {
        userId,
        ...DEFAULT_USER_PREFERENCES
      };
    }
  }

  /**
   * Update user preferences (alias for updateUserPreferences)
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    return this.updateUserPreferences(userId, preferences);
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      // Get current preferences first
      const currentPreferences = await this.getUserPreferences(userId);

      // Merge with new preferences
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences,
        userId // Ensure userId is not overridden
      };

      // Convert to database format
      const dbPreferences = this.convertUserPreferencesToDb(updatedPreferences);

      // Upsert preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          ...dbPreferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update preferences: ${error.message}`);
      }

      return this.convertDbPreferencesToUserPreferences(data);

    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Reset user preferences to defaults
   */
  async resetUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const defaultPreferences = {
        userId,
        ...DEFAULT_USER_PREFERENCES
      };

      return await this.updateUserPreferences(userId, defaultPreferences);

    } catch (error) {
      console.error('Error resetting user preferences:', error);
      throw error;
    }
  }

  /**
   * Get specific preference category
   */
  async getDeliveryPreferences(userId: string): Promise<{
    enableSmartDelivery: boolean;
    preferredSessionLength: number;
    autoAdvanceTime: number;
    showExplanationsImmediately: boolean;
    adaptiveDifficulty: boolean;
    preferredDifficulties: string[];
  }> {
    const preferences = await this.getUserPreferences(userId);
    
    return {
      enableSmartDelivery: preferences.enableSmartDelivery,
      preferredSessionLength: preferences.preferredSessionLength,
      autoAdvanceTime: preferences.autoAdvanceTime,
      showExplanationsImmediately: preferences.showExplanationsImmediately,
      adaptiveDifficulty: preferences.adaptiveDifficulty,
      preferredDifficulties: preferences.preferredDifficulties
    };
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(userId: string): Promise<{
    dailyReminderEnabled: boolean;
    dailyReminderTime: string;
    weeklyProgressEmail: boolean;
    achievementNotifications: boolean;
  }> {
    const preferences = await this.getUserPreferences(userId);
    
    return {
      dailyReminderEnabled: preferences.dailyReminderEnabled,
      dailyReminderTime: preferences.dailyReminderTime,
      weeklyProgressEmail: preferences.weeklyProgressEmail,
      achievementNotifications: preferences.achievementNotifications
    };
  }

  /**
   * Get UI preferences
   */
  async getUIPreferences(userId: string): Promise<{
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    reduceAnimations: boolean;
  }> {
    const preferences = await this.getUserPreferences(userId);
    
    return {
      theme: preferences.theme,
      fontSize: preferences.fontSize,
      reduceAnimations: preferences.reduceAnimations
    };
  }

  /**
   * Update delivery preferences only
   */
  async updateDeliveryPreferences(
    userId: string,
    deliveryPrefs: {
      enableSmartDelivery?: boolean;
      preferredSessionLength?: number;
      autoAdvanceTime?: number;
      showExplanationsImmediately?: boolean;
      adaptiveDifficulty?: boolean;
      preferredDifficulties?: string[];
    }
  ): Promise<void> {
    await this.updateUserPreferences(userId, deliveryPrefs);
  }

  /**
   * Update notification preferences only
   */
  async updateNotificationPreferences(
    userId: string,
    notificationPrefs: {
      dailyReminderEnabled?: boolean;
      dailyReminderTime?: string;
      weeklyProgressEmail?: boolean;
      achievementNotifications?: boolean;
    }
  ): Promise<void> {
    await this.updateUserPreferences(userId, notificationPrefs);
  }

  /**
   * Update UI preferences only
   */
  async updateUIPreferences(
    userId: string,
    uiPrefs: {
      theme?: 'light' | 'dark' | 'system';
      fontSize?: 'small' | 'medium' | 'large';
      reduceAnimations?: boolean;
    }
  ): Promise<void> {
    await this.updateUserPreferences(userId, uiPrefs);
  }

  /**
   * Get analytics preferences
   */
  async getAnalyticsPreferences(userId: string): Promise<{
    allowAnalytics: boolean;
    shareAnonymousData: boolean;
  }> {
    const preferences = await this.getUserPreferences(userId);
    
    return {
      allowAnalytics: preferences.allowAnalytics,
      shareAnonymousData: preferences.shareAnonymousData
    };
  }

  /**
   * Update analytics preferences
   */
  async updateAnalyticsPreferences(
    userId: string,
    analyticsPrefs: {
      allowAnalytics?: boolean;
      shareAnonymousData?: boolean;
    }
  ): Promise<void> {
    await this.updateUserPreferences(userId, analyticsPrefs);
  }

  /**
   * Check if user has premium features enabled
   */
  async isPremiumUser(userId: string): Promise<boolean> {
    try {
      // Check user's premium status from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiration')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking premium status:', error);
        return false;
      }

      if (!data?.is_premium) {
        return false;
      }

      // Check if premium hasn't expired
      if (data.premium_expiration) {
        const expirationDate = new Date(data.premium_expiration);
        return expirationDate > new Date();
      }

      return true;

    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Get preferences optimized for the user's usage patterns
   */
  async getOptimizedPreferences(userId: string): Promise<{
    recommendedSessionLength: number;
    suggestedDifficulty: string;
    optimalPracticeTime: string;
  }> {
    try {
      // Get user's progress and activity data
      const { data: recentSessions } = await supabase
        .from('simulation_sessions')
        .select('questions_attempted, total_time_seconds, score_percentage')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10);

      const { data: progressData } = await supabase
        .from('user_progress_summary')
        .select('difficulty, average_accuracy')
        .eq('user_id', userId);

      // Calculate recommendations based on user data
      let recommendedSessionLength = DEFAULT_USER_PREFERENCES.preferredSessionLength;
      let suggestedDifficulty = 'medium';
      let optimalPracticeTime = '19:00';

      if (recentSessions && recentSessions.length > 0) {
        // Average session length preference
        const avgSessionLength = recentSessions.reduce(
          (sum, session) => sum + session.questions_attempted, 0
        ) / recentSessions.length;
        
        recommendedSessionLength = Math.round(avgSessionLength);

        // Suggest time based on completion patterns
        // This would need more sophisticated analysis in a real implementation
        optimalPracticeTime = '19:00'; // Default evening time
      }

      if (progressData && progressData.length > 0) {
        // Find difficulty with best accuracy that's still challenging
        const sortedByAccuracy = progressData.sort((a, b) => b.average_accuracy - a.average_accuracy);
        const bestDifficulty = sortedByAccuracy.find(p => p.average_accuracy >= 70 && p.average_accuracy <= 85);
        
        if (bestDifficulty) {
          suggestedDifficulty = bestDifficulty.difficulty;
        }
      }

      return {
        recommendedSessionLength,
        suggestedDifficulty,
        optimalPracticeTime
      };

    } catch (error) {
      console.error('Error getting optimized preferences:', error);
      return {
        recommendedSessionLength: DEFAULT_USER_PREFERENCES.preferredSessionLength,
        suggestedDifficulty: 'medium',
        optimalPracticeTime: '19:00'
      };
    }
  }

  /**
   * Create default preferences for new user
   */
  private async createDefaultPreferences(userId: string): Promise<UserPreferences> {
    const defaultPreferences = {
      userId,
      ...DEFAULT_USER_PREFERENCES
    };

    try {
      const dbPreferences = this.convertUserPreferencesToDb(defaultPreferences);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          ...dbPreferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default preferences:', error);
        // Return defaults without saving if there's an error
        return defaultPreferences;
      }

      return this.convertDbPreferencesToUserPreferences(data);

    } catch (error) {
      console.error('Error creating default preferences:', error);
      return defaultPreferences;
    }
  }

  /**
   * Convert database record to UserPreferences type
   */
  private convertDbPreferencesToUserPreferences(dbPrefs: any): UserPreferences {
    return {
      userId: dbPrefs.user_id,
      
      // Core simulation preferences
      preferredDifficulty: dbPrefs.preferred_difficulty || 'medium',
      questionsPerSession: dbPrefs.questions_per_session || 10,
      deliveryStrategy: dbPrefs.delivery_strategy || 'unseen_priority',
      preferredQuestionGroup: dbPrefs.preferred_question_group || 'mixed',
      
      // UI preferences
      showExplanations: dbPrefs.show_explanations !== false,
      enableSound: dbPrefs.enable_sound || false,
      theme: dbPrefs.theme || 'system',
      fontSize: dbPrefs.font_size || 'medium',
      
      // Notifications
      dailyReminderEnabled: dbPrefs.daily_reminder_enabled || false,
      achievementNotifications: dbPrefs.achievement_notifications !== false,
      
      // Analytics
      allowAnalytics: dbPrefs.allow_analytics !== false
    };
  }

  /**
   * Convert UserPreferences to database format
   */
  private convertUserPreferencesToDb(prefs: UserPreferences): any {
    return {
      user_id: prefs.userId,
      
      // Core simulation preferences
      preferred_difficulty: prefs.preferredDifficulty,
      questions_per_session: prefs.questionsPerSession,
      delivery_strategy: prefs.deliveryStrategy,
      preferred_question_group: prefs.preferredQuestionGroup,
      
      // UI preferences
      show_explanations: prefs.showExplanations,
      enable_sound: prefs.enableSound,
      theme: prefs.theme,
      font_size: prefs.fontSize,
      
      // Notifications
      daily_reminder_enabled: prefs.dailyReminderEnabled,
      achievement_notifications: prefs.achievementNotifications,
      
      // Analytics
      allow_analytics: prefs.allowAnalytics
    };
  }
}