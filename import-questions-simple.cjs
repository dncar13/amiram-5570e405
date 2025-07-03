const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// הגדרות Supabase
const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Extract questions from TypeScript files
function extractQuestionsFromTS(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find the array content between [ and ];
    const arrayRegex = /\[[\s\S]*?\];?$/m;
    const exportDefaultRegex = /export default (questions|\[[\s\S]*?\]);?$/m;
    const exportConstRegex = /export const \w+: \w+\[\] = (\[[\s\S]*?\]);?$/m;
    
    let arrayContent = '';
    
    // Try to find array content
    if (content.includes('export default questions')) {
      // Find const questions = [...]
      const constRegex = /const questions: \w+\[\] = (\[[\s\S]*?\]);/m;
      const match = content.match(constRegex);
      if (match) {
        arrayContent = match[1];
      }
    } else if (content.includes('export const')) {
      // Find export const varName = [...]
      const match = content.match(exportConstRegex);
      if (match) {
        arrayContent = match[1];
      }
    } else if (content.includes('export default [')) {
      // Find export default [...]
      const match = content.match(exportDefaultRegex);
      if (match) {
        arrayContent = match[1];
      }
    }
    
    if (!arrayContent) {
      console.warn(`⚠️  No array found in ${filePath}`);
      return [];
    }
    
    // Clean up the array content
    arrayContent = arrayContent.trim();
    if (arrayContent.endsWith(';')) {
      arrayContent = arrayContent.slice(0, -1);
    }
    
    // Use eval to parse the array (safe since we control the input)
    const questions = eval(arrayContent);
    
    if (Array.isArray(questions)) {
      console.log(`✅ Extracted ${questions.length} questions from ${path.basename(filePath)}`);
      return questions;
    } else {
      console.warn(`⚠️  Not an array in ${filePath}`);
      return [];
    }
    
  } catch (error) {
    console.error(`❌ Error extracting from ${filePath}:`, error.message);
    return [];
  }
}

// Main import function
async function main() {
  try {
    console.log('🚀 Starting complete questions import...');
    
    // Define all file paths
    const questionFiles = [
      // Restatement questions
      './questions-for-lovable/restatement/easy/restatement-easy-2025-06-11.ts',
      './questions-for-lovable/restatement/medium/restatement-medium-2025-06-11.ts',
      './questions-for-lovable/restatement/hard/restatement-hard-2025-06-11.ts',
      
      // Sentence completion questions
      './questions-for-lovable/sentence-completion/easy/sentence-completion-easy-2025-06-11.ts',
      './questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11.ts',
      './questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11.ts',
      
      // Vocabulary questions
      './questions-for-lovable/vocabulary/easy/vocabulary-easy-2025-06-11.ts',
      './questions-for-lovable/vocabulary/medium/vocabulary-medium-2025-06-11.ts',
      './questions-for-lovable/vocabulary/hard/vocabulary-hard-2025-06-11.ts',
      
      // Reading comprehension questions
      './src/data/questions/by-type/gigEconomyReadingQuestions.ts',
      './src/data/questions/by-type/mediumTechnologyReadingQuestions.ts',
      './src/data/questions/by-type/mediumEnvironmentReadingQuestions.ts',
      './src/data/questions/by-type/readingComprehensionAdvancedQuestions.ts'
    ];
    
    // Load all questions
    const allQuestions = [];
    
    for (const filePath of questionFiles) {
      console.log(`📂 Loading: ${path.basename(filePath)}`);
      const questions = extractQuestionsFromTS(filePath);
      allQuestions.push(...questions);
    }

    console.log(`\n📊 Total questions loaded: ${allQuestions.length}`);
    
    // Show breakdown by type
    const breakdown = allQuestions.reduce((acc, q) => {
      const key = `${q.type || 'unknown'} (${q.difficulty || 'unknown'})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📋 Questions breakdown:');
    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} questions`);
    });
    
    // Import to Supabase
    if (allQuestions.length > 0) {
      await importQuestions(allQuestions);
    } else {
      console.error('❌ No questions found to import!');
    }
    
  } catch (error) {
    console.error('❌ Error in main function:', error);
  }
}

// Import function
async function importQuestions(questionsArray) {
  console.log(`\n🔄 Starting import of ${questionsArray.length} questions...`);
  
  // Validate questions
  const validQuestions = questionsArray.filter(q => {
    const isValid = q.id && q.type && q.text && q.options && q.correctAnswer !== undefined;
    if (!isValid) {
      console.warn(`⚠️  Invalid question: ${q.id || 'no-id'}`);
    }
    return isValid;
  });
  
  console.log(`✅ Valid questions: ${validQuestions.length}/${questionsArray.length}`);
  
  if (validQuestions.length === 0) {
    console.error('❌ No valid questions to import!');
    return;
  }
  
  // Transform questions for Supabase
  const transformedQuestions = validQuestions.map(q => ({
    original_id: q.id.toString(),
    type: q.type,
    text: q.text,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation || null,
    difficulty: q.difficulty || 'medium',
    passage_text: q.passageText || null,
    passage_title: q.passageTitle || null,
    topic_id: q.topicId || null,
    tags: q.tags || null,
    metadata: q.metadata || null
  }));

  // Import in chunks
  const chunkSize = 50;
  let imported = 0;
  let failed = 0;
  
  for (let i = 0; i < transformedQuestions.length; i += chunkSize) {
    const chunk = transformedQuestions.slice(i, i + chunkSize);
    const chunkNumber = Math.floor(i / chunkSize) + 1;
    const totalChunks = Math.ceil(transformedQuestions.length / chunkSize);
    
    console.log(`📦 Processing chunk ${chunkNumber}/${totalChunks} (${chunk.length} questions)...`);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(chunk);
      
      if (error) {
        console.error(`❌ Error in chunk ${chunkNumber}:`, error.message);
        failed += chunk.length;
        
        // Try individual imports
        console.log(`🔄 Trying individual imports for chunk ${chunkNumber}...`);
        for (const question of chunk) {
          try {
            const { error: singleError } = await supabase
              .from('questions')
              .insert([question]);
            
            if (singleError) {
              console.error(`❌ Failed ${question.original_id}:`, singleError.message);
            } else {
              imported++;
              failed--;
            }
          } catch (singleErr) {
            console.error(`❌ Exception ${question.original_id}:`, singleErr.message);
          }
        }
      } else {
        imported += chunk.length;
        console.log(`✅ Chunk ${chunkNumber} imported successfully`);
      }
    } catch (chunkError) {
      console.error(`❌ Exception in chunk ${chunkNumber}:`, chunkError.message);
      failed += chunk.length;
    }
    
    console.log(`📈 Progress: ${imported} imported, ${failed} failed`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 Import completed!`);
  console.log(`✅ Successfully imported: ${imported} questions`);
  console.log(`❌ Failed to import: ${failed} questions`);
  console.log(`📊 Success rate: ${((imported / transformedQuestions.length) * 100).toFixed(1)}%`);
}

// Verification function
async function verifyImport() {
  console.log('\n🔍 Verifying import...');
  
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('type, difficulty')
      .order('type');
    
    if (error) {
      console.error('❌ Error verifying:', error.message);
      return;
    }
    
    console.log(`📊 Total questions in database: ${data.length}`);
    
    const breakdown = data.reduce((acc, q) => {
      const key = `${q.type} (${q.difficulty})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📋 Database breakdown:');
    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} questions`);
    });
    
  } catch (error) {
    console.error('❌ Error in verification:', error.message);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => verifyImport())
    .catch(console.error);
}