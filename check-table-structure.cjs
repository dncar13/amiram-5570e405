// check-table-structure.cjs - Check the exact structure of questions table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkTablesStructure() {
  console.log('🔍 Checking Table Structure for Question Generator');
  console.log('='.repeat(50));
  
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL, 
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Check questions table structure
    console.log('📊 Questions table - Current structure:');
    const { data: sampleQuestion, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .limit(1)
      .single();
    
    if (sampleQuestion) {
      console.log('✅ Questions table columns:');
      Object.keys(sampleQuestion).forEach(col => {
        const value = sampleQuestion[col];
        const type = typeof value;
        console.log(`   • ${col}: ${type} ${value ? `(example: ${JSON.stringify(value).slice(0, 50)}...)` : '(null)'}`);
      });
      
      // Check specifically for our needed columns
      const hasStableId = sampleQuestion.hasOwnProperty('stable_id');
      const hasTopicId = sampleQuestion.hasOwnProperty('topic_id');
      const hasAiGenerated = sampleQuestion.hasOwnProperty('ai_generated');
      
      console.log('\n🎯 Required columns status:');
      console.log(`   ${hasStableId ? '✅' : '❌'} stable_id: ${hasStableId ? 'EXISTS' : 'MISSING'}`);
      console.log(`   ${hasTopicId ? '✅' : '❌'} topic_id: ${hasTopicId ? 'EXISTS' : 'MISSING'}`);
      console.log(`   ${hasAiGenerated ? '✅' : '❌'} ai_generated: ${hasAiGenerated ? 'EXISTS' : 'MISSING'}`);
      
      if (!hasStableId || !hasTopicId) {
        console.log('\n📋 REQUIRED ACTION: Run SQL migration in Supabase');
      }
    }
    
    // Check categories table
    console.log('\n📊 Categories table:');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, description')
      .order('id');
    
    if (!catError && categories) {
      console.log('✅ Available categories:');
      categories.forEach(cat => {
        console.log(`   • ${cat.id}: ${cat.name} - ${cat.description || 'No description'}`);
      });
      
      const hasListeningCategory = categories.some(cat => cat.id === 4);
      console.log(`\n🎯 Listening category (id=4): ${hasListeningCategory ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    // Check topics table
    console.log('\n📊 Topics table:');
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, title, category_id')
      .order('id');
    
    if (!topicsError && topics) {
      console.log(`✅ Found ${topics.length} topics:`);
      
      // Show all topics
      topics.forEach(topic => {
        console.log(`   • ${topic.id}: ${topic.title} (category: ${topic.category_id})`);
      });
      
      // Check for listening topics (11-14)
      const listeningTopics = topics.filter(t => [11, 12, 13, 14].includes(t.id));
      console.log(`\n🎯 Listening topics (11-14): ${listeningTopics.length}/4 exist`);
      if (listeningTopics.length > 0) {
        listeningTopics.forEach(topic => {
          console.log(`   ✅ ${topic.id}: ${topic.title}`);
        });
      }
      
      if (listeningTopics.length < 4) {
        console.log('   ❌ Some listening topics missing - will be created by migration');
      }
    }
    
    // Count current questions
    console.log('\n📊 Current questions count:');
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact' });
    
    if (!countError) {
      console.log(`📈 Total questions in database: ${count}`);
    }
    
    return {
      hasStableId: sampleQuestion?.hasOwnProperty('stable_id'),
      hasTopicId: sampleQuestion?.hasOwnProperty('topic_id'),
      categoriesCount: categories?.length || 0,
      topicsCount: topics?.length || 0,
      questionsCount: count || 0
    };
    
  } catch (error) {
    console.log('❌ Error checking table structure:', error.message);
    return null;
  }
}

if (require.main === module) {
  checkTablesStructure().then((result) => {
    if (result) {
      console.log('\n' + '='.repeat(50));
      if (result.hasStableId && result.hasTopicId) {
        console.log('🎉 Database structure is ready!');
      } else {
        console.log('⚠️ Database migration needed');
        console.log('📋 Copy and run the SQL from supabase-migration.sql');
      }
    }
  });
}

module.exports = { checkTablesStructure };
