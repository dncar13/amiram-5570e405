
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly url = '/login';

  // Form elements - updated for actual component structure
  get emailInput() { return this.page.locator('input[type="email"]'); }
  get passwordInput() { return this.page.locator('input[type="password"]'); }
  get confirmPasswordInput() { return this.page.locator('input[placeholder*="אימות"], input[name*="confirm"]'); }
  get firstNameInput() { return this.page.locator('input[placeholder*="שם פרטי"], input[name*="firstName"]'); }
  get lastNameInput() { return this.page.locator('input[placeholder*="שם משפחה"], input[name*="lastName"]'); }
  get signupButton() { return this.page.locator('button[type="submit"]').first(); }
  get loginTab() { return this.page.locator('[data-value="login"]'); }
  get signupTab() { return this.page.locator('[data-value="register"]'); }
  get googleSignupButton() { return this.page.locator('button:has-text("Google")'); }
  get loginLink() { return this.page.locator('a:has-text("התחבר"), button:has-text("התחבר")').first(); }

  // Messages
  get errorMessage() { return this.page.locator('.text-red-500, [role="alert"], .error-message').first(); }
  get successMessage() { return this.page.locator('.text-green-500, .success-message').first(); }
  get validationErrors() { return this.page.locator('.text-red-500, .error-message'); }

  async goto() {
    await this.navigateTo(this.url);
    // Switch to signup tab
    if (await this.signupTab.isVisible()) {
      await this.signupTab.click();
    }
  }

  async signup(userData: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }) {
    // Make sure we're on signup tab
    if (await this.signupTab.isVisible()) {
      await this.signupTab.click();
    }
    
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

    await this.signupButton.click();
  }

  async expectSignupSuccess() {
    // Wait for redirect or success message
    try {
      await this.page.waitForURL(/simulations-entry|\/$/);
    } catch {
      // Check for success message
      await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    }
  }

  async expectSignupError(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async expectValidationErrors(count: number) {
    await expect(this.validationErrors).toHaveCount(count, { timeout: 5000 });
  }

  async goToLogin() {
    if (await this.loginTab.isVisible()) {
      await this.loginTab.click();
    } else if (await this.loginLink.isVisible()) {
      await this.loginLink.click();
    }
  }
}
