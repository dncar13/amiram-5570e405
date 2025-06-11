
import { Question } from '../../../src/data/types/questionTypes';

const questions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "The weather was so ____ that we decided to stay indoors.",
    "options": [
      "beautiful",
      "terrible",
      "warm",
      "cool"
    ],
    "correctAnswer": 1,
    "explanation": "'Terrible' is the only option that would make people want to stay indoors.",
    "difficulty": "easy",
    "id": 2020
  },
  {
    "type": "sentence-completion",
    "text": "She was very ____ about her upcoming exam.",
    "options": [
      "excited",
      "nervous", 
      "happy",
      "calm"
    ],
    "correctAnswer": 1,
    "explanation": "'Nervous' fits the context of worry about an upcoming exam.",
    "difficulty": "easy",
    "id": 2021
  },
  {
    "type": "sentence-completion",
    "text": "The book was so ____ that I couldn't put it down.",
    "options": [
      "boring",
      "difficult",
      "interesting",
      "short"
    ],
    "correctAnswer": 2,
    "explanation": "'Interesting' explains why someone wouldn't want to stop reading.",
    "difficulty": "easy",
    "id": 2022
  },
  {
    "type": "sentence-completion",
    "text": "He spoke so ____ that everyone could hear him clearly.",
    "options": [
      "quietly",
      "loudly",
      "quickly",
      "slowly"
    ],
    "correctAnswer": 1,
    "explanation": "'Loudly' allows everyone to hear clearly.",
    "difficulty": "easy",
    "id": 2023
  },
  {
    "type": "sentence-completion",
    "text": "The cat was ____ under the table.",
    "options": [
      "running",
      "flying",
      "hiding",
      "swimming"
    ],
    "correctAnswer": 2,
    "explanation": "'Hiding' is the most logical action for a cat under a table.",
    "difficulty": "easy",
    "id": 2024
  },
  {
    "type": "sentence-completion",
    "text": "I need to ____ my homework before dinner.",
    "options": [
      "forget",
      "ignore",
      "finish",
      "lose"
    ],
    "correctAnswer": 2,
    "explanation": "'Finish' makes sense in the context of completing homework.",
    "difficulty": "easy",
    "id": 2025
  },
  {
    "type": "sentence-completion",
    "text": "The flowers in the garden are very ____.",
    "options": [
      "ugly",
      "dead",
      "beautiful",
      "plastic"
    ],
    "correctAnswer": 2,
    "explanation": "'Beautiful' is the most positive and likely description for garden flowers.",
    "difficulty": "easy",
    "id": 2026
  },
  {
    "type": "sentence-completion",
    "text": "She ____ her keys and couldn't find them anywhere.",
    "options": [
      "found",
      "lost",
      "bought",
      "sold"
    ],
    "correctAnswer": 1,
    "explanation": "'Lost' explains why she couldn't find her keys.",
    "difficulty": "easy",
    "id": 2027
  },
  {
    "type": "sentence-completion",
    "text": "The movie was ____ than I expected.",
    "options": [
      "worse",
      "better",
      "longer",
      "shorter"
    ],
    "correctAnswer": 1,
    "explanation": "'Better' is a common positive comparison for exceeded expectations.",
    "difficulty": "easy",
    "id": 2028
  },
  {
    "type": "sentence-completion",
    "text": "He ____ to school every day.",
    "options": [
      "walks",
      "flies",
      "swims",
      "crawls"
    ],
    "correctAnswer": 0,
    "explanation": "'Walks' is the most common way to get to school daily.",
    "difficulty": "easy",
    "id": 2029
  }
];

export default questions;
