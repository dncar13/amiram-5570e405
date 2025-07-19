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
      generation_model: 'batch_upload',
      batch_id: batchId,
      quality_score: 85, // Default quality score for manual uploads
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static async getUploadHistory(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('batch_id, created_at, is_premium, ai_generated')
        .not('batch_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

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
        } else {
          acc.push({
            batch_id: question.batch_id,
            created_at: question.created_at,
            count: 1,
            premium_count: question.is_premium ? 1 : 0
          });
        }
        return acc;
      }, []);

      return batches;
    } catch (error) {
      console.error('Error in getUploadHistory:', error);
      return [];
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
    });

    return { valid: errors.length === 0, errors };
  }
}