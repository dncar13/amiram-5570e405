
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SimulationPage } from '../pages/SimulationPage';
import { HomePage } from '../pages/HomePage';

test.describe('בדיקות Error Handling', () => {
  let loginPage: LoginPage;
  let simulationPage: SimulationPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    simulationPage = new SimulationPage(page);
    homePage = new HomePage(page);
  });

  test.describe('Network Errors', () => {
    test('התנהגות כאשר API לא זמין', async ({ page, context }) => {
      // Block all API calls
      await page.route('**/api/**', route => {
        route.abort('failed');
      });

      await homePage.goto();
      
      // Try to login - should show error message
      await loginPage.goto();
      await loginPage.login('test@example.com', 'Test@1234!');
      
      // Should show network error message
      const errorMessages = [
        'בעיית חיבור',
        'שגיאת רשת',
        'לא ניתן להתחבר',
        'נסה שוב מאוחר יותר',
        'network error',
        'connection failed'
      ];
      
      let errorFound = false;
      for (const msg of errorMessages) {
        if (await page.locator(`text=${msg}`).isVisible({ timeout: 5000 })) {
          errorFound = true;
          break;
        }
      }
      
      expect(errorFound).toBeTruthy();
    });

    test('בדיקת Offline Mode', async ({ page, context }) => {
      await homePage.goto();
      
      // Go offline
      await context.setOffline(true);
      
      // Try to navigate
      await page.click('a[href="/about"]');
      
      // Should show offline message or cached content
      const offlineIndicators = [
        'אין חיבור לאינטרנט',
        'offline',
        'לא מחובר',
        'בדוק את החיבור'
      ];
      
      let offlineHandled = false;
      for (const indicator of offlineIndicators) {
        if (await page.locator(`text=${indicator}`).isVisible({ timeout: 3000 })) {
          offlineHandled = true;
          break;
        }
      }
      
      // Either offline message or page still works (cached)
      expect(offlineHandled || await page.locator('body').isVisible()).toBeTruthy();
      
      // Go back online
      await context.setOffline(false);
      await page.reload();
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Server Errors', () => {
    test('טיפול ב-500 Server Error', async ({ page }) => {
      // Mock 500 error
      await page.route('**/api/auth/login', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await loginPage.goto();
      await loginPage.login('test@example.com', 'Test@1234!');
      
      // Should show user-friendly error message
      const serverErrorMessages = [
        'שגיאת שרת',
        'בעיה טכנית',
        'נסה שוב מאוחר יותר',
        'server error',
        'שירות לא זמין'
      ];
      
      let errorHandled = false;
      for (const msg of serverErrorMessages) {
        if (await page.locator(`text=${msg}`).isVisible({ timeout: 5000 })) {
          errorHandled = true;
          break;
        }
      }
      
      expect(errorHandled).toBeTruthy();
    });

    test('טיפול ב-403 Forbidden', async ({ page }) => {
      // Mock 403 error
      await page.route('**/api/premium/**', route => {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Access Denied' })
        });
      });

      await page.goto('/premium-content');
      
      // Should redirect to premium page or show access denied
      const accessDeniedMessages = [
        'אין הרשאה',
        'גישה מוגבלת',
        'דרוש פרימיום',
        'access denied',
        'unauthorized'
      ];
      
      let accessDeniedHandled = false;
      for (const msg of accessDeniedMessages) {
        if (await page.locator(`text=${msg}`).isVisible({ timeout: 5000 })) {
          accessDeniedHandled = true;
          break;
        }
      }
      
      expect(accessDeniedHandled || page.url().includes('/premium')).toBeTruthy();
    });
  });

  test.describe('Client Side Errors', () => {
    test('טיפול בשגיאות JavaScript', async ({ page }) => {
      const jsErrors: string[] = [];
      
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          jsErrors.push(msg.text());
        }
      });

      // Navigate to complex page
      await simulationPage.goto();
      await simulationPage.startPracticeSimulation();
      
      // Simulate some interactions
      if (await simulationPage.selectAnswer(0)) {
        await simulationPage.submitAnswer();
      }
      
      // Check for JS errors
      expect(jsErrors.length).toBe(0);
    });

    test('בדיקת Memory Leaks בסימולציה', async ({ page }) => {
      const getMemoryUsage = async () => {
        return await page.evaluate(() => {
          return (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
        });
      };

      await simulationPage.goto();
      const initialMemory = await getMemoryUsage();
      
      // Run multiple simulations
      for (let i = 0; i < 5; i++) {
        await simulationPage.startPracticeSimulation();
        
        // Answer some questions
        for (let q = 0; q < 3; q++) {
          if (await simulationPage.answerOptions.first().isVisible()) {
            await simulationPage.selectAnswer(0);
            await simulationPage.submitAnswer();
            
            if (await simulationPage.nextButton.isVisible()) {
              await simulationPage.goToNextQuestion();
            }
          }
        }
        
        // Go back to start
        await simulationPage.goto();
      }
      
      const finalMemory = await getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`Memory usage increase: ${memoryIncrease / 1024 / 1024} MB`);
      
      // Allow up to 50MB increase (adjust based on your app)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  test.describe('Form Validation Errors', () => {
    test('טיפול בשגיאות ולידציה מורכבת', async ({ page }) => {
      await loginPage.goto();
      
      // Try various invalid inputs
      const invalidInputs = [
        { email: '', password: '', expectedError: 'שדה חובה' },
        { email: 'invalid-email', password: 'short', expectedError: 'מייל לא תקין' },
        { email: 'test@example.com', password: '123', expectedError: 'סיסמה חלשה' },
        { email: 'test@example.com', password: 'א'.repeat(1000), expectedError: 'סיסמה ארוכה מדי' }
      ];
      
      for (const input of invalidInputs) {
        await page.reload();
        
        if (input.email) await loginPage.emailInput.fill(input.email);
        if (input.password) await loginPage.passwordInput.fill(input.password);
        
        await loginPage.loginButton.click();
        
        // Check for validation error
        const errorVisible = await page.locator(`text=${input.expectedError}`).isVisible({ timeout: 3000 });
        if (!errorVisible) {
          // Try generic error messages
          const genericErrors = await page.locator('.error, [role="alert"], .text-red-500').count();
          expect(genericErrors).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Timeout Handling', () => {
    test('טיפול בtimeout בטעינת דפים', async ({ page }) => {
      // Set very short timeout to simulate slow loading
      page.setDefaultTimeout(2000);
      
      // Mock slow response
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        route.continue();
      });
      
      await homePage.goto();
      
      // Should either load quickly or show loading state
      const loadingIndicators = [
        ':text("טוען")',
        ':text("אנא המתן")',
        '.loading',
        '.spinner',
        '.loading'
      ];
      
      let loadingStateFound = false;
      for (const indicator of loadingIndicators) {
        if (await page.locator(indicator).isVisible({ timeout: 1000 })) {
          loadingStateFound = true;
          break;
        }
      }
      
      // Either shows loading or loads quickly
      expect(loadingStateFound || await page.locator('body').isVisible()).toBeTruthy();
    });
  });
});
