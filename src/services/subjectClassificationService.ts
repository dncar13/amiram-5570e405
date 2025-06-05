import { Question } from '@/data/types/questionTypes';

export type GeneralSubject = 
  | 'technology' 
  | 'economics' 
  | 'engineering' 
  | 'health' 
  | 'society' 
  | 'education' 
  | 'environment' 
  | 'history' 
  | 'psychology';

/**
 * מזהה את הנושא הכללי של שאלה על בסיס התוכן שלה
 */
export const identifyQuestionSubject = (question: Question): GeneralSubject | null => {
  const textToAnalyze = `${question.text} ${question.passageText || ''} ${question.passageTitle || ''}`.toLowerCase();
  
  // Technology keywords
  const technologyKeywords = [
    'technology', 'digital', 'computer', 'internet', 'online', 'software', 'platform',
    'טכנולוגיה', 'דיגיטלי', 'מחשב', 'אינטרנט', 'תוכנה', 'פלטפורמה', 'רשת'
  ];
  
  // Economics keywords
  const economicsKeywords = [
    'economy', 'economic', 'money', 'business', 'market', 'financial', 'gig economy',
    'כלכלה', 'כלכלי', 'כסף', 'עסק', 'שוק', 'פיננסי', 'כלכלת הגיג', 'תעסוקה'
  ];
  
  // Engineering keywords
  const engineeringKeywords = [
    'engineering', 'technical', 'system', 'design', 'construction', 'infrastructure',
    'הנדסה', 'טכני', 'מערכת', 'עיצוב', 'בנייה', 'תשתית'
  ];
  
  // Health keywords
  const healthKeywords = [
    'health', 'medical', 'disease', 'treatment', 'hospital', 'doctor', 'medicine',
    'בריאות', 'רפואי', 'מחלה', 'טיפול', 'בית חולים', 'רופא', 'תרופה'
  ];
  
  // Society keywords
  const societyKeywords = [
    'society', 'social', 'community', 'culture', 'people', 'human', 'relationship',
    'חברה', 'חברתי', 'קהילה', 'תרבות', 'אנשים', 'אנושי', 'יחסים'
  ];
  
  // Education keywords
  const educationKeywords = [
    'education', 'school', 'student', 'teacher', 'learning', 'university', 'academic',
    'חינוך', 'בית ספר', 'תלמיד', 'מורה', 'למידה', 'אוניברסיטה', 'אקדמי'
  ];
  
  // Environment keywords
  const environmentKeywords = [
    'environment', 'climate', 'nature', 'pollution', 'green', 'sustainable', 'ecology',
    'סביבה', 'אקלים', 'טבע', 'זיהום', 'ירוק', 'בר קיימא', 'אקולוגיה'
  ];
  
  // History keywords
  const historyKeywords = [
    'history', 'historical', 'past', 'ancient', 'traditional', 'century', 'decade',
    'היסטוריה', 'היסטורי', 'עבר', 'עתיק', 'מסורתי', 'מאה', 'עשור'
  ];
    // Psychology keywords
  const psychologyKeywords = [
    'psychology', 'mental', 'behavior', 'mind', 'emotion', 'cognitive', 'brain',
    'פסיכולוגיה', 'נפשי', 'התנהגות', 'מוח', 'רגש', 'קוגניטיבי', 'מחשבה'
  ];

  const keywordMap = {
    technology: technologyKeywords,
    economics: economicsKeywords,
    engineering: engineeringKeywords,
    health: healthKeywords,
    society: societyKeywords,
    education: educationKeywords,
    environment: environmentKeywords,
    history: historyKeywords,
    psychology: psychologyKeywords
  };

  // Count matches for each subject
  const subjectScores: Record<GeneralSubject, number> = {
    technology: 0,
    economics: 0,
    engineering: 0,
    health: 0,
    society: 0,
    education: 0,
    environment: 0,
    history: 0,
    psychology: 0
  };

  Object.entries(keywordMap).forEach(([subject, keywords]) => {
    keywords.forEach(keyword => {
      if (textToAnalyze.includes(keyword)) {
        subjectScores[subject as GeneralSubject]++;
      }
    });
  });

  // Find the subject with the highest score
  const maxScore = Math.max(...Object.values(subjectScores));
  if (maxScore === 0) return null;

  const bestSubject = Object.entries(subjectScores).find(([_, score]) => score === maxScore)?.[0];
  return bestSubject as GeneralSubject | null;
};

