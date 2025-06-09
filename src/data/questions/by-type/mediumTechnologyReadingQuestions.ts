import { Question } from "../../types/questionTypes";

export const technologyPassageText = `
Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, revolutionizing industries and reshaping how we live and work. From machine learning algorithms that power recommendation systems to sophisticated neural networks that enable autonomous vehicles, AI is no longer confined to science fiction but has become an integral part of our daily lives.

The development of AI can be traced back to the 1950s, but recent advances in computing power, data availability, and algorithmic sophistication have accelerated its practical applications. Machine learning, a subset of AI, allows computers to learn and improve from experience without being explicitly programmed for every task. Deep learning, which uses neural networks with multiple layers, has enabled breakthrough capabilities in image recognition, natural language processing, and decision-making.

Today's AI applications span numerous sectors. In healthcare, AI assists in medical diagnosis, drug discovery, and personalized treatment plans. In finance, algorithmic trading and fraud detection systems rely heavily on AI technologies. Transportation is being revolutionized by autonomous vehicles and smart traffic management systems. Even creative industries are embracing AI for content generation, music composition, and artistic design.

However, the rapid advancement of AI also raises important questions and concerns. Issues of privacy, job displacement, algorithmic bias, and the potential for AI systems to make decisions without human oversight are subjects of ongoing debate. The challenge lies in harnessing AI's potential benefits while addressing these ethical and practical concerns.

As we move forward, the integration of AI into society will likely continue to accelerate, making it essential for individuals, businesses, and governments to understand both its capabilities and limitations.
`;

export const technologyReadingQuestions: Question[] = [
  {
    id: 1001,
    type: 'reading-comprehension',
    text: `According to the passage, what has accelerated the practical applications of AI in recent years?`,
    options: [
      "Government funding and support",
      "Computing power, data availability, and algorithmic sophistication",
      "Public demand and market pressure",
      "International cooperation and collaboration"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'recent advances in computing power, data availability, and algorithmic sophistication have accelerated its practical applications.'",
    topicId: 2,
    difficulty: 'medium',
    passageText: technologyPassageText,
    passageTitle: "Artificial Intelligence Revolution",
    tags: ["technology", "AI", "computing"],
    metadata: {
      topic: "Technology",
      wordCount: 320
    }
  },
  {
    id: 1002,
    type: 'reading-comprehension',
    text: `What is machine learning according to the passage?`,
    options: [
      "A type of computer hardware",
      "A subset of AI that allows computers to learn from experience",
      "A programming language for AI",
      "A method for building neural networks"
    ],
    correctAnswer: 1,
    explanation: "The passage defines machine learning as 'a subset of AI, allows computers to learn and improve from experience without being explicitly programmed for every task.'",
    topicId: 2,
    difficulty: 'easy',
    passageText: technologyPassageText,
    passageTitle: "Artificial Intelligence Revolution",
    tags: ["technology", "machine-learning", "AI"],
    metadata: {
      topic: "Technology",
      wordCount: 320
    }
  },
  {
    id: 1003,
    type: 'reading-comprehension',
    text: `Which of the following sectors is NOT specifically mentioned as using AI applications?`,
    options: [
      "Healthcare",
      "Finance",
      "Agriculture",
      "Transportation"
    ],
    correctAnswer: 2,
    explanation: "The passage mentions healthcare, finance, transportation, and creative industries as sectors using AI, but agriculture is not specifically mentioned.",
    topicId: 2,
    difficulty: 'easy',
    passageText: technologyPassageText,
    passageTitle: "Artificial Intelligence Revolution",
    tags: ["technology", "AI", "applications"],
    metadata: {
      topic: "Technology",
      wordCount: 320
    }
  },
  {
    id: 1004,
    type: 'reading-comprehension',
    text: `What concerns about AI does the passage mention?`,
    options: [
      "High costs and technical complexity",
      "Privacy, job displacement, and algorithmic bias",
      "Limited computing power and data storage",
      "Lack of skilled professionals"
    ],
    correctAnswer: 1,
    explanation: "The passage specifically mentions 'Issues of privacy, job displacement, algorithmic bias, and the potential for AI systems to make decisions without human oversight.'",
    topicId: 2,
    difficulty: 'medium',
    passageText: technologyPassageText,
    passageTitle: "Artificial Intelligence Revolution",
    tags: ["technology", "AI", "ethics"],
    metadata: {
      topic: "Technology",
      wordCount: 320
    }
  },
  {
    id: 1005,
    type: 'reading-comprehension',
    text: `What does the passage suggest about the future of AI integration?`,
    options: [
      "It will slow down due to technical limitations",
      "It will continue to accelerate",
      "It will remain limited to specific industries",
      "It will be replaced by newer technologies"
    ],
    correctAnswer: 1,
    explanation: "The passage concludes that 'the integration of AI into society will likely continue to accelerate.'",
    topicId: 2,
    difficulty: 'easy',
    passageText: technologyPassageText,
    passageTitle: "Artificial Intelligence Revolution",
    tags: ["technology", "AI", "future"],
    metadata: {
      topic: "Technology",
      wordCount: 320
    }
  }
];
