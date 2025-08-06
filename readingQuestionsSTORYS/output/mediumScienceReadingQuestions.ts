import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = {
  "title": "The Hidden Mathematics of Nature's Patterns",
  "difficulty": "medium",
  "topic": "Science",
  "wordCount": 316,
  "numQuestions": 25,
  "estimatedTime": 3,
  "topicId": 1
};

// Reading passage - The Hidden Mathematics of Nature's Patterns (medium level)
export const passage = `The Hidden Mathematics of Nature's Patterns

[1] Mathematics might seem like a purely human invention, but nature has been practicing its own form of mathematics long before humans existed. From the spiral pattern of shells to the hexagonal cells of a honeycomb, mathematical principles appear consistently throughout the natural world. One of the most fascinating examples is the Fibonacci sequence, where each number is the sum of the two preceding ones. This sequence appears in unexpected places, from the arrangement of leaves on plant stems to the family trees of honeybees.

[2] The geometric patterns found in nature serve practical purposes beyond their aesthetic appeal. Snowflakes, for instance, always form with six-fold symmetry due to the molecular structure of water and the conditions under which they freeze. Similarly, the hexagonal shape of honeycomb cells provides maximum storage space while using minimal building materials, demonstrating nature's efficiency. Even the stripes and spots on animals' coats follow mathematical rules, helping them either stand out to attract mates or blend in to avoid predators.

[3] Perhaps most remarkably, these mathematical patterns extend from the smallest to the largest scales in our universe. The spiral shape seen in a nautilus shell mirrors the same logarithmic spiral found in hurricane formations and even in the structure of entire galaxies. Scientists have discovered that the branching patterns of trees follow the same mathematical principles as the branching of blood vessels in our bodies and the tributaries of river systems. This phenomenon, known as fractal geometry, shows how similar patterns repeat at different scales throughout nature.

[4] Understanding these natural mathematical patterns has led to numerous technological innovations. Engineers and architects now use these principles in designing more efficient and sustainable structures. From solar panels arranged in sunflower-like patterns to maximize energy collection, to buildings designed with natural ventilation systems based on termite mounds, nature's mathematics continues to inspire human innovation and problem-solving.`;

// Enhanced questions with all improvements
export const questions: Question[] = [
  {
    "questionId": "S1_Q1",
    "type": "reading-comprehension",
    "text": "According to the passage, what sequence appears in both the arrangement of leaves on plant stems and honeybee family trees?",
    "options": [
      {
        "text": "The Fibonacci sequence",
        "rationale": "Correct - the passage explicitly states that the Fibonacci sequence appears in these two examples"
      },
      {
        "text": "The geometric sequence",
        "rationale": "Incorrect - while geometry is mentioned in the passage, it's not specifically linked to these examples"
      },
      {
        "text": "The logarithmic sequence",
        "rationale": "Incorrect - logarithmic spirals are mentioned later in relation to different examples"
      },
      {
        "text": "The hexagonal sequence",
        "rationale": "Incorrect - hexagonal patterns are mentioned in relation to honeycombs and snowflakes, not leaves or bee family trees"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage directly states in paragraph 1 that the Fibonacci sequence appears in 'the arrangement of leaves on plant stems to the family trees of honeybees.'",
    "hint": "Look for a specific mathematical sequence mentioned in relation to plant growth patterns.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 1,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 1"
  },
  {
    "questionId": "S1_Q2",
    "type": "reading-comprehension",
    "text": "Why do snowflakes always form with six-fold symmetry?",
    "options": [
      {
        "text": "Due to the molecular structure of water and freezing conditions",
        "rationale": "Correct - this is explicitly stated in the passage"
      },
      {
        "text": "To maximize storage space",
        "rationale": "Incorrect - this relates to honeycomb cells, not snowflakes"
      },
      {
        "text": "To attract mates",
        "rationale": "Incorrect - this relates to animal patterns, not snowflakes"
      },
      {
        "text": "To demonstrate nature's efficiency",
        "rationale": "Incorrect - while nature's efficiency is mentioned, it's not the reason for snowflake symmetry"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 2 explicitly states that snowflakes form with six-fold symmetry 'due to the molecular structure of water and the conditions under which they freeze.'",
    "hint": "The answer relates to the physical properties of water.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 2,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 2"
  },
  {
    "questionId": "S1_Q3",
    "type": "reading-comprehension",
    "text": "What pattern is shared between nautilus shells, hurricanes, and galaxies?",
    "options": [
      {
        "text": "The logarithmic spiral",
        "rationale": "Correct - the passage explicitly states these three examples share this pattern"
      },
      {
        "text": "The hexagonal pattern",
        "rationale": "Incorrect - hexagonal patterns are mentioned in relation to different examples"
      },
      {
        "text": "The branching pattern",
        "rationale": "Incorrect - branching patterns are mentioned in relation to trees and blood vessels"
      },
      {
        "text": "The Fibonacci sequence",
        "rationale": "Incorrect - while mentioned in the passage, it's not connected to these specific examples"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 states that 'the spiral shape seen in a nautilus shell mirrors the same logarithmic spiral found in hurricane formations and even in the structure of entire galaxies.'",
    "hint": "Look for a specific type of spiral mentioned in relation to these three natural phenomena.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 3,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 3"
  },
  {
    "questionId": "S1_Q4",
    "type": "reading-comprehension",
    "text": "What principle is demonstrated by the branching patterns shared by trees, blood vessels, and river systems?",
    "options": [
      {
        "text": "Fractal geometry",
        "rationale": "Correct - the passage identifies this as the phenomenon behind these similar branching patterns"
      },
      {
        "text": "Fibonacci sequence",
        "rationale": "Incorrect - while mentioned in the passage, it's not related to these branching patterns"
      },
      {
        "text": "Hexagonal symmetry",
        "rationale": "Incorrect - this relates to different examples in the passage"
      },
      {
        "text": "Logarithmic spirals",
        "rationale": "Incorrect - this relates to different patterns mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states in paragraph 3 that these branching patterns are an example of 'fractal geometry, which shows how similar patterns repeat at different scales throughout nature.'",
    "hint": "Look for the term that describes patterns repeating at different scales.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 4,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 4"
  },
  {
    "questionId": "S1_Q5",
    "type": "reading-comprehension",
    "text": "How have engineers applied natural mathematical patterns in modern technology?",
    "options": [
      {
        "text": "By arranging solar panels in sunflower-like patterns",
        "rationale": "Correct - this is specifically mentioned as an example of biomimicry in engineering"
      },
      {
        "text": "By creating hexagonal snowflakes",
        "rationale": "Incorrect - snowflakes are a natural phenomenon, not an engineering application"
      },
      {
        "text": "By developing new animal patterns",
        "rationale": "Incorrect - animal patterns are mentioned as natural examples, not engineering applications"
      },
      {
        "text": "By creating new mathematical sequences",
        "rationale": "Incorrect - the passage discusses applying existing patterns, not creating new ones"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 4 specifically mentions that solar panels are arranged in sunflower-like patterns to maximize energy collection as an example of how natural mathematical patterns are used in technology.",
    "hint": "Look for specific examples of how nature's patterns are used in modern technology.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "attention-to-detail",
      "fact-finding"
    ],
    "tags": [
      "medium-level",
      "detail",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 5,
      "questionType": "detail",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 5"
  },
  {
    "questionId": "S1_Q6",
    "type": "reading-comprehension",
    "text": "What is the main purpose of mathematical patterns in nature according to the passage?",
    "options": [
      {
        "text": "To serve practical functions beyond aesthetic beauty",
        "rationale": "The passage explicitly states that patterns serve practical purposes and provides multiple examples like honeycomb efficiency and animal camouflage"
      },
      {
        "text": "To inspire human art and creativity",
        "rationale": "While mentioned in context of innovation, this is not the main natural purpose described"
      },
      {
        "text": "To create symmetrical shapes",
        "rationale": "Symmetry is just one example, not the main purpose of natural patterns"
      },
      {
        "text": "To demonstrate mathematical complexity",
        "rationale": "The passage focuses on functionality rather than complexity for its own sake"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Throughout the passage, particularly in paragraph 2, various examples demonstrate how mathematical patterns serve practical purposes in nature, from efficient storage in honeycombs to survival functions in animal patterns.",
    "hint": "Look for examples of how patterns help organisms and natural structures function effectively",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 6,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 6"
  },
  {
    "questionId": "S1_Q7",
    "type": "reading-comprehension",
    "text": "According to the passage, how do the Fibonacci sequence and fractal geometry demonstrate mathematical patterns in nature?",
    "options": [
      {
        "text": "They both show how patterns repeat at different scales",
        "rationale": "Only fractal geometry is described this way in the passage"
      },
      {
        "text": "They appear in completely unrelated natural phenomena",
        "rationale": "While they appear in different places, the passage emphasizes their interconnectedness"
      },
      {
        "text": "They illustrate mathematical principles occurring across diverse natural examples",
        "rationale": "The passage provides multiple examples for both concepts, showing their widespread presence in nature"
      },
      {
        "text": "They are human inventions applied to nature",
        "rationale": "The passage explicitly states that nature practiced mathematics before humans"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes both the Fibonacci sequence and fractal geometry appearing in multiple natural phenomena, from plant structures to galaxy formations.",
    "hint": "Consider how these mathematical concepts are exemplified in different natural elements",
    "paragraphReference": "Paragraphs [1, 3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 7,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 7"
  },
  {
    "questionId": "S1_Q8",
    "type": "reading-comprehension",
    "text": "What does the passage suggest about the relationship between natural patterns and human innovation?",
    "options": [
      {
        "text": "Humans have improved upon nature's patterns",
        "rationale": "The passage doesn't suggest human improvements to natural patterns"
      },
      {
        "text": "Natural patterns serve as models for human technological solutions",
        "rationale": "The passage explicitly describes how natural patterns inspire human innovation"
      },
      {
        "text": "Human innovation conflicts with natural patterns",
        "rationale": "The passage suggests harmony rather than conflict"
      },
      {
        "text": "Natural patterns are too complex for practical application",
        "rationale": "The passage provides examples of successful applications"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 4 specifically discusses how engineers and architects use natural mathematical patterns as inspiration for technological innovations and sustainable design.",
    "hint": "Look at how the passage describes human use of natural mathematical principles",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 8,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 8"
  },
  {
    "questionId": "S1_Q9",
    "type": "reading-comprehension",
    "text": "What principle is illustrated by the hexagonal shape of honeycomb cells?",
    "options": [
      {
        "text": "Aesthetic beauty in nature",
        "rationale": "The passage emphasizes function over aesthetics for this example"
      },
      {
        "text": "Random pattern formation",
        "rationale": "The pattern is described as efficient, not random"
      },
      {
        "text": "Natural efficiency in resource use",
        "rationale": "The passage explicitly states this provides maximum storage with minimal materials"
      },
      {
        "text": "Symbolic mathematics",
        "rationale": "The focus is on practical function rather than symbolic meaning"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explicitly states that honeycomb hexagons provide maximum storage space while using minimal building materials, demonstrating nature's efficiency.",
    "hint": "Think about what practical advantage the hexagonal shape provides",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 9,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 9"
  },
  {
    "questionId": "S1_Q10",
    "type": "reading-comprehension",
    "text": "Which statement best describes the scope of mathematical patterns in nature according to the passage?",
    "options": [
      {
        "text": "They occur only in visible structures",
        "rationale": "The passage describes patterns at various scales, visible and invisible"
      },
      {
        "text": "They exist across all scales of the universe",
        "rationale": "The passage explicitly states patterns extend from smallest to largest scales"
      },
      {
        "text": "They are limited to biological systems",
        "rationale": "The passage includes non-biological examples like snowflakes and galaxies"
      },
      {
        "text": "They appear only in regular geometric shapes",
        "rationale": "The passage includes various types of patterns beyond regular geometry"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "Paragraph 3 explicitly states that mathematical patterns extend from the smallest to the largest scales in our universe, providing examples from microscopic to galactic scales.",
    "hint": "Consider the range of examples provided in the passage, from tiny to enormous",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 10,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 10"
  },
  {
    "questionId": "S1_Q11",
    "type": "reading-comprehension",
    "text": "What is the main purpose of mathematical patterns in nature according to the passage?",
    "options": [
      {
        "text": "They serve practical functions while also being aesthetically pleasing",
        "rationale": "This is supported by paragraph 2, which explains how patterns serve practical purposes beyond their visual appeal"
      },
      {
        "text": "They exist solely to create visual beauty in nature",
        "rationale": "The passage emphasizes practical functions beyond just aesthetics"
      },
      {
        "text": "They were created by humans to explain natural phenomena",
        "rationale": "The passage explicitly states that these patterns existed before humans"
      },
      {
        "text": "They only appear in small-scale natural structures",
        "rationale": "The passage states that patterns exist from smallest to largest scales"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage emphasizes that natural mathematical patterns serve practical purposes, from efficient storage in honeycombs to survival functions in animal patterns, while also being aesthetically pleasing.",
    "hint": "Look for examples of how patterns benefit the organisms or structures that possess them",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 11,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 11"
  },
  {
    "questionId": "S1_Q12",
    "type": "reading-comprehension",
    "text": "Which statement best describes the relationship between mathematics and nature as presented in the passage?",
    "options": [
      {
        "text": "Nature inherently follows mathematical principles independently of human invention",
        "rationale": "This aligns with the passage's opening statement about nature practicing mathematics before humans"
      },
      {
        "text": "Humans created mathematical principles to explain nature",
        "rationale": "This contradicts the passage's assertion that nature practiced mathematics before humans"
      },
      {
        "text": "Mathematical patterns only appear in certain specific natural phenomena",
        "rationale": "The passage shows patterns appear throughout nature at all scales"
      },
      {
        "text": "Natural patterns are random and only coincidentally match mathematical principles",
        "rationale": "The passage presents these patterns as systematic and purposeful"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage begins by establishing that mathematics is not a human invention but rather an inherent aspect of nature that existed before humans.",
    "hint": "Consider how the passage introduces the relationship between mathematics and nature in the first paragraph",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 12,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 12"
  },
  {
    "questionId": "S1_Q13",
    "type": "reading-comprehension",
    "text": "What is significant about fractal geometry according to the passage?",
    "options": [
      {
        "text": "It demonstrates how similar patterns repeat at different scales in nature",
        "rationale": "This directly matches the passage's explanation of fractal geometry"
      },
      {
        "text": "It only applies to galaxy formations",
        "rationale": "The passage mentions galaxies as just one example among many"
      },
      {
        "text": "It was invented by human mathematicians",
        "rationale": "The passage discusses it as an observed natural phenomenon"
      },
      {
        "text": "It only occurs in plant structures",
        "rationale": "The passage mentions multiple examples beyond plants"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage explains that fractal geometry shows how similar patterns repeat at different scales, from blood vessels to river systems to galaxies.",
    "hint": "Look for information about how patterns appear at different scales in nature",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 13,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 13"
  },
  {
    "questionId": "S1_Q14",
    "type": "reading-comprehension",
    "text": "How are natural mathematical patterns being used in modern technology?",
    "options": [
      {
        "text": "They inspire efficient and sustainable design solutions",
        "rationale": "This matches the passage's discussion of technological applications"
      },
      {
        "text": "They are used to create decorative designs only",
        "rationale": "The passage emphasizes practical applications beyond aesthetics"
      },
      {
        "text": "They are primarily used in medical research",
        "rationale": "The passage doesn't focus on medical applications"
      },
      {
        "text": "They have no practical applications in technology",
        "rationale": "The passage explicitly describes technological applications"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The final paragraph describes how these patterns inspire technological innovations in engineering and architecture, particularly in efficient and sustainable design.",
    "hint": "Check the final paragraph for examples of how these patterns are applied in modern technology",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 14,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 14"
  },
  {
    "questionId": "S1_Q15",
    "type": "reading-comprehension",
    "text": "Which of the following best exemplifies the Fibonacci sequence in nature?",
    "options": [
      {
        "text": "The arrangement of leaves on plant stems",
        "rationale": "This is specifically mentioned as an example of the Fibonacci sequence in nature"
      },
      {
        "text": "The shape of snowflakes",
        "rationale": "Snowflakes are mentioned as an example of six-fold symmetry, not Fibonacci sequence"
      },
      {
        "text": "The stripes on animal coats",
        "rationale": "Animal patterns are mentioned but not in relation to the Fibonacci sequence"
      },
      {
        "text": "The structure of galaxies",
        "rationale": "Galaxies are mentioned in relation to spiral patterns, not specifically the Fibonacci sequence"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically mentions the arrangement of leaves on plant stems as an example of the Fibonacci sequence in nature.",
    "hint": "Look for specific examples mentioned in connection with the Fibonacci sequence",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "comprehension",
      "summarization"
    ],
    "tags": [
      "medium-level",
      "main-idea",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 15,
      "questionType": "main-idea",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 15"
  },
  {
    "questionId": "S1_Q16",
    "type": "reading-comprehension",
    "text": "Based on the passage, what can be inferred about the relationship between mathematics and nature?",
    "options": [
      {
        "text": "Mathematics was discovered rather than invented by humans",
        "rationale": "The passage suggests mathematical principles existed in nature before humans, implying discovery rather than invention"
      },
      {
        "text": "Natural patterns are random and only coincidentally mathematical",
        "rationale": "Contradicts the passage's emphasis on consistent mathematical principles in nature"
      },
      {
        "text": "Humans created mathematical principles and applied them to nature",
        "rationale": "Contradicts the passage's statement that nature practiced mathematics before humans"
      },
      {
        "text": "Mathematical patterns only appear in certain specific natural phenomena",
        "rationale": "Contradicts the passage's description of mathematical patterns across various scales and phenomena"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage begins by stating that 'mathematics might seem like a purely human invention, but nature has been practicing its own form of mathematics long before humans existed,' supporting the inference that mathematics was discovered in nature rather than invented.",
    "hint": "Consider the passage's opening statement about the relationship between nature and mathematics.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 16,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 16"
  },
  {
    "questionId": "S1_Q17",
    "type": "reading-comprehension",
    "text": "What can be inferred about the purpose of geometric patterns in nature?",
    "options": [
      {
        "text": "They exist purely for aesthetic beauty",
        "rationale": "Contradicts the passage's emphasis on practical purposes"
      },
      {
        "text": "They serve functional purposes for survival and efficiency",
        "rationale": "Supported by examples of honeycomb efficiency and animal camouflage"
      },
      {
        "text": "They are random occurrences without purpose",
        "rationale": "Contradicts the passage's description of practical purposes"
      },
      {
        "text": "They only benefit simple organisms",
        "rationale": "Contradicts the passage's examples across various life forms"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage provides multiple examples of how geometric patterns serve practical purposes, from efficient storage in honeycombs to survival advantages in animal markings.",
    "hint": "Look at the specific examples of how patterns benefit different organisms.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 17,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 17"
  },
  {
    "questionId": "S1_Q18",
    "type": "reading-comprehension",
    "text": "Based on the passage, what can be concluded about fractal geometry in nature?",
    "options": [
      {
        "text": "It only occurs in large-scale natural phenomena",
        "rationale": "Contradicts the passage's description of patterns at all scales"
      },
      {
        "text": "It demonstrates nature's interconnectedness across different scales",
        "rationale": "Supported by examples of similar patterns at different scales"
      },
      {
        "text": "It is limited to biological systems",
        "rationale": "Contradicts examples including non-biological phenomena like hurricanes"
      },
      {
        "text": "It is a recent human discovery",
        "rationale": "Not supported by the passage"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes how fractal geometry shows similar patterns repeating at different scales throughout nature, from blood vessels to river systems and galaxies.",
    "hint": "Consider how the passage describes patterns appearing at different scales in nature.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 18,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 18"
  },
  {
    "questionId": "S1_Q19",
    "type": "reading-comprehension",
    "text": "What can be inferred about the impact of natural mathematical patterns on human innovation?",
    "options": [
      {
        "text": "They have limited applications in technology",
        "rationale": "Contradicts the passage's examples of various applications"
      },
      {
        "text": "They inspire more efficient and sustainable solutions",
        "rationale": "Supported by examples of biomimicry in architecture and engineering"
      },
      {
        "text": "They are too complex to be practically applied",
        "rationale": "Contradicts the passage's examples of successful applications"
      },
      {
        "text": "They only benefit architectural design",
        "rationale": "Contradicts the range of applications mentioned"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes how understanding natural patterns has led to numerous innovations in technology and architecture, particularly in creating more efficient and sustainable designs.",
    "hint": "Look at how humans have used natural patterns in modern applications.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 19,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 19"
  },
  {
    "questionId": "S1_Q20",
    "type": "reading-comprehension",
    "text": "What can be inferred about the Fibonacci sequence in nature?",
    "options": [
      {
        "text": "It appears randomly in natural phenomena",
        "rationale": "Contradicts the passage's description of consistent appearances"
      },
      {
        "text": "It is fundamental to many natural growth patterns",
        "rationale": "Supported by examples in plant growth and honeybee reproduction"
      },
      {
        "text": "It only occurs in plant life",
        "rationale": "Contradicts the passage's mention of honeybee family trees"
      },
      {
        "text": "It was created by human mathematicians",
        "rationale": "Contradicts the passage's premise about natural mathematics"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage shows the Fibonacci sequence appearing consistently in various natural phenomena, suggesting it is a fundamental pattern in nature's growth and organization.",
    "hint": "Consider the examples given of where the Fibonacci sequence appears in nature.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "logical-reasoning",
      "cause-effect"
    ],
    "tags": [
      "medium-level",
      "inference",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 20,
      "questionType": "inference",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 20"
  },
  {
    "questionId": "S1_Q21",
    "type": "reading-comprehension",
    "text": "Based on the passage, what is the best definition of 'fractal geometry'?",
    "options": [
      {
        "text": "A mathematical pattern that repeats at different scales",
        "rationale": "Correct - the passage explicitly defines this in Paragraph 3 with examples of similar patterns repeating at different scales"
      },
      {
        "text": "The spiral shape found in nautilus shells",
        "rationale": "Incorrect - this is just one example of a natural pattern, not the definition of fractal geometry"
      },
      {
        "text": "The study of geometric shapes in nature",
        "rationale": "Incorrect - while related, this is too broad and doesn't capture the key aspect of patterns repeating at different scales"
      },
      {
        "text": "The mathematical principles behind animal markings",
        "rationale": "Incorrect - while the passage mentions animal patterns, this isn't the definition of fractal geometry"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage defines fractal geometry through examples showing 'how similar patterns repeat at different scales throughout nature,' including tree branches, blood vessels, and river systems.",
    "hint": "Look for the explanation that follows the term in paragraph 3, particularly how it relates to different scales.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 21,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 21"
  },
  {
    "questionId": "S1_Q22",
    "type": "reading-comprehension",
    "text": "According to the passage, what is the primary purpose of geometric patterns in honeycomb cells?",
    "options": [
      {
        "text": "To create visually appealing structures",
        "rationale": "Incorrect - while honeycombs may be beautiful, the passage emphasizes their practical purpose"
      },
      {
        "text": "To maximize space while minimizing materials",
        "rationale": "Correct - the passage explicitly states this as the purpose of the hexagonal shape"
      },
      {
        "text": "To demonstrate mathematical principles",
        "rationale": "Incorrect - while they do demonstrate these principles, this isn't their primary purpose"
      },
      {
        "text": "To copy patterns found elsewhere in nature",
        "rationale": "Incorrect - the passage doesn't suggest this is the purpose"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage states that 'the hexagonal shape of honeycomb cells provides maximum storage space while using minimal building materials, demonstrating nature's efficiency.'",
    "hint": "Focus on the practical benefit described for the hexagonal shape.",
    "paragraphReference": "Paragraph [2]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 22,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 22"
  },
  {
    "questionId": "S1_Q23",
    "type": "reading-comprehension",
    "text": "What conclusion can be drawn about the Fibonacci sequence in nature?",
    "options": [
      {
        "text": "It only appears in plant structures",
        "rationale": "Incorrect - the passage mentions both plants and honeybee family trees"
      },
      {
        "text": "It was invented by humans",
        "rationale": "Incorrect - the passage suggests these patterns existed before humans"
      },
      {
        "text": "It occurs naturally in diverse contexts",
        "rationale": "Correct - the passage provides multiple examples in different natural contexts"
      },
      {
        "text": "It is limited to mathematical calculations",
        "rationale": "Incorrect - the passage shows it exists in natural phenomena"
      }
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes the Fibonacci sequence appearing in multiple natural contexts, including leaf arrangements and honeybee family trees, showing its diverse natural occurrences.",
    "hint": "Consider the various examples provided in the first paragraph.",
    "paragraphReference": "Paragraph [1]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 23,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 23"
  },
  {
    "questionId": "S1_Q24",
    "type": "reading-comprehension",
    "text": "How has the study of natural mathematical patterns influenced human innovation?",
    "options": [
      {
        "text": "By inspiring more efficient design solutions",
        "rationale": "Correct - the passage provides examples of nature-inspired efficient designs in architecture and engineering"
      },
      {
        "text": "By creating new mathematical theories",
        "rationale": "Incorrect - while mathematics is discussed, the passage focuses on practical applications"
      },
      {
        "text": "By improving animal camouflage",
        "rationale": "Incorrect - this is mentioned as a natural phenomenon, not a human innovation"
      },
      {
        "text": "By developing new computer systems",
        "rationale": "Incorrect - this isn't mentioned in the passage"
      }
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage describes how engineers and architects use natural mathematical principles to design efficient structures, including solar panels and ventilation systems.",
    "hint": "Look at the practical applications described in the final paragraph.",
    "paragraphReference": "Paragraph [4]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "science"
    ],
    "metadata": {
      "topic": "Science",
      "questionNumber": 24,
      "questionType": "vocabulary",
      "totalQuestions": 25,
      "wordCount": 350,
      "estimatedTime": 3
    },
    "aiPrompt": "Generated question 24"
  },
  {
    "questionId": "S1_Q25",
    "type": "reading-comprehension",
    "text": "What pattern is described as being common to both small and large natural structures?",
    "options": [
      {
        "text": "Hexagonal shapes",
        "rationale": "Incorrect - while mentioned, this isn't described as occurring across scales"
      },
      {
        "text": "The logarithmic spiral",
        "rationale": "Correct - the passage explicitly mentions this pattern appearing in shells, hurricanes, and galaxies"
      },
      {
        "text": "Fibonacci numbers",
        "rationale": "Incorrect - while discussed, it's not specifically identified as occurring across scales"
      },
      {
        "text": "Symmetrical patterns",
        "rationale": "Incorrect - while mentioned with snowflakes, it's not described across scales"
      }
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "difficultyScore": 3,
    "explanation": "The passage specifically identifies the logarithmic spiral as appearing across different scales, from nautilus shells to galaxies.",
    "hint": "Look for a pattern that's described as appearing in both very small and very large natural structures.",
    "paragraphReference": "Paragraph [3]",
    "skills": [
      "context-clues",
      "word-meaning"
    ],
    "tags": [
      "medium-level",
      "vocabulary",
      "science"
    ],
    "metadata": {
      "topic": "Science",
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
export const mediumSciencePassageText = passage;
export const mediumScienceReadingQuestions = questions;