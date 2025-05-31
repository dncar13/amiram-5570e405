import { Topic } from '../types/topicTypes';
import { BookOpen, Brain, MessageSquare, Target, Zap } from 'lucide-react';

// Export topics data for Amiram English tests
export const topicsData: Topic[] = [
  {
    id: 1,
    title: "Reading Comprehension - Basic Texts",
    description: "הבנת הנקרא ברמה בסיסית - טקסטים קצרים ופשוטים",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: BookOpen,
    categoryId: 1,
    tips: [
      "קרא את הטקסט לפחות פעמיים לפני מעבר לשאלות",
      "זהה מילות מפתח בשאלה ובטקסט",
      "שים לב להקשר ולא רק למילים בודדות",
      "אל תוסיף מידע שלא כתוב בטקסט",
      "אם לא בטוח, חזור לטקסט ובדוק שוב"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 2,
    title: "Reading Comprehension - Intermediate Texts",
    description: "הבנת הנקרא ברמה בינונית - טקסטים מורכבים יותר",
    timeEstimate: "50-65 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: BookOpen,
    categoryId: 1,
    tips: [
      "התמקד בהבנת הרעיון המרכזי",
      "זהה קשרי סיבה ותוצאה",
      "שים לב לדעות מול עובדות",
      "חפש רמזים בהקשר למילים לא מוכרות"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 3,
    title: "Grammar - Verb Tenses",
    description: "זמני פועל באנגלית - עבר, הווה, עתיד ומשמעויותיהם",
    timeEstimate: "40-55 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: Brain,
    categoryId: 2,
    tips: [
      "זהה מילות אות זמן (yesterday, now, tomorrow)",
      "שים לב להקשר הזמני של המשפט",
      "התרגל על המבנה של כל זמן",
      "זכור את ההבדלים בין זמנים דומים"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 4,
    title: "Grammar - Sentence Structure",
    description: "מבנה המשפט האנגלי - סדר מילים וחלקי דיבור",
    timeEstimate: "35-50 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: Brain,
    categoryId: 2,
    tips: [
      "זכור את הסדר הבסיסי: Subject + Verb + Object",
      "שים לב למיקום התואר במשפט",
      "התרגל על סוגי השאלות השונים",
      "זהה את חלקי הדיבור השונים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 5,
    title: "Grammar - Modal Verbs & Conditionals",
    description: "פעלי עזר ומשפטי תנאי באנגלית",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: Brain,
    categoryId: 2,
    tips: [
      "הבן את המשמעויות השונות של כל Modal",
      "התרגל על סוגי התנאי השונים",
      "שים לב להבדלים דקים בין Modal Verbs",
      "זכור את המבנים הקבועים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 6,
    title: "Vocabulary - Common Words",
    description: "אוצר מילים בסיסי ושימושי ליומיום",
    timeEstimate: "30-45 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: MessageSquare,
    categoryId: 3,
    tips: [
      "למד מילים בהקשר ולא בבידוד",
      "התרגל על מילים נרדפות ומילים נגדיות",
      "שים לב למשמעויות שונות של אותה מילה",
      "עשה קשרים בין מילים חדשות למוכרות"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 7,
    title: "Vocabulary - Academic Words",
    description: "אוצר מילים אקדמי ומתקדם",
    timeEstimate: "40-55 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: MessageSquare,
    categoryId: 3,
    tips: [
      "התמקד במילים שחוזרות בטקסטים אקדמיים",
      "למד קידומות וסיומות נפוצות",
      "התרגל על הבחנות משמעות דקות",
      "השתמש במילים בהקשרים שונים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 8,
    title: "Vocabulary - Collocations & Phrases",
    description: "צירופי מילים ובעיות לשון נפוצות",
    timeEstimate: "35-50 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: MessageSquare,
    categoryId: 3,
    tips: [
      "למד צירופים קבועים כיחידה אחת",
      "שים לב לשילובים נפוצים של מילים",
      "התרגל על ביטויים אידיומטיים",
      "זכור שלא כל תרגום מילולי נכון"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 9,
    title: "Mixed Practice - Reading & Grammar",
    description: "תרגול משולב של הבנת הנקרא ודקדוק",
    timeEstimate: "55-70 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: Target,
    categoryId: 4,
    tips: [
      "שלב בין כישורים שונים באותו תרגיל",
      "שים לב הן לתוכן והן למבנה",
      "תרגל מעבר מהיר בין סוגי שאלות",
      "נהל זמן בחוכמה בין חלקים שונים"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 10,
    title: "Comprehensive Amiram Test - All Skills",
    description: "מבחן מקיף הכולל את כל נושאי האמירם באנגלית",
    timeEstimate: "120-150 דקות",
    totalQuestions: 0,
    targetQuestions: 300,
    targetCount: 300,
    completedPercentage: 0,
    difficulty: "mixed",
    icon: Zap,
    categoryId: 4,
    tips: [
      "נהל את הזמן בחוכמה - הקצה זמן לכל חלק",
      "התחל בנושאים החזקים שלך",
      "אל תיתקע על שאלה אחת - עבור הלאה",
      "השאר זמן לבדיקה בסוף",
      "קרא שאלות בעיון ואל תמהר"
    ],
    subtopics: [],
    recommended: true
  }
];
