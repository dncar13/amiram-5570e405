const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Simple Linear Congruential Generator for deterministic randomness
 */
class SeededRNG {
  constructor(seed) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32);
    return this.seed / Math.pow(2, 32);
  }
}

/**
 * Creates balanced target distribution [0,1,2,3,0,1,2,3...] and shuffles it
 */
function createBalancedTargets(count, seed = 42) {
  // Create base pattern [0,1,2,3] repeated
  const base = [0, 1, 2, 3];
  const targets = [];
  
  for (let i = 0; i < count; i++) {
    targets.push(base[i % 4]);
  }
  
  // Shuffle with deterministic seed
  const rng = new SeededRNG(seed);
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  
  return targets;
}

/**
 * Rebalances a specific group (type + difficulty)
 */
async function rebalanceGroup(type, difficulty, dryRun = true) {
  console.log(`\n🔄 ${dryRun ? '[DRY RUN] ' : ''}Processing ${type} - ${difficulty}...`);
  
  try {
    // Fetch questions ordered by ID for consistent processing
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, answer_options, correct_answer')
      .eq('type', type)
      .eq('difficulty', difficulty)
      .order('id', { ascending: true });
    
    if (error) throw error;
    if (!questions || questions.length === 0) {
      console.log(`   ⚠️ No questions found for ${type} - ${difficulty}`);
      return { processed: 0, changed: 0 };
    }
    
    console.log(`   📊 Found ${questions.length} questions`);
    
    // Check current distribution
    const currentDist = [0, 0, 0, 0];
    questions.forEach(q => {
      if (q.correct_answer >= 0 && q.correct_answer <= 3) {
        currentDist[q.correct_answer]++;
      }
    });
    
    console.log(`   📈 Current distribution: A:${currentDist[0]} B:${currentDist[1]} C:${currentDist[2]} D:${currentDist[3]}`);
    
    // Generate balanced targets
    const targets = createBalancedTargets(questions.length, 137 + type.charCodeAt(0) + difficulty.charCodeAt(0));
    const targetDist = [0, 0, 0, 0];
    targets.forEach(t => targetDist[t]++);
    
    console.log(`   🎯 Target distribution:  A:${targetDist[0]} B:${targetDist[1]} C:${targetDist[2]} D:${targetDist[3]}`);
    
    // Prepare updates
    const updates = [];
    let changedCount = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const currentAnswer = question.correct_answer;
      const targetAnswer = targets[i];
      
      if (currentAnswer !== targetAnswer) {
        // Parse answer_options based on its type
        let options;
        if (typeof question.answer_options === 'string') {
          // reading-comprehension format: JSON string
          options = JSON.parse(question.answer_options);
        } else {
          // restatement/sentence-completion format: array
          options = [...question.answer_options];
        }
        
        // Swap the correct option with target position
        [options[currentAnswer], options[targetAnswer]] = [options[targetAnswer], options[currentAnswer]];
        
        // Prepare update with correct format
        const update = {
          id: question.id,
          answer_options: typeof question.answer_options === 'string' 
            ? JSON.stringify(options) 
            : options,
          correct_answer: targetAnswer
        };
        
        updates.push(update);
        changedCount++;
        
        if (dryRun) {
          const letters = ['A', 'B', 'C', 'D'];
          const originalOptions = typeof question.answer_options === 'string' 
            ? JSON.parse(question.answer_options)
            : question.answer_options;
          console.log(`   🔄 ${question.id}: ${letters[currentAnswer]} → ${letters[targetAnswer]} | "${originalOptions[currentAnswer]?.substring(0, 50)}..." ↔ "${originalOptions[targetAnswer]?.substring(0, 50)}..."`);
        }
      }
    }
    
    if (dryRun) {
      console.log(`   ✅ Would change ${changedCount}/${questions.length} questions`);
      return { processed: questions.length, changed: changedCount };
    }
    
    // Apply updates in batches
    if (updates.length > 0) {
      console.log(`   💾 Applying ${updates.length} updates...`);
      
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            answer_options: update.answer_options,
            correct_answer: update.correct_answer
          })
          .eq('id', update.id);
        
        if (updateError) throw updateError;
        
        if ((i + 1) % 50 === 0 || i === updates.length - 1) {
          console.log(`   ✅ Updated ${i + 1}/${updates.length} questions`);
        }
      }
    }
    
    console.log(`   🎉 Successfully rebalanced ${type} - ${difficulty}: ${changedCount} changes applied`);
    return { processed: questions.length, changed: changedCount };
    
  } catch (error) {
    console.error(`   ❌ Error rebalancing ${type} - ${difficulty}:`, error.message);
    return { processed: 0, changed: 0, error: error.message };
  }
}

/**
 * Main rebalancing function
 */
async function rebalanceDatabase(dryRun = true) {
  console.log(`🚀 ${dryRun ? 'DRY RUN - ' : ''}Starting database rebalancing...`);
  console.log(`⏰ Started at: ${new Date().toLocaleString('he-IL')}\n`);
  
  // Get all unique type+difficulty combinations
  const { data: combinations, error } = await supabase
    .from('questions')
    .select('type, difficulty')
    .not('type', 'is', null)
    .not('difficulty', 'is', null);
  
  if (error) {
    console.error('❌ Failed to get combinations:', error);
    return;
  }
  
  // Get unique combinations
  const uniqueCombos = [...new Set(combinations.map(c => `${c.type}|${c.difficulty}`))];
  const groups = uniqueCombos.map(combo => {
    const [type, difficulty] = combo.split('|');
    return { type, difficulty };
  });
  
  console.log(`📋 Found ${groups.length} groups to rebalance:`);
  groups.forEach(g => console.log(`   - ${g.type} - ${g.difficulty}`));
  
  let totalProcessed = 0;
  let totalChanged = 0;
  const errors = [];
  
  // Process each group
  for (const group of groups) {
    const result = await rebalanceGroup(group.type, group.difficulty, dryRun);
    totalProcessed += result.processed;
    totalChanged += result.changed;
    
    if (result.error) {
      errors.push(`${group.type}-${group.difficulty}: ${result.error}`);
    }
    
    // Small delay to be gentle with DB
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Groups processed: ${groups.length}`);
  console.log(`   Questions processed: ${totalProcessed}`);
  console.log(`   Questions changed: ${totalChanged}`);
  console.log(`   Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors encountered:`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  
  if (dryRun) {
    console.log(`\n🔥 To apply changes, run: node rebalance-answers.cjs --apply`);
  } else {
    console.log(`\n🎉 Rebalancing completed successfully!`);
    console.log(`⏰ Completed at: ${new Date().toLocaleString('he-IL')}`);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const isApply = args.includes('--apply');
const dryRun = !isApply;

if (isApply) {
  console.log('⚠️  APPLYING CHANGES TO DATABASE!');
  console.log('This will modify your questions table.');
  setTimeout(() => {
    rebalanceDatabase(false).catch(console.error);
  }, 3000);
} else {
  console.log('🔍 Running in DRY RUN mode (no changes will be made)');
  rebalanceDatabase(true).catch(console.error);
}
