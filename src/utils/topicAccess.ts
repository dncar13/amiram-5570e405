
/**
 * Utility functions for checking topic access permissions
 */

// כל הנושאים זמינים לכולם (נושאים חינמיים)
const FREE_TOPIC_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // כל הנושאים פתוחים

/**
 * בודק אם נושא מסוים זמין בחינם (לכל המשתמשים)
 * @param topicId מזהה הנושא לבדיקה
 * @returns boolean האם הנושא חינמי
 */
export const isFreeTopic = (topicId: number): boolean => {
  return true; // כל הנושאים חינמיים עכשיו
};

/**
 * בודק אם למשתמש יש גישה לנושא מסוים בהתבסס על סטטוס הפרימיום שלו
 * @param topicId מזהה הנושא לבדיקה
 * @param isPremium האם המשתמש הוא משתמש פרימיום
 * @param isAdmin האם המשתמש הוא מנהל
 * @returns boolean האם למשתמש יש גישה
 */
export const checkTopicAccess = (topicId: number, isPremium: boolean, isAdmin: boolean): boolean => {
  // כל הנושאים זמינים לכולם
  return true;
};

/**
 * מחזיר רשימה של מזהי נושאים שזמינים למשתמשים רגילים (לא פרימיום)
 * @returns number[] רשימת מזהי נושאים חינמיים
 */
export const getFreeTopicIds = (): number[] => {
  return [...FREE_TOPIC_IDS];
};

// Flag to enable showing all questions in simulations regardless of topic ID
export const ALL_QUESTIONS_AVAILABLE = true; // הפעלתי גישה לכל השאלות

