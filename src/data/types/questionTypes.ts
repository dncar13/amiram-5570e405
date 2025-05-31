
// Define Question type for the application
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topicId: number;
  image?: string; // Image for the question itself
  explanationImage?: string; // Image for the explanation
  explanationVideo?: string; // Video for the explanation
  subtopicId?: number;
  categoryId?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  questionType?: 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'comprehensive';
  passageText?: string; // For reading comprehension questions - the passage to read
  answers?: string[]; // Alternative for options
  flagged?: boolean; // Whether the question is flagged
  verified?: boolean; // Whether the question is verified
  tips?: string; // Hint/tip text for the question
}
