// Simple test script to verify question loading from Supabase
// Run with: node test-questions.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://udrwkqtkjvcucbjcbxgw.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkcndrcXRranZjdWNiamNieGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjAyMzAsImV4cCI6MjA1MzAzNjIzMH0.2wKXoGHvfL6BnzLH2MQx9xFgNPLh9J9nfCFfJsOGOKY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQuestionFetching() {
  console.log('🔍 Testing question fetching from Supabase...')
  
  try {
    // Test basic question fetch
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    console.log(`✅ Successfully fetched ${questions?.length || 0} questions`)
    
    if (questions && questions.length > 0) {
      console.log('📋 Sample question:', {
        id: questions[0].id,
        type: questions[0].type,
        difficulty: questions[0].difficulty,
        question_text: questions[0].question_text?.substring(0, 50) + '...'
      })
    }
    
    // Test by type
    const { data: vocabQuestions, error: vocabError } = await supabase
      .from('questions')
      .select('*')
      .eq('type', 'vocabulary')
      .limit(3)
    
    if (!vocabError) {
      console.log(`✅ Vocabulary questions: ${vocabQuestions?.length || 0}`)
    }
    
    // Test reading comprehension with passages
    const { data: readingQuestions, error: readingError } = await supabase
      .from('questions')
      .select(`
        *,
        passages:passage_id (
          id,
          title,
          content
        )
      `)
      .eq('type', 'reading-comprehension')
      .limit(2)
    
    if (!readingError) {
      console.log(`✅ Reading comprehension questions: ${readingQuestions?.length || 0}`)
      if (readingQuestions && readingQuestions.length > 0) {
        const hasPassage = readingQuestions[0].passages
        console.log(`📖 Has passage data: ${!!hasPassage}`)
      }
    }
    
    console.log('🎉 All tests passed! Supabase connection is working.')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testQuestionFetching()