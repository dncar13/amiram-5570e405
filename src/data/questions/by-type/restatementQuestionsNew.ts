
import { Question } from '../../types/questionTypes';

// Restatement questions - easy difficulty
const easyQuestions: Question[] = [
  {
    "type": "restatement",
    "text": "Original: 'She arrived late because of heavy traffic.'",
    "options": [
      "Heavy traffic caused her to be late.",
      "She was late but there was no traffic.",
      "She left early to avoid traffic.",
      "The traffic was light when she arrived."
    ],
    "correctAnswer": 0,
    "explanation": "Only option A maintains the cause-effect relationship between traffic and lateness.",
    "difficulty": "easy",
    "id": 3030
  },
  {
    "type": "restatement",
    "text": "Original: 'The store closes at 9 PM.'",
    "options": [
      "The store opens at 9 PM.",
      "The store might close early.",
      "You cannot enter the store after 9 PM.",
      "The store stays open past 9 PM."
    ],
    "correctAnswer": 2,
    "explanation": "Only option A conveys the same meaning as the original statement.",
    "difficulty": "easy",
    "id": 3031
  },
  {
    "type": "restatement",
    "text": "Original: 'John is taller than Mike.'",
    "options": [
      "Mike is tall but John isn't.",
      "Mike is shorter than John.",
      "John and Mike are the same height.",
      "Mike is taller than John."
    ],
    "correctAnswer": 1,
    "explanation": "Only option A expresses the same relationship between John and Mike's heights.",
    "difficulty": "easy",
    "id": 3032
  },
  {
    "type": "restatement",
    "text": "Original: 'The cake is not only delicious but also beautiful.'",
    "options": [
      "The cake is delicious but ugly.",
      "The cake is both tasty and attractive.",
      "The cake is neither tasty nor attractive.",
      "The cake looks good but tastes bad."
    ],
    "correctAnswer": 1,
    "explanation": "Only option A maintains both positive qualities of the cake.",
    "difficulty": "easy",
    "id": 3033
  },
  {
    "type": "restatement",
    "text": "Original: 'Everyone except Tom went to the party.'",
    "options": [
      "Nobody went to the party.",
      "Tom was the only one who didn't attend the party.",
      "Tom and others went to the party.",
      "Tom went to the party alone."
    ],
    "correctAnswer": 1,
    "explanation": "Only option A correctly expresses that Tom was the sole non-attendee.",
    "difficulty": "easy",
    "id": 3034
  }
];

// Restatement questions - medium difficulty
const mediumQuestions: Question[] = [
  {
    "type": "restatement",
    "text": "Original: 'Not only was she talented, but she was also hardworking.'",
    "options": [
      "She was neither talented nor hardworking.",
      "She worked hard despite lacking talent.",
      "She was talented but lazy.",
      "She possessed both talent and a strong work ethic."
    ],
    "correctAnswer": 3,
    "explanation": "Option A maintains the dual qualities mentioned in the original statement.",
    "difficulty": "medium",
    "id": 3040
  },
  {
    "type": "restatement",
    "text": "Original: 'Unless you study regularly, you won't pass the exam.'",
    "options": [
      "The exam is easy regardless of studying.",
      "Regular studying is necessary to pass the exam.",
      "You will pass the exam without studying.",
      "Studying isn't important for the exam."
    ],
    "correctAnswer": 1,
    "explanation": "Option A conveys the same conditional relationship between studying and passing.",
    "difficulty": "medium",
    "id": 3041
  },
  {
    "type": "restatement",
    "text": "Original: 'The concert was postponed due to inclement weather.'",
    "options": [
      "Bad weather caused the concert to be delayed.",
      "The weather improved for the concert.",
      "The concert was canceled permanently.",
      "The concert happened despite bad weather."
    ],
    "correctAnswer": 0,
    "explanation": "Option A maintains the cause-effect relationship between weather and postponement.",
    "difficulty": "medium",
    "id": 3042
  },
  {
    "type": "restatement",
    "text": "Original: 'Having finished the project, Sarah went home to rest.'",
    "options": [
      "Sarah worked on the project at home.",
      "Sarah couldn't rest until she finished the project.",
      "After Sarah completed the project, she returned home to relax.",
      "Sarah went home before finishing the project."
    ],
    "correctAnswer": 2,
    "explanation": "Option A preserves the sequence of events and their relationship.",
    "difficulty": "medium",
    "id": 3043
  },
  {
    "type": "restatement",
    "text": "Original: 'Despite his wealth, he lived a simple life.'",
    "options": [
      "He became wealthy by living simply.",
      "He was poor but lived luxuriously.",
      "Although he was rich, he maintained a modest lifestyle.",
      "His wealth made him live extravagantly."
    ],
    "correctAnswer": 2,
    "explanation": "Option A maintains the contrast between wealth and simple living.",
    "difficulty": "medium",
    "id": 3044
  }
];

// Restatement questions - hard difficulty
const hardQuestions: Question[] = [
  {
    "type": "restatement",
    "text": "Original: 'Not only did she excel in academics, but she was also a gifted athlete.'",
    "options": [
      "She was either good at studies or sports.",
      "She was both academically outstanding and athletically talented.",
      "Her academic excellence overshadowed her athletic abilities.",
      "She focused more on sports than academics."
    ],
    "correctAnswer": 1,
    "explanation": "The first option maintains the dual emphasis on both her academic and athletic achievements.",
    "difficulty": "hard",
    "id": 3050
  },
  {
    "type": "restatement",
    "text": "Original: 'Had I known about the consequences, I would have acted differently.'",
    "options": [
      "I didn't know about the consequences, so I acted as I did.",
      "I knew about the consequences and still acted the same way.",
      "I might act differently in the future.",
      "The consequences were clear to me from the beginning."
    ],
    "correctAnswer": 0,
    "explanation": "The first option correctly expresses the conditional perfect meaning of regret about past actions.",
    "difficulty": "hard",
    "id": 3051
  },
  {
    "type": "restatement",
    "text": "Original: 'The professor, notwithstanding his reputation for severity, proved to be quite lenient.'",
    "options": [
      "Despite being known as strict, the professor was actually quite easy-going.",
      "The professor's reputation was misleading but accurate.",
      "The professor was both strict and lenient.",
      "The professor maintained his strict reputation."
    ],
    "correctAnswer": 0,
    "explanation": "The first option accurately captures the contrast between reputation and reality.",
    "difficulty": "hard",
    "id": 3052
  },
  {
    "type": "restatement",
    "text": "Original: 'Scarcely had we left the house when it started to pour.'",
    "options": [
      "We barely made it home before the rain.",
      "Almost immediately after we left the house, it began raining heavily.",
      "It was already raining when we left.",
      "We left the house because it was raining."
    ],
    "correctAnswer": 1,
    "explanation": "The first option correctly maintains the immediate sequence of events.",
    "difficulty": "hard",
    "id": 3053
  },
  {
    "type": "restatement",
    "text": "Original: 'Never in my wildest dreams did I imagine I would achieve such success.'",
    "options": [
      "I achieved moderate success as expected.",
      "My success far exceeded my expectations.",
      "I always knew I would be successful.",
      "I dreamed about being successful."
    ],
    "correctAnswer": 1,
    "explanation": "The first option maintains the sense of unexpected achievement.",
    "difficulty": "hard",
    "id": 3054
  }
];

// Combine all restatement questions
export const restatementQuestionsNew: Question[] = [
  ...easyQuestions,
  ...mediumQuestions, 
  ...hardQuestions
];

console.log(`[Restatement] Loaded ${restatementQuestionsNew.length} restatement questions`);
console.log(`[Restatement] Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
