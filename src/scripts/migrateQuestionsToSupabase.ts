import { supabase } from '@/integrations/supabase/client';
import { allQuestions } from '@/data/questions/index';

/**
 * Script to migrate all questions from code to Supabase database
 * Run this once to populate the questions table
 */
export const migrateQuestionsToSupabase = async () => {
  console.log('🚀 Starting migration of questions to Supabase...');
  console.log(`📊 Total questions to migrate: ${allQuestions.length}`);

  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize);
    
    try {
      const questionsData = batch.map(question => ({
        question_text: question.text,
        answer_options: question.options,
        correct_answer: question.correctAnswer.toString(),
        explanation: question.explanation || null,
        type: question.type,
        difficulty: question.difficulty,
        topic_id: question.topicId || null,
        subtopic_id: question.subtopicId || null,
        passage_title: question.passageTitle || null,
        passage_content: question.passageText || question.passage || null,
        line_numbers: question.lineNumbers || false,
        image_url: question.image || null
      }));

      const { data, error } = await supabase
        .from('questions')
        .insert(questionsData);

      if (error) {
        console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully migrated batch ${Math.floor(i / batchSize) + 1} (${batch.length} questions)`);
        successCount += batch.length;
      }
    } catch (error) {
      console.error(`❌ Unexpected error in batch ${Math.floor(i / batchSize) + 1}:`, error);
      errorCount += batch.length;
    }
  }

  console.log('🏁 Migration completed!');
  console.log(`✅ Successfully migrated: ${successCount} questions`);
  console.log(`❌ Failed to migrate: ${errorCount} questions`);
  
  return { successCount, errorCount };
};

// Development utility - call this from browser console
(window as any).migrateQuestions = migrateQuestionsToSupabase;