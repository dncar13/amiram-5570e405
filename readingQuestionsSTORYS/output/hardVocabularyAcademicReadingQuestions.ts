import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "Decoding the Language of Scholarly Success",
  "difficulty": "hard",
  "topic": "VocabularyAcademic",
  "wordCount": 365,
  "numQuestions": 25,
  "estimatedTime": 5,
  "topicId": 6
};

// Reading passage - Decoding the Language of Scholarly Success (hard level)
export const passage = `[1] The acquisition of academic vocabulary represents a fundamental cornerstone of scholarly achievement, yet many students underestimate its profound impact on their educational trajectory. While casual conversation typically draws from a reservoir of approximately 2,000 common words, academic discourse demands mastery of an additional 4,000 to 6,000 specialized terms. This sophisticated lexicon serves not merely as decorative linguistics but rather as precision tools that facilitate nuanced expression of complex concepts, enabling students to navigate the intricate landscape of higher education with greater proficiency.

[2] Research conducted across multiple universities has revealed a compelling correlation between students' academic vocabulary proficiency and their overall academic performance. Those who deliberately cultivate their scholarly vocabulary demonstrate markedly superior comprehension of advanced texts, produce more sophisticated written assignments, and exhibit enhanced critical thinking capabilities. Furthermore, these students show greater facility in synthesizing information from diverse sources and articulating complex arguments with clarity and precision. This linguistic advantage extends beyond mere academic performance, conferring benefits in professional contexts where the ability to communicate with precision and sophistication is increasingly valued.

[3] The process of building an academic vocabulary, however, requires a strategic and multifaceted approach. Traditional methods of rote memorization prove insufficient for developing the deep understanding necessary for effective deployment of scholarly terminology. Instead, successful vocabulary acquisition demands active engagement with academic materials through multiple modalities: reading extensively across disciplines, participating in scholarly discussions, and regularly incorporating new terms into written work. Additionally, understanding the etymological roots and morphological patterns of academic vocabulary can significantly enhance one's ability to decode unfamiliar terms and retain new vocabulary more effectively.

[4] Perhaps most significantly, the mastery of academic vocabulary serves as a gateway to specialized knowledge communities and facilitates intellectual discourse at the highest levels. As students progress through their academic careers, they encounter increasingly specialized terminology specific to their chosen fields of study. This discipline-specific vocabulary not only enables precise communication within their academic community but also helps structure the conceptual frameworks through which complex ideas are understood and analyzed. Consequently, students who invest in developing their academic vocabulary find themselves better equipped to engage with scholarly literature, contribute to academic discussions, and ultimately succeed in their chosen fields of specialization.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S6_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, how many additional specialized terms does academic discourse require beyond casual conversation vocabulary?",
    "options": [
      {
        "text": "4,000 to 6,000 terms",
        "rationale": "This is the correct range explicitly stated in the passage"
      },
      {
        "text": "2,000 terms",
        "rationale": "This number refers to common words used in casual conversation"
      },
      {
        "text": "8,000 to 10,000 terms",
        "rationale": "This range is not mentioned in the passage"
      },
      {
        "text": "3,000 to 5,000 terms",
        "rationale": "This range is incorrect and not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states that while casual conversation uses about 2,000 common words, academic discourse requires 'an additional 4,000 to 6,000 specialized terms.'",
    "hint": "Look for specific numbers mentioned in relation to academic vocabulary requirements",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S6_Q2",
    "type": "reading-comprehension",
    "text": "What does the passage identify as an insufficient method for developing academic vocabulary?",
    "options": [
      {
        "text": "Rote memorization",
        "rationale": "The passage explicitly states this method is insufficient"
      },
      {
        "text": "Reading across disciplines",
        "rationale": "This is actually cited as part of a successful approach"
      },
      {
        "text": "Scholarly discussions",
        "rationale": "This is mentioned as a positive strategy"
      },
      {
        "text": "Etymology study",
        "rationale": "This is described as helpful for decoding and retention"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage specifically states that 'Traditional methods of rote memorization prove insufficient for developing the deep understanding necessary.'",
    "hint": "Look for methods that are specifically criticized or described as inadequate",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S6_Q3",
    "type": "reading-comprehension",
    "text": "Which benefit of academic vocabulary proficiency extends beyond academic performance?",
    "options": [
      {
        "text": "Professional communication advantages",
        "rationale": "The passage explicitly mentions this benefit in professional contexts"
      },
      {
        "text": "Social networking skills",
        "rationale": "Not mentioned as a benefit in the passage"
      },
      {
        "text": "Personal entertainment",
        "rationale": "Not discussed in the passage"
      },
      {
        "text": "Family relationships",
        "rationale": "Not mentioned as a benefit in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage indicates that the linguistic advantage extends to 'professional contexts where the ability to communicate with precision and sophistication is increasingly valued.'",
    "hint": "Consider what benefits are described outside of academic settings",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S6_Q4",
    "type": "reading-comprehension",
    "text": "What role does discipline-specific vocabulary play according to the passage?",
    "options": [
      {
        "text": "It structures conceptual frameworks for complex ideas",
        "rationale": "This is explicitly stated as a key function"
      },
      {
        "text": "It simplifies academic concepts",
        "rationale": "Not mentioned as a function in the passage"
      },
      {
        "text": "It replaces basic vocabulary",
        "rationale": "This is not discussed in the passage"
      },
      {
        "text": "It reduces communication needs",
        "rationale": "Contrary to the passage's emphasis on enhanced communication"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage states that discipline-specific vocabulary 'helps structure the conceptual frameworks through which complex ideas are understood and analyzed.'",
    "hint": "Look for how specialized vocabulary affects understanding in specific fields",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S6_Q5",
    "type": "reading-comprehension",
    "text": "What do students who deliberately cultivate their scholarly vocabulary demonstrate?",
    "options": [
      {
        "text": "Superior comprehension and enhanced critical thinking",
        "rationale": "This combination is explicitly stated in the passage"
      },
      {
        "text": "Only improved writing skills",
        "rationale": "This is only part of the benefits mentioned"
      },
      {
        "text": "Reduced need for study",
        "rationale": "Not mentioned in the passage"
      },
      {
        "text": "Better social skills",
        "rationale": "Not mentioned as a benefit in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage states that these students 'demonstrate markedly superior comprehension of advanced texts... and exhibit enhanced critical thinking capabilities.'",
    "hint": "Look for multiple academic benefits mentioned together",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "hard-level",
      "detail",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S6_Q6",
    "type": "reading-comprehension",
    "text": "What is the primary contrast the passage establishes between casual conversation and academic discourse?",
    "options": [
      {
        "text": "The difference in vocabulary size requirements",
        "rationale": "Correct - the passage explicitly states casual conversation uses 2,000 words while academic discourse requires 4,000-6,000 additional specialized terms"
      },
      {
        "text": "The speed of communication",
        "rationale": "Incorrect - the passage does not discuss communication speed differences"
      },
      {
        "text": "The formality of tone",
        "rationale": "Incorrect - while implied, this is not the main contrast established in the passage"
      },
      {
        "text": "The grammatical structures",
        "rationale": "Incorrect - grammatical differences are not discussed in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage directly contrasts the vocabulary requirements, stating casual conversation uses about 2,000 words while academic discourse requires 4,000-6,000 additional specialized terms",
    "hint": "Look for specific numerical comparisons in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S6_Q7",
    "type": "reading-comprehension",
    "text": "According to the research mentioned in the passage, what is the primary benefit of strong academic vocabulary?",
    "options": [
      {
        "text": "Increased social status in academic settings",
        "rationale": "Incorrect - social status benefits are not mentioned in the research findings"
      },
      {
        "text": "Enhanced overall academic performance and comprehension",
        "rationale": "Correct - research explicitly links vocabulary proficiency to superior comprehension and academic performance"
      },
      {
        "text": "Better relationships with professors",
        "rationale": "Incorrect - interpersonal relationships are not discussed in the research findings"
      },
      {
        "text": "Higher standardized test scores",
        "rationale": "Incorrect - while this might be true, it's not mentioned in the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage states that research shows students with strong academic vocabulary demonstrate superior comprehension, better writing, and enhanced critical thinking",
    "hint": "Focus on the research outcomes described in the second paragraph",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S6_Q8",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the effectiveness of rote memorization for building academic vocabulary?",
    "options": [
      {
        "text": "It is the most efficient method",
        "rationale": "Incorrect - the passage explicitly states it is insufficient"
      },
      {
        "text": "It is insufficient alone",
        "rationale": "Correct - the passage directly states that traditional rote memorization is insufficient for developing deep understanding"
      },
      {
        "text": "It is completely ineffective",
        "rationale": "Incorrect - the passage doesn't completely dismiss it, just states it's insufficient alone"
      },
      {
        "text": "It is the preferred method",
        "rationale": "Incorrect - the passage advocates for multiple modalities instead"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states that traditional rote memorization methods are insufficient for developing the deep understanding necessary for effective use of academic vocabulary",
    "hint": "Look for the passage's stance on traditional learning methods in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S6_Q9",
    "type": "reading-comprehension",
    "text": "What role does academic vocabulary play in specialized fields of study?",
    "options": [
      {
        "text": "It serves as a gateway to knowledge communities",
        "rationale": "Correct - the passage explicitly states this and explains how it facilitates specialized communication"
      },
      {
        "text": "It makes writing papers easier",
        "rationale": "Incorrect - while this might be true, it's not the main role described in the passage"
      },
      {
        "text": "It impresses professors",
        "rationale": "Incorrect - this is not mentioned as a purpose in the passage"
      },
      {
        "text": "It helps with job applications",
        "rationale": "Incorrect - while professional benefits are mentioned elsewhere, this isn't the specialized role discussed"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage emphasizes that academic vocabulary serves as a gateway to specialized knowledge communities and enables precise communication within academic fields",
    "hint": "Consider how vocabulary relates to participation in academic communities",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S6_Q10",
    "type": "reading-comprehension",
    "text": "What is the recommended approach for acquiring academic vocabulary?",
    "options": [
      {
        "text": "Memorizing word lists",
        "rationale": "Incorrect - the passage explicitly argues against relying on rote memorization"
      },
      {
        "text": "A multifaceted approach including reading and discussion",
        "rationale": "Correct - the passage advocates for multiple modalities including reading, discussion, and writing"
      },
      {
        "text": "Studying only within one's field",
        "rationale": "Incorrect - the passage recommends reading across disciplines"
      },
      {
        "text": "Using flashcards exclusively",
        "rationale": "Incorrect - this would fall under the rejected rote memorization approach"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage advocates for a strategic, multifaceted approach including reading across disciplines, participating in discussions, and incorporating new terms in writing",
    "hint": "Look for the various methods mentioned for vocabulary acquisition",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S6_Q11",
    "type": "reading-comprehension",
    "text": "What is the primary difference between casual conversation vocabulary and academic vocabulary requirements according to the passage?",
    "options": [
      {
        "text": "Casual conversation uses 2,000 words while academic discourse requires 4,000-6,000 additional specialized terms",
        "rationale": "This directly reflects the numerical comparison made in the passage"
      },
      {
        "text": "Academic vocabulary is more formal than casual conversation",
        "rationale": "While true, this is not the specific distinction made in the passage"
      },
      {
        "text": "Casual conversation is easier to understand than academic discourse",
        "rationale": "This is an oversimplification not directly stated in the passage"
      },
      {
        "text": "Academic vocabulary requires years of study while casual conversation is naturally acquired",
        "rationale": "This conclusion is not supported by the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage explicitly states that casual conversation uses about 2,000 common words, while academic discourse requires an additional 4,000-6,000 specialized terms",
    "hint": "Look for specific numerical comparisons in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S6_Q12",
    "type": "reading-comprehension",
    "text": "According to the research cited in the passage, what is the relationship between academic vocabulary and student performance?",
    "options": [
      {
        "text": "Students with strong academic vocabulary show better comprehension and critical thinking",
        "rationale": "This accurately summarizes the research findings"
      },
      {
        "text": "Academic vocabulary only improves written assignments",
        "rationale": "This is too narrow and ignores other benefits mentioned"
      },
      {
        "text": "There is no clear correlation between vocabulary and performance",
        "rationale": "This contradicts the passage's explicit statements"
      },
      {
        "text": "Academic vocabulary only matters in professional contexts",
        "rationale": "The passage mentions professional benefits as additional, not primary"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage describes multiple benefits including superior comprehension, better written assignments, and enhanced critical thinking capabilities",
    "hint": "Consider all the academic benefits listed in the second paragraph",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S6_Q13",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the most effective method of building academic vocabulary?",
    "options": [
      {
        "text": "A multifaceted approach including reading, discussion, and active use",
        "rationale": "This matches the passage's recommended strategy"
      },
      {
        "text": "Rote memorization of new terms",
        "rationale": "The passage explicitly states this is insufficient"
      },
      {
        "text": "Focusing solely on etymology",
        "rationale": "This is mentioned as one component, not the complete solution"
      },
      {
        "text": "Learning through casual conversation",
        "rationale": "This contradicts the passage's emphasis on academic engagement"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage advocates for a strategic, multifaceted approach involving multiple modalities of learning",
    "hint": "Look for the passage's critique of traditional methods and its alternative suggestions",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S6_Q14",
    "type": "reading-comprehension",
    "text": "What role does academic vocabulary play in specialized fields of study?",
    "options": [
      {
        "text": "It enables precise communication and structures conceptual frameworks",
        "rationale": "This accurately reflects the passage's description"
      },
      {
        "text": "It only helps with writing research papers",
        "rationale": "This is too limited compared to the passage's description"
      },
      {
        "text": "It is mainly useful for impressing professors",
        "rationale": "This trivializes the purpose described in the passage"
      },
      {
        "text": "It has minimal impact on academic success",
        "rationale": "This contradicts the passage's main argument"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage emphasizes that specialized vocabulary enables precise communication and helps structure understanding within academic communities",
    "hint": "Consider how vocabulary relates to both communication and understanding in specific fields",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S6_Q15",
    "type": "reading-comprehension",
    "text": "What broader impact of academic vocabulary mastery does the passage identify?",
    "options": [
      {
        "text": "It facilitates entry into knowledge communities and high-level discourse",
        "rationale": "This captures the broader significance described in the passage"
      },
      {
        "text": "It only improves grades",
        "rationale": "This understates the broader impacts mentioned"
      },
      {
        "text": "It helps primarily with standardized tests",
        "rationale": "This is not mentioned in the passage"
      },
      {
        "text": "It only matters during college years",
        "rationale": "This contradicts the long-term benefits described"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage describes academic vocabulary as a gateway to specialized knowledge communities and facilitator of high-level intellectual discourse",
    "hint": "Think about the long-term and community-related benefits described",
    "paragraphReference": "Paragraphs [2,4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "hard-level",
      "main-idea",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S6_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what can be inferred about students who successfully master academic vocabulary?",
    "options": [
      {
        "text": "They are likely to perform better in both academic and professional settings",
        "rationale": "The passage explicitly connects vocabulary mastery to both academic success and professional benefits"
      },
      {
        "text": "They typically come from multilingual backgrounds",
        "rationale": "While this might be helpful, the passage makes no connection between multilingualism and vocabulary mastery"
      },
      {
        "text": "They spend more time studying than their peers",
        "rationale": "While study time might be important, this specific correlation is not mentioned in the passage"
      },
      {
        "text": "They have higher IQ scores",
        "rationale": "The passage does not discuss or imply any connection between vocabulary mastery and intelligence measures"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage indicates that students with strong academic vocabulary show superior academic performance and gain advantages in professional contexts where precise communication is valued",
    "hint": "Look for connections between vocabulary mastery and broader outcomes mentioned in the passage",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S6_Q17",
    "type": "reading-comprehension",
    "text": "What can be inferred about the relationship between academic vocabulary and specialized fields of study?",
    "options": [
      {
        "text": "Academic vocabulary becomes increasingly field-specific as students advance",
        "rationale": "The passage directly suggests this progression toward specialized terminology"
      },
      {
        "text": "General academic vocabulary is more important than field-specific terms",
        "rationale": "The passage does not make this comparative claim"
      },
      {
        "text": "Students should focus only on their field's vocabulary",
        "rationale": "This contradicts the passage's emphasis on broad vocabulary development"
      },
      {
        "text": "Field-specific vocabulary is easier to learn than general academic terms",
        "rationale": "This comparison is not supported by the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage indicates that as students progress academically, they encounter and need to master increasingly specialized terminology specific to their fields",
    "hint": "Consider how the passage describes vocabulary development over time in academic careers",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S6_Q18",
    "type": "reading-comprehension",
    "text": "What can be inferred about the most effective method of building academic vocabulary?",
    "options": [
      {
        "text": "It requires an integrated approach using multiple learning strategies",
        "rationale": "The passage emphasizes the need for multiple modalities and active engagement"
      },
      {
        "text": "Memorization alone is sufficient",
        "rationale": "The passage explicitly states that rote memorization is insufficient"
      },
      {
        "text": "Reading is the only necessary component",
        "rationale": "The passage indicates multiple approaches are needed"
      },
      {
        "text": "Casual conversation is the best practice method",
        "rationale": "The passage distinguishes academic vocabulary from casual conversation vocabulary"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage advocates for a multifaceted approach including reading, discussion, writing, and understanding word origins",
    "hint": "Look for references to different learning methods and their effectiveness",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S6_Q19",
    "type": "reading-comprehension",
    "text": "What can be inferred about the gap between casual and academic vocabulary?",
    "options": [
      {
        "text": "The academic vocabulary requirement is significantly larger than casual vocabulary needs",
        "rationale": "The passage indicates a 4,000-6,000 word increase over the 2,000 casual words"
      },
      {
        "text": "Casual vocabulary is more difficult to master",
        "rationale": "This comparison is not supported by the passage"
      },
      {
        "text": "The two types of vocabulary are interchangeable",
        "rationale": "The passage emphasizes their distinct purposes and contexts"
      },
      {
        "text": "Academic vocabulary is becoming less important",
        "rationale": "The passage argues for its increasing importance"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage shows that academic vocabulary requires mastery of 4,000-6,000 additional terms beyond the 2,000 common words used in casual conversation",
    "hint": "Compare the numerical figures provided for different types of vocabulary",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S6_Q20",
    "type": "reading-comprehension",
    "text": "What can be inferred about the primary purpose of academic vocabulary in higher education?",
    "options": [
      {
        "text": "It serves as a precise tool for expressing complex ideas and concepts",
        "rationale": "The passage emphasizes its role in facilitating precise communication of complex concepts"
      },
      {
        "text": "It primarily impresses professors",
        "rationale": "The passage presents vocabulary as functional rather than impressive"
      },
      {
        "text": "It makes writing longer",
        "rationale": "The passage focuses on precision and clarity, not length"
      },
      {
        "text": "It replaces simple vocabulary entirely",
        "rationale": "The passage suggests it complements rather than replaces basic vocabulary"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage describes academic vocabulary as precision tools for expressing complex concepts, not merely decorative linguistics",
    "hint": "Consider how the passage describes the functional role of academic vocabulary",
    "paragraphReference": "Paragraphs [1-2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "hard-level",
      "inference",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S6_Q21",
    "type": "reading-comprehension",
    "text": "Based on the context in paragraph 1, what does 'lexicon' most closely mean?",
    "options": [
      {
        "text": "Vocabulary",
        "rationale": "Correct - the passage uses 'lexicon' to refer to the specialized academic vocabulary students need to master"
      },
      {
        "text": "Dictionary",
        "rationale": "Incorrect - while related to words, the context shows it's referring to the vocabulary itself, not a reference book"
      },
      {
        "text": "Language style",
        "rationale": "Incorrect - while related to language, the context specifically refers to a collection of words, not writing style"
      },
      {
        "text": "Grammar rules",
        "rationale": "Incorrect - the passage discusses words and terminology, not grammatical structures"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage describes the 'sophisticated lexicon' as consisting of '4,000 to 6,000 specialized terms,' clearly indicating that lexicon refers to vocabulary or a collection of words.",
    "hint": "Look at how the term is used in relation to the number of words mentioned",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S6_Q22",
    "type": "reading-comprehension",
    "text": "In paragraph 2, what does 'compelling correlation' suggest about the relationship between vocabulary and academic performance?",
    "options": [
      {
        "text": "A strong connection",
        "rationale": "Correct - 'compelling correlation' indicates a strong and convincing relationship between the two factors"
      },
      {
        "text": "A weak relationship",
        "rationale": "Incorrect - 'compelling' suggests strength, not weakness"
      },
      {
        "text": "A casual link",
        "rationale": "Incorrect - 'compelling' implies something more significant than a casual connection"
      },
      {
        "text": "An uncertain association",
        "rationale": "Incorrect - the word 'compelling' indicates certainty, not uncertainty"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'compelling correlation' to introduce strong evidence linking vocabulary proficiency to academic success, supported by multiple examples of superior performance.",
    "hint": "Consider what kind of evidence would be described as 'compelling'",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S6_Q23",
    "type": "reading-comprehension",
    "text": "What does 'morphological patterns' most likely mean in the context of paragraph 3?",
    "options": [
      {
        "text": "Word structure patterns",
        "rationale": "Correct - refers to patterns in how words are formed and structured"
      },
      {
        "text": "Spelling rules",
        "rationale": "Incorrect - too narrow and doesn't capture the structural aspect implied by 'morphological'"
      },
      {
        "text": "Pronunciation guides",
        "rationale": "Incorrect - morphology relates to word structure, not pronunciation"
      },
      {
        "text": "Grammar sequences",
        "rationale": "Incorrect - while related to language, morphology specifically deals with word formation"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage mentions morphological patterns in context of helping students decode and retain vocabulary, suggesting it refers to patterns in word structure and formation.",
    "hint": "Think about what would help you understand how words are built or formed",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S6_Q24",
    "type": "reading-comprehension",
    "text": "In paragraph 4, what does the phrase 'gateway to specialized knowledge communities' suggest?",
    "options": [
      {
        "text": "An entry point to academic groups",
        "rationale": "Correct - suggests vocabulary provides access to specialized academic communities"
      },
      {
        "text": "A physical location",
        "rationale": "Incorrect - the gateway is metaphorical, not a physical entrance"
      },
      {
        "text": "A testing requirement",
        "rationale": "Incorrect - the passage doesn't suggest formal testing requirements"
      },
      {
        "text": "A social network",
        "rationale": "Incorrect - while related to community, it specifically refers to academic knowledge groups"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'gateway' metaphorically to show how mastering academic vocabulary enables access to and participation in specialized academic communities.",
    "hint": "Think about what a gateway typically represents - a means of access or entry",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 500,
      "estimatedTime": 5
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S6_Q25",
    "type": "reading-comprehension",
    "text": "What does 'conceptual frameworks' mean as used in the final paragraph?",
    "options": [
      {
        "text": "Organized systems of ideas",
        "rationale": "Correct - refers to structured ways of understanding and organizing complex ideas"
      },
      {
        "text": "Physical structures",
        "rationale": "Incorrect - the term is used abstractly, not referring to physical construction"
      },
      {
        "text": "Study guides",
        "rationale": "Incorrect - too specific and concrete; the term refers to broader systems of understanding"
      },
      {
        "text": "Research methods",
        "rationale": "Incorrect - while related to academic work, it specifically refers to ways of organizing thoughts"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "hard",
    "difficultyScore": 5,
    "explanation": "The passage uses 'conceptual frameworks' to describe how specialized vocabulary helps structure and organize complex ideas within academic fields.",
    "hint": "Consider how ideas and concepts are organized in academic disciplines",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "hard-level",
      "vocabulary",
      "vocabularyacademic"
    ],
    "metadata": {
      "topic": "VocabularyAcademic",
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
export const hardVocabularyAcademicPassageText = passage;
export const hardVocabularyAcademicReadingQuestions = questions;