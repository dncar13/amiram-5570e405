import { Question } from '../../types/questionTypes';

// Reading passage - Environment
const environmentPassageText = `# The Quiet Revolution in Environmental Protection

The concept of "ecosystem services" has revolutionized how we understand the relationship between human prosperity and environmental health. Ecosystem services refer to the countless benefits that healthy, functioning ecosystems provide to humans—clean water, fertile soil, climate regulation, and even cultural inspiration. While these services have traditionally been taken for granted, their economic value is increasingly recognized as essential to sustainable development.

One remarkable example of this paradigm shift is Costa Rica's pioneering Payment for Ecosystem Services (PES) program, established in 1997. Before this initiative, Costa Rica had one of the highest deforestation rates globally, losing approximately 50% of its forest cover. The PES program fundamentally altered this trajectory by compensating landowners for preserving forests rather than converting them to farmland. Landowners receive payments for carbon sequestration, biodiversity protection, watershed maintenance, and landscape beauty preservation. This market-based approach has helped Costa Rica become the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today.

The success of ecosystem service models extends beyond forestry. In New York City, officials faced a choice: build expensive water filtration plants costing $8-10 billion or restore the Catskill watershed that naturally purifies the city's water supply. By investing $1.5 billion in watershed protection—purchasing land buffers, compensating farmers for sustainable practices, and upgrading sewage treatment—the city saved billions while preserving vital natural systems. This approach demonstrates how integrating ecosystem values into decision-making can yield both environmental and economic benefits.

Despite these successes, challenges remain in quantifying the precise value of ecosystem services and creating equitable compensation systems. Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit. Nevertheless, the ecosystem services framework continues to gain traction as communities worldwide recognize that economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development.`;

// Questions based on the passage
export const environmentReadingQuestions: Question[] = [
  {
    id: 26,
    type: "reading-comprehension",
    text: "What was the main outcome of Costa Rica's Payment for Ecosystem Services program?",
    options: [
      "It increased the country's GDP by 50%",
      "It reversed deforestation, increasing forest cover from 26% to over 52%",
      "It eliminated the need for traditional farming practices",
      "It established Costa Rica as the leading producer of sustainable timber"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'This market-based approach has helped Costa Rica become the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today.' This clearly indicates that the primary outcome was reversing deforestation and significantly increasing forest cover.",
    topicId: 7,
    tags: [
      "medium-level",
      "detail",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 1,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: environmentPassageText,
    passageTitle: "Environment Reading"
  },
  {
    id: 27,
    type: "reading-comprehension",
    text: "What alternative did New York City choose instead of building expensive water filtration plants?",
    options: [
      "Importing water from neighboring states",
      "Implementing strict water rationing programs",
      "Restoring the Catskill watershed that naturally purifies water",
      "Developing new chemical treatment technologies"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "According to the passage, New York City officials faced a choice between building expensive filtration plants or restoring the Catskill watershed. They chose the latter option, as stated: 'By investing $1.5 billion in watershed protection... the city saved billions while preserving vital natural systems.'",
    topicId: 7,
    tags: [
      "medium-level",
      "detail",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 2,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 28,
    type: "reading-comprehension",
    text: "What criticism is mentioned regarding the ecosystem services framework?",
    options: [
      "It doesn't work effectively in developing countries",
      "It places monetary values on nature, potentially commodifying essential natural processes",
      "It requires too much government oversight to implement successfully",
      "It benefits wealthy landowners disproportionately"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.' This represents the main criticism mentioned of the ecosystem services approach.",
    topicId: 7,
    tags: [
      "medium-level",
      "detail",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 3,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 29,
    type: "reading-comprehension",
    text: "What does the Costa Rica example demonstrate about ecosystem services?",
    options: [
      "That market-based approaches can effectively address environmental challenges",
      "That government regulation is more effective than economic incentives",
      "That ecosystem services are more valuable in tropical countries",
      "That deforestation is inevitable in developing economies"
    ],
    correctAnswer: 0,
    difficulty: "medium",
    explanation: "Costa Rica's PES program is described as a 'market-based approach' that successfully reversed deforestation. This example demonstrates that creating economic incentives (compensating landowners) can be an effective way to protect ecosystem services, showing how market mechanisms can be harnessed for environmental protection.",
    topicId: 7,
    tags: [
      "medium-level",
      "detail",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 4,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 30,
    type: "reading-comprehension",
    text: "According to the passage, what is the relationship between economic prosperity and environmental protection?",
    options: [
      "They are inherently opposed goals that require difficult tradeoffs",
      "They are unrelated aspects of development that should be addressed separately",
      "They can be mutually reinforcing priorities for sustainable development",
      "Environmental protection must always take precedence over economic considerations"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The final paragraph of the passage concludes that 'economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development.' This reflects the central message of the passage about the integration of ecosystem values into economic decision-making.",
    topicId: 7,
    tags: [
      "medium-level",
      "detail",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 5,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 31,
    type: "reading-comprehension",
    text: "What is the central concept that has transformed our understanding of environmental protection according to the passage?",
    options: [
      "Payment for Ecosystem Services programs",
      "Reforestation initiatives",
      "Ecosystem services",
      "Sustainable development goals"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage opens by stating that 'The concept of \"ecosystem services\" has revolutionized how we understand the relationship between human prosperity and environmental health,' establishing this as the central transformative concept discussed throughout the text.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 6,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 32,
    type: "reading-comprehension",
    text: "What was the primary achievement of Costa Rica's PES program?",
    options: [
      "It created a new economic model for developing countries",
      "It reversed the country's deforestation trend",
      "It established the first national park system in Central America",
      "It eliminated the need for traditional agriculture"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that Costa Rica's PES program 'helped Costa Rica become the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today,' clearly identifying reversal of deforestation as the program's primary achievement.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 7,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 33,
    type: "reading-comprehension",
    text: "How did New York City demonstrate the economic value of ecosystem services?",
    options: [
      "By building state-of-the-art water filtration plants",
      "By privatizing water resources",
      "By investing in watershed protection instead of expensive filtration plants",
      "By implementing strict water usage regulations"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage explains that New York City saved billions of dollars by investing $1.5 billion in watershed protection rather than spending $8-10 billion on water filtration plants, demonstrating how integrating ecosystem values into decision-making yielded both environmental and economic benefits.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 8,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 34,
    type: "reading-comprehension",
    text: "What major criticism of the ecosystem services framework is mentioned in the passage?",
    options: [
      "It is too expensive to implement in developing countries",
      "It places monetary values on nature, potentially commodifying essential processes",
      "It has shown limited success in reversing environmental degradation",
      "It requires too much government oversight and regulation"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage notes that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit,' identifying this as a key criticism of the ecosystem services approach.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 9,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 35,
    type: "reading-comprehension",
    text: "According to the passage, what relationship between economic prosperity and environmental protection is suggested by the ecosystem services framework?",
    options: [
      "They are fundamentally incompatible goals",
      "They should be evaluated separately",
      "They must be balanced through compromise",
      "They can be mutually reinforcing priorities"
    ],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "The passage concludes by stating that 'economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development,' directly addressing the relationship suggested by the ecosystem services framework.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 10,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 36,
    type: "reading-comprehension",
    text: "What is the central theme of this passage?",
    options: [
      "Environmental conservation requires government regulation",
      "Ecosystem services have economic value that can align conservation with development",
      "Costa Rica's reforestation efforts are superior to all other environmental programs",
      "Putting monetary values on nature is fundamentally unethical"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage centers on how recognizing the economic value of ecosystem services has transformed environmental protection approaches. This is evident in the first paragraph's introduction to ecosystem services as benefits that connect 'human prosperity and environmental health,' and reinforced by examples showing how this understanding leads to successful conservation efforts while providing economic benefits.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 11,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 37,
    type: "reading-comprehension",
    text: "According to the passage, what was the primary achievement of Costa Rica's Payment for Ecosystem Services program?",
    options: [
      "It eliminated all agricultural activity in the country",
      "It made Costa Rica the wealthiest nation in Central America",
      "It reversed deforestation by incentivizing forest preservation",
      "It proved that government programs are more effective than private conservation"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that Costa Rica's PES program 'fundamentally altered this trajectory by compensating landowners for preserving forests rather than converting them to farmland' and specifically notes that Costa Rica became 'the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today.'",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 12,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 38,
    type: "reading-comprehension",
    text: "In the New York City watershed example, why did officials choose to restore the Catskill watershed?",
    options: [
      "It was mandated by federal environmental regulations",
      "It was significantly less expensive than building filtration plants",
      "Local residents demanded natural rather than technological solutions",
      "The mayor had personal connections to the Catskill region"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage explains that New York City officials faced a choice between building water filtration plants costing '$8-10 billion or restore the Catskill watershed.' They chose the watershed restoration approach by 'investing $1.5 billion in watershed protection,' which allowed the city to save 'billions while preserving vital natural systems.'",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 13,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 39,
    type: "reading-comprehension",
    text: "What criticism of the ecosystem services framework is mentioned in the passage?",
    options: [
      "It fails to address climate change adequately",
      "It benefits wealthy landowners while disadvantaging poor communities",
      "It places monetary values on nature, potentially commodifying essential processes",
      "It requires too much scientific expertise to implement effectively"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.' This represents the primary criticism mentioned of the ecosystem services approach.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 14,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 40,
    type: "reading-comprehension",
    text: "Based on the passage, what conclusion can be drawn about the relationship between economic prosperity and environmental protection?",
    options: [
      "They are inherently contradictory goals",
      "They can be mutually reinforcing priorities",
      "Economic prosperity must always take precedence",
      "Environmental protection is only possible in wealthy nations"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage concludes that 'economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development.' This represents the core insight of the ecosystem services framework, which reframes environmental protection as economically beneficial rather than oppositional to development.",
    topicId: 7,
    tags: [
      "medium-level",
      "main-idea",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 15,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 41,
    type: "reading-comprehension",
    text: "Based on the passage, what can be inferred about the relationship between economic development and environmental protection?",
    options: [
      "They are inherently contradictory goals",
      "They can be mutually reinforcing priorities",
      "Economic development must always be prioritized over environmental concerns",
      "Environmental protection inevitably leads to economic decline"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage concludes that 'economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development.' Both the Costa Rica and New York City examples demonstrate how environmental protection initiatives yielded economic benefits, supporting this inference.",
    topicId: 7,
    tags: [
      "medium-level",
      "inference",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 16,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 42,
    type: "reading-comprehension",
    text: "What does the New York City watershed example primarily illustrate?",
    options: [
      "The superiority of natural systems over technological solutions",
      "The high cost of environmental restoration projects",
      "How integrating ecosystem values into decision-making can be economically beneficial",
      "That urban areas cannot sustain their water needs without rural resources"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that the New York City watershed approach 'demonstrates how integrating ecosystem values into decision-making can yield both environmental and economic benefits.' By investing $1.5 billion in watershed protection rather than $8-10 billion in filtration plants, the city achieved both environmental protection and significant cost savings.",
    topicId: 7,
    tags: [
      "medium-level",
      "inference",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 17,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 43,
    type: "reading-comprehension",
    text: "What can be inferred about the main criticism of the ecosystem services framework?",
    options: [
      "It is too expensive to implement effectively",
      "It fails to address climate change concerns",
      "It may reduce nature to merely its economic utility",
      "It unfairly benefits wealthy landowners over poorer ones"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage notes that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.' This suggests the concern is that the ecosystem services approach might reduce nature to just its economic value, overlooking intrinsic worth that deserves protection regardless of financial considerations.",
    topicId: 7,
    tags: [
      "medium-level",
      "inference",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 18,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 44,
    type: "reading-comprehension",
    text: "Based on Costa Rica's experience, what can be inferred about effective environmental policy approaches?",
    options: [
      "Traditional conservation laws are more effective than market-based approaches",
      "Economic incentives can dramatically alter environmental outcomes",
      "Environmental regulations must be internationally enforced to be effective",
      "Conservation is only possible in countries with strong economies"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "Costa Rica's dramatic reversal of deforestation through its PES program demonstrates that 'economic incentives can dramatically alter environmental outcomes.' The passage shows how compensating landowners transformed the country from having one of the highest deforestation rates to becoming 'the only tropical country to reverse deforestation,' suggesting the power of market-based incentives in environmental policy.",
    topicId: 7,
    tags: [
      "medium-level",
      "inference",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 19,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 45,
    type: "reading-comprehension",
    text: "What challenge facing the ecosystem services model is implied but not directly stated in the passage?",
    options: [
      "The difficulty of implementing such programs in developing countries",
      "The potential for corruption in payment distribution systems",
      "The need for international cooperation on transboundary ecosystems",
      "The challenge of sustaining funding for long-term ecosystem service programs"
    ],
    correctAnswer: 3,
    difficulty: "medium",
    explanation: "While not explicitly stated, the passage implies the challenge of long-term funding sustainability. Both the Costa Rica and New York examples involve ongoing payments or investments. The passage mentions 'challenges remain in quantifying the precise value of ecosystem services and creating equitable compensation systems,' which suggests that maintaining consistent, adequate funding over time would be a significant challenge for these programs.",
    topicId: 7,
    tags: [
      "medium-level",
      "inference",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 20,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 46,
    type: "reading-comprehension",
    text: "As used in the passage, the term 'paradigm shift' most closely refers to:",
    options: [
      "A significant economic investment in environmental protection",
      "A fundamental change in approach or understanding",
      "A political movement focused on conservation policies",
      "A scientific discovery about forest ecosystems"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "In the second paragraph, the passage refers to Costa Rica's PES program as 'this paradigm shift,' describing how the program fundamentally altered the trajectory of deforestation by compensating landowners for preservation rather than conversion of forests. This represents a complete change in understanding the relationship between economics and environmental protection, shifting from viewing them as competing interests to seeing them as potentially complementary.",
    topicId: 7,
    tags: [
      "medium-level",
      "vocabulary",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 21,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 47,
    type: "reading-comprehension",
    text: "The primary purpose of including the New York City water example in the passage is to:",
    options: [
      "Contrast urban and rural approaches to ecosystem services",
      "Illustrate how ecosystem service models can be financially beneficial",
      "Criticize the high costs of traditional infrastructure projects",
      "Demonstrate the superiority of natural systems over human engineering"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The New York City example is included to show how the ecosystem services approach yielded both environmental and economic benefits. The passage explicitly states that by investing $1.5 billion in watershed protection rather than $8-10 billion in filtration plants, the city 'saved billions while preserving vital natural systems,' demonstrating how 'integrating ecosystem values into decision-making can yield both environmental and economic benefits.'",
    topicId: 7,
    tags: [
      "medium-level",
      "vocabulary",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 22,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 48,
    type: "reading-comprehension",
    text: "The passage suggests that critics of the ecosystem services framework are primarily concerned that:",
    options: [
      "It doesn't adequately address climate change",
      "It gives too much power to private landowners",
      "It assigns monetary values to processes that should be inherently protected",
      "It creates excessive bureaucracy in environmental management"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.' This indicates their primary concern is about reducing nature to monetary terms rather than protecting it for its intrinsic value.",
    topicId: 7,
    tags: [
      "medium-level",
      "vocabulary",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 23,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 49,
    type: "reading-comprehension",
    text: "Based on the passage, which statement best reflects the relationship between Costa Rica's PES program and deforestation rates?",
    options: [
      "The program immediately halted all deforestation activities",
      "The program has been only marginally successful in slowing forest loss",
      "The program helped reverse deforestation, doubling forest cover since the 1980s",
      "The program created incentives for reforestation but did not address existing deforestation"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that Costa Rica's PES program helped the country 'become the only tropical country to reverse deforestation, with forest cover increasing from 26% in the 1980s to over 52% today.' This information directly supports the statement that the program helped reverse deforestation and roughly doubled forest cover since the 1980s.",
    topicId: 7,
    tags: [
      "medium-level",
      "vocabulary",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 24,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  },
  {
    id: 50,
    type: "reading-comprehension",
    text: "The main conclusion of the passage suggests that ecosystem services frameworks are:",
    options: [
      "Replacing traditional conservation approaches entirely",
      "Struggling to gain acceptance in economic policies",
      "Demonstrating that economic and environmental goals can be compatible",
      "Primarily beneficial in tropical regions with high biodiversity"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The concluding paragraph states that 'the ecosystem services framework continues to gain traction as communities worldwide recognize that economic prosperity and environmental protection need not be competing goals but can be mutually reinforcing priorities for sustainable development.' This directly supports the idea that these frameworks demonstrate compatibility between economic and environmental goals.",
    topicId: 7,
    tags: [
      "medium-level",
      "vocabulary",
      "environment"
    ],
    metadata: {
      topic: "Environment",
      questionNumber: 25,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "environmentPassageText",
    passageTitle: "Environment Reading"
  }
];
