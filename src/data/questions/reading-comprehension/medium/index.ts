
import { artificialIntelligenceStory } from "./technology/artificial-intelligence";
import { climateChangeStory } from "./environment/climate-change";

export const mediumQuestions = [
  ...artificialIntelligenceStory.questions,
  ...climateChangeStory.questions
];

export const mediumPassages = [
  artificialIntelligenceStory.passage,
  climateChangeStory.passage
];

export const mediumStories = [
  artificialIntelligenceStory,
  climateChangeStory
];

export { artificialIntelligenceStory, climateChangeStory };
