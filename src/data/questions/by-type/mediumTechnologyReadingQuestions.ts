
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
      wordCount: 350
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
      wordCount: 350
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
      wordCount: 350
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
      wordCount: 350
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
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1006,
    type: "reading-comprehension",
    text: "According to the passage, where are AI algorithms now being used?",
    options: [
      "Only in research laboratories",
      "In search engines, shopping platforms, financial transactions, and medical diagnosis",
      "Exclusively in social media platforms",
      "Only in military applications"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'AI algorithms now power search engines, recommend products on shopping platforms, detect fraud in financial transactions, and even assist doctors in diagnosing diseases.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1007,
    type: "reading-comprehension",
    text: "What capability of machine learning systems is highlighted in the passage?",
    options: [
      "They remain static in their performance",
      "They continuously improve their performance by analyzing vast amounts of data",
      "They can only work with small datasets",
      "They require constant human intervention to function"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage mentions that 'Machine learning systems continuously improve their performance by analyzing vast amounts of data, leading to increasingly sophisticated applications that can recognize speech, translate languages in real-time, and even generate creative content.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1008,
    type: "reading-comprehension",
    text: "What effect has the shift to cloud computing had on startups and companies?",
    options: [
      "It has made it harder for new companies to compete",
      "It has enabled the rise of countless startups and companies operating in digital spaces",
      "It has decreased innovation in the business sector",
      "It has limited companies to traditional business models"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'This shift has enabled the rise of countless startups and innovative companies that operate entirely in digital spaces.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1009,
    type: "reading-comprehension",
    text: "How has remote work changed according to the passage?",
    options: [
      "It has become less popular due to technological limitations",
      "It has remained the same as before",
      "It has become not just possible but preferable for many organizations",
      "It has been completely replaced by traditional office work"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage indicates that 'Remote work, accelerated by global events, has become not just possible but preferable for many organizations, fundamentally changing traditional concepts of workplace and career.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1010,
    type: "reading-comprehension",
    text: "What does the passage say about cybersecurity threats?",
    options: [
      "They have decreased with technological advancement",
      "They have remained constant over time",
      "They have evolved alongside technological capabilities",
      "They only affect large corporations"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that 'Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1011,
    type: "reading-comprehension",
    text: "According to the passage, what has happened to the digital divide?",
    options: [
      "It has been completely eliminated",
      "It has become more pronounced, creating new forms of inequality",
      "It only affects developing countries",
      "It has decreased significantly"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage mentions that 'The digital divide has become more pronounced, with unequal access to technology creating new forms of social and economic inequality.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1012,
    type: "reading-comprehension",
    text: "What concern does the passage raise about job automation?",
    options: [
      "It will create more jobs than it eliminates",
      "It raises important questions about the future of work and educational adaptation",
      "It will have no impact on employment",
      "It only affects manufacturing jobs"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'the automation of jobs raises important questions about the future of work and the need for educational systems to adapt to rapidly changing skill requirements.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1013,
    type: "reading-comprehension",
    text: "What does the passage suggest about the pace of technological development?",
    options: [
      "It is slowing down significantly",
      "It shows no signs of slowing",
      "It has reached its peak",
      "It is becoming more predictable"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'Despite these challenges, the trajectory of technological development shows no signs of slowing.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1014,
    type: "reading-comprehension",
    text: "Which technologies are mentioned as examples of emerging technologies?",
    options: [
      "Social media and gaming platforms",
      "Quantum computing, biotechnology, and renewable energy systems",
      "Traditional computing and databases",
      "Television and radio broadcasting"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage specifically mentions 'Emerging technologies like quantum computing, biotechnology, and renewable energy systems' as examples.",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1015,
    type: "reading-comprehension",
    text: "What does the passage say about the impact of technology on communication?",
    options: [
      "Technology has had no impact on communication",
      "Technology has fundamentally altered the way we communicate",
      "Technology has made communication more difficult",
      "Technology only affects business communication"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage begins by stating that technological transformation 'has fundamentally altered nearly every aspect of human life. From the way we communicate and work to how we learn and entertain ourselves.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1016,
    type: "reading-comprehension",
    text: "What capabilities of machine learning applications are mentioned in the passage?",
    options: [
      "Only text processing",
      "Speech recognition, real-time language translation, and creative content generation",
      "Only image processing",
      "Only numerical calculations"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage mentions that machine learning applications 'can recognize speech, translate languages in real-time, and even generate creative content.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1017,
    type: "reading-comprehension",
    text: "According to the passage, how has technology affected traditional concepts of workplace?",
    options: [
      "It has reinforced traditional workplace concepts",
      "It has had no effect on workplace concepts",
      "It has fundamentally changed traditional concepts of workplace and career",
      "It has only affected certain industries"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that remote work 'has become not just possible but preferable for many organizations, fundamentally changing traditional concepts of workplace and career.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1018,
    type: "reading-comprehension",
    text: "What role does digital technology play in modern society according to the passage?",
    options: [
      "It plays a minor supporting role",
      "It has become the invisible thread weaving through the fabric of modern society",
      "It only affects certain sectors",
      "It is mainly used for entertainment"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage describes digital technology as 'the invisible thread weaving through the fabric of modern society.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1019,
    type: "reading-comprehension",
    text: "What does the passage suggest about educational systems in relation to technological change?",
    options: [
      "Educational systems don't need to change",
      "Educational systems need to adapt to rapidly changing skill requirements",
      "Educational systems should resist technological change",
      "Educational systems are already perfectly adapted"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage mentions 'the need for educational systems to adapt to rapidly changing skill requirements' as a consequence of job automation.",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1020,
    type: "reading-comprehension",
    text: "According to the passage, what type of companies can now access powerful computing resources?",
    options: [
      "Only large corporations",
      "Only technology companies",
      "Small businesses can now access the same capabilities as large corporations",
      "Only government organizations"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that 'Small businesses can now access the same computational capabilities that were once exclusive to large corporations.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1021,
    type: "reading-comprehension",
    text: "What does the passage say about the relationship between technological capabilities and cybersecurity threats?",
    options: [
      "They are unrelated",
      "Cybersecurity threats have evolved alongside technological capabilities",
      "Technological capabilities have eliminated cybersecurity threats",
      "Cybersecurity threats only affect older technologies"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'Cybersecurity threats have evolved alongside technological capabilities, requiring constant vigilance and adaptation.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1022,
    type: "reading-comprehension",
    text: "What is described as a significant consequence of unequal access to technology?",
    options: [
      "Improved social equality",
      "New forms of social and economic inequality",
      "Better educational opportunities for all",
      "Reduced competition in business"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'unequal access to technology creating new forms of social and economic inequality.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1023,
    type: "reading-comprehension",
    text: "According to the passage, what has been the overall impact of the digital revolution?",
    options: [
      "It has only created challenges",
      "It has created new possibilities while simultaneously presenting complex challenges",
      "It has only created opportunities",
      "It has had no significant impact"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that the digital revolution 'has created new possibilities while simultaneously presenting complex challenges.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1024,
    type: "reading-comprehension",
    text: "What time period does the passage refer to when discussing technological transformation?",
    options: [
      "The past century",
      "The past five years",
      "The past two decades",
      "The past decade"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage begins by stating 'The past two decades have witnessed an unprecedented technological transformation.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 1025,
    type: "reading-comprehension",
    text: "What does the passage suggest about future opportunities from emerging technologies?",
    options: [
      "They will create fewer opportunities than current technologies",
      "They will create new opportunities for innovation and growth",
      "They will only benefit large corporations",
      "They will replace all current opportunities"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage concludes that emerging technologies 'promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.'",
    topicId: 2,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      wordCount: 350
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  }
];
