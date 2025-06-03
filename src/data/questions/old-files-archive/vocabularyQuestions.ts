import { Question } from '../../types/questionTypes';

/**
 * שאלות אוצר מילים (Vocabulary) - נוצר על ידי AI
 * השאלות מתרכזות בהבנת משמעות מילים, שימושים בהקשר ונרדפות
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
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium',
    tips: "Look for context clues in the sentence that hint at the word's meaning. The phrase 'navigate through difficult times' suggests a practical approach."
  },
  {
    id: 202,
    type: 'vocabulary',
    text: `The word "meticulous" in the context "She was meticulous in her research, checking every detail twice" most closely means:`,
    options: [
      "Careless and hasty",
      "Very careful and precise",
      "Creative and innovative", 
      "Efficient and fast"
    ],
    correctAnswer: 1,
    explanation: "Meticulous means showing great attention to detail; very careful and precise.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy',
    tips: "The phrase 'checking every detail twice' is a strong context clue that points to careful, precise behavior."
  },
  {
    id: 203,
    type: 'vocabulary',
    text: `Which word best completes the sentence: "The scientist's _______ theories were initially rejected but later proved to be groundbreaking."`,
    options: [
      "conventional",
      "obsolete", 
      "innovative",
      "simple"
    ],
    correctAnswer: 2,
    explanation: "The context suggests theories that were initially rejected but later proved valuable, which points to 'innovative' - introducing new ideas.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium',
    tips: "Pay attention to the contrast between 'initially rejected' and 'later proved to be groundbreaking' to find the appropriate word."
  },
  {
    id: 204,
    type: 'vocabulary',
    text: `The word "ubiquitous" means:`,
    options: [
      "Extremely rare and valuable",
      "Present everywhere at the same time",
      "Difficult to understand",
      "Happening very quickly"
    ],
    correctAnswer: 1,
    explanation: "Ubiquitous means present, appearing, or found everywhere; omnipresent.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'hard',
    tips: "This is a direct vocabulary question. The prefix 'ubi-' relates to 'everywhere' (like in 'Uber' - everywhere transportation)."
  },
  {
    id: 205,
    type: 'vocabulary',
    text: `In academic writing, to "synthesize" information means to:`,
    options: [
      "Copy information exactly as written",
      "Combine different sources into a coherent whole",
      "Reject all previous research",
      "Translate information into another language"
    ],
    correctAnswer: 1,
    explanation: "To synthesize means to combine different elements or ideas to form a connected whole, especially in academic or research contexts.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium',
    tips: "Think about the root 'synth-' which relates to combining or putting together, like in 'synthesizer' (combines sounds)."
  }
];

export default vocabularyQuestions;
