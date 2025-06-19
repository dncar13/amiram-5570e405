
# Amiram Academy - E2E Testing Suite

מערכת בדיקות מקיפה ומתקדמת לאתר Amiram Academy עם Playwright.

## 🚀 התקנה מהירה

```bash
cd tests
npm install
npx playwright install --with-deps
```

## 🏃‍♂️ הרצת בדיקות

### בדיקות בסיסיות
```bash
npm test                    # כל הבדיקות
npm run test:headed         # עם GUI
npm run test:debug          # מצב debug
npm run test:ui             # Playwright UI
```

### בדיקות ספציפיות
```bash
npm run test:security       # בדיקות אבטחה
npm run test:performance    # בדיקות ביצועים  
npm run test:visual         # בדיקות visual regression
npm run test:smoke          # בדיקות עשן
npm run test:critical       # בדיקות קריטיות
```

### בדיקות לפי מכשיר
```bash
npm run test:mobile         # מובייל בלבד
npm run test:desktop        # דסקטופ בלבד
```

### דוחות
```bash
npm run report              # פתיחת דוח HTML
```

## 📁 מבנה התיקיות

```
tests/
├── specs/                  # קבצי הבדיקות
│   ├── 01-basic.spec.ts           # בדיקות בסיסיות
│   ├── 02-authentication.spec.ts  # התחברות והרשמה
│   ├── 03-simulation.spec.ts      # מערכת סימולציה
│   ├── 04-history.spec.ts         # היסטוריה והתקדמות
│   ├── 05-e2e.spec.ts            # End-to-End flows
│   ├── 06-security.spec.ts        # 🔒 בדיקות אבטחה
│   ├── 07-error-handling.spec.ts  # טיפול בשגיאות
│   ├── 08-visual-regression.spec.ts # בדיקות visual
│   └── 09-performance.spec.ts     # 🚀 בדיקות ביצועים
├── pages/                  # Page Object Model
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SimulationPage.ts
│   └── ...
├── utils/                  # כלי עזר
│   └── testData.ts
├── helpers/                # פונקציות עזר
│   └── testHelpers.ts
├── config/                 # הגדרות
│   └── testConfig.ts
├── fixtures/               # Fixtures מותאמים
│   └── testFixtures.ts
├── reporters/              # דוחות מותאמים
│   └── customReporter.ts
└── playwright.config.ts    # הגדרות Playwright
```

## 🔒 בדיקות אבטחה

### מה נבדק:
- **XSS Protection** - הגנה מפני Cross-Site Scripting
- **SQL Injection** - הגנה מפני SQL Injection  
- **Rate Limiting** - הגנה מפני Brute Force
- **Input Validation** - אימות קלטים
- **Session Management** - ניהול sessions

### הרצה:
```bash
npm run test:security
```

## 🚀 בדיקות ביצועים

### מה נמדד:
- **Core Web Vitals** - LCP, FID, CLS
- **Load Times** - זמני טעינה
- **Memory Usage** - שימוש בזיכרון
- **Network Performance** - ביצועי רשת
- **Question Transitions** - מעבר בין שאלות

### הרצה:
```bash
npm run test:performance
```

## 🎨 בדיקות Visual Regression

### מה נבדק:
- דפים עיקריים בגדלים שונים
- רכיבים מרכזיים
- מצבי שגיאה
- Hover ו-Focus states
- Cross-browser compatibility

### הרצה:
```bash
npm run test:visual
```

## 🛠️ תכונות מתקדמות

### Fixtures מותאמים
```typescript
import { test } from './fixtures/testFixtures';

test('בדיקה עם משתמש מחובר', async ({ authenticatedPage }) => {
  // המש××תמש כבר מחובר
});

test('בדיקה עם סימולציה פעילה', async ({ simulationInProgress }) => {
  // סימולציה כבר רצה
});
```

### Helper Functions
```typescript
import { TestHelpers } from './helpers/testHelpers';

// Mock API responses
await TestHelpers.mockAPIResponse(page, 'login', { success: true });

// מדידת ביצועים
const loadTime = await TestHelpers.measureLoadTime(page, '/');

// בדיקת נגישות  
const issues = await TestHelpers.checkAccessibility(page);
```

### Test Data Generators
```typescript
import { generateTestData } from './helpers/testHelpers';

const user = generateTestData.user();
const longText = generateTestData.longText(5000);
```

## 🏷️ Tags למיון בדיקות

```typescript
test('@smoke @critical דף הבית נטען', async ({ page }) => {
  // בדיקה קריטית שרצה בכל build
});

test('@regression התחברות מורכבת', async ({ page }) => {
  // בדיקה שרצה רק ב-regression
});
```

### הרצה לפי tags:
```bash
npx playwright test --grep="@smoke"     # בדיקות עשן
npx playwright test --grep="@critical"  # בדיקות קריטיות
```

## 📊 דוחות מתקדמים

### דוח מותאם אישית
הדוח כולל:
- סיכום כללי של הבדיקות
- ביצועים מפורטים  
- בדיקות אבטחה
- פירוט כשלים

### CI/CD Integration
```yaml
# .github/workflows/e2e-tests.yml
- name: Run E2E Tests
  run: |
    npm ci
    npx playwright install --with-deps
    npm test
    
- name: Upload Results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      test-results/
      playwright-report/
```

## 🔧 הגדרות מתקדמות

### playwright.config.ts
- **Multi-browser testing** - Chrome, Firefox, Safari
- **Mobile & Desktop viewports**
- **Parallel execution**
- **Auto-retry on failure**
- **Screenshots & videos on failure**
- **Custom reporters**

### Performance Thresholds
```typescript
// בקובץ testConfig.ts
PERFORMANCE: {
  MAX_LOAD_TIME: 5000,      // 5 שניות
  MAX_LCP: 4000,            // 4 שניות LCP
  MAX_FCP: 3000,            // 3 שניות FCP
  MAX_memory_INCREASE: 50MB  // עלייה מקסימלית בזיכרון
}
```

## 🚨 Tips ו-Best Practices

### 1. לפני שמריצים בדיקות
```bash
# וודא שהשרת רץ
npm run dev

# התקן dependencies
npm install
npx playwright install --with-deps
```

### 2. Debug בדיקות כושלות
```bash
# מצב debug עם breakpoints
npm run test:debug

# הרצה עם GUI
npm run test:headed

# רק בדיקה ספציפית  
npx playwright test -g "שם הבדיקה"
```

### 3. עבודה עם selectors
```typescript
// עדיף data-testid
page.locator('[data-testid="login-button"]')

// fallback לtext
page.locator('text=התחברות')

// או שילוב
page.locator('button:has-text("התחברות")')
```

### 4. המתנה נכונה
```typescript
// המתן לאלמנט
await page.waitForSelector('[data-testid="result"]');

// המתן לרשת
await page.waitForLoadState('networkidle');

// המתן מותנה
await page.waitForFunction(() => document.title.includes('Results'));
```

## 🤝 תרומה לפרויקט

1. צור branch חדש: `git checkout -b feature/new-tests`
2. הוסף בדיקות חדשות בתיקייה המתאימה
3. הרץ את הבדיקות: `npm test`
4. צור Pull Request

## 📞 תמיכה

אם יש בעיה עם הבדיקות:
1. בדוק שכל ה-dependencies מותקנים
2. וודא שהשרת רץ על הפורט הנכון
3. הרץ `npm run test:debug` לבדיקה מפורטת

---

**נכתב עבור Amiram Academy Testing Team** 🎯
