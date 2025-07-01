
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly url = '/signup';

  // Form elements (targeting registration tab specifically)
  get emailInput() { 
    return this.page.locator('#register-email, [data-value="register"] input[name="email"], [role="tabpanel"]:has-text("הרשמה") input[name="email"]').first(); 
  }
  get passwordInput() { 
    return this.page.locator('#register-password, [data-value="register"] input[name="password"], [role="tabpanel"]:has-text("הרשמה") input[name="password"]').first(); 
  }
  get confirmPasswordInput() { 
    return this.page.locator('input[name="confirmPassword"], input[name="password2"]'); 
  }
  get firstNameInput() { 
    return this.page.locator('#register-name, [data-value="register"] input[name="name"], [role="tabpanel"]:has-text("הרשמה") input[name="name"]').first(); 
  }
  get lastNameInput() { 
    return this.page.locator('input[name="lastName"], input[name="surname"]'); 
  }
  get termsCheckbox() { 
    return this.page.locator('#newsletter, [data-value="register"] input[type="checkbox"], [role="tabpanel"]:has-text("הרשמה") input[type="checkbox"]').first(); 
  }
  get signupButton() { 
    return this.page.locator('[role="tabpanel"]:has-text("הרשמה") button[type="submit"], form:has(#register-email) button[type="submit"]').first(); 
  }
  get loginLink() { return this.page.locator('a[href="/login"]').or(this.page.locator('a:has-text("התחבר")')).first(); }

  // Messages
  get errorMessage() { return this.page.locator('[class*="error"], [role="alert"], .text-red-500'); }
  get successMessage() { return this.page.locator('[class*="success"], .text-green-500'); }
  get validationErrors() { return this.page.locator('[class*="error"], .text-red-500'); }

  async goto() {
    await this.navigateTo(this.url);
    // Switch to the signup tab since our app uses tabs
    const signupTab = this.page.locator('[role="tab"][value="register"], button[value="register"]');
    if (await signupTab.count() > 0) {
      await signupTab.click();
      await this.page.waitForTimeout(1000); // Wait for tab switch
    } else {
      // Fallback: try clicking by text
      const textTab = this.page.locator('button:has-text("הרשמה")');
      if (await textTab.count() > 0) {
        await textTab.click();
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async signup(userData: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }) {
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    
    if (userData.confirmPassword && await this.confirmPasswordInput.isVisible()) {
      await this.confirmPasswordInput.fill(userData.confirmPassword);
    }
    
    if (userData.firstName && await this.firstNameInput.isVisible()) {
      await this.firstNameInput.fill(userData.firstName);
    }
    
    if (userData.lastName && await this.lastNameInput.isVisible()) {
      await this.lastNameInput.fill(userData.lastName);
    }

    // Accept terms if checkbox exists
    if (await this.termsCheckbox.isVisible()) {
      await this.termsCheckbox.check();
    }

    await this.signupButton.click();
  }

  async expectSignupSuccess() {
    // Check for various success indicators
    const successIndicators = this.page.locator(`
      [class*="success"], 
      .text-green-500, 
      :text("הרשמה הושלמה"), 
      :text("נרשמת בהצלחה"), 
      :text("אישור אימייל נדרש"),
      :text("בדקו את תיבת הדואר"),
      [class*="alert"]:has-text("אישור")
    `);
    
    // Also check if redirected away from login page (success redirect)
    try {
      await expect(successIndicators.first()).toBeVisible({ timeout: 30000 });
    } catch {
      // Alternative: check if we're redirected to success page
      await this.page.waitForURL(/^(?!.*\/login|.*\/signup).*/, { timeout: 30000 });
    }
  }

  async expectSignupError(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async expectValidationErrors(count: number) {
    await expect(this.validationErrors).toHaveCount(count, { timeout: 5000 });
  }

  async goToLogin() {
    await this.loginLink.click();
  }
}
