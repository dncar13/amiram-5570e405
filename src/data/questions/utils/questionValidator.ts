
import { Question } from "../../types/questionTypes";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateQuestion(question: Question): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic structure validation
  if (!question.id) errors.push("Question missing ID");
  if (!question.text || question.text.length < 10) {
    errors.push("Question text too short (minimum 10 characters)");
  }
  
  // Options validation
  if (!question.options || question.options.length !== 4) {
    errors.push("Question must have exactly 4 options");
  } else {
    question.options.forEach((option, index) => {
      if (!option || option.length < 2) {
        errors.push(`Option ${index + 1} too short`);
      }
    });
  }
  
  // Correct answer validation
  if (question.correctAnswer < 0 || question.correctAnswer > 3) {
    errors.push("Correct answer must be between 0-3");
  }
  
  // Explanation validation
  if (!question.explanation || question.explanation.length < 20) {
    warnings.push("Explanation should be more detailed");
  }
  
  // Reading comprehension specific validation
  if (question.type === 'reading-comprehension') {
    if (!question.passageText && !question.passageId) {
      errors.push("Reading comprehension question must have passage text or passage ID");
    }
  }
  
  // Difficulty validation
  if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push("Invalid difficulty level");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateQuestionBank(questions: Question[]): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  questions.forEach((question, index) => {
    const validation = validateQuestion(question);
    
    validation.errors.forEach(error => {
      allErrors.push(`Question ${index + 1} (ID: ${question.id}): ${error}`);
    });
    
    validation.warnings.forEach(warning => {
      allWarnings.push(`Question ${index + 1} (ID: ${question.id}): ${warning}`);
    });
  });
  
  // Check for duplicate IDs
  const ids = questions.map(q => q.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    allErrors.push(`Duplicate question IDs found: ${duplicateIds.join(', ')}`);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}
