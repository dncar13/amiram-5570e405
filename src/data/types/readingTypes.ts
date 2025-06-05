// ========== FILE 1: types/readingTypes.ts ==========
export interface ReadingPassage {
  id: number;
  title: string;
  topic: string; // e.g., "Gig Economy"
  generalSubject: "Technology" | "Economics" | "Engineering" | "Health" | "Society" | "Education" | "Environment" | "History" | "Psychology" | "Ethics";
  text: string;
  wordCount: number;
  estimatedReadingTime: number; // in minutes
  lines?: string[]; // Optional: text split by lines for accurate line references
}

export interface ReadingComprehensionQuestion {
  id: number;
  passageId: number;
  type: "reading-comprehension";
  questionSubtype: "main-idea" | "detail" | "inference" | "vocabulary-in-context" | "sentence-completion";
  text: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  passageLineRange?: { from: number; to: number };
  tags?: string[]; // Optional: specific tags from a controlled list
  metadata?: {
    createdAt?: string;
    estimatedTime?: number; // in minutes for individual question
  };
}
