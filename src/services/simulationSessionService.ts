import { supabase } from "@/integrations/supabase/client";

export interface LiveSimulationSession {
  id?: string;
  user_id: string;
  current_question_index: number;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  total_questions: number;
  progress_percentage: number;
  is_completed?: boolean;
  metadata?: any;
  session_type?: string;
  correct_answers?: number;
  questions_answered?: number;
  time_spent?: number;
}

/**
 * Save or update a live simulation session
 */
export async function saveSimulationSession(sessionData: LiveSimulationSession) {
  try {
    console.log('🔄 [saveSimulationSession] Saving session data:', sessionData);
    
    const now = new Date().toISOString();
    // Create data object without undefined id for new sessions
    const dataToSave: any = {
      user_id: sessionData.user_id,
      current_question_index: sessionData.current_question_index,
      answers: sessionData.answers,
      total_questions: sessionData.total_questions,
      progress_percentage: sessionData.progress_percentage,
      updated_at: now,
      is_completed: sessionData.is_completed ?? false,
      status: sessionData.is_completed ? "completed" : "draft",
      session_type: sessionData.session_type || 'simulation',
      metadata: sessionData.metadata ?? {},
      correct_answers: sessionData.correct_answers ?? 0,
      questions_answered: sessionData.questions_answered ?? 0,
      time_spent: sessionData.time_spent ?? 0,
    };

    // Only include id if it exists (for updates)
    if (sessionData.id) {
      dataToSave.id = sessionData.id;
    }

    // Only include completed_at if session is completed
    if (sessionData.is_completed) {
      dataToSave.completed_at = now;
    }

    const { data, error } = await supabase
      .from("simulation_sessions")
      .upsert([dataToSave], { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [saveSimulationSession] Error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [saveSimulationSession] Session saved successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ [saveSimulationSession] Exception:', error);
    return { success: false, error: 'Failed to save session' };
  }
}

/**
 * Load an active (incomplete) simulation session for a user
 * Can filter by set parameters for set-based simulations
 */
export async function loadActiveSimulationSession(
  user_id: string, 
  filters?: {
    setNumber?: string;
    setType?: string;
    difficulty?: string;
    isSetBased?: boolean;
  }
) {
  try {
    console.log('🔍 [loadActiveSimulationSession] Loading for user:', user_id, 'with filters:', filters);
    
    let query = supabase
      .from("simulation_sessions")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_completed", false);

    // Apply filters for set-based simulations
    if (filters?.isSetBased) {
      query = query.filter('metadata->>is_set_based', 'eq', 'true');
      
      if (filters.setNumber) {
        query = query.filter('metadata->>set_id', 'eq', filters.setNumber);
      }
      
      if (filters.setType) {
        query = query.filter('metadata->>set_type', 'eq', filters.setType);
      }
      
      if (filters.difficulty) {
        query = query.filter('metadata->>set_difficulty', 'eq', filters.difficulty);
      }
    } else if (filters?.isSetBased === false) {
      // Explicitly exclude set-based sessions
      query = query.or('metadata->>is_set_based.is.null,metadata->>is_set_based.neq.true');
    }

    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('❌ [loadActiveSimulationSession] Error:', error);
      return { success: false, error: error.message };
    }

    if (data) {
      console.log('✅ [loadActiveSimulationSession] Found active session:', data.id, 'metadata:', data.metadata);
    } else {
      console.log('ℹ️ [loadActiveSimulationSession] No active session found');
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ [loadActiveSimulationSession] Exception:', error);
    return { success: false, error: 'Failed to load session' };
  }
}

/**
 * Complete a simulation session
 */
export async function completeSimulationSession(sessionId: string, finalData: {
  correct_answers: number;
  questions_answered: number;
  time_spent: number;
  progress_percentage: number;
}) {
  try {
    console.log('🏁 [completeSimulationSession] Completing session:', sessionId);
    
    const { data, error } = await supabase
      .from("simulation_sessions")
      .update({
        is_completed: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        correct_answers: finalData.correct_answers,
        questions_answered: finalData.questions_answered,
        time_spent: finalData.time_spent,
        progress_percentage: finalData.progress_percentage,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('❌ [completeSimulationSession] Error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [completeSimulationSession] Session completed successfully');
    return { success: true, data };
  } catch (error) {
    console.error('❌ [completeSimulationSession] Exception:', error);
    return { success: false, error: 'Failed to complete session' };
  }
}

/**
 * Delete/cancel an active simulation session
 */
export async function cancelSimulationSession(sessionId: string) {
  try {
    console.log('🗑️ [cancelSimulationSession] Canceling session:', sessionId);
    
    const { error } = await supabase
      .from("simulation_sessions")
      .delete()
      .eq('id', sessionId)
      .eq('is_completed', false);

    if (error) {
      console.error('❌ [cancelSimulationSession] Error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [cancelSimulationSession] Session canceled successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ [cancelSimulationSession] Exception:', error);
    return { success: false, error: 'Failed to cancel session' };
  }
}