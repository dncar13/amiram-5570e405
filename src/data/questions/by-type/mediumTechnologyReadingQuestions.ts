import { Question } from '../../types/questionTypes';

// Reading passage - Technology
const technologyPassageText = `# The Digital Revolution: How Technology is Reshaping Human Society

The past two decades have witnessed an unprecedented technological transformation that has fundamentally altered nearly every aspect of human life. From the way we communicate and work to how we learn and entertain ourselves, digital technology has become the invisible thread weaving through the fabric of modern society. This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges.

One of the most significant developments has been the rise of artificial intelligence and machine learning. These technologies are no longer confined to research laboratories but have become integral to everyday applications. AI algorithms now power search engines, recommend products on shopping platforms, detect fraud in financial transactions, and even assist doctors in diagnosing diseases. Machine learning systems continuously improve their performance by analyzing vast amounts of data, leading to increasingly sophisticated applications that can recognize speech, translate languages in real-time, and even generate creative content.

The widespread adoption of cloud computing has democratized access to powerful computing resources. Small businesses can now access the same computational capabilities that were once exclusive to large corporations, leveling the playing field in many industries. This shift has enabled the rise of countless startups and innovative companies that operate entirely in digital spaces. Remote work, accelerated by global events, has become not just possible but preferable for many organizations, fundamentally changing traditional concepts of workplace and career.

However, this technological advancement comes with significant challenges. Privacy concerns have escalated as companies collect unprecedented amounts of personal data. Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation. The digital divide has become more pronounced, with unequal access to technology creating new forms of social and economic inequality. Additionally, the automation of jobs raises important questions about the future of work and the need for educational systems to adapt to rapidly changing skill requirements.

Despite these challenges, the trajectory of technological development shows no signs of slowing. Emerging technologies like quantum computing, biotechnology, and renewable energy systems promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.`;

// Questions based on the passage
export const technologyReadingQuestions: Question[] = [
  {
    id: 1001,
    type: "reading-comprehension",
    text: "According to the passage, what characterizes the digital revolution?",
    options: [
      "The replacement of all traditional industries with digital ones",
      "The convergence of computing power, internet connectivity, and mobile devices",
      "The elimination of human workers in favor of artificial intelligence",
      "The creation of entirely virtual economies separate from physical markets"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'This digital revolution, characterized by the convergence of computing power, internet connectivity, and mobile devices, has created new possibilities while simultaneously presenting complex challenges.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350,
      estimatedTime: 3
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1002,
    type: "reading-comprehension",
    text: "What has been one of the most significant developments in recent technology according to the passage?",
    options: [
      "The invention of the internet",
      "The rise of artificial intelligence and machine learning",
      "The development of mobile phones",
      "The creation of social media platforms"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage clearly states that 'One of the most significant developments has been the rise of artificial intelligence and machine learning,' and goes on to explain how these technologies have moved from research labs to everyday applications.",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350,
      estimatedTime: 3
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1003,
    type: "reading-comprehension",
    text: "How has cloud computing affected small businesses, as mentioned in the passage?",
    options: [
      "It has forced them to rely more on traditional computing resources",
      "It has limited their access to computational capabilities",
      "It has democratized access to powerful computing resources, leveling the playing field",
      "It has increased their dependency on large corporations"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage indicates that 'The widespread adoption of cloud computing has democratized access to powerful computing resources. Small businesses can now access the same computational capabilities that were once exclusive to large corporations, leveling the playing field in many industries.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350,
      estimatedTime: 3
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1004,
    type: "reading-comprehension",
    text: "According to the passage, what is one of the significant challenges that comes with technological advancement?",
    options: [
      "A decrease in the amount of personal data collected by companies",
      "A reduction in cybersecurity threats",
      "A more equal access to technology across different social groups",
      "Escalated privacy concerns due to companies collecting unprecedented amounts of personal data"
    ],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "The passage mentions that 'Privacy concerns have escalated as companies collect unprecedented amounts of personal data. Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation.' This indicates that increased privacy concerns are a significant challenge.",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350,
      estimatedTime: 3
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1005,
    type: "reading-comprehension",
    text: "What do emerging technologies like quantum computing and biotechnology promise, as suggested by the passage?",
    options: [
      "To replace all existing technologies",
      "To increase the challenges humanity faces",
      "To address some of humanity's most pressing challenges while creating new opportunities",
      "To slow down the pace of technological development"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage concludes by stating that 'Emerging technologies like quantum computing, biotechnology, and renewable energy systems promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350,
      estimatedTime: 3
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  }
];
