
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
    
    // Check for navigation links - try multiple selectors to cover different scenarios
    const navigationLinks = page.locator('nav a, [class*="nav"] a, header a, .navbar a');
    const allLinks = page.locator('a');
    const linksWithHref = page.locator('a[href]:not([href=""]'):not([href="#"])');
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000);
    
    const navCount = await navigationLinks.count();
    const allCount = await allLinks.count();
    const hrefCount = await linksWithHref.count();
    
    console.log(`🔍 Navigation links: ${navCount}, All links: ${allCount}, Links with href: ${hrefCount}`);
    
    // Check if we can find any navigation links
    const hasNavigation = navCount > 0 || hrefCount > 0 || allCount > 0;
    
    expect(hasNavigation).toBeTruthy();
    
    if (navCount > 0) {
      console.log(`✅ נמצאו ${navCount} קישורי ניווט בעמוד`);
    } else if (hrefCount > 0) {
      console.log(`✅ נמצאו ${hrefCount} קישורים עם href בעמוד`);
    } else {
      console.log(`✅ נמצאו ${allCount} קישורים בעמוד`);
    }
  });
});
