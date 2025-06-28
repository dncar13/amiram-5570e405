
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = '/login';

  // Form elements - updated for actual component structure
  get emailInput() { return this.page.locator('input[type="email"]'); }
  get passwordInput() { return this.page.locator('input[type="password"]'); }
  get loginButton() { return this.page.locator('button[type="submit"]').first(); }
  get signupTab() { return this.page.locator('[data-value="register"]'); }
  get loginTab() { return this.page.locator('[data-value="login"]'); }
  get forgotPasswordLink() { return this.page.locator('a:has-text("שכחת סיסמה?")'); }
  get googleLoginButton() { return this.page.locator('button:has-text("Google")'); }

  // Error messages
  get errorMessage() { return this.page.locator('.text-red-500, [role="alert"], .error-message').first(); }
  get successMessage() { return this.page.locator('.text-green-500, .success-message').first(); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async login(email: string, password: string) {
    // Make sure we're on login tab
    if (await this.loginTab.isVisible()) {
      await this.loginTab.click();
    }
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoogle() {
    await this.googleLoginButton.click();
  }

  async expectLoginSuccess() {
    // Wait for redirect to simulations-entry or check for auth state
    try {
      await this.page.waitForURL(/simulations-entry|\/$/);
    } catch {
      // If no redirect, check if we're logged in
      await this.page.waitForTimeout(2000);
    }
    expect(await this.isLoggedIn()).toBeTruthy();
  }

  async expectLoginError(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async clickForgotPassword() {
    if (await this.forgotPasswordLink.isVisible()) {
      await this.forgotPasswordLink.click();
    }
  }

  async goToSignup() {
    await this.signupTab.click();
  }
}
