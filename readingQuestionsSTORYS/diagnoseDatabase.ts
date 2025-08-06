import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function diagnoseDatabase() {
  console.log('🔍 DATABASE DIAGNOSIS STARTING...\n');
  
  try {
    // 1. Check passages table structure
    console.log('1️⃣ CHECKING PASSAGES TABLE:');
    const { data: passages, error: passagesError } = await supabase
      .from('passages')
      .select('id, title, difficulty')
      .order('created_at', { ascending: false });

    if (passagesError) {
      console.error('❌ Passages error:', passagesError);
    } else {
      console.log(`✅ Found ${passages?.length || 0} passages:`);
      passages?.forEach((p, i) => {
        console.log(`   ${i + 1}. "${p.title}" (${p.difficulty})`);
      });
    }

    // 2. Check questions table 
    console.log('\n2️⃣ CHECKING QUESTIONS TABLE:');
    const { count: totalQuestions, error: questionsCountError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (questionsCountError) {
      console.error('❌ Questions count error:', questionsCountError);
    } else {
      console.log(`✅ Total questions: ${totalQuestions || 0}`);
    }

    // 3. Check reading comprehension questions specifically
    console.log('\n3️⃣ CHECKING READING COMPREHENSION QUESTIONS:');
    const { data: readingQuestions, error: readingError } = await supabase
      .from('questions')
      .select('id, question_text, type, passage_id')
      .eq('type', 'reading-comprehension')
      .limit(10);

    if (readingError) {
      console.error('❌ Reading questions error:', readingError);
    } else {
      console.log(`✅ Found ${readingQuestions?.length || 0} reading comprehension questions`);
      readingQuestions?.slice(0, 3).forEach((q, i) => {
        console.log(`   ${i + 1}. "${q.question_text?.substring(0, 50)}..." (passage_id: ${q.passage_id})`);
      });
    }

    // 4. Test the JOIN query that getReadingQuestions() uses
    console.log('\n4️⃣ TESTING JOIN QUERY (like getReadingQuestions):');
    const { data: joinResults, error: joinError } = await supabase
      .from('questions')
      .select(`
        id,
        question_text,
        type,
        difficulty,
        passage_id,
        passages:passage_id (
          id,
          title,
          content
        )
      `)
      .eq('type', 'reading-comprehension')
      .limit(5);

    if (joinError) {
      console.error('❌ JOIN query error:', joinError);
    } else {
      console.log(`✅ JOIN query successful: ${joinResults?.length || 0} results`);
      joinResults?.forEach((q: any, i) => {
        console.log(`   ${i + 1}. Question: "${q.question_text?.substring(0, 30)}..."`);
        console.log(`       → Passage: "${q.passages?.title || 'NO TITLE'}"`);
      });
    }

    // 5. Check unique passage-question relationships
    console.log('\n5️⃣ CHECKING PASSAGE-QUESTION RELATIONSHIPS:');
    const { data: relationships, error: relError } = await supabase
      .from('questions')
      .select(`
        passage_id,
        passages:passage_id (
          title
        )
      `)
      .eq('type', 'reading-comprehension')
      .not('passage_id', 'is', null);

    if (relError) {
      console.error('❌ Relationship check error:', relError);
    } else {
      // Group by passage
      const passageGroups = (relationships || []).reduce((acc: any, item: any) => {
        const passageTitle = item.passages?.title || 'Unknown';
        if (!acc[passageTitle]) {
          acc[passageTitle] = 0;
        }
        acc[passageTitle]++;
        return acc;
      }, {});

      console.log(`✅ Unique stories with questions:`);
      Object.entries(passageGroups).forEach(([title, count], i) => {
        console.log(`   ${i + 1}. "${title}": ${count} questions`);
      });
      console.log(`📊 TOTAL UNIQUE STORIES: ${Object.keys(passageGroups).length}`);
    }

    // 6. Simulate getReadingQuestions() call
    console.log('\n6️⃣ SIMULATING getReadingQuestions() CALL:');
    let query = supabase
      .from('questions')
      .select(`
        *,
        passages:passage_id (
          id,
          title,
          content
        )
      `)
      .eq('type', 'reading-comprehension')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: simulatedResults, error: simError } = await query;

    if (simError) {
      console.error('❌ Simulated query error:', simError);
    } else {
      const questionsWithPassages = simulatedResults?.filter(q => q.passages) || [];
      console.log(`✅ Simulated getReadingQuestions() result:`);
      console.log(`   Total questions: ${simulatedResults?.length || 0}`);
      console.log(`   Questions with passages: ${questionsWithPassages.length}`);
      
      // Group by passage title
      const storyGroups = questionsWithPassages.reduce((acc: any, item: any) => {
        const title = item.passages?.title || 'Unknown';
        if (!acc[title]) acc[title] = [];
        acc[title].push(item);
        return acc;
      }, {});

      console.log(`   Unique stories: ${Object.keys(storyGroups).length}`);
      Object.entries(storyGroups).slice(0, 5).forEach(([title, questions]: [string, any], i) => {
        console.log(`     ${i + 1}. "${title}": ${questions.length} questions`);
      });
    }

  } catch (error) {
    console.error('💥 Diagnosis failed:', error);
  }
}

diagnoseDatabase().catch(console.error);