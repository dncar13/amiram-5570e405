import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\nMissing required environment variables!');
  console.error('Please ensure your .env file contains:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  
  // Try with anon key as fallback
  if (supabaseUrl && supabaseAnonKey) {
    console.log('\nFound anon key, attempting to use that instead...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    diagnoseQuestions(supabase).then(() => {
      console.log('\n✅ Diagnosis complete!');
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
}

const supabase = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey) : 
  null;

async function diagnoseQuestions(supabaseClient = supabase) {
  if (!supabaseClient) {
    console.error('No Supabase client available');
    return;
  }
  console.log('🔍 Starting question diagnosis...\n');

  try {
    // 1. Check for questions with invalid options format
    console.log('1️⃣ Checking for questions with invalid options format...');
    const { data: invalidOptions, error: error1 } = await supabaseClient

      .from('questions')
      .select('id, original_id, type, text, options')
      .or('options.is.null,not.options.cs.[]');

    if (error1) {
      console.error('Error checking invalid options:', error1);
    } else {
      console.log(`Found ${invalidOptions?.length || 0} questions with potentially invalid options`);
      if (invalidOptions && invalidOptions.length > 0) {
        console.log('Sample invalid options:', invalidOptions.slice(0, 3));
      }
    }

    // 2. Check reading comprehension questions without passage text
    console.log('\n2️⃣ Checking reading comprehension questions without passage text...');
    const { data: missingPassages, error: error2 } = await supabaseClient
      .from('questions')
      .select('id, original_id, text, passage_text')
      .eq('type', 'reading-comprehension')
      .or('passage_text.is.null,passage_text.eq.');

    if (error2) {
      console.error('Error checking missing passages:', error2);
    } else {
      console.log(`Found ${missingPassages?.length || 0} reading comprehension questions without passage text`);
      if (missingPassages && missingPassages.length > 0) {
        console.log('Questions missing passages:', missingPassages.map(q => ({
          id: q.id,
          original_id: q.original_id,
          text: q.text.substring(0, 50) + '...'
        })));
      }
    }

    // 3. Check for questions with empty options arrays
    console.log('\n3️⃣ Checking for questions with empty options arrays...');
    const { data: allQuestions, error: error3 } = await supabaseClient
      .from('questions')
      .select('id, original_id, type, options, correct_answer');

    if (error3) {
      console.error('Error fetching all questions:', error3);
    } else {
      const emptyOptions = allQuestions?.filter(q => {
        try {
          return Array.isArray(q.options) && q.options.length === 0;
        } catch {
          return false;
        }
      }) || [];

      console.log(`Found ${emptyOptions.length} questions with empty options arrays`);
      if (emptyOptions.length > 0) {
        console.log('Sample questions with empty options:', emptyOptions.slice(0, 3));
      }
    }

    // 4. Check for questions with correct_answer out of bounds
    console.log('\n4️⃣ Checking for questions with out-of-bounds correct_answer index...');
    const outOfBoundsAnswers = allQuestions?.filter(q => {
      try {
        if (!Array.isArray(q.options)) return false;
        const correctIndex = q.correct_answer;
        return typeof correctIndex === 'number' && 
               (correctIndex < 0 || correctIndex >= q.options.length);
      } catch {
        return false;
      }
    }) || [];

    console.log(`Found ${outOfBoundsAnswers.length} questions with out-of-bounds correct answer`);
    if (outOfBoundsAnswers.length > 0) {
      console.log('Sample questions with invalid correct_answer:', outOfBoundsAnswers.slice(0, 3).map(q => ({
        id: q.id,
        options_length: q.options.length,
        correct_answer: q.correct_answer
      })));
    }

    // 5. Check passage text lengths for reading comprehension
    console.log('\n5️⃣ Analyzing passage text lengths for reading comprehension questions...');
    const { data: rcQuestions, error: error5 } = await supabaseClient
      .from('questions')
      .select('id, original_id, passage_text')
      .eq('type', 'reading-comprehension')
      .not('passage_text', 'is', null);

    if (error5) {
      console.error('Error fetching reading comprehension questions:', error5);
    } else if (rcQuestions) {
      const passageLengths = rcQuestions.map(q => ({
        id: q.id,
        length: q.passage_text?.length || 0
      }));

      const shortPassages = passageLengths.filter(p => p.length < 100);
      const avgLength = passageLengths.reduce((sum, p) => sum + p.length, 0) / passageLengths.length;

      console.log(`Total reading comprehension questions: ${rcQuestions.length}`);
      console.log(`Average passage length: ${Math.round(avgLength)} characters`);
      console.log(`Questions with short passages (<100 chars): ${shortPassages.length}`);
      
      if (shortPassages.length > 0) {
        console.log('Questions with suspiciously short passages:', shortPassages);
      }
    }

    // 6. Summary statistics
    console.log('\n📊 Summary Statistics:');
    const { count: totalCount } = await supabaseClient
      .from('questions')
      .select('*', { count: 'exact', head: true });

    const { count: activeCount } = await supabaseClient
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    console.log(`Total questions in database: ${totalCount}`);
    console.log(`Active questions: ${activeCount}`);

    // 7. Check question type distribution
    console.log('\n📈 Question type distribution:');
    const { data: typeDistribution } = await supabaseClient
      .from('questions')
      .select('type')
      .eq('is_active', true);

    if (typeDistribution) {
      const typeCounts = typeDistribution.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
      }, {});

      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

  } catch (error) {
    console.error('Unexpected error during diagnosis:', error);
  }
}

// Run the diagnosis
if (supabase) {
  diagnoseQuestions().then(() => {
    console.log('\n✅ Diagnosis complete!');
    process.exit(0);
  }).catch(error => {
    console.error('Diagnosis failed:', error);
    process.exit(1);
  });
}