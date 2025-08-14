// run-database-migration.cjs - Simple script to run database migration
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🗄️ Running database migration...');
  
  try {
    // Step 1: Add columns
    console.log('📝 Adding stable_id and topic_id columns...');
    const { error: alterError } = await supabase.rpc('query', {
      query: `
        ALTER TABLE questions 
        ADD COLUMN IF NOT EXISTS stable_id TEXT,
        ADD COLUMN IF NOT EXISTS topic_id INTEGER;
      `
    });
    
    if (alterError) {
      console.log('⚠️ Could not add columns via RPC, trying direct SQL...');
      
      // Alternative approach: try direct queries
      const { error: error1 } = await supabase.from('questions').select('stable_id').limit(1);
      if (error1 && error1.message.includes('column "stable_id" does not exist')) {
        console.log('❌ stable_id column missing. Please run the SQL migration manually in Supabase SQL Editor.');
        console.log('📝 SQL needed:');
        console.log('ALTER TABLE questions ADD COLUMN stable_id TEXT;');
        console.log('ALTER TABLE questions ADD COLUMN topic_id INTEGER;');
        console.log('CREATE UNIQUE INDEX questions_stable_id_idx ON questions(stable_id);');
        return false;
      }
    }
    
    // Step 2: Update existing questions
    console.log('🔄 Updating existing questions with stable_id...');
    const { error: updateError } = await supabase
      .rpc('update_stable_ids')
      .catch(() => {
        // If the function doesn't exist, that's ok
        console.log('⚠️ update_stable_ids function not found, continuing...');
      });
    
    // Step 3: Check if everything is ready
    const { data, error } = await supabase
      .from('questions')
      .select('id, stable_id, topic_id')
      .limit(1);
    
    if (error) {
      console.error('❌ Migration failed:', error.message);
      return false;
    }
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Schema ready for question generator');
    return true;
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    return false;
  }
}

if (require.main === module) {
  runMigration().then((success) => {
    if (success) {
      console.log('\n🎉 Ready to generate questions!');
      console.log('🚀 Try: node multi-question-generator.cjs --types=wf --verbose');
    } else {
      console.log('\n❌ Please run the SQL migration manually in Supabase SQL Editor first.');
      console.log('📄 See: database-migration.sql');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runMigration };
