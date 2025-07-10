/**
 * Question Validation Utilities
 * 
 * Provides comprehensive validation for question data
 * to catch issues early and prevent display problems
 */

import { Question } from '@/data/types/questionTypes';

export interface ValidationError {
  questionId: number | string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates a single question object
 */
export function validateQuestion(question: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Basic structure validation
  if (!question) {
    errors.push({
      questionId: 'unknown',
      field: 'question',
      message: 'Question object is null or undefined',
      severity: 'error'
    });
    return { isValid: false, errors, warnings };
  }

  const questionId = question.id || question.original_id || 'unknown';

  // Validate required fields
  if (!question.text || typeof question.text !== 'string') {
    errors.push({
      questionId,
      field: 'text',
      message: 'Question text is missing or invalid',
      severity: 'error'
    });
  }

  if (!question.type || typeof question.type !== 'string') {
    errors.push({
      questionId,
      field: 'type',
      message: 'Question type is missing or invalid',
      severity: 'error'
    });
  }

  // Validate options array
  if (!Array.isArray(question.options)) {
    errors.push({
      questionId,
      field: 'options',
      message: `Options is not an array (type: ${typeof question.options})`,
      severity: 'error'
    });
  } else if (question.options.length === 0) {
    errors.push({
      questionId,
      field: 'options',
      message: 'Options array is empty',
      severity: 'error'
    });
  } else if (question.options.some(opt => typeof opt !== 'string' || opt.trim() === '')) {
    errors.push({
      questionId,
      field: 'options',
      message: 'Options array contains invalid entries',
      severity: 'error'
    });
  }

  // Validate correct answer index
  if (typeof question.correct_answer !== 'number' && typeof question.correctAnswer !== 'number') {
    errors.push({
      questionId,
      field: 'correct_answer',
      message: 'Correct answer index is missing or not a number',
      severity: 'error'
    });
  } else {
    const correctIndex = question.correct_answer ?? question.correctAnswer;
    const optionsLength = Array.isArray(question.options) ? question.options.length : 0;
    
    if (correctIndex < 0 || correctIndex >= optionsLength) {
      errors.push({
        questionId,
        field: 'correct_answer',
        message: `Correct answer index (${correctIndex}) is out of bounds (0-${optionsLength - 1})`,
        severity: 'error'
      });
    }
  }

  // Validate reading comprehension specific fields
  if (question.type === 'reading-comprehension') {
    const hasPassageText = !!(question.passage_text || question.passageText);
    
    if (!hasPassageText) {
      errors.push({
        questionId,
        field: 'passage_text',
        message: 'Reading comprehension question missing passage text',
        severity: 'error'
      });
    } else {
      const passageText = question.passage_text || question.passageText;
      if (passageText.length < 50) {
        warnings.push({
          questionId,
          field: 'passage_text',
          message: `Passage text seems too short (${passageText.length} characters)`,
          severity: 'warning'
        });
      }
    }
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'];
  if (question.difficulty && !validDifficulties.includes(question.difficulty)) {
    warnings.push({
      questionId,
      field: 'difficulty',
      message: `Invalid difficulty level: ${question.difficulty}`,
      severity: 'warning'
    });
  }

  // Check for suspicious patterns
  if (question.options && Array.isArray(question.options)) {
    const duplicateOptions = question.options.filter((opt, idx) => 
      question.options.indexOf(opt) !== idx
    );
    
    if (duplicateOptions.length > 0) {
      warnings.push({
        questionId,
        field: 'options',
        message: `Duplicate options found: ${duplicateOptions.join(', ')}`,
        severity: 'warning'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates an array of questions and returns a summary
 */
export function validateQuestionBatch(questions: any[]): {
  totalQuestions: number;
  validQuestions: number;
  invalidQuestions: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  invalidQuestionIds: (string | number)[];
} {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];
  const invalidQuestionIds: (string | number)[] = [];
  let validCount = 0;

  questions.forEach(question => {
    const result = validateQuestion(question);
    
    if (result.isValid) {
      validCount++;
    } else {
      const id = question.id || question.original_id || 'unknown';
      invalidQuestionIds.push(id);
    }

    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    totalQuestions: questions.length,
    validQuestions: validCount,
    invalidQuestions: questions.length - validCount,
    errors: allErrors,
    warnings: allWarnings,
    invalidQuestionIds
  };
}

/**
 * Attempts to fix common question data issues
 */
export function sanitizeQuestion(question: any): any {
  const sanitized = { ...question };

  // Fix options if it's a string that looks like JSON
  if (typeof sanitized.options === 'string') {
    try {
      const parsed = JSON.parse(sanitized.options);
      if (Array.isArray(parsed)) {
        sanitized.options = parsed;
      }
    } catch (e) {
      console.error(`Failed to parse options for question ${sanitized.id}:`, e);
      sanitized.options = [];
    }
  }

  // Ensure options is an array
  if (!Array.isArray(sanitized.options)) {
    sanitized.options = [];
  }

  // Ensure passage text is available in both formats
  if (sanitized.passage_text && !sanitized.passageText) {
    sanitized.passageText = sanitized.passage_text;
  } else if (sanitized.passageText && !sanitized.passage_text) {
    sanitized.passage_text = sanitized.passageText;
  }

  // Ensure passage title is available in both formats
  if (sanitized.passage_title && !sanitized.passageTitle) {
    sanitized.passageTitle = sanitized.passage_title;
  } else if (sanitized.passageTitle && !sanitized.passage_title) {
    sanitized.passage_title = sanitized.passageTitle;
  }

  // Normalize difficulty values
  const difficultyMap: Record<string, string> = {
    'beginner': 'easy',
    'intermediate': 'medium',
    'advanced': 'hard'
  };
  
  if (sanitized.difficulty && difficultyMap[sanitized.difficulty]) {
    sanitized.difficulty = difficultyMap[sanitized.difficulty];
  }

  return sanitized;
}