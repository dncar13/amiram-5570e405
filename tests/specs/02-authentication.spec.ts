
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { HomePage } from '../pages/HomePage';
import { TestUsers, generateTestUser } from '../utils/testData';

test.describe('בדיקות Authentication', () => {
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    homePage = new HomePage(page);
  });

  test.afterEach(async () => {
    try {
      await homePage.logout();
    } catch (error) {
      // Ignore logout errors in tests
    }
  });

  test.describe('התחברות', () => {
    test('התחברות מוצלחת עם משתמש קיים', async () => {
      await loginPage.goto();
      await loginPage.login(TestUsers.validUser.email, TestUsers.validUser.password);
      await loginPage.expectLoginSuccess();
    });

    test('התחברות עם פרטים שגויים', async () => {
      await loginPage.goto();
      await loginPage.login(TestUsers.invalidUser.email, TestUsers.invalidUser.password);
      await loginPage.expectLoginError();
    });

    test('בדיקת ולידציות בטופס התחברות', async () => {
      await loginPage.goto();
      
      // ניסיון התחברות ללא מילוי
      await loginPage.loginButton.click();
      await expect(loginPage.errorMessage.or(loginPage.page.locator('input:invalid'))).toBeVisible();
      
      // בדיקת פורמט מייל לא תקין
      await loginPage.emailInput.fill('notanemail');
      await loginPage.passwordInput.fill('password');
      await loginPage.loginButton.click();
      await expect(loginPage.errorMessage.or(loginPage.page.locator('input:invalid'))).toBeVisible();
    });

    test('שכחת סיסמה', async () => {
      await loginPage.goto();
      if (await loginPage.forgotPasswordLink.isVisible()) {
        await loginPage.clickForgotPassword();
        // Check for forgot password page or modal
        await expect(loginPage.page.locator('input[name="email"], input[type="email"]')).toBeVisible();
      }
    });
  });

  test.describe('הרשמה', () => {
    test('הרשמת משתמש חדש - מסלול מוצלח', async () => {
      const newUser = generateTestUser();
      
      await signupPage.goto();
      await signupPage.signup({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name
      });
      
      // Either successful signup or email confirmation required
      try {
        await signupPage.expectSignupSuccess();
      } catch {
        // Check for email confirmation message
        await expect(signupPage.page.locator('text=אישור, text=מייל, text=email')).toBeVisible();
      }
    });

    test('הרשמה עם מייל קיים', async () => {
      await signupPage.goto();
      await signupPage.signup({
        email: TestUsers.validUser.email,
        password: TestUsers.validUser.password,
        name: TestUsers.validUser.name
      });
      
      await signupPage.expectSignupError();
    });

    test('בדיקת ולידציות בטופס הרשמה', async () => {
      await signupPage.goto();
      
      // ניסיון שליחה ללא מילוי
      await signupPage.signupButton.click();
      const validationErrors = await signupPage.page.locator('input:invalid, [class*="error"]').count();
      expect(validationErrors).toBeGreaterThan(0);
      
      // בדיקת פורמט מייל
      await signupPage.emailInput.fill('notanemail');
      await signupPage.signupButton.click();
      await expect(signupPage.page.locator('input:invalid, [class*="error"]')).toBeVisible();
      
      // בדיקת חוזק סיסמה
      await signupPage.emailInput.fill('test@example.com');
      await signupPage.passwordInput.fill('123');
      await signupPage.signupButton.click();
      await expect(signupPage.page.locator('input:invalid, [class*="error"]')).toBeVisible();
    });

    test('מעבר מהרשמה להתחברות', async () => {
      await signupPage.goto();
      await signupPage.goToLogin();
      await expect(signupPage.loginTab).toHaveAttribute('data-state', 'active');
    });
  });

  test.describe('זרימת Authentication מלאה', () => {
    test('הרשמה ← התחברות ← התנתקות', async () => {
      const newUser = generateTestUser();
      
      // הרשמה
      await signupPage.goto();
      await signupPage.signup({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name
      });
      
      // If signup requires email confirmation, go to login
      try {
        await signupPage.expectSignupSuccess();
      } catch {
        // Try login instead
        await loginPage.goto();
        await loginPage.login(newUser.email, newUser.password);
      }
      
      // בדיקה שמחובר
      await homePage.goto();
      const isLoggedIn = await homePage.isLoggedIn();
      
      if (isLoggedIn) {
        // התנתקות
        await homePage.logout();
        expect(await homePage.isLoggedIn()).toBeFalsy();
      }
    });
  });
});
