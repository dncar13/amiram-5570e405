
import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForNetworkIdle(page: Page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async mockAPIResponse(page: Page, endpoint: string, response: any, status = 200) {
    await page.route(`**/api/${endpoint}**`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async mockAPIError(page: Page, endpoint: string, status = 500, error = 'Internal Server Error') {
    await page.route(`**/api/${endpoint}**`, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({ error })
      });
    });
  }

  static async clearBrowserData(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  }

  static async simulateSlowNetwork(page: Page, delay = 1000) {
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, delay));
      route.continue();
    });
  }

  static async captureConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    return errors;
  }

  static async measureLoadTime(page: Page, url: string): Promise<number> {
    const startTime = Date.now();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  }

  static async getMemoryUsage(page: Page): Promise<number> {
    return await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
  }

  static async injectCSS(page: Page, css: string) {
    await page.addStyleTag({ content: css });
  }

  static async hideAnimations(page: Page) {
    await this.injectCSS(page, `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        animation-delay: 0s !important;
        transition-delay: 0s !important;
      }
    `);
  }

  static async waitForElement(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async retry<T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries reached');
  }

  static generateUniqueEmail(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
  }

  static async checkAccessibility(page: Page) {
    // Basic accessibility checks
    const issues: string[] = [];
    
    // Check for images without alt text
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images without alt text`);
    }
    
    // Check for buttons without accessible names
    const buttonsWithoutNames = await page.locator('button:not([aria-label]):not([title])').count();
    if (buttonsWithoutNames > 0) {
      issues.push(`${buttonsWithoutNames} buttons without accessible names`);
    }
    
    // Check for form inputs without labels
    const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([title])').count();
    if (inputsWithoutLabels > 0) {
      issues.push(`${inputsWithoutLabels} inputs without labels`);
    }
    
    return issues;
  }

  static async simulateUserActions(page: Page, actions: Array<{ type: string, selector?: string, text?: string }>) {
    for (const action of actions) {
      switch (action.type) {
        case 'click':
          if (action.selector) {
            await page.click(action.selector);
          }
          break;
        case 'type':
          if (action.selector && action.text) {
            await page.fill(action.selector, action.text);
          }
          break;
        case 'wait':
          await page.waitForTimeout(1000);
          break;
        case 'scroll':
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          break;
      }
    }
  }
}

export const generateTestData = {
  user: () => ({
    email: TestHelpers.generateUniqueEmail(),
    password: 'Test@1234!',
    firstName: 'בדיקה',
    lastName: 'אוטומטית'
  }),
  
  longText: (length = 1000) => 'א'.repeat(length),
  
  xssPayloads: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(1)">',
    'javascript:alert(1)',
    '<svg onload=alert(1)>'
  ],
  
  sqlPayloads: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --"
  ]
};
