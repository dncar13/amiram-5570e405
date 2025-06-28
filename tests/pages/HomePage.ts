
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly url = '/';

  // Hero section
  get heroSection() { return this.page.locator('[class*="hero"]').or(this.page.locator('main').first()); }
  get heroTitle() { return this.page.locator('h1').first(); }
  get startSimulationButton() { return this.page.locator('button:has-text("התחל"), a:has-text("התחל")'); }

  // Features section
  get featuresSection() { return this.page.locator('[class*="features"]'); }
  get featureCards() { return this.page.locator('[class*="card"]'); }

  // CTA buttons
  get simulationCTA() { return this.page.locator('a[href*="simulation"], button:has-text("סימולציה")'); }
  get readingCTA() { return this.page.locator('a[href*="reading"], button:has-text("הבנת הנקרא")'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async verifyPageElements() {
    await expect(this.page).toHaveTitle(/אמירם|Amiram/i);
    await expect(this.header).toBeVisible();
    await expect(this.footer).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
  }

  async clickStartSimulation() {
    await this.startSimulationButton.first().click();
  }

  async checkPerformance(): Promise<number> {
    const startTime = Date.now();
    await this.goto();
    const loadTime = Date.now() - startTime;
    return loadTime;
  }
}
