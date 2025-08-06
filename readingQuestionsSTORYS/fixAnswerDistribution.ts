import { createClient } from '@supabase/supabase-js';
import { shuffle } from 'lodash-es';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// IDs of the 14 passage rows we want to fix
const PASSAGE_IDS = [
  'e30175e4-061b-4608-b736-a518c83e1115',
  '5cf12333-249f-4494-b7a1-52ec8a5df2e8',
  '459c9c1f-eae4-46ac-bbea-2665007724d8',
  'ab215023-c56b-402a-918c-4ff74fc2f1d6',
  '40b8c794-9ec1-48f0-8c35-b32a158fb771',
  'ff83d302-fbd6-4a02-9250-b70858f2bf7a',
  '0f84d69e-7587-4bc5-9e8b-9f142400fc4b',
  '0aa7fc35-0095-4b45-bcbc-6ccf815eea87',
  'b0bb9c63-8a44-4130-8a73-62b45f715434',
  '085ab3db-5e78-40b9-935b-5cd54ef2e1fa',
  '304bce86-1046-4c77-8924-b258c64c2d47',
  '282caac1-6a5b-4582-ab23-3d452bde2c30',
  '393b30b3-23b4-4e77-9040-9d960ca0fffa',
  '2ebc18a1-4458-4b4d-8fc5-4d8de8b8fc3d'
];

interface Question {
  id: string;
  answer_options: string | string[];
  correct_answer: string;
  explanation: string;
}

function shuffleQuestionOptions(question: Question) {
  try {
    // Parse answer_options if it's a string
    const opts = typeof question.answer_options === 'string' 
      ? JSON.parse(question.answer_options) 
      : question.answer_options;
    
    if (!Array.isArray(opts) || opts.length !== 4) {
      console.warn(`⚠️  Question ${question.id}: Invalid options format`);
      return null;
    }

    const correctIndex = parseInt(question.correct_answer);
    if (correctIndex < 0 || correctIndex > 3) {
      console.warn(`⚠️  Question ${question.id}: Invalid correct_answer index: ${correctIndex}`);
      return null;
    }

    const correctText = opts[correctIndex];
    
    // Fisher-Yates shuffle
    const shuffled = shuffle([...opts]);
    const newCorrectIndex = shuffled.indexOf(correctText);
    
    // Update explanation if it mentions "Option A/B/C/D"
    const optionLetters = ['A', 'B', 'C', 'D'];
    const newLetter = optionLetters[newCorrectIndex];
    
    let updatedExplanation = question.explanation;
    
    // Replace any mentions of "Option A", "Option B", etc. with the new correct option
    updatedExplanation = updatedExplanation.replace(
      /Option [ABCD]/g, 
      `Option ${newLetter}`
    );
    
    // Also handle variations like "option A", "(A)", "choice A", etc.
    updatedExplanation = updatedExplanation
      .replace(/option [ABCD]/g, `option ${newLetter}`)
      .replace(/choice [ABCD]/g, `choice ${newLetter}`)
      .replace(/answer [ABCD]/g, `answer ${newLetter}`)
      .replace(/\([ABCD]\)/g, `(${newLetter})`);

    return {
      id: question.id,
      answer_options: JSON.stringify(shuffled),
      correct_answer: newCorrectIndex.toString(),
      explanation: updatedExplanation
    };

  } catch (error) {
    console.error(`❌ Error processing question ${question.id}:`, error);
    return null;
  }
}

async function getDistributionStats() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('correct_answer')
    .in('passage_id', PASSAGE_IDS);

  if (error) throw error;

  const stats = [0, 0, 0, 0];
  questions?.forEach(q => {
    const correctIndex = parseInt(q.correct_answer);
    if (correctIndex >= 0 && correctIndex <= 3) {
      stats[correctIndex]++;
    }
  });

  return { stats, total: questions?.length || 0 };
}

async function run() {
  console.log('🎯 Starting bulk answer distribution fix...\n');
  
  try {
    // Get current distribution
    console.log('📊 BEFORE - Current distribution:');
    const beforeStats = await getDistributionStats();
    beforeStats.stats.forEach((count, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      const percentage = Math.round(count / beforeStats.total * 100);
      console.log(`   Option ${letter}: ${count} questions (${percentage}%)`);
    });

    // Fetch all questions from the 14 passages
    console.log('\n🔍 Fetching questions to fix...');
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, answer_options, correct_answer, explanation')
      .in('passage_id', PASSAGE_IDS);

    if (error) throw error;

    console.log(`Found ${questions?.length} questions to process`);

    // Process questions in batches
    const updates: any[] = [];
    let processedCount = 0;
    let skippedCount = 0;

    questions?.forEach((question: Question) => {
      const shuffled = shuffleQuestionOptions(question);
      if (shuffled) {
        updates.push(shuffled);
        processedCount++;
      } else {
        skippedCount++;
      }
    });

    console.log(`\n📝 Processing results:`);
    console.log(`   ✅ Questions to update: ${processedCount}`);
    console.log(`   ⏭️  Questions skipped: ${skippedCount}`);

    // Batch update (100 rows per chunk) - use individual updates instead of upsert
    console.log('\n🚀 Applying updates to database...');
    const BATCH_SIZE = 50; // Smaller batches for individual updates
    let updatedTotal = 0;

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      
      // Process each update individually to avoid constraint issues
      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            answer_options: update.answer_options,
            correct_answer: update.correct_answer,
            explanation: update.explanation
          })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`❌ Error updating question ${update.id}:`, updateError);
        } else {
          updatedTotal++;
        }
      }
      
      console.log(`   ✅ Updated batch: ${batch.length} questions (${updatedTotal} total)`);
    }

    // Get final distribution
    console.log('\n📊 AFTER - New distribution:');
    const afterStats = await getDistributionStats();
    afterStats.stats.forEach((count, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      const percentage = Math.round(count / afterStats.total * 100);
      console.log(`   Option ${letter}: ${count} questions (${percentage}%)`);
    });

    // Calculate improvement
    const beforeA = beforeStats.stats[0] / beforeStats.total * 100;
    const afterA = afterStats.stats[0] / afterStats.total * 100;
    const improvement = beforeA - afterA;

    console.log('\n🎉 DISTRIBUTION FIX COMPLETE!');
    console.log(`   📉 Option A reduced from ${Math.round(beforeA)}% to ${Math.round(afterA)}% (-${Math.round(improvement)}%)`);
    console.log(`   🎲 Answers now distributed across all options`);
    console.log(`   📝 Updated ${updatedTotal} questions successfully`);

    // Check if distribution is reasonably balanced
    const maxPercentage = Math.max(...afterStats.stats) / afterStats.total * 100;
    const minPercentage = Math.min(...afterStats.stats) / afterStats.total * 100;
    const balance = maxPercentage - minPercentage;

    if (balance < 15) {
      console.log('   ✅ Distribution is well balanced!');
    } else {
      console.log(`   ⚠️  Distribution still uneven (${Math.round(balance)}% difference)`);
    }

  } catch (error) {
    console.error('💥 Error during bulk fix:', error);
    throw error;
  }
}

run().catch(console.error);