import { Question } from '../../types/questionTypes';

/**
 * שאלות מסוג Restatement (הכותבת מחדש) - נוצר על ידי AI
 * השאלות מתרכזות ביכולת להבין ולהכתיב מחדש מידע בצורה מדויקת
 */
export const restatementQuestions: Question[] = [
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
      "Investors immediately supported the startup's renewable energy projects.",
      "The startup failed to attract any corporate partnerships.",
      "Although investors were initially doubtful, the startup's innovative renewable energy approach secured substantial funding and corporate partnerships.",
      "Major corporations rejected partnerships with the renewable energy startup."
    ],
    correctAnswer: 2,
    explanation: "This option correctly restates the contrast (initial skepticism vs. eventual success) and includes all key elements: skepticism, innovation, funding, and partnerships.",
    topicId: 2,
    categoryId: 1,
    difficulty: 'hard',
    tips: "Pay attention to contrasting elements in the original statement and ensure they are preserved in the restatement."
  },
  {
    id: 103,
    type: 'restatement',
    text: `The new regulations require all food manufacturers to clearly label allergen information and provide detailed nutritional data on their packaging.

Which statement best restates this requirement?`,
    options: [
      "Food companies must include both allergen warnings and complete nutritional information on their packages according to new rules.",
      "New laws only require allergen information on food labels.",
      "Nutritional data is optional for food manufacturers under the new regulations.",
      "The regulations apply only to certain types of food products."
    ],
    correctAnswer: 0,
    explanation: "This option accurately restates both requirements (allergen labeling AND nutritional data) that apply to all food manufacturers.",
    topicId: 2,
    categoryId: 1,
    difficulty: 'easy',
    tips: "When multiple requirements are mentioned, make sure the restatement includes all of them."
  },
  {
    id: 104,
    type: 'restatement',
    text: `The research study concluded that regular exercise, combined with a balanced diet, can reduce the risk of heart disease by up to 40% in adults over 50.

Which statement best restates this finding?`,
    options: [
      "Exercise alone can prevent heart disease in older adults.",
      "Adults over 50 can reduce heart disease risk by up to 40% through regular exercise and balanced nutrition.",
      "The study found that diet is more important than exercise for heart health.",
      "Only people under 50 benefit from exercise and good nutrition."
    ],
    correctAnswer: 1,
    explanation: "This restatement correctly includes all key elements: the age group (over 50), both factors (exercise AND diet), and the specific benefit (up to 40% risk reduction).",
    topicId: 2,
    categoryId: 1,
    difficulty: 'medium',
    tips: "Scientific findings often include specific populations, multiple factors, and quantified results - ensure all are included in the restatement."
  },
  {
    id: 105,
    type: 'restatement',
    text: `While remote work offers flexibility and eliminates commuting time, it can also lead to social isolation and difficulties in maintaining work-life balance for some employees.

Which statement best restates this observation?`,
    options: [
      "Remote work is always better than office work.",
      "All remote workers experience social isolation.",
      "Remote work provides benefits like flexibility and time savings, but may cause isolation and work-life balance challenges for certain workers.",
      "Commuting is the main problem with traditional office work."
    ],
    correctAnswer: 2,
    explanation: "This restatement preserves the balanced perspective, mentioning both advantages (flexibility, no commuting) and potential disadvantages (isolation, work-life balance issues) while noting these affect 'some employees.'",
    topicId: 2,
    categoryId: 1,
    difficulty: 'hard',
    tips: "When the original statement presents both pros and cons, ensure your restatement maintains this balanced view."
  }
];

export default restatementQuestions;
