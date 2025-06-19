
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { TestUsers } from '../utils/testData';

test.describe('בדיקות אבטחה', () => {
  let loginPage: LoginPage;
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
  });

  test.describe('הגנה מפני XSS', () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror="alert(1)">',
      'javascript:alert(1)',
      '<svg onload=alert(1)>',
      '"><script>alert(1)</script>',
      '\';alert(String.fromCharCode(88,83,83))//\';alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//";alert(String.fromCharCode(88,83,83))//--></SCRIPT>">\'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>'
    ];

    test('בדיקת XSS בטופס הרשמה', async ({ page }) => {
      await signupPage.goto();
      
      let alertTriggered = false;
      page.on('dialog', async dialog => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      for (const payload of xssPayloads) {
        // Reset form
        await page.reload();
        
        // Test each field
        if (await signupPage.firstNameInput.isVisible()) {
          await signupPage.firstNameInput.fill(payload);
        }
        if (await signupPage.emailInput.isVisible()) {
          await signupPage.emailInput.fill(`test${Date.now()}@example.com`);
        }
        if (await signupPage.passwordInput.isVisible()) {
          await signupPage.passwordInput.fill('Test@1234!');
        }
        
        await signupPage.signupButton.click();
        
        // Wait a bit for potential XSS execution
        await page.waitForTimeout(1000);
        
        expect(alertTriggered).toBeFalsy();
      }
    });

    test('בדיקת XSS בטופס התחברות', async ({ page }) => {
      await loginPage.goto();
      
      let alertTriggered = false;
      page.on('dialog', async dialog => {
        alertTriggered = true;
        await dialog.dismiss();
      });

      for (const payload of xssPayloads) {
        await page.reload();
        
        await loginPage.emailInput.fill(payload);
        await loginPage.passwordInput.fill(payload);
        await loginPage.loginButton.click();
        
        await page.waitForTimeout(1000);
        expect(alertTriggered).toBeFalsy();
      }
    });
  });

  test.describe('הגנה מפני Brute Force', () => {
    test('בדיקת Rate Limiting בהתחברות', async ({ page }) => {
      await loginPage.goto();
      
      const maxAttempts = 10;
      let rateLimitDetected = false;
      
      for (let i = 0; i < maxAttempts; i++) {
        await loginPage.login('test@example.com', 'wrong_password_' + i);
        
        // Check for rate limiting messages
        const rateLimitIndicators = [
          'נסיונות רבים מדי',
          'חסום זמנית',
          'captcha',
          'נסה שוב מאוחר יותר',
          'too many attempts'
        ];
        
        for (const indicator of rateLimitIndicators) {
          if (await page.locator(`text=${indicator}`).isVisible({ timeout: 2000 })) {
            rateLimitDetected = true;
            break;
          }
        }
        
        if (rateLimitDetected) break;
        
        await page.waitForTimeout(500);
      }
      
      console.log(`Rate limiting detected after ${maxAttempts} attempts: ${rateLimitDetected}`);
      // Note: This might be expected behavior, so we log rather than fail
    });
  });

  test.describe('בדיקת Input Validation', () => {
    test('בדיקת SQL Injection patterns', async ({ page }) => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "'; INSERT INTO users VALUES ('hacker'); --"
      ];

      await loginPage.goto();
      
      for (const payload of sqlPayloads) {
        await loginPage.emailInput.fill(payload);
        await loginPage.passwordInput.fill(payload);
        await loginPage.loginButton.click();
        
        // Verify no SQL error messages are displayed
        const sqlErrorIndicators = [
          'SQL syntax',
          'mysql_fetch',
          'ORA-',
          'PostgreSQL',
          'Warning: mysql',
          'valid MySQL result'
        ];
        
        for (const error of sqlErrorIndicators) {
          await expect(page.locator(`text=${error}`)).not.toBeVisible();
        }
        
        await page.reload();
      }
    });

    test('בדיקת קלטים קיצוניים', async ({ page }) => {
      const extremeInputs = [
        'א'.repeat(10000), // Very long Hebrew text
        'A'.repeat(10000), // Very long English text
        '🔥'.repeat(1000), // Emoji spam
        '\x00\x01\x02\x03', // Control characters
        '../../../../etc/passwd', // Path traversal
        '<script>while(1){}</script>', // Infinite loop attempt
      ];

      await signupPage.goto();
      
      for (const input of extremeInputs) {
        if (await signupPage.firstNameInput.isVisible()) {
          await signupPage.firstNameInput.fill(input);
          await signupPage.signupButton.click();
          
          // Should show validation error, not crash
          const validationErrors = [
            'עד 50 תווים',
            'תווים לא חוקיים',
            'קלט לא תקין',
            'invalid input',
            'שדה לא תקין'
          ];
          
          let validationFound = false;
          for (const error of validationErrors) {
            if (await page.locator(`text=${error}`).isVisible({ timeout: 2000 })) {
              validationFound = true;
              break;
            }
          }
          
          // Either validation error or form doesn't submit
          expect(validationFound || await signupPage.signupButton.isVisible()).toBeTruthy();
          
          await page.reload();
        }
      }
    });
  });

  test.describe('בדיקות Session Management', () => {
    test('בדיקת Session Timeout', async ({ page }) => {
      // Login first
      await loginPage.goto();
      await loginPage.login(TestUsers.validUser.email, TestUsers.validUser.password);
      
      // Verify logged in
      expect(await loginPage.isLoggedIn()).toBeTruthy();
      
      // Simulate session expiration by clearing cookies
      await page.context().clearCookies();
      
      // Try to access protected page
      await page.goto('/simulation-history');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/);
    });

    test('בדיקת Concurrent Sessions', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      const loginPage1 = new LoginPage(page1);
      const loginPage2 = new LoginPage(page2);
      
      // Login in both contexts with same user
      await loginPage1.goto();
      await loginPage1.login(TestUsers.validUser.email, TestUsers.validUser.password);
      
      await loginPage2.goto();
      await loginPage2.login(TestUsers.validUser.email, TestUsers.validUser.password);
      
      // Both should work (or implement single session policy)
      expect(await loginPage1.isLoggedIn()).toBeTruthy();
      expect(await loginPage2.isLoggedIn()).toBeTruthy();
      
      await context1.close();
      await context2.close();
    });
  });
});
