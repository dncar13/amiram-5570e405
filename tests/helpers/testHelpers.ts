
import { Page, expect, Locator } from '@playwright/test';
import { TestConfig } from '../config/testConfig';

export class TestHelpers {
  /**
   * Clear all browser data
   */
  static async clearBrowserData(page: Page) {
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Clear localStorage and sessionStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page: Page, timeout = TestConfig.TIMEOUTS.DEFAULT) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Mock API response
   */
  static async mockAPIResponse(page: Page, endpoint: string, response: Record<string, unknown>, status = 200) {
    await page.route(`**/api/${endpoint}*`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be stable (no movement for specified time)
   */
  static async waitForElementStable(element: Locator, timeout = 2000) {
    let lastPosition: { x: number; y: number } | null = null;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const boundingBox = await element.boundingBox();
        if (boundingBox) {
          const currentPosition = { x: boundingBox.x, y: boundingBox.y };
          
          if (lastPosition && 
              Math.abs(lastPosition.x - currentPosition.x) < 1 && 
              Math.abs(lastPosition.y - currentPosition.y) < 1) {
            return; // Element is stable
          }
          
          lastPosition = currentPosition;
        }
      } catch (error) {
        // Element might not be visible yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(page: Page) {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
        memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
      };
    });
  }

  /**
   * Simulate slow network connection
   */
  static async simulateSlowNetwork(page: Page) {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 40 // 40ms
    });
  }

  /**
   * Check if element is in viewport
   */
  static async isElementInViewport(element: Locator): Promise<boolean> {
    return await element.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    });
  }

  /**
   * Scroll element into view smoothly
   */
  static async scrollToElement(element: Locator) {
    await element.evaluate((el) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await this.waitForElementStable(element);
  }

  /**
   * Generate random Hebrew text
   */
  static generateHebrewText(length: number): string {
    const hebrewChars = 'אבגדהוזחטיכלמנסעפצקרשת';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += hebrewChars.charAt(Math.floor(Math.random() * hebrewChars.length));
    }
    return result;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Wait with exponential backoff
   */
  static async waitWithBackoff(
    condition: () => Promise<boolean>,
    maxAttempts = 5,
    baseDelay = 1000
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (await condition()) {
        return true;
      }
      
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return false;
  }
}
