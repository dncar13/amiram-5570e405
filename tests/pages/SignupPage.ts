
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly url = '/register';

  // Form elements
  get emailInput() { return this.page.locator('input[name="email"], input[type="email"]'); }
  get passwordInput() { return this.page.locator('input[name="password"], input[type="password"]').first(); }
  get confirmPasswordInput() { return this.page.locator('input[name="confirmPassword"], input[name="password2"]'); }
  get firstNameInput() { return this.page.locator('input[name="firstName"], input[name="name"]'); }
  get lastNameInput() { return this.page.locator('input[name="lastName"], input[name="surname"]'); }
  get termsCheckbox() { return this.page.locator('input[type="checkbox"]'); }
  get signupButton() { return this.page.locator('button[type="submit"], button:has-text("הרשמה")'); }
  get loginLink() { return this.page.locator('a[href="/login"], a:has-text("התחבר")'); }

  // Messages
  get errorMessage() { return this.page.locator('[class*="error"], [role="alert"], .text-red-500'); }
  get successMessage() { return this.page.locator('[class*="success"], .text-green-500'); }
  get validationErrors() { return this.page.locator('[class*="error"], .text-red-500'); }

  async goto() {
    await this.navigateTo(this.url);
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
    await expect(this.successMessage.or(this.page.locator('text=הרשמה הושלמה'))).toBeVisible({ timeout: 10000 });
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
