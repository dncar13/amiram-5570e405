
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly url = '/login'; // Now uses login page with register tab

  // Form elements - updated for actual component structure
  get emailInput() { return this.page.locator('input[id="register-email"]'); }
  get passwordInput() { return this.page.locator('input[id="register-password"]'); }
  get nameInput() { return this.page.locator('input[id="register-name"]'); }
  get signupButton() { return this.page.locator('button[type="submit"]:has-text("הרשמה")'); }
  get loginTab() { return this.page.locator('[data-value="login"]'); }
  get signupTab() { return this.page.locator('[data-value="register"]'); }
  get googleSignupButton() { return this.page.locator('button:has-text("הרשמה עם Google")'); }

  // Messages
  get errorMessage() { return this.page.locator('[class*="error"], [role="alert"], .text-red-500'); }
  get successMessage() { return this.page.locator('[class*="success"], .text-green-500'); }
  get validationErrors() { return this.page.locator('[class*="error"], .text-red-500'); }

  async goto() {
    await this.navigateTo(this.url);
    // Switch to signup tab
    await this.signupTab.click();
  }

  async signup(userData: {
    email: string;
    password: string;
    name?: string;
  }) {
    // Make sure we're on signup tab
    await this.signupTab.click();
    
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    
    if (userData.name && await this.nameInput.isVisible()) {
      await this.nameInput.fill(userData.name);
    }

    await this.signupButton.click();
  }

  async expectSignupSuccess() {
    // Wait for redirect to simulations-entry
    await this.page.waitForURL(/simulations-entry/, { timeout: 60000 });
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
    await this.loginTab.click();
  }
}
