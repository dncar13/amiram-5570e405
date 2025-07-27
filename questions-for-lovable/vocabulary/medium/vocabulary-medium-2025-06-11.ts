import { Question } from '../../../types';

const questions: Question[] = [
  {
    "type": "restatement",
    "text": "Despite his extensive preparation, John found the interview considerably more challenging than he had anticipated.",
    "questionSubtext": "בחרו את המשפט הזהה במשמעות:",
    "options": [
      "John's preparation was insufficient for the difficult interview he faced.",
      "Although John had prepared thoroughly, the interview proved to be much harder than expected.",
      "John anticipated a challenging interview, which is why he prepared extensively.",
      "The interview was challenging because John hadn't prepared enough."
    ],
    "correctAnswer": 1,
    "explanation": "התשובה הנכונה היא B - Although John had prepared thoroughly, the interview proved to be much harder than expected.",
    "detailedExplanation": {
      "mainExplanation": "ניתוח המרכיבים העיקריים:",
      "analysisTable": [
        { "component": "ניגוד", "original": "Despite (למרות)", "answer": "Although (למרות ש)" },
        { "component": "הכנה", "original": "extensive preparation", "answer": "prepared thoroughly" },
        { "component": "תוצאה", "original": "found...more challenging", "answer": "proved to be much harder" },
        { "component": "ציפיות", "original": "than he had anticipated", "answer": "than expected" }
      ],
      "errorAnalysis": [
        "A + D: משנות את המשמעות - טוענות שההכנה לא הייתה מספקת",
        "C: הופכת את הסדר הכרונולוגי - הציפייה באה לפני ההכנה"
      ]
    },
    "difficulty": "medium",
    "id": 4040
  },
  {
    "type": "vocabulary",
    "text": "His ____ attitude towards work impressed his supervisors.",
    "options": [
      "timid",
      "diligent",
      "lethargic",
      "frivolous"
    ],
    "correctAnswer": 1,
    "explanation": "'Diligent' means showing persistent and hardworking effort.",
    "difficulty": "medium",
    "id": 4041
  },
  {
    "type": "vocabulary",
    "text": "The politician's speech was filled with ____ statements that confused listeners.",
    "options": [
      "precise",
      "straightforward",
      "simple",
      "ambiguous"
    ],
    "correctAnswer": 3,
    "explanation": "'Ambiguous' means unclear or having multiple possible interpretations.",
    "difficulty": "medium",
    "id": 4042
  },
  {
    "type": "vocabulary",
    "text": "The company's new policy was met with ____ from the employees.",
    "options": [
      "indifference",
      "enthusiasm",
      "approval",
      "skepticism"
    ],
    "correctAnswer": 3,
    "explanation": "'Skepticism' means doubt or a questioning attitude.",
    "difficulty": "medium",
    "id": 4043
  },
  {
    "type": "vocabulary",
    "text": "The old building was in a state of ____ after years of neglect.",
    "options": [
      "renovation",
      "improvement",
      "dilapidation",
      "prosperity"
    ],
    "correctAnswer": 2,
    "explanation": "'Dilapidation' means a state of disrepair or deterioration.",
    "difficulty": "medium",
    "id": 4044
  },
  {
    "type": "vocabulary",
    "text": "The professor gave a(n) ____ explanation of the complex theory.",
    "options": [
      "lucid",
      "complicated",
      "vague",
      "confusing"
    ],
    "correctAnswer": 0,
    "explanation": "'Lucid' means clear and easy to understand.",
    "difficulty": "medium",
    "id": 4045
  },
  {
    "type": "vocabulary",
    "text": "The student's essay was ____, covering multiple topics without focus.",
    "options": [
      "rambling",
      "brief",
      "concise",
      "precise"
    ],
    "correctAnswer": 0,
    "explanation": "'Rambling' means lengthy and lacking organization or focus.",
    "difficulty": "medium",
    "id": 4046
  },
  {
    "type": "vocabulary",
    "text": "The company's decision to expand was ____ by careful market research.",
    "options": [
      "criticized",
      "questioned",
      "vindicated",
      "opposed"
    ],
    "correctAnswer": 2,
    "explanation": "'Vindicated' means proven to be right or justified.",
    "difficulty": "medium",
    "id": 4047
  },
  {
    "type": "vocabulary",
    "text": "The witness gave a(n) ____ account of what happened that night.",
    "options": [
      "unclear",
      "incomplete",
      "biased",
      "cogent"
    ],
    "correctAnswer": 3,
    "explanation": "'Cogent' means clear, logical, and convincing.",
    "difficulty": "medium",
    "id": 4048
  },
  {
    "type": "vocabulary",
    "text": "The novel's plot was ____, keeping readers guessing until the end.",
    "options": [
      "boring",
      "predictable",
      "simple",
      "enigmatic"
    ],
    "correctAnswer": 3,
    "explanation": "'Enigmatic' means difficult to interpret or mysterious.",
    "difficulty": "medium",
    "id": 4049
  }
];

export default questions;
