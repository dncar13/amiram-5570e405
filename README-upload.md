# 🚀 מדריך העלאת שאלות ל-Supabase

## שלבים להפעלה:

### 1. הכן את הסביבה
```bash
# התקן את ספריית Supabase
npm install @supabase/supabase-js
```

### 2. קבל את ה-Service Role Key

1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. בחר את הפרויקט שלך
3. לך ל-Settings > API
4. העתק את ה-**Service Role Key** (לא את הAnon key!)

### 3. עדכן את הסקריפט

פתח את הקובץ `upload-questions-script.js` ותחליף:
```javascript
const SUPABASE_URL = 'https://llyunioulzfbgqvmeaxq.supabase.co';  // ✅ כבר מוגדר נכון!
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc'; 
```

**✅ הכל מוכן!** ה-Service Role Key כבר מוגדר נכון בסקריפט.

### 4. הרץ את הסקריפט

```bash
node upload-questions-script.js
```

## מה הסקריפט עושה?

✅ **בודק חיבור** - מוודא שהחיבור ל-Supabase תקין

✅ **מזהה שאלות קיימות** - נמנע מהעלאת כפילויות

✅ **מעלה שאלות חדשות** - רק שאלות שלא קיימות

✅ **מדווח התקדמות** - מציג סטטוס לכל שאלה

## תוצאה צפויה:

```
🎯 מתחיל תהליך העלאת שאלות הבנת הנקרא ל-Supabase
============================================================
🔍 בודק חיבור ל-Supabase...
✅ חיבור ל-Supabase תקין!
📋 נמצאו 15 שאלות הבנת הנקרא קיימות: 1,2,3,4,26,27,1001,1002,1003,1004

📊 סיכום שאלות להעלאה:
- Gig Economy: 6 שאלות חדשות
- Environment: 13 שאלות חדשות  
- Technology: 16 שאלות חדשות
- סה"כ: 35 שאלות חדשות

🚀 מתחיל להעלות 6 שאלות מקטגוריה: Gig Economy
✅ נוספה שאלה 5: According to the text, what financial burden...
✅ נוספה שאלה 6: What does the text suggest has happened to...
...

============================================================
🎉 סיכום סופי:
✅ הועלו בהצלחה: 35 שאלות
❌ שגיאות: 0 שאלות
📈 אחוז הצלחה: 100%

🚀 השאלות הועלו בהצלחה! המערכת תציג עכשיו מספר שאלות מעודכן.
```

## פתרון בעיות נפוצות:

❌ **שגיאת חיבור**: בדוק שה-Service Role Key נכון

❌ **שגיאת הרשאות**: ודא שאתה משתמש ב-Service Role ולא ב-Anon key

❌ **שאלות לא נשמרות**: בדוק שהטבלה 'questions' קיימת ב-Supabase

## יתרונות הגישה הזו:

🔥 **אוטומציה מלאה** - העלאה של עשרות שאלות בלחיצה אחת

🧠 **חכם** - נמנע מכפילויות ושגיאות

⚡ **מהיר** - עובד עם Supabase API ישירות

🔍 **שקוף** - מדווח על כל שאלה ושגיאה