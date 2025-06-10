import { ReadingPassage, ReadingQuestion, QuestionMetadata } from "../../../../types/questionTypes";

export const metadata: QuestionMetadata = {
  id: "rc-medium-env-001",
  subject: "environment",
  difficulty: "medium",
  estimatedTime: 15,
  tags: ["climate-change", "environment", "global-warming", "sustainability"],
  author: "system",
  dateCreated: "2025-06-10",
  lastModified: "2025-06-10",
  validationStatus: "approved"
};

export const passage: ReadingPassage = {
  id: 103,
  title: "Climate Change: Challenges and Solutions",
  topic: "Environment",
  generalSubject: "Environment",
  text: `Climate change represents one of the most pressing challenges of our time, with far-reaching consequences for ecosystems, human societies, and the global economy. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, deforestation, and industrial processes, are the primary drivers of current climate change.

The evidence for climate change is overwhelming and multifaceted. Global average temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century, with the most dramatic warming occurring in the past four decades. Arctic sea ice is declining at a rate of 13% per decade, while glaciers worldwide are retreating. Sea levels are rising due to thermal expansion of warming oceans and melting ice sheets, threatening coastal communities and infrastructure.

The impacts of climate change extend beyond rising temperatures. Weather patterns are becoming more extreme and unpredictable, leading to more frequent and severe droughts, floods, hurricanes, and heatwaves. These changes affect agricultural productivity, water resources, and human health. Ecosystems are under stress, with many species forced to migrate or facing extinction as their habitats change faster than they can adapt.

Addressing climate change requires unprecedented global cooperation and coordinated action. The Paris Agreement, signed by nearly 200 countries, represents a significant step toward international climate action, with nations committing to limit global warming to well below 2 degrees Celsius above pre-industrial levels.

Solutions to climate change involve both mitigation and adaptation strategies. Mitigation focuses on reducing greenhouse gas emissions through renewable energy adoption, energy efficiency improvements, and sustainable transportation. Adaptation involves preparing for and responding to climate impacts that are already unavoidable, such as building sea walls, developing drought-resistant crops, and improving emergency response systems.

Individual actions, while important, must be complemented by systemic changes in energy systems, policy frameworks, and business practices to achieve the scale of transformation required to address this global challenge.`,
  wordCount: 385,
  readingLevel: "grade-12"
};

export const questions: ReadingQuestion[] = [
  {
    id: 30001,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "main-idea",
    text: "According to the passage, what is the primary driver of current climate change?",
    options: [
      "Natural climate cycles and solar activity",
      "Human activities including fossil fuel burning and deforestation", 
      "Volcanic eruptions and geological processes",
      "Changes in ocean currents and atmospheric pressure"
    ],
    correctAnswer: 1,
    explanation: "The passage clearly states that 'human activities, particularly the burning of fossil fuels, deforestation, and industrial processes, are the primary drivers of current climate change.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["environment", "climate-change", "global-warming"],
    tips: "Look for the direct statement about the primary cause of climate change.",
    topicId: 3
  },
  {
    id: 30002,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What evidence does the passage provide for climate change?",
    options: [
      "Increased volcanic activity",
      "Rising global average temperatures and declining Arctic sea ice",
      "Changes in Earth's orbit",
      "Decreased solar radiation"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions 'rising global average temperatures' and 'declining Arctic sea ice' as evidence for climate change.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["evidence", "temperature", "arctic-sea-ice"],
    tips: "Identify the specific data points mentioned as evidence.",
    topicId: 3
  },
  {
    id: 30003,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What can be inferred about the consequences of extreme weather patterns?",
    options: [
      "They primarily affect developed countries",
      "They have no impact on agricultural productivity",
      "They affect agricultural productivity, water resources, and human health",
      "They only occur in coastal regions"
    ],
    correctAnswer: 2,
    explanation: "The passage states that extreme weather patterns 'affect agricultural productivity, water resources, and human health.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["weather", "agriculture", "health"],
    tips: "Consider the broad impacts of the mentioned weather changes.",
    topicId: 3
  },
  {
    id: 30004,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is the main goal of the Paris Agreement?",
    options: [
      "To eliminate all carbon emissions",
      "To limit global warming to well below 2 degrees Celsius above pre-industrial levels",
      "To establish a global government",
      "To redistribute wealth among nations"
    ],
    correctAnswer: 1,
    explanation: "The passage states that the Paris Agreement aims 'to limit global warming to well below 2 degrees Celsius above pre-industrial levels.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["paris-agreement", "global-warming", "international-policy"],
    tips: "Look for the specific temperature target mentioned in relation to the agreement.",
    topicId: 3
  },
  {
    id: 30005,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the context of the passage, what does 'mitigation' refer to?",
    options: [
      "Preparing for unavoidable climate impacts",
      "Reducing greenhouse gas emissions",
      "Studying the causes of climate change",
      "Relocating populations affected by climate change"
    ],
    correctAnswer: 1,
    explanation: "The passage explains that 'Mitigation focuses on reducing greenhouse gas emissions.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["mitigation", "emissions", "vocabulary"],
    tips: "Consider the actions described as ways to reduce climate change.",
    topicId: 3
  },
  {
    id: 30006,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage imply about the role of individual actions in addressing climate change?",
    options: [
      "They are insignificant",
      "They are more important than government policies",
      "They must be complemented by systemic changes",
      "They are only effective in developed countries"
    ],
    correctAnswer: 2,
    explanation: "The passage suggests that 'Individual actions, while important, must be complemented by systemic changes.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["individual-action", "systemic-change", "implication"],
    tips: "Look for the statement that balances individual and broader actions.",
    topicId: 3
  },
  {
    id: 30007,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "According to the passage, what are some adaptation strategies for climate change?",
    options: [
      "Building sea walls and developing drought-resistant crops",
      "Increasing deforestation",
      "Ignoring the problem",
      "Promoting the use of fossil fuels"
    ],
    correctAnswer: 0,
    explanation: "The passage mentions 'building sea walls, developing drought-resistant crops, and improving emergency response systems' as adaptation strategies.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["adaptation", "sea-walls", "drought-resistant-crops"],
    tips: "Find the specific examples of adaptation measures listed.",
    topicId: 3
  },
  {
    id: 30008,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What is the likely outcome if climate change is not addressed?",
    options: [
      "Ecosystems will thrive",
      "Human societies will prosper",
      "The global economy will improve",
      "Ecosystems will be under stress, and species may face extinction"
    ],
    correctAnswer: 3,
    explanation: "The passage indicates that if climate change continues, 'Ecosystems are under stress, with many species forced to migrate or facing extinction.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["outcomes", "ecosystems", "extinction"],
    tips: "Consider the negative impacts described in the passage.",
    topicId: 3
  },
  {
    id: 30009,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the passage, 'unprecedented' most nearly means:",
    options: [
      "Common",
      "Ordinary",
      "Never before seen or done",
      "Expected"
    ],
    correctAnswer: 2,
    explanation: "In the context of 'unprecedented global cooperation,' unprecedented means never before seen or done.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["vocabulary", "context", "unprecedented"],
    tips: "Consider the scale of the cooperation being described.",
    topicId: 3
  },
  {
    id: 30010,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is the rate at which Arctic sea ice is declining per decade?",
    options: [
      "5%",
      "10%",
      "13%",
      "20%"
    ],
    correctAnswer: 2,
    explanation: "The passage states that 'Arctic sea ice is declining at a rate of 13% per decade.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["arctic-sea-ice", "decline", "rate"],
    tips: "Find the specific percentage mentioned in the passage.",
    topicId: 3
  },
  {
    id: 30011,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the long-term effects of climate change?",
    options: [
      "They will be minimal",
      "They will only affect polar regions",
      "They will have far-reaching consequences for ecosystems and human societies",
      "They are easily reversible"
    ],
    correctAnswer: 2,
    explanation: "The passage indicates that climate change has 'far-reaching consequences for ecosystems, human societies, and the global economy.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["long-term-effects", "ecosystems", "human-societies"],
    tips: "Consider the overall scope of the impacts described.",
    topicId: 3
  },
  {
    id: 30012,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is contributing to the rising sea levels, according to the passage?",
    options: [
      "Increased rainfall",
      "Thermal expansion of warming oceans and melting ice sheets",
      "Decreased evaporation",
      "The construction of dams"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions 'thermal expansion of warming oceans and melting ice sheets' as causes of rising sea levels.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["sea-levels", "thermal-expansion", "melting-ice"],
    tips: "Identify the specific factors mentioned as contributing to the rise.",
    topicId: 3
  },
  {
    id: 30013,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage imply about the speed of ecosystem adaptation to climate change?",
    options: [
      "Ecosystems are adapting quickly",
      "Ecosystems are adapting at the same rate as climate change",
      "Ecosystems are changing faster than they can adapt",
      "Ecosystems do not need to adapt"
    ],
    correctAnswer: 2,
    explanation: "The passage states that 'Ecosystems are under stress, with many species forced to migrate or facing extinction as their habitats change faster than they can adapt.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["ecosystem", "adaptation", "speed"],
    tips: "Consider the relationship between the rate of change and adaptation.",
    topicId: 3
  },
  {
    id: 30014,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the context of the passage, 'consensus' most nearly means:",
    options: [
      "Disagreement",
      "Debate",
      "General agreement",
      "Theory"
    ],
    correctAnswer: 2,
    explanation: "In the context of 'scientific consensus,' consensus refers to a general agreement.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["vocabulary", "context", "consensus"],
    tips: "Consider the level of agreement among scientists.",
    topicId: 3
  },
  {
    id: 30015,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "By approximately how much have global average temperatures risen since the late 19th century?",
    options: [
      "0.5 degrees Celsius",
      "1.1 degrees Celsius",
      "2.0 degrees Celsius",
      "3.0 degrees Celsius"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Global average temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["temperature", "increase", "global-warming"],
    tips: "Find the specific temperature increase mentioned.",
    topicId: 3
  },
  {
    id: 30016,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the economic impacts of climate change?",
    options: [
      "They are negligible",
      "They are limited to certain industries",
      "They are far-reaching and affect the global economy",
      "They are beneficial"
    ],
    correctAnswer: 2,
    explanation: "The passage indicates that climate change has 'far-reaching consequences for ecosystems, human societies, and the global economy.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["economic-impact", "global-economy", "consequences"],
    tips: "Consider the overall scope of the impacts described.",
    topicId: 3
  },
  {
    id: 30017,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What human activities are identified as primary drivers of climate change?",
    options: [
      "Planting trees",
      "Burning of fossil fuels, deforestation, and industrial processes",
      "Recycling",
      "Using renewable energy"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'human activities, particularly the burning of fossil fuels, deforestation, and industrial processes, are the primary drivers of current climate change.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["human-activities", "fossil-fuels", "deforestation"],
    tips: "Identify the specific activities mentioned as causes.",
    topicId: 3
  },
  {
    id: 30018,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage imply about the effectiveness of current international efforts to combat climate change?",
    options: [
      "They are sufficient",
      "They are unnecessary",
      "They represent a significant step but require further action",
      "They are detrimental"
    ],
    correctAnswer: 2,
    explanation: "The passage describes the Paris Agreement as 'a significant step toward international climate action,' implying that further action is needed.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["international-efforts", "paris-agreement", "effectiveness"],
    tips: "Consider the language used to describe the agreement's role.",
    topicId: 3
  },
  {
    id: 30019,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the passage, 'far-reaching' most nearly means:",
    options: [
      "Limited",
      "Insignificant",
      "Extensive",
      "Local"
    ],
    correctAnswer: 2,
    explanation: "In the context of 'far-reaching consequences,' far-reaching means extensive.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["vocabulary", "context", "far-reaching"],
    tips: "Consider the scope of the consequences being described.",
    topicId: 3
  },
  {
    id: 30020,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is the role of renewable energy adoption in addressing climate change?",
    options: [
      "To increase greenhouse gas emissions",
      "To reduce greenhouse gas emissions",
      "To have no impact on climate change",
      "To deplete natural resources"
    ],
    correctAnswer: 1,
    explanation: "The passage states that mitigation involves 'renewable energy adoption' to reduce greenhouse gas emissions.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["renewable-energy", "emissions", "mitigation"],
    tips: "Find the specific mention of renewable energy in the context of mitigation.",
    topicId: 3
  },
  {
    id: 30021,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the relationship between climate change and extreme weather events?",
    options: [
      "They are unrelated",
      "Climate change is causing more frequent and severe extreme weather events",
      "Extreme weather events are decreasing due to climate change",
      "They are only related in coastal areas"
    ],
    correctAnswer: 1,
    explanation: "The passage indicates that 'Weather patterns are becoming more extreme and unpredictable, leading to more frequent and severe droughts, floods, hurricanes, and heatwaves.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["extreme-weather", "frequency", "severity"],
    tips: "Consider the connection made between weather patterns and climate change.",
    topicId: 3
  },
  {
    id: 30022,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What is the role of energy efficiency improvements in mitigating climate change?",
    options: [
      "To increase energy consumption",
      "To reduce energy consumption and emissions",
      "To have no impact on climate change",
      "To make energy more expensive"
    ],
    correctAnswer: 1,
    explanation: "The passage states that mitigation involves 'energy efficiency improvements' to reduce greenhouse gas emissions.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["energy-efficiency", "emissions", "mitigation"],
    tips: "Find the specific mention of energy efficiency in the context of mitigation.",
    topicId: 3
  },
  {
    id: 30023,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage imply about the potential for reversing the effects of climate change?",
    options: [
      "The effects are easily reversible",
      "The effects are irreversible",
      "The effects can be mitigated and adapted to, but complete reversal is unlikely",
      "The effects are only reversible through geoengineering"
    ],
    correctAnswer: 2,
    explanation: "The passage focuses on mitigation and adaptation strategies, suggesting that while impacts can be lessened, complete reversal is unlikely.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["reversing-effects", "mitigation", "adaptation"],
    tips: "Consider the overall tone and focus of the passage.",
    topicId: 3
  },
  {
    id: 30024,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the context of the passage, 'unavoidable' most nearly means:",
    options: [
      "Preventable",
      "Inevitable",
      "Optional",
      "Desirable"
    ],
    correctAnswer: 1,
    explanation: "In the context of 'climate impacts that are already unavoidable,' unavoidable means inevitable.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["vocabulary", "context", "unavoidable"],
    tips: "Consider the certainty implied by the word in the context of climate impacts.",
    topicId: 3
  },
  {
    id: 30025,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What can be inferred about the urgency of addressing climate change?",
    options: [
      "It can be delayed for future generations",
      "It requires immediate and unprecedented global action",
      "It only affects certain regions",
      "It is primarily an economic issue"
    ],
    correctAnswer: 1,
    explanation: "The passage emphasizes that addressing climate change 'requires unprecedented global cooperation and coordinated action' and describes it as 'one of the most pressing challenges of our time.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["urgency", "global-action"],
    tips: "Consider the language used to describe the challenge and required response.",
    topicId: 3
  }
];

export const climateChangeStory = {
  metadata,
  passage,
  questions
};
