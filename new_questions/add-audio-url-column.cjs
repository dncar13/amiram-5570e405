// add-audio-url-column.cjs - Add audioUrl column to questions table
require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function addAudioUrlColumn() {
  console.log('🔧 Adding audioUrl column to questions table...');
  
  try {
    // Add audioUrl column if it doesn't exist
    const { data, error } = await supabase.rpc('exec', {
      query: `
        alter table public.questions
          add column if not exists "audioUrl" text;
      `
    });
    
    if (error) {
      console.log('Using direct SQL execution...');
      
      // Alternative approach using a dummy query that won't cause issues
      const { error: checkError } = await supabase
        .from('questions')
        .select('audioUrl')
        .limit(1);
      
      if (checkError && checkError.message.includes('column "audioUrl" does not exist')) {
        console.log('❌ audioUrl column does not exist and cannot be added automatically');
        console.log('📝 Please run this SQL manually in your Supabase SQL Editor:');
        console.log('');
        console.log('ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS "audioUrl" text;');
        console.log('');
        return false;
      } else if (!checkError) {
        console.log('✅ audioUrl column already exists');
        return true;
      } else {
        throw checkError;
      }
    } else {
      console.log('✅ Successfully added audioUrl column');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Check if column already exists
    try {
      const { error: testError } = await supabase
        .from('questions')
        .select('audioUrl')
        .limit(1);
      
      if (!testError) {
        console.log('✅ audioUrl column already exists');
        return true;
      }
    } catch (testErr) {
      // Column doesn't exist
    }
    
    console.log('📝 Please add the audioUrl column manually:');
    console.log('ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS "audioUrl" text;');
    return false;
  }
}

addAudioUrlColumn().then(success => {
  if (success) {
    console.log('🎉 Database schema ready for audio URLs');
    process.exit(0);
  } else {
    console.log('⚠️ Manual schema update required');
    process.exit(1);
  }
}).catch(console.error);