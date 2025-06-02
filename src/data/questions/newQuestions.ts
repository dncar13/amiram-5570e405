
import { Question, QuestionSet } from '../types/questionTypes';

// Questions following the new structure from your example
export const newQuestionSet: QuestionSet = {
  "metadata": {
    "generated": "2025-06-02T08:01:14.566Z",
    "type": "restatement",
    "difficulty": "medium",
    "count": 20,
    "topic": "university life",
    "tags": ["amir-test"],
    "model": "claude-3-7-sonnet-20250219"
  },
  "questions": [
    {
      "id": 1,
      "type": "restatement",
      "question": "The university administration has determined that extending library hours during examination periods is financially unfeasible at this time.",
      "options": [
        "The university cannot afford to keep the library open longer during exam periods right now.",
        "The university administration has decided to extend library hours despite financial constraints.",
        "The financial department has rejected the university's proposal to extend library hours.",
        "The university is considering extending library hours if financial conditions improve."
      ],
      "correctAnswer": 0,
      "explanation": "The original statement indicates that extending library hours is 'financially unfeasible at this time,' which is directly equivalent to saying the university 'cannot afford' to keep the library open longer right now. The other options either contradict the original statement or add information not present in the original.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.564Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 140,
        "estimatedTime": 60
      }
    },
    {
      "id": 2,
      "type": "restatement",
      "question": "Students who fail to submit their assignments by the deadline will not be granted extensions except in cases of documented medical emergencies.",
      "options": [
        "Medical documentation is required for all assignment submissions.",
        "Late assignments will be accepted only if students provide evidence of a medical emergency.",
        "Students may request extensions for their assignments regardless of their medical condition.",
        "Documented medical emergencies are insufficient grounds for assignment extensions."
      ],
      "correctAnswer": 1,
      "explanation": "The original statement indicates that extensions will not be granted except in cases of documented medical emergencies, which is equivalent to saying that late assignments will only be accepted with evidence of a medical emergency. The other options either contradict the original statement or add information not present in the original.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.564Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 143,
        "estimatedTime": 60
      }
    },
    {
      "id": 3,
      "type": "restatement",
      "question": "The research proposal was rejected by the committee because it lacked sufficient methodological rigor and clear objectives.",
      "options": [
        "The committee approved the research proposal despite its methodological weaknesses.",
        "The committee found the research proposal to be methodologically sound but unclear.",
        "The research proposal was turned down due to inadequate methodology and unclear goals.",
        "The committee requested more time to evaluate the research proposal's methodology."
      ],
      "correctAnswer": 2,
      "explanation": "The original statement says the proposal was rejected because it 'lacked sufficient methodological rigor and clear objectives,' which is equivalent to saying it was 'turned down due to inadequate methodology and unclear goals.'",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 135,
        "estimatedTime": 55
      }
    },
    {
      "id": 4,
      "type": "sentence-completion",
      "question": "Despite the professor's reputation for being demanding, most students found her classes to be _____ and intellectually stimulating.",
      "options": [
        "boring and repetitive",
        "rewarding and engaging",
        "difficult and frustrating",
        "simple and unchallenging"
      ],
      "correctAnswer": 1,
      "explanation": "The word 'Despite' indicates a contrast with 'demanding,' and the phrase 'intellectually stimulating' suggests positive qualities. 'Rewarding and engaging' best fits this context.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 120,
        "estimatedTime": 50
      }
    },
    {
      "id": 5,
      "type": "sentence-completion",
      "question": "The new campus policy requires all students to _____ their identification cards when entering the library during evening hours.",
      "options": [
        "surrender",
        "present",
        "purchase",
        "renew"
      ],
      "correctAnswer": 1,
      "explanation": "'Present' means to show or display, which is what students would do with their ID cards for security purposes. The other options don't make logical sense in this context.",
      "difficulty": "easy",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 110,
        "estimatedTime": 45
      }
    },
    {
      "id": 6,
      "type": "reading-comprehension",
      "question": "According to the passage, what is the primary benefit of the new study abroad program?",
      "options": [
        "Reduced tuition costs for participants",
        "Enhanced cultural understanding and language skills",
        "Guaranteed job placement after graduation",
        "Shorter degree completion time"
      ],
      "correctAnswer": 1,
      "explanation": "The passage emphasizes that the study abroad program primarily aims to develop students' cultural awareness and language proficiency through immersive experiences.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 125,
        "estimatedTime": 55
      }
    },
    {
      "id": 7,
      "type": "restatement",
      "question": "The dean announced that the university will implement a new grading system beginning next semester to ensure greater transparency in academic evaluation.",
      "options": [
        "The university plans to make its grading process more transparent starting next term.",
        "The dean has decided to postpone the implementation of the new grading system.",
        "The new grading system will make academic evaluation more difficult for students.",
        "The university will eliminate all grading systems beginning next semester."
      ],
      "correctAnswer": 0,
      "explanation": "The original statement indicates that a new grading system will be implemented 'to ensure greater transparency,' which is equivalent to making the grading process 'more transparent.'",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 138,
        "estimatedTime": 58
      }
    },
    {
      "id": 8,
      "type": "sentence-completion",
      "question": "The laboratory equipment was so _____ that even minor experiments required extensive preparation and careful handling.",
      "options": [
        "durable",
        "inexpensive",
        "delicate",
        "outdated"
      ],
      "correctAnswer": 2,
      "explanation": "'Delicate' means fragile or requiring careful handling, which explains why even minor experiments needed extensive preparation and careful handling.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 118,
        "estimatedTime": 48
      }
    },
    {
      "id": 9,
      "type": "restatement",
      "question": "Faculty members are required to submit their course syllabi to the academic office no later than two weeks before the semester begins.",
      "options": [
        "Course syllabi must be submitted by faculty at least two weeks prior to the start of the semester.",
        "Faculty members may submit their syllabi any time during the first two weeks of the semester.",
        "The academic office requires syllabi to be submitted two weeks after the semester starts.",
        "Faculty have the option to submit syllabi two weeks before or after the semester begins."
      ],
      "correctAnswer": 0,
      "explanation": "'No later than two weeks before' is equivalent to 'at least two weeks prior to.' Both expressions indicate the same deadline requirement.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 142,
        "estimatedTime": 60
      }
    },
    {
      "id": 10,
      "type": "reading-comprehension",
      "question": "The passage suggests that the university's decision to increase class sizes was primarily motivated by:",
      "options": [
        "A desire to improve student-teacher interaction",
        "Financial pressures and budget constraints",
        "Student requests for larger lecture halls",
        "A need to accommodate new teaching methods"
      ],
      "correctAnswer": 1,
      "explanation": "The passage indicates that budget constraints and financial pressures were the main factors behind the decision to increase class sizes, despite concerns about educational quality.",
      "difficulty": "medium",
      "tags": ["amir-test"],
      "createdAt": "2025-06-02T08:01:14.565Z",
      "metadata": {
        "topic": "university life",
        "wordCount": 128,
        "estimatedTime": 52
      }
    }
  ]
};

// Convert new format to legacy format for compatibility
export const convertedQuestions: Question[] = newQuestionSet.questions.map(q => ({
  ...q,
  text: q.question, // Add legacy 'text' field
  topicId: 1, // Default topic ID
  categoryId: 1, // Default category ID
  questionType: q.type as 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'comprehensive'
}));
