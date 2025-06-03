import { Question } from "../../types/questionTypes";

/**
 * שאלות מסוג Sentence Completion (השלמת משפטים)
 * כל השאלות מאוגדות בקובץ אחד עם סיווג פנימי לפי רמת קושי
 */
export const sentenceCompletionQuestions: Question[] = [
  {
    id: 4,
    type: 'sentence-completion',
    text: "The scientist's research was _______ by lack of funding, preventing her from completing the crucial experiments.",
    options: [
      "enhanced",
      "hampered",
      "accelerated",
      "ignored"
    ],
    correctAnswer: 1,
    explanation: "The word 'hampered' means hindered or obstructed, which fits the context of research being prevented due to lack of funding.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    tips: "Look for context clues. The phrase 'preventing her from completing' suggests an obstacle or hindrance."
  },
  {
    id: 5,
    type: 'sentence-completion',
    text: "Despite the _______ weather conditions, the hiking group decided to continue their journey to the summit.",
    options: [
      "favorable",
      "pleasant",
      "adverse",
      "mild"
    ],
    correctAnswer: 2,
    explanation: "The word 'despite' indicates contrast, suggesting the weather was challenging. 'Adverse' means unfavorable or hostile.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    tips: "The word 'despite' signals a contrast - look for an option that would make continuing the journey challenging."
  },
  {
    id: 6,
    type: 'sentence-completion',
    text: "The professor's lecture was so _______ that many students struggled to understand the complex theoretical concepts.",
    options: [
      "straightforward",
      "elementary",
      "esoteric",
      "simplified"
    ],
    correctAnswer: 2,
    explanation: "'Esoteric' means intended for or understood by only a particular group, often referring to specialized or difficult material.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'hard',
    tips: "The context mentions students struggling with complex concepts, indicating the lecture was difficult to understand."
  }
];
