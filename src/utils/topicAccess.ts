
/**
 * Unified premium system - All content is now premium by default
 */

/**
 * בודק אם נושא מסוים זמין (כל הנושאים זמינים כפרימיום)
 * @param topicId מזהה הנושא לבדיקה
 * @returns boolean תמיד true - הכל זמין
 */
export const isFreeTopic = (topicId: number): boolean => {
  return true; // כל הנושאים זמינים
};

/**
 * בודק אם למשתמש יש גישה לנושא מסוים (כל הנושאים זמינים)
 * @param topicId מזהה הנושא לבדיקה
 * @param isPremium לא רלוונטי - הכל פרימיום
 * @param isAdmin לא רלוונטי - הכל פרימיום
 * @returns boolean תמיד true - כל הנושאים זמינים
 */
export const checkTopicAccess = (topicId: number, isPremium: boolean, isAdmin: boolean): boolean => {
  return true; // כל הנושאים זמינים לכולם
};

/**
 * מחזיר רשימה של כל מזהי הנושאים (הכל זמין)
 * @returns number[] רשימת כל מזהי הנושאים
 */
export const getFreeTopicIds = (): number[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // כל הנושאים זמינים
};

// All questions and content are available - unified premium system
export const ALL_QUESTIONS_AVAILABLE = true;

