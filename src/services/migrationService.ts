/**
 * Migration Service - Handles migration from localStorage to Supabase
 */
import { ProgressService } from './progressService';
import { supabase } from '@/integrations/supabase/client';
import { ActivityRecord } from '@/hooks/useActivityHistory';

export interface MigrationResult {
  success: boolean;
  migratedRecords: number;
  errors: string[];
  skippedRecords: number;
}

export interface MigrationStats {
  totalLocalRecords: number;
  totalSupabaseRecords: number;
  duplicateRecords: number;
  newRecords: number;
}

/**
 * Migration Service Class
 */
export class MigrationService {
  
  /**
   * Migrate all localStorage data to Supabase for current user
   */
  static async migrateUserData(): Promise<MigrationResult> {
    try {
      console.log('🔄 Starting complete user data migration...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return {
          success: false,
          migratedRecords: 0,
          errors: ['User not authenticated'],
          skippedRecords: 0
        };
      }

      let totalMigrated = 0;
      let totalSkipped = 0;
      const errors: string[] = [];
      
      // 1. Migrate activity history
      const activityResult = await this.migrateActivityHistory(user.id);
      totalMigrated += activityResult.migratedRecords;
      totalSkipped += activityResult.skippedRecords;
      errors.push(...activityResult.errors);
      
      // 2. Migrate saved questions
      const savedQuestionsResult = await this.migrateSavedQuestions(user.id);
      totalMigrated += savedQuestionsResult.migratedRecords;
      totalSkipped += savedQuestionsResult.skippedRecords;
      errors.push(...savedQuestionsResult.errors);
      
      // 3. Migrate simulation progress (as session data)
      const simulationResult = await this.migrateSimulationProgress(user.id);
      totalMigrated += simulationResult.migratedRecords;
      totalSkipped += simulationResult.skippedRecords;
      errors.push(...simulationResult.errors);
      
      console.log(`✅ Migration completed: ${totalMigrated} records migrated, ${totalSkipped} skipped`);
      
      return {
        success: errors.length === 0,
        migratedRecords: totalMigrated,
        errors,
        skippedRecords: totalSkipped
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        migratedRecords: 0,
        errors: [(error as Error).message],
        skippedRecords: 0
      };
    }
  }

  /**
   * Migrate activity history data
   */
  private static async migrateActivityHistory(userId: string): Promise<MigrationResult> {
    try {
      console.log('📝 Migrating activity history...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, migratedRecords: 0, errors: ['User not authenticated'], skippedRecords: 0 };
      }
      
      const userEmail = user.email;
      const activityKey = `activity_history_${userEmail}`;
      const activityData = localStorage.getItem(activityKey);
      
      if (!activityData) {
        console.log('📝 No activity history found in localStorage');
        return { success: true, migratedRecords: 0, errors: [], skippedRecords: 0 };
      }
      
      let migratedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];
      
      try {
        const activities: ActivityRecord[] = JSON.parse(activityData);
        console.log(`📝 Found ${activities.length} activity records to migrate`);
        
        for (const activity of activities) {
          if (activity.questionId && activity.status) {
            // Check if this record already exists
            const existingProgress = await ProgressService.getUserProgressForQuestion(
              userId,
              activity.questionId
            );
            
            // Convert activity date to timestamp
            let answeredAt: string;
            try {
              answeredAt = new Date(activity.date).toISOString();
            } catch {
              answeredAt = new Date().toISOString();
            }
            
            // Check if we already have this exact record
            const isDuplicate = existingProgress.some(p => 
              Math.abs(new Date(p.answered_at).getTime() - new Date(answeredAt).getTime()) < 60000 // Within 1 minute
            );
            
            if (isDuplicate) {
              skippedCount++;
              continue;
            }
            
            const progressData = {
              user_id: userId,
              question_id: activity.questionId,
              answered_correctly: activity.status === 'correct',
              answered_at: answeredAt,
              time_spent: Number(activity.time) || 0
            };
            
            const result = await ProgressService.saveUserProgress(progressData);
            if (result.success) {
              migratedCount++;
            } else {
              errors.push(`Failed to migrate activity ${activity.questionId}: ${result.error}`);
            }
          } else {
            skippedCount++;
          }
        }
        
        console.log(`📝 Activity migration completed: ${migratedCount} migrated, ${skippedCount} skipped`);
        
      } catch (parseError) {
        console.error('❌ Error parsing activity data:', parseError);
        errors.push(`Failed to parse activity data: ${(parseError as Error).message}`);
      }
      
      return {
        success: errors.length === 0,
        migratedRecords: migratedCount,
        errors,
        skippedRecords: skippedCount
      };
      
    } catch (error) {
      console.error('❌ Activity history migration failed:', error);
      return {
        success: false,
        migratedRecords: 0,
        errors: [(error as Error).message],
        skippedRecords: 0
      };
    }
  }

  /**
   * Migrate saved questions data
   */
  private static async migrateSavedQuestions(userId: string): Promise<MigrationResult> {
    try {
      console.log('🔖 Migrating saved questions...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, migratedRecords: 0, errors: ['User not authenticated'], skippedRecords: 0 };
      }
      
      const userEmail = user.email;
      const savedQuestionsKey = `saved_questions_${userEmail}`;
      const savedQuestionsData = localStorage.getItem(savedQuestionsKey);
      
      if (!savedQuestionsData) {
        console.log('🔖 No saved questions found in localStorage');
        return { success: true, migratedRecords: 0, errors: [], skippedRecords: 0 };
      }
      
      let migratedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];
      
      try {
        const savedQuestions: string[] = JSON.parse(savedQuestionsData);
        console.log(`🔖 Found ${savedQuestions.length} saved questions to migrate`);
        
        for (const questionId of savedQuestions) {
          if (questionId) {
            // Check if this question is already saved
            const { data: existing, error } = await supabase
              .from('saved_questions')
              .select('id')
              .eq('user_id', userId)
              .eq('question_id', questionId)
              .limit(1);
            
            if (error) {
              errors.push(`Error checking saved question ${questionId}: ${error.message}`);
              continue;
            }
            
            if (existing && existing.length > 0) {
              skippedCount++;
              continue;
            }
            
            // Save the question
            const { error: saveError } = await supabase
              .from('saved_questions')
              .insert({
                user_id: userId,
                question_id: questionId,
                saved_at: new Date().toISOString()
              });
            
            if (saveError) {
              errors.push(`Failed to save question ${questionId}: ${saveError.message}`);
            } else {
              migratedCount++;
            }
          } else {
            skippedCount++;
          }
        }
        
        console.log(`🔖 Saved questions migration completed: ${migratedCount} migrated, ${skippedCount} skipped`);
        
      } catch (parseError) {
        console.error('❌ Error parsing saved questions data:', parseError);
        errors.push(`Failed to parse saved questions data: ${(parseError as Error).message}`);
      }
      
      return {
        success: errors.length === 0,
        migratedRecords: migratedCount,
        errors,
        skippedRecords: skippedCount
      };
      
    } catch (error) {
      console.error('❌ Saved questions migration failed:', error);
      return {
        success: false,
        migratedRecords: 0,
        errors: [(error as Error).message],
        skippedRecords: 0
      };
    }
  }

  /**
   * Migrate simulation progress data
   */
  private static async migrateSimulationProgress(userId: string): Promise<MigrationResult> {
    try {
      console.log('🎯 Migrating simulation progress...');
      
      let migratedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];
      
      // Get all simulation progress keys from localStorage
      const progressKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('simulation_progress_') || 
        key.startsWith('set_progress_') || 
        key.startsWith('quick_practice_')
      );
      
      console.log(`🎯 Found ${progressKeys.length} simulation progress records to migrate`);
      
      for (const key of progressKeys) {
        try {
          const progressData = localStorage.getItem(key);
          if (!progressData) continue;
          
          const progress = JSON.parse(progressData);
          
          // Extract session information
          let sessionType: 'practice' | 'simulation' | 'exam' | 'story' = 'practice';
          let topicId: number | undefined;
          let difficulty: string | undefined;
          
          if (key.startsWith('simulation_progress_')) {
            sessionType = 'simulation';
            const parts = key.split('_');
            if (parts.length > 2) {
              topicId = parseInt(parts[2]);
            }
          } else if (key.startsWith('set_progress_')) {
            sessionType = 'practice';
          } else if (key.startsWith('quick_practice_')) {
            sessionType = 'practice';
          }
          
          // Check if we have meaningful progress data
          if (progress.answeredCount > 0 || progress.correctCount > 0) {
            const sessionData = {
              user_id: userId,
              session_type: sessionType,
              topic_id: topicId,
              difficulty: difficulty,
              questions_answered: progress.answeredCount || 0,
              correct_answers: progress.correctCount || 0,
              total_questions: progress.totalQuestions || progress.answeredCount || 0,
              time_spent: progress.timeSpent || 0,
              completed_at: new Date().toISOString(),
              metadata: {
                migrated_from: key,
                original_data: progress
              }
            };
            
            const result = await ProgressService.saveSimulationSession(sessionData);
            if (result.success) {
              migratedCount++;
            } else {
              errors.push(`Failed to migrate simulation progress ${key}: ${result.error}`);
            }
          } else {
            skippedCount++;
          }
          
        } catch (parseError) {
          console.error(`❌ Error parsing simulation progress ${key}:`, parseError);
          errors.push(`Failed to parse simulation progress ${key}: ${(parseError as Error).message}`);
          skippedCount++;
        }
      }
      
      console.log(`🎯 Simulation progress migration completed: ${migratedCount} migrated, ${skippedCount} skipped`);
      
      return {
        success: errors.length === 0,
        migratedRecords: migratedCount,
        errors,
        skippedRecords: skippedCount
      };
      
    } catch (error) {
      console.error('❌ Simulation progress migration failed:', error);
      return {
        success: false,
        migratedRecords: 0,
        errors: [(error as Error).message],
        skippedRecords: 0
      };
    }
  }

  /**
   * Get migration statistics
   */
  static async getMigrationStats(): Promise<MigrationStats | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      
      const userEmail = user.email;
      
      // Count local records
      const activityKey = `activity_history_${userEmail}`;
      const savedQuestionsKey = `saved_questions_${userEmail}`;
      
      let totalLocalRecords = 0;
      
      // Count activity records
      const activityData = localStorage.getItem(activityKey);
      if (activityData) {
        try {
          const activities = JSON.parse(activityData);
          totalLocalRecords += activities.length;
        } catch {}
      }
      
      // Count saved questions
      const savedQuestionsData = localStorage.getItem(savedQuestionsKey);
      if (savedQuestionsData) {
        try {
          const savedQuestions = JSON.parse(savedQuestionsData);
          totalLocalRecords += savedQuestions.length;
        } catch {}
      }
      
      // Count simulation progress
      const progressKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('simulation_progress_') || 
        key.startsWith('set_progress_') || 
        key.startsWith('quick_practice_')
      );
      totalLocalRecords += progressKeys.length;
      
      // Count Supabase records
      const [progressResult, savedResult, sessionResult] = await Promise.all([
        supabase.from('user_progress').select('id').eq('user_id', user.id),
        supabase.from('saved_questions').select('id').eq('user_id', user.id),
        supabase.from('simulation_sessions').select('id').eq('user_id', user.id)
      ]);
      
      const totalSupabaseRecords = 
        (progressResult.data?.length || 0) + 
        (savedResult.data?.length || 0) + 
        (sessionResult.data?.length || 0);
      
      return {
        totalLocalRecords,
        totalSupabaseRecords,
        duplicateRecords: Math.max(0, totalLocalRecords - totalSupabaseRecords),
        newRecords: totalSupabaseRecords
      };
      
    } catch (error) {
      console.error('❌ Error getting migration stats:', error);
      return null;
    }
  }

  /**
   * Clean up localStorage after successful migration
   */
  static async cleanupLocalStorage(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧹 Starting localStorage cleanup...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const userEmail = user.email;
      
      // Keys to clean up
      const keysToClean = [
        `activity_history_${userEmail}`,
        `saved_questions_${userEmail}`,
        ...Object.keys(localStorage).filter(key => 
          key.startsWith('simulation_progress_') || 
          key.startsWith('set_progress_') || 
          key.startsWith('quick_practice_')
        )
      ];
      
      for (const key of keysToClean) {
        localStorage.removeItem(key);
      }
      
      console.log(`🧹 Cleaned up ${keysToClean.length} localStorage keys`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ localStorage cleanup failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export default MigrationService;