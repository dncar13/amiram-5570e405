import { Question } from "../../types/questionTypes";

/**
 * שאלות מסוג Restatement (ניסוח מחדש)
 * כל השאלות מאוגדות בקובץ אחד עם סיווג פנימי לפי רמת קושי
 */
export const restatementQuestions: Question[] = [
  // שאלות מהקובץ הישן (IDs 101-105)
  {
    id: 101,
    type: 'restatement',
    text: `The company's revenue increased by 25% last quarter due to improved marketing strategies and expanded international sales.

Which statement best restates this information?`,
    options: [
      "The company lost money due to poor marketing decisions.",
      "Marketing improvements and global expansion led to a 25% revenue growth last quarter.",
      "The company's profits decreased by 25% in the previous quarter.",
      "International sales were the only reason for revenue changes."
    ],
    correctAnswer: 1,
    explanation: "The correct restatement captures both key factors (marketing improvements and international expansion) and the specific result (25% revenue increase).",
    topicId: 2,
    categoryId: 1,
    difficulty: 'medium',
    tips: "Look for the option that includes all the key information from the original statement without adding or omitting important details."
  },
  {
    id: 102,
    type: 'restatement',
    text: `Despite initial skepticism from investors, the startup's innovative approach to renewable energy has attracted significant funding and partnerships with major corporations.

Which statement best restates this information?`,
    options: [
      "Investors were enthusiastic about the startup from the beginning.",
      "The startup failed to secure any funding due to investor doubts.",
      "Although investors were initially doubtful, the startup's renewable energy innovation has secured substantial funding and corporate partnerships.",
      "Major corporations rejected partnerships with the startup."
    ],
    correctAnswer: 2,
    explanation: "This option correctly captures the contrast (despite skepticism) and the positive outcome (funding and partnerships).",
    topicId: 2,
    categoryId: 1,
    difficulty: 'hard',
    tips: "Pay attention to contrast words like 'despite' that indicate a relationship between two ideas."
  },
  {
    id: 103,
    type: 'restatement',
    text: `The new employee training program will be mandatory for all staff members and must be completed within the first month of employment.

Which statement best restates this information?`,
    options: [
      "Training is optional for new employees.",
      "All new employees are required to finish the training program in their first month.",
      "The training program can be completed at any time.",
      "Only some staff members need to complete the training."
    ],
    correctAnswer: 1,
    explanation: "This option correctly conveys that the training is required (mandatory) for all new employees and has a specific time frame (first month).",
    topicId: 2,
    categoryId: 1,
    difficulty: 'easy',
    tips: "Look for key words like 'mandatory' which means required or compulsory."
  },
  {
    id: 104,
    type: 'restatement',
    text: `Research indicates that students who participate in extracurricular activities tend to achieve better academic performance compared to those who focus solely on their studies.

Which statement best restates this information?`,
    options: [
      "Students should avoid extracurricular activities to improve their grades.",
      "Academic performance is not related to extracurricular participation.",
      "Studies show that involvement in extracurricular activities is associated with improved academic results versus studying alone.",
      "Extracurricular activities have no impact on student success."
    ],
    correctAnswer: 2,
    explanation: "This option accurately restates the research finding about the positive relationship between extracurricular activities and academic performance.",
    topicId: 2,
    categoryId: 1,
    difficulty: 'medium',
    tips: "When restating research findings, look for options that maintain the comparative relationship described in the original."
  },
  {
    id: 105,
    type: 'restatement',
    text: `The museum's new exhibition on ancient civilizations will run for six months and features artifacts on loan from institutions worldwide.

Which statement best restates this information?`,
    options: [
      "The exhibition will be permanent and features local artifacts only.",
      "Ancient civilization artifacts from global institutions will be displayed for half a year.",
      "The museum is closing its exhibition early.",
      "Only one institution provided artifacts for the exhibition."
    ],
    correctAnswer: 1,
    explanation: "This option correctly restates the duration (six months = half a year) and the source of artifacts (worldwide institutions).",
    topicId: 2,
    categoryId: 1,
    difficulty: 'hard',
    tips: "Pay attention to time periods and sources - make sure the restatement preserves these key details."
  },

  // השאלות החדשות שלך (IDs 301-310) - מהקובץ restatementMediumQuestions.ts
  {
    id: 301,
    type: "restatement",
    text: "The university administration has determined that extending library hours during examination periods is financially unfeasible at this time.\n\nWhich statement best restates this information?",
    options: [
      "The university cannot afford to keep the library open longer during exam periods right now.",
      "The university administration has decided to extend library hours despite financial constraints.",
      "The financial department has rejected the university's proposal to extend library hours.",
      "The university is considering extending library hours if financial conditions improve."
    ],
    correctAnswer: 0,
    explanation: "The original statement indicates that extending library hours is 'financially unfeasible at this time,' which is directly equivalent to saying the university 'cannot afford' to keep the library open longer right now. The other options either contradict the original statement or add information not present in the original.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "university life",
      wordCount: 140,
      estimatedTime: 60
    },
    topicId: 2,
    categoryId: 1,
    tips: "Look for the option that contains the exact same meaning as the original statement, without adding or changing any information."
  },
  {
    id: 302,
    type: "restatement",
    text: "Students who fail to submit their assignments by the deadline will not be granted extensions except in cases of documented medical emergencies.\n\nWhich statement best restates this information?",
    options: [
      "Medical documentation is required for all assignment submissions.",
      "Late assignments will be accepted only if students provide evidence of a medical emergency.",
      "Students may request extensions for their assignments regardless of their medical condition.",
      "Documented medical emergencies are insufficient grounds for assignment extensions."
    ],
    correctAnswer: 1,
    explanation: "The original statement explains that extensions will not be granted except for documented medical emergencies, which means late assignments will only be accepted with medical evidence. Option 1 correctly captures this exception policy.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "academic policies",
      wordCount: 150,
      estimatedTime: 65
    },
    topicId: 2,
    categoryId: 1,
    tips: "Pay attention to exception clauses ('except in cases of') as they define the only circumstances where the rule doesn't apply."
  },
  {
    id: 303,
    type: "restatement",
    text: "The company's new remote work policy allows employees to work from home up to three days per week, provided they maintain their productivity levels and attend mandatory team meetings.\n\nWhich statement best restates this information?",
    options: [
      "Employees can work remotely without any restrictions or requirements.",
      "The company prohibits all remote work regardless of productivity.",
      "Workers may work from home for a maximum of three days weekly if they sustain productivity and participate in required meetings.",
      "Remote work is only allowed for employees who cannot attend team meetings."
    ],
    correctAnswer: 2,
    explanation: "This option accurately captures all three key elements: the maximum limit (up to three days), the productivity requirement, and the mandatory meeting attendance. It restates the policy completely and accurately.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "workplace policies",
      wordCount: 160,
      estimatedTime: 70
    },
    topicId: 2,
    categoryId: 1,
    tips: "When dealing with policies that have multiple conditions, ensure your restatement includes all the requirements mentioned."
  },
  {
    id: 304,
    type: "restatement",
    text: "The research findings indicate that regular exercise combined with a balanced diet significantly reduces the risk of developing cardiovascular disease in adults over 40.\n\nWhich statement best restates this information?",
    options: [
      "Only exercise is necessary to prevent heart disease in older adults.",
      "Diet alone is sufficient to reduce cardiovascular risks for people over 40.",
      "Studies show that exercising regularly and eating a balanced diet greatly lowers heart disease risk for adults above 40 years old.",
      "Cardiovascular disease cannot be prevented through lifestyle changes."
    ],
    correctAnswer: 2,
    explanation: "This option correctly restates all key components: the combination of exercise and diet, the significant reduction in risk, the specific health condition (cardiovascular disease), and the target age group (adults over 40).",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "health and wellness",
      wordCount: 145,
      estimatedTime: 62
    },
    topicId: 2,
    categoryId: 1,
    tips: "Research findings often involve multiple factors working together. Make sure your restatement preserves these relationships."
  },
  {
    id: 305,
    type: "restatement",
    text: "The city council has approved the construction of a new public library, which will be funded through a combination of municipal bonds and private donations, with completion expected by December 2026.\n\nWhich statement best restates this information?",
    options: [
      "The city rejected the library project due to insufficient funding.",
      "A new public library will be built using both municipal bonds and private donations, scheduled to finish in December 2026.",
      "Private donations are the only source of funding for the new library.",
      "The library construction will begin in December 2026."
    ],
    correctAnswer: 1,
    explanation: "This option accurately restates the approval of the project, the dual funding sources (municipal bonds and private donations), and the completion timeline. All key information is preserved without addition or omission.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "municipal affairs",
      wordCount: 155,
      estimatedTime: 68
    },
    topicId: 2,
    categoryId: 1,
    tips: "When restating information about projects, pay attention to approval status, funding sources, and timelines."
  },
  {
    id: 306,
    type: "restatement",
    text: "The software update will be automatically installed on all company devices during the weekend maintenance window to minimize disruption to daily operations.\n\nWhich statement best restates this information?",
    options: [
      "Employees must manually install the software update during work hours.",
      "The update will be installed automatically on weekends to avoid interfering with regular work activities.",
      "Daily operations will be significantly disrupted by the software installation.",
      "Company devices will not receive the software update."
    ],
    correctAnswer: 1,
    explanation: "This option correctly captures the automatic installation process, the weekend timing, and the purpose of minimizing disruption to daily work. It preserves all essential information from the original statement.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "technology and workplace",
      wordCount: 138,
      estimatedTime: 58
    },
    topicId: 2,
    categoryId: 1,
    tips: "Notice timing and purpose clauses - they're often crucial elements that need to be preserved in restatements."
  },
  {
    id: 307,
    type: "restatement",
    text: "The airline has announced that passengers traveling with children under two years old will be allowed to board the aircraft first, effective immediately.\n\nWhich statement best restates this information?",
    options: [
      "Families with young children must board the plane last.",
      "Starting now, passengers with children under two can board the aircraft before other passengers.",
      "Only children under two are allowed to board the plane early.",
      "The boarding policy change will take effect next month."
    ],
    correctAnswer: 1,
    explanation: "This option accurately restates the priority boarding privilege for passengers with very young children (under two) and the immediate implementation. It captures both the specific age requirement and the timing of the policy.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "travel and transportation",
      wordCount: 142,
      estimatedTime: 61
    },
    topicId: 2,
    categoryId: 1,
    tips: "Pay attention to age specifications and timing phrases like 'effective immediately' - these are precise details that must be preserved."
  },
  {
    id: 308,
    type: "restatement",
    text: "The museum's annual membership fee will increase by 15% starting next fiscal year, but current members who renew before March 31st will maintain their existing rates.\n\nWhich statement best restates this information?",
    options: [
      "All museum members will pay higher fees starting immediately.",
      "Membership fees will decrease by 15% for all members next year.",
      "Beginning next fiscal year, membership costs will rise 15%, except for current members who renew by March 31st.",
      "The museum is eliminating all membership fees after March 31st."
    ],
    correctAnswer: 2,
    explanation: "This option correctly restates the fee increase percentage, the timing, and the important exception for early renewals. It preserves the conditional aspect that allows current members to avoid the increase.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "institutional policies",
      wordCount: 148,
      estimatedTime: 64
    },
    topicId: 2,
    categoryId: 1,
    tips: "When there are exceptions or special conditions, make sure your restatement includes these important qualifications."
  },
  {
    id: 309,
    type: "restatement",
    text: "The conference organizers have decided to move the event from an in-person format to a virtual platform due to ongoing health concerns and travel restrictions.\n\nWhich statement best restates this information?",
    options: [
      "The conference will continue in its original in-person format.",
      "Health concerns and travel restrictions have prompted organizers to switch the conference to a virtual format.",
      "The conference has been permanently cancelled due to health issues.",
      "Travel restrictions do not affect the conference planning."
    ],
    correctAnswer: 1,
    explanation: "This option accurately captures the format change (from in-person to virtual) and the reasons for the change (health concerns and travel restrictions). It preserves the causal relationship between the factors and the decision.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "event management",
      wordCount: 140,
      estimatedTime: 60
    },
    topicId: 2,
    categoryId: 1,
    tips: "Look for cause-and-effect relationships in the original statement and ensure they are maintained in the restatement."
  },
  {
    id: 310,
    type: "restatement",
    text: "The new parking regulations require all vehicles to display valid permits and prohibit overnight parking in residential areas between 2 AM and 6 AM.\n\nWhich statement best restates this information?",
    options: [
      "Vehicles can park overnight anywhere without permits.",
      "Parking permits are optional and overnight parking is always allowed.",
      "All cars must have valid permits displayed, and overnight parking in residential zones is banned from 2 AM to 6 AM.",
      "The parking regulations only apply during daytime hours."
    ],
    correctAnswer: 2,
    explanation: "This option correctly restates both requirements: the permit display requirement for all vehicles and the specific time-restricted overnight parking prohibition in residential areas. All key details are preserved accurately.",
    difficulty: "medium",
    tags: ["amir-test"],
    createdAt: "2025-06-02T08:01:14.564Z",
    metadata: {
      topic: "municipal regulations",
      wordCount: 135,
      estimatedTime: 57
    },
    topicId: 2,
    categoryId: 1,
    tips: "Regulations often have multiple components. Ensure your restatement includes all requirements and restrictions mentioned."
  }
];
