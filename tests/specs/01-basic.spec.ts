
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestData } from '../utils/testData';

test.describe('בדיקות בסיסיות - Amiram Academy', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('טעינת דף הבית', async () => {
    await homePage.goto();
    await homePage.verifyPageElements();
  });

  test('בדיקת ביצועים - זמן טעינה', async () => {
    const loadTime = await homePage.checkPerformance();
    console.log(`זמן טעינת הדף: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(TestData.performance.maxLoadTime);
  });

  test('בדיקת Responsive Design', async () => {
    await homePage.goto();
    await homePage.checkResponsiveness();
  });

  test('בדיקת ניווט בתפריט', async () => {
    await homePage.goto();
    
    // בדיקת קישורי התפריט העיקרי
    await expect(homePage.simulationsLink).toBeVisible();
    await expect(homePage.readingComprehensionLink).toBeVisible();
    await expect(homePage.aboutLink).toBeVisible();
    
    // בדיקת כפתור התחברות
    await expect(homePage.loginButton).toBeVisible();
  });

  test('בדיקת לוגו ונווט לדף הבית', async () => {
    await homePage.goto();
    await homePage.clickLogo();
    await expect(homePage.page).toHaveURL(TestData.urls.home);
  });

  test('בדיקת מטא טאגים לSEO', async ({ page }) => {
    await homePage.goto();
    
    // בדיקת title
    await expect(page).toHaveTitle(/אמירם|Amiram/i);
    
    // בדיקת meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
  });

  test('בדיקת accessibility - ניווט במקלדת', async ({ page }) => {
    await homePage.goto();
    
    // ניווט עם Tab
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // בדיקה שאפשר להגיע לכפתורים מרכזיים
    let focusedElements = 0;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      if (await focused.isVisible()) {
        focusedElements++;
      }
    }
    
    expect(focusedElements).toBeGreaterThan(3);
  });

  test('בדיקת קבצים סטטיים', async ({ page }) => {
    await homePage.goto();
    
    // בדיקת טעינת תמונות
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      
      // בדיקה שלתמונה יש alt text
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
