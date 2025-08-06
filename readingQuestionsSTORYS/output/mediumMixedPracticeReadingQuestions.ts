import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "Mastering Skills: When Variety Beats Repetition",
  "difficulty": "medium",
  "topic": "MixedPractice",
  "wordCount": 333,
  "numQuestions": 25,
  "estimatedTime": 3,
  "topicId": 8
};

// Reading passage - Mastering Skills: When Variety Beats Repetition (medium level)
export const passage = `[1] When it comes to mastering a new skill, conventional wisdom has long suggested that repetitive practice is the key to success. "Practice makes perfect," as the saying goes. However, recent research in cognitive science and learning theory has revealed that mixing up your practice routine - known as interleaved practice - may actually lead to better long-term results than the traditional blocked practice approach. This discovery has significant implications for how we learn everything from mathematics to music to motor skills.

[2] The concept of interleaved practice involves alternating between different but related skills during learning sessions, rather than focusing on a single skill until it's mastered. For example, a basketball player practicing different types of shots in a varied sequence, rather than completing all free throws before moving on to three-pointers, tends to develop more robust skills. Similarly, students who mix different types of math problems in their homework, instead of drilling one type of problem repeatedly, often demonstrate better problem-solving abilities and retention of concepts. This approach, while initially more challenging, helps learners develop stronger cognitive connections and better discrimination between different concepts.

[3] Despite its proven benefits, interleaved practice often faces resistance because it feels more difficult and less productive in the short term. When learners practice skills in a mixed format, they typically make more mistakes and progress seems slower compared to blocked practice. This phenomenon, known as "desirable difficulty," actually enhances learning by forcing the brain to work harder at retrieving information and distinguishing between different concepts. The increased cognitive effort required during interleaved practice leads to stronger neural pathways and better long-term retention of skills.

[4] The implications of this research extend beyond academic and athletic training into various professional fields. Musicians, medical professionals, and technical workers can all benefit from incorporating varied practice methods into their learning routines. As our understanding of effective learning strategies continues to evolve, the role of mixed practice in skill acquisition becomes increasingly central to modern educational and training approaches.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S8_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, why does interleaved practice initially face resistance?",
    "options": [
      {
        "text": "It feels more difficult and less productive in the short term",
        "rationale": "This is explicitly stated in paragraph 3 as the reason for resistance"
      },
      {
        "text": "It requires more expensive equipment",
        "rationale": "The passage never mentions equipment costs"
      },
      {
        "text": "It takes more time to complete",
        "rationale": "While progress may seem slower, total time requirement isn't mentioned as a reason for resistance"
      },
      {
        "text": "It requires professional supervision",
        "rationale": "The passage doesn't mention anything about supervision requirements"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly states in paragraph 3 that interleaved practice faces resistance because it feels more difficult and less productive in the short term, with learners making more mistakes and progress seeming slower.",
    "hint": "Look for the immediate challenges or drawbacks mentioned about this practice method",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S8_Q2",
    "type": "reading-comprehension",
    "text": "What example does the passage use to illustrate interleaved practice in sports?",
    "options": [
      {
        "text": "A tennis player practicing different serves",
        "rationale": "Tennis is not mentioned in the passage"
      },
      {
        "text": "A basketball player alternating between different types of shots",
        "rationale": "This is the correct example used in paragraph 2"
      },
      {
        "text": "A swimmer practicing different strokes",
        "rationale": "Swimming is not mentioned in the passage"
      },
      {
        "text": "A golfer practicing various swings",
        "rationale": "Golf is not mentioned in the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses the example of a basketball player practicing different types of shots in a varied sequence, rather than completing all free throws before moving to three-pointers.",
    "hint": "Think about the sports-related example mentioned when explaining varied practice sequences",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S8_Q3",
    "type": "reading-comprehension",
    "text": "What term does the passage use to describe the beneficial difficulty of interleaved practice?",
    "options": [
      {
        "text": "Productive struggle",
        "rationale": "This term isn't used in the passage"
      },
      {
        "text": "Constructive challenge",
        "rationale": "This term isn't used in the passage"
      },
      {
        "text": "Desirable difficulty",
        "rationale": "This is the exact term used in paragraph 3"
      },
      {
        "text": "Beneficial resistance",
        "rationale": "This term isn't used in the passage"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically uses the term 'desirable difficulty' to describe how the increased challenge of interleaved practice actually enhances learning.",
    "hint": "Look for the specific technical term used to describe the beneficial challenging aspect of this practice method",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S8_Q4",
    "type": "reading-comprehension",
    "text": "Which professionals are mentioned as potential beneficiaries of varied practice methods?",
    "options": [
      {
        "text": "Musicians, medical professionals, and technical workers",
        "rationale": "These are exactly the professionals listed in paragraph 4"
      },
      {
        "text": "Teachers, doctors, and engineers",
        "rationale": "These specific professions aren't listed together in the passage"
      },
      {
        "text": "Athletes, students, and musicians",
        "rationale": "While these groups are mentioned, they're not the professionals listed together in paragraph 4"
      },
      {
        "text": "Pilots, surgeons, and artists",
        "rationale": "These specific professions aren't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 4 specifically lists musicians, medical professionals, and technical workers as professionals who can benefit from varied practice methods.",
    "hint": "Check the final paragraph for the list of professional fields mentioned",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S8_Q5",
    "type": "reading-comprehension",
    "text": "What is the primary contrast to interleaved practice mentioned in the passage?",
    "options": [
      {
        "text": "Blocked practice",
        "rationale": "This is specifically mentioned as the traditional alternative to interleaved practice"
      },
      {
        "text": "Random practice",
        "rationale": "This term isn't mentioned in the passage"
      },
      {
        "text": "Structured practice",
        "rationale": "This term isn't mentioned as a contrast to interleaved practice"
      },
      {
        "text": "Sequential practice",
        "rationale": "This term isn't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage contrasts interleaved practice with the 'traditional blocked practice approach' in paragraph 1 and provides examples of the difference between the two methods.",
    "hint": "Look for the traditional practice method that's directly contrasted with interleaved practice",
    "paragraphReference": "Paragraphs [1-2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S8_Q6",
    "type": "reading-comprehension",
    "text": "What is the main contrast presented in the passage regarding learning methods?",
    "options": [
      {
        "text": "Interleaved practice versus blocked practice",
        "rationale": "Correct - this is the central comparison discussed throughout the passage"
      },
      {
        "text": "Academic versus athletic training",
        "rationale": "Incorrect - these are examples used but not the main contrast"
      },
      {
        "text": "Short-term versus long-term results",
        "rationale": "Incorrect - while mentioned, this is a result of the main contrast, not the contrast itself"
      },
      {
        "text": "Theory versus practical application",
        "rationale": "Incorrect - the passage doesn't focus on this distinction"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage primarily contrasts interleaved practice (mixing up different but related skills) with traditional blocked practice (repetitive practice of a single skill)",
    "hint": "Look for the two learning approaches that are compared throughout all paragraphs",
    "paragraphReference": "Paragraphs [1-2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S8_Q7",
    "type": "reading-comprehension",
    "text": "Why do learners often resist interleaved practice?",
    "options": [
      {
        "text": "Because it initially feels more difficult and seems less productive",
        "rationale": "Correct - the passage explicitly states this as the reason for resistance"
      },
      {
        "text": "Because it takes more time to complete",
        "rationale": "Incorrect - while implied, this isn't stated as the reason for resistance"
      },
      {
        "text": "Because it requires more equipment",
        "rationale": "Incorrect - not mentioned in the passage"
      },
      {
        "text": "Because it costs more money",
        "rationale": "Incorrect - not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 explicitly states that interleaved practice faces resistance because it feels more difficult and less productive in the short term",
    "hint": "Focus on the challenges mentioned in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S8_Q8",
    "type": "reading-comprehension",
    "text": "What is 'desirable difficulty' according to the passage?",
    "options": [
      {
        "text": "The beneficial struggle during interleaved practice that enhances learning",
        "rationale": "Correct - accurately describes the concept as explained in the passage"
      },
      {
        "text": "The optimal level of challenge in physical exercises",
        "rationale": "Incorrect - too narrow and not the passage's definition"
      },
      {
        "text": "The difficulty level needed to master a skill",
        "rationale": "Incorrect - oversimplifies the concept"
      },
      {
        "text": "The process of making mistakes during practice",
        "rationale": "Incorrect - this is part of the concept but not its complete meaning"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes 'desirable difficulty' as the phenomenon where increased cognitive effort and mistakes during interleaved practice actually enhance learning",
    "hint": "Look for the explanation following the term in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S8_Q9",
    "type": "reading-comprehension",
    "text": "Which example does the passage use to illustrate interleaved practice in sports?",
    "options": [
      {
        "text": "A basketball player practicing different types of shots in varied sequence",
        "rationale": "Correct - this is the specific example given in the passage"
      },
      {
        "text": "A tennis player practicing different serves",
        "rationale": "Incorrect - not mentioned in the passage"
      },
      {
        "text": "A soccer player practicing different kicks",
        "rationale": "Incorrect - not mentioned in the passage"
      },
      {
        "text": "A baseball player practicing different pitches",
        "rationale": "Incorrect - not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically uses the example of a basketball player practicing different types of shots in a varied sequence rather than completing all free throws before moving to three-pointers",
    "hint": "Look for the sports-related example in paragraph 2",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S8_Q10",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the broader impact of research on interleaved practice?",
    "options": [
      {
        "text": "It has implications for various professional fields beyond academics and athletics",
        "rationale": "Correct - the passage explicitly states this in the final paragraph"
      },
      {
        "text": "It only affects educational institutions",
        "rationale": "Incorrect - the passage indicates much broader applications"
      },
      {
        "text": "It is limited to sports training",
        "rationale": "Incorrect - the passage mentions multiple fields of application"
      },
      {
        "text": "It primarily benefits musicians",
        "rationale": "Incorrect - musicians are just one example of many beneficiaries"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The final paragraph emphasizes that the research has implications across various professional fields, including but not limited to musicians, medical professionals, and technical workers",
    "hint": "Check the final paragraph for the broader applications of this research",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S8_Q11",
    "type": "reading-comprehension",
    "text": "What is the main contrast presented in the passage regarding learning methods?",
    "options": [
      {
        "text": "Interleaved practice versus blocked practice",
        "rationale": "This is the central comparison discussed throughout the passage, highlighting the benefits of varied practice over repetitive practice"
      },
      {
        "text": "Academic versus athletic training",
        "rationale": "While both are mentioned as examples, this is not the main contrast discussed"
      },
      {
        "text": "Short-term versus long-term results",
        "rationale": "This is a secondary point related to the main contrast, not the primary focus"
      },
      {
        "text": "Professional versus amateur learning",
        "rationale": "This distinction is not discussed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage primarily contrasts interleaved practice (mixing up practice routine) with traditional blocked practice (repetitive practice), emphasizing the superior long-term benefits of the former.",
    "hint": "Look for the two opposing approaches to learning that are compared throughout the text",
    "paragraphReference": "Paragraphs [1-2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S8_Q12",
    "type": "reading-comprehension",
    "text": "According to the passage, why do people often resist interleaved practice?",
    "options": [
      {
        "text": "It initially feels more difficult and shows slower progress",
        "rationale": "The passage explicitly states this as the reason for resistance"
      },
      {
        "text": "It requires more expensive equipment",
        "rationale": "This is not mentioned in the passage"
      },
      {
        "text": "It takes more time to complete",
        "rationale": "While it might be implied, this is not stated as a reason for resistance"
      },
      {
        "text": "It requires professional supervision",
        "rationale": "This is not mentioned as a factor in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states that interleaved practice faces resistance because it feels more difficult and appears less productive in the short term, leading to more mistakes initially.",
    "hint": "Think about the immediate challenges that might discourage learners from adopting this method",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S8_Q13",
    "type": "reading-comprehension",
    "text": "What example does the passage provide for interleaved practice in basketball?",
    "options": [
      {
        "text": "Practicing different types of shots in a varied sequence",
        "rationale": "This is the specific example given in the passage"
      },
      {
        "text": "Playing multiple games in succession",
        "rationale": "This example is not mentioned in the passage"
      },
      {
        "text": "Watching videos of different players",
        "rationale": "This is not mentioned as an example"
      },
      {
        "text": "Practicing with different teams",
        "rationale": "This is not provided as an example in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses the example of a basketball player practicing different types of shots in a varied sequence rather than completing all free throws before moving to three-pointers.",
    "hint": "Look for the specific basketball-related example in the second paragraph",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S8_Q14",
    "type": "reading-comprehension",
    "text": "What is described as 'desirable difficulty' in the passage?",
    "options": [
      {
        "text": "The increased mistakes and slower progress during mixed format practice",
        "rationale": "This correctly identifies the concept as explained in the passage"
      },
      {
        "text": "The challenge of learning multiple sports",
        "rationale": "This is not what the passage defines as desirable difficulty"
      },
      {
        "text": "The process of becoming a professional athlete",
        "rationale": "This is not related to the concept as described"
      },
      {
        "text": "The complexity of academic subjects",
        "rationale": "This is not the definition provided in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explains that 'desirable difficulty' refers to the phenomenon where making more mistakes and experiencing slower progress during mixed format practice actually enhances learning.",
    "hint": "Look for the term in paragraph 3 and how it relates to the learning process",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S8_Q15",
    "type": "reading-comprehension",
    "text": "Which professionals are specifically mentioned as potential beneficiaries of interleaved practice?",
    "options": [
      {
        "text": "Musicians, medical professionals, and technical workers",
        "rationale": "These are the exact professionals listed in the passage"
      },
      {
        "text": "Teachers, coaches, and athletes",
        "rationale": "While athletes are mentioned earlier, these specific professionals are not listed together"
      },
      {
        "text": "Scientists, engineers, and researchers",
        "rationale": "These professionals are not specifically mentioned in the passage"
      },
      {
        "text": "Artists, writers, and performers",
        "rationale": "These professionals are not listed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically mentions musicians, medical professionals, and technical workers as professionals who can benefit from varied practice methods.",
    "hint": "Check the final paragraph for the list of professional fields mentioned",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S8_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what would most likely happen if a student switched from blocked practice to interleaved practice?",
    "options": [
      {
        "text": "Their initial performance would appear to decline",
        "rationale": "The passage explicitly states that interleaved practice feels more difficult and shows slower progress initially"
      },
      {
        "text": "They would immediately see better test scores",
        "rationale": "This contradicts the passage's point about initial difficulty and slower apparent progress"
      },
      {
        "text": "Their motivation would significantly increase",
        "rationale": "The passage suggests people often resist this method due to its apparent difficulty"
      },
      {
        "text": "They would learn new concepts faster",
        "rationale": "The passage indicates that initial learning appears slower with this method"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states in paragraph [3] that interleaved practice 'feels more difficult and less productive in the short term' and learners 'make more mistakes and progress seems slower.'",
    "hint": "Think about the short-term versus long-term effects described in the passage",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S8_Q17",
    "type": "reading-comprehension",
    "text": "What can be inferred about why interleaved practice leads to better long-term results?",
    "options": [
      {
        "text": "It requires more cognitive effort",
        "rationale": "The passage explains that increased cognitive effort creates stronger neural pathways"
      },
      {
        "text": "It takes more time to complete",
        "rationale": "The passage doesn't suggest time duration is the key factor"
      },
      {
        "text": "It is more enjoyable for learners",
        "rationale": "The passage actually suggests it feels more difficult and less enjoyable initially"
      },
      {
        "text": "It involves more repetition",
        "rationale": "The passage contrasts this method with repetitive practice"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explains that the increased cognitive effort required during interleaved practice creates stronger neural pathways and better long-term retention",
    "hint": "Consider what the passage says about how the brain responds to this type of practice",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S8_Q18",
    "type": "reading-comprehension",
    "text": "Which conclusion can be drawn about the relationship between perceived difficulty and learning effectiveness?",
    "options": [
      {
        "text": "Greater perceived difficulty often indicates more effective learning",
        "rationale": "The concept of 'desirable difficulty' supports this conclusion"
      },
      {
        "text": "Easier practice methods yield better results",
        "rationale": "This contradicts the passage's main argument"
      },
      {
        "text": "Perceived difficulty has no impact on learning",
        "rationale": "The passage suggests difficulty plays an important role"
      },
      {
        "text": "Students should avoid difficult practice methods",
        "rationale": "This goes against the passage's central message"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage introduces the concept of 'desirable difficulty' and explains that the increased challenge actually enhances learning",
    "hint": "Look for the connection between difficulty and learning outcomes in the passage",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S8_Q19",
    "type": "reading-comprehension",
    "text": "What would the authors likely predict about a musician who practices multiple different pieces in one session?",
    "options": [
      {
        "text": "They would develop stronger overall musical abilities",
        "rationale": "This aligns with the passage's claims about interleaved practice benefits"
      },
      {
        "text": "They would master each piece more quickly",
        "rationale": "The passage suggests initial learning would be slower"
      },
      {
        "text": "They would feel more confident immediately",
        "rationale": "This contradicts the passage's points about initial difficulty"
      },
      {
        "text": "They would require less practice time",
        "rationale": "The passage doesn't suggest this method reduces necessary practice time"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Based on the passage's discussion of interleaved practice benefits and its application to musicians in paragraph [4], this approach would lead to stronger overall skill development",
    "hint": "Consider how the general benefits of interleaved practice would apply to musical training",
    "paragraphReference": "Paragraphs [2,4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S8_Q20",
    "type": "reading-comprehension",
    "text": "Why might traditional blocked practice remain popular despite evidence supporting interleaved practice?",
    "options": [
      {
        "text": "It provides more visible short-term progress",
        "rationale": "The passage indicates blocked practice appears more productive initially"
      },
      {
        "text": "It requires less equipment",
        "rationale": "The passage doesn't mention equipment requirements"
      },
      {
        "text": "It takes less time overall",
        "rationale": "The passage doesn't compare total time requirements"
      },
      {
        "text": "It is more effective for beginners",
        "rationale": "The passage doesn't suggest this limitation"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explains that people resist interleaved practice because it feels more difficult and shows slower initial progress, suggesting blocked practice's apparent short-term benefits keep it popular",
    "hint": "Think about what makes people resistant to change in learning methods",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S8_Q21",
    "type": "reading-comprehension",
    "text": "In the context of paragraph 1, what does 'conventional wisdom' most closely mean?",
    "options": [
      {
        "text": "Traditional beliefs and knowledge",
        "rationale": "This is correct as the passage contrasts long-held beliefs about practice with new research"
      },
      {
        "text": "Scientific research",
        "rationale": "The passage actually contrasts conventional wisdom with scientific research"
      },
      {
        "text": "Modern teaching methods",
        "rationale": "The passage presents this as opposite to conventional wisdom"
      },
      {
        "text": "Expert opinions",
        "rationale": "While related, this is too specific and doesn't capture the 'traditional' aspect"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses 'conventional wisdom' to refer to traditional beliefs about practice, as evidenced by the contrast with 'recent research'",
    "hint": "Look at how the phrase is used in opposition to 'recent research'",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S8_Q22",
    "type": "reading-comprehension",
    "text": "What does 'interleaved practice' mean according to the passage?",
    "options": [
      {
        "text": "Alternating between different related skills",
        "rationale": "This correctly matches the passage's definition"
      },
      {
        "text": "Repeating the same skill continuously",
        "rationale": "This describes blocked practice, not interleaved practice"
      },
      {
        "text": "Practicing at regular intervals",
        "rationale": "This isn't mentioned in the passage's definition"
      },
      {
        "text": "Learning multiple unrelated skills",
        "rationale": "The passage specifies 'different but related skills'"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly defines interleaved practice as 'alternating between different but related skills during learning sessions'",
    "hint": "Look for the direct definition provided in paragraph 2",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S8_Q23",
    "type": "reading-comprehension",
    "text": "What is meant by 'desirable difficulty' in the passage?",
    "options": [
      {
        "text": "Beneficial challenging conditions that enhance learning",
        "rationale": "This correctly captures the concept as explained in the passage"
      },
      {
        "text": "Unnecessary obstacles to learning",
        "rationale": "The passage presents these difficulties as beneficial, not unnecessary"
      },
      {
        "text": "Errors in practice methods",
        "rationale": "While mistakes are mentioned, this isn't the meaning of the term"
      },
      {
        "text": "Complex learning materials",
        "rationale": "This is too narrow and misses the beneficial aspect of the difficulty"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explains that this phenomenon of increased difficulty actually enhances learning by forcing more cognitive effort",
    "hint": "Consider why the word 'desirable' is paired with 'difficulty'",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S8_Q24",
    "type": "reading-comprehension",
    "text": "Based on the passage, what does 'robust' mean in the phrase 'more robust skills'?",
    "options": [
      {
        "text": "Stronger and more well-developed",
        "rationale": "This best matches the context of improved skill development"
      },
      {
        "text": "Faster to execute",
        "rationale": "Speed isn't mentioned as a benefit in the passage"
      },
      {
        "text": "More complicated",
        "rationale": "Complexity isn't the focus of the skill development described"
      },
      {
        "text": "Recently learned",
        "rationale": "This doesn't align with the context of skill improvement"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses 'robust' to describe better-developed skills resulting from interleaved practice",
    "hint": "Look at how the word is used in describing the benefits of varied practice",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S8_Q25",
    "type": "reading-comprehension",
    "text": "What does the phrase 'neural pathways' refer to in the passage?",
    "options": [
      {
        "text": "Brain connections for learning and memory",
        "rationale": "This correctly reflects the learning context discussed"
      },
      {
        "text": "Physical exercise routines",
        "rationale": "While exercise is mentioned, this isn't the meaning of neural pathways"
      },
      {
        "text": "Practice schedules",
        "rationale": "This confuses the method with the biological result"
      },
      {
        "text": "Teaching methods",
        "rationale": "This mistakes the biological concept for pedagogical approaches"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses 'neural pathways' in the context of brain processes that strengthen learning and retention",
    "hint": "Think about the biological aspects of learning mentioned in the passage",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "mixedpractice"
    ],
    "metadata": {
      "topic": "MixedPractice",
      "questionNumber": 25,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 25"
  }
];

// Legacy exports for backward compatibility
export const mediumMixedPracticePassageText = passage;
export const mediumMixedPracticeReadingQuestions = questions;