
# Amiram Academy - בדיקות אוטומטיות עם Playwright

## סקירה כללית
מערכת בדיקות אוטומטיות מקיפה לאתר Amiram Academy, הכוללת:
- בדיקות בסיסיות ביצועים
- בדיקות Authentication (הרשמה/התחברות)
- בדיקות מערכת הסימולציה
- בדיקות עמוד ההיסטוריה
- בדיקות End-to-End מלאות

## התקנה והרצה

### התקנת תלויות
```bash
cd tests
npm install
```

### התקנת דפדפנים
```bash
npx playwright install
```

### הרצת הבדיקות

#### כל הבדיקות
```bash
npm test
```

#### בדיקות עם UI אינטראקטיבי
```bash
npm run test:ui
```

#### בדיקות עם ראש (headed mode)
```bash
npm run test:headed
```

#### בדיקות לדיבוג
```bash
npm run test:debug
```

#### בדיקות בדפדפן ספציפי
```bash
npm run test:chrome   # Chrome בלבד
npm run test:firefox  # Firefox בלבד
npm run test:safari   # Safari בלבד
npm run test:mobile   # Mobile Chrome
```

#### דוח תוצאות
```bash
npm run report
```

## מבנה הבדיקות

### Page Object Model
```
tests/
├── pages/
│   ├── BasePage.ts          # פונקציונליות בסיסית משותפת
│   ├── HomePage.ts          # דף הבית
│   ├── LoginPage.ts         # דף התחברות
│   ├── SignupPage.ts        # דף הרשמה
│   ├── SimulationPage.ts    # דף סימולציה
│   ├── ResultsPage.ts       # דף תוצאות
│   └── HistoryPage.ts       # דף היסטוריה
├── utils/
│   └── testData.ts          # נתונים לבדיקות
└── specs/
    ├── 01-basic.spec.ts     # בדיקות בסיסיות
    ├── 02-authentication.spec.ts  # בדיקות אימות
    ├── 03-simulation.spec.ts      # בדיקות סימולציה
    ├── 04-history.spec.ts         # בדיקות היסטוריה
    └── 05-e2e.spec.ts            # בדיקות מלאות
```

## תצורה

### משתני סביבה
```bash
# .env
BASE_URL=https://amiram.net  # או http://localhost:5173 לפיתוח
```

### התאמת נתוני בדיקה
ערוך את `tests/utils/testData.ts`:
```typescript
export const TestUsers = {
  validUser: {
    email: 'your-test-user@example.com',
    password: 'YourTestPassword123!'
  }
  // ...
};
```

## סוגי בדיקות

### 1. בדיקות בסיסיות (01-basic.spec.ts)
- ✅ טעינת דף הבית
- ✅ בדיקת ביצועים
- ✅ בדיקת Responsive Design
- ✅ בדיקת ניווט
- ✅ בדיקת SEO Meta Tags
- ✅ בדיקת נגישות

### 2. בדיקות Authentication (02-authentication.spec.ts)
- ✅ התחברות מוצלחת
- ✅ התחברות עם פרטים שגויים
- ✅ הרשמת משתמש חדש
- ✅ בדיקת ולידציות
- ✅ שכחת סיסמה
- ✅ Flow מלא הרשמה→התחברות→התנתקות

### 3. בדיקות סימולציה (03-simulation.spec.ts)
- ✅ כניסה לסימולציה
- ✅ התחלת סימולציה מלאה/תרגול
- ✅ מענה על שאלות וניווט
- ✅ שמירת שאלות
- ✅ סיום סימולציה וקבלת תוצאות
- ✅ בדיקת טיימר
- ✅ בדיקת הסברים

### 4. בדיקות היסטוריה (04-history.spec.ts)
- ✅ טעינת עמוד היסטוריה
- ✅ בדיקת סטטיסטיקות
- ✅ מעבר בין טאבים
- ✅ צפיה בסימולציות קוד
- ✅ ניהול שאלות שמורות
- ✅ חזרה על סימולציות

### 5. בדיקות E2E (05-e2e.spec.ts)
- ✅ Flow מלא הרשמה עד התנתקות
- ✅ Flow סימולציה עם שמירת שאלות
- ✅ התאוששות מסימולציה שנשמרה

## טיפים לשימוש

### הרצת בדיקה ספציפית
```bash
npx playwright test tests/specs/01-basic.spec.ts
```

### הרצת בדיקה ספציפית במצב debug
```bash
npx playwright test tests/specs/02-authentication.spec.ts --debug
```

### הרצה במצב headless עם screenshot בכשל
```bash
npx playwright test --screenshot=only-on-failure
```

### צפיה בדוח HTML
```bash
npx playwright show-report
```

## התאמות נדרשות

### 1. עדכן Selectors
בדוק את הקבצים ב `tests/pages/` ועדכן את ה-selectors בהתאם לקוד האמיתי:
```typescript
// דוגמה - עדכן את זה בהתאם לקוד שלך
get loginButton() { 
  return this.page.locator('button:has-text("התחבר")'); 
}
```

### 2. התאם הודעות שגיאה
עדכן את ההודעות הצפויות ב `testData.ts`:
```typescript
texts: {
  loginError: ['הודעת השגיאה האמיתית מSupabase'],
  // ...
}
```

### 3. הוסף נתוני Test
יצור משתמשי בדיקה ב-Supabase וכתוב:
```typescript
export const TestUsers = {
  validUser: {
    email: 'משתמש-אמיתי@domain.com',
    password: 'SomeRealPassword123!'
  }
};
```

## דיבוג ופתרון בעיות

### צפיה בבדיקות בזמן אמת
```bash
npm run test:headed
```

### הרצה איטית לצפיה
```bash
npx playwright test --headed --slowMo=1000
```

### שמירת וידאו של כל הבדיקות
```bash
npx playwright test --video=on
```

---

**הערה חשובה**: יש להתאים את כל הקוד לQA הספציפי של האתר שלך - URLs, selectors, הודעות שגיאה, ונתוני בדיקה.
