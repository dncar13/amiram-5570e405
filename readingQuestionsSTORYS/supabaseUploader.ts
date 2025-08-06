import { createClient } from '@supabase/supabase-js';
import { EnhancedQuestion, StorySummary } from './enhanced-ai-generator.js';

export interface UploadResult {
  success: boolean;
  passageId?: string;
  questionsUploaded?: number;
  error?: string;
}

export class SupabaseUploader {
  private batchId: string;
  private supabase: any;

  constructor() {
    this.batchId = `ai_batch_${Date.now()}`;
    
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadStory(
    passage: string,
    questions: EnhancedQuestion[],
    storySummary: StorySummary,
    storyTitle: string
  ): Promise<UploadResult> {
    try {
      console.log('🚀 Starting upload to Supabase...');
      
      // Step 1: Insert passage
      const passageResult = await this.insertPassage(passage, storySummary, storyTitle);
      if (!passageResult.success) {
        return { success: false, error: `Failed to upload passage: ${passageResult.error}` };
      }

      console.log(`✅ Passage uploaded with ID: ${passageResult.passageId}`);

      // Step 2: Insert questions
      const questionsResult = await this.insertQuestions(questions, passageResult.passageId!, storyTitle);
      if (!questionsResult.success) {
        return { 
          success: false, 
          error: `Failed to upload questions: ${questionsResult.error}`,
          passageId: passageResult.passageId
        };
      }

      console.log(`✅ ${questionsResult.questionsUploaded} questions uploaded successfully`);

      return {
        success: true,
        passageId: passageResult.passageId,
        questionsUploaded: questionsResult.questionsUploaded
      };

    } catch (error) {
      console.error('❌ Upload failed:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async insertPassage(
    passage: string,
    storySummary: StorySummary,
    storyTitle: string
  ): Promise<{ success: boolean; passageId?: string; error?: string }> {
    try {
      // Check if passage with this title already exists
      const { data: existingPassage, error: checkError } = await this.supabase
        .from('passages')
        .select('id')
        .eq('title', storyTitle)
        .single();

      if (existingPassage) {
        console.log(`📋 Passage "${storyTitle}" already exists, using existing ID: ${existingPassage.id}`);
        return { success: true, passageId: existingPassage.id };
      }

      // Insert new passage
      const passageData = {
        title: storyTitle,
        content: passage,
        topic: storySummary.topic,
        general_subject: this.mapTopicToGeneralSubject(storySummary.topic),
        word_count: storySummary.wordCount,
        estimated_reading_time: storySummary.estimatedTime,
        line_count: this.countLines(passage),
        difficulty: storySummary.difficulty,
        metadata: {
          ai_generated: true,
          batch_id: this.batchId,
          generated_at: new Date().toISOString(),
          num_questions: storySummary.numQuestions
        }
      };

      const { data, error } = await this.supabase
        .from('passages')
        .insert(passageData)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return { success: true, passageId: data.id };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async insertQuestions(
    questions: EnhancedQuestion[],
    passageId: string,
    passageTitle: string
  ): Promise<{ success: boolean; questionsUploaded?: number; error?: string }> {
    try {
      const questionsData = questions.map((question, index) => ({
        question_text: question.text,
        answer_options: question.options.map(opt => opt.text), // Extract just the text for compatibility
        correct_answer: question.correctAnswer.toString(),
        explanation: question.explanation,
        type: 'reading-comprehension',
        difficulty: question.difficulty,
        passage_title: passageTitle,
        passage_content: null, // We store content in passages table now
        passage_id: passageId,
        is_premium: true, // All AI-generated stories are premium
        ai_generated: true,
        generation_model: 'claude-3-5-sonnet-20241022',
        batch_id: this.batchId,
        quality_score: question.difficultyScore,
        metadata: {
          ...question.metadata,
          questionId: question.questionId,
          hint: question.hint,
          paragraphReference: question.paragraphReference,
          skills: question.skills,
          tags: question.tags,
          rationales: question.options.map(opt => ({
            text: opt.text,
            rationale: opt.rationale
          })),
          aiPrompt: question.aiPrompt,
          generated_at: new Date().toISOString(),
          batch_order: index + 1
        }
      }));

      // Insert in batches of 25 (should be fine for most cases)
      const batchSize = 25;
      let totalUploaded = 0;

      for (let i = 0; i < questionsData.length; i += batchSize) {
        const batch = questionsData.slice(i, i + batchSize);
        
        const { data, error } = await this.supabase
          .from('questions')
          .insert(batch);

        if (error) {
          throw new Error(`Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
        }

        totalUploaded += batch.length;
        console.log(`📝 Uploaded batch ${Math.floor(i / batchSize) + 1}: ${batch.length} questions`);
      }

      return { success: true, questionsUploaded: totalUploaded };

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private mapTopicToGeneralSubject(topic: string): string {
    const mappings: { [key: string]: string } = {
      'Technology': 'Technology',
      'Environment': 'Environment',
      'Health': 'Health',
      'Education': 'Education',
      'Economics': 'Economics',
      'History': 'History',
      'Psychology': 'Psychology',
      'Engineering': 'Engineering',
      'Society': 'Society',
      'Ethics': 'Ethics'
    };

    return mappings[topic] || 'Technology'; // Default to Technology
  }

  private countLines(text: string): number {
    return text.split('\n').length;
  }

  // Utility method to clear test data
  async clearTestData(): Promise<void> {
    console.log('🧹 Clearing test data...');
    
    // Delete questions from this batch
    const { error: questionsError } = await this.supabase
      .from('questions')
      .delete()
      .eq('batch_id', this.batchId);

    if (questionsError) {
      console.error('Error clearing questions:', questionsError);
    }

    // Delete passages from this batch
    const { error: passagesError } = await this.supabase
      .from('passages')
      .delete()
      .filter('metadata->batch_id', 'eq', this.batchId);

    if (passagesError) {
      console.error('Error clearing passages:', passagesError);
    }

    console.log('✅ Test data cleared');
  }
}