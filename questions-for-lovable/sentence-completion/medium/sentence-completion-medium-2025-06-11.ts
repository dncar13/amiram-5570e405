
import { Question } from '../../../src/data/types/questionTypes';

const questions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "The company's new policy was implemented to ____ employee productivity.",
    "options": [
      "decrease",
      "enhance",
      "ignore",
      "confuse"
    ],
    "correctAnswer": 1,
    "explanation": "'Enhance' fits the context of improving productivity through policy implementation.",
    "difficulty": "medium",
    "id": 2030
  },
  {
    "type": "sentence-completion",
    "text": "Despite the challenging circumstances, she remained ____ throughout the crisis.",
    "options": [
      "optimistic",
      "pessimistic",
      "indifferent",
      "aggressive"
    ],
    "correctAnswer": 0,
    "explanation": "'Optimistic' contrasts well with 'challenging circumstances' showing resilience.",
    "difficulty": "medium",
    "id": 2031
  },
  {
    "type": "sentence-completion",
    "text": "The research findings were ____ enough to warrant further investigation.",
    "options": [
      "insignificant",
      "promising",
      "disappointing",
      "confusing"
    ],
    "correctAnswer": 1,
    "explanation": "'Promising' results would justify continued research efforts.",
    "difficulty": "medium",
    "id": 2032
  },
  {
    "type": "sentence-completion",
    "text": "The museum's new exhibition has ____ visitors from around the world.",
    "options": [
      "repelled",
      "attracted",
      "confused",
      "ignored"
    ],
    "correctAnswer": 1,
    "explanation": "'Attracted' makes sense for a successful museum exhibition drawing international visitors.",
    "difficulty": "medium",
    "id": 2033
  },
  {
    "type": "sentence-completion",
    "text": "The professor's lecture was so ____ that many students fell asleep.",
    "options": [
      "engaging",
      "tedious",
      "brief",
      "loud"
    ],
    "correctAnswer": 1,
    "explanation": "'Tedious' explains why students would fall asleep during the lecture.",
    "difficulty": "medium",
    "id": 2034
  }
];

export default questions;
