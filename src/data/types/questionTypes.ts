
export interface Question {
  id: number;
  type: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topicId: number;
  categoryId?: number; // Make it optional since many existing questions don't have it
  difficulty: 'easy' | 'medium' | 'hard';
  passageText?: string;
  passageTitle?: string;
  tips?: string;
  tags?: string[];
  metadata?: any;
  passageWithLines?: PassageLine[];
  
  // Additional properties used by the existing codebase
  flagged?: boolean;
  image?: string;
  explanationImage?: string;
  explanationVideo?: string;
  lineNumbers?: boolean;
  
  // Optional fields that might exist in some questions
  createdAt?: string;
  subtopicId?: number;
}

export interface PassageLine {
  lineNumber: number;
  startLine: number;
  endLine: number;
  text: string;
}

export interface QuestionMetadata {
  id: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  tags: string[];
  author: string;
  dateCreated: string;
  lastModified: string;
  validationStatus: 'draft' | 'review' | 'approved';
}

export interface ReadingPassage {
  id: number;
  title: string;
  topic: string;
  generalSubject: string;
  text: string;
  wordCount: number;
  readingLevel: string; // e.g., "grade-10", "grade-12"
}

export interface ReadingQuestion extends Question {
  passageId: number;
  questionSubtype: 'main-idea' | 'details' | 'inference' | 'vocabulary-context' | 'author-intent' | 'text-structure' | 'comparison';
  estimatedTime: number; // in minutes
  tags: string[];
  tips?: string;
}

export interface QuestionBank {
  readingComprehension: ReadingQuestion[];
  sentenceCompletion: Question[];
  restatement: Question[];
  vocabulary: Question[];
}

export interface QuestionSet {
  id: number;
  title: string;
  questions: Question[];
}
