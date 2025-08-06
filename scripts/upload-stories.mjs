#!/usr/bin/env node

/**
 * Script to upload all existing reading stories to Supabase
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadStory(filePath) {
  try {
    console.log(`📖 Processing: ${path.basename(filePath)}`);
    
    // Dynamically import the TypeScript file
    const storyModule = await import(filePath);
    
    const passage = storyModule.passage;
    const questions = storyModule.questions;
    const storySummary = storyModule.storySummary;
    
    if (!passage || !questions || !storySummary) {
      console.log(`⚠️  Skipping ${path.basename(filePath)} - missing data`);
      return;
    }
    
    console.log(`   📝 Title: "${storySummary.title}"`);
    console.log(`   📊 Difficulty: ${storySummary.difficulty}`);
    console.log(`   🔢 Questions: ${questions.length}`);
    
    // Step 1: Insert passage
    const { data: passageData, error: passageError } = await supabase
      .from('passages')
      .insert({
        title: storySummary.title,
        content: passage,
        difficulty: storySummary.difficulty,
        topic_id: storySummary.topicId || null,
        word_count: storySummary.wordCount || passage.split(/\s+/).length,
        estimated_time: storySummary.estimatedTime || 3
      })
      .select()
      .single();
    
    if (passageError) {
      console.error(`   ❌ Failed to insert passage: ${passageError.message}`);
      return;
    }
    
    console.log(`   ✅ Passage inserted with ID: ${passageData.id}`);
    
    // Step 2: Insert questions
    const questionsToInsert = questions.map((q, index) => ({
      question_text: q.text,
      answer_options: q.options.map(opt => opt.text),
      correct_answer: q.correctAnswer,
      difficulty: q.difficulty,
      type: 'reading-comprehension',
      explanation: q.explanation,
      passage_id: passageData.id,
      question_number: index + 1,
      tags: q.tags || [],
      is_premium: true, // Mark all as premium for now
      metadata: {
        hint: q.hint,
        paragraphReference: q.paragraphReference,
        skills: q.skills,
        questionId: q.questionId,
        ...q.metadata
      }
    }));
    
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();
    
    if (questionsError) {
      console.error(`   ❌ Failed to insert questions: ${questionsError.message}`);
      return;
    }
    
    console.log(`   ✅ ${questionsData.length} questions inserted successfully`);
    console.log('');
    
  } catch (error) {
    console.error(`   ❌ Error processing ${path.basename(filePath)}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting upload of reading stories to Supabase...\n');
  
  const storiesDir = path.join(__dirname, '..', 'readingQuestionsSTORYS', 'output');
  
  if (!fs.existsSync(storiesDir)) {
    console.error('❌ Stories directory not found:', storiesDir);
    process.exit(1);
  }
  
  const storyFiles = fs.readdirSync(storiesDir)
    .filter(file => file.endsWith('ReadingQuestions.ts'))
    .map(file => path.join(storiesDir, file));
  
  console.log(`📚 Found ${storyFiles.length} story files to upload:\n`);
  
  for (const filePath of storyFiles) {
    await uploadStory(filePath);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 Upload process completed!');
}

main().catch(console.error);
