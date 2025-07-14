import { describe, it, expect } from 'vitest'
import { 
  getVocabularyQuestions,
  getSentenceCompletionQuestions,
  getRestatementQuestions,
  getReadingQuestions
} from '@/services/supabaseQuestionsService'

describe('Question Services', () => {
  it('should fetch vocabulary questions', async () => {
    const questions = await getVocabularyQuestions()
    expect(Array.isArray(questions)).toBe(true)
    console.log(`Fetched ${questions.length} vocabulary questions`)
  }, 10000) // 10 second timeout for DB calls

  it('should fetch sentence completion questions', async () => {
    const questions = await getSentenceCompletionQuestions()
    expect(Array.isArray(questions)).toBe(true)
    console.log(`Fetched ${questions.length} sentence completion questions`)
  }, 10000)

  it('should fetch restatement questions', async () => {
    const questions = await getRestatementQuestions()
    expect(Array.isArray(questions)).toBe(true)
    console.log(`Fetched ${questions.length} restatement questions`)
  }, 10000)

  it('should fetch reading comprehension questions', async () => {
    console.log('🔍 Testing reading comprehension questions...')
    const questions = await getReadingQuestions()
    
    expect(Array.isArray(questions)).toBe(true)
    console.log(`📖 Fetched ${questions.length} reading comprehension questions`)
    
    if (questions.length > 0) {
      const sample = questions[0]
      console.log('📋 Sample question:', {
        id: sample.id,
        type: sample.type,
        difficulty: sample.difficulty,
        hasPassageText: !!sample.passageText,
        hasPassageTitle: !!sample.passageTitle,
        questionPreview: sample.text?.substring(0, 80) + '...'
      })
      
      // Check that reading comprehension questions have passage data
      const questionsWithPassages = questions.filter(q => q.passageText && q.passageTitle)
      console.log(`📚 Questions with passages: ${questionsWithPassages.length}/${questions.length}`)
      
      expect(questionsWithPassages.length).toBeGreaterThan(0)
    }
  }, 15000)

  it('should have proper question structure', async () => {
    const questions = await getVocabularyQuestions()
    if (questions.length > 0) {
      const question = questions[0]
      expect(typeof question.id).toBe('number')
      expect(typeof question.text).toBe('string')
      expect(Array.isArray(question.options)).toBe(true)
      expect(typeof question.correctAnswer).toBe('number')
      expect(typeof question.type).toBe('string')
      expect(typeof question.difficulty).toBe('string')
    }
  }, 10000)
})