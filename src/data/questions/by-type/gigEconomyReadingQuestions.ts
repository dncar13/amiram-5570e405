
import { Question } from "../../types/questionTypes";

export const gigEconomyPassageText = `
The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the 'gig economy' has fundamentally altered how millions of people work and earn their living.

The gig economy, characterized by short-term contracts and freelance work rather than permanent jobs, has been fueled by technological advances and changing worker preferences. Digital platforms like Uber, Airbnb, and TaskRabbit have made it easier than ever for individuals to monetize their skills, time, and assets on a flexible basis.

This shift represents both opportunities and challenges. On the positive side, gig work offers unprecedented flexibility, allowing people to choose when, where, and how much they work. It can provide supplemental income, enable career transitions, and offer autonomy that traditional employment often lacks.

However, gig workers typically face significant uncertainties. They lack the job security, benefits, and legal protections that come with traditional employment. Income can be unpredictable, and workers must often provide their own equipment and bear business expenses.

The COVID-19 pandemic has further accelerated these trends, with many people turning to gig work out of necessity as traditional jobs disappeared. This has intensified debates about worker classification, social safety nets, and the future of work itself.

As the gig economy continues to evolve, policymakers, businesses, and workers are grappling with how to balance the flexibility and innovation it enables with the need for worker protections and economic stability.
`;

export const gigEconomyReadingQuestions: Question[] = [
  {
    id: 1,
    type: 'reading-comprehension',
    text: `Read the following passage and answer the question:

What does the passage suggest about the traditional employment model?`,
    options: [
      "It has remained completely unchanged",
      "It has become more popular than ever",
      "It has undergone significant changes",
      "It has been completely eliminated"
    ],
    correctAnswer: 2,
    explanation: "The passage states that the traditional employment model 'has undergone a dramatic transformation,' indicating significant changes.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'intermediate',
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    tips: "Look for keywords in the passage that directly answer the question. The phrase 'dramatic transformation' is key here.",
    tags: ["economics", "employment", "gig-economy"],
    metadata: {
      topic: "Economics",
      wordCount: 285
    }
  },
  {
    id: 2,
    type: 'reading-comprehension',
    text: `According to the passage, what has fueled the growth of the gig economy?`,
    options: [
      "Government regulations and policies",
      "Technological advances and changing worker preferences",
      "Economic recession and job losses",
      "Increased corporate hiring"
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly states that the gig economy 'has been fueled by technological advances and changing worker preferences.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    tips: "Look for the phrase that directly explains what fueled the gig economy growth.",
    tags: ["economics", "technology", "gig-economy"],
    metadata: {
      topic: "Economics",
      wordCount: 285
    }
  },
  {
    id: 3,
    type: 'reading-comprehension',
    text: `What is the author's overall view of the gig economy?`,
    options: [
      "Completely positive with no drawbacks",
      "Entirely negative and problematic",
      "Balanced, showing both benefits and challenges",
      "Uncertain and unclear"
    ],
    correctAnswer: 2,
    explanation: "The passage presents both positive aspects (flexibility, autonomy) and challenges (job insecurity, unpredictable income), indicating a balanced view.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'intermediate',
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    tips: "Look for signal words like 'however' and 'on the positive side' that indicate the author is presenting multiple perspectives.",
    tags: ["economics", "analysis", "gig-economy"],
    metadata: {
      topic: "Economics",
      wordCount: 285
    }
  },
  {
    id: 4,
    type: 'reading-comprehension',
    text: `According to the passage, what challenges do gig workers typically face?`,
    options: [
      "Too much supervision and micromanagement",
      "Lack of job security, benefits, and legal protections",
      "Excessive working hours and overtime",
      "Limited technology access"
    ],
    correctAnswer: 1,
    explanation: "The passage states that gig workers 'lack the job security, benefits, and legal protections that come with traditional employment.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    tips: "Look for the section that discusses the negative aspects or challenges of gig work.",
    tags: ["economics", "worker-rights", "gig-economy"],
    metadata: {
      topic: "Economics",
      wordCount: 285
    }
  },
  {
    id: 5,
    type: 'reading-comprehension',
    text: `How has the COVID-19 pandemic affected the gig economy according to the passage?`,
    options: [
      "It has slowed down the growth of gig work",
      "It has accelerated trends toward gig work",
      "It has had no impact on the gig economy",
      "It has eliminated gig work opportunities"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'The COVID-19 pandemic has further accelerated these trends, with many people turning to gig work out of necessity.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageText: gigEconomyPassageText,
    passageTitle: "The Rise of the Gig Economy",
    tips: "Look for the specific paragraph that mentions COVID-19 and its effects.",
    tags: ["economics", "pandemic", "gig-economy"],
    metadata: {
      topic: "Economics",
      wordCount: 285
    }
  }
];
