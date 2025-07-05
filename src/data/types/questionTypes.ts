
import { LucideIcon } from 'lucide-react';

// Define Question type for the application - updated to match new structure
export interface Question {
  id: number;
  type: 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'comprehensive' | 'vocabulary' | 'grammar' | 'writing' | 'listening';
  text: string; // Main question text field
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Optional fields for different question types
  topicId?: number;
  categoryId?: number;
  subtopicId?: number;
  passageText?: string;
  passageTitle?: string;
  // Database field names (snake_case) - for Supabase compatibility
  passage_text?: string;
  passage_title?: string;
  lineNumbers?: boolean;
  passageWithLines?: PassageLine[];
  tips?: string;
  setNumber?: number; // Add setNumber property
  passage?: string; // Add passage property
  story?: string; // Add story property
  
  // Additional optional metadata
  tags?: string[];
  createdAt?: string;
  metadata?: {
    topic?: string;
    wordCount?: number;
    estimatedTime?: number;
  };
  
  // Legacy fields for backward compatibility
  image?: string;
  explanationImage?: string;
  explanationVideo?: string;
  answers?: string[];
  flagged?: boolean;
  verified?: boolean;
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
