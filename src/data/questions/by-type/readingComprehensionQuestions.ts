import { Question } from "../../types/questionTypes";

/**
 * שאלות מסוג Reading Comprehension (הבנת הנקרא)
 * כל השאלות מאוגדות בקובץ אחד עם סיווג פנימי לפי רמת קושי
 */
export const readingComprehensionQuestions: Question[] = [
  {
    id: 1,
    type: 'reading-comprehension',
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
    difficulty: 'medium',
    passageText: "The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in the 21st century. The emergence of the 'gig economy' has fundamentally altered how millions of people work and earn their living.",
    tips: "Look for keywords in the passage that directly answer the question. The phrase 'dramatic transformation' is key here."
  },
  {
    id: 2,
    type: 'reading-comprehension',
    text: `Read the following passage and answer the question:

"Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide are working to develop solutions that can help mitigate these effects."

According to the passage, what effect is climate change having on weather patterns?`,
    options: [
      "Making them more stable and predictable",
      "Making them increasingly unpredictable",
      "Having no noticeable effect",
      "Causing them to disappear completely"
    ],
    correctAnswer: 1,
    explanation: "The passage explicitly states that weather patterns are becoming 'increasingly unpredictable' due to climate change.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'easy',
    passageText: "Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide are working to develop solutions that can help mitigate these effects.",
    tips: "Focus on the specific phrase that describes what's happening to weather patterns in the passage."
  },
  {
    id: 3,
    type: 'reading-comprehension',
    text: `Read the following passage and answer the question:

"Online education has revolutionized learning by making courses accessible to students worldwide. However, it also presents challenges such as limited face-to-face interaction and the need for strong self-discipline. Despite these obstacles, many educational institutions continue to expand their online offerings."

What is the author's overall view of online education?`,
    options: [
      "Completely positive with no drawbacks",
      "Entirely negative and problematic",
      "Balanced, showing both benefits and challenges",
      "Uncertain and unclear"
    ],
    correctAnswer: 2,
    explanation: "The passage presents both positive aspects (accessibility, revolutionized learning) and challenges (limited interaction, need for discipline), indicating a balanced view.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    passageText: "Online education has revolutionized learning by making courses accessible to students worldwide. However, it also presents challenges such as limited face-to-face interaction and the need for strong self-discipline. Despite these obstacles, many educational institutions continue to expand their online offerings.",
    tips: "Look for signal words like 'however' and 'despite' that indicate the author is presenting multiple perspectives."
  }
];