/**
 * מחזיר את כל השאלות שמתאימות לנושא הנתון
 */
export const getQuestionsBySubject = (questions: Question[], subject: GeneralSubject): Question[] => {
  return questions.filter(question => {
    const identifiedSubject = identifyQuestionSubject(question);
    return identifiedSubject === subject;
  });
};

/**
 * מחזיר סטטיסטיקות על חלוקת השאלות לפי נושאים
 */
export const getSubjectStats = (questions: Question[]): Record<string, number> => {
  const stats: Record<string, number> = {};
  
  questions.forEach(question => {
    const subject = identifyQuestionSubject(question);
    if (subject) {
      stats[subject] = (stats[subject] || 0) + 1;
    } else {
      stats['unknown'] = (stats['unknown'] || 0) + 1;
    }
  });
  
  return stats;
};

/**
 * פונקציה פשוטה לסיווג נושא על בסיס טקסט ותואר
 * (לשימוש בבדיקות ולצרכים פשוטים)
 */
export const classifySubject = (text: string, title: string = ''): GeneralSubject | null => {
  const textToAnalyze = `${text} ${title}`.toLowerCase();
  
  // Technology keywords
  const technologyKeywords = [
    'technology', 'digital', 'computer', 'internet', 'online', 'software', 'platform', 'artificial intelligence', 'automation',
    'טכנולוגיה', 'דיגיטלי', 'מחשב', 'אינטרנט', 'תוכנה', 'פלטפורמה', 'רשת', 'בינה מלאכותית', 'רובוטיקה'
  ];
  
  // Economics keywords
  const economicsKeywords = [
    'economy', 'economic', 'money', 'business', 'market', 'financial', 'gig economy', 'היצע', 'ביקוש',
    'כלכלה', 'כלכלי', 'כסף', 'עסק', 'שוק', 'פיננסי', 'כלכלת הגיג', 'תעסוקה'
  ];
  
  // Health keywords
  const healthKeywords = [
    'health', 'medical', 'disease', 'treatment', 'hospital', 'doctor', 'medicine', 'healthcare',
    'בריאות', 'רפואי', 'מחלה', 'טיפול', 'בית חולים', 'רופא', 'תרופה', 'רפואה'
  ];
  
  // Education keywords
  const educationKeywords = [
    'education', 'school', 'student', 'teacher', 'learning', 'university', 'academic', 'courses',
    'חינוך', 'בית ספר', 'תלמיד', 'מורה', 'למידה', 'אוניברסיטה', 'אקדמי', 'לימודים'
  ];
  
  // Environment keywords
  const environmentKeywords = [
    'environment', 'climate', 'nature', 'pollution', 'green', 'sustainable', 'ecology', 'warming',
    'סביבה', 'אקלים', 'טבע', 'זיהום', 'ירוק', 'בר קיימא', 'אקולוגיה'
  ];

  const keywordSets = [
    { subject: 'technology', keywords: technologyKeywords },
    { subject: 'economics', keywords: economicsKeywords },
    { subject: 'health', keywords: healthKeywords },
    { subject: 'education', keywords: educationKeywords },
    { subject: 'environment', keywords: environmentKeywords }
  ];

  for (const { subject, keywords } of keywordSets) {
    if (keywords.some(keyword => textToAnalyze.includes(keyword))) {
      return subject as GeneralSubject;
    }
  }

  return null;
};
