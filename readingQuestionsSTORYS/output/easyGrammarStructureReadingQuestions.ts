import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "Why Words Dance Together in Sentences",
  "difficulty": "easy",
  "topic": "GrammarStructure",
  "wordCount": 193,
  "numQuestions": 25,
  "estimatedTime": 2,
  "topicId": 1
};

// Reading passage - Why Words Dance Together in Sentences (easy level)
export const passage = `[1] Have you ever wondered why words need to follow specific patterns in sentences? Just like dancers moving together in a choreographed routine, words must follow certain rules to create meaning. These rules, which we call grammar, help us communicate clearly with one another and avoid confusion in our daily conversations and writing.

[2] The basic pattern in English sentences starts with a subject, followed by a verb, and often ends with an object. For example, in the sentence "The cat chased the mouse," we can easily identify who did the action (the cat), what they did (chased), and who received the action (the mouse). This simple pattern helps readers understand exactly what happened, even if they are just beginning to learn English.

[3] Different types of sentences add variety to our language. Questions reverse the normal order by putting helping verbs first, like "Did the cat chase the mouse?" Commands often start with the main verb, such as "Chase the mouse!" Understanding these patterns is similar to learning the steps of different dances – once you know the basic moves, you can combine them in interesting ways to express your thoughts clearly.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S1_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the main purpose of grammar rules?",
    "options": [
      {
        "text": "To help us communicate clearly and avoid confusion",
        "rationale": "This is explicitly stated in paragraph 1 as the purpose of grammar rules"
      },
      {
        "text": "To make writing more complicated",
        "rationale": "This contradicts the passage's explanation of grammar as helpful rules"
      },
      {
        "text": "To create new words",
        "rationale": "The passage doesn't mention grammar creating new words"
      },
      {
        "text": "To make sentences longer",
        "rationale": "The passage doesn't suggest this as a purpose of grammar"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [1] explicitly states that grammar rules 'help us communicate clearly with one another and avoid confusion in our daily conversations and writing.'",
    "hint": "Look for the explanation that follows the dance metaphor in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S1_Q2",
    "type": "reading-comprehension",
    "text": "What is the basic pattern of English sentences according to the passage?",
    "options": [
      {
        "text": "Object, verb, subject",
        "rationale": "This is incorrect order according to the passage"
      },
      {
        "text": "Subject, verb, object",
        "rationale": "This is the correct basic pattern explicitly stated in the passage"
      },
      {
        "text": "Verb, subject, object",
        "rationale": "This is not the pattern described in the passage"
      },
      {
        "text": "Subject, object, verb",
        "rationale": "This order contradicts the passage's explanation"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] clearly states that English sentences start with a subject, followed by a verb, and often end with an object",
    "hint": "Think about the example given with the cat and mouse",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S1_Q3",
    "type": "reading-comprehension",
    "text": "In the sentence 'The cat chased the mouse,' what is the object?",
    "options": [
      {
        "text": "The cat",
        "rationale": "The cat is the subject, not the object"
      },
      {
        "text": "Chased",
        "rationale": "Chased is the verb, not the object"
      },
      {
        "text": "The mouse",
        "rationale": "This is correct as it receives the action"
      },
      {
        "text": "The",
        "rationale": "'The' is an article, not an object"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "In Paragraph [2], the passage explains that 'the mouse' receives the action, making it the object of the sentence",
    "hint": "Look for what receives the action in the sentence",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S1_Q4",
    "type": "reading-comprehension",
    "text": "How do question sentences differ from regular sentences?",
    "options": [
      {
        "text": "They put helping verbs first",
        "rationale": "This is correctly stated in paragraph 3"
      },
      {
        "text": "They remove all verbs",
        "rationale": "The passage doesn't suggest this"
      },
      {
        "text": "They add extra words",
        "rationale": "This isn't mentioned as a characteristic of questions"
      },
      {
        "text": "They remove the subject",
        "rationale": "The passage doesn't indicate this change"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] states that questions 'reverse the normal order by putting helping verbs first'",
    "hint": "Look for how the word order changes in questions",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S1_Q5",
    "type": "reading-comprehension",
    "text": "What metaphor does the passage use to explain how grammar works?",
    "options": [
      {
        "text": "A musical performance",
        "rationale": "Music isn't used as a metaphor in the passage"
      },
      {
        "text": "A dance routine",
        "rationale": "The passage explicitly compares grammar rules to dancers in a choreographed routine"
      },
      {
        "text": "A sports game",
        "rationale": "Sports aren't mentioned in the passage"
      },
      {
        "text": "A painting",
        "rationale": "Art isn't used as a metaphor in the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [1] compares words following grammar rules to 'dancers moving together in a choreographed routine'",
    "hint": "Look for the comparison made in the first sentence of the passage",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S1_Q6",
    "type": "reading-comprehension",
    "text": "What is the main comparison used to explain grammar rules in the passage?",
    "options": [
      {
        "text": "Dance choreography",
        "rationale": "Correct - the passage explicitly compares word patterns to dancers following choreographed routines in paragraph [1]"
      },
      {
        "text": "Musical notes",
        "rationale": "Incorrect - while this might relate to patterns, the passage never mentions music"
      },
      {
        "text": "Traffic rules",
        "rationale": "Incorrect - traffic rules are not mentioned in the passage"
      },
      {
        "text": "Building blocks",
        "rationale": "Incorrect - while this could relate to structure, it's not the comparison used in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "In paragraph [1], the author directly compares grammar rules to dancers moving together in a choreographed routine to illustrate how words must follow patterns.",
    "hint": "Look for the metaphor used in the first paragraph to explain how words work together.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S1_Q7",
    "type": "reading-comprehension",
    "text": "What is the basic pattern of English sentences according to the passage?",
    "options": [
      {
        "text": "Subject-verb-object",
        "rationale": "Correct - paragraph [2] explicitly states this as the basic English sentence pattern"
      },
      {
        "text": "Verb-subject-object",
        "rationale": "Incorrect - this is not the pattern described in the passage"
      },
      {
        "text": "Object-subject-verb",
        "rationale": "Incorrect - this order would not follow English grammar rules as described"
      },
      {
        "text": "Verb-object-subject",
        "rationale": "Incorrect - this is not the standard pattern mentioned in the text"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] clearly states that English sentences start with a subject, followed by a verb, and often end with an object.",
    "hint": "Look for the specific order of sentence elements described in the second paragraph.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S1_Q8",
    "type": "reading-comprehension",
    "text": "How do question sentences differ from the basic pattern?",
    "options": [
      {
        "text": "They put helping verbs first",
        "rationale": "Correct - paragraph [3] specifically states that questions reverse the normal order by putting helping verbs first"
      },
      {
        "text": "They remove the subject",
        "rationale": "Incorrect - the passage doesn't suggest questions remove subjects"
      },
      {
        "text": "They add extra words",
        "rationale": "Incorrect - this is not mentioned as a characteristic of questions"
      },
      {
        "text": "They change the object position",
        "rationale": "Incorrect - the passage doesn't discuss object position in questions"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "According to paragraph [3], questions modify the normal sentence pattern by placing helping verbs at the beginning.",
    "hint": "Check paragraph [3] for how question formation differs from standard sentences.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S1_Q9",
    "type": "reading-comprehension",
    "text": "What is the primary purpose of grammar rules according to the passage?",
    "options": [
      {
        "text": "To help communicate clearly and avoid confusion",
        "rationale": "Correct - paragraph [1] directly states this as the purpose of grammar rules"
      },
      {
        "text": "To make writing more complex",
        "rationale": "Incorrect - the passage emphasizes clarity, not complexity"
      },
      {
        "text": "To create poetry",
        "rationale": "Incorrect - this is not mentioned as a purpose of grammar rules"
      },
      {
        "text": "To impress others",
        "rationale": "Incorrect - this is not stated as a purpose in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage states in paragraph [1] that grammar rules help us communicate clearly and avoid confusion in conversations and writing.",
    "hint": "Consider what paragraph [1] says about why we need grammar rules.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S1_Q10",
    "type": "reading-comprehension",
    "text": "How does the passage describe command sentences?",
    "options": [
      {
        "text": "They often start with the main verb",
        "rationale": "Correct - paragraph [3] explicitly states that commands often start with the main verb"
      },
      {
        "text": "They always end with an exclamation mark",
        "rationale": "Incorrect - while an example uses an exclamation mark, this isn't stated as a rule"
      },
      {
        "text": "They must include a subject",
        "rationale": "Incorrect - the passage doesn't make this claim about commands"
      },
      {
        "text": "They are longer than regular sentences",
        "rationale": "Incorrect - the passage doesn't discuss command sentence length"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "According to paragraph [3], command sentences typically begin with the main verb, as demonstrated in the example 'Chase the mouse!'",
    "hint": "Look at how paragraph [3] describes the structure of command sentences.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S1_Q11",
    "type": "reading-comprehension",
    "text": "What is the main comparison used to explain grammar rules in the passage?",
    "options": [
      {
        "text": "Dancing and choreography",
        "rationale": "Correct - the passage explicitly compares word patterns to dancers following choreographed routines in paragraph [1]"
      },
      {
        "text": "Music and rhythm",
        "rationale": "Incorrect - while related to dance, music is not mentioned as a comparison in the passage"
      },
      {
        "text": "Sports and athletics",
        "rationale": "Incorrect - no comparison to sports is made in the passage"
      },
      {
        "text": "Mathematics and equations",
        "rationale": "Incorrect - the passage doesn't compare grammar to mathematical patterns"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage begins by comparing grammar rules to dancers following choreographed routines, using this analogy throughout to explain how words must follow patterns.",
    "hint": "Look for the metaphor introduced in the first paragraph that helps explain how words work together.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S1_Q12",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the basic pattern of English sentences?",
    "options": [
      {
        "text": "Subject + Verb + Object",
        "rationale": "Correct - paragraph [2] explicitly states this as the basic English sentence pattern"
      },
      {
        "text": "Verb + Subject + Object",
        "rationale": "Incorrect - this is not the pattern described in the passage"
      },
      {
        "text": "Object + Subject + Verb",
        "rationale": "Incorrect - this order is not mentioned as the basic pattern"
      },
      {
        "text": "Subject + Object + Verb",
        "rationale": "Incorrect - this is not the pattern described in paragraph [2]"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] clearly states that English sentences start with a subject, followed by a verb, and often end with an object.",
    "hint": "Look for the specific order of sentence elements described in the second paragraph.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S1_Q13",
    "type": "reading-comprehension",
    "text": "How do question sentences differ from the basic sentence pattern?",
    "options": [
      {
        "text": "They put helping verbs first",
        "rationale": "Correct - paragraph [3] explicitly states that questions reverse the normal order by putting helping verbs first"
      },
      {
        "text": "They remove the subject",
        "rationale": "Incorrect - the passage doesn't mention removing subjects in questions"
      },
      {
        "text": "They add extra words at the end",
        "rationale": "Incorrect - this is not mentioned as a characteristic of questions"
      },
      {
        "text": "They change the object position",
        "rationale": "Incorrect - the passage only mentions moving helping verbs to the front"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage explains that questions modify the basic sentence pattern by placing helping verbs at the beginning of the sentence.",
    "hint": "Check paragraph [3] for how question formation differs from standard sentences.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S1_Q14",
    "type": "reading-comprehension",
    "text": "What example is used to demonstrate the basic sentence pattern?",
    "options": [
      {
        "text": "The cat chased the mouse",
        "rationale": "Correct - this exact example is used in paragraph [2] to demonstrate the subject-verb-object pattern"
      },
      {
        "text": "Chase the mouse",
        "rationale": "Incorrect - this is used as an example of a command, not the basic pattern"
      },
      {
        "text": "Did the cat chase the mouse",
        "rationale": "Incorrect - this is used as an example of a question"
      },
      {
        "text": "The mouse ran away",
        "rationale": "Incorrect - this example does not appear in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage uses 'The cat chased the mouse' to demonstrate who did the action (subject), what they did (verb), and who received the action (object).",
    "hint": "Look for the example sentence in paragraph [2] that shows all three parts of the basic pattern.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S1_Q15",
    "type": "reading-comprehension",
    "text": "How does the passage describe command sentences?",
    "options": [
      {
        "text": "They often start with the main verb",
        "rationale": "Correct - paragraph [3] explicitly states that commands often start with the main verb"
      },
      {
        "text": "They always end with an exclamation mark",
        "rationale": "Incorrect - while the example uses an exclamation mark, this is not described as a requirement"
      },
      {
        "text": "They must include a subject",
        "rationale": "Incorrect - the passage doesn't state this about commands"
      },
      {
        "text": "They follow the basic sentence pattern",
        "rationale": "Incorrect - the passage indicates they have a different pattern starting with the verb"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "According to paragraph [3], command sentences typically begin with the main verb, as shown in the example 'Chase the mouse!'",
    "hint": "Check paragraph [3] for the specific characteristic of command sentences.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S1_Q16",
    "type": "reading-comprehension",
    "text": "Based on paragraph [1], why does the author compare grammar rules to a choreographed dance routine?",
    "options": [
      {
        "text": "Both require specific patterns to work effectively",
        "rationale": "Correct - the comparison emphasizes how both grammar and dance need structured patterns to create meaning"
      },
      {
        "text": "Both are forms of entertainment",
        "rationale": "Incorrect - the passage doesn't suggest grammar is for entertainment"
      },
      {
        "text": "Both are difficult to learn",
        "rationale": "Incorrect - the passage doesn't discuss difficulty level"
      },
      {
        "text": "Both require multiple participants",
        "rationale": "Incorrect - grammar rules apply even to single-person communication"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The author uses the dance analogy to illustrate how words must follow specific patterns (rules) to create meaning, just as dancers follow choreographed steps",
    "hint": "Think about what dancers and words both need to follow to be successful",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S1_Q17",
    "type": "reading-comprehension",
    "text": "What can be inferred from paragraph [2] about the importance of subject-verb-object order in English?",
    "options": [
      {
        "text": "It helps beginners understand basic meaning",
        "rationale": "Correct - the passage explicitly states this helps readers understand 'exactly what happened'"
      },
      {
        "text": "It is the only possible sentence structure",
        "rationale": "Incorrect - paragraph [3] mentions other structures"
      },
      {
        "text": "It makes sentences longer",
        "rationale": "Incorrect - the passage doesn't discuss sentence length"
      },
      {
        "text": "It was recently invented",
        "rationale": "Incorrect - no timeline information is provided"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage indicates this basic pattern helps readers, especially beginners, understand the meaning of sentences clearly",
    "hint": "Look for the benefit mentioned for new English learners",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S1_Q18",
    "type": "reading-comprehension",
    "text": "According to paragraph [3], how are questions formed differently from standard sentences?",
    "options": [
      {
        "text": "By placing helping verbs at the beginning",
        "rationale": "Correct - the passage explicitly states questions reverse order by putting helping verbs first"
      },
      {
        "text": "By adding punctuation only",
        "rationale": "Incorrect - the passage mentions word order change, not just punctuation"
      },
      {
        "text": "By removing the subject",
        "rationale": "Incorrect - questions still contain subjects"
      },
      {
        "text": "By lengthening the sentence",
        "rationale": "Incorrect - length is not mentioned as a factor"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage specifically states that questions reverse the normal order by putting helping verbs first",
    "hint": "Focus on what moves to the beginning of the sentence in questions",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S1_Q19",
    "type": "reading-comprehension",
    "text": "What inference can be made about commands based on paragraphs [2] and [3]?",
    "options": [
      {
        "text": "They follow a different pattern than standard sentences",
        "rationale": "Correct - commands start with the main verb, unlike the subject-verb-object pattern"
      },
      {
        "text": "They are more complex than questions",
        "rationale": "Incorrect - complexity is not compared"
      },
      {
        "text": "They must include objects",
        "rationale": "Incorrect - the passage doesn't state this requirement"
      },
      {
        "text": "They are rarely used",
        "rationale": "Incorrect - frequency of use is not discussed"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "By comparing the command structure to the standard subject-verb-object pattern, we can infer commands are distinct in their organization",
    "hint": "Compare the command example with the basic sentence pattern",
    "paragraphReference": "Paragraphs [2-3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S1_Q20",
    "type": "reading-comprehension",
    "text": "What overall conclusion about grammar can be drawn from all three paragraphs?",
    "options": [
      {
        "text": "It provides structured ways to convey meaning",
        "rationale": "Correct - all paragraphs emphasize how grammar patterns help create clear communication"
      },
      {
        "text": "It is primarily used in writing",
        "rationale": "Incorrect - the passage mentions both conversations and writing"
      },
      {
        "text": "It is unnecessarily complex",
        "rationale": "Incorrect - the passage presents grammar as helpful, not complex"
      },
      {
        "text": "It changes frequently",
        "rationale": "Incorrect - the passage doesn't discuss grammar changes"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Throughout the passage, grammar is presented as a system of patterns that helps people communicate clearly and effectively",
    "hint": "Consider the main purpose of grammar as described across all paragraphs",
    "paragraphReference": "Paragraphs [1-3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S1_Q21",
    "type": "reading-comprehension",
    "text": "Based on paragraph [1], what does the word 'choreographed' most closely mean in the context of the passage?",
    "options": [
      {
        "text": "planned and organized",
        "rationale": "Correct - the passage compares grammar rules to planned dance movements"
      },
      {
        "text": "spontaneous and random",
        "rationale": "Incorrect - choreographed implies structure, not spontaneity"
      },
      {
        "text": "difficult and complex",
        "rationale": "Incorrect - while dances can be complex, the word specifically refers to organization"
      },
      {
        "text": "beautiful and artistic",
        "rationale": "Incorrect - while dances are artistic, the focus is on organization"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage uses 'choreographed' to compare grammar rules to organized dance movements, emphasizing the planned nature of both.",
    "hint": "Think about how dancers follow specific steps in a routine",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S1_Q22",
    "type": "reading-comprehension",
    "text": "In paragraph [2], what does the phrase 'received the action' mean?",
    "options": [
      {
        "text": "was affected by what happened",
        "rationale": "Correct - it refers to the object that the action was done to"
      },
      {
        "text": "performed the action",
        "rationale": "Incorrect - this describes the subject, not the receiver"
      },
      {
        "text": "watched the action",
        "rationale": "Incorrect - receiving an action means being directly affected by it"
      },
      {
        "text": "created the action",
        "rationale": "Incorrect - this would describe the subject's role"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "In the example sentence, the mouse 'receives' or is affected by the action of being chased by the cat.",
    "hint": "Look at who or what the action is being done to in the example sentence",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S1_Q23",
    "type": "reading-comprehension",
    "text": "What does the word 'pattern' mean as used in paragraph [2]?",
    "options": [
      {
        "text": "a regular and repeated arrangement",
        "rationale": "Correct - refers to the consistent way words are ordered in sentences"
      },
      {
        "text": "a decorative design",
        "rationale": "Incorrect - not using the design meaning of pattern"
      },
      {
        "text": "a sewing template",
        "rationale": "Incorrect - not using the crafting meaning of pattern"
      },
      {
        "text": "a natural tendency",
        "rationale": "Incorrect - though related, not the specific meaning used here"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage uses 'pattern' to describe the consistent subject-verb-object arrangement in English sentences.",
    "hint": "Consider how the passage describes the order of words in sentences",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S1_Q24",
    "type": "reading-comprehension",
    "text": "In paragraph [3], what does 'reverse' mean when discussing questions?",
    "options": [
      {
        "text": "to change to the opposite order",
        "rationale": "Correct - describes how questions switch the normal word order"
      },
      {
        "text": "to go backward",
        "rationale": "Incorrect - too literal; not about physical movement"
      },
      {
        "text": "to undo",
        "rationale": "Incorrect - not about undoing an action"
      },
      {
        "text": "to return",
        "rationale": "Incorrect - not about returning to a previous state"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage shows how questions 'reverse' word order by putting helping verbs first, changing from the normal pattern.",
    "hint": "Look at how the word order changes in the question example",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S1_Q25",
    "type": "reading-comprehension",
    "text": "What does the word 'combine' mean in paragraph [3]?",
    "options": [
      {
        "text": "to join or put together",
        "rationale": "Correct - refers to mixing different sentence patterns"
      },
      {
        "text": "to eliminate",
        "rationale": "Incorrect - opposite of the intended meaning"
      },
      {
        "text": "to separate",
        "rationale": "Incorrect - opposite of the intended meaning"
      },
      {
        "text": "to simplify",
        "rationale": "Incorrect - not about making things simpler"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage uses 'combine' to describe how different sentence patterns can be mixed together, like dance steps.",
    "hint": "Think about how dance steps can be mixed together to create routines",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "grammarstructure"
    ],
    "metadata": {
      "topic": "GrammarStructure",
      "questionNumber": 25,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 25"
  }
];

// Legacy exports for backward compatibility
export const easyGrammarStructurePassageText = passage;
export const easyGrammarStructureReadingQuestions = questions;