
import { Question } from '../../types/questionTypes';

// Sentence completion questions - medium difficulty
const mediumQuestions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "The documentary was so ____ that several viewers left the theater early.",
    "options": [
      "tender",
      "tactical",
      "tedious",
      "timid"
    ],
    "correctAnswer": 2,
    "explanation": "'Tedious' means boring or monotonous, which explains why people would leave a theater early.",
    "difficulty": "medium",
    "id": 2040
  },
  {
    "type": "sentence-completion",
    "text": "Despite the team's ____ efforts, they couldn't score in the final minutes.",
    "options": [
      "valiant",
      "vague",
      "vacant",
      "vain"
    ],
    "correctAnswer": 0,
    "explanation": "'Valiant' means brave or determined, fitting the context of a team trying hard until the end.",
    "difficulty": "medium",
    "id": 2041
  },
  {
    "type": "sentence-completion",
    "text": "The politician's ____ remarks caused immediate controversy in the media.",
    "options": [
      "informal",
      "inflated",
      "influential",
      "inflammatory"
    ],
    "correctAnswer": 3,
    "explanation": "'Inflammatory' means provocative or controversial, explaining the media's reaction to the remarks.",
    "difficulty": "medium",
    "id": 2042
  },
  {
    "type": "sentence-completion",
    "text": "The ancient manuscript was so ____ that researchers had to handle it with special gloves.",
    "options": [
      "formal",
      "flexible",
      "frequent",
      "fragile"
    ],
    "correctAnswer": 3,
    "explanation": "'Fragile' means easily damaged, explaining why special care was needed for the manuscript.",
    "difficulty": "medium",
    "id": 2043
  },
  {
    "type": "sentence-completion",
    "text": "The company's ____ growth has impressed investors worldwide.",
    "options": [
      "exponential",
      "excessive",
      "external",
      "expensive"
    ],
    "correctAnswer": 0,
    "explanation": "'Exponential' means rapid and significant growth, which would naturally impress investors.",
    "difficulty": "medium",
    "id": 2044
  }
];

// Sentence completion questions - hard difficulty
const hardQuestions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "The professor's ____ discourse on quantum mechanics left even the brightest students bewildered.",
    "options": [
      "simplistic",
      "mundane",
      "abstruse",
      "lucid"
    ],
    "correctAnswer": 2,
    "explanation": "'Abstruse' means difficult to understand, fitting the context where even bright students were confused by the complex topic.",
    "difficulty": "hard",
    "id": 2050
  },
  {
    "type": "sentence-completion",
    "text": "The diplomat's ____ remarks caused an international incident that took months to resolve.",
    "options": [
      "diplomatic",
      "measured",
      "cautious",
      "intemperate"
    ],
    "correctAnswer": 3,
    "explanation": "'Intemperate' means lacking self-control or moderation, appropriate for remarks that caused diplomatic problems.",
    "difficulty": "hard",
    "id": 2051
  },
  {
    "type": "sentence-completion",
    "text": "The critic's ____ review praised the film's artistic merit while subtly highlighting its technical flaws.",
    "options": [
      "unambiguous",
      "straightforward",
      "definitive",
      "equivocal"
    ],
    "correctAnswer": 3,
    "explanation": "'Equivocal' means ambiguous or unclear, matching the mixed nature of the review that both praises and criticizes.",
    "difficulty": "hard",
    "id": 2052
  },
  {
    "type": "sentence-completion",
    "text": "The ancient manuscript's ____ text required years of scholarly interpretation to decipher.",
    "options": [
      "clear",
      "obvious",
      "transparent",
      "recondite"
    ],
    "correctAnswer": 3,
    "explanation": "'Recondite' means difficult to understand, obscure, fitting for a text that needed years to interpret.",
    "difficulty": "hard",
    "id": 2053
  },
  {
    "type": "sentence-completion",
    "text": "His ____ approach to problem-solving often yielded innovative solutions that others had overlooked.",
    "options": [
      "traditional",
      "conventional",
      "heterodox",
      "standard"
    ],
    "correctAnswer": 2,
    "explanation": "'Heterodox' means unorthodox or unconventional, appropriate for describing innovative problem-solving methods.",
    "difficulty": "hard",
    "id": 2054
  }
];

// Combine all sentence completion questions
export const sentenceCompletionQuestions: Question[] = [
  ...mediumQuestions,
  ...hardQuestions
];

console.log(`[SentenceCompletion] Loaded ${sentenceCompletionQuestions.length} sentence completion questions`);
console.log(`[SentenceCompletion] Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
