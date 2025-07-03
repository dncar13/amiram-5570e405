
# מדריך סביבת הפיתוח - פלטפורמת אמירם

## פרטי הפרויקט

**שם הפרויקט**: Amiram Academy - פלטפורמת סימולציות לבחינת AMIRAM
**מטרה**: אתר תרגול וסימולציות לבחינת הכשרה באנגלית לדוברי עברית
**קהל יעד**: תלמידים דוברי עברית הנבחנים בבחינת AMIRAM

## מחסנית הטכנולוגיות

### Frontend
- **React 18** - ספריית JavaScript לבניית ממשק משתמש
- **TypeScript** - גרסה מוקלדת של JavaScript
- **Vite** - כלי בנייה ופיתוח מהיר
- **Tailwind CSS** - framework CSS עם תמיכה מלאה ב-RTL
- **Shadcn/UI** - רכיבי UI מוכנים
- **React Router** - ניתוב בצד הלקוח
- **Framer Motion** - אנימציות

### Backend & Database
- **Supabase** - BaaS עם PostgreSQL
- **Row Level Security (RLS)** - אבטחת נתונים ברמת השורה
- **Authentication** - מערכת אימות מובנית
- **Real-time subscriptions** - עדכונים בזמן אמת

### כלי פיתוח
- **ESLint** - בדיקת איכות קוד
- **Prettier** - עיצוב קוד אוטומטי
- **Git** - בקרת גרסאות
- **GitHub Actions** - CI/CD

## מבנה הפרויקט

```
src/
├── components/           # רכיבי React
│   ├── ui/              # רכיבי UI בסיסיים
│   ├── simulation/      # רכיבי סימולציה
│   ├── auth/           # רכיבי אימות
│   ├── admin/          # פאנל ניהול
│   └── ...
├── pages/              # דפי האתר
├── hooks/              # Custom React hooks
├── services/           # שירותי API ולוגיקה עסקית
├── data/               # נתוני השאלות והנושאים
├── types/              # הגדרות TypeScript
├── utils/              # פונקציות עזר
└── integrations/       # אינטגרציות חיצוניות
```

## מאפייני האתר

### שפות ותמיכה
- **עברית**: ממשק המשתמש העיקרי (RTL)
- **אנגלית**: תוכן השאלות והקטעים
- **תמיכה דו-לשונית**: מיקסים עברית ואנגלית באותו הדף

### סביבות עבודה באתר

#### 1. סימולציות מלאות
- **מיקום**: `/simulations`
- **תכונות**: 50 שאלות רנדומליות, דימוי בחינה מלא
- **זמן**: 90 דקות (כמו הבחינה האמיתית)

#### 2. תרגול לפי נושאים
- **מיקום**: `/topics`
- **תכונות**: 6 נושאים מקצועיים, תרגול ממוקד
- **מעקב**: התקדמות אישית לכל נושא

#### 3. בנק שאלות מלא
- **מיקום**: `/questions-sets`
- **תכונות**: 1000 שאלות ב-20 קבוצות של 50
- **ארגון**: קבוצות מסודרות לנוחות

#### 4. תרגול לפי סוג שאלה
- **השלמת משפטים**: `/simulation-by-type/sentence-completion`
- **ניסוח מחדש**: `/simulation-by-type/restatement`
- **הבנת הנקרא**: `/simulation-by-type/reading-comprehension`

#### 5. מערכת אדפטיבית
- **מיקום**: `/adaptive-simulation`
- **תכונות**: AI לבחירת שאלות, התאמה אישית
- **אלגוריתם**: מבוסס על ביצועים קודמים

### תכונות מתקדמות

#### מערכת משתמשים
```typescript
// סוגי משתמשים
type UserRole = 'guest' | 'registered' | 'premium' | 'admin';

// הרשאות לפי סוג משתמש
interface UserPermissions {
  canAccessPremiumContent: boolean;
  maxQuestionsPerDay: number;
  canSaveProgress: boolean;
  hasDetailedAnalytics: boolean;
}
```

#### מעקב התקדמות
- **LocalStorage**: שמירה מקומית
- **Supabase**: שמירה בענן (משתמשים רשומים)
- **אנליטיקה**: מעקב ביצועים מפורט

#### אבטחה
- **Row Level Security**: הגנה ברמת הנתונים
- **Authentication**: אימות מובנה
- **Input Validation**: בדיקת נתונים
- **XSS Protection**: הגנה מפני התקפות

## בדיקות (Testing)

### מבנה בדיקות קיים
```
tests/
├── specs/              # בדיקות E2E
│   ├── 01-basic.spec.ts
│   ├── 02-authentication.spec.ts
│   ├── 03-simulation.spec.ts
│   ├── 04-history.spec.ts
│   ├── 05-e2e.spec.ts
│   ├── 06-security.spec.ts
│   ├── 07-error-handling.spec.ts
│   ├── 08-visual-regression.spec.ts
│   └── 09-performance.spec.ts
├── pages/              # Page Object Model
├── helpers/            # פונקציות עזר לבדיקות
└── fixtures/           # נתוני בדיקה
```

### כלי בדיקות
- **Playwright** - בדיקות End-to-End
- **TypeScript** - בדיקות מוקלדות
- **Page Object Model** - ארגון בדיקות

### סוגי בדיקות נדרשות

#### 1. בדיקות בסיסיות
```bash
npm run test:smoke  # בדיקות עשן מהירות
```
- טעינת דפים
- ניווט בסיסי
- responsive design
- RTL layout

#### 2. בדיקות אימות
```bash
npm run test:auth
```
- התחברות/הרשמה
- OAuth (Google)
- הרשאות משתמש
- session management

#### 3. בדיקות סימולציה
```bash
npm run test:simulation
```
- התחלת סימולציה
- מעבר בין שאלות
- שמירת תשובות
- חישוב ציונים
- שמירת התקדמות

#### 4. בדיקות אבטחה
```bash
npm run test:security
```
- XSS protection
- SQL injection
- Rate limiting
- Input validation
- Authentication bypass

#### 5. בדיקות ביצועים
```bash
npm run test:performance
```
- Core Web Vitals
- Loading times
- Memory usage
- Network requests

#### 6. בדיקות ויזואליות
```bash
npm run test:visual
```
- Screenshot comparison
- Layout regression
- Cross-browser testing

## הגדרת סביבת פיתוח

### דרישות מערכת
- **Node.js**: גרסה 18 ומעלה
- **npm**: גרסה 8 ומעלה
- **Git**: לבקרת גרסאות

### התקנה ראשונית
```bash
# שכפול הפרויקט
git clone [repository-url]
cd amiram-academy

# התקנת dependencies
npm install

# הגדרת משתני סביבה
cp .env.example .env.local
# ערוך את הקובץ עם פרטי Supabase

# הרצת השרת לפיתוח
npm run dev
```

### משתני סביבה נדרשים
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# אופציונלי - לפיתוח
VITE_ENABLE_MOCK_DATA=true
VITE_DEBUG_MODE=true
```

### הרצת בדיקות
```bash
# התקנת Playwright (פעם ראשונה)
cd tests
npm install
npx playwright install --with-deps

# הרצת כל הבדיקות
npm test

# בדיקות ספציפיות
npm run test:smoke    # בדיקות מהירות
npm run test:auth     # בדיקות אימות
npm run test:visual   # בדיקות ויזואליות
npm run test:security # בדיקות אבטחה

# בדיקות עם GUI
npm run test:headed

# בדיקות debug
npm run test:debug
```

## נהלי עבודה

### Git Workflow
```bash
# יצירת branch חדש
git checkout -b feature/new-feature

# commit changes
git add .
git commit -m "feat: add new feature"

# push changes
git push origin feature/new-feature

# יצירת Pull Request
```

### Code Review
- **חובה**: PR review לפני merge
- **בדיקות**: חובה לוודא שכל הבדיקות עוברות
- **אבטחה**: בדיקת אבטחה לשינויים רגישים
- **Performance**: בדיקת ביצועים לשינויים גדולים

### Standards
- **TypeScript**: חובה לכל הקוד החדש
- **ESLint**: חובה לעמוד בכללי הקוד
- **Prettier**: עיצוב קוד אוטומטי
- **Tests**: חובה לכתוב בדיקות לפיצ'רים חדשים

## נושאים חשובים למתכנת חדש

### 1. RTL Support
```css
/* השתמש בכיוון לוגי במקום פיזי */
margin-inline-start: 1rem; /* במקום margin-left */
text-align: start; /* במקום text-align: left */
```

### 2. i18n Considerations
```typescript
// הפרד בין עברית לאנגלית
const hebrewText = "שאלה מספר";
const englishContent = question.text;
```

### 3. Performance
```typescript
// השתמש ב-lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// מנע re-renders מיותרים
const MemoizedComponent = memo(Component);
```

### 4. Security
```typescript
// תמיד validate input
const sanitizedInput = DOMPurify.sanitize(userInput);

// השתמש ב-RLS policies
const { data } = await supabase
  .from('questions')
  .select('*')
  .eq('user_id', user.id); // RLS יטפל בבדיקה
```

## פתרון בעיות נפוצות

### Build Errors
```bash
# נקה cache
rm -rf node_modules package-lock.json
npm install

# בדוק TypeScript errors
npm run type-check
```

### Test Failures
```bash
# נקה test results
npm run test:clean

# הרץ בדיקה ספציפית
npm test -- --grep "test name"

# update screenshots
npm run test:visual -- --update-snapshots
```

### Database Issues
```bash
# בדוק Supabase connection
npm run db:status

# reset local database
npm run db:reset
```

## משאבים נוספים

### תיעוד
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Playwright Testing](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

### כלים מועילים
- **VS Code Extensions**: 
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
- **Browser Extensions**:
  - React Developer Tools
  - Redux DevTools (if needed)

## יצירת קשר וסיוע

### בעיות טכניות
1. בדוק את הלוגים: `npm run dev` או `npm test`
2. חפש בתיעוד הפרויקט
3. בדוק בGitHub Issues
4. יצור issue חדש עם פרטים מלאים

### הוספת פיצ'רים חדשים
1. כתוב spec מפורט
2. יצור בדיקות לפני הקוד
3. מימש הפיצ'ר
4. וודא שכל הבדיקות עוברות
5. יצור PR עם תיאור מפורט

---

**חשוב**: פרויקט זה מיועד לחינוך ויש להקפיד על איכות הקוד ואבטחה גבוהה כיוון שהוא משרת תלמידים הנבחנים בבחינה חשובה.
