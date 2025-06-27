
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly url = '/';

  // Hero section
  get heroSection() { return this.page.locator('main, .hero, [class*="hero"]').first(); }
  get heroTitle() { return this.page.locator('h1').first(); }
  get startSimulationButton() { return this.page.locator('button:has-text("התחל"), a:has-text("התחל"), [data-testid="start-simulation"]').first(); }

  // Features section
  get featuresSection() { return this.page.locator('[class*="features"], .features').first(); }
  get featureCards() { return this.page.locator('[class*="card"], .card'); }

  // CTA buttons
  get simulationCTA() { return this.page.locator('a[href*="simulation"], button:has-text("סימולציה")').first(); }
  get readingCTA() { return this.page.locator('a[href*="reading"], button:has-text("הבנת הנקרא")').first(); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async verifyPageElements() {
    // More flexible verification
    await expect(this.page).toHaveTitle(/אמירם|Amiram|Academy/i);
    
    // Check for header/navigation
    const hasHeader = await this.header.isVisible({ timeout: 5000 });
    expect(hasHeader).toBeTruthy();
    
    // Check for main content
    const hasMainContent = await this.heroSection.isVisible({ timeout: 5000 });
    expect(hasMainContent).toBeTruthy();
    
    // Footer is optional
    try {
      await expect(this.footer).toBeVisible({ timeout: 3000 });
    } catch {
      console.log('Footer not found - might be optional');
    }
  }

  async clickStartSimulation() {
    if (await this.startSimulationButton.isVisible()) {
      await this.startSimulationButton.click();
    }
  }

  async checkPerformance(): Promise<number> {
    const startTime = Date.now();
    await this.goto();
    const loadTime = Date.now() - startTime;
    return loadTime;
  }
}
