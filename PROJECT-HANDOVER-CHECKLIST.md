
# רשימת העברה למתכנת חדש - פלטפורמת אמירם

## מידע כללי על הפרויקט

### 📋 פרטים בסיסיים
- **שם**: Amiram Academy
- **מטרה**: פלטפורמת תרגול לבחינת AMIRAM באנגלית
- **טכנולוגיות**: React + TypeScript + Supabase
- **קהל יעד**: דוברי עברית הנבחנים בבחינת כשירות באנגלית

### 🔑 גישות נדרשות
- [ ] גישה ל-GitHub Repository
- [ ] גישה ל-Supabase Dashboard
- [ ] גישה ל-Deployment Platform (Netlify/Vercel)
- [ ] משתני סביבה (.env files)
- [ ] תיעוד API Keys

## התקנה ראשונית

### 💻 דרישות מערכת
- [ ] Node.js 18+
- [ ] npm 8+
- [ ] Git
- [ ] VS Code (מומלץ)

### 📦 התקנת הפרויקט
```bash
# 1. שכפול הפרויקט
git clone [repository-url]
cd amiram-academy

# 2. התקנת dependencies
npm install

# 3. הגדרת משתני סביבה
cp .env.example .env.local
# ערוך את הקובץ עם הפרטים הנכונים

# 4. הרצת הפרויקט
npm run dev
```

### 🔧 הגדרות VS Code מומלצות
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## הבנת המבנה

### 📁 מבנה תיקיות עיקרי
```
src/
├── components/     # כל רכיבי React
├── pages/         # דפי האתר
├── hooks/         # Custom hooks
├── services/      # לוגיקה עסקית ו-API
├── data/          # נתוני השאלות
├── types/         # הגדרות TypeScript
└── utils/         # פונקציות עזר
```

### 🧩 רכיבים מרכזיים
- **SimulationContent**: הרכיב המרכזי לסימולציות
- **QuestionCard**: הצגת שאלות
- **AuthContext**: ניהול משתמשים
- **QuestionDeliveryService**: אלגוריתם בחירת שאלות

## נושאים טכניים חשובים

### 🌐 תמיכה רב-לשונית
- **עברית**: ממשק המשתמש (RTL)
- **אנגלית**: תוכן השאלות (LTR)
- **Tailwind**: תמיכה מלאה ב-RTL
- **כלל זהב**: אף פעם לא לערבב עברית ואנגלית באותו רכיב

### 🔒 אבטחה
- **Supabase RLS**: Row Level Security מוגדר
- **Input Validation**: כל הקלטי משתמש מסוננים
- **XSS Protection**: הגנה מפני התקפות
- **Authentication**: מערכת אימות מובנית

### 📊 ניהול מצב (State Management)
```typescript
// Local State - React useState/useReducer
const [questions, setQuestions] = useState([]);

// Global State - React Context
const { currentUser } = useAuth();

// Server State - Supabase
const { data } = await supabase.from('questions').select('*');

// Client Storage - localStorage
localStorage.setItem('progress', JSON.stringify(progress));
```

## מערכת הבדיקות

### 🧪 סוגי בדיקות
1. **Unit Tests**: פונקציות בודדות
2. **Integration Tests**: רכיבים משולבים
3. **E2E Tests**: זרימות משתמש שלמות
4. **Visual Tests**: בדיקות ממשק
5. **Performance Tests**: מהירות וזיכרון

### 🏃‍♂️ הרצת בדיקות
```bash
# בדיקות בסיסיות (מהיר)
npm run test:smoke

# בדיקות מלאות
npm run test:all

# בדיקות ספציפיות
npm run test:auth
npm run test:simulation
npm run test:security
```

### ✅ מתי לכתוב בדיקות
- **תמיד**: פיצ'רים חדשים
- **תמיד**: תיקוני באגים
- **מומלץ**: רפקטורינג משמעותי
- **חובה**: שינויים באבטחה

## זרימות עבודה עיקריות

### 👤 זרימת משתמש
1. **התחברות/הרשמה**
2. **בחירת סוג תרגול**
3. **ביצוע סימולציה**
4. **קבלת תוצאות**
5. **מעקב התקדמות**

