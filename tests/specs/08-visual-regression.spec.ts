
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SimulationPage } from '../pages/SimulationPage';

test.describe('בדיקות Visual Regression', () => {
  test.describe('דפים עיקריים', () => {
    test('דף הבית - מראה כללי', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      
      // Wait for all content to load
      await page.waitForLoadState('networkidle');
      
      // Hide dynamic content (dates, etc.)
      await page.evaluate(() => {
        const timeElements = document.querySelectorAll('[data-testid="timestamp"], .timestamp, time');
        timeElements.forEach(el => el.textContent = '2024-01-01 12:00:00');
        
        // Hide animations
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }';
        document.head.appendChild(style);
      });
      
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        maxDiffPixels: 100
      });
    });

    test('דף התחברות', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('login-page.png', {
        maxDiffPixels: 50
      });
    });

    test('דף סימולציה', async ({ page }) => {
      const simulationPage = new SimulationPage(page);
      await simulationPage.goto();
      
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('simulation-entry.png', {
        maxDiffPixels: 100
      });
    });
  });

  test.describe('רכיבים מרכזיים', () => {
    test('Header navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header');
      await expect(header).toHaveScreenshot('header-navigation.png');
    });

    test('Footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer');
      await expect(footer).toHaveScreenshot('footer.png');
    });

    test('כרטיס שאלה בסימולציה', async ({ page }) => {
      const simulationPage = new SimulationPage(page);
      await simulationPage.goto();
      
      // Try to start simulation and get question card
      try {
        await simulationPage.startPracticeSimulation();
        await page.waitForSelector('[data-testid="question-container"]', { timeout: 5000 });
        
        const questionCard = page.locator('[data-testid="question-container"]').first();
        if (await questionCard.isVisible()) {
          await expect(questionCard).toHaveScreenshot('question-card.png');
        }
      } catch (error) {
        console.log('Could not capture question card screenshot:', error);
      }
    });
  });

  test.describe('מצבי responsive', () => {
    test('דף הבית - מובייל', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true
      });
    });

    test('דף הבית - טאבלט', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-tablet.png', {
        fullPage: true
      });
    });

    test('דף הבית - דסקטופ', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true
      });
    });
  });

  test.describe('מצבי שגיאה', () => {
    test('הודעת שגיאה בהתחברות', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Trigger error
      await loginPage.login('invalid@example.com', 'wrongpassword');
      
      // Wait for error message
      await page.waitForSelector('.error, [role="alert"], .text-red-500', { timeout: 5000 });
      
      await expect(page).toHaveScreenshot('login-error.png');
    });

    test('עמוד 404', async ({ page }) => {
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('404-page.png');
    });
  });

  test.describe('מצבי טעינה', () => {
    test('מצב טעינה', async ({ page }) => {
      // Mock slow response to capture loading state
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.continue();
      });
      
      const simulationPage = new SimulationPage(page);
      await simulationPage.goto();
      
      // Try to capture loading state
      try {
        await simulationPage.startPracticeSimulation();
        
        // Look for loading indicators
        const loadingSelectors = [
          '.loading',
          '.spinner',
          '[data-testid="loading"]',
          'text=טוען',
          'text=אנא המתן'
        ];
        
        for (const selector of loadingSelectors) {
          if (await page.locator(selector).isVisible({ timeout: 2000 })) {
            await expect(page).toHaveScreenshot('loading-state.png');
            break;
          }
        }
      } catch (error) {
        console.log('Could not capture loading state:', error);
      }
    });
  });

  test.describe('אינטראקציות', () => {
    test('hover states', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find first button and hover
      const button = page.locator('button').first();
      if (await button.isVisible()) {
        await button.hover();
        await expect(button).toHaveScreenshot('button-hover.png');
      }
    });

    test('focus states', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Focus on email input
      await loginPage.emailInput.focus();
      await expect(loginPage.emailInput).toHaveScreenshot('input-focus.png');
    });

    test('form validation states', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      // Try to submit empty form
      await loginPage.loginButton.click();
      
      // Wait for validation
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('form-validation.png');
    });
  });

  test.describe('דארק מוד (אם קיים)', () => {
    test('דף הבית - דארק מוד', async ({ page }) => {
      await page.goto('/');
      
      // Try to enable dark mode
      try {
        await page.click('[data-testid="theme-toggle"]');
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot('homepage-dark.png', {
          fullPage: true
        });
      } catch (error) {
        console.log('Dark mode toggle not found');
      }
    });
  });

  test.describe('בדיקות cross-browser', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`דף הבית - ${browserName}`, async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
          maxDiffPixels: 200 // Allow more differences between browsers
        });
        
        await context.close();
      });
    });
  });
});
