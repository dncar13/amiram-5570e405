
import { ReadingPassage, ReadingQuestion, QuestionMetadata } from "../../../../types/questionTypes";

export const metadata: QuestionMetadata = {
  id: "rc-medium-tech-001",
  subject: "technology",
  difficulty: "medium",
  estimatedTime: 15,
  tags: ["artificial-intelligence", "technology", "machine-learning", "innovation"],
  author: "system",
  dateCreated: "2025-06-10",
  lastModified: "2025-06-10",
  validationStatus: "approved"
};

export const passage: ReadingPassage = {
  id: 102,
  title: "Artificial Intelligence Revolution",
  topic: "Technology",
  generalSubject: "Technology",
  text: `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, revolutionizing industries and reshaping how we live and work. From machine learning algorithms that power recommendation systems to sophisticated neural networks that enable autonomous vehicles, AI is no longer confined to science fiction but has become an integral part of our daily lives.

The development of AI can be traced back to the 1950s, but recent advances in computing power, data availability, and algorithmic sophistication have accelerated its practical applications. Machine learning, a subset of AI, allows computers to learn and improve from experience without being explicitly programmed for every task. Deep learning, which uses neural networks with multiple layers, has enabled breakthrough capabilities in image recognition, natural language processing, and decision-making.

Today's AI applications span numerous sectors. In healthcare, AI assists in medical diagnosis, drug discovery, and personalized treatment plans. In finance, algorithmic trading and fraud detection systems rely heavily on AI technologies. Transportation is being revolutionized by autonomous vehicles and smart traffic management systems. Even creative industries are embracing AI for content generation, music composition, and artistic design.

However, the rapid advancement of AI also raises important questions and concerns. Issues of privacy, job displacement, algorithmic bias, and the potential for AI systems to make decisions without human oversight are subjects of ongoing debate. The challenge lies in harnessing AI's potential benefits while addressing these ethical and practical concerns.

As we move forward, the integration of AI into society will likely continue to accelerate, making it essential for individuals, businesses, and governments to understand both its capabilities and limitations.`,
  wordCount: 320,
  readingLevel: "grade-12"
};

export const questions: ReadingQuestion[] = [
  {
    id: 20201,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "main-idea",
    text: "According to the passage, what has accelerated the practical applications of AI in recent years?",
    options: [
      "Government funding and support",
      "Computing power, data availability, and algorithmic sophistication",
      "Public demand and market pressure",
      "International cooperation and collaboration"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'recent advances in computing power, data availability, and algorithmic sophistication have accelerated its practical applications.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["technology", "AI", "computing"],
    tips: "Look for the specific factors mentioned in the passage that led to AI's acceleration.",
    topicId: 2
  },
  {
    id: 20202,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is machine learning according to the passage?",
    options: [
      "A type of computer hardware",
      "A subset of AI that allows computers to learn from experience",
      "A programming language for AI",
      "A method for building neural networks"
    ],
    correctAnswer: 1,
    explanation: "The passage defines machine learning as 'a subset of AI, allows computers to learn and improve from experience without being explicitly programmed for every task.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["technology", "machine-learning", "AI"],
    tips: "Find the direct definition of machine learning in the passage.",
    topicId: 2
  },
  {
    id: 20203,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "Which of the following sectors is NOT specifically mentioned as using AI applications?",
    options: [
      "Healthcare",
      "Finance",
      "Agriculture",
      "Transportation"
    ],
    correctAnswer: 2,
    explanation: "The passage mentions healthcare, finance, transportation, and creative industries as sectors using AI, but agriculture is not specifically mentioned.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["technology", "AI", "applications"],
    tips: "Check which sectors are explicitly mentioned in the passage.",
    topicId: 2
  },
  {
    id: 20204,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What concerns about AI does the passage mention?",
    options: [
      "High costs and technical complexity",
      "Privacy, job displacement, and algorithmic bias",
      "Limited computing power and data storage",
      "Lack of skilled professionals"
    ],
    correctAnswer: 1,
    explanation: "The passage specifically mentions 'Issues of privacy, job displacement, algorithmic bias, and the potential for AI systems to make decisions without human oversight.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["technology", "AI", "ethics"],
    tips: "Look for the section discussing concerns and challenges related to AI.",
    topicId: 2
  },
  {
    id: 20205,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the future of AI integration?",
    options: [
      "It will slow down due to technical limitations",
      "It will continue to accelerate",
      "It will remain limited to specific industries",
      "It will be replaced by newer technologies"
    ],
    correctAnswer: 1,
    explanation: "The passage concludes that 'the integration of AI into society will likely continue to accelerate.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["technology", "AI", "future"],
    tips: "Focus on the conclusion of the passage about AI's future.",
    topicId: 2
  },
  {
    id: 20206,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the context of the passage, what does 'sophisticated' mean when describing neural networks?",
    options: [
      "Simple and basic",
      "Advanced and complex",
      "Expensive and costly",
      "Old and outdated"
    ],
    correctAnswer: 1,
    explanation: "In this context, 'sophisticated' refers to advanced and complex neural networks that enable breakthrough capabilities.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "Consider how the word is used in relation to neural networks and their capabilities.",
    topicId: 2
  },
  {
    id: 20207,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "When did the development of AI begin according to the passage?",
    options: [
      "The 1940s",
      "The 1950s",
      "The 1960s",
      "The 1970s"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'The development of AI can be traced back to the 1950s.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["history", "AI"],
    tips: "Look for the specific decade mentioned in the passage.",
    topicId: 2
  },
  {
    id: 20208,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What breakthrough capabilities has deep learning enabled?",
    options: [
      "Hardware manufacturing and chip design",
      "Image recognition, natural language processing, and decision-making",
      "Database management and storage optimization",
      "Network security and encryption"
    ],
    correctAnswer: 1,
    explanation: "The passage states that deep learning 'has enabled breakthrough capabilities in image recognition, natural language processing, and decision-making.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["deep-learning", "capabilities"],
    tips: "Find the specific capabilities mentioned for deep learning.",
    topicId: 2
  },
  {
    id: 20209,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what is the main challenge regarding AI development?",
    options: [
      "Lack of funding for research",
      "Insufficient computing power",
      "Balancing benefits with ethical and practical concerns",
      "Training enough AI specialists"
    ],
    correctAnswer: 2,
    explanation: "The passage states 'The challenge lies in harnessing AI's potential benefits while addressing these ethical and practical concerns.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["challenges", "ethics"],
    tips: "Look for what the passage identifies as the main challenge.",
    topicId: 2
  },
  {
    id: 20210,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "What is the author's overall tone toward AI in this passage?",
    options: [
      "Completely negative and pessimistic",
      "Balanced, acknowledging both benefits and concerns",
      "Entirely optimistic and uncritical",
      "Neutral and indifferent"
    ],
    correctAnswer: 1,
    explanation: "The author presents both the transformative benefits of AI and the important concerns, showing a balanced perspective.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["author-intent", "tone"],
    tips: "Consider how the author presents both positive and negative aspects of AI.",
    topicId: 2
  },
  {
    id: 20211,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "According to the passage, AI is used in creative industries for:",
    options: [
      "Marketing and advertising only",
      "Content generation, music composition, and artistic design",
      "Financial planning and budgeting",
      "Quality control and testing"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions that 'creative industries are embracing AI for content generation, music composition, and artistic design.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["creative-industries", "applications"],
    tips: "Look for the specific creative applications mentioned.",
    topicId: 2
  },
  {
    id: 20212,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What can be inferred about the relationship between AI and science fiction?",
    options: [
      "AI remains purely fictional",
      "AI has moved from fiction to reality",
      "Science fiction accurately predicted all AI developments",
      "AI development has disappointed science fiction expectations"
    ],
    correctAnswer: 1,
    explanation: "The passage states that AI 'is no longer confined to science fiction but has become an integral part of our daily lives.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["inference", "science-fiction"],
    tips: "Consider what the passage says about AI's transition from fiction to reality.",
    topicId: 2
  },
  {
    id: 20213,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What does the passage say about algorithmic bias?",
    options: [
      "It has been completely solved",
      "It is not a real concern",
      "It is a subject of ongoing debate",
      "It only affects certain industries"
    ],
    correctAnswer: 2,
    explanation: "The passage mentions algorithmic bias as one of the 'subjects of ongoing debate.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["algorithmic-bias", "concerns"],
    tips: "Find what the passage says about current discussions regarding AI concerns.",
    topicId: 2
  },
  {
    id: 20214,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In this passage, 'integral' most nearly means:",
    options: [
      "Mathematical",
      "Optional",
      "Essential",
      "Expensive"
    ],
    correctAnswer: 2,
    explanation: "In the context 'integral part of our daily lives,' integral means essential or fundamental.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "Consider the meaning of 'integral part' in the context of daily life.",
    topicId: 2
  },
  {
    id: 20215,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what is necessary for society moving forward with AI?",
    options: [
      "More government regulation",
      "Slower development pace",
      "Understanding AI's capabilities and limitations",
      "Eliminating all AI concerns"
    ],
    correctAnswer: 2,
    explanation: "The passage concludes that it's 'essential for individuals, businesses, and governments to understand both its capabilities and limitations.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["inference", "society"],
    tips: "Look at the passage's conclusion about what's needed for the future.",
    topicId: 2
  },
  {
    id: 20216,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "According to the passage, what role does AI play in healthcare?",
    options: [
      "Replacing all doctors",
      "Medical diagnosis, drug discovery, and personalized treatment plans",
      "Hospital administration only",
      "Medical equipment manufacturing"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'In healthcare, AI assists in medical diagnosis, drug discovery, and personalized treatment plans.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["healthcare", "applications"],
    tips: "Find the specific healthcare applications mentioned in the passage.",
    topicId: 2
  },
  {
    id: 20217,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What can be inferred about the current state of AI development?",
    options: [
      "It has reached its peak",
      "It is progressing rapidly",
      "It is declining",
      "It has stagnated"
    ],
    correctAnswer: 1,
    explanation: "The passage refers to 'rapid advancement of AI' and suggests that integration will 'continue to accelerate.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["inference", "development"],
    tips: "Consider the language used to describe AI's current progress.",
    topicId: 2
  },
  {
    id: 20218,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What does the passage say about autonomous vehicles?",
    options: [
      "They are powered by recommendation systems",
      "They are enabled by sophisticated neural networks",
      "They are only used in finance",
      "They have replaced all human drivers"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions 'sophisticated neural networks that enable autonomous vehicles.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["autonomous-vehicles", "neural-networks"],
    tips: "Look for what enables autonomous vehicles according to the passage.",
    topicId: 2
  },
  {
    id: 20219,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "Why does the author mention that AI is 'no longer confined to science fiction'?",
    options: [
      "To criticize science fiction writers",
      "To emphasize AI's practical reality today",
      "To promote science fiction books",
      "To discuss entertainment industry applications"
    ],
    correctAnswer: 1,
    explanation: "The author uses this comparison to emphasize that AI has moved from theoretical/fictional concepts to practical, real-world applications.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["author-intent", "emphasis"],
    tips: "Consider why the author makes this comparison between science fiction and reality.",
    topicId: 2
  },
  {
    id: 20220,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "According to the passage, what characterizes deep learning?",
    options: [
      "It uses single-layer networks",
      "It uses neural networks with multiple layers",
      "It requires constant human programming",
      "It only works with image data"
    ],
    correctAnswer: 1,
    explanation: "The passage defines deep learning as that 'which uses neural networks with multiple layers.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["deep-learning", "neural-networks"],
    tips: "Find the specific description of deep learning in the passage.",
    topicId: 2
  },
  {
    id: 20221,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about job displacement due to AI?",
    options: [
      "It is not happening",
      "It is a concern being debated",
      "It only affects manual labor",
      "It has been completely resolved"
    ],
    correctAnswer: 1,
    explanation: "The passage lists job displacement among the 'subjects of ongoing debate' related to AI concerns.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["job-displacement", "concerns"],
    tips: "Look for how job displacement is characterized in the discussion of AI concerns.",
    topicId: 2
  },
  {
    id: 20222,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What does the passage say about AI in finance?",
    options: [
      "It's used for customer service only",
      "Algorithmic trading and fraud detection systems rely heavily on AI",
      "It's not applicable to financial services",
      "It's used only for accounting"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'In finance, algorithmic trading and fraud detection systems rely heavily on AI technologies.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["finance", "applications"],
    tips: "Find the specific financial applications mentioned in the passage.",
    topicId: 2
  },
  {
    id: 20223,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what is the relationship between data availability and AI development?",
    options: [
      "They are unrelated",
      "Data availability has helped accelerate AI applications",
      "Too much data has slowed AI development",
      "Data availability is decreasing"
    ],
    correctAnswer: 1,
    explanation: "The passage lists 'data availability' as one of the factors that 'have accelerated its practical applications.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["data", "development"],
    tips: "Consider data availability as one of the factors contributing to AI's advancement.",
    topicId: 2
  },
  {
    id: 20224,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the passage, 'oversight' most likely means:",
    options: [
      "Looking over something",
      "Supervision and monitoring",
      "Ignoring completely",
      "Making mistakes"
    ],
    correctAnswer: 1,
    explanation: "In the context of 'decisions without human oversight,' oversight refers to supervision and monitoring by humans.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "Consider what 'human oversight' would mean in the context of AI decision-making.",
    topicId: 2
  },
  {
    id: 20225,
    passageId: 102,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "What is the primary purpose of this passage?",
    options: [
      "To discourage AI development",
      "To provide a balanced overview of AI's impact and challenges",
      "To promote specific AI companies",
      "To teach AI programming"
    ],
    correctAnswer: 1,
    explanation: "The passage provides a comprehensive overview of AI's transformative impact, applications, and associated concerns, presenting a balanced perspective.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["author-intent", "purpose"],
    tips: "Consider the overall structure and content of the passage to determine its main purpose.",
    topicId: 2
  }
];

export const artificialIntelligenceStory = {
  metadata,
  passage,
  questions
};