### 🔄 זרימת פיתוח
1. **יצירת branch חדש**
2. **כתיבת בדיקות**
3. **מימוש הפיצ'ר**
4. **הרצת בדיקות**
5. **יצירת Pull Request**
6. **Code Review**
7. **Merge למק**

## בעיות נפוצות ופתרונות

### 🚨 בעיות נפוצות
1. **Build fails**: בדוק TypeScript errors
2. **Tests fail**: נקה cache, עדכן snapshots
3. **RTL broken**: השתמש בכיוון לוגי
4. **Supabase errors**: בדוק RLS policies
5. **Performance issues**: בדוק re-renders

### 🔧 פקודות שימושיות
```bash
# נקה cache
rm -rf node_modules package-lock.json && npm install

# בדוק TypeScript
npm run type-check

# עדכן dependencies
npm update

# בדוק אבטחה
npm audit

# יצא build
npm run build
```

## קבצים חשובים שאסור לגעת בהם

### ⚠️ קבצים מוגנים
- `src/integrations/supabase/types.ts` - נוצר אוטומטית
- `package-lock.json` - נוצר אוטומטית
- `.env.production` - הגדרות production
- `supabase/migrations/` - מיגרציות DB

### 📝 קבצים שדורשים זהירות
- `src/data/questions/` - נתוני השאלות
- `src/services/adaptiveQuestions/` - אלגוריתמים מורכבים
- `src/context/AuthContext.tsx` - ניהול משתמשים
- `playwright.config.ts` - הגדרות בדיקות

## משימות ראשונות למתכנת חדש

### 🎯 יום ראשון
- [ ] הקמת סביבת פיתוח
- [ ] הרצת הפרויקט מקומית
- [ ] הרצת בדיקות בסיסיות
- [ ] קריאת התיעוד הזה
- [ ] סקירת הקוד הקיים

### 🎯 שבוע ראשון
- [ ] הבנת זרימת הסימולציה
- [ ] כתיבת בדיקה קטנה
- [ ] תיקון באג קטן
- [ ] הוספת פיצ'ר קטן
- [ ] קריאת הקוד המרכזי

### 🎯 חודש ראשון
- [ ] הבנה מלאה של המערכת
- [ ] עבודה עצמאית על פיצ'רים
- [ ] כתיבת בדיקות מורכבות
- [ ] אופטימיזציה של ביצועים
- [ ] תרומה לתיעוד

## אנשי קשר וסיוע

### 📞 למי לפנות
- **בעיות טכניות**: בדוק GitHub Issues קודם
- **שאלות עיצוב**: בדוק Figma/Design System
- **בעיות Supabase**: בדוק Dashboard + Logs
- **בעיות בדיקות**: בדוק Playwright traces

### 📚 משאבים נוספים
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright](https://playwright.dev)

## מדדי הצלחה

### 📈 מטרות קצרות טווח (שבוע-חודש)
- הפרויקט רץ בסביבה המקומית
- הבנה בסיסית של הקוד
- יכולת לכתוב בדיקות פשוטות
- יכולת לתקן באגים קטנים

### 📈 מטרות ארוכות טווח (חודש-רבעון)
- עבודה עצמאית על פיצ'רים חדשים
- הבנה מעמיקה של הארכיטקטורה
- יכולת לבצע אופטימיזציות
- הובלת פרויקטים גדולים

---

## ✅ Checklist סיום העברה

### המתכנת החדש מסוגל:
- [ ] להריץ את הפרויקט מקומית
- [ ] להריץ כל סוגי הבדיקות
- [ ] להבין את זרימת הסימולציה
- [ ] לכתוב בדיקה חדשה
- [ ] לתקן באג קטן
- [ ] להוסיף פיצ'ר קטן
- [ ] להבין את מבנה הנתונים
- [ ] לעבוד עם Supabase
- [ ] להבין את מערכת האבטחה
- [ ] לעבוד עם Git/GitHub

### המתכנת יודע איפה למצוא:
- [ ] תיעוד טכני
- [ ] נתוני השאלות
- [ ] הגדרות בדיקות
- [ ] לוגים ושגיאות
- [ ] משתני סביבה
- [ ] הגדרות deploy

**🎉 ברוכים הבאים לצוות!**

זכור: המטרה היא לעזור לתלמידים להצליח בבחינה החשובה הזו. כל קוד שאתה כותב משפיע על ההצלחה שלהם!
