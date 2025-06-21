
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests @smoke', () => {
  test('בדיקת עמוד הבית נטען', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Amiram Academy/i);
    
    // Check that basic elements exist
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ עמוד הבית נטען בהצלחה');
  });

  test('בדיקת ניווט בסיסי', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Check if we can navigate (basic check)
    const links = page.locator('a[href]');
    const count = await links.count();
    
    expect(count).toBeGreaterThan(0);
    
    console.log(`✅ נמצאו ${count} קישורים בעמוד`);
  });
});
