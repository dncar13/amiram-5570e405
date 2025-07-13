require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

async function checkEnumValues() {
  console.log('🔍 Checking database constraints...')
  
  // Check the table structure
  const { data, error } = await supabase
    .from('passages')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Error querying passages table:', error)
    return
  }
  
  console.log('✅ Passages table accessible')
  
  // Try to get enum values through SQL
  try {
    const { data: enumData, error: enumError } = await supabase
      .rpc('sql', { 
        query: `SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'general_subject_enum')`
      })
    
    if (enumData) {
      console.log('✅ Enum values found:', enumData)
    } else {
      console.log('⚠️ No enum found, might be a text field with check constraint')
    }
  } catch (e) {
    console.log('ℹ️ Could not query enum values directly')
  }
  
  // Try common values
  const testValues = ['English', 'Mathematics', 'Science', 'History', 'Literature', 'Reading', 'Language Arts']
  
  for (const value of testValues) {
    try {
      const { data: testData, error: testError } = await supabase
        .from('passages')
        .insert([{
          original_id: 999,
          title: "Test Passage",
          content: "Test content",
          topic: "Test",
          general_subject: value,
          word_count: 10,
          estimated_reading_time: 1,
          line_count: 1,
          difficulty: "easy",
          metadata: {}
        }])
        .select()
      
      if (!testError) {
        console.log(`✅ "${value}" is valid for general_subject`)
        
        // Clean up test record
        await supabase
          .from('passages')
          .delete()
          .eq('original_id', 999)
        
        break
      } else {
        console.log(`❌ "${value}" is invalid:`, testError.message)
      }
    } catch (e) {
      console.log(`❌ "${value}" failed:`, e.message)
    }
  }
}

checkEnumValues()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error)
    process.exit(1)
  })