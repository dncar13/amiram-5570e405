
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = '/login';

  // Form elements
  get emailInput() { return this.page.locator('input[name="email"], input[type="email"]'); }
  get passwordInput() { return this.page.locator('input[name="password"], input[type="password"]'); }
  get loginButton() { return this.page.locator('button[type="submit"], button:has-text("התחבר")'); }
  get signupLink() { return this.page.locator('a[href="/signup"], a:has-text("הרשמה")'); }
  get forgotPasswordLink() { return this.page.locator('a:has-text("שכחת"), a:has-text("איפוס")'); }
  get googleLoginButton() { return this.page.locator('button:has-text("Google"), [data-testid="google-login"]'); }

  // Error messages
  get errorMessage() { return this.page.locator('[class*="error"], [role="alert"], .text-red-500'); }
  get successMessage() { return this.page.locator('[class*="success"], .text-green-500'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithGoogle() {
    await this.googleLoginButton.click();
    // Handle Google OAuth flow if needed
  }

  async expectLoginSuccess() {
    // Wait for redirect or success indicator
    await this.page.waitForURL(/^(?!.*\/login).*/, { timeout: 10000 });
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
    await this.signupLink.click();
  }
}
