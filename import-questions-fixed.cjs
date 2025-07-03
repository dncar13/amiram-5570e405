const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// הגדרות Supabase
const supabaseUrl = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to read and parse TypeScript files
function readTSFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove TypeScript import statements and extract the array
    const cleanContent = content
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '') // Remove imports
      .replace(/export\s+default\s+/, '') // Remove export default
      .replace(/const\s+\w+:\s*\w+\[\]\s*=\s*/, '') // Remove const declaration with type
      .replace(/;?\s*$/, ''); // Remove trailing semicolon and whitespace
    
    // Parse the JSON array
    const questions = JSON.parse(cleanContent);
    console.log(`✅ Loaded ${questions.length} questions from ${path.basename(filePath)}`);
    return questions;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Import function
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
      
      // Reading comprehension questions from existing files
      './src/data/questions/by-type/readingComprehensionQuestions.ts',
      './src/data/questions/by-type/readingComprehensionAdvancedQuestions.ts',
      './src/data/questions/by-type/mediumTechnologyReadingQuestions.ts',
      './src/data/questions/by-type/mediumEnvironmentReadingQuestions.ts',
      './src/data/questions/by-type/gigEconomyReadingQuestions.ts'
    ];
    
    // Load all questions
    const allQuestions = [];
    const fileStats = {};
    
    for (const filePath of questionFiles) {
      const questions = readTSFile(filePath);
      allQuestions.push(...questions);
      
      // Track stats per file
      const fileName = path.basename(filePath, '.ts');
      fileStats[fileName] = questions.length;
      
      if (questions.length > 0 && questions[0].type) {
        console.log(`  📂 ${fileName}: ${questions.length} ${questions[0].type} questions`);
      }
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
    console.error('Make sure all required files exist and are properly formatted');
  }
}

// Import function with enhanced error handling
async function importQuestions(questionsArray) {
  console.log(`\n🔄 Starting import of ${questionsArray.length} questions...`);
  
  // Validate questions before import
  const validQuestions = questionsArray.filter(q => {
    if (!q.id || !q.type || !q.text || !q.options || q.correctAnswer === undefined) {
      console.warn(`⚠️  Skipping invalid question: ${q.id || 'no-id'}`);
      console.warn(`   Missing: ${!q.id ? 'id ' : ''}${!q.type ? 'type ' : ''}${!q.text ? 'text ' : ''}${!q.options ? 'options ' : ''}${q.correctAnswer === undefined ? 'correctAnswer' : ''}`);
      return false;
    }
    return true;
  });
  
  console.log(`✅ Valid questions: ${validQuestions.length}/${questionsArray.length}`);
  
  if (validQuestions.length === 0) {
    console.error('❌ No valid questions to import!');
    return;
  }
  
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

  // Import in chunks of 50 questions (smaller chunks for better reliability)
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
        console.error(`❌ Error importing chunk ${chunkNumber}:`, error.message);
        failed += chunk.length;
        
        // Try importing questions one by one in this chunk
        console.log(`🔄 Attempting individual import for chunk ${chunkNumber}...`);
        for (const question of chunk) {
          try {
            const { error: singleError } = await supabase
              .from('questions')
              .insert([question]);
            
            if (singleError) {
              console.error(`❌ Failed to import question ${question.original_id}:`, singleError.message);
            } else {
              imported++;
              failed--;
            }
          } catch (singleErr) {
            console.error(`❌ Exception importing question ${question.original_id}:`, singleErr.message);
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
    
    // Progress update
    console.log(`📈 Progress: ${imported} imported, ${failed} failed, ${imported + failed}/${transformedQuestions.length} processed`);
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 Import completed!`);
  console.log(`✅ Successfully imported: ${imported} questions`);
  console.log(`❌ Failed to import: ${failed} questions`);
  console.log(`📊 Success rate: ${((imported / transformedQuestions.length) * 100).toFixed(1)}%`);
  
  return { imported, failed, total: transformedQuestions.length };
}

// Database verification function
async function verifyImport() {
  console.log('\n🔍 Verifying import...');
  
  try {
    // Count total questions
    const { data: countData, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting questions:', countError.message);
      return;
    }
    
    console.log(`📊 Total questions in database: ${countData.length}`);
    
    // Count by type
    const { data: typeData, error: typeError } = await supabase
      .from('questions')
      .select('type, difficulty')
      .order('type');
    
    if (typeError) {
      console.error('❌ Error fetching question types:', typeError.message);
      return;
    }
    
    const typeBreakdown = typeData.reduce((acc, q) => {
      const key = `${q.type} (${q.difficulty})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📋 Database breakdown:');
    Object.entries(typeBreakdown).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} questions`);
    });
    
  } catch (error) {
    console.error('❌ Error in verification:', error.message);
  }
}

// Run the import with verification
if (require.main === module) {
  main()
    .then(() => verifyImport())
    .catch(console.error);
}

module.exports = { importQuestions, main, verifyImport };