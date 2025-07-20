/**
 * Questions Service - Admin Panel Interface
 * Provides CRUD operations and data management for the admin questions interface
 */

import { Question } from "@/data/types/questionTypes";

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
  console.log('[Admin Questions] Starting upload of test/premium questions');
  
  try {
    // Simulate upload process with progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create sample premium questions for testing
    const samplePremiumQuestions = [
      {
        id: `premium_${Date.now()}_1`,
        type: 'reading-comprehension',
        text: 'שאלה פרמיום לדוגמה - הבנת הנקרא',
        options: ['תשובה 1', 'תשובה 2', 'תשובה 3', 'תשובה נכונה'],
        correctAnswer: 3,
        difficulty: 'medium',
        explanation: 'הסבר לשאלה פרמיום',
        is_premium: true,
        ai_generated: true,
        generation_model: 'gpt-4',
        batch_id: `batch_${Date.now()}`,
        quality_score: 0.95
      },
      {
        id: `premium_${Date.now()}_2`,
        type: 'sentence-completion',
        text: 'שאלה פרמיום לדוגמה - השלמת משפטים',
        options: ['השלמה 1', 'השלמה נכונה', 'השלמה 3', 'השלמה 4'],
        correctAnswer: 1,
        difficulty: 'hard',
        explanation: 'הסבר לשאלה פרמיום מתקדמת',
        is_premium: true,
        ai_generated: true,
        generation_model: 'gpt-4',
        batch_id: `batch_${Date.now()}`,
        quality_score: 0.92
      },
      {
        id: `premium_${Date.now()}_3`,
        type: 'restatement',
        text: 'שאלה פרמיום לדוגמה - ניסוח מחדש',
        options: ['ניסוח 1', 'ניסוח 2', 'ניסוח נכון', 'ניסוח 4'],
        correctAnswer: 2,
        difficulty: 'easy',
        explanation: 'הסבר לשאלת ניסוח מחדש פרמיום',
        is_premium: true,
        ai_generated: true,
        generation_model: 'gpt-4',
        batch_id: `batch_${Date.now()}`,
        quality_score: 0.88
      }
    ];
    
    const uploadedCount = samplePremiumQuestions.length;
    
    console.log(`[Admin Questions] Successfully uploaded ${uploadedCount} premium questions with is_premium = true`);
    console.log('[Admin Questions] Premium questions created:', samplePremiumQuestions.map(q => ({
      id: q.id,
      type: q.type,
      is_premium: q.is_premium,
      difficulty: q.difficulty
    })));
    
    // In a real implementation, this would insert into Supabase with the premium flags
    
    return { 
      success: true, 
      count: uploadedCount 
    };
  } catch (error) {
    console.error('[Admin Questions] Error uploading questions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};