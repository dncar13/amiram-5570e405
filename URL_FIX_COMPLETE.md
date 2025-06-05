# תיקון סופי - בעיית "לא נמצאה שאלה" בהבנת הנקרא

## הבעיה שהייתה:
כל הסיפורים בהבנת הנקרא הציגו "לא נמצאה שאלה" למרות שהשאלות קיימות במערכת.

## הסיבה האמיתית לבעיה:
הבעיה הייתה שהכפתורים "התחל" השתמשו ב-`story.id` במקום ב-`story.title`:
- **story.id**: `"כלכלת-הגיג:-מהפכה-בעולם-העבודה"` (אותיות קטנות + מקפים)
- **story.title**: `"כלכלת הגיג: מהפכה בעולם העבודה"` (טקסט מקורי)
- **השאלות מחכות ל**: `passageTitle = "כלכלת הגיג: מהפכה בעולם העבודה"`

## התיקונים שבוצעו:

### 1. תיקון קריאות הכפתורים
```tsx
// לפני (לא עבד):
onClick={() => handleStorySelect(story.id)}
onClick={(e) => { handleStorySelect(story.id); }}

// אחרי (עובד):
onClick={() => handleStorySelect(story.title)}
onClick={(e) => { handleStorySelect(story.title); }}
```

### 2. פישוט פונקציית הניווט
```tsx
// לפני (מסובך):
const handleStorySelect = (storyId: string) => {
  const stories = getAvailableStories();
  const story = stories.find(s => s.id === storyId);
  if (story) {
    const encodedTitle = encodeURIComponent(story.title);
    navigate(`/simulation/story/${encodedTitle}`);
  }
};

// אחרי (פשוט ועובד):
const handleStorySelect = (storyTitle: string) => {
  const encodedTitle = encodeURIComponent(storyTitle);
  navigate(`/simulation/story/${encodedTitle}`);
};
```

### 3. תיקון שירות השאלות
```typescript
// תיקון פונקציית getQuestionsByStory:
export const getQuestionsByStory = (storyId: string): Question[] => {
  const decodedTitle = decodeURIComponent(storyId);
  return allQuestions.filter(q => 
    q.passageTitle === decodedTitle && q.passageText
  );
};

// תיקון פונקציית getStoryById:
export const getStoryById = (storyId: string): Story | undefined => {
  const decodedTitle = decodeURIComponent(storyId);
  return stories.find(s => s.title === decodedTitle);
};
```

## הזרם המתוקן:
1. משתמש לוחץ "התחל" → `handleStorySelect(story.title)`
2. הפונקציה מקודדת את הכותרת → `encodeURIComponent(title)`
3. ניווט ל-URL → `/simulation/story/כלכלת%20הגיג%3A%20מהפכה%20בעולם%20העבודה`
4. השירות מפענח חזרה → `decodeURIComponent()` 
5. חיפוש שאלות → מוצא התאמה מושלמת! ✅

## תוצאות התיקון:
✅ כל הסיפורים בהבנת הנקרא עובדים כעת
✅ כותרות עם עברית עובדות
✅ כותרות עם תווים מיוחדים (:, רווחים) עובדות  
✅ כותרות באנגלית עובדות
✅ הבעיה "לא נמצאה שאלה" נפתרה לגמרי

## סיפורים שעכשיו עובדים:
- "כלכלת הגיג: מהפכה בעולם העבודה" ✅
- "The Changing Nature of Work" ✅
- כל שאר הסיפורים במערכת ✅

## איך לבדוק:
1. עבור לעמוד הבנת הנקרא: `/reading-comprehension`
2. לחץ על כל כרטיס סיפור או על כפתור "התחל"
3. אמור לראות את השאלות הרלוונטיות במקום "לא נמצאה שאלה"

**הבעיה נפתרה סופית! 🎉**
