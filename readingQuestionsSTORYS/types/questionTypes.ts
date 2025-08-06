// types/questionTypes.ts
// הגדרות הטיפוסים לכל 12 השיפורים

export interface OptionWithRationale {
  text: string;
  rationale: string;
}

export interface Question {
  // Identifiers
  questionId: string;  // Format: S{storyIndex}_Q{questionNumber}
  id?: number;        // Legacy field for backward compatibility
  topicId?: number;
  
  // Question content
  type: 'reading-comprehension' | 'multiple-choice' | 'fill-blank';
  text: string;
  aiPrompt?: string;   // The prompt used to generate this question
  
  // Answer options and explanation
  options: OptionWithRationale[];
  correctAnswer: number;  // Index of correct option (0-3)
  explanation: string;
  hint: string;
  paragraphReference: string;  // Which paragraph contains the answer
  
  // Difficulty and categorization
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyScore: number;  // Numeric score 1-5
  skills: string[];         // Skills being tested
  tags: string[];           // Additional tags for categorization
  
  // Metadata
  metadata: {
    topic: string;
    questionNumber: number;
    questionType: 'main-idea' | 'detail' | 'inference' | 'vocabulary';
    totalQuestions: number;
    wordCount: number;
    estimatedTime: number;
    aiInstruction?: string;
  };
}

export interface Passage {
  id: number;
  title: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  generalSubject: string;
  wordCount: number;
  estimatedTime: number;
}

export interface StorySummary {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  wordCount: number;
  numQuestions: number;
  estimatedTime: number;
  topicId?: number;
}

export interface StoryFile {
  version: string;  // "draft-placeholders" or "final-ai-filled"
  storySummary: StorySummary;
  passage: Passage | string;
  questions: Question[];
}

// Legacy types for backward compatibility
export interface LegacyOption {
  text: string;
}

export interface LegacyQuestion extends Omit<Question, 'options' | 'questionId' | 'aiPrompt' | 'hint' | 'paragraphReference' | 'difficultyScore' | 'skills'> {
  id: number;
  options: string[] | LegacyOption[];
}