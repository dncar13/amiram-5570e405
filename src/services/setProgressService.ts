/**
 * Enhanced Set Progress Service - Handles progress tracking for question sets
 * Built on top of existing ProgressService and simulation_sessions
 */

import { supabase } from '@/integrations/supabase/client';
import { ProgressService } from './progressService';

// Set-specific metadata structure
export interface SetMetadata {
  set_id: number;
  set_type: string; // 'sentence-completion', 'restatement', etc.
  set_difficulty: string; // 'easy', 'medium', 'hard'
  start_index: number;
  end_index: number;
  questions_in_set: number;
  set_title: string;
  last_question_index?: number;
  paused_at?: string;
}

// Set progress data structure
export interface SetProgress {
  id: string;
  user_id: string;
  set_id: number;
  set_type: string;
  set_difficulty: string;
  current_question_index: number;
  questions_answered: number;
  correct_answers: number;
  total_questions: number;
  progress_percentage: number;
  is_completed: boolean;
  time_spent: number;
  metadata: SetMetadata;
  created_at: string;
  updated_at: string;
  last_activity: string;
}

// Set progress summary for UI
export interface SetProgressSummary {
  set_id: number;
  set_type: string;
  set_difficulty: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  current_question: number;
  total_questions: number;
  score_percentage: number;
  time_spent: number;
  last_activity?: string;
  can_resume: boolean;
}

export class SetProgressService {
  
  /**
   * Save or update set progress
   */
  static async saveSetProgress(
    userId: string, 
    setData: SetMetadata,
    progressData: {
      current_question_index: number;
      questions_answered: number;
      correct_answers: number;
      time_spent: number;
      is_completed?: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 [SetProgressService] Saving set progress:', {
        userId,
        setId: setData.set_id,
        setType: setData.set_type,
        setDifficulty: setData.set_difficulty,
        questions_answered: progressData.questions_answered,
        correct_answers: progressData.correct_answers,
        is_completed: progressData.is_completed,
        timestamp: new Date().toISOString()
      });

      // ✅ Enhanced validation with type checking
      if (!userId || !setData.set_id || !setData.set_type || !setData.set_difficulty) {
        console.error('❌ Missing required parameters', {
          userId: !!userId,
          setId: !!setData.set_id,
          setType: !!setData.set_type,
          setDifficulty: !!setData.set_difficulty
        });
        return { success: false, error: 'Missing required parameters' };
      }

      // ✅ Validate numeric fields
      if (typeof setData.set_id !== 'number' || isNaN(setData.set_id)) {
        console.error('❌ Invalid set_id type:', typeof setData.set_id, setData.set_id);
        return { success: false, error: 'Invalid set_id: must be a number' };
      }

