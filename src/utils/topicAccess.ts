
/**
 * Utility functions for checking topic access permissions
 */

// רשימת נושאים שזמינים לכולם (חינמיים)
const FREE_TOPIC_IDS = [1]; // נושא 1 הוא חינמי

/**
 * בודק אם נושא מסוים זמין בחינם (לכל המשתמשים)
 * @param topicId מזהה הנושא לבדיקה
 * @returns boolean האם הנושא חינמי
 */
export const isFreeTopic = (topicId: number): boolean => {
  return FREE_TOPIC_IDS.includes(topicId);
};

/**
 * בודק אם למשתמש יש גישה לנושא מסוים בהתבסס על סטטוס הפרימיום שלו
 * @param topicId מזהה הנושא לבדיקה
 * @param isPremium האם המשתמש הוא משתמש פרימיום
 * @param isAdmin האם המשתמש הוא מנהל
 * @returns boolean האם למשתמש יש גישה
 */
export const checkTopicAccess = (topicId: number, isPremium: boolean, isAdmin: boolean): boolean => {
  // מנהלים ומשתמשי פרימיום יכולים לגשת לכל הנושאים
  if (isPremium || isAdmin) {
    return true;
  }
  
  // משתמשים אחרים יכולים לגשת רק לנושאים חינמיים
  return isFreeTopic(topicId);
};

/**
 * מחזיר רשימה של מזהי נושאים שזמינים למשתמשים רגילים (לא פרימיום)
 * @returns number[] רשימת מזהי נושאים חינמיים
 */
export const getFreeTopicIds = (): number[] => {
  return [...FREE_TOPIC_IDS];
};

// Flag to enable showing all questions in simulations regardless of topic ID
export const ALL_QUESTIONS_AVAILABLE = false;

