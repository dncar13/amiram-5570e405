
import { Question } from "../../types/questionTypes";

export const environmentPassageText = `
Climate change represents one of the most pressing challenges of our time, with far-reaching consequences for ecosystems, human societies, and the global economy. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, deforestation, and industrial processes, are the primary drivers of current climate change.

The evidence for climate change is overwhelming and multifaceted. Global average temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century, with the most dramatic warming occurring in the past four decades. Arctic sea ice is declining at a rate of 13% per decade, while glaciers worldwide are retreating. Sea levels are rising due to thermal expansion of warming oceans and melting ice sheets, threatening coastal communities and infrastructure.

The impacts of climate change extend beyond rising temperatures. Weather patterns are becoming more extreme and unpredictable, leading to more frequent and severe droughts, floods, hurricanes, and heatwaves. These changes affect agricultural productivity, water resources, and human health. Ecosystems are under stress, with many species forced to migrate or facing extinction as their habitats change faster than they can adapt.

Addressing climate change requires unprecedented global cooperation and coordinated action. The Paris Agreement, signed by nearly 200 countries, represents a significant step toward international climate action, with nations committing to limit global warming to well below 2 degrees Celsius above pre-industrial levels.

Solutions to climate change involve both mitigation and adaptation strategies. Mitigation focuses on reducing greenhouse gas emissions through renewable energy adoption, energy efficiency improvements, and sustainable transportation. Adaptation involves preparing for and responding to climate impacts that are already unavoidable, such as building sea walls, developing drought-resistant crops, and improving emergency response systems.

Individual actions, while important, must be complemented by systemic changes in energy systems, policy frameworks, and business practices to achieve the scale of transformation required to address this global challenge.
`;

export const environmentReadingQuestions: Question[] = [
  {
    id: 2001,
    type: 'reading-comprehension',
    text: `According to the passage, what is the primary driver of current climate change?`,
    options: [
      "Natural climate cycles and solar activity",
      "Human activities including fossil fuel burning and deforestation", 
      "Volcanic eruptions and geological processes",
      "Changes in ocean currents and atmospheric pressure"
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that 'human activities, particularly the burning of fossil fuels, deforestation, and industrial processes, are the primary drivers of current climate change.'",
    topicId: 3,
    difficulty: 'easy',
    passageText: environmentPassageText,
    passageTitle: "Climate Change: Challenges and Solutions",
    tags: ["environment", "climate-change", "global-warming"],
    metadata: {
      topic: "Environment",
      wordCount: 385
    }
  },
  {
    id: 2002,
    type: 'reading-comprehension',
    text: `How much have global average temperatures risen since the late 19th century?`,
    options: [
      "0.5 degrees Celsius",
      "1.1 degrees Celsius",
      "2.0 degrees Celsius", 
      "3.0 degrees Celsius"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Global average temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century.'",
    topicId: 3,
    difficulty: 'easy',
    passageText: environmentPassageText,
    passageTitle: "Climate Change: Challenges and Solutions",
    tags: ["environment", "temperature", "climate-data"],
    metadata: {
      topic: "Environment",
      wordCount: 385
    }
  },
  {
    id: 2003,
    type: 'reading-comprehension',
    text: `What is the goal of the Paris Agreement mentioned in the passage?`,
    options: [
      "To eliminate all greenhouse gas emissions by 2030",
      "To limit global warming to well below 2 degrees Celsius above pre-industrial levels",
      "To reduce fossil fuel consumption by 50%",
      "To plant one trillion trees worldwide"
    ],
    correctAnswer: 1,
    explanation: "The passage states that the Paris Agreement involves 'nations committing to limit global warming to well below 2 degrees Celsius above pre-industrial levels.'",
    topicId: 3,
    difficulty: 'medium',
    passageText: environmentPassageText,
    passageTitle: "Climate Change: Challenges and Solutions",
    tags: ["environment", "paris-agreement", "international-policy"],
    metadata: {
      topic: "Environment",
      wordCount: 385
    }
  },
  {
    id: 2004,
    type: 'reading-comprehension',
    text: `According to the passage, what is the difference between mitigation and adaptation strategies?`,
    options: [
      "Mitigation focuses on future planning while adaptation deals with current problems",
      "Mitigation reduces emissions while adaptation prepares for unavoidable impacts",
      "Mitigation is for developed countries while adaptation is for developing countries",
      "Mitigation involves technology while adaptation involves policy changes"
    ],
    correctAnswer: 1,
    explanation: "The passage explains that 'Mitigation focuses on reducing greenhouse gas emissions' while 'Adaptation involves preparing for and responding to climate impacts that are already unavoidable.'",
    topicId: 3,
    difficulty: 'medium',
    passageText: environmentPassageText,
    passageTitle: "Climate Change: Challenges and Solutions",
    tags: ["environment", "mitigation", "adaptation"],
    metadata: {
      topic: "Environment",
      wordCount: 385
    }
  },
  {
    id: 2005,
    type: 'reading-comprehension',
    text: `What does the passage suggest about individual actions in addressing climate change?`,
    options: [
      "They are sufficient to solve the climate crisis",
      "They are unimportant compared to government actions",
      "They must be complemented by systemic changes",
      "They should focus only on energy conservation"
    ],
    correctAnswer: 2,
    explanation: "The passage concludes that 'Individual actions, while important, must be complemented by systemic changes in energy systems, policy frameworks, and business practices.'",
    topicId: 3,
    difficulty: 'medium',
    passageText: environmentPassageText,
    passageTitle: "Climate Change: Challenges and Solutions",
    tags: ["environment", "individual-action", "systemic-change"],
    metadata: {
      topic: "Environment",
      wordCount: 385
    }
  }
];
