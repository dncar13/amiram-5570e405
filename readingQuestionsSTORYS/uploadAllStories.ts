import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Enhanced interface matching our generated files
interface EnhancedQuestion {
  questionId: string;
  id: string;
  text: string;
  options: Array<{
    text: string;
    rationale: string;
  }>;
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'reading-comprehension';
  explanation: string;
  hint: string;
  paragraphReference: string;
  topicId: number;
  passageText?: string;
  passageTitle?: string;
  skills: string[];
  tags: string[];
  difficultyScore: number;
  metadata: {
    topic: string;
    questionNumber: number;
    questionType: 'main-idea' | 'detail' | 'inference' | 'vocabulary';
    totalQuestions: number;
    wordCount: number;
    estimatedTime: number;
    aiInstruction?: string;
  };
}

interface StorySummary {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  wordCount: number;
  numQuestions: number;
  estimatedTime: number;
  topicId: number;
}

interface LocalStoryFile {
  version: string;
  storySummary: StorySummary;
  passage: string;
  questions: EnhancedQuestion[];
}

async function uploadSingleStory(filePath: string): Promise<void> {
  console.log(`📄 Processing ${path.basename(filePath)}...`);
  
  try {
    // Import the TypeScript module
    const moduleUrl = `file://${path.resolve(filePath)}`;
    const storyModule = await import(moduleUrl);
    
    const passage = storyModule.passage;
    const questions = storyModule.questions;
    const storySummary = storyModule.storySummary;
    
    if (!passage || !questions || !storySummary) {
      throw new Error('Missing required exports: passage, questions, or storySummary');
    }

    console.log(`📖 Story: "${storySummary.title}" (${storySummary.difficulty})`);
    console.log(`📝 Questions: ${questions.length}, Words: ${storySummary.wordCount}`);

    // 1. Check if passage already exists
    const { data: existingPassages, error: checkError } = await supabase
      .from('passages')
      .select('id, title')
      .eq('title', storySummary.title);

    if (checkError) {
      throw new Error(`Failed to check existing passages: ${checkError.message}`);
    }

    let passageId: string;

    if (existingPassages && existingPassages.length > 0) {
      console.log(`⏭️  Passage "${storySummary.title}" already exists, skipping...`);
      passageId = existingPassages[0].id;
    } else {
      // 2. Insert passage
      const passageData = {
        id: uuid(),
        title: storySummary.title,
        content: passage,
        difficulty: storySummary.difficulty,
        topic_id: storySummary.topicId,
        word_count: storySummary.wordCount,
        estimated_time: storySummary.estimatedTime,
        is_premium: true, // All AI-generated stories are premium
        ai_generated: true,
        generation_model: 'claude-3-5-sonnet-20241022',
        batch_id: `bulk_upload_${Date.now()}`,
        metadata: {
          topic: storySummary.topic,
          version: 'final-ai-filled',
          upload_timestamp: new Date().toISOString()
        }
      };

      const { data: passageRow, error: passageError } = await supabase
        .from('passages')
        .insert(passageData)
        .select()
        .single();

      if (passageError) {
        throw new Error(`Failed to insert passage: ${passageError.message}`);
      }

      passageId = passageRow.id;
      console.log(`✅ Passage inserted with ID: ${passageId}`);
    }

    // 3. Check existing questions for this passage
    const { data: existingQuestions, error: questionsCheckError } = await supabase
      .from('questions')
      .select('id')
      .eq('passage_id', passageId);

    if (questionsCheckError) {
      throw new Error(`Failed to check existing questions: ${questionsCheckError.message}`);
    }

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(`⏭️  ${existingQuestions.length} questions already exist for this passage, skipping...`);
      return;
    }

    // 4. Prepare questions for bulk insert
    const questionsToInsert = questions.map((question, index) => ({
      id: uuid(),
      passage_id: passageId,
      question_text: question.text,
      answer_options: JSON.stringify(question.options.map(opt => opt.text)), // Just the text for compatibility
      correct_answer: question.correctAnswer.toString(), // Store as string for compatibility
      explanation: question.explanation,
      difficulty: question.difficulty,
      type: question.type,
      topic_id: storySummary.topicId,
      is_premium: true,
      ai_generated: true,
      generation_model: 'claude-3-5-sonnet-20241022',
      batch_id: `bulk_upload_${Date.now()}`,
      quality_score: question.difficultyScore,
      metadata: {
        questionId: question.questionId,
        hint: question.hint,
        paragraphReference: question.paragraphReference,
        skills: question.skills,
        tags: question.tags,
        originalMetadata: question.metadata,
        rationales: question.options.map(opt => ({
          text: opt.text,
          rationale: opt.rationale
        })),
        set_id: `premium_${storySummary.topic.toLowerCase()}`,
        set_number: storySummary.topicId,
        set_type: question.type,
        set_order: index + 1
      }
    }));

    // 5. Bulk insert questions
    const BATCH_SIZE = 25; // Insert in batches to avoid size limits
    for (let i = 0; i < questionsToInsert.length; i += BATCH_SIZE) {
      const batch = questionsToInsert.slice(i, i + BATCH_SIZE);
      const { error: questionError } = await supabase
        .from('questions')
        .insert(batch);

      if (questionError) {
        throw new Error(`Failed to insert questions batch ${i + 1}: ${questionError.message}`);
      }

      console.log(`📝 Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} questions`);
    }

    console.log(`✅ Successfully uploaded "${storySummary.title}": ${questions.length} questions`);
    
  } catch (error) {
    console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error);
    throw error;
  }
}

