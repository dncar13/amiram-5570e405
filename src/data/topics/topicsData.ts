
import { Topic } from '../types/topicTypes';
import { FileText } from 'lucide-react';

// Export topics data
export const topicsData: Topic[] = [
  {
    id: 1,
    title: "התקנת כלי חשמל במתח גבוה",
    description: "התקנה ובטיחות של כלי חשמל במתח גבוה",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: null,
    categoryId: 2,
    tips: [
  "עיין בעמודים 78–97 לפני תחילת הסימולציה",
  "ודא הכרה של עומקי הטמנה ומרחקים תקניים",
  "בדוק דרישות רדיוס כיפוף לכבלי מתח גבוה",
  "שינון טבלת זרמים מותרים לפי חתך וסוג בידוד",
  "שים לב לחובת סימון ואזהרה מעל תוואי קבור",
  "בדוק דרישות הארקה לכלי עבודה וסולמות"
],
    subtopics: [],
    recommended: false
  },
  {
    id: 2,
    title: "עבודה במיתקן חי או בקרבתו",
    description: "עבודה במיתקן חי או בקרבתו לפי תקנות החשמל",
    timeEstimate: "60-75 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: null,
    categoryId: 2,
    tips: [
      "הקפד על הרשאות עבודה מתאימות",
      "השתמש בציוד מגן אישי ייעודי",
      "וודא קיום הדרכת בטיחות ייעודית"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 3,
    title: "הארקות ואמצעי הגנה בפני חישמול במתח עד 1000 וולט",
    description: "מערכות הארקה ואמצעי הגנה מפני חישמול במתח נמוך",
    timeEstimate: "50-65 דקות",
    totalQuestions: 4,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 8,
    difficulty: "intermediate",
    icon: null,
    categoryId: 1,
    tips: [
      "הכר את סוגי ההארקות השונים",
      "וודא חיבור נכון של מערכת ההארקה",
      "בדוק התנגדות הארקה באופן תקופתי"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 4,
    title: "מוליכים סופיים המיועדים למתח עד 1000 וולט",
    description: "התקנה ובחירה של מוליכים סופיים במתח נמוך",
    timeEstimate: "40-55 דקות",
    totalQuestions: 1,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 2,
    difficulty: "intermediate",
    icon: null,
    categoryId: 2,
    tips: [
      "בחר חתך מוליכים מתאים לעומס",
      "הקפד על צבעי מוליכים תקניים",
      "וודא בידוד תקין ומתאים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 5,
    title: "התקנת לוחות במתח עד 1000 וולט",
    description: "התקנת לוחות חשמל במתח נמוך",
    timeEstimate: "55-70 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 3,
    tips: [
      "הקפד על סדר וארגון בתוך הלוח",
      "וודא מרווחי אוורור מתאימים",
      "התקן שילוט תקני לכל מעגל"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 6,
    title: "התקנת מוליכים, והתקנת כבלים שאינם עולים על מתח נמוך",
    description: "שיטות התקנה של מוליכים וכבלים במתח נמוך",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: null,
    categoryId: 5,
    tips: [
      "השתמש בשיטות קיבוע מתאימות",
      "הקפד על רדיוסי כיפוף מינימליים",
      "שמור על מרחק בטיחות ממקורות חום"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 7,
    title: "התקנת כבלים במתח שאינו עולה על מתח נמוך",
    description: "התקנת כבלים במתח נמוך וסוגי כבלים שונים",
    timeEstimate: "50-65 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 5,
    tips: [
      "בחר כבלים המתאימים לתנאי הסביבה",
      "הקפד על תמיכה ועיגון נאותים",
      "וודא חיבור נכון בקצוות"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 8,
    title: "התקנת גנרטורים למתח נמוך",
    description: "התקנה, תחזוקה ובדיקה של גנרטורים למתח נמוך",
    timeEstimate: "45-60 דקות",
    totalQuestions: 1,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 2,
    difficulty: "advanced",
    icon: null,
    categoryId: 1,
    tips: [
      "וודא אוורור מתאים במקום ההתקנה",
      "התקן מערכת פליטה תקנית",
      "בדוק מערכת החלפה אוטומטית באופן תקופתי"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 9,
    title: "מיתקן חשמלי ארעי באתר בניה במתח שאינו עולה על מתח נמוך",
    description: "התקנה ובדיקת מתקני חשמל ארעיים באתרי בנייה",
    timeEstimate: "40-55 דקות",
    totalQuestions: 5,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 10,
    difficulty: "intermediate",
    icon: null,
    categoryId: 3,
    tips: [
      "השתמש בציוד עמיד למים ואבק",
      "בדוק מפסקי פחת אחת לשבוע",
      "הקפד על גובה התקנה תקני"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 10,
    title: "תקנות רשויות חשמל עליזות במתח עד 1000 וולט",
    description: "תקנות ודרישות של רשויות החשמל במתח נמוך",
    timeEstimate: "35-50 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: null,
    categoryId: 6,
    tips: [
      "הכר את הדרישות החוקיות העדכניות",
      "וודא קבלת אישורים מתאימים",
      "שמור על תיעוד של בדיקות ואישורים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 11,
    title: "תקנות מערכות אל-פסק חשמליות במתח נמוך",
    description: "התקנה ותחזוקה של מערכות אל-פסק (UPS) במתח נמוך",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 1,
    tips: [
      "התקן בחדר עם אוורור מתאים",
      "וודא תחזוקה תקופתית של המצברים",
      "בדוק זמן גיבוי בעומס מלא"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 12,
    title: "התפשטות והגנה של מוליכים מבודדים וכבלים במתח נמוך",
    description: "התפשטות תרמית והגנה על מוליכים וכבלים במתח נמוך",
    timeEstimate: "40-55 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 5,
    tips: [
      "תכנן מקדמי התפשטות תרמית",
      "השתמש באמצעי הגנה מתאימים",
      "וודא ריווח נכון בין כבלים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 13,
    title: "מיתקני חשמל באתרים חקלאיים במתח עד 1000 וולט",
    description: "התקנת ותחזוקת מערכות חשמל באתרים חקלאיים",
    timeEstimate: "50-65 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 3,
    tips: [
      "השתמש בציוד עמיד לתנאי סביבה קשים",
      "הקפד על הגנה מפני חדירת מים ואבק",
      "וודא הגנה מפני קורוזיה"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 14,
    title: "מיתקני חשמל באתרים רפואיים במתח שאינו עולה על מתח נמוך",
    description: "התקנת מערכות חשמל במתקנים רפואיים",
    timeEstimate: "60-75 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: null,
    categoryId: 4,
    tips: [
      "הכר את דרישות ה-IT למתקנים רפואיים",
      "הקפד על מערכות גיבוי אמינות",
      "וודא ביצוע בדיקות תקופתיות"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 15,
    title: "מיתקני חשמל למרחצי הידרותרפיים במתח שאינו עולה על מתח נמוך",
    description: "התקנת מערכות חשמל במרחצים ובריכות הידרותרפיים",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: null,
    categoryId: 4,
    tips: [
      "הכר את אזורי הסיכון השונים",
      "השתמש בציוד מתאים לסביבה רטובה",
      "הקפד על מפסקי פחת ייעודיים"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 16,
    title: "סוג בדיקות למיתקני חשמל שאינו עולה על מתח נמוך",
    description: "סוגי בדיקות, מדידות ופרוטוקולים למתקני חשמל במתח נמוך",
    timeEstimate: "55-70 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 6,
    tips: [
      "הכר את סוגי הבדיקות השונים",
      "השתמש במכשירי מדידה מכוילים",
      "תעד את תוצאות הבדיקות באופן מסודר"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 17,
    title: "מיתקן חשמל ציבורי בבנין רב קומות",
    description: "התקנת מערכות חשמל בבניינים רבי קומות",
    timeEstimate: "60-75 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "advanced",
    icon: null,
    categoryId: 4,
    tips: [
      "תכנן מערכות עומס יתר ותקלה",
      "הקפד על מערכות חירום אמינות",
      "וודא עמידה בדרישות כיבוי אש"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 18,
    title: "תקנות הבזק והחשמל (התקרבות והצטלבות בין קווי בזק לקווי חשמל)",
    description: "תקנות ודרישות להתקרבות והצטלבות בין קווי בזק וחשמל",
    timeEstimate: "40-55 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "intermediate",
    icon: null,
    categoryId: 6,
    tips: [
      "הכר את מרחקי הבטיחות הנדרשים",
      "וודא תיאום עם חברות התקשורת",
      "התקן אמצעי הגנה במקומות הצטלבות"
    ],
    subtopics: [],
    recommended: false
  },
  {
    id: 19,
    title: "תקנות הבטיחות בעבודה",
    description: "תקנות ודרישות בטיחות בעבודות חשמל",
    timeEstimate: "45-60 דקות",
    totalQuestions: 0,
    targetQuestions: 50,
    targetCount: 50,
    completedPercentage: 0,
    difficulty: "beginner",
    icon: null,
    categoryId: 6,
    tips: [
      "הכר את הוראות הבטיחות לעבודות חשמל",
      "השתמש בציוד מגן אישי מתאים",
      "וודא קיום הדרכות בטיחות תקופתיות"
    ],
    subtopics: [],
    recommended: true
  },
  {
    id: 20,
    title: "כל השאלות - מבחן מקיף",
    description: "מאגר מקיף של כל השאלות מכל הנושאים, מבחן הכנה מקיף",
    timeEstimate: "120-150 דקות",
    totalQuestions: 18,
    targetQuestions: 1000,
    targetCount: 1000,
    completedPercentage: 1.8,
    difficulty: "mixed",
    icon: null,
    categoryId: 6,
    tips: [
      "נהל את הזמן בחוכמה - הקצה כ-1 דקה לכל שאלה",
      "עבור קודם על שאלות שאתה בטוח בתשובתן",
      "חזור על נושאים חלשים לפני המבחן המקיף"
    ],
    subtopics: [],
    recommended: true
  }
]
