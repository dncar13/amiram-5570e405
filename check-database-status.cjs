// check-database-status.cjs - Check if database is ready for the generator
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabaseStatus() {
  console.log('🔍 Database Status Check');
  console.log('='.repeat(50));
  
  try {
    // Check if stable_id column exists
    console.log('📋 Checking questions table schema...');
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, stable_id, topic_id')
      .limit(1);
    
    if (questionsError) {
      if (questionsError.message.includes('stable_id')) {
        console.log('❌ stable_id column missing - database migration needed');
        return { ready: false, issue: 'missing_stable_id' };
      }
      if (questionsError.message.includes('topic_id')) {
        console.log('❌ topic_id column missing - database migration needed');
        return { ready: false, issue: 'missing_topic_id' };
      }
      console.log('❌ Database error:', questionsError.message);
      return { ready: false, issue: 'database_error' };
    }
    
    console.log('✅ Questions table schema is ready');
    
    // Check if listening topics exist (11-14)
    console.log('📋 Checking listening topics...');
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, title')
      .in('id', [11, 12, 13, 14]);
    
    if (topicsError) {
      console.log('⚠️ Topics table issue:', topicsError.message);
    } else {
      console.log(`📊 Found ${topics.length}/4 listening topics`);
      if (topics.length < 4) {
        console.log('⚠️ Missing listening topics - some may need to be added');
        console.log('   Expected: IDs 11, 12, 13, 14');
        console.log('   Found:', topics.map(t => `${t.id}: ${t.title}`));
      } else {
        console.log('✅ All listening topics present');
      }
    }
    
    // Check current questions count
    console.log('📋 Checking current questions...');
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact' });
    
    if (!countError) {
      console.log(`📊 Current questions in database: ${count}`);
    }
    
    // Check recent AI-generated questions
    const { data: recentQuestions, error: recentError } = await supabase
      .from('questions')
      .select('id, stable_id, type, created_at, topic_id, ai_generated')
      .eq('ai_generated', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!recentError && recentQuestions) {
      console.log(`\n📈 Recent AI-generated questions: ${recentQuestions.length}`);
      recentQuestions.forEach(q => {
        console.log(`   • ${q.stable_id} (${q.type}) - Topic: ${q.topic_id} - ${new Date(q.created_at).toLocaleString()}`);
      });
    }
    
    return { 
      ready: true, 
      questionsCount: count, 
      recentQuestions: recentQuestions?.length || 0,
      listeningTopics: topics?.length || 0
    };
    
  } catch (error) {
    console.log('❌ Database check failed:', error.message);
    return { ready: false, issue: 'connection_error', error: error.message };
  }
}

if (require.main === module) {
  checkDatabaseStatus().then((status) => {
    console.log('\n' + '='.repeat(50));
    if (status.ready) {
      console.log('🎉 Database is ready for question generation!');
      console.log(`📊 Status: ${status.questionsCount} total questions, ${status.recentQuestions} recent AI-generated`);
    } else {
      console.log('❌ Database needs setup before generating questions');
      console.log('📋 Issue:', status.issue);
      if (status.error) {
        console.log('🔍 Details:', status.error);
      }
    }
  });
}

module.exports = { checkDatabaseStatus };
