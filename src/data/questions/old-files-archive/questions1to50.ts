import { Question } from '../../types/questionTypes';

export const questions1to50: Question[] = [
  // Reading Comprehension Questions (1-3)
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
      "Uncertain and unclear about its value"
    ],
    correctAnswer: 2,
    explanation: "The author presents both positive aspects (accessibility, revolutionary impact) and challenges (limited interaction, need for self-discipline), showing a balanced perspective.",
    topicId: 1,
    categoryId: 1,
    difficulty: 'medium',
    passageText: "Online education has revolutionized learning by making courses accessible to students worldwide. However, it also presents challenges such as limited face-to-face interaction and the need for strong self-discipline. Despite these obstacles, many educational institutions continue to expand their online offerings.",
    tips: "Look for words like 'however' and 'despite' that indicate the author is presenting multiple perspectives."
  },

  // Sentence Completion Questions (4-6)
  {
    id: 4,
    type: 'sentence-completion',
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
    difficulty: 'medium',
    tips: "Consider which word best matches the positive impact suggested by 'groundbreaking research.'"
  },
  {
    id: 5,
    type: 'sentence-completion',
    text: "Despite working overtime, she couldn't _____ the project on time.",
    options: [
      "abandon",
      "complete",
      "postpone",
      "criticize"
    ],
    correctAnswer: 1,
    explanation: "The context suggests she was trying to finish the project, and 'complete' fits logically with the time constraint mentioned.",
    topicId: 3,
    categoryId: 2,
    difficulty: 'easy',
    tips: "The word 'Despite' suggests contrast - she worked extra but still couldn't do something expected."
  },
  {
    id: 6,
    type: 'sentence-completion',
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
    difficulty: 'medium',
    tips: "Think about what a policy would want to do with a gap between communities - reduce it or increase it?"
  },

  // Restatement Questions (7-10)
  {
    id: 7,
    type: 'restatement',
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
    difficulty: 'easy',
    tips: "Look for the option that uses different words but expresses exactly the same meaning as the original sentence."
  },
  {
    id: 8,
    type: 'restatement',
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
    difficulty: 'medium',
    tips: "Find the option that maintains the contrast between bad weather and the event continuing as planned."
  },
  {
    id: 9,
    type: 'restatement',
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
    difficulty: 'medium',
    tips: "Focus on the strength of the requirement - 'essential' indicates something is absolutely necessary."
  },
  {
    id: 10,
    type: 'restatement',
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
    difficulty: 'easy',
    tips: "Look for the phrase that means the same as 'immediately' and 'take effect.'"
  }
];
