
import { Question } from '../../../src/data/types/questionTypes';

const questions: Question[] = [
  {
    "type": "restatement",
    "text": "John is taller than Mike.",
    "options": [
      "Mike is shorter than John.",
      "Mike is taller than John.",
      "John and Mike are the same height.",
      "Mike is very tall."
    ],
    "correctAnswer": 0,
    "explanation": "If John is taller than Mike, then Mike must be shorter than John.",
    "difficulty": "easy",
    "id": 2060
  },
  {
    "type": "restatement",
    "text": "The store closes at 9 PM.",
    "options": [
      "The store opens at 9 PM.",
      "The store is closed at 9 PM.",
      "The store stops operating at 9 PM.",
      "The store is always open."
    ],
    "correctAnswer": 2,
    "explanation": "'Stops operating' means the same as 'closes'.",
    "difficulty": "easy",
    "id": 2061
  },
  {
    "type": "restatement",
    "text": "She enjoys reading books.",
    "options": [
      "She dislikes reading books.",
      "She likes to read books.",
      "She never reads books.",
      "She only reads newspapers."
    ],
    "correctAnswer": 1,
    "explanation": "'Likes to read' means the same as 'enjoys reading'.",
    "difficulty": "easy",
    "id": 2062
  },
  {
    "type": "restatement",
    "text": "The weather is very cold today.",
    "options": [
      "Today is extremely chilly.",
      "The weather is hot today.",
      "It's a warm day today.",
      "The temperature is perfect."
    ],
    "correctAnswer": 0,
    "explanation": "'Extremely chilly' means the same as 'very cold'.",
    "difficulty": "easy",
    "id": 2063
  },
  {
    "type": "restatement",
    "text": "He arrived late to the meeting.",
    "options": [
      "He came early to the meeting.",
      "He was on time for the meeting.",
      "He didn't attend the meeting.",
      "He came after the meeting started."
    ],
    "correctAnswer": 3,
    "explanation": "'Came after the meeting started' means the same as 'arrived late'.",
    "difficulty": "easy",
    "id": 2064
  },
  {
    "type": "restatement",
    "text": "The movie was boring.",
    "options": [
      "The film was exciting.",
      "The movie was interesting.",
      "The film was dull.",
      "The movie was amazing."
    ],
    "correctAnswer": 2,
    "explanation": "'Dull' means the same as 'boring'.",
    "difficulty": "easy",
    "id": 2065
  },
  {
    "type": "restatement",
    "text": "She speaks English fluently.",
    "options": [
      "She can't speak English well.",
      "She has excellent English skills.",
      "She only knows a few English words.",
      "She refuses to speak English."
    ],
    "correctAnswer": 1,
    "explanation": "'Has excellent English skills' means the same as 'speaks English fluently'.",
    "difficulty": "easy",
    "id": 2066
  },
  {
    "type": "restatement",
    "text": "The car is expensive.",
    "options": [
      "The car is cheap.",
      "The vehicle costs a lot of money.",
      "The car is free.",
      "The car is old."
    ],
    "correctAnswer": 1,
    "explanation": "'Costs a lot of money' means the same as 'expensive'.",
    "difficulty": "easy",
    "id": 2067
  },
  {
    "type": "restatement",
    "text": "They will travel tomorrow.",
    "options": [
      "They traveled yesterday.",
      "They are traveling today.",
      "They will go on a trip tomorrow.",
      "They never travel."
    ],
    "correctAnswer": 2,
    "explanation": "'Will go on a trip' means the same as 'will travel'.",
    "difficulty": "easy",
    "id": 2068
  },
  {
    "type": "restatement",
    "text": "The food tastes delicious.",
    "options": [
      "The food tastes terrible.",
      "The meal is very tasty.",
      "The food has no flavor.",
      "The food is cold."
    ],
    "correctAnswer": 1,
    "explanation": "'Very tasty' means the same as 'delicious'.",
    "difficulty": "easy",
    "id": 2069
  }
];

export default questions;