      if (typeof progressData.questions_answered !== 'number' || progressData.questions_answered < 0) {
        console.error('❌ Invalid questions_answered:', progressData.questions_answered);
        return { success: false, error: 'Invalid questions_answered: must be a non-negative number' };
      }

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) {
        console.error('❌ User not authenticated or mismatch');
        return { success: false, error: 'Authentication failed' };
      }
      
      const progress_percentage = (progressData.questions_answered / setData.questions_in_set) * 100;
      
      // Check if set progress already exists
      const { data: existingProgress } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true')
        .filter('metadata->>set_id', 'eq', setData.set_id.toString())
        .filter('metadata->>set_type', 'eq', setData.set_type)
        .filter('metadata->>set_difficulty', 'eq', setData.set_difficulty)
        .maybeSingle();
      
      const sessionData = {
        user_id: userId,
        session_type: 'practice' as const,
        topic_id: null,
        difficulty: setData.set_difficulty,
        questions_answered: progressData.questions_answered,
        correct_answers: progressData.correct_answers,
        total_questions: setData.questions_in_set,
        current_question_index: progressData.current_question_index,
        progress_percentage: Math.round(progress_percentage),
        is_completed: progressData.is_completed || false,
        time_spent: progressData.time_spent,
        updated_at: new Date().toISOString(),
        metadata: {
          is_set_based: 'true',
          set_id: setData.set_id.toString(), // Store as string but we'll parse back to number
          set_type: setData.set_type,
          set_difficulty: setData.set_difficulty,
          set_title: setData.set_title,
          start_index: setData.start_index.toString(),
          end_index: setData.end_index.toString(),
          questions_in_set: setData.questions_in_set.toString(),
          last_question_index: progressData.current_question_index.toString(),
          paused_at: new Date().toISOString(),
          session_subtype: 'set_practice'
        }
      };

      console.log('💾 Session data to save:', {
        setId: setData.set_id,
        questions_answered: progressData.questions_answered,
        correct_answers: progressData.correct_answers,
        current_question_index: progressData.current_question_index,
        progress_percentage: Math.round(progress_percentage),
        is_completed: progressData.is_completed || false,
        metadata: sessionData.metadata
      });
      
      if (existingProgress) {
        // Update existing progress
        console.log('📝 Updating existing session:', existingProgress.id);
        
        const { error } = await supabase
          .from('simulation_sessions')
          .update(sessionData)
          .eq('id', existingProgress.id);
        
        if (error) {
          console.error('❌ Error updating set progress:', error);
          return { success: false, error: error.message };
        }
        
        console.log('✅ Set progress updated successfully');
      } else {
        // Create new progress entry
        console.log('➕ Creating new session');
        
        const { error } = await supabase
          .from('simulation_sessions')
          .insert({
            ...sessionData,
            created_at: new Date().toISOString(),
            completed_at: progressData.is_completed ? new Date().toISOString() : null
          });
        
        if (error) {
          console.error('❌ Error creating set progress:', error);
          return { success: false, error: error.message };
        }
        
        console.log('✅ Set progress created successfully');
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Exception in saveSetProgress:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  /**
   * Get progress for a specific set
   */
  static async getSetProgress(
    userId: string,
    setId: number,
    setType: string,
    setDifficulty: string
  ): Promise<SetProgress | null> {
    try {
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true')
        .filter('metadata->>set_id', 'eq', setId.toString())
        .filter('metadata->>set_type', 'eq', setType)
        .filter('metadata->>set_difficulty', 'eq', setDifficulty)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error fetching set progress:', error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      const metadata = data.metadata as unknown as SetMetadata;
      return {
        id: data.id,
        user_id: data.user_id,
        set_id: metadata?.set_id,
        set_type: metadata?.set_type,
        set_difficulty: metadata?.set_difficulty,
        current_question_index: data.current_question_index || 0,
        questions_answered: data.questions_answered,
        correct_answers: data.correct_answers,
        total_questions: data.total_questions,
        progress_percentage: data.progress_percentage || 0,
        is_completed: data.is_completed || false,
        time_spent: data.time_spent,
        metadata: metadata,
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_activity: data.updated_at
      };
    } catch (error) {
      console.error('❌ Exception in getSetProgress:', error);
      return null;
    }
  }
  
  /**
   * Get progress summary for all sets of a specific type and difficulty
   */
  static async getSetProgressSummary(
    userId: string,
    setType: string,
    setDifficulty: string
  ): Promise<Record<number, SetProgressSummary>> {
    try {
      console.log('🔍 [SetProgressService] Fetching set progress summary for:', { 
        userId, 
        setType, 
        setDifficulty,
        timestamp: new Date().toISOString()
      });

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) {
        console.error('❌ User not authenticated or mismatch');
        return {};
      }
      
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true')
        .filter('metadata->>set_type', 'eq', setType)
        .filter('metadata->>set_difficulty', 'eq', setDifficulty)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching set progress summary:', error);
        return {};
      }
      
      console.log('📊 Found sessions:', data?.length || 0);
      
      const summary: Record<number, SetProgressSummary> = {};
      
      data?.forEach(session => {
        const metadata = session.metadata as unknown as SetMetadata;
        
        // ✅ Fix: Convert set_id from string to number for consistent comparison
        const setIdString = metadata?.set_id?.toString();
        const setId = setIdString ? parseInt(setIdString) : null;
        
        // ✅ Fix: Add null safety for numeric fields
        const questions_answered = session.questions_answered || 0;
        const correct_answers = session.correct_answers || 0;
        const current_question_index = session.current_question_index || 0;
        const progress_percentage = session.progress_percentage || 0;
        const time_spent = session.time_spent || 0;
        const is_completed = session.is_completed || false;
        
        console.log('🔍 Processing session:', {
          id: session.id,
          setId: setId,
          setIdString: setIdString,
          setType: metadata?.set_type,
          setDifficulty: metadata?.set_difficulty,
          status: session.status,
          questions_answered: questions_answered,
          is_completed: is_completed,
          rawMetadata: metadata
        });
        
        // Skip if set_id doesn't exist, is invalid, or doesn't match criteria
        if (!setId || isNaN(setId) || metadata?.set_type !== setType || metadata?.set_difficulty !== setDifficulty) {
          console.log('⚠️ Skipping session due to missing/mismatched criteria', {
            setId: setId,
            isNaN: isNaN(setId || 0),
            typeMatch: metadata?.set_type === setType,
            difficultyMatch: metadata?.set_difficulty === setDifficulty
          });
          return;
        }
        
        const scorePercentage = questions_answered > 0 
          ? Math.round((correct_answers / questions_answered) * 100)
          : 0;
        
        // ✅ Fix: Determine status more robustly
        let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
        
        if (is_completed) {
          status = 'completed';
        } else if (questions_answered > 0 || current_question_index > 0 || progress_percentage > 0) {
          status = 'in_progress';
        }
        
        console.log('📊 Status determination:', {
          setId,
          is_completed,
          questions_answered,
          current_question_index,
          progress_percentage,
          finalStatus: status
        });
        
        // ✅ Fix: Prioritize sessions with actual progress over just "most recent"
        const existingProgress = summary[setId];
        let shouldUpdate = false;
        
        if (!existingProgress) {
          shouldUpdate = true;
        } else {
          // Prioritize completed > in_progress > not_started
          const statusPriority = { 'completed': 3, 'in_progress': 2, 'not_started': 1 };
          const currentPriority = statusPriority[status];
          const existingPriority = statusPriority[existingProgress.status];
          
          if (currentPriority > existingPriority) {
            shouldUpdate = true;
          } else if (currentPriority === existingPriority) {
            // If same priority, take the more recent one
            shouldUpdate = session.updated_at > existingProgress.last_activity!;
          }
        }
        
        if (shouldUpdate) {
          summary[setId] = {
            set_id: setId,
            set_type: metadata?.set_type,
            set_difficulty: metadata?.set_difficulty,
            status: status,
            progress_percentage: progress_percentage,
            current_question: current_question_index,
            total_questions: session.total_questions || 10,
            score_percentage: scorePercentage,
            time_spent: time_spent,
            last_activity: session.updated_at,
            can_resume: !is_completed && (questions_answered > 0 || current_question_index > 0)
          };
          
          console.log(`✅ Added/Updated progress for set ${setId}:`, summary[setId]);
        } else {
          console.log(`⏭️ Skipped session for set ${setId} (existing progress is better)`);
        }
      });
      
      console.log('📈 Final summary:', summary);
      return summary;
    } catch (error) {
      console.error('❌ Exception in getSetProgressSummary:', error);
      return {};
    }
  }
  
  /**
   * Mark set as completed
   */
  static async completeSet(
    userId: string,
    setId: number,
    setType: string,
    setDifficulty: string,
    finalData: {
      correct_answers: number;
      total_questions: number;
      time_spent: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('simulation_sessions')
        .update({
          is_completed: true,
          progress_percentage: 100,
          questions_answered: finalData.total_questions,
          correct_answers: finalData.correct_answers,
          time_spent: finalData.time_spent,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true')
        .filter('metadata->>set_id', 'eq', setId.toString())
        .filter('metadata->>set_type', 'eq', setType)
        .filter('metadata->>set_difficulty', 'eq', setDifficulty);
      
      if (error) {
        console.error('❌ Error completing set:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Set completed successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Exception in completeSet:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  /**
   * Reset set progress (start over) - Enhanced version
   */
  static async resetSetProgress(
    userId: string,
    setId: number,
    setType: string,
    setDifficulty: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 [SetProgressService] Resetting set progress:', {
        userId,
        setId,
        setType,
        setDifficulty,
        timestamp: new Date().toISOString()
      });

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) {
        console.error('❌ User not authenticated or mismatch');
        return { success: false, error: 'Authentication failed' };
      }
      
      // Delete all sessions for this specific set (including completed ones)
      const { error } = await supabase
        .from('simulation_sessions')
        .delete()
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true')
        .filter('metadata->>set_id', 'eq', setId.toString())
        .filter('metadata->>set_type', 'eq', setType)
        .filter('metadata->>set_difficulty', 'eq', setDifficulty);
      
      if (error) {
        console.error('❌ Error resetting set progress:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Set progress reset successfully - all sessions deleted');
      return { success: true };
    } catch (error) {
      console.error('❌ Exception in resetSetProgress:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  /**
   * Get user's overall set completion statistics
   */
  static async getUserSetStats(userId: string): Promise<{
    total_sets_started: number;
    total_sets_completed: number;
    completion_rate: number;
    average_score: number;
    total_time_spent: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_type', 'practice')
        .filter('metadata->>is_set_based', 'eq', 'true');
      
      if (error) {
        console.error('❌ Error fetching user set stats:', error);
        return {
          total_sets_started: 0,
          total_sets_completed: 0,
          completion_rate: 0,
          average_score: 0,
          total_time_spent: 0
        };
      }
      
      if (!data || data.length === 0) {
        return {
          total_sets_started: 0,
          total_sets_completed: 0,
          completion_rate: 0,
          average_score: 0,
          total_time_spent: 0
        };
      }
      
      const totalSets = data.length;
      const completedSets = data.filter(s => s.is_completed).length;
      const completionRate = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
      
      const totalScore = data.reduce((sum, session) => {
        if (session.questions_answered > 0) {
          return sum + ((session.correct_answers / session.questions_answered) * 100);
        }
        return sum;
      }, 0);
      
      const averageScore = totalSets > 0 ? totalScore / totalSets : 0;
      const totalTimeSpent = data.reduce((sum, session) => sum + session.time_spent, 0);
      
      return {
        total_sets_started: totalSets,
        total_sets_completed: completedSets,
        completion_rate: Math.round(completionRate),
        average_score: Math.round(averageScore),
        total_time_spent: totalTimeSpent
      };
    } catch (error) {
      console.error('❌ Exception in getUserSetStats:', error);
      return {
        total_sets_started: 0,
        total_sets_completed: 0,
        completion_rate: 0,
        average_score: 0,
        total_time_spent: 0
      };
    }
  }
}

export default SetProgressService;
