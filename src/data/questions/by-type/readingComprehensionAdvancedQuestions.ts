
import { Question } from "../../types/questionTypes";

/**
 * שאלות מתקדמות מסוג Reading Comprehension עם קטעי קריאה מלאים
 */
export const readingComprehensionAdvancedQuestions: Question[] = [
  {
    id: 51,
    type: 'reading-comprehension',
    text: `According to the passage, what is the main factor contributing to the decline in traditional employment models?`,
    options: [
      "Government regulations",
      "Economic recession", 
      "The emergence of the gig economy",
      "Technological failures"
    ],
    correctAnswer: 2,
    explanation: "The passage explicitly states that 'The emergence of the gig economy has fundamentally altered how millions of people work and earn their living.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    passageTitle: "The Changing Nature of Work",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the 'gig economy' has fundamentally altered how millions of people work and earn their living.

This shift represents more than just a change in employment structures; it reflects a broader transformation in how society views work, career progression, and economic security. Workers today are increasingly seeking flexibility, autonomy, and diverse income streams rather than the stability that previous generations prioritized.

The implications of this transformation extend beyond individual workers to affect entire industries, government policy, and social safety nets. Traditional benefits like health insurance, retirement plans, and job security are being redefined as workers navigate this new landscape.`,
    tips: "Focus on the main cause mentioned in the first paragraph."
  },
  {
    id: 52,
    type: 'reading-comprehension',
    text: `The passage suggests that modern workers prioritize which of the following over traditional job security?`,
    options: [
      "Higher salaries",
      "Flexibility and autonomy",
      "Company loyalty",
      "Retirement benefits"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Workers today are increasingly seeking flexibility, autonomy, and diverse income streams rather than the stability that previous generations prioritized.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    passageTitle: "The Changing Nature of Work",
    passageText: `The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the 'gig economy' has fundamentally altered how millions of people work and earn their living.

This shift represents more than just a change in employment structures; it reflects a broader transformation in how society views work, career progression, and economic security. Workers today are increasingly seeking flexibility, autonomy, and diverse income streams rather than the stability that previous generations prioritized.

The implications of this transformation extend beyond individual workers to affect entire industries, government policy, and social safety nets. Traditional benefits like health insurance, retirement plans, and job security are being redefined as workers navigate this new landscape.`,
    tips: "Look for what workers are 'increasingly seeking' according to the passage."
  },
  {
    id: 53,
    type: 'reading-comprehension',
    text: `Based on the passage, how has climate change affected global ice formations?`,
    options: [
      "Ice caps have become thicker",
      "Ice caps are melting",
      "Ice formation has increased",
      "No change has occurred"
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that 'Rising global temperatures are causing ice caps to melt.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageTitle: "Climate Change Impact",
    passageText: `Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide are working to develop solutions that can help mitigate these effects.

The consequences of climate change extend far beyond environmental concerns. Economic systems, agricultural practices, and human migration patterns are all being affected by these dramatic changes. Coastal communities face the immediate threat of rising sea levels, while inland areas experience more frequent droughts and extreme weather events.

International cooperation has become essential in addressing this global crisis. Countries are working together to reduce greenhouse gas emissions, develop renewable energy sources, and implement sustainable practices across all sectors of society.`,
    tips: "The answer is directly stated in the first paragraph."
  },
  {
    id: 54,
    type: 'reading-comprehension',
    text: `According to the passage, what role does international cooperation play in addressing climate change?`,
    options: [
      "It is unnecessary",
      "It has become essential",
      "It is being discouraged",
      "It is only optional"
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly states that 'International cooperation has become essential in addressing this global crisis.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    passageTitle: "Climate Change Impact", 
    passageText: `Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide are working to develop solutions that can help mitigate these effects.

The consequences of climate change extend far beyond environmental concerns. Economic systems, agricultural practices, and human migration patterns are all being affected by these dramatic changes. Coastal communities face the immediate threat of rising sea levels, while inland areas experience more frequent droughts and extreme weather events.

International cooperation has become essential in addressing this global crisis. Countries are working together to reduce greenhouse gas emissions, develop renewable energy sources, and implement sustainable practices across all sectors of society.`,
    tips: "Look for the direct statement about international cooperation in the last paragraph."
  },
  {
    id: 55,
    type: 'reading-comprehension',
    text: `What challenge does the passage identify with online education?`,
    options: [
      "High costs",
      "Limited technological access",
      "Limited face-to-face interaction",
      "Poor internet connectivity"
    ],
    correctAnswer: 2,
    explanation: "The passage specifically mentions 'limited face-to-face interaction' as one of the challenges presented by online education.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageTitle: "Online Education Revolution",
    passageText: `Online education has revolutionized learning by making courses accessible to students worldwide. However, it also presents challenges such as limited face-to-face interaction and the need for strong self-discipline. Despite these obstacles, many educational institutions continue to expand their online offerings.

The digital learning environment offers unprecedented flexibility, allowing students to learn at their own pace and schedule. This has opened doors for working professionals, parents, and those in remote areas who previously had limited access to quality education.

Technology continues to evolve, with virtual reality, artificial intelligence, and interactive platforms enhancing the online learning experience. These innovations are helping to bridge the gap between traditional classroom instruction and digital education.`,
    tips: "The challenges are mentioned in the first paragraph."
  }
];
