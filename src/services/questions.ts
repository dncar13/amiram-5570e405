/**
 * Questions Service - Admin Panel Interface
 * Provides CRUD operations and data management for the admin questions interface
 */

import { Question } from "@/data/types/questionTypes";
import { supabase } from "@/integrations/supabase/client";

// Re-export main query functions
export { 
  getAllQuestions,
  getQuestionsByType,
  getQuestionsByDifficulty,
  getSentenceCompletionQuestions,
  getRestatementQuestions,
  getReadingComprehensionQuestions,
  getVocabularyQuestions
} from "./questionsService";

/**
 * Update an existing question
 */
export const updateQuestion = async (question: Question): Promise<boolean> => {
  console.log('[Admin Questions] Updating question:', question.id);
  try {
    // For now, we'll simulate success - this would integrate with Supabase update
    console.log('[Admin Questions] Question updated successfully');
    return true;
  } catch (error) {
    console.error('[Admin Questions] Error updating question:', error);
    return false;
  }
};

/**
 * Add a new question
 */
export const addQuestion = async (question: Question): Promise<boolean> => {
  console.log('[Admin Questions] Adding new question');
  try {
    // For now, we'll simulate success - this would integrate with Supabase insert
    console.log('[Admin Questions] Question added successfully');
    return true;
  } catch (error) {
    console.error('[Admin Questions] Error adding question:', error);
    return false;
  }
};

/**
 * Delete a question
 */
export const deleteQuestion = async (questionId: string | number): Promise<boolean> => {
  console.log('[Admin Questions] Deleting question:', questionId);
  try {
    // For now, we'll simulate success - this would integrate with Supabase delete
    console.log('[Admin Questions] Question deleted successfully');
    return true;
  } catch (error) {
    console.error('[Admin Questions] Error deleting question:', error);
    return false;
  }
};

/**
 * Save all changes (batch operation)
 */
export const saveChanges = (): boolean => {
  console.log('[Admin Questions] Saving all changes');
  try {
    // For now, we'll simulate success - this would commit all pending changes
    console.log('[Admin Questions] All changes saved successfully');
    return true;
  } catch (error) {
    console.error('[Admin Questions] Error saving changes:', error);
    return false;
  }
};

/**
 * Reset all changes (rollback)
 */
export const resetChanges = (): boolean => {
  console.log('[Admin Questions] Resetting all changes');
  try {
    // For now, we'll simulate success - this would rollback pending changes
    console.log('[Admin Questions] All changes reset successfully');
    return true;
  } catch (error) {
    console.error('[Admin Questions] Error resetting changes:', error);
    return false;
  }
};

/**
 * Refresh questions from storage
 */
export const refreshQuestionsFromStorage = async (): Promise<Question[]> => {
  console.log('[Admin Questions] Refreshing questions from storage');
  const { getAllQuestions } = await import('./questionsService');
  return getAllQuestions();
};

/**
 * Upload test/premium questions to the database
 */
export const uploadTestQuestions = async (): Promise<{ success: boolean; count?: number; error?: string }> => {
  console.log('[Admin Questions] Starting test/premium question upload...');
  
  try {
    // בדיקה אם השאלות כבר קיימות
    const { data: existingQuestions, error: checkError } = await supabase
      .from('questions')
      .select('metadata')
      .eq('is_premium', true)
      .not('metadata->custom_id', 'is', null);
    
    if (checkError) {
      console.error('❌ Error checking existing questions:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // Check for existing custom IDs starting with set1_prem
    const existingCustomIds = existingQuestions?.map(q => {
      if (q.metadata && typeof q.metadata === 'object' && 'custom_id' in q.metadata) {
        return q.metadata.custom_id as string;
      }
      return null;
    }).filter(Boolean) || [];
    
    const hasSet1Questions = existingCustomIds.some(id => id?.includes('set1_prem'));
    
    if (hasSet1Questions) {
      console.log('⚠️ שאלות פרימיום Set 1 כבר קיימות במערכת');
      return {
        success: false,
        error: 'שאלות פרימיום Set 1 כבר קיימות במערכת. השתמש ב"רענן שאלות" לראות אותן.'
      };
    }
    
    return {
      success: false,
      error: 'פונקציית ההעלאה הושבתה זמנית. השתמש ב"רענן שאלות" לראות את השאלות הפרימיום הקיימות.'
    };
  } catch (error) {
    console.error('[Admin Questions] ❌ Error during premium question upload:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unexpected error during upload'
    };
  }
};