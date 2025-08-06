import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "Could You Have Should Have Would Have?",
  "difficulty": "hard",
  "topic": "GrammarModals",
  "wordCount": 366,
  "numQuestions": 25,
  "estimatedTime": 5,
  "topicId": 5
};

// Reading passage - Could You Have Should Have Would Have? (hard level)
export const passage = `[1] The peculiar relationship between modal verbs and their perfect forms has long fascinated linguists and language learners alike. When "could have," "should have," and "would have" enter a conversation, they bring with them complex layers of meaning about past possibilities, missed opportunities, and hypothetical scenarios that never materialized. These modal perfect constructions serve as linguistic time machines, allowing speakers to revisit past decisions and contemplate alternative outcomes with varying degrees of probability, obligation, or capacity.

[2] Consider how "could have" operates in expressing past ability or possibility. When someone says, "I could have become a doctor," they're not merely stating a past capability; they're suggesting that circumstances, choices, or external factors prevented this potential from becoming reality. This differs markedly from "should have," which carries the weight of moral obligation or better judgment. A statement like "You should have informed me earlier" implies not just that an action was possible, but that it was the preferable or correct course of action that, regrettably, wasn't taken.

[3] "Would have" presents perhaps the most intriguing case, as it often appears in conditional constructions that explore counterfactual situations. When someone declares, "If I had studied harder, I would have passed the exam," they're constructing an alternative timeline where different actions led to different results. This powerful grammatical tool allows speakers to express everything from mild regret to deep contemplation of life's pivotal moments. The complexity increases when these modal perfects combine with continuous forms or appear in passive constructions, creating subtle shades of meaning that even advanced learners find challenging to master.

[4] The mastery of these modal perfect forms represents a significant milestone in language proficiency, as they require not just grammatical knowledge but also a sophisticated understanding of context and implication. In professional settings, the ability to use these constructions appropriately can mean the difference between expressing polite suggestion and harsh criticism, between acknowledging past possibilities and dwelling on regrets. Whether in academic writing, business communication, or everyday conversation, these verbal constructions serve as essential tools for expressing nuanced thoughts about past events and their theoretical alternatives, demonstrating the remarkable flexibility and precision of the English language in capturing human contemplation of what might have been.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S5_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the primary function of modal perfect constructions?",
    "options": [
      {
        "text": "They act as linguistic time machines to explore past alternatives",
        "rationale": "This is directly stated in paragraph 1 and aligns with the passage's main theme"
      },
      {
        "text": "They help speakers use proper grammar",
        "rationale": "While grammar is involved, this is not the primary function described"
      },
      {
        "text": "They make English sentences more formal",
        "rationale": "Formality is not mentioned as a primary function"
      },
      {
        "text": "They simplify complex verb tenses",
        "rationale": "The passage actually suggests they add complexity rather than simplify"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states in paragraph 1 that these constructions serve as 'linguistic time machines, allowing speakers to revisit past decisions and contemplate alternative outcomes.'",
    "hint": "Look for the metaphorical description in the first paragraph that explains their purpose.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S5_Q2",
    "type": "reading-comprehension",
    "text": "How does the passage distinguish 'could have' from 'should have'?",
    "options": [
      {
        "text": "Could have expresses past possibility while should have implies moral obligation",
        "rationale": "This correctly captures the distinction made in paragraph 2"
      },
      {
        "text": "Could have is about the future while should have is about the past",
        "rationale": "Both forms relate to the past according to the passage"
      },
      {
        "text": "Could have is formal while should have is informal",
        "rationale": "The passage doesn't discuss formality levels"
      },
      {
        "text": "Could have is certain while should have is uncertain",
        "rationale": "This contradicts the passage's explanation"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 2 explicitly contrasts 'could have' as expressing past ability or possibility with 'should have' as carrying 'the weight of moral obligation or better judgment.'",
    "hint": "Focus on how paragraph 2 defines the different implications of each phrase.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S5_Q3",
    "type": "reading-comprehension",
    "text": "What makes 'would have' particularly interesting according to the passage?",
    "options": [
      {
        "text": "Its use in conditional constructions exploring counterfactual situations",
        "rationale": "This matches the passage's description of what makes would have intriguing"
      },
      {
        "text": "Its simple grammatical structure",
        "rationale": "The passage actually emphasizes its complexity"
      },
      {
        "text": "Its modern usage patterns",
        "rationale": "Modern usage is not discussed in the passage"
      },
      {
        "text": "Its formal application",
        "rationale": "Formality is not mentioned as what makes it interesting"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 3 states that 'would have' is 'most intriguing' because it appears in conditional constructions exploring counterfactual situations.",
    "hint": "Look for what the passage describes as unique about 'would have' in paragraph 3.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S5_Q4",
    "type": "reading-comprehension",
    "text": "What does mastery of modal perfect forms indicate according to the passage?",
    "options": [
      {
        "text": "A significant milestone in language proficiency",
        "rationale": "This is explicitly stated in paragraph 4"
      },
      {
        "text": "Basic English competency",
        "rationale": "The passage suggests it's an advanced skill, not basic"
      },
      {
        "text": "Native speaker status",
        "rationale": "Native speaker status is not mentioned in the passage"
      },
      {
        "text": "Academic excellence",
        "rationale": "While academic writing is mentioned, it's not described as the indicator"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states in paragraph 4 that mastery of these forms represents 'a significant milestone in language proficiency.'",
    "hint": "Check paragraph 4 for how the passage characterizes the achievement of mastering these forms.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S5_Q5",
    "type": "reading-comprehension",
    "text": "In professional settings, what important function do modal perfect forms serve?",
    "options": [
      {
        "text": "Distinguishing between polite suggestion and harsh criticism",
        "rationale": "This is directly stated in paragraph 4 as a key function"
      },
      {
        "text": "Making communications more formal",
        "rationale": "Formality is not mentioned as a key function"
      },
      {
        "text": "Speeding up communication",
        "rationale": "Communication speed is not discussed in the passage"
      },
      {
        "text": "Simplifying complex ideas",
        "rationale": "The passage suggests they add nuance rather than simplify"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 4 specifically mentions that in professional settings, these forms help distinguish 'between expressing polite suggestion and harsh criticism.'",
    "hint": "Look for the specific professional communication benefit mentioned in the final paragraph.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S5_Q6",
    "type": "reading-comprehension",
    "text": "What is the primary function of modal perfect constructions according to the passage?",
    "options": [
      {
        "text": "To serve as linguistic time machines for exploring past possibilities",
        "rationale": "This accurately reflects the passage's description of how these constructions allow speakers to revisit past decisions and contemplate alternatives"
      },
      {
        "text": "To teach proper English grammar",
        "rationale": "While grammar is mentioned, this is not the primary function described in the passage"
      },
      {
        "text": "To express future possibilities",
        "rationale": "The passage focuses on past events and alternatives, not future possibilities"
      },
      {
        "text": "To simplify complex language structures",
        "rationale": "The passage actually presents these constructions as adding complexity to language"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states in paragraph 1 that these constructions serve as 'linguistic time machines' for revisiting past decisions and contemplating alternative outcomes",
    "hint": "Look at how the passage introduces these constructions in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S5_Q7",
    "type": "reading-comprehension",
    "text": "How does the passage differentiate between 'could have' and 'should have'?",
    "options": [
      {
        "text": "'Could have' expresses possibility while 'should have' implies moral obligation",
        "rationale": "This correctly captures the distinction made in the passage"
      },
      {
        "text": "They are used interchangeably",
        "rationale": "The passage explicitly distinguishes between their different uses"
      },
      {
        "text": "'Should have' expresses possibility while 'could have' implies obligation",
        "rationale": "This reverses the actual relationship described in the passage"
      },
      {
        "text": "Neither expression relates to past events",
        "rationale": "The passage clearly indicates both relate to past scenarios"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 2 explicitly contrasts 'could have' as expressing past ability or possibility with 'should have' as carrying moral obligation or better judgment",
    "hint": "Focus on the specific examples provided in the second paragraph",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S5_Q8",
    "type": "reading-comprehension",
    "text": "What makes 'would have' particularly interesting according to the passage?",
    "options": [
      {
        "text": "Its role in conditional constructions exploring counterfactual situations",
        "rationale": "This correctly identifies the unique aspect of 'would have' described in the passage"
      },
      {
        "text": "Its simplicity of use",
        "rationale": "The passage actually presents it as complex"
      },
      {
        "text": "Its future implications",
        "rationale": "The passage discusses past alternative scenarios, not future ones"
      },
      {
        "text": "Its formal usage",
        "rationale": "While formal usage is mentioned later, this isn't what makes it particularly interesting"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage identifies 'would have' as the most intriguing case specifically because of its role in conditional constructions exploring counterfactual situations",
    "hint": "Look at how the passage introduces and describes 'would have' in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S5_Q9",
    "type": "reading-comprehension",
    "text": "What does mastery of modal perfect forms indicate according to the passage?",
    "options": [
      {
        "text": "A significant milestone in language proficiency",
        "rationale": "This directly matches the passage's statement about what mastery represents"
      },
      {
        "text": "Basic language competence",
        "rationale": "The passage presents this as an advanced rather than basic skill"
      },
      {
        "text": "Native speaker status",
        "rationale": "This is not mentioned in the passage"
      },
      {
        "text": "Perfect grammar knowledge",
        "rationale": "The passage indicates it requires more than just grammatical knowledge"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 4 explicitly states that mastery of these forms represents a significant milestone in language proficiency, requiring both grammatical knowledge and contextual understanding",
    "hint": "Consider what the final paragraph says about the significance of mastering these forms",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S5_Q10",
    "type": "reading-comprehension",
    "text": "In professional settings, what important function do these modal perfect constructions serve?",
    "options": [
      {
        "text": "Distinguishing between polite suggestion and harsh criticism",
        "rationale": "This correctly reflects the professional application described in the passage"
      },
      {
        "text": "Simplifying business communication",
        "rationale": "The passage presents them as adding nuance, not simplifying"
      },
      {
        "text": "Replacing formal language",
        "rationale": "This is not mentioned in the passage"
      },
      {
        "text": "Speeding up communication",
        "rationale": "This is not discussed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage states that in professional settings, these constructions help differentiate between polite suggestion and harsh criticism",
    "hint": "Look for the specific professional applications mentioned in the final paragraph",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S5_Q11",
    "type": "reading-comprehension",
    "text": "What is the primary difference between 'could have' and 'should have' as described in the passage?",
    "options": [
      {
        "text": "'Could have' expresses past possibility while 'should have' implies moral obligation",
        "rationale": "Correct - The passage explicitly contrasts these meanings in paragraph 2"
      },
      {
        "text": "Both express the same level of regret about past actions",
        "rationale": "Incorrect - The passage distinguishes between their different implications"
      },
      {
        "text": "'Should have' expresses possibility while 'could have' implies obligation",
        "rationale": "Incorrect - This reverses the actual meanings described in the passage"
      },
      {
        "text": "Neither expression relates to past events",
        "rationale": "Incorrect - Both expressions specifically deal with past scenarios"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage clearly distinguishes between 'could have' as expressing past ability or possibility, and 'should have' as carrying moral obligation or better judgment, as explained in paragraph 2.",
    "hint": "Focus on how the passage contrasts these two expressions in terms of possibility versus obligation",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S5_Q12",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the most distinctive feature of 'would have' constructions?",
    "options": [
      {
        "text": "Their use in conditional statements about counterfactual situations",
        "rationale": "Correct - The passage emphasizes this as the most intriguing aspect of 'would have'"
      },
      {
        "text": "Their expression of moral obligation",
        "rationale": "Incorrect - This is associated with 'should have', not 'would have'"
      },
      {
        "text": "Their indication of past ability",
        "rationale": "Incorrect - This is associated with 'could have', not 'would have'"
      },
      {
        "text": "Their use in present tense situations",
        "rationale": "Incorrect - The passage discusses 'would have' in relation to past alternative scenarios"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 3 specifically identifies 'would have' as being notable for its role in conditional constructions exploring counterfactual situations, such as 'If I had studied harder, I would have passed the exam.'",
    "hint": "Think about how 'would have' is used to create alternative scenarios of past events",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S5_Q13",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the mastery of modal perfect forms in professional settings?",
    "options": [
      {
        "text": "It can affect the difference between polite suggestion and harsh criticism",
        "rationale": "Correct - The passage explicitly states this in paragraph 4"
      },
      {
        "text": "It is unnecessary for business communication",
        "rationale": "Incorrect - The passage emphasizes its importance in professional settings"
      },
      {
        "text": "It only matters in academic writing",
        "rationale": "Incorrect - The passage mentions multiple contexts including business and everyday conversation"
      },
      {
        "text": "It has no impact on communication effectiveness",
        "rationale": "Incorrect - The passage emphasizes its significant impact on communication"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 4 explicitly states that proper use of these forms in professional settings can determine whether communication comes across as polite suggestion or harsh criticism.",
    "hint": "Look for information about how these forms affect professional communication tone",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S5_Q14",
    "type": "reading-comprehension",
    "text": "How does the passage characterize modal perfect constructions in the first paragraph?",
    "options": [
      {
        "text": "As linguistic time machines for exploring past possibilities",
        "rationale": "Correct - The passage explicitly uses this metaphor"
      },
      {
        "text": "As simple past tense markers",
        "rationale": "Incorrect - The passage presents them as more complex than simple past tense"
      },
      {
        "text": "As future tense indicators",
        "rationale": "Incorrect - The passage focuses on their role in discussing past events"
      },
      {
        "text": "As present tense expressions",
        "rationale": "Incorrect - The passage emphasizes their role in discussing past scenarios"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The first paragraph specifically describes these constructions as 'linguistic time machines' that allow speakers to revisit past decisions and contemplate alternative outcomes.",
    "hint": "Consider the metaphorical description used to explain these constructions' function",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S5_Q15",
    "type": "reading-comprehension",
    "text": "What aspect of modal perfect forms makes them particularly challenging for language learners?",
    "options": [
      {
        "text": "Their combination with continuous forms and passive constructions",
        "rationale": "Correct - The passage specifically mentions this complexity in paragraph 3"
      },
      {
        "text": "Their simple grammatical structure",
        "rationale": "Incorrect - The passage emphasizes their complexity"
      },
      {
        "text": "Their use only in informal settings",
        "rationale": "Incorrect - The passage discusses their use in various contexts"
      },
      {
        "text": "Their limited application",
        "rationale": "Incorrect - The passage emphasizes their broad utility"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage indicates in paragraph 3 that the complexity increases when modal perfects combine with continuous forms or appear in passive constructions, making them challenging even for advanced learners.",
    "hint": "Look for specific grammatical features that add to these constructions' complexity",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S5_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what is the primary difference between 'could have' and 'should have'?",
    "options": [
      {
        "text": "'Could have' expresses potential while 'should have' implies moral obligation",
        "rationale": "This correctly distinguishes between the possibility expressed by 'could have' and the obligation conveyed by 'should have' as explained in paragraph 2"
      },
      {
        "text": "Both express the same level of regret about past actions",
        "rationale": "The passage clearly differentiates between their meanings and implications"
      },
      {
        "text": "'Should have' expresses possibility while 'could have' implies obligation",
        "rationale": "This reverses the actual meanings described in the passage"
      },
      {
        "text": "They are interchangeable in expressing past abilities",
        "rationale": "The passage explicitly describes different functions for these modal verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 2 explicitly contrasts 'could have' as expressing past ability or possibility with 'should have' as carrying 'the weight of moral obligation or better judgment.'",
    "hint": "Focus on how paragraph 2 distinguishes between capability and obligation",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S5_Q17",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the mastery of modal perfect forms in professional settings?",
    "options": [
      {
        "text": "It helps distinguish between polite suggestions and harsh criticism",
        "rationale": "This matches the passage's explicit statement about professional communication"
      },
      {
        "text": "It is only necessary for academic writing",
        "rationale": "The passage mentions multiple contexts, not just academic writing"
      },
      {
        "text": "It has no impact on business communication",
        "rationale": "The passage specifically mentions its importance in business communication"
      },
      {
        "text": "It only affects casual conversation",
        "rationale": "The passage discusses formal and professional contexts"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 4 directly states that in professional settings, proper use of these forms can differentiate between polite suggestion and harsh criticism",
    "hint": "Look for the professional implications mentioned in the final paragraph",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S5_Q18",
    "type": "reading-comprehension",
    "text": "How does the passage characterize 'would have' compared to other modal perfect forms?",
    "options": [
      {
        "text": "As the most intriguing due to its role in conditional constructions",
        "rationale": "This aligns with the passage's direct characterization"
      },
      {
        "text": "As the simplest to understand",
        "rationale": "The passage suggests it's complex, not simple"
      },
      {
        "text": "As rarely used in English",
        "rationale": "The passage indicates it's an important and commonly used form"
      },
      {
        "text": "As having no connection to hypothetical situations",
        "rationale": "The passage explicitly connects it to counterfactual situations"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 3 explicitly describes 'would have' as 'perhaps the most intriguing case' and explains its role in conditional constructions",
    "hint": "Consider how paragraph 3 introduces and describes 'would have'",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S5_Q19",
    "type": "reading-comprehension",
    "text": "What role do modal perfect constructions serve according to the passage?",
    "options": [
      {
        "text": "They act as linguistic time machines for exploring past alternatives",
        "rationale": "This matches the passage's metaphorical description in paragraph 1"
      },
      {
        "text": "They only express future possibilities",
        "rationale": "The passage focuses on past possibilities and alternatives"
      },
      {
        "text": "They are used solely for expressing regret",
        "rationale": "While regret is mentioned, it's only one of many functions described"
      },
      {
        "text": "They have no role in expressing hypothetical scenarios",
        "rationale": "The passage explicitly states they are used for hypothetical scenarios"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 1 describes these constructions as 'linguistic time machines' that allow speakers to revisit past decisions and contemplate alternatives",
    "hint": "Look for the metaphorical description in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S5_Q20",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the relationship between these modal forms and language proficiency?",
    "options": [
      {
        "text": "Mastery indicates advanced understanding of both grammar and context",
        "rationale": "This aligns with the passage's discussion of proficiency requirements"
      },
      {
        "text": "They are easily mastered by beginners",
        "rationale": "The passage suggests they are challenging even for advanced learners"
      },
      {
        "text": "They require only basic grammatical knowledge",
        "rationale": "The passage indicates they require sophisticated understanding"
      },
      {
        "text": "They are irrelevant to language proficiency",
        "rationale": "The passage explicitly connects them to language proficiency"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "Paragraph 4 states that mastery of these forms is a significant milestone requiring both grammatical knowledge and sophisticated understanding of context",
    "hint": "Consider what paragraph 4 says about the requirements for mastering these forms",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S5_Q21",
    "type": "reading-comprehension",
    "text": "Based on the passage, what does 'peculiar' most closely mean in paragraph 1?",
    "options": [
      {
        "text": "Distinctive",
        "rationale": "This best captures the unique and notable nature of the relationship being described"
      },
      {
        "text": "Strange",
        "rationale": "While 'peculiar' can mean strange, the context suggests something more specific about uniqueness"
      },
      {
        "text": "Complicated",
        "rationale": "Though the relationship is complex, 'peculiar' specifically refers to its distinctive qualities"
      },
      {
        "text": "Mysterious",
        "rationale": "The relationship is described as complex but not as unknown or mysterious"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'peculiar' to introduce the distinctive relationship between modal verbs and their perfect forms, emphasizing their unique characteristics rather than suggesting something odd or mysterious.",
    "hint": "Look at how the author describes the relationship throughout the first paragraph - is it presented as strange, or as having unique characteristics?",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S5_Q22",
    "type": "reading-comprehension",
    "text": "What is the best meaning of 'counterfactual' as used in paragraph 3?",
    "options": [
      {
        "text": "Contrary to actual facts",
        "rationale": "This correctly captures the meaning of exploring scenarios that didn't actually happen"
      },
      {
        "text": "Fictional stories",
        "rationale": "While related, this is too broad and misses the specific reference to alternative scenarios"
      },
      {
        "text": "False statements",
        "rationale": "This implies deliberate falsehood rather than hypothetical alternatives"
      },
      {
        "text": "Future possibilities",
        "rationale": "The context clearly refers to past alternatives, not future possibilities"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'counterfactual' in the context of exploring alternative scenarios that didn't actually occur, as demonstrated by the example 'If I had studied harder, I would have passed the exam.'",
    "hint": "Look at the example given after the term is used - what type of situation is being described?",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S5_Q23",
    "type": "reading-comprehension",
    "text": "In the context of paragraph 4, what does 'milestone' suggest about mastering modal perfect forms?",
    "options": [
      {
        "text": "A significant achievement",
        "rationale": "This best matches the context of important progress in language proficiency"
      },
      {
        "text": "A basic requirement",
        "rationale": "The passage presents it as more than just a basic requirement"
      },
      {
        "text": "A final goal",
        "rationale": "Nothing suggests this is a final destination in language learning"
      },
      {
        "text": "A teaching method",
        "rationale": "The word refers to an achievement, not a method of instruction"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage presents mastery of modal perfect forms as a significant achievement in language proficiency, requiring both grammatical knowledge and sophisticated understanding.",
    "hint": "Consider how the word is used in relation to language proficiency and what it suggests about progress.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S5_Q24",
    "type": "reading-comprehension",
    "text": "What does 'linguistic time machines' suggest about modal perfect constructions in paragraph 1?",
    "options": [
      {
        "text": "Tools for examining past possibilities",
        "rationale": "This accurately captures the metaphorical meaning of revisiting past decisions"
      },
      {
        "text": "Actual time travel devices",
        "rationale": "This is a literal interpretation of the metaphor"
      },
      {
        "text": "Grammar rules",
        "rationale": "This is too narrow and misses the metaphorical meaning"
      },
      {
        "text": "Future predictions",
        "rationale": "The passage focuses on past scenarios, not future predictions"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The metaphor 'linguistic time machines' is used to illustrate how these verbal constructions allow speakers to mentally revisit and reconsider past events and decisions.",
    "hint": "Think about what a time machine does and how that relates to discussing past possibilities.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S5_Q25",
    "type": "reading-comprehension",
    "text": "Based on the passage, what does 'nuanced' mean in paragraph 4?",
    "options": [
      {
        "text": "Subtle and precise",
        "rationale": "This best captures the meaning of expressing detailed, refined differences"
      },
      {
        "text": "Complicated",
        "rationale": "While related, this misses the emphasis on subtle distinctions"
      },
      {
        "text": "Important",
        "rationale": "This is too general and misses the focus on subtle differences"
      },
      {
        "text": "Professional",
        "rationale": "This focuses on formality rather than subtle meaning differences"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'nuanced' to describe thoughts that contain subtle, precise distinctions about past events and their alternatives.",
    "hint": "Look at how the word is used in relation to expressing thoughts about past events - what quality of expression is being described?",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "grammarmodals"
    ],
    "metadata": {
      "topic": "GrammarModals",
      "questionNumber": 25,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 25"
  }
];

// Legacy exports for backward compatibility
export const hardGrammarModalsPassageText = passage;
export const hardGrammarModalsReadingQuestions = questions;