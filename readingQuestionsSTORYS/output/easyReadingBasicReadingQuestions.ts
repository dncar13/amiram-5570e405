import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "The Magic Door to Reading Success",
  "difficulty": "easy",
  "topic": "ReadingBasic",
  "wordCount": 215,
  "numQuestions": 25,
  "estimatedTime": 2,
  "topicId": 2
};

// Reading passage - The Magic Door to Reading Success (easy level)
export const passage = `[1] Reading is like having a magic door that can take you anywhere in the world. When you open a book, you can travel to distant lands, meet interesting characters, and learn amazing new things. Just like a key opens a door, learning to read well opens up countless opportunities for success in school and life.

[2] There are several important skills that help make someone a good reader. First, understanding vocabulary is essential because it helps you know what words mean when you see them. Second, being able to identify main ideas helps you remember what you read. Finally, making connections between different parts of the text helps you understand the whole story better.

[3] Practice is the best way to become a better reader. Reading for just 20 minutes every day can help you learn new words and improve your understanding. You can read anything that interests you - stories, magazines, or even comics. The more you read, the easier it becomes, just like getting better at riding a bicycle or playing a sport.

[4] Remember, everyone starts as a beginner reader, but with time and practice, reading becomes both easier and more enjoyable. The magic door of reading is always waiting to be opened, ready to take you on your next adventure.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S2_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, what does reading allow you to do?",
    "options": [
      {
        "text": "Travel to distant lands, meet characters, and learn new things",
        "rationale": "This matches exactly what paragraph [1] states about reading's benefits"
      },
      {
        "text": "Only learn new vocabulary words",
        "rationale": "This is too limited compared to what paragraph [1] describes"
      },
      {
        "text": "Make money and find a job",
        "rationale": "While reading is beneficial, this specific benefit isn't mentioned in paragraph [1]"
      },
      {
        "text": "Improve only your writing skills",
        "rationale": "This isn't mentioned in paragraph [1] or anywhere else in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [1] explicitly states that reading allows you to 'travel to distant lands, meet interesting characters, and learn amazing new things.'",
    "hint": "Look at the first paragraph's description of what happens when you open a book",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S2_Q2",
    "type": "reading-comprehension",
    "text": "How many important reading skills are specifically mentioned in the passage?",
    "options": [
      {
        "text": "Two skills",
        "rationale": "The passage lists more than two skills"
      },
      {
        "text": "Three skills",
        "rationale": "Correct: vocabulary, identifying main ideas, and making connections"
      },
      {
        "text": "Four skills",
        "rationale": "The passage only mentions three specific skills"
      },
      {
        "text": "Five skills",
        "rationale": "This exceeds the number of skills mentioned in the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] specifically lists three important reading skills: understanding vocabulary, identifying main ideas, and making connections between different parts of the text.",
    "hint": "Count the skills listed after 'First,' 'Second,' and 'Finally' in paragraph 2",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S2_Q3",
    "type": "reading-comprehension",
    "text": "How much daily reading time does the passage recommend?",
    "options": [
      {
        "text": "10 minutes",
        "rationale": "This is less than the recommended time"
      },
      {
        "text": "15 minutes",
        "rationale": "This is less than the recommended time"
      },
      {
        "text": "20 minutes",
        "rationale": "This matches exactly what paragraph [3] recommends"
      },
      {
        "text": "30 minutes",
        "rationale": "This is more than the recommended time"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically states that 'Reading for just 20 minutes every day can help you learn new words and improve your understanding.'",
    "hint": "Look for a specific number of minutes mentioned in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S2_Q4",
    "type": "reading-comprehension",
    "text": "What does the passage suggest you can read to improve?",
    "options": [
      {
        "text": "Only textbooks",
        "rationale": "The passage offers more varied options"
      },
      {
        "text": "Stories, magazines, or comics",
        "rationale": "This matches exactly what paragraph [3] suggests"
      },
      {
        "text": "Only newspapers",
        "rationale": "Newspapers aren't specifically mentioned in the passage"
      },
      {
        "text": "Only fiction books",
        "rationale": "The passage suggests more variety than just fiction"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically states you can read 'stories, magazines, or even comics' - anything that interests you.",
    "hint": "Look for the list of reading materials mentioned in paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S2_Q5",
    "type": "reading-comprehension",
    "text": "What is reading compared to in terms of improvement?",
    "options": [
      {
        "text": "Riding a bicycle or playing a sport",
        "rationale": "This matches the comparison in paragraph [3]"
      },
      {
        "text": "Learning to walk",
        "rationale": "This comparison isn't made in the passage"
      },
      {
        "text": "Doing homework",
        "rationale": "This comparison isn't made in the passage"
      },
      {
        "text": "Playing an instrument",
        "rationale": "This comparison isn't made in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] compares getting better at reading to 'getting better at riding a bicycle or playing a sport.'",
    "hint": "Look for the comparison near the end of paragraph 3",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "easy-level",
      "detail",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S2_Q6",
    "type": "reading-comprehension",
    "text": "What is the main metaphor used throughout the passage to describe reading?",
    "options": [
      {
        "text": "A magic door",
        "rationale": "Correct - the passage consistently uses the metaphor of a magic door that opens opportunities and takes readers to new places"
      },
      {
        "text": "A bicycle ride",
        "rationale": "Incorrect - while bicycle riding is mentioned as a comparison for practice, it's not the main metaphor"
      },
      {
        "text": "A key and lock",
        "rationale": "Incorrect - while mentioned briefly, this is used to support the door metaphor rather than being the main metaphor"
      },
      {
        "text": "A world map",
        "rationale": "Incorrect - while travel is mentioned, it's not presented as the central metaphor"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage begins and ends with the metaphor of reading as a 'magic door,' using it to frame the entire discussion about reading's benefits",
    "hint": "Look at how the passage begins and ends - what image is repeated?",
    "paragraphReference": "Paragraphs [1, 4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S2_Q7",
    "type": "reading-comprehension",
    "text": "According to the passage, what are the three important skills that make someone a good reader?",
    "options": [
      {
        "text": "Understanding vocabulary, identifying main ideas, and making connections",
        "rationale": "Correct - these are the three skills explicitly listed in the passage"
      },
      {
        "text": "Practice, patience, and persistence",
        "rationale": "Incorrect - while practice is important, these aren't the three skills mentioned"
      },
      {
        "text": "Reading daily, understanding words, and enjoying books",
        "rationale": "Incorrect - while these are mentioned, they aren't the three main skills listed"
      },
      {
        "text": "Vocabulary, speed, and comprehension",
        "rationale": "Incorrect - speed isn't mentioned as one of the key skills"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] clearly outlines three specific skills: understanding vocabulary, identifying main ideas, and making connections between parts of text",
    "hint": "Look for the paragraph that lists skills in a numbered format ('First... Second... Finally...')",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S2_Q8",
    "type": "reading-comprehension",
    "text": "How much daily reading time does the passage recommend?",
    "options": [
      {
        "text": "20 minutes",
        "rationale": "Correct - the passage specifically recommends reading for 20 minutes every day"
      },
      {
        "text": "30 minutes",
        "rationale": "Incorrect - this duration isn't mentioned in the passage"
      },
      {
        "text": "15 minutes",
        "rationale": "Incorrect - this duration isn't mentioned in the passage"
      },
      {
        "text": "An hour",
        "rationale": "Incorrect - this duration isn't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] explicitly states that 'Reading for just 20 minutes every day' can help improve reading skills",
    "hint": "Look for a specific time measurement in the paragraph about practice",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S2_Q9",
    "type": "reading-comprehension",
    "text": "What types of reading materials does the passage suggest?",
    "options": [
      {
        "text": "Stories, magazines, and comics",
        "rationale": "Correct - these are the exact examples listed in the passage"
      },
      {
        "text": "Textbooks and novels",
        "rationale": "Incorrect - these specific types aren't mentioned in the passage"
      },
      {
        "text": "Newspapers and books",
        "rationale": "Incorrect - while books are mentioned, newspapers aren't listed as an example"
      },
      {
        "text": "Poetry and fiction",
        "rationale": "Incorrect - these specific types aren't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically mentions 'stories, magazines, or even comics' as reading material options",
    "hint": "Look for the list of reading materials in the paragraph about practice",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S2_Q10",
    "type": "reading-comprehension",
    "text": "What comparison does the passage make to illustrate how reading improves with practice?",
    "options": [
      {
        "text": "Riding a bicycle and playing sports",
        "rationale": "Correct - these are the exact comparisons used in the passage"
      },
      {
        "text": "Learning to walk and talk",
        "rationale": "Incorrect - these comparisons aren't used in the passage"
      },
      {
        "text": "Growing a garden",
        "rationale": "Incorrect - this comparison isn't used in the passage"
      },
      {
        "text": "Learning to write",
        "rationale": "Incorrect - this comparison isn't used in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] compares improving at reading to 'getting better at riding a bicycle or playing a sport'",
    "hint": "Look for everyday activities that are compared to reading improvement",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S2_Q11",
    "type": "reading-comprehension",
    "text": "What is the main metaphor used throughout the passage to describe reading?",
    "options": [
      {
        "text": "A magic door",
        "rationale": "This is explicitly used throughout the passage, beginning in paragraph [1] and referenced again in [4]"
      },
      {
        "text": "A bicycle ride",
        "rationale": "While mentioned as a comparison in [3], this is not the main metaphor"
      },
      {
        "text": "A key to success",
        "rationale": "While keys are mentioned, they're part of the door metaphor, not the main metaphor itself"
      },
      {
        "text": "A daily adventure",
        "rationale": "While adventure is mentioned, it's a result of the magic door metaphor"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage consistently uses the metaphor of a 'magic door' to describe reading, introducing it in paragraph [1] and returning to it in the conclusion.",
    "hint": "Look for the image that appears in both the first and last paragraphs of the passage",
    "paragraphReference": "Paragraphs [1] and [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S2_Q12",
    "type": "reading-comprehension",
    "text": "According to paragraph [2], what are the three important skills that make someone a good reader?",
    "options": [
      {
        "text": "Vocabulary, main ideas, and making connections",
        "rationale": "These are the exact three skills listed in paragraph [2]"
      },
      {
        "text": "Practice, patience, and persistence",
        "rationale": "While important, these aren't the specific skills mentioned in [2]"
      },
      {
        "text": "Reading daily, understanding words, and enjoying stories",
        "rationale": "While reading daily is mentioned in [3], these aren't the skills from [2]"
      },
      {
        "text": "Vocabulary, speed reading, and comprehension",
        "rationale": "Speed reading isn't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] explicitly lists understanding vocabulary, identifying main ideas, and making connections as the three key skills.",
    "hint": "The skills are listed with 'First,' 'Second,' and 'Finally' in the paragraph",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S2_Q13",
    "type": "reading-comprehension",
    "text": "What does the passage recommend as the best way to improve reading skills?",
    "options": [
      {
        "text": "Reading for 20 minutes every day",
        "rationale": "This is specifically stated in paragraph [3] as the best way to improve"
      },
      {
        "text": "Reading only difficult books",
        "rationale": "The passage suggests reading anything that interests you"
      },
      {
        "text": "Studying vocabulary lists",
        "rationale": "While vocabulary is important, this isn't mentioned as the best method"
      },
      {
        "text": "Reading with others",
        "rationale": "This isn't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically states that reading for 20 minutes daily helps improve vocabulary and understanding.",
    "hint": "Look for the specific time recommendation in paragraph [3]",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S2_Q14",
    "type": "reading-comprehension",
    "text": "How does the passage compare learning to read to other activities?",
    "options": [
      {
        "text": "Like riding a bicycle or playing a sport",
        "rationale": "This exact comparison is made in paragraph [3]"
      },
      {
        "text": "Like learning a new language",
        "rationale": "This comparison isn't made in the passage"
      },
      {
        "text": "Like solving a puzzle",
        "rationale": "This comparison isn't made in the passage"
      },
      {
        "text": "Like writing a story",
        "rationale": "This comparison isn't made in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "In paragraph [3], the passage explicitly compares improving at reading to getting better at riding a bicycle or playing a sport.",
    "hint": "Look for comparative examples in paragraph [3]",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S2_Q15",
    "type": "reading-comprehension",
    "text": "What types of reading materials does the passage suggest?",
    "options": [
      {
        "text": "Stories, magazines, and comics",
        "rationale": "These are the exact materials listed in paragraph [3]"
      },
      {
        "text": "Only textbooks and novels",
        "rationale": "The passage encourages variety and doesn't limit to these"
      },
      {
        "text": "Newspapers and websites",
        "rationale": "These aren't mentioned in the passage"
      },
      {
        "text": "Only educational materials",
        "rationale": "The passage suggests reading anything of interest"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically mentions stories, magazines, and comics as acceptable reading materials.",
    "hint": "Look for the list of reading materials in paragraph [3]",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "easy-level",
      "main-idea",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S2_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what is the most likely reason the author compares reading to a 'magic door'?",
    "options": [
      {
        "text": "Because reading allows people to experience new places and ideas",
        "rationale": "This matches the passage's description of traveling to distant lands and learning new things through reading"
      },
      {
        "text": "Because books are typically kept behind doors",
        "rationale": "The passage doesn't mention physical storage of books"
      },
      {
        "text": "Because reading requires opening physical objects",
        "rationale": "While books do open, this isn't the main point of the metaphor"
      },
      {
        "text": "Because magic tricks involve reading instructions",
        "rationale": "The passage doesn't discuss magic tricks or instructions"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "In paragraph [1], the author explicitly compares reading to a magic door that can 'take you anywhere in the world' and allows you to 'travel to distant lands, meet interesting characters, and learn amazing new things.'",
    "hint": "Think about what doors do - they provide access to new places.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S2_Q17",
    "type": "reading-comprehension",
    "text": "Which skill is NOT mentioned as important for being a good reader?",
    "options": [
      {
        "text": "Reading speed",
        "rationale": "This skill isn't mentioned in the passage's list of important reading skills"
      },
      {
        "text": "Vocabulary understanding",
        "rationale": "This is explicitly mentioned as essential in paragraph [2]"
      },
      {
        "text": "Identifying main ideas",
        "rationale": "This is listed as one of the important skills in paragraph [2]"
      },
      {
        "text": "Making connections in text",
        "rationale": "This is mentioned as one of the key skills in paragraph [2]"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [2] lists three specific skills: understanding vocabulary, identifying main ideas, and making connections. Reading speed is not mentioned.",
    "hint": "Look carefully at the three specific skills listed in the second paragraph.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S2_Q18",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the relationship between practice and reading ability?",
    "options": [
      {
        "text": "Practice leads to improved reading skills, similar to other activities",
        "rationale": "The passage explicitly makes this comparison with bicycle riding and sports"
      },
      {
        "text": "Practice only helps if you read for more than an hour",
        "rationale": "The passage suggests 20 minutes daily is beneficial"
      },
      {
        "text": "Practice is less important than natural ability",
        "rationale": "The passage emphasizes the importance of practice"
      },
      {
        "text": "Practice only works when reading textbooks",
        "rationale": "The passage suggests reading any interesting materials is beneficial"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] directly compares reading improvement through practice to getting better at riding a bicycle or playing a sport, emphasizing that practice leads to improvement.",
    "hint": "Consider how the passage compares reading improvement to other skills.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S2_Q19",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the minimum daily reading time recommended for improvement?",
    "options": [
      {
        "text": "20 minutes",
        "rationale": "This is the specific time mentioned in paragraph [3]"
      },
      {
        "text": "30 minutes",
        "rationale": "This time is not mentioned in the passage"
      },
      {
        "text": "15 minutes",
        "rationale": "This time is not mentioned in the passage"
      },
      {
        "text": "45 minutes",
        "rationale": "This time is not mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [3] specifically states that 'Reading for just 20 minutes every day can help you learn new words and improve your understanding.'",
    "hint": "Look for a specific time mentioned in the third paragraph.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S2_Q20",
    "type": "reading-comprehension",
    "text": "What can be inferred about the author's view of beginning readers?",
    "options": [
      {
        "text": "Everyone can improve with dedication and practice",
        "rationale": "This aligns with the passage's encouraging message about practice and improvement"
      },
      {
        "text": "Some people will never become good readers",
        "rationale": "This contradicts the passage's encouraging message"
      },
      {
        "text": "Beginning readers should only read simple books",
        "rationale": "The passage doesn't restrict reading material choices"
      },
      {
        "text": "Reading ability is determined at birth",
        "rationale": "This conflicts with the passage's emphasis on practice and improvement"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "Paragraph [4] emphasizes that 'everyone starts as a beginner reader' and suggests that 'with time and practice, reading becomes both easier and more enjoyable.'",
    "hint": "Consider the author's tone in the final paragraph about beginning readers.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "easy-level",
      "inference",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S2_Q21",
    "type": "reading-comprehension",
    "text": "In paragraph [1], the phrase 'magic door' is used as a metaphor to represent:",
    "options": [
      {
        "text": "The opportunity to learn and explore through reading",
        "rationale": "This is correct as the passage explicitly compares reading to a magic door that takes you anywhere"
      },
      {
        "text": "A physical door in a library",
        "rationale": "The door is metaphorical, not literal"
      },
      {
        "text": "A portal to fantasy worlds only",
        "rationale": "The passage suggests reading opens doors to all types of knowledge, not just fantasy"
      },
      {
        "text": "The cover of a book",
        "rationale": "While books have covers, the metaphor refers to the act of reading itself"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The passage uses 'magic door' as a metaphor to show how reading gives access to various experiences and knowledge",
    "hint": "Think about what happens when you open a door - where can it lead you?",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S2_Q22",
    "type": "reading-comprehension",
    "text": "Based on paragraph [2], what does the word 'essential' mean in the context of understanding vocabulary?",
    "options": [
      {
        "text": "Necessary and important",
        "rationale": "This matches the context of how vocabulary is described as fundamental to reading"
      },
      {
        "text": "Optional and extra",
        "rationale": "This contradicts the emphasis placed on vocabulary's importance"
      },
      {
        "text": "Difficult and challenging",
        "rationale": "The passage doesn't describe vocabulary as being difficult"
      },
      {
        "text": "Interesting and fun",
        "rationale": "While reading can be enjoyable, this isn't the meaning of 'essential'"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The word 'essential' is used to emphasize that vocabulary understanding is a crucial skill for good reading",
    "hint": "Look at how vocabulary is described in relation to other reading skills",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S2_Q23",
    "type": "reading-comprehension",
    "text": "In paragraph [3], what does the phrase 'just like' suggest about reading practice?",
    "options": [
      {
        "text": "It improves with repetition",
        "rationale": "The comparison to bicycle riding and sports shows that practice leads to improvement"
      },
      {
        "text": "It requires special equipment",
        "rationale": "The passage doesn't mention needing special equipment"
      },
      {
        "text": "It can be dangerous",
        "rationale": "The passage doesn't suggest any dangers in reading"
      },
      {
        "text": "It needs supervision",
        "rationale": "The passage doesn't mention needing supervision"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The comparison to physical activities shows that reading, like other skills, improves with regular practice",
    "hint": "Consider how people get better at riding bikes or playing sports",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S2_Q24",
    "type": "reading-comprehension",
    "text": "What does the word 'countless' suggest about opportunities in paragraph [1]?",
    "options": [
      {
        "text": "There are unlimited possibilities",
        "rationale": "This matches the passage's emphasis on vast opportunities through reading"
      },
      {
        "text": "They are difficult to find",
        "rationale": "The passage suggests opportunities are abundant, not hard to find"
      },
      {
        "text": "They cost money",
        "rationale": "The passage doesn't discuss monetary costs"
      },
      {
        "text": "They are temporary",
        "rationale": "The passage suggests permanent, not temporary, opportunities"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "'Countless' emphasizes the unlimited nature of opportunities that come from reading well",
    "hint": "Think about whether you could actually count all the opportunities reading provides",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 200,
      "estimatedTime": 2
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S2_Q25",
    "type": "reading-comprehension",
    "text": "In paragraph [4], what does the word 'beginner' imply about reading ability?",
    "options": [
      {
        "text": "It's a starting point that can be improved",
        "rationale": "This matches the passage's message about progress through practice"
      },
      {
        "text": "It's a permanent state",
        "rationale": "The passage explicitly states that reading improves with practice"
      },
      {
        "text": "It's a natural talent",
        "rationale": "The passage emphasizes learning and practice, not natural ability"
      },
      {
        "text": "It's a disadvantage",
        "rationale": "The passage presents it as a normal starting point, not a disadvantage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "difficultyScore": 2,
    "explanation": "The term 'beginner' is used to show that reading ability starts at a basic level and improves with practice",
    "hint": "Consider how the passage describes the progression from beginning to becoming better",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "easy-level",
      "vocabulary",
      "readingbasic"
    ],
    "metadata": {
      "topic": "ReadingBasic",
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
export const easyReadingBasicPassageText = passage;
export const easyReadingBasicReadingQuestions = questions;