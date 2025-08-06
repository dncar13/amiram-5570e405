import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function getPassageIds() {
  console.log('📋 Getting all passage IDs for bulk fix...\n');
  
  try {
    const { data: passages, error } = await supabase
      .from('passages')
      .select('id, title, difficulty')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`Found ${passages?.length} passages:`);
    passages?.forEach((p, i) => {
      console.log(`${i + 1}. "${p.title}" (${p.difficulty}) - ID: ${p.id}`);
    });

    console.log('\n📄 Passage IDs array for bulk fix:');
    const ids = passages?.map(p => `'${p.id}'`).join(',\n  ') || '';
    console.log(`[\n  ${ids}\n]`);

    // Quick check of current answer distribution
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('correct_answer')
      .in('passage_id', passages?.map(p => p.id) || []);

    if (qError) throw qError;

    const stats = [0, 0, 0, 0];
    questions?.forEach(q => {
      const correctIndex = parseInt(q.correct_answer);
      if (correctIndex >= 0 && correctIndex <= 3) {
        stats[correctIndex]++;
      }
    });

    console.log('\n📊 CURRENT ANSWER DISTRIBUTION:');
    console.log(`Option A: ${stats[0]} questions (${Math.round(stats[0]/questions!.length*100)}%)`);
    console.log(`Option B: ${stats[1]} questions (${Math.round(stats[1]/questions!.length*100)}%)`);
    console.log(`Option C: ${stats[2]} questions (${Math.round(stats[2]/questions!.length*100)}%)`);
    console.log(`Option D: ${stats[3]} questions (${Math.round(stats[3]/questions!.length*100)}%)`);
    console.log(`\n⚠️  Problem confirmed: ${Math.round(stats[0]/questions!.length*100)}% of answers are Option A!`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getPassageIds().catch(console.error);