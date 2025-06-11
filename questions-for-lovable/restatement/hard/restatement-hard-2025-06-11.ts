
import { Question } from '../../../src/data/types/questionTypes';

const questions: Question[] = [
  {
    "type": "restatement",
    "text": "The professor's lecture was characterized by its pedantic and verbose nature.",
    "options": [
      "The professor's presentation was overly detailed and wordy.",
      "The professor's speech was concise and to the point.",
      "The professor's lecture was engaging and dynamic.",
      "The professor's talk was brief and clear."
    ],
    "correctAnswer": 0,
    "explanation": "'Overly detailed and wordy' restates 'pedantic and verbose'.",
    "difficulty": "hard",
    "id": 2078
  },
  {
    "type": "restatement",
    "text": "The politician's statement was deliberately obfuscating the truth.",
    "options": [
      "The politician was clearly explaining the facts.",
      "The politician was intentionally making the truth unclear.",
      "The politician was being completely honest.",
      "The politician was providing detailed information."
    ],
    "correctAnswer": 1,
    "explanation": "'Intentionally making the truth unclear' means the same as 'deliberately obfuscating'.",
    "difficulty": "hard",
    "id": 2079
  }
];

export default questions;
