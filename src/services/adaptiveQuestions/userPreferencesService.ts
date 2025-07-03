
/**
 * User Preferences Service
 * 
 * Handles user preferences for adaptive simulations
 */

import { supabase } from '@/services/supabaseClient';
import { UserPreferences, DifficultyLevel, DeliveryStrategy } from './types';

export class UserPreferencesService {
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error);
        throw error;
      }

      if (!preferences) {
        return null;
      }

      return {
        userId: preferences.user_id,
        preferredDifficulty: preferences.preferred_difficulty as DifficultyLevel,
        questionsPerSession: preferences.questions_per_session,
        deliveryStrategy: preferences.delivery_strategy as DeliveryStrategy,
        showExplanations: preferences.show_explanations,
        enableSound: preferences.enable_sound,
        preferredQuestionGroup: 'mixed' // Default since it's not in the DB schema
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences');
    }
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      // Check if preferences exist
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .single();

      const updateData = {
        user_id: userId,
        preferred_difficulty: preferences.preferredDifficulty,
        questions_per_session: preferences.questionsPerSession,
        delivery_strategy: preferences.deliveryStrategy,
        show_explanations: preferences.showExplanations,
        enable_sound: preferences.enableSound,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update(updateData)
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating user preferences:', error);
          throw error;
        }
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert(updateData);

        if (error) {
          console.error('Error creating user preferences:', error);
          throw error;
        }
      }

      console.log('User preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }
}
