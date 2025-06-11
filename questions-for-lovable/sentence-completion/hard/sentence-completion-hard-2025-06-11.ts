
import { Question } from '../../../src/data/types/questionTypes';

const questions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "The politician's speech was deliberately ____, designed to avoid taking a definitive stance on the controversial issue.",
    "options": [
      "explicit",
      "ambiguous",
      "concise",
      "inflammatory"
    ],
    "correctAnswer": 1,
    "explanation": "'Ambiguous' fits the context of deliberately avoiding a clear position.",
    "difficulty": "hard",
    "id": 2035
  },
  {
    "type": "sentence-completion",
    "text": "The artist's work was considered ____ by critics, who praised its innovative approach to traditional themes.",
    "options": [
      "conventional",
      "revolutionary",
      "mediocre",
      "derivative"
    ],
    "correctAnswer": 1,
    "explanation": "'Revolutionary' aligns with 'innovative approach' mentioned by critics.",
    "difficulty": "hard",
    "id": 2036
  },
  {
    "type": "sentence-completion",
    "text": "Despite his ____ demeanor, the CEO was known for making swift and decisive business decisions.",
    "options": [
      "aggressive",
      "contemplative",
      "impulsive",
      "arrogant"
    ],
    "correctAnswer": 1,
    "explanation": "'Contemplative' creates a contrast with 'swift and decisive' decisions.",
    "difficulty": "hard",
    "id": 2037
  }
];

export default questions;
