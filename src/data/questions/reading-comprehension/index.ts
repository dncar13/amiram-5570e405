
import { easyQuestions, easyPassages, easyStories } from "./easy";
import { mediumQuestions, mediumPassages, mediumStories } from "./medium";
import { hardQuestions, hardPassages, hardStories } from "./hard";

export const allReadingComprehensionQuestions = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions
];

export const allReadingComprehensionPassages = [
  ...easyPassages,
  ...mediumPassages,
  ...hardPassages
];

export const allReadingComprehensionStories = [
  ...easyStories,
  ...mediumStories,
  ...hardStories
];

// Statistics
export const readingComprehensionStats = {
  total: allReadingComprehensionQuestions.length,
  byDifficulty: {
    easy: easyQuestions.length,
    medium: mediumQuestions.length,
    hard: hardQuestions.length
  },
  bySubject: allReadingComprehensionStories.reduce((acc, story) => {
    const subject = story.metadata.subject;
    acc[subject] = (acc[subject] || 0) + story.questions.length;
    return acc;
  }, {} as Record<string, number>)
};

// Export individual difficulty levels
export { easyQuestions, easyPassages, easyStories };
export { mediumQuestions, mediumPassages, mediumStories };
export { hardQuestions, hardPassages, hardStories };

console.log('📚 Reading Comprehension Questions Loaded:', readingComprehensionStats);
