
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/data/types/questionTypes";

export interface QuestionUploadFormat {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  setId?: string;
  setNumber?: number;
  setOrder?: number;
}

export interface QuestionBatch {
  metadata: {
    description: string;
    created: string;
    purpose: string;
  };
  questions: QuestionUploadFormat[];
}

export interface UploadResult {
  success: boolean;
  uploadedCount: number;
  errors: string[];
  batchId?: string;
}

export class QuestionsUploadService {
  static async uploadQuestionBatch(batch: QuestionBatch): Promise<UploadResult> {
    try {
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const errors: string[] = [];
      let uploadedCount = 0;

      console.log(`📤 Starting upload of ${batch.questions.length} questions with batch ID: ${batchId}`);

      // Process questions one by one to handle any individual errors
      for (const [index, question] of batch.questions.entries()) {
        try {
          const transformedQuestion = this.transformQuestionForDB(question, batchId);
          
          const { error } = await supabase
            .from('questions')
            .insert([transformedQuestion]);

          if (error) {
            console.error(`❌ Error uploading question ${index + 1}:`, error);
            errors.push(`Question ${index + 1} (${question.id}): ${error.message}`);
          } else {
            uploadedCount++;
            console.log(`✅ Successfully uploaded question ${index + 1}: ${question.id}`);
          }
        } catch (questionError) {
          console.error(`❌ Unexpected error with question ${index + 1}:`, questionError);
          errors.push(`Question ${index + 1} (${question.id}): Unexpected error during processing`);
        }
      }

      console.log(`📊 Upload complete. Success: ${uploadedCount}/${batch.questions.length}, Errors: ${errors.length}`);

      return {
        success: errors.length === 0,
        uploadedCount,
        errors,
        batchId
      };
    } catch (error) {
      console.error('❌ Batch upload failed:', error);
      return {
        success: false,
        uploadedCount: 0,
        errors: [`Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  private static transformQuestionForDB(question: QuestionUploadFormat, batchId: string) {
    // Determine if question is premium based on tags
    const isPremium = question.tags?.includes('premium') || false;
    const isSet1 = question.tags?.includes('set1') || false;
    
    // Create metadata object with set information
    const metadata = {
      tags: question.tags || [],
      is_set_based: !!question.setId,
      set_id: question.setId || null,
      set_number: question.setNumber || null,
      set_order: question.setOrder || null,
      set_type: question.type,
      is_premium_set: isPremium && isSet1
    };
    
    return {
      id: question.id,
      type: question.type,
      question_text: question.text,
      answer_options: question.options,
      correct_answer: question.correctAnswer.toString(),
      explanation: question.explanation,
      difficulty: question.difficulty,
      is_premium: isPremium,
      ai_generated: true, // Assuming uploaded questions are AI generated
      generation_model: 'premium_set_upload',
      batch_id: batchId,
      quality_score: 90, // Higher quality score for premium questions
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: metadata
    };
  }

  static async getUploadHistory(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('batch_id, created_at, is_premium, ai_generated, metadata')
        .not('batch_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit * 5); // Get more to account for grouping

      if (error) {
        console.error('Error fetching upload history:', error);
        return [];
      }

      // Group by batch_id and get batch stats
      const batches = data.reduce((acc: any[], question) => {
        const existing = acc.find(b => b.batch_id === question.batch_id);
        if (existing) {
          existing.count++;
          if (question.is_premium) existing.premium_count++;
          if (question.metadata?.is_set_based) existing.set_based_count++;
        } else {
          acc.push({
            batch_id: question.batch_id,
            created_at: question.created_at,
            count: 1,
            premium_count: question.is_premium ? 1 : 0,
            set_based_count: question.metadata?.is_set_based ? 1 : 0,
            set_type: question.metadata?.set_type || null
          });
        }
        return acc;
      }, []);

      return batches.slice(0, limit);
    } catch (error) {
      console.error('Error in getUploadHistory:', error);
      return [];
    }
  }

  static async getPremiumStats() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('is_premium, difficulty, type, metadata')
        .eq('is_premium', true);

      if (error) {
        console.error('Error fetching premium stats:', error);
        return null;
      }

      const stats = {
        total: data.length,
        byDifficulty: {
          easy: data.filter(q => q.difficulty === 'easy').length,
          medium: data.filter(q => q.difficulty === 'medium').length,
          hard: data.filter(q => q.difficulty === 'hard').length
        },
        byType: data.reduce((acc: any, q) => {
          acc[q.type] = (acc[q.type] || 0) + 1;
          return acc;
        }, {}),
        setBased: data.filter(q => q.metadata?.is_set_based).length
      };

      return stats;
    } catch (error) {
      console.error('Error in getPremiumStats:', error);
      return null;
    }
  }

  static async validateQuestionBatch(batch: QuestionBatch): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate metadata
    if (!batch.metadata?.description) {
      errors.push('Batch metadata missing description');
    }

    if (!batch.questions || !Array.isArray(batch.questions)) {
      errors.push('Questions array is missing or invalid');
      return { valid: false, errors };
    }

    if (batch.questions.length === 0) {
      errors.push('Questions array is empty');
      return { valid: false, errors };
    }

    // Validate each question
    batch.questions.forEach((question, index) => {
      const questionNum = index + 1;

      if (!question.id || typeof question.id !== 'string') {
        errors.push(`Question ${questionNum}: Missing or invalid ID`);
      }

      if (!question.type || typeof question.type !== 'string') {
        errors.push(`Question ${questionNum}: Missing or invalid type`);
      }

      if (!question.text || typeof question.text !== 'string') {
        errors.push(`Question ${questionNum}: Missing or invalid text`);
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`Question ${questionNum}: Options must be an array with at least 2 items`);
      }

      if (typeof question.correctAnswer !== 'number' || 
          question.correctAnswer < 0 || 
          question.correctAnswer >= (question.options?.length || 0)) {
        errors.push(`Question ${questionNum}: Invalid correctAnswer index`);
      }

      if (!question.explanation || typeof question.explanation !== 'string') {
        errors.push(`Question ${questionNum}: Missing or invalid explanation`);
      }

      if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
        errors.push(`Question ${questionNum}: Difficulty must be 'easy', 'medium', or 'hard'`);
      }

      // Validate set information if provided
      if (question.setId && (!question.setNumber || !question.setOrder)) {
        errors.push(`Question ${questionNum}: Set ID provided but missing set number or order`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}
