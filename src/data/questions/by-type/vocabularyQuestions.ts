import { Question } from "../../types/questionTypes";

/**
 * שאלות מסוג Vocabulary (אוצר מילים)
 * כל השאלות מאוגדות בקובץ אחד עם סיווג פנימי לפי רמת קושי
 */
export const vocabularyQuestions: Question[] = [
  {
    id: 201,
    type: 'vocabulary',
    text: `In the sentence "The CEO's pragmatic approach to business decisions helped the company navigate through difficult times," the word "pragmatic" most nearly means:`,
    options: [
      "Theoretical and idealistic",
      "Practical and realistic", 
      "Aggressive and competitive",
      "Conservative and traditional"
    ],
    correctAnswer: 1,
    explanation: "Pragmatic means dealing with things sensibly and realistically in a way that is based on practical rather than idealistic considerations.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    tips: "Look at the context - the pragmatic approach 'helped the company navigate through difficult times,' suggesting something practical and effective."
  },
  {
    id: 202,
    type: 'vocabulary',
    text: `In the sentence "The student's lackadaisical attitude toward studying resulted in poor grades," the word "lackadaisical" most nearly means:`,
    options: [
      "Enthusiastic and energetic",
      "Careless and lazy",
      "Methodical and organized", 
      "Anxious and worried"
    ],
    correctAnswer: 1,
    explanation: "Lackadaisical means lacking enthusiasm and determination; carelessly lazy.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    tips: "The context mentions poor grades as a result, which suggests a negative attitude toward studying."
  },
  {
    id: 203,
    type: 'vocabulary',
    text: `In the sentence "The politician's speech was filled with grandiloquent phrases that impressed the audience," the word "grandiloquent" most nearly means:`,
    options: [
      "Simple and direct",
      "Pompous and elaborate",
      "Quiet and subdued",
      "Honest and straightforward"
    ],
    correctAnswer: 1,
    explanation: "Grandiloquent means pompous or extravagant in language, style, or manner, especially in a way that is intended to impress.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    tips: "The fact that the phrases 'impressed the audience' suggests they were elaborate and designed to make an impression."
  },
  {
    id: 204,
    type: 'vocabulary',
    text: `In the sentence "The artist's work was considered avant-garde by critics who appreciated its innovative style," the word "avant-garde" most nearly means:`,
    options: [
      "Traditional and conventional",
      "Experimental and innovative",
      "Commercial and popular",
      "Simple and minimalist"
    ],
    correctAnswer: 1,
    explanation: "Avant-garde refers to new and experimental ideas and methods in art, music, or literature.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'hard',
    tips: "The context explicitly mentions 'innovative style,' which reinforces the meaning of avant-garde as experimental and cutting-edge."
  },
  {
    id: 205,
    type: 'vocabulary',
    text: `In the sentence "The professor's erudite lecture on classical literature demonstrated her vast knowledge," the word "erudite" most nearly means:`,
    options: [
      "Confusing and unclear",
      "Scholarly and learned",
      "Brief and concise",
      "Entertaining and humorous"
    ],
    correctAnswer: 1,
    explanation: "Erudite means having or showing great knowledge or learning.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    tips: "The phrase 'demonstrated her vast knowledge' provides a direct clue to the meaning of erudite."
  }
];
