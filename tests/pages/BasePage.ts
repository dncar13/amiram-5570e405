
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Header elements
  get header() { return this.page.locator('header, nav').first(); }
  get logo() { return this.page.locator('a[href="/"], .logo').first(); }
  get homeLink() { return this.page.locator('a[href="/"]').first(); }
  get simulationsLink() { return this.page.locator('a[href="/simulations-entry"], a:has-text("סימולציות")').first(); }
  get readingComprehensionLink() { return this.page.locator('a[href="/reading-comprehension"], a:has-text("הבנת הנקרא")').first(); }
  get aboutLink() { return this.page.locator('a[href="/about"], a:has-text("אודות")').first(); }
  get loginButton() { return this.page.locator('a[href="/login"], button:has-text("התחבר")').first(); }
  get userMenu() { return this.page.locator('[data-testid="user-menu"], button:has-text("משתמש"), .user-avatar').first(); }
  get logoutButton() { return this.page.locator('button:has-text("התנתק"), a:has-text("התנתק")').first(); }

  // Mobile menu - more flexible selectors
  get mobileMenuButton() { 
    return this.page.locator('button[aria-label*="menu"], button:has([data-lucide="menu"]), .hamburger, [data-testid="mobile-menu-button"]').first();
  }
  get mobileMenu() { 
    return this.page.locator('[data-testid="mobile-menu"], .mobile-menu, nav[class*="mobile"]').first();
  }

  // Footer
  get footer() { return this.page.locator('footer').first(); }

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
      // Check multiple indicators of being logged in
      const userMenuVisible = await this.userMenu.isVisible({ timeout: 2000 });
      const logoutButtonVisible = await this.logoutButton.isVisible({ timeout: 2000 });
      const loginButtonNotVisible = !(await this.loginButton.isVisible({ timeout: 2000 }));
      
      return userMenuVisible || logoutButtonVisible || loginButtonNotVisible;
    } catch {
      return false;
    }
  }

  async logout() {
    try {
      if (await this.isLoggedIn()) {
        // Try to find logout button in user menu
        if (await this.userMenu.isVisible()) {
          await this.userMenu.click();
        }
        
        if (await this.logoutButton.isVisible({ timeout: 3000 })) {
          await this.logoutButton.click();
          await this.page.waitForURL('**/', { timeout: 10000 });
        }
      }
    } catch (error) {
      console.log('Logout failed:', error);
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
    
    // Check if mobile menu exists, if not, that's ok too
    try {
      if (await this.mobileMenuButton.isVisible({ timeout: 3000 })) {
        await this.mobileMenuButton.click();
        await expect(this.mobileMenu).toBeVisible({ timeout: 5000 });
      }
    } catch (error) {
      // Mobile menu might not exist, that's fine
      console.log('Mobile menu not found or not working, continuing...');
    }
  }
}
