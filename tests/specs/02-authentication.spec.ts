
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
    // התנתקות אם מחובר
    await homePage.logout();
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
      
      // ניסיון התחברות ללא מילוי - our app uses JS validation
      await loginPage.loginButton.click();
      
      // Give time for JS validation to trigger and show error
      await loginPage.page.waitForTimeout(2000);
      
      // Check if validation error appears (our app shows JS validation errors)
      await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
      
      // בדיקת פורמט מייל לא תקין
      await loginPage.emailInput.fill('notanemail');
      await loginPage.passwordInput.fill('password');
      await loginPage.loginButton.click();
      await loginPage.expectLoginError();
    });

    test('שכחת סיסמה', async () => {
      await loginPage.goto();
      await loginPage.clickForgotPassword();
      // יש לבדוק שעבר לעמוד שחזור סיסמה או הראה דיאלוג
      await expect(loginPage.page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    });
  });

  test.describe('הרשמה', () => {
    test('הרשמת משתמש חדש - מסלול מוצלח', async () => {
      const newUser = generateTestUser();
      
      await signupPage.goto();
      await signupPage.signup({
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });
      
      await signupPage.expectSignupSuccess();
    });

    test('הרשמה עם מייל קיים', async () => {
      await signupPage.goto();
      await signupPage.signup({
        email: TestUsers.validUser.email,
        password: TestUsers.validUser.password,
        confirmPassword: TestUsers.validUser.password
      });
      
      await signupPage.expectSignupError();
    });

    test('בדיקת ולידציות בטופס הרשמה', async () => {
      await signupPage.goto();
      
      // ניסיון שליחה ללא מילוי
      await signupPage.signupButton.click();
      await signupPage.expectValidationErrors(2); // לפחות email ו-password
      
      // בדיקת פורמט מייל
      await signupPage.emailInput.fill('notanemail');
      await signupPage.signupButton.click();
      await signupPage.expectSignupError();
      
      // בדיקת חוזק סיסמה
      await signupPage.emailInput.fill('test@example.com');
      await signupPage.passwordInput.fill('123');
      await signupPage.signupButton.click();
      await signupPage.expectSignupError();
    });

    test('מעבר מהרשמה להתחברות', async () => {
      await signupPage.goto();
      await signupPage.goToLogin();
      await expect(signupPage.page).toHaveURL(/.*login/);
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
        confirmPassword: newUser.password
      });
      
      // אם ההרשמה מצריכה אישור מייל, נעבור להתחברות
      if (await signupPage.page.locator('text=אישור מייל').isVisible()) {
        await loginPage.goto();
        await loginPage.login(newUser.email, newUser.password);
      }
      
      // בדיקה שמחובר
      await homePage.goto();
      expect(await homePage.isLoggedIn()).toBeTruthy();
      
      // התנתקות
      await homePage.logout();
      expect(await homePage.isLoggedIn()).toBeFalsy();
    });
  });
});
