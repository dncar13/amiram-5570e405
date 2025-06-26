
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = '/login';

  // Form elements - updated for actual component structure
  get emailInput() { return this.page.locator('input[id="email"]'); }
  get passwordInput() { return this.page.locator('input[id="password"]'); }
  get loginButton() { return this.page.locator('button[type="submit"]:has-text("התחברות")'); }
  get signupTab() { return this.page.locator('[data-value="register"]'); }
  get loginTab() { return this.page.locator('[data-value="login"]'); }
  get forgotPasswordLink() { return this.page.locator('a:has-text("שכחת סיסמה?")'); }
  get googleLoginButton() { return this.page.locator('button:has-text("התחברות עם Google")'); }

  // Error messages
  get errorMessage() { return this.page.locator('[class*="error"], [role="alert"], .text-red-500'); }
  get successMessage() { return this.page.locator('[class*="success"], .text-green-500'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async login(email: string, password: string) {
    // Make sure we're on login tab
    await this.loginTab.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoogle() {
    await this.googleLoginButton.click();
    // Handle Google OAuth flow if needed
  }

  async expectLoginSuccess() {
    // Wait for redirect to simulations-entry
    await this.page.waitForURL(/simulations-entry/, { timeout: 60000 });
    expect(await this.isLoggedIn()).toBeTruthy();
  }

  async expectLoginError(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async goToSignup() {
    await this.signupTab.click();
  }
}
