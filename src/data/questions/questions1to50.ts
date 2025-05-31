
import { Question } from '../types/questionTypes';

export const questions1to50: Question[] = [
  // Reading Comprehension Questions (1-20)
  {
    id: 1,
    text: `Read the following passage and answer the question:

"The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the 'gig economy' has fundamentally altered how millions of people work and earn their living."

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
    difficulty: 'medium'
  },
  {
    id: 2,
    text: `Read the following passage and answer the question:

"The gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork."

According to the passage, digital platforms have primarily _____ the gig economy.`,
    options: [
      "hindered the development of",
      "enabled and accelerated",
      "had no impact on",
      "completely replaced"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'This shift has been largely facilitated by digital platforms,' meaning they enabled and accelerated the gig economy.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium'
  },
  {
    id: 3,
    text: `Read the following passage and answer the question:

"For many workers, the gig economy offers unprecedented flexibility and autonomy. However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance and paid vacation."

The passage indicates that gig workers' lack of traditional benefits has _____ their financial vulnerability.`,
    options: [
      "significantly reduced",
      "had no effect on",
      "greatly increased",
      "completely eliminated"
    ],
    correctAnswer: 2,
    explanation: "The passage describes how the lack of benefits creates 'significant cost' and increases financial vulnerability for gig workers.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium'
  },
  {
    id: 4,
    text: `Read the following passage and answer the question:

"The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive."

The author suggests that future policies should aim to _____ the competing demands of flexibility and security.`,
    options: [
      "completely ignore",
      "prioritize flexibility over",
      "find a balance between",
      "choose security instead of"
    ],
    correctAnswer: 2,
    explanation: "The passage explicitly states the need for 'finding a balance between the flexibility... and the security.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium'
  },
  {
    id: 5,
    text: `Read the following passage and answer the question:

"Many scientists believe that regular physical activity contributes to mental health. Studies have shown that exercise can reduce symptoms of depression and anxiety while improving mood and cognitive function."

What is the main idea of the passage?`,
    options: [
      "Scientists disagree about exercise benefits",
      "Depression cannot be treated effectively",
      "Physical activity may help improve mental well-being",
      "Cognitive function declines with age"
    ],
    correctAnswer: 2,
    explanation: "The passage focuses on how physical activity contributes to mental health and improves various psychological aspects.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy'
  },

  // Sentence Completion Questions (21-35)
  {
    id: 21,
    text: "The ancient city of Pompeii was _____ destroyed when Mount Vesuvius erupted in 79 AD, preserving it under volcanic ash for centuries.",
    options: [
      "gradually",
      "completely",
      "partially",
      "slowly"
    ],
    correctAnswer: 1,
    explanation: "The word 'completely' best describes the total destruction that preserved the city under ash.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy'
  },
  {
    id: 22,
    text: "Despite the economic crisis, the small business managed to _____ and even expand its operations.",
    options: [
      "survive",
      "collapse",
      "struggle",
      "decline"
    ],
    correctAnswer: 0,
    explanation: "The word 'survive' fits logically with the business managing to continue and expand despite difficulties.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy'
  },
  {
    id: 23,
    text: "The scientist's groundbreaking research has _____ our understanding of climate change and its long-term effects.",
    options: [
      "confused",
      "limited",
      "revolutionized",
      "complicated"
    ],
    correctAnswer: 2,
    explanation: "'Revolutionized' means to completely change or transform, which fits with 'groundbreaking research.'",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium'
  },
  {
    id: 24,
    text: "Many animals can sense natural disasters before they occur. Scientists believe they are more ______ to environmental changes than humans.",
    options: [
      "vulnerable",
      "exposed",
      "sensitive",
      "resistant"
    ],
    correctAnswer: 2,
    explanation: "'Sensitive' means able to detect or respond to slight changes, which explains how animals can sense disasters.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium'
  },
  {
    id: 25,
    text: "The new policy aims to _____ the gap between rich and poor communities by providing equal access to education.",
    options: [
      "widen",
      "bridge",
      "ignore",
      "create"
    ],
    correctAnswer: 1,
    explanation: "'Bridge' means to connect or reduce differences, which fits with providing equal access to reduce inequality.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium'
  },

  // Restatement Questions (36-50)
  {
    id: 36,
    text: "The committee did not approve the proposal because it lacked sufficient evidence.",
    options: [
      "The committee rejected the proposal due to insufficient evidence.",
      "The proposal was approved despite lacking evidence.",
      "The committee required more committee members.",
      "The evidence was sufficient for approval."
    ],
    correctAnswer: 0,
    explanation: "'Did not approve' is equivalent to 'rejected,' and 'lacked sufficient evidence' means the same as 'due to insufficient evidence.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'easy'
  },
  {
    id: 37,
    text: "Despite working overtime, she couldn't finish the project on time.",
    options: [
      "She finished the project because she worked overtime.",
      "Although she worked extra hours, she didn't complete the project by the deadline.",
      "She refused to work overtime on the project.",
      "The project was completed ahead of schedule."
    ],
    correctAnswer: 1,
    explanation: "'Despite working overtime' = 'Although she worked extra hours,' and 'couldn't finish on time' = 'didn't complete by the deadline.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'medium'
  },
  {
    id: 38,
    text: "The museum exhibition was so popular that visitors had to wait in long lines.",
    options: [
      "The exhibition was unpopular with visitors.",
      "No one wanted to visit the museum.",
      "The exhibition attracted many visitors, causing queues.",
      "The museum was closed to visitors."
    ],
    correctAnswer: 2,
    explanation: "'So popular that visitors had to wait in long lines' means the same as 'attracted many visitors, causing queues.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'easy'
  },
  {
    id: 39,
    text: "The company's profits increased significantly after implementing the new marketing strategy.",
    options: [
      "The new strategy caused the company to lose money.",
      "The marketing strategy had no effect on profits.",
      "Profits rose considerably following the introduction of the new marketing approach.",
      "The company stopped using marketing strategies."
    ],
    correctAnswer: 2,
    explanation: "'Increased significantly after implementing' is equivalent to 'rose considerably following the introduction of.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'medium'
  },
  {
    id: 40,
    text: "It is essential that all students attend the orientation session.",
    options: [
      "Students may choose whether to attend orientation.",
      "The orientation session is optional for students.",
      "All students must participate in the orientation session.",
      "Only some students need to attend orientation."
    ],
    correctAnswer: 2,
    explanation: "'It is essential that' expresses necessity, which is equivalent to 'must participate.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'medium'
  },

  // Additional questions to reach 50
  {
    id: 41,
    text: "After years of conflict, the two nations finally agreed to _____ a peace treaty that would end the war.",
    options: [
      "reject",
      "delay",
      "sign",
      "avoid"
    ],
    correctAnswer: 2,
    explanation: "'Sign' is the appropriate verb for formally agreeing to a treaty.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy'
  },
  {
    id: 42,
    text: "The detective carefully examined the crime scene, looking for any clues that might _____ the mystery.",
    options: [
      "complicate",
      "solve",
      "hide",
      "create"
    ],
    correctAnswer: 1,
    explanation: "Detectives look for clues to 'solve' mysteries.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy'
  },
  {
    id: 43,
    text: `Read the following passage:

"Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable."

According to the passage, climate change is causing weather patterns to become:",`,
    options: [
      "more stable",
      "completely unchanged",
      "increasingly unpredictable",
      "easier to forecast"
    ],
    correctAnswer: 2,
    explanation: "The passage explicitly states that weather patterns are becoming 'increasingly unpredictable.'",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy'
  },
  {
    id: 44,
    text: "The research findings _____ the hypothesis that was proposed last year.",
    options: [
      "contradicted",
      "supported",
      "ignored",
      "questioned"
    ],
    correctAnswer: 1,
    explanation: "Research findings typically 'support' a hypothesis when they provide evidence for it.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium'
  },
  {
    id: 45,
    text: "The new regulations will take effect immediately.",
    options: [
      "The regulations will be delayed indefinitely.",
      "The new rules will begin to apply right away.",
      "The regulations were rejected by authorities.",
      "The rules will never be implemented."
    ],
    correctAnswer: 1,
    explanation: "'Take effect immediately' means the same as 'begin to apply right away.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'easy'
  },
  {
    id: 46,
    text: "The professor's lecture was so _____ that many students fell asleep.",
    options: [
      "exciting",
      "boring",
      "interesting",
      "engaging"
    ],
    correctAnswer: 1,
    explanation: "If students fell asleep, the lecture was 'boring.'",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy'
  },
  {
    id: 47,
    text: `Read the following passage:

"Online education has revolutionized learning by making courses accessible to students worldwide. However, it also presents challenges such as limited face-to-face interaction and the need for strong self-discipline."

The passage suggests that online education:",`,
    options: [
      "has only positive effects",
      "should be completely avoided",
      "has both advantages and disadvantages",
      "is inferior to traditional education"
    ],
    correctAnswer: 2,
    explanation: "The passage mentions both benefits (accessibility) and challenges (limited interaction), indicating both advantages and disadvantages.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium'
  },
  {
    id: 48,
    text: "Although the weather was terrible, the outdoor concert proceeded as planned.",
    options: [
      "The concert was cancelled due to bad weather.",
      "The weather was perfect for the outdoor event.",
      "Despite the bad weather, the concert went ahead as scheduled.",
      "The concert was moved indoors because of the weather."
    ],
    correctAnswer: 2,
    explanation: "'Although the weather was terrible' = 'Despite the bad weather,' and 'proceeded as planned' = 'went ahead as scheduled.'",
    topicId: 5,
    categoryId: 3,
    difficulty: 'medium'
  },
  {
    id: 49,
    text: "The medication should be taken _____ to meals to ensure maximum effectiveness.",
    options: [
      "instead of",
      "prior to",
      "during",
      "regardless of"
    ],
    correctAnswer: 1,
    explanation: "'Prior to' means before, which is often when medications are most effective.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'medium'
  },
  {
    id: 50,
    text: `Read the following passage:

"Social media platforms have transformed how people communicate and share information. While they enable instant global communication, they have also raised concerns about privacy and the spread of misinformation."

What is the author's stance on social media?`,
    options: [
      "Completely positive",
      "Entirely negative",
      "Balanced, acknowledging both benefits and concerns",
      "Indifferent and uninformed"
    ],
    correctAnswer: 2,
    explanation: "The author presents both positive aspects (instant global communication) and negative concerns (privacy and misinformation), showing a balanced perspective.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium'
  }
];