async function verifyDatabaseState(): Promise<void> {
  console.log('\n🔍 Verifying database state...');
  
  try {
    // Check passages
    const { data: passages, error: passagesError } = await supabase
      .from('passages')
      .select('id, title, difficulty, ai_generated')
      .order('created_at', { ascending: false })
      .limit(20);

    if (passagesError) {
      throw new Error(`Failed to fetch passages: ${passagesError.message}`);
    }

    console.log(`📚 Total passages in database: ${passages?.length || 0}`);
    passages?.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title} (${p.difficulty}) ${p.ai_generated ? '🤖' : '👤'}`);
    });

    // Check questions count
    const { count: totalQuestions, error: questionsCountError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (questionsCountError) {
      throw new Error(`Failed to count questions: ${questionsCountError.message}`);
    }

    console.log(`❓ Total questions in database: ${totalQuestions || 0}`);

    // Test the JOIN query that getReadingQuestions() uses
    const { data: joinTest, error: joinError } = await supabase
      .from('questions')
      .select(`
        id,
        question_text,
        passages:passage_id (
          id,
          title,
          content
        )
      `)
      .eq('type', 'reading-comprehension')
      .not('passages.id', 'is', null)
      .limit(5);

    if (joinError) {
      console.warn(`⚠️  JOIN query test failed: ${joinError.message}`);
    } else {
      console.log(`🔗 JOIN query test successful: ${joinTest?.length || 0} results`);
      joinTest?.forEach((q: any, i) => {
        console.log(`  ${i + 1}. Question: "${q.question_text?.substring(0, 50)}..." → Passage: "${q.passages?.title}"`);
      });
    }

  } catch (error) {
    console.error('❌ Database verification failed:', error);
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting bulk upload of all AI-generated stories...');
  console.log(`📁 Scanning: ${path.join(__dirname, 'output')}`);
  
  try {
    // Get all TypeScript story files
    const outputDir = path.join(__dirname, 'output');
    const storyFiles = fs.readdirSync(outputDir)
      .filter(file => file.endsWith('ReadingQuestions.ts'))
      .map(file => path.join(outputDir, file));

    console.log(`📋 Found ${storyFiles.length} story files:`);
    storyFiles.forEach((file, i) => {
      console.log(`  ${i + 1}. ${path.basename(file)}`);
    });

    if (storyFiles.length === 0) {
      console.log('⚠️  No story files found to upload');
      return;
    }

    // Verify database connection
    await verifyDatabaseState();

    console.log('\n🎯 Starting uploads...\n');

    // Upload each story
    let successCount = 0;
    let errorCount = 0;

    for (const file of storyFiles) {
      try {
        await uploadSingleStory(file);
        successCount++;
        console.log(''); // Add spacing between stories
      } catch (error) {
        errorCount++;
        console.error(`💥 Error uploading ${path.basename(file)}: ${error}`);
      }
    }

    console.log('\n📊 UPLOAD SUMMARY:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📚 Total: ${storyFiles.length}`);

    // Final verification
    await verifyDatabaseState();

    if (successCount === storyFiles.length) {
      console.log('\n🎉 All stories uploaded successfully! Database is now the single source of truth.');
    } else {
      console.log('\n⚠️  Some uploads failed. Please check the errors above.');
    }

  } catch (error) {
    console.error('💥 Fatal error in bulk upload:', error);
    process.exit(1);
  }
}

// Run the upload
main().catch(console.error);