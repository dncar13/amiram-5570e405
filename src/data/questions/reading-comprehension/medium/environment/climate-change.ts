
import { ReadingPassage, ReadingQuestion, QuestionMetadata } from "../../../../types/questionTypes";

export const metadata: QuestionMetadata = {
  id: "rc-medium-env-001",
  subject: "environment",
  difficulty: "medium",
  estimatedTime: 18,
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
    id: 30301,
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
    tips: "Look for what the passage identifies as the main cause of climate change.",
    topicId: 3
  },
  {
    id: 30302,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "How much have global average temperatures risen since the late 19th century?",
    options: [
      "0.5 degrees Celsius",
      "1.1 degrees Celsius",
      "2.0 degrees Celsius",
      "3.0 degrees Celsius"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Global average temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["environment", "temperature", "climate-data"],
    tips: "Find the specific temperature increase mentioned in the passage.",
    topicId: 3
  },
  {
    id: 30303,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What is the goal of the Paris Agreement mentioned in the passage?",
    options: [
      "To eliminate all greenhouse gas emissions by 2030",
      "To limit global warming to well below 2 degrees Celsius above pre-industrial levels",
      "To reduce fossil fuel consumption by 50%",
      "To plant one trillion trees worldwide"
    ],
    correctAnswer: 1,
    explanation: "The passage states that the Paris Agreement involves 'nations committing to limit global warming to well below 2 degrees Celsius above pre-industrial levels.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["environment", "paris-agreement", "international-policy"],
    tips: "Look for the specific commitment mentioned regarding the Paris Agreement.",
    topicId: 3
  },
  {
    id: 30304,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "comparison",
    text: "According to the passage, what is the difference between mitigation and adaptation strategies?",
    options: [
      "Mitigation focuses on future planning while adaptation deals with current problems",
      "Mitigation reduces emissions while adaptation prepares for unavoidable impacts",
      "Mitigation is for developed countries while adaptation is for developing countries",
      "Mitigation involves technology while adaptation involves policy changes"
    ],
    correctAnswer: 1,
    explanation: "The passage explains that 'Mitigation focuses on reducing greenhouse gas emissions' while 'Adaptation involves preparing for and responding to climate impacts that are already unavoidable.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["environment", "mitigation", "adaptation"],
    tips: "Compare the definitions given for mitigation and adaptation in the passage.",
    topicId: 3
  },
  {
    id: 30305,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "What does the passage suggest about individual actions in addressing climate change?",
    options: [
      "They are sufficient to solve the climate crisis",
      "They are unimportant compared to government actions",
      "They must be complemented by systemic changes",
      "They should focus only on energy conservation"
    ],
    correctAnswer: 2,
    explanation: "The passage concludes that 'Individual actions, while important, must be complemented by systemic changes in energy systems, policy frameworks, and business practices.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["environment", "individual-action", "systemic-change"],
    tips: "Look at what the passage says about the relationship between individual and systemic actions.",
    topicId: 3
  },
  {
    id: 30306,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "At what rate is Arctic sea ice declining according to the passage?",
    options: [
      "10% per decade",
      "13% per decade",
      "15% per decade",
      "20% per decade"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Arctic sea ice is declining at a rate of 13% per decade.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["arctic", "sea-ice", "data"],
    tips: "Find the specific percentage mentioned for Arctic sea ice decline.",
    topicId: 3
  },
  {
    id: 30307,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What are the causes of rising sea levels mentioned in the passage?",
    options: [
      "Increased rainfall and flooding",
      "Thermal expansion of warming oceans and melting ice sheets",
      "Volcanic activity and earthquakes",
      "Changes in ocean currents"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Sea levels are rising due to thermal expansion of warming oceans and melting ice sheets.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["sea-level", "ocean", "ice-sheets"],
    tips: "Look for the specific causes of sea level rise mentioned in the passage.",
    topicId: 3
  },
  {
    id: 30308,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what can be inferred about the timing of climate change effects?",
    options: [
      "All effects are in the distant future",
      "Some effects are already occurring and others are unavoidable",
      "Effects only occur in certain regions",
      "Effects are reversible with immediate action"
    ],
    correctAnswer: 1,
    explanation: "The passage discusses current effects like temperature rise and mentions 'climate impacts that are already unavoidable,' indicating both current and future effects.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["inference", "timing", "effects"],
    tips: "Consider what the passage says about current versus future climate impacts.",
    topicId: 3
  },
  {
    id: 30309,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "Which extreme weather events are mentioned as becoming more frequent and severe?",
    options: [
      "Tornadoes, blizzards, and ice storms",
      "Droughts, floods, hurricanes, and heatwaves",
      "Earthquakes, tsunamis, and landslides",
      "Sandstorms, avalanches, and monsoons"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions 'more frequent and severe droughts, floods, hurricanes, and heatwaves.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["extreme-weather", "events"],
    tips: "Find the list of weather events mentioned in the passage.",
    topicId: 3
  },
  {
    id: 30310,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the passage, 'multifaceted' most likely means:",
    options: [
      "Simple and straightforward",
      "Having many different aspects",
      "Unclear and confusing",
      "Single-focused"
    ],
    correctAnswer: 1,
    explanation: "In the context of describing evidence for climate change, 'multifaceted' means having many different aspects or dimensions.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "Consider what 'multifaceted evidence' would mean in the context of climate change.",
    topicId: 3
  },
  {
    id: 30311,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "How many countries signed the Paris Agreement according to the passage?",
    options: [
      "Nearly 150 countries",
      "Nearly 200 countries",
      "Over 250 countries",
      "All 195 countries"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'The Paris Agreement, signed by nearly 200 countries.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["paris-agreement", "countries"],
    tips: "Look for the specific number of countries mentioned.",
    topicId: 3
  },
  {
    id: 30312,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the pace of habitat change versus species adaptation?",
    options: [
      "Species adapt faster than habitats change",
      "The pace is perfectly matched",
      "Habitats change faster than species can adapt",
      "There is no relationship between the two"
    ],
    correctAnswer: 2,
    explanation: "The passage mentions 'many species forced to migrate or facing extinction as their habitats change faster than they can adapt.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["species", "adaptation", "habitats"],
    tips: "Look for what the passage says about the relationship between habitat change and species adaptation.",
    topicId: 3
  },
  {
    id: 30313,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What mitigation strategies are mentioned in the passage?",
    options: [
      "Building sea walls and emergency systems",
      "Renewable energy adoption, energy efficiency, and sustainable transportation",
      "Developing drought-resistant crops",
      "International cooperation and agreements"
    ],
    correctAnswer: 1,
    explanation: "The passage states that mitigation involves 'renewable energy adoption, energy efficiency improvements, and sustainable transportation.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["mitigation", "strategies"],
    tips: "Find the specific mitigation strategies listed in the passage.",
    topicId: 3
  },
  {
    id: 30314,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What adaptation examples are provided in the passage?",
    options: [
      "Renewable energy and electric vehicles",
      "Building sea walls, developing drought-resistant crops, and improving emergency response",
      "International agreements and carbon taxes",
      "Reducing fossil fuel consumption"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions adaptation examples: 'building sea walls, developing drought-resistant crops, and improving emergency response systems.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["adaptation", "examples"],
    tips: "Look for the specific adaptation examples mentioned in the passage.",
    topicId: 3
  },
  {
    id: 30315,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what is required to address climate change effectively?",
    options: [
      "Only individual actions",
      "Only government policies",
      "Unprecedented global cooperation and coordinated action",
      "Only technological solutions"
    ],
    correctAnswer: 2,
    explanation: "The passage states that 'Addressing climate change requires unprecedented global cooperation and coordinated action.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["cooperation", "action"],
    tips: "Look for what the passage says is required to address climate change.",
    topicId: 3
  },
  {
    id: 30316,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In this context, 'unprecedented' most likely means:",
    options: [
      "Previously experienced",
      "Never before seen or done",
      "Slightly unusual",
      "Expected and normal"
    ],
    correctAnswer: 1,
    explanation: "In the context of global cooperation for climate change, 'unprecedented' means never before seen or done at this scale.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "context"],
    tips: "Consider what kind of global cooperation would be needed for climate change.",
    topicId: 3
  },
  {
    id: 30317,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the relationship between climate change and human health?",
    options: [
      "There is no connection",
      "Climate change affects human health",
      "Human health improvements cause climate change",
      "The relationship is unclear"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions that climate changes 'affect agricultural productivity, water resources, and human health.'",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["health", "impacts"],
    tips: "Look for what the passage says about the effects of climate change on different aspects of life.",
    topicId: 3
  },
  {
    id: 30318,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "What is the author's overall tone regarding climate change?",
    options: [
      "Dismissive and unconcerned",
      "Urgent and concerned but solution-oriented",
      "Overly optimistic",
      "Completely hopeless"
    ],
    correctAnswer: 1,
    explanation: "The author presents climate change as a serious challenge but also discusses solutions and international cooperation, showing urgency with hope.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["author-intent", "tone"],
    tips: "Consider how the author presents both the problems and solutions related to climate change.",
    topicId: 3
  },
  {
    id: 30319,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "When did the most dramatic warming occur according to the passage?",
    options: [
      "In the late 19th century",
      "In the early 20th century",
      "In the past four decades",
      "In the past century"
    ],
    correctAnswer: 2,
    explanation: "The passage states that 'the most dramatic warming occurring in the past four decades.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["warming", "timeline"],
    tips: "Find when the passage says the most dramatic warming occurred.",
    topicId: 3
  },
  {
    id: 30320,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "Based on the passage, what can be inferred about the scientific community's view on climate change?",
    options: [
      "Scientists are divided on the issue",
      "There is clear scientific consensus",
      "Scientists are unsure about the causes",
      "Scientific opinion keeps changing"
    ],
    correctAnswer: 1,
    explanation: "The passage begins by stating 'The scientific consensus is clear' regarding human activities as drivers of climate change.",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["scientific-consensus", "inference"],
    tips: "Look at what the passage says about scientific agreement on climate change.",
    topicId: 3
  },
  {
    id: 30321,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What threatens coastal communities according to the passage?",
    options: [
      "Extreme weather only",
      "Rising sea levels",
      "Arctic ice decline",
      "Glacier retreat"
    ],
    correctAnswer: 1,
    explanation: "The passage states that 'Sea levels are rising... threatening coastal communities and infrastructure.'",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["coastal", "sea-levels"],
    tips: "Find what the passage identifies as threatening coastal areas.",
    topicId: 3
  },
  {
    id: 30322,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "inference",
    text: "What does the passage suggest about the scope of transformation needed?",
    options: [
      "Minor adjustments are sufficient",
      "Large-scale transformation is required",
      "No transformation is needed",
      "Only local changes are necessary"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions 'the scale of transformation required to address this global challenge,' indicating large-scale changes are needed.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["transformation", "scale"],
    tips: "Consider what the passage says about the scale of changes needed.",
    topicId: 3
  },
  {
    id: 30323,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "vocabulary-context",
    text: "In the passage, 'retreating' in reference to glaciers means:",
    options: [
      "Moving backward or shrinking",
      "Advancing forward",
      "Staying in place",
      "Rotating"
    ],
    correctAnswer: 0,
    explanation: "In the context of climate change impacts, 'retreating' glaciers means they are shrinking or moving backward due to melting.",
    difficulty: "easy",
    estimatedTime: 1,
    tags: ["vocabulary", "glaciers"],
    tips: "Consider what would happen to glaciers in a warming climate.",
    topicId: 3
  },
  {
    id: 30324,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "details",
    text: "What areas of change does the passage say are needed in addition to individual actions?",
    options: [
      "Only energy systems",
      "Energy systems, policy frameworks, and business practices",
      "Only government policies",
      "Only business practices"
    ],
    correctAnswer: 1,
    explanation: "The passage mentions the need for 'systemic changes in energy systems, policy frameworks, and business practices.'",
    difficulty: "easy",
    estimatedTime: 2,
    tags: ["systemic-changes", "areas"],
    tips: "Find the specific areas mentioned that need systemic changes.",
    topicId: 3
  },
  {
    id: 30325,
    passageId: 103,
    type: "reading-comprehension",
    questionSubtype: "author-intent",
    text: "What is the primary purpose of this passage?",
    options: [
      "To promote renewable energy companies",
      "To provide a comprehensive overview of climate change challenges and solutions",
      "To criticize government policies",
      "To discourage environmental action"
    ],
    correctAnswer: 1,
    explanation: "The passage provides a balanced overview of climate change evidence, impacts, international responses, and both mitigation and adaptation solutions.",
    difficulty: "medium",
    estimatedTime: 2,
    tags: ["author-intent", "purpose"],
    tips: "Consider the overall structure and content to determine the passage's main purpose.",
    topicId: 3
  }
];

export const climateChangeStory = {
  metadata,
  passage,
  questions
};
