import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "Verbs: The Powerhouse of Language",
  "difficulty": "medium",
  "topic": "GrammarVerbs",
  "wordCount": 291,
  "numQuestions": 25,
  "estimatedTime": 3,
  "topicId": 7
};

// Reading passage - Verbs: The Powerhouse of Language (medium level)
export const passage = `[1] Verbs are often called the powerhouse of language because they drive the action and meaning in every sentence we construct. Unlike other parts of speech, verbs have the unique ability to express time through their various tenses, show different states of being, and demonstrate how actions unfold. When we understand how to use verbs effectively, we can transform simple ideas into dynamic expressions that capture precise moments, ongoing activities, or future possibilities.

[2] The versatility of verbs becomes apparent when we examine their different forms and functions. Regular verbs follow predictable patterns, making them relatively straightforward to learn and use. For example, the verb "walk" becomes "walked" in the past tense and "walking" in its progressive form. However, irregular verbs like "go," "see," and "bring" follow their own unique patterns, which often reflect the historical development of the English language. These irregularities, while sometimes challenging for learners, add richness and complexity to our linguistic expression.

[3] Perhaps the most fascinating aspect of verbs is their ability to change the entire mood and tone of communication. Modal verbs such as "could," "should," and "might" allow speakers to express possibility, necessity, or uncertainty. Meanwhile, helping verbs like "have," "be," and "do" work alongside main verbs to create precise meanings and express complex timeframes. This sophisticated system enables English speakers to convey subtle differences in meaning that might otherwise be difficult to express.

[4] The impact of verbs extends beyond basic communication into the realm of creative and academic writing. Strong verb choices can transform mundane descriptions into vivid imagery, while precise verb tenses help writers maintain consistency and clarity in their work. Whether in storytelling, academic essays, or everyday conversation, mastering the use of verbs remains essential for effective communication in English.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S7_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, what makes verbs unique compared to other parts of speech?",
    "options": [
      {
        "text": "Their ability to express time through tenses",
        "rationale": "This is correct as the passage explicitly states verbs have the 'unique ability to express time through their various tenses'"
      },
      {
        "text": "Their length in pronunciation",
        "rationale": "The passage makes no mention of pronunciation characteristics"
      },
      {
        "text": "Their placement in sentences",
        "rationale": "Sentence placement is not mentioned as a unique characteristic of verbs"
      },
      {
        "text": "Their spelling patterns",
        "rationale": "While spelling patterns are discussed for regular/irregular verbs, this is not identified as what makes verbs unique"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically states that verbs have the 'unique ability to express time through their various tenses,' which distinguishes them from other parts of speech.",
    "hint": "Look for characteristics that are explicitly described as unique to verbs in the first paragraph.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S7_Q2",
    "type": "reading-comprehension",
    "text": "Which example of a regular verb pattern is provided in the passage?",
    "options": [
      {
        "text": "walk → walked → walking",
        "rationale": "This is the exact example given in the passage to demonstrate regular verb patterns"
      },
      {
        "text": "go → went → gone",
        "rationale": "This is mentioned as an irregular verb example"
      },
      {
        "text": "see → saw → seen",
        "rationale": "This is mentioned as an irregular verb example"
      },
      {
        "text": "bring → brought → bringing",
        "rationale": "This is mentioned as an irregular verb example"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage uses 'walk' as an example of a regular verb, showing its past tense form 'walked' and progressive form 'walking' to demonstrate predictable patterns.",
    "hint": "Look for the verb example that demonstrates predictable patterns in Paragraph 2.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S7_Q3",
    "type": "reading-comprehension",
    "text": "What role do modal verbs play in communication according to the passage?",
    "options": [
      {
        "text": "They express possibility, necessity, or uncertainty",
        "rationale": "This directly matches what the passage states about modal verbs"
      },
      {
        "text": "They create past tense forms",
        "rationale": "This is not mentioned as a function of modal verbs"
      },
      {
        "text": "They form regular verb patterns",
        "rationale": "The passage does not associate this with modal verbs"
      },
      {
        "text": "They generate vivid imagery",
        "rationale": "This is mentioned in relation to strong verb choices in general, not modal verbs specifically"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly states that modal verbs like 'could,' 'should,' and 'might' allow speakers to express possibility, necessity, or uncertainty.",
    "hint": "Look for specific functions of modal verbs mentioned in Paragraph 3.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S7_Q4",
    "type": "reading-comprehension",
    "text": "Which helping verbs are identified in the passage?",
    "options": [
      {
        "text": "have, be, do",
        "rationale": "These are exactly the helping verbs listed in the passage"
      },
      {
        "text": "could, should, might",
        "rationale": "These are listed as modal verbs, not helping verbs"
      },
      {
        "text": "walk, see, bring",
        "rationale": "These are mentioned as examples of regular and irregular verbs"
      },
      {
        "text": "can, will, must",
        "rationale": "These verbs are not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically identifies 'have,' 'be,' and 'do' as helping verbs that work with main verbs to create precise meanings.",
    "hint": "Look for the specific list of helping verbs in Paragraph 3.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S7_Q5",
    "type": "reading-comprehension",
    "text": "How do strong verb choices benefit writing according to the passage?",
    "options": [
      {
        "text": "They transform mundane descriptions into vivid imagery",
        "rationale": "This is exactly what the passage states about strong verb choices"
      },
      {
        "text": "They make sentences shorter",
        "rationale": "This benefit is not mentioned in the passage"
      },
      {
        "text": "They improve spelling accuracy",
        "rationale": "This is not mentioned as a benefit of strong verb choices"
      },
      {
        "text": "They simplify grammar rules",
        "rationale": "This is not discussed as a benefit in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states that strong verb choices can transform mundane descriptions into vivid imagery, specifically in the context of creative and academic writing.",
    "hint": "Look for the specific benefit of strong verb choices mentioned in the final paragraph.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S7_Q6",
    "type": "reading-comprehension",
    "text": "Why are verbs referred to as the 'powerhouse of language' in the passage?",
    "options": [
      {
        "text": "Because they drive action and express time through various tenses",
        "rationale": "This is correct as paragraph 1 explicitly states verbs drive action and can express time through tenses"
      },
      {
        "text": "Because they are the most common words in English",
        "rationale": "The passage does not make this claim about frequency"
      },
      {
        "text": "Because they are the easiest parts of speech to learn",
        "rationale": "The passage actually mentions some verbs can be challenging to learn"
      },
      {
        "text": "Because they are always the longest words in sentences",
        "rationale": "Word length is not discussed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage directly states in paragraph 1 that verbs are called the powerhouse because they drive action and meaning, and can express time through tenses.",
    "hint": "Look at how verbs are introduced and described in the first paragraph.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S7_Q7",
    "type": "reading-comprehension",
    "text": "What is the main difference between regular and irregular verbs according to the passage?",
    "options": [
      {
        "text": "Regular verbs follow predictable patterns while irregular verbs have unique patterns",
        "rationale": "This correctly summarizes the distinction made in paragraph 2"
      },
      {
        "text": "Regular verbs are more common than irregular verbs",
        "rationale": "The passage doesn't compare frequency of usage"
      },
      {
        "text": "Regular verbs are easier to pronounce",
        "rationale": "Pronunciation is not discussed in the passage"
      },
      {
        "text": "Regular verbs are more formal",
        "rationale": "Formality levels are not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 2 explicitly contrasts regular verbs that follow predictable patterns with irregular verbs that follow unique patterns.",
    "hint": "Think about how the passage describes the formation of past tense forms.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S7_Q8",
    "type": "reading-comprehension",
    "text": "How do modal verbs contribute to communication according to the passage?",
    "options": [
      {
        "text": "They allow expression of possibility, necessity, or uncertainty",
        "rationale": "This directly matches the passage's explanation of modal verbs' function"
      },
      {
        "text": "They make sentences shorter",
        "rationale": "Sentence length is not discussed in relation to modal verbs"
      },
      {
        "text": "They help with pronunciation",
        "rationale": "The passage doesn't mention pronunciation"
      },
      {
        "text": "They make writing more formal",
        "rationale": "Formality is not mentioned as a function of modal verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 specifically states that modal verbs like 'could,' 'should,' and 'might' allow speakers to express possibility, necessity, or uncertainty.",
    "hint": "Look for examples of modal verbs and their purposes in paragraph 3.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S7_Q9",
    "type": "reading-comprehension",
    "text": "What is the purpose of helping verbs according to the passage?",
    "options": [
      {
        "text": "To work with main verbs to create precise meanings and express complex timeframes",
        "rationale": "This correctly states the function as described in the passage"
      },
      {
        "text": "To make sentences grammatically correct",
        "rationale": "This isn't mentioned as their purpose"
      },
      {
        "text": "To replace main verbs",
        "rationale": "The passage states they work alongside, not replace, main verbs"
      },
      {
        "text": "To simplify verb conjugation",
        "rationale": "This function is not discussed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 explains that helping verbs work alongside main verbs to create precise meanings and express complex timeframes.",
    "hint": "Focus on how helping verbs interact with main verbs.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S7_Q10",
    "type": "reading-comprehension",
    "text": "How do verbs impact creative and academic writing according to the passage?",
    "options": [
      {
        "text": "Strong verb choices create vivid imagery and help maintain consistency",
        "rationale": "This correctly summarizes the impact described in the final paragraph"
      },
      {
        "text": "They make writing more concise",
        "rationale": "Conciseness is not mentioned as an impact"
      },
      {
        "text": "They help with paragraph organization",
        "rationale": "Organization is not discussed as a function of verbs"
      },
      {
        "text": "They make writing more persuasive",
        "rationale": "Persuasiveness is not mentioned in relation to verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The final paragraph states that strong verb choices transform mundane descriptions into vivid imagery and help maintain consistency and clarity.",
    "hint": "Consider how verbs affect both the style and technical aspects of writing.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S7_Q11",
    "type": "reading-comprehension",
    "text": "Why are verbs referred to as the 'powerhouse of language' according to the passage?",
    "options": [
      {
        "text": "Because they drive action and express time through various tenses",
        "rationale": "This is correct as paragraph [1] explicitly states verbs drive action and can express time through tenses"
      },
      {
        "text": "Because they are the most commonly used words in English",
        "rationale": "The passage never makes this claim about frequency of use"
      },
      {
        "text": "Because they are the hardest words to learn",
        "rationale": "While some verbs can be challenging, this is not why they're called the powerhouse"
      },
      {
        "text": "Because they are always the longest words in sentences",
        "rationale": "Word length is not mentioned as a factor in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly states in paragraph [1] that verbs are called the powerhouse because they drive action and meaning, and can express time through various tenses",
    "hint": "Look at the first paragraph's description of verbs' unique abilities",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S7_Q12",
    "type": "reading-comprehension",
    "text": "What distinguishes regular verbs from irregular verbs according to the passage?",
    "options": [
      {
        "text": "Regular verbs follow predictable patterns while irregular verbs follow unique patterns",
        "rationale": "This correctly summarizes the distinction made in paragraph [2]"
      },
      {
        "text": "Regular verbs are more common than irregular verbs",
        "rationale": "The passage doesn't compare frequency of usage"
      },
      {
        "text": "Regular verbs are easier to pronounce",
        "rationale": "Pronunciation is not discussed in the passage"
      },
      {
        "text": "Regular verbs are more modern",
        "rationale": "While historical development is mentioned, this comparison isn't made"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph [2] explicitly contrasts regular verbs that follow predictable patterns with irregular verbs that follow their own unique patterns",
    "hint": "Consider how the passage describes the patterns of verb formation",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S7_Q13",
    "type": "reading-comprehension",
    "text": "What function do modal verbs serve according to the passage?",
    "options": [
      {
        "text": "They express possibility, necessity, or uncertainty",
        "rationale": "This correctly states the function described in paragraph [3]"
      },
      {
        "text": "They only express past actions",
        "rationale": "The passage doesn't limit modal verbs to past actions"
      },
      {
        "text": "They create verb tenses",
        "rationale": "This is not described as a function of modal verbs"
      },
      {
        "text": "They make verbs irregular",
        "rationale": "This is not mentioned as a function of modal verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph [3] specifically states that modal verbs like 'could,' 'should,' and 'might' allow speakers to express possibility, necessity, or uncertainty",
    "hint": "Think about the examples of modal verbs given and their purpose",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S7_Q14",
    "type": "reading-comprehension",
    "text": "How do verbs contribute to creative and academic writing?",
    "options": [
      {
        "text": "They can transform mundane descriptions and help maintain consistency",
        "rationale": "This correctly summarizes the impact described in paragraph [4]"
      },
      {
        "text": "They make writing longer",
        "rationale": "This is not mentioned as a contribution to writing"
      },
      {
        "text": "They only improve academic writing",
        "rationale": "The passage mentions benefits for both creative and academic writing"
      },
      {
        "text": "They make writing more formal",
        "rationale": "Formality is not discussed as a benefit"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph [4] explains that strong verb choices can transform mundane descriptions into vivid imagery and help maintain consistency and clarity",
    "hint": "Look at the specific benefits mentioned for writing in the final paragraph",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S7_Q15",
    "type": "reading-comprehension",
    "text": "What role do helping verbs play in the English language?",
    "options": [
      {
        "text": "They work with main verbs to create precise meanings and express complex timeframes",
        "rationale": "This correctly states their role as described in paragraph [3]"
      },
      {
        "text": "They replace main verbs entirely",
        "rationale": "The passage states they work alongside, not replace, main verbs"
      },
      {
        "text": "They only function in past tense",
        "rationale": "The passage doesn't limit helping verbs to past tense"
      },
      {
        "text": "They make sentences longer",
        "rationale": "This is not mentioned as a role of helping verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "According to paragraph [3], helping verbs work alongside main verbs to create precise meanings and express complex timeframes",
    "hint": "Consider how the passage describes the relationship between helping verbs and main verbs",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S7_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what can be inferred about the relationship between verbs and effective communication?",
    "options": [
      {
        "text": "Mastery of verbs is essential for all forms of English expression",
        "rationale": "This aligns with the passage's overall message and explicit statement in paragraph 4 about verbs being essential for effective communication"
      },
      {
        "text": "Only irregular verbs are important for sophisticated communication",
        "rationale": "The passage mentions irregular verbs as one aspect but doesn't privilege them over other verb forms"
      },
      {
        "text": "Modal verbs are the most crucial type for clear expression",
        "rationale": "While modal verbs are discussed as important, they're presented as just one aspect of verb usage"
      },
      {
        "text": "Verb usage matters only in academic writing",
        "rationale": "The passage explicitly mentions multiple contexts including storytelling and everyday conversation"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage consistently emphasizes the fundamental importance of verbs across all communication contexts, particularly in paragraph 4 where it explicitly states their essential role in various forms of expression.",
    "hint": "Look for how the passage describes the role of verbs across different contexts of communication.",
    "paragraphReference": "Paragraphs [1-4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S7_Q17",
    "type": "reading-comprehension",
    "text": "What can be inferred about the development of irregular verbs in English?",
    "options": [
      {
        "text": "They evolved as part of the language's historical development",
        "rationale": "The passage directly connects irregular verbs to the historical development of English"
      },
      {
        "text": "They were intentionally created to make English more complex",
        "rationale": "The passage doesn't suggest intentional creation of irregularities"
      },
      {
        "text": "They are mistakes that became standardized",
        "rationale": "This contradicts the passage's presentation of irregular verbs as a natural part of language evolution"
      },
      {
        "text": "They are being phased out of modern English",
        "rationale": "The passage presents them as an enduring feature that adds richness to the language"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 2 specifically mentions that irregular verbs' patterns 'often reflect the historical development of the English language,' suggesting their natural evolution over time.",
    "hint": "Consider what the passage says about why irregular verbs exist in their current form.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S7_Q18",
    "type": "reading-comprehension",
    "text": "Based on the passage, what can be concluded about the relationship between verbs and time expression?",
    "options": [
      {
        "text": "Verbs uniquely enable temporal expression in language",
        "rationale": "The passage explicitly states verbs have the unique ability to express time through tenses"
      },
      {
        "text": "Nouns are equally capable of expressing time",
        "rationale": "The passage specifically attributes temporal expression to verbs as a unique feature"
      },
      {
        "text": "Time can only be expressed through regular verbs",
        "rationale": "The passage discusses various verb types' ability to express time, not just regular verbs"
      },
      {
        "text": "Temporal expression is a minor function of verbs",
        "rationale": "The passage presents time expression as a major function of verbs"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 1 explicitly states that verbs have the 'unique ability to express time through their various tenses,' indicating their singular importance in temporal expression.",
    "hint": "Look for how the passage describes verbs' special relationship with expressing time.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S7_Q19",
    "type": "reading-comprehension",
    "text": "What inference can be made about the role of modal verbs in communication?",
    "options": [
      {
        "text": "They allow for expression of nuanced possibilities and uncertainties",
        "rationale": "The passage explicitly connects modal verbs to expressing possibility, necessity, and uncertainty"
      },
      {
        "text": "They are only used in formal writing",
        "rationale": "The passage doesn't restrict modal verbs to formal contexts"
      },
      {
        "text": "They are less important than regular verbs",
        "rationale": "The passage presents them as crucial for subtle expression, not lesser"
      },
      {
        "text": "They are primarily used for past tense",
        "rationale": "The passage discusses modals in terms of possibility and uncertainty, not past tense"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 describes how modal verbs enable speakers to express possibility, necessity, or uncertainty, suggesting their crucial role in nuanced communication.",
    "hint": "Consider what the passage says about how modal verbs affect the subtlety of expression.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S7_Q20",
    "type": "reading-comprehension",
    "text": "What can be inferred about the impact of verb choice in creative writing?",
    "options": [
      {
        "text": "Strong verb choices can significantly enhance descriptive impact",
        "rationale": "The passage explicitly states that strong verb choices can transform mundane descriptions into vivid imagery"
      },
      {
        "text": "Verb choice is irrelevant in creative writing",
        "rationale": "This contradicts the passage's emphasis on the importance of verb choice"
      },
      {
        "text": "Only complex verbs should be used in creative writing",
        "rationale": "The passage doesn't suggest that only complex verbs are effective"
      },
      {
        "text": "Verb tense is more important than verb choice",
        "rationale": "While tense is mentioned, the passage emphasizes both aspects without prioritizing one over the other"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 4 directly states that strong verb choices can transform mundane descriptions into vivid imagery, indicating their crucial role in enhancing creative writing.",
    "hint": "Look for how the passage describes the effect of verb choices on descriptive writing.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S7_Q21",
    "type": "reading-comprehension",
    "text": "Based on the passage, what does the term 'powerhouse' suggest about verbs?",
    "options": [
      {
        "text": "The driving force behind sentence meaning",
        "rationale": "Correct interpretation as the passage directly states verbs 'drive the action and meaning'"
      },
      {
        "text": "The most common part of speech",
        "rationale": "Not supported by the passage; frequency is not discussed"
      },
      {
        "text": "The most difficult words to learn",
        "rationale": "The passage doesn't suggest verbs are particularly difficult"
      },
      {
        "text": "The largest category of words",
        "rationale": "Size of word category is not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly describes verbs as the 'powerhouse of language' because they 'drive the action and meaning in every sentence we construct.'",
    "hint": "Think about what a powerhouse does in other contexts - it provides energy and drives systems.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S7_Q22",
    "type": "reading-comprehension",
    "text": "Which statement best describes the 'versatility' of verbs as presented in the passage?",
    "options": [
      {
        "text": "Their ability to follow predictable patterns",
        "rationale": "This describes only regular verbs, not their overall versatility"
      },
      {
        "text": "Their varied forms and functions in language",
        "rationale": "Correct - matches the passage's description of multiple forms and functions"
      },
      {
        "text": "Their use in creative writing only",
        "rationale": "The passage mentions this as just one application, not their versatility"
      },
      {
        "text": "Their historical development",
        "rationale": "This is mentioned only in relation to irregular verbs"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage discusses versatility in terms of verbs' different forms, functions, and ability to express various meanings and timeframes.",
    "hint": "Look for evidence of multiple uses and functions of verbs throughout the passage.",
    "paragraphReference": "Paragraphs [1-2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S7_Q23",
    "type": "reading-comprehension",
    "text": "According to the passage, what makes modal verbs particularly useful?",
    "options": [
      {
        "text": "They help maintain consistency",
        "rationale": "This is mentioned for verb tenses, not modal verbs"
      },
      {
        "text": "They express possibility and uncertainty",
        "rationale": "Correct - directly stated in the passage"
      },
      {
        "text": "They follow regular patterns",
        "rationale": "Not mentioned in relation to modal verbs"
      },
      {
        "text": "They create vivid imagery",
        "rationale": "This is mentioned for strong verb choices, not modal verbs"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states that modal verbs 'allow speakers to express possibility, necessity, or uncertainty.'",
    "hint": "Focus on the specific functions attributed to modal verbs like 'could,' 'should,' and 'might.'",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S7_Q24",
    "type": "reading-comprehension",
    "text": "How do irregular verbs differ from regular verbs according to the passage?",
    "options": [
      {
        "text": "They follow unique patterns",
        "rationale": "Correct - the passage explicitly states this"
      },
      {
        "text": "They are more commonly used",
        "rationale": "Frequency of use is not mentioned in the passage"
      },
      {
        "text": "They are easier to learn",
        "rationale": "The passage suggests the opposite"
      },
      {
        "text": "They are more modern",
        "rationale": "The passage links them to historical development"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage contrasts regular verbs' predictable patterns with irregular verbs that 'follow their own unique patterns.'",
    "hint": "Look for the direct comparison between regular and irregular verbs in the second paragraph.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S7_Q25",
    "type": "reading-comprehension",
    "text": "What role do helping verbs serve according to the passage?",
    "options": [
      {
        "text": "They replace main verbs",
        "rationale": "The passage states they work alongside, not replace, main verbs"
      },
      {
        "text": "They work with main verbs for precise meaning",
        "rationale": "Correct - matches the passage's description"
      },
      {
        "text": "They simplify verb conjugation",
        "rationale": "This function is not mentioned in the passage"
      },
      {
        "text": "They only express past tense",
        "rationale": "This limitation is not mentioned in the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states that helping verbs 'work alongside main verbs to create precise meanings and express complex timeframes.'",
    "hint": "Consider how these verbs are described in relation to main verbs in the text.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "grammarverbs"
    ],
    "metadata": {
      "topic": "GrammarVerbs",
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
export const mediumGrammarVerbsPassageText = passage;
export const mediumGrammarVerbsReadingQuestions = questions;