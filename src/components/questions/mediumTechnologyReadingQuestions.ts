import { Question } from '../../types/questionTypes';

// Reading passage - Technology
const technologyPassageText = `# The Evolution of Personal Computing

The personal computer has undergone a remarkable transformation since its inception in the 1970s. Early personal computers were bulky machines with limited processing power and rudimentary interfaces, accessible primarily to enthusiasts and specialists. The first commercially successful personal computer, the Apple II, introduced in 1977, featured just 4KB of RAM and relied on cassette tapes for data storage. Users needed to possess technical knowledge to operate these early machines, which offered limited functionality compared to today's standards.

The 1980s and 1990s witnessed significant advancements in computing technology that revolutionized how people interacted with computers. The introduction of graphical user interfaces, epitomized by Apple's Macintosh in 1984 and Microsoft Windows, made computers more intuitive and user-friendly. Simultaneously, hardware components became more sophisticated; processors became faster, storage capacity expanded dramatically, and memory increased exponentially. The Internet's emergence in the 1990s further transformed personal computing, connecting millions of computers worldwide and laying the groundwork for the digital ecosystem we now take for granted.

Today's personal computing landscape bears little resemblance to its origins, having evolved beyond traditional desktop and laptop formats. Smartphones and tablets have democratized computing, placing powerful processors in billions of pockets worldwide. Cloud computing has shifted data storage and processing away from physical devices to remote servers, enabling unprecedented accessibility and collaboration. Artificial intelligence integration has made computers more responsive and predictive, while virtual and augmented reality technologies are blurring the boundaries between digital and physical worlds. These innovations have collectively transformed computers from specialized tools into ubiquitous companions that mediate numerous aspects of modern life.

The trajectory of personal computing reflects humanity's relationship with technology—a journey from complex, specialized machines to intuitive, integrated systems that augment human capabilities. As computing technology continues to evolve, the distinction between technology and everyday experience will likely become increasingly indistinguishable, raising important questions about digital dependency, privacy, and the nature of human-computer interaction.`;

// Questions based on the passage
export const technologyReadingQuestions: Question[] = [
  {
    id: 1,
    type: "reading-comprehension",
    text: "According to the passage, what was a key characteristic of early personal computers?",
    options: [
      "They were affordable for most households",
      "They required technical knowledge to operate",
      "They featured touchscreen interfaces",
      "They had built-in internet connectivity"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that early personal computers were 'accessible primarily to enthusiasts and specialists' and that 'Users needed to possess technical knowledge to operate these early machines,' clearly indicating that technical expertise was required for operation.",
    topicId: 1,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 1,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: technologyPassageText,
    passageTitle: "Technology Reading"
  },
  {
    id: 2,
    type: "reading-comprehension",
    text: "What development in the 1980s and 1990s made computers more intuitive for users?",
    options: [
      "Increased RAM capacity",
      "The introduction of graphical user interfaces",
      "The invention of the mouse",
      "Wireless networking capabilities"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage specifically mentions that 'The introduction of graphical user interfaces, epitomized by Apple's Macintosh in 1984 and Microsoft Windows, made computers more intuitive and user-friendly' during the 1980s and 1990s.",
    topicId: 1,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 2,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 3,
    type: "reading-comprehension",
    text: "How has cloud computing changed personal computing according to the passage?",
    options: [
      "It has made computers physically smaller",
      "It has eliminated the need for operating systems",
      "It has shifted data storage and processing to remote servers",
      "It has reduced the overall cost of computing devices"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'Cloud computing has shifted data storage and processing away from physical devices to remote servers, enabling unprecedented accessibility and collaboration.' This represents a fundamental change in how computing resources are managed and accessed.",
    topicId: 1,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 3,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 4,
    type: "reading-comprehension",
    text: "What does the author suggest about the future relationship between humans and computing technology?",
    options: [
      "It will become increasingly problematic",
      "The distinction between technology and everyday experience will blur",
      "People will likely reduce their dependence on computers",
      "Specialized technical knowledge will become more important"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "In the final paragraph, the author states that 'the distinction between technology and everyday experience will likely become increasingly indistinguishable,' suggesting a future where computing technology becomes even more seamlessly integrated into daily life.",
    topicId: 1,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 4,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 5,
    type: "reading-comprehension",
    text: "What characteristic of the Apple II is mentioned in the passage?",
    options: [
      "Its revolutionary touchscreen display",
      "Its compact, portable design",
      "Its 4KB of RAM",
      "Its built-in spreadsheet software"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage specifically mentions that 'The first commercially successful personal computer, the Apple II, introduced in 1977, featured just 4KB of RAM and relied on cassette tapes for data storage.' This highlights the limited memory capacity of early personal computers compared to modern standards.",
    topicId: 1,
    tags: [
      "medium-level",
      "detail",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 5,
      questionType: "detail",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 6,
    type: "reading-comprehension",
    text: "What is the primary theme of this passage?",
    options: [
      "The technical specifications of early computers",
      "How Apple dominated the personal computing market",
      "The transformation of personal computing from specialized tools to everyday technology",
      "Why cloud computing is superior to traditional computing methods"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage traces the evolution of personal computers from 'bulky machines with limited processing power' that required technical knowledge to operate, to 'ubiquitous companions that mediate numerous aspects of modern life.' The final paragraph specifically states that this trajectory 'reflects humanity's relationship with technology—a journey from complex, specialized machines to intuitive, integrated systems that augment human capabilities.'",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 6,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 7,
    type: "reading-comprehension",
    text: "According to the passage, what was a significant development in the 1980s and 1990s that made computers more accessible?",
    options: [
      "The invention of social media platforms",
      "The introduction of graphical user interfaces",
      "The reduction in computer size and weight",
      "The development of the first smartphone"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The second paragraph specifically mentions that 'The introduction of graphical user interfaces, epitomized by Apple's Macintosh in 1984 and Microsoft Windows, made computers more intuitive and user-friendly.' This development is highlighted as a key factor that 'revolutionized how people interacted with computers.'",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 7,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 8,
    type: "reading-comprehension",
    text: "Which of the following best characterizes early personal computers based on the passage?",
    options: [
      "Affordable and widely available to the general public",
      "Compact devices with intuitive interfaces",
      "Bulky machines requiring technical knowledge to operate",
      "Primarily designed for entertainment purposes"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The first paragraph describes early personal computers as 'bulky machines with limited processing power and rudimentary interfaces, accessible primarily to enthusiasts and specialists.' It also notes that 'Users needed to possess technical knowledge to operate these early machines.'",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 8,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 9,
    type: "reading-comprehension",
    text: "What conclusion does the author draw about the future of personal computing?",
    options: [
      "Personal computers will eventually be replaced by artificial intelligence",
      "The distinction between technology and everyday experience will likely become increasingly indistinguishable",
      "Traditional desktop computers will regain popularity over mobile devices",
      "Cloud computing will become obsolete as local storage technology improves"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "In the final paragraph, the author concludes that 'As computing technology continues to evolve, the distinction between technology and everyday experience will likely become increasingly indistinguishable,' suggesting a future where technology becomes even more seamlessly integrated into daily life.",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 9,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 10,
    type: "reading-comprehension",
    text: "What impact has cloud computing had on personal computing according to the passage?",
    options: [
      "It has made computers more expensive and less accessible",
      "It has eliminated the need for personal computing devices",
      "It has shifted data storage and processing away from physical devices",
      "It has primarily benefited business users rather than individual consumers"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The third paragraph states that 'Cloud computing has shifted data storage and processing away from physical devices to remote servers, enabling unprecedented accessibility and collaboration.' This indicates a fundamental change in how computing resources are distributed and accessed.",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 10,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 11,
    type: "reading-comprehension",
    text: "What is the main theme explored throughout the passage?",
    options: [
      "The technical specifications of early computers",
      "The transformation of personal computers from specialized tools to ubiquitous companions",
      "The competition between Apple and Microsoft in computer development",
      "The negative impacts of increased digital dependency"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage traces the evolution of personal computing from the 1970s to the present day, consistently emphasizing how computers have transformed from 'bulky machines with limited processing power' that required technical knowledge to operate into 'ubiquitous companions that mediate numerous aspects of modern life.' The final paragraph explicitly states that the trajectory reflects 'a journey from complex, specialized machines to intuitive, integrated systems.'",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 11,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 12,
    type: "reading-comprehension",
    text: "According to the passage, what was a significant development in the 1980s and 1990s that made computers more accessible?",
    options: [
      "The introduction of smartphones and tablets",
      "The development of cloud computing systems",
      "The introduction of graphical user interfaces",
      "The creation of the Apple II computer"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage specifically states in the second paragraph that 'The introduction of graphical user interfaces, epitomized by Apple's Macintosh in 1984 and Microsoft Windows, made computers more intuitive and user-friendly.' This development is identified as a key advancement during the 1980s and 1990s that revolutionized human-computer interaction.",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 12,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 13,
    type: "reading-comprehension",
    text: "What conclusion does the author draw about the future relationship between humans and computing technology?",
    options: [
      "Technology will eventually replace human capabilities entirely",
      "The distinction between technology and everyday experience will become increasingly indistinguishable",
      "People will reject digital technology due to privacy concerns",
      "Personal computing will return to more specialized applications"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "In the final paragraph, the author explicitly states that 'As computing technology continues to evolve, the distinction between technology and everyday experience will likely become increasingly indistinguishable.' This represents the author's conclusion about the future trajectory of human-computer relationships, while also noting this raises questions about 'digital dependency, privacy, and the nature of human-computer interaction.'",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 13,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 14,
    type: "reading-comprehension",
    text: "How does the passage characterize today's personal computing landscape compared to its origins?",
    options: [
      "Slightly improved but fundamentally similar",
      "More complex and difficult to use",
      "Bearing little resemblance to its origins",
      "Focused primarily on desktop computing"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The third paragraph explicitly states that 'Today's personal computing landscape bears little resemblance to its origins, having evolved beyond traditional desktop and laptop formats.' The passage then describes numerous transformative developments including smartphones, cloud computing, AI integration, and virtual/augmented reality that distinguish modern computing from its early days.",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 14,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 15,
    type: "reading-comprehension",
    text: "Which of the following best describes how the first personal computers differed from modern computing devices?",
    options: [
      "They were more expensive but more powerful",
      "They required technical knowledge to operate and had limited functionality",
      "They were primarily used for business rather than personal applications",
      "They were more secure and protected user privacy better"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The first paragraph describes early personal computers as 'bulky machines with limited processing power and rudimentary interfaces' and notes that 'Users needed to possess technical knowledge to operate these early machines, which offered limited functionality compared to today's standards.' This directly contrasts with the description of modern computers as 'intuitive, integrated systems' in the final paragraph.",
    topicId: 1,
    tags: [
      "medium-level",
      "main-idea",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 15,
      questionType: "main-idea",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 16,
    type: "reading-comprehension",
    text: "Based on the passage, what can be inferred about the relationship between technological advancement and user expertise in computing?",
    options: [
      "As technology advanced, the need for technical expertise increased proportionally",
      "Technological advancement has made computing more accessible to non-specialists",
      "User interfaces became more complex as computing power increased",
      "The need for technical knowledge has remained constant despite technological changes"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage describes how early computers required users to 'possess technical knowledge,' while later developments like graphical user interfaces 'made computers more intuitive and user-friendly.' This progression culminates in today's technology that has 'democratized computing' and created 'intuitive, integrated systems,' allowing us to infer that technological advancement has reduced the expertise barrier.",
    topicId: 1,
    tags: [
      "medium-level",
      "inference",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 16,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 17,
    type: "reading-comprehension",
    text: "What can be inferred about the author's perspective on the future relationship between humans and computing technology?",
    options: [
      "The author is primarily concerned about privacy implications",
      "The author believes technology will become increasingly separate from daily life",
      "The author anticipates further integration of technology into human experience",
      "The author suggests computing evolution has reached its pinnacle"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "In the final paragraph, the author states that 'the distinction between technology and everyday experience will likely become increasingly indistinguishable,' indicating an expectation of further integration between computing technology and human experience. This is reinforced by describing the evolution toward 'intuitive, integrated systems that augment human capabilities.'",
    topicId: 1,
    tags: [
      "medium-level",
      "inference",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 17,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 18,
    type: "reading-comprehension",
    text: "What inference can be made about the primary driver of changes in personal computing over time?",
    options: [
      "Government regulation and oversight",
      "Academic research initiatives",
      "User demand for greater accessibility and functionality",
      "Competition between major technology companies"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "While not explicitly stated, the passage shows a consistent pattern of evolution toward systems that are more user-friendly, accessible, and integrated into daily life. The progression from 'bulky machines with limited processing power' requiring technical expertise to 'intuitive, integrated systems' and 'ubiquitous companions' suggests that meeting user needs for greater accessibility and functionality has been the primary driver of change.",
    topicId: 1,
    tags: [
      "medium-level",
      "inference",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 18,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 19,
    type: "reading-comprehension",
    text: "Based on the trajectory described in the passage, what can be inferred about the most significant shift in personal computing?",
    options: [
      "From stationary to portable devices",
      "From individual to networked computing",
      "From visible hardware to invisible services",
      "From complex to simplified user interfaces"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage describes an evolution from physical, hardware-centric computing (with explicit mentions of RAM, storage tapes, and processors) toward more abstract computing paradigms like cloud computing that has 'shifted data storage and processing away from physical devices.' The final paragraph reinforces this by noting the trend toward technology becoming 'indistinguishable' from everyday experience, suggesting the most significant shift has been from tangible hardware to invisible, integrated services.",
    topicId: 1,
    tags: [
      "medium-level",
      "inference",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 19,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 20,
    type: "reading-comprehension",
    text: "What can be inferred about the societal implications of personal computing evolution?",
    options: [
      "Society has become more resistant to technological change over time",
      "The evolution has primarily benefited technical specialists",
      "Computing evolution has raised new ethical and social questions",
      "Personal computing has had minimal impact on social structures"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The final paragraph explicitly states that the evolution of computing is 'raising important questions about digital dependency, privacy, and the nature of human-computer interaction.' This indicates that as personal computing has evolved and become more integrated into daily life, it has generated new ethical and social considerations that weren't present in earlier computing eras.",
    topicId: 1,
    tags: [
      "medium-level",
      "inference",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 20,
      questionType: "inference",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 21,
    type: "reading-comprehension",
    text: "In the context of the passage, the word 'epitomized' most closely means:",
    options: [
      "Criticized",
      "Represented perfectly",
      "Complicated",
      "Simplified"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states 'graphical user interfaces, epitomized by Apple's Macintosh in 1984 and Microsoft Windows,' indicating that these products were perfect representations or exemplary cases of graphical user interfaces. 'Epitomized' means to be a perfect example or embodiment of something.",
    topicId: 1,
    tags: [
      "medium-level",
      "vocabulary",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 21,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 22,
    type: "reading-comprehension",
    text: "The word 'ubiquitous' as used in the final paragraph most nearly means:",
    options: [
      "Expensive",
      "Omnipresent",
      "Complicated",
      "Beneficial"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage describes computers as 'ubiquitous companions that mediate numerous aspects of modern life.' In this context, 'ubiquitous' means being present everywhere simultaneously or omnipresent, reflecting how computers have become integrated into virtually all aspects of daily life.",
    topicId: 1,
    tags: [
      "medium-level",
      "vocabulary",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 22,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 23,
    type: "reading-comprehension",
    text: "The term 'democratized' as used in the third paragraph suggests that smartphones and tablets have:",
    options: [
      "Made computing politically neutral",
      "Elected new technology leaders",
      "Made computing widely accessible to ordinary people",
      "Created voting systems on devices"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that 'Smartphones and tablets have democratized computing, placing powerful processors in billions of pockets worldwide.' Here, 'democratized' means making something that was once exclusive or restricted available to ordinary people or the masses, indicating increased accessibility.",
    topicId: 1,
    tags: [
      "medium-level",
      "vocabulary",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 23,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 24,
    type: "reading-comprehension",
    text: "The word 'augment' in the final paragraph most closely means to:",
    options: [
      "Replace entirely",
      "Make more beautiful",
      "Increase or enhance",
      "Artificially create"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage refers to 'intuitive, integrated systems that augment human capabilities.' In this context, 'augment' means to increase, enhance, or make greater the existing human capabilities, not to replace them entirely or simply make them more attractive.",
    topicId: 1,
    tags: [
      "medium-level",
      "vocabulary",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 24,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  },
  {
    id: 25,
    type: "reading-comprehension",
    text: "The phrase 'digital dependency' in the final paragraph most likely refers to:",
    options: [
      "Software requiring regular updates",
      "Reliance on technology for daily functioning",
      "Companies dependent on digital sales",
      "Computer programming hierarchies"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage mentions 'digital dependency' among important questions raised as 'the distinction between technology and everyday experience will likely become increasingly indistinguishable.' This suggests concern about society's increasing reliance on or addiction to digital technology for everyday functioning, not merely software updates or business models.",
    topicId: 1,
    tags: [
      "medium-level",
      "vocabulary",
      "technology"
    ],
    metadata: {
      topic: "Technology",
      questionNumber: 25,
      questionType: "vocabulary",
      totalQuestions: 25,
      wordCount: 350,
      estimatedTime: 3,
      aiInstruction: "Moderate vocabulary, some inference required, clear logical reasoning."
    },
    passageText: "technologyPassageText",
    passageTitle: "Technology Reading"
  }
];