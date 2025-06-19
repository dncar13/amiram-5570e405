
# Amiram Academy E2E Test Suite

מערכת בדיקות End-to-End מקיפה לפלטפורמת Amiram Academy, הבנויה עם Playwright ו-TypeScript.

## 🎯 מה המערכת כוללת

### בדיקות עיקריות
- **בדיקות בסיסיות** - טעינת דפים, responsive design, ניווט
- **בדיקות Authentication** - התחברות, הרשמה, התנתקות
- **בדיקות סימולציה** - תרגול, בחינות מלאות, שמירת שאלות
- **בדיקות היסטוריה** - תוצאות קודמות, שאלות שמורות
- **בדיקות E2E מלאות** - זרימות משתמש שלמות

### בדיקות מתקדמות
- **בדיקות אבטחה** - XSS, SQL Injection, Rate Limiting
- **בדיקות Error Handling** - טיפול בשגיאות רשת וAPI
- **Visual Regression Tests** - בדיקת שינויים בממשק
- **בדיקות ביצועים** - Core Web Vitals, זמני טעינה, זיכרון

## 🚀 התחלה מהירה

### התקנה ראשונית
```bash
# מעבר לתיקיית הבדיקות
cd tests

# הרצת סקריפט ההתקנה
chmod +x scripts/initial-setup.sh
./scripts/initial-setup.sh
```

### הרצת בדיקות
```bash
# כל הבדיקות
npm test

# בדיקות עשן (מהירות)
npm run test:smoke

# בדיקות אבטחה
npm run test:security

# בדיקות ביצועים
npm run test:performance

# בדיקות ויזואליות
npm run test:visual

# בדיקות עם GUI
npm run test:headed

# בדיקות במצב debug
npm run test:debug
```

### הרצה על דפדפנים ספציפיים
```bash
# Chrome בלבד
npm run test:chrome

# Firefox בלבד
npm run test:firefox

# Safari בלבד
npm run test:safari

# מובייל
npm run test:mobile

# דסקטופ
npm run test:desktop
```

## 📊 דוחות ותוצאות

### דוחות זמינים
- **test-summary.html** - דוח ויזואלי בעברית
- **test-summary.json** - נתונים מובנים לניתוח
- **playwright-report/** - דוח Playwright מפורט
- **test-results/** - צילומי מסך ווידאו של כשלים

### צפיה בדוחות
```bash
# פתיחת דוח Playwright
npm run report

# צפיה בדוח מותאם אישית
open test-summary.html
```

## 🏗️ מבנה הפרויקט

```
tests/
├── specs/                 # קבצי בדיקות
│   ├── 01-basic.spec.ts
│   ├── 02-authentication.spec.ts
│   ├── 03-simulation.spec.ts
│   ├── 04-history.spec.ts
│   ├── 05-e2e.spec.ts
│   ├── 06-security.spec.ts
│   ├── 07-error-handling.spec.ts
│   ├── 08-visual-regression.spec.ts
│   └── 09-performance.spec.ts
│
├── pages/                 # Page Object Model
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── SimulationPage.ts
│   ├── ResultsPage.ts
│   └── HistoryPage.ts
│
├── helpers/               # פונקציות עזר
│   └── testHelpers.ts
│
├── config/                # הגדרות
│   └── testConfig.ts
│
├── fixtures/              # Fixtures ל-Playwright
│   └── testFixtures.ts
│
├── reporters/             # דוחות מותאמים אישית
│   └── customReporter.ts
│
├── utils/                 # כלי עזר
│   └── testData.ts
│
├── scripts/               # סקריפטים
│   ├── initial-setup.sh
│   └── coverage-report.js
│
└── screenshots/           # צילומי מסך לבדיקות ויזואליות
```

## ⚙️ הגדרות מתקדמות

### משתני סביבה
יצירת קובץ `.env` בתיקיית `tests/`:
```env
BASE_URL=http://localhost:5173
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Test@1234!
PREMIUM_USER_EMAIL=premium@example.com
PREMIUM_USER_PASSWORD=Premium@1234!
```

### Playwright Config
הקובץ `playwright.config.ts` מוגדר עם:
- דפדפנים: Chrome, Firefox, Safari
- מכשירים: Desktop, Mobile, Tablet
- דוחות: HTML, JSON, XML, Custom
- Visual regression
- בדיקות ביצועים

## 🔧 פיתוח וכתיבת בדיקות חדשות

### Page Object Pattern
```typescript
// דוגמה לעמוד חדש
export class NewPage extends BasePage {
  readonly url = '/new-page';
  
  get submitButton() { return this.page.locator('button[type="submit"]'); }
  
  async goto() {
    await this.navigateTo(this.url);
  }
  
  async submitForm() {
    await this.submitButton.click();
  }
}
```

### כתיבת בדיקה חדשה
```typescript
import { test, expect } from '@playwright/test';
import { NewPage } from '../pages/NewPage';

test.describe('בדיקות עמוד חדש', () => {
  test('בדיקה בסיסית', async ({ page }) => {
    const newPage = new NewPage(page);
    await newPage.goto();
    await newPage.submitForm();
    // הוסף בדיקות...
  });
});
```

## 🏷️ תגיות לבדיקות

השתמש בתגיות לארגון הבדיקות:
```typescript
test('@smoke @critical התחברות מוצלחת', async () => {
  // בדיקה קריטית
});

test('@slow @performance בדיקת ביצועים', async () => {
  // בדיקה איטית
});
```

הרצה לפי תגיות:
```bash
npm test -- --grep "@smoke"
npm test -- --grep "@critical"
```

## 🚨 פתרון בעיות נפוצות

### בדיקות נכשלות
1. בדוק שהאתר רץ על `localhost:5173`
2. וודא שמשתני הסביבה מוגדרים נכון
3. הרץ `npm run clean` לניקיון קבצים זמניים

### בעיות Visual Regression
```bash
# עדכון baseline screenshots
npm run test:visual -- --update-snapshots
```

### בעיות ביצועים
1. בדוק חיבור אינטרנט
2. סגור יישומים אחרים
3. הרץ בדיקות בודדות עם `--headed`

## 📈 CI/CD Integration

הפרויקט כולל GitHub Actions workflow:
- הרצה אוטומטית על push/PR
- בדיקות על מספר דפדפנים
- שמירת artifacts
- דוחות אוטומטיים

## 🤝 תרומה

1. הוסף בדיקות חדשות בתיקיית `specs/`
2. צור Page Objects בתיקיית `pages/`
3. הוסף helpers בתיקיית `helpers/`
4. עדכן תיעוד ב-README

## 📞 תמיכה

לבעיות ושאלות:
1. בדוק את הדוחות ב-`test-results/`
2. הרץ עם `--debug` לחקירה מעמיקה
3. צור issue ב-GitHub

---

**Built with ❤️ for Amiram Academy**
