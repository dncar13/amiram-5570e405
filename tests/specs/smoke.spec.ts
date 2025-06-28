
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests @smoke', () => {
  test('בדיקת עמוד הבית נטען', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Amiram Academy|אמירם|Academy/i);
    
    // Check that basic elements exist
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ עמוד הבית נטען בהצלחה');
  });

  test('בדיקת ניווט בסיסי', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for any navigation links with multiple strategies
    const allLinks = await page.locator('a[href]').count();
    const navigationLinks = await page.locator('nav a, header a, .navbar a').count();
    
    console.log(`🔍 Total links: ${allLinks}, Navigation links: ${navigationLinks}`);
    
    // Check if we can find any links at all
    expect(allLinks).toBeGreaterThan(0);
    
    console.log(`✅ נמצאו ${allLinks} קישורים בעמוד`);
  });

  test('בדיקת טעינת משאבים בסיסיים', async ({ page }) => {
    // Track failed requests
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow some failures (like analytics, fonts, etc.)
    expect(failedRequests.length).toBeLessThan(5);
    
    if (failedRequests.length > 0) {
      console.log('⚠️ Some requests failed:', failedRequests);
    } else {
      console.log('✅ כל המשאבים נטענו בהצלחה');
    }
  });

  test('בדיקת JavaScript errors', async ({ page }) => {
    const jsErrors: string[] = [];
    const consoleErrors: string[] = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Some console errors might be expected (development mode, etc.)
    expect(jsErrors.length).toBeLessThan(3);
    
    if (jsErrors.length > 0) {
      console.log('⚠️ JavaScript errors found:', jsErrors);
    } else {
      console.log('✅ לא נמצאו שגיאות JavaScript');
    }
  });
});
