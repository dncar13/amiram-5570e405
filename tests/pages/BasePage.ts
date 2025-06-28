
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Header elements
  get header() { return this.page.locator('header'); }
  get logo() { return this.page.locator('a[href="/"]').first(); }
  get homeLink() { return this.page.locator('nav a[href="/"]'); }
  get simulationsLink() { return this.page.locator('nav a[href="/simulations-entry"]'); }
  get readingComprehensionLink() { return this.page.locator('nav a[href="/reading-comprehension"]'); }
  get aboutLink() { return this.page.locator('nav a[href="/about"]'); }
  get loginButton() { return this.page.locator('header a[href="/login"]').or(this.page.locator('nav a[href="/login"]')).first(); }
  get userMenu() { return this.page.locator('[data-testid="user-menu"]').or(this.page.locator('button:has-text("משתמש")')); }
  get logoutButton() { return this.page.locator('button:has-text("התנתקות")'); }

  // Mobile menu
  get mobileMenuButton() { return this.page.locator('button:has([class*="hamburger"], [class*="menu"])'); }
  get mobileMenu() { return this.page.locator('[data-testid="mobile-menu"]').or(this.page.locator('nav[class*="mobile"]')); }

  // Footer
  get footer() { return this.page.locator('footer'); }

  // Common methods
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.userMenu.waitFor({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async logout() {
    if (await this.isLoggedIn()) {
      await this.userMenu.click();
      await this.logoutButton.click();
      await this.page.waitForURL('**/');
    }
  }

  async checkResponsiveness() {
    // Desktop view
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await expect(this.header).toBeVisible();
    
    // Tablet view
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await expect(this.header).toBeVisible();
    
    // Mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    if (await this.mobileMenuButton.isVisible()) {
      await this.mobileMenuButton.click();
      await expect(this.mobileMenu).toBeVisible();
    }
  }
}
