require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

async function checkDifficultyValues() {
  console.log('🔍 Checking valid difficulty values...')
  
  const testValues = ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced']
  
  for (const value of testValues) {
    try {
      const { data: testData, error: testError } = await supabase
        .from('question_sets')
        .insert([{
          name: "Test Set",
          type: "test",
          difficulty: value,
          question_count: 1,
          metadata: {}
        }])
        .select()
      
      if (!testError) {
        console.log(`✅ "${value}" is valid for difficulty`)
        
        // Clean up test record
        await supabase
          .from('question_sets')
          .delete()
          .eq('name', 'Test Set')
        
        break
      } else {
        console.log(`❌ "${value}" is invalid:`, testError.message)
      }
    } catch (e) {
      console.log(`❌ "${value}" failed:`, e.message)
    }
  }
}

checkDifficultyValues()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error)
    process.exit(1)
  })