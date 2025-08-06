import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function verifyDistribution() {
  console.log('📊 VERIFYING ANSWER DISTRIBUTION ACROSS ALL STORIES\n');
  
  try {
    // Get all questions with their passage information
    const { data: questions, error } = await supabase
      .from('questions')
      .select(`
        id,
        correct_answer,
        difficulty,
        passage_id,
        passages:passage_id (
          id,
          title,
          difficulty
        )
      `)
      .eq('type', 'reading-comprehension')
      .not('passages.id', 'is', null);

    if (error) throw error;

    console.log(`✅ Found ${questions?.length} questions across all stories\n`);

    // Overall distribution
    const overallStats = [0, 0, 0, 0];
    questions?.forEach(q => {
      const correctIndex = parseInt(q.correct_answer);
      if (correctIndex >= 0 && correctIndex <= 3) {
        overallStats[correctIndex]++;
      }
    });

    const total = questions?.length || 0;

    console.log('🌍 OVERALL DISTRIBUTION:');
    overallStats.forEach((count, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      const percentage = Math.round(count / total * 100);
      const bar = '█'.repeat(Math.round(percentage / 2));
      console.log(`   Option ${letter}: ${count.toString().padStart(3)} questions (${percentage.toString().padStart(2)}%) ${bar}`);
    });

    // Calculate balance metrics
    const maxPercentage = Math.max(...overallStats) / total * 100;
    const minPercentage = Math.min(...overallStats) / total * 100;
    const balance = maxPercentage - minPercentage;
    
    console.log(`\n📏 BALANCE METRICS:`);
    console.log(`   Range: ${Math.round(minPercentage)}% - ${Math.round(maxPercentage)}%`);
    console.log(`   Difference: ${Math.round(balance)}%`);
    
    if (balance < 10) {
      console.log(`   ✅ EXCELLENT: Very well balanced distribution!`);
    } else if (balance < 20) {
      console.log(`   ✅ GOOD: Well balanced distribution`);
    } else if (balance < 30) {
      console.log(`   ⚠️  FAIR: Moderately balanced`);
    } else {
      console.log(`   ❌ POOR: Unbalanced distribution`);
    }

    // Distribution by difficulty
    console.log('\n🎯 DISTRIBUTION BY DIFFICULTY:');
    const difficulties = ['easy', 'medium', 'hard'];
    
    difficulties.forEach(diff => {
      const diffQuestions = questions?.filter(q => 
        (q.passages as any)?.difficulty === diff || q.difficulty === diff
      ) || [];
      
      const diffStats = [0, 0, 0, 0];
      diffQuestions.forEach(q => {
        const correctIndex = parseInt(q.correct_answer);
        if (correctIndex >= 0 && correctIndex <= 3) {
          diffStats[correctIndex]++;
        }
      });

      const diffTotal = diffQuestions.length;
      if (diffTotal > 0) {
        console.log(`\n   📚 ${diff.toUpperCase()} (${diffTotal} questions):`);
        diffStats.forEach((count, i) => {
          const letter = ['A', 'B', 'C', 'D'][i];
          const percentage = Math.round(count / diffTotal * 100);
          console.log(`      Option ${letter}: ${count.toString().padStart(2)} (${percentage.toString().padStart(2)}%)`);
        });
      }
    });

    // Distribution by story
    console.log('\n📖 DISTRIBUTION BY STORY:');
    const storyGroups = questions?.reduce((acc: any, q) => {
      const title = (q.passages as any)?.title || 'Unknown';
      const passageId = q.passage_id;
      
      if (!acc[passageId]) {
        acc[passageId] = {
          title,
          questions: [],
          stats: [0, 0, 0, 0]
        };
      }
      
      acc[passageId].questions.push(q);
      const correctIndex = parseInt(q.correct_answer);
      if (correctIndex >= 0 && correctIndex <= 3) {
        acc[passageId].stats[correctIndex]++;
      }
      
      return acc;
    }, {});

    // Show stories with concerning distributions
    const storyEntries = Object.entries(storyGroups || {});
    const concerningStories = storyEntries.filter(([_, story]: any) => {
      const total = story.questions.length;
      const maxCount = Math.max(...story.stats);
      return (maxCount / total) > 0.5; // More than 50% in one option
    });

    if (concerningStories.length > 0) {
      console.log(`\n⚠️  STORIES WITH UNBALANCED DISTRIBUTION (${concerningStories.length}):`);
      concerningStories.forEach(([passageId, story]: any) => {
        console.log(`   "${story.title}"`);
        story.stats.forEach((count: number, i: number) => {
          const letter = ['A', 'B', 'C', 'D'][i];
          const percentage = Math.round(count / story.questions.length * 100);
          if (percentage > 40) {
            console.log(`      Option ${letter}: ${count} (${percentage}%) ⚠️`);
          } else {
            console.log(`      Option ${letter}: ${count} (${percentage}%)`);
          }
        });
        console.log('');
      });
    } else {
      console.log(`\n✅ ALL STORIES HAVE BALANCED DISTRIBUTIONS!`);
    }

    // Expected vs Actual
    const expectedPerOption = total / 4;
    console.log(`\n🎲 IDEAL DISTRIBUTION ANALYSIS:`);
    console.log(`   Expected per option: ~${Math.round(expectedPerOption)} questions (25%)`);
    console.log(`   Actual distribution:`);
    
    overallStats.forEach((count, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      const percentage = Math.round(count / total * 100);
      const deviation = count - expectedPerOption;
      const deviationSign = deviation > 0 ? '+' : '';
      console.log(`      Option ${letter}: ${count} (${percentage}%) [${deviationSign}${Math.round(deviation)}]`);
    });

    console.log('\n🎉 VERIFICATION COMPLETE!');
    
    if (balance < 15 && concerningStories.length === 0) {
      console.log('   🌟 PERFECT: Distribution is excellent across all metrics!');
    } else if (balance < 20) {
      console.log('   ✅ GOOD: Distribution is well-balanced overall');
    } else {
      console.log('   ⚠️  NEEDS IMPROVEMENT: Some imbalances detected');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyDistribution().catch(console.error);