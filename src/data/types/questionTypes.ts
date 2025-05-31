
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
  // Added properties for user questions
  answers?: string[]; // Alternative for options
  flagged?: boolean; // Whether the question is flagged
  verified?: boolean; // Whether the question is verified
}
