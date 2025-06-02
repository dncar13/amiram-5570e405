import { LucideIcon } from 'lucide-react';

// Define Question type for the application - updated to match new structure
export interface Question {
  id: number;
  type: 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'comprehensive';
  question?: string; // New field, optional for backward compatibility
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt?: string; // Made optional
  metadata?: {
    topic?: string;
    wordCount?: number;
    estimatedTime?: number;
  }; // Made optional
  
  // Legacy fields for backward compatibility - keeping text as main field
  text: string; // Main question text field
  topicId?: number;
  categoryId?: number;
  subtopicId?: number;
  image?: string;
  explanationImage?: string;
  explanationVideo?: string;
  passageText?: string;
  answers?: string[];
  flagged?: boolean;
  verified?: boolean;
  tips?: string;
  passageTitle?: string;
  lineNumbers?: boolean;
  passageWithLines?: PassageLine[];
  questionType?: 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'comprehensive';
}

// New interface for numbered lines
export interface PassageLine {
  lineNumber: number;
  startLine: number;
  endLine: number;
  text: string;
}

// Interface for complete reading passage
export interface ReadingPassage {
  id: number;
  title: string;
  content: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lineCount: number;
  questions: number[];
}

// New structure for question sets with metadata
export interface QuestionSet {
  metadata: {
    generated: string;
    type: string;
    difficulty: string;
    count: number;
    topic: string;
    tags: string[];
    model: string;
  };
  questions: Question[];
}
