
import { Question } from '../types/questionTypes';

export const questions51to100: Question[] = [
  // Complex reading passage - The Gig Economy
  {
    id: 51,
    text: "The first paragraph suggests that the traditional employment model has _____ in recent decades.",
    options: [
      "remained completely unchanged",
      "become more popular than ever", 
      "undergone significant changes",
      "been completely eliminated"
    ],
    correctAnswer: 2,
    explanation: "Lines 1-4 describe a 'dramatic transformation' of the traditional employment model.",
    topicId: 9,
    categoryId: 2,
    difficulty: 'medium',
    questionType: 'reading-comprehension',
    passageTitle: "The Rise of the Gig Economy",
    lineNumbers: true,
    passageWithLines: [
      {
        lineNumber: 1,
        startLine: 1,
        endLine: 4,
        text: "The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the \"gig economy\" has fundamentally altered how millions of people work and earn their living."
      },
      {
        lineNumber: 2,
        startLine: 5,
        endLine: 9,
        text: "The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services."
      },
      {
        lineNumber: 3,
        startLine: 10,
        endLine: 14,
        text: "For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work from anywhere, and pursue multiple income streams simultaneously. A graphic designer might work on website projects in the morning, drive for a ride-sharing service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential."
      },
      {
        lineNumber: 4,
        startLine: 15,
        endLine: 19,
        text: "However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and retirement plans. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses. During economic downturns, gig workers are often the first to see their income disappear, as they have no job security or guaranteed minimum wage."
      },
      {
        lineNumber: 5,
        startLine: 20,
        endLine: 24,
        text: "The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While some highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of \"working poor\" – people who are employed but still live in poverty."
      },
      {
        lineNumber: 6,
        startLine: 25,
        endLine: 29,
        text: "Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections. Others are exploring new forms of portable benefits that could follow workers from job to job, rather than being tied to a single employer."
      },
      {
        lineNumber: 7,
        startLine: 30,
        endLine: 33,
        text: "The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants."
      }
    ],
    tips: "Look for key words in the passage that directly answer the question. The phrase 'dramatic transformation' is the key here."
  },

  {
    id: 52,
    text: "According to the passage, digital platforms have primarily _____ the gig economy.",
    options: [
      "hindered the development of",
      "enabled and accelerated",
      "had no impact on", 
      "completely replaced"
    ],
    correctAnswer: 1,
    explanation: "Lines 7-9 state that 'This shift has been largely facilitated by digital platforms'",
    topicId: 9,
    categoryId: 2,
    difficulty: 'medium',
    questionType: 'reading-comprehension',
    passageTitle: "The Rise of the Gig Economy",
    lineNumbers: true,
    tips: "Focus on the word 'facilitated' which means 'enabled and made easier'."
  },

  {
    id: 53,
    text: "The passage indicates that gig workers' lack of traditional benefits has _____ their financial vulnerability.",
    options: [
      "significantly reduced",
      "had no effect on",
      "greatly increased", 
      "completely eliminated"
    ],
    correctAnswer: 2,
    explanation: "Lines 15-19 describe how the lack of benefits creates additional costs and financial insecurity.",
    topicId: 9,
    categoryId: 2,
    difficulty: 'hard',
    questionType: 'reading-comprehension',
    passageTitle: "The Rise of the Gig Economy",
    lineNumbers: true,
    tips: "Read carefully the fourth paragraph which describes the costs and risks."
  },

  {
    id: 54,
    text: "The author suggests that future policies should aim to _____ the competing demands of flexibility and security.",
    options: [
      "completely ignore",
      "prioritize flexibility over",
      "find a balance between",
      "choose security instead of"
    ],
    correctAnswer: 2,
    explanation: "Lines 30-31 call for 'finding a balance between the flexibility... and the security'",
    topicId: 9,
    categoryId: 2,
    difficulty: 'medium',
    questionType: 'reading-comprehension',
    passageTitle: "The Rise of the Gig Economy", 
    lineNumbers: true,
    tips: "The phrase 'finding a balance' appears explicitly in the last paragraph."
  }
];
