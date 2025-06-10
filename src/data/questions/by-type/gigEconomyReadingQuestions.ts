import { Question } from '../../types/questionTypes';

// Reading passage - The Gig Economy
const gigEconomyPassageText = `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the "gig economy" has fundamentally altered how millions of people work and earn their living.

The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.

For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.

However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear as they have no job security or guaranteed minimum wage.

The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of "working poor" - people who are employed but still live in poverty.

Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.

The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.`;

// Questions based on the passage
export const gigEconomyReadingQuestions: Question[] = [
  {
    id: 1,
    type: 'reading-comprehension',
    text: "The first paragraph suggests that the traditional employment model has _____ in recent decades",
    options: [
      "remained completely unchanged",
      "become more popular than ever",
      "undergone significant changes",
      "been completely eliminated"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text states that the traditional model 'has undergone a dramatic transformation in recent decades.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3, // Reading comprehension
    tags: ["employment-change", "transformation"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 2,
    type: 'reading-comprehension',
    text: "Which of the following platforms is mentioned in the text as an example of the gig economy?",
    options: [
      "Facebook",
      "Amazon",
      "TaskRabbit",
      "Google"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text explicitly mentions 'digital platforms such as Uber, Lyft, TaskRabbit, and Upwork.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["platforms", "examples"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 3,
    type: 'reading-comprehension',
    text: "According to the text, which of the following benefits does the gig economy offer to workers?",
    options: [
      "Guaranteed health insurance",
      "Fixed and stable salary",
      "Flexibility in scheduling",
      "Complete job security"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The passage states that 'the gig economy offers unprecedented flexibility and autonomy' and workers 'can choose their own schedules.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["benefits", "flexibility"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 4,
    type: 'reading-comprehension',
    text: "What significant cost does the text mention comes with gig economy flexibility?",
    options: [
      "Higher taxes for workers",
      "Lack of traditional employee benefits",
      "Mandatory overtime work",
      "Reduced earning potential"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The text clearly states that 'Gig workers typically lack the benefits and protections that traditional employees enjoy.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["disadvantages", "trade-offs"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 5,
    type: 'reading-comprehension',
    text: "According to the text, what financial burden do gig workers bear?",
    options: [
      "Company office rent",
      "Employee training costs",
      "Equipment and vehicle maintenance",
      "Marketing expenses for employers"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The passage mentions that gig workers 'bear the financial burden of their own equipment, vehicle maintenance, and business expenses.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["financial-burden", "expenses"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 6,
    type: 'reading-comprehension',
    text: "What does the text suggest has happened to income inequality as more people become gig workers?",
    options: [
      "It has decreased significantly",
      "It has remained the same",
      "It has widened",
      "It has been completely eliminated"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text explicitly states: 'As more people become gig workers, income inequality has widened.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["social-impact", "inequality"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 7,
    type: 'reading-comprehension',
    text: "According to the passage, what term describes people who are employed but still live in poverty?",
    options: [
      "Underemployed workers",
      "Working poor",
      "Part-time employees",
      "Temporary workers"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The text introduces the term 'working poor' - people who are employed but still live in poverty.",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["vocabulary", "social-class"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 8,
    type: 'reading-comprehension',
    text: "How are some governments responding to the gig economy according to the text?",
    options: [
      "By banning all digital platforms",
      "By classifying certain gig workers as employees",
      "By reducing labor protections",
      "By eliminating independent contracting"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The passage states that 'Some countries have begun classifying certain gig workers as employees rather than independent contractors.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["government-response", "regulation"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 9,
    type: 'reading-comprehension',
    text: "What type of benefits are some governments exploring for gig workers?",
    options: [
      "Fixed salary guarantees",
      "Portable benefits that move from job to job",
      "Company-provided housing",
      "Free transportation services"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: "The text mentions that governments are 'exploring new forms of portable benefits that could move from job to job.'",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["benefits", "policy-solutions"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  },
  {
    id: 10,
    type: 'reading-comprehension',
    text: "Which of the following statements best expresses the main idea of the text?",
    options: [
      "The gig economy is a perfect solution to modern employment problems",
      "Traditional employment is superior to the gig economy in all cases",
      "The gig economy offers flexibility but also creates new challenges requiring balanced solutions",
      "Digital platforms are the only reason for changes in the job market"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: "The text presents a balanced view, discussing both benefits (flexibility) and challenges (lack of security), concluding that balance is needed.",
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["main-idea", "synthesis"],
    metadata: {
      topic: "Gig Economy",
      wordCount: 385,
      estimatedTime: 3
    }
  }
];