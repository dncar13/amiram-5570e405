import { test, expect } from '@playwright/test';

/**
 * Focused Mobile Testing Suite
 * Fixes and tests critical mobile functionality
 */

test.describe('Mobile Header Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Mobile menu toggle functionality', async ({ page }) => {
    // Wait for header to load
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    
    // Find mobile menu button (should be hamburger menu)
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
    
    // Click to open menu
    await menuButton.click();
    
    // Wait for mobile menu to appear
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Verify all navigation links are present
    await expect(page.locator('[data-testid="mobile-menu"] >> text=בית')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"] >> text=סימולציות')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"] >> text=סימולציה חכמה')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"] >> text=הבנת הנקרא')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"] >> text=אודות')).toBeVisible();
  });

  test('Smart Simulation link exists in mobile menu', async ({ page }) => {
    // Open mobile menu
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await menuButton.click();
    
    // Find Smart Simulation link specifically
    const smartSimLink = page.locator('[data-testid="mobile-menu"] >> a[href="/adaptive-simulation"]');
    await expect(smartSimLink).toBeVisible();
    
    // Verify it has the Brain icon
    await expect(smartSimLink.locator('svg')).toBeVisible();
    
    // Verify the text
    await expect(smartSimLink).toContainText('סימולציה חכמה');
  });

  test('Mobile navigation link functionality', async ({ page }) => {
    // Open mobile menu
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await menuButton.click();
    
    // Click Smart Simulation link
    await page.locator('[data-testid="mobile-menu"] >> a[href="/adaptive-simulation"]').click();
    
    // Verify navigation
    await expect(page).toHaveURL('/adaptive-simulation');
    
    // Verify mobile menu closes after navigation (this might already be handled)
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
  });

  test('Touch target sizes are appropriate', async ({ page }) => {
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    
    // Check menu button size
    const buttonBox = await menuButton.boundingBox();
    expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    
    await menuButton.click();
    
    // Check mobile navigation link sizes
    const mobileNavLinks = page.locator('[data-testid="mobile-menu"] a');
    const linkCount = await mobileNavLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = mobileNavLinks.nth(i);
      const linkBox = await link.boundingBox();
      if (linkBox) {
        expect(linkBox.height).toBeGreaterThanOrEqual(40); // Slightly less strict for text links
      }
    }
  });
});

test.describe('Adaptive Simulation Mobile Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/adaptive-simulation');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Adaptive simulation page loads on mobile', async ({ page }) => {
    // Check main title
    await expect(page.locator('text=סימולציה מותאמת אישית')).toBeVisible();
    
    // Check configuration sections
    await expect(page.locator('text=הגדרות סימולציה')).toBeVisible();
    await expect(page.locator('text=בחר סוג סימולציה')).toBeVisible();
  });

  test('Question type dropdown works on mobile', async ({ page }) => {
    // Find the question type select by looking for the "סוג שאלות" label
    const questionTypeLabel = page.locator('text=סוג שאלות');
    await expect(questionTypeLabel).toBeVisible();
    
    // Find the select button (should be nearby the label)
    const selectButton = page.locator('button[role="combobox"]').first();
    await expect(selectButton).toBeVisible();
    
    await selectButton.click();
    
    // Wait for dropdown to open
    await page.waitForTimeout(500);
    
    // Check options are visible (look for specific option content)
    await expect(page.locator('[role="option"]').filter({ hasText: 'השלמת משפט' })).toBeVisible();
    await expect(page.locator('[role="option"]').filter({ hasText: 'ניסוח מחדש' })).toBeVisible();
    await expect(page.locator('[role="option"]').filter({ hasText: 'הבנת הנקרא' })).toBeVisible();
    await expect(page.locator('[role="option"]').filter({ hasText: 'מעורב' })).toBeVisible();
  });

  test('Simulation mode cards work on mobile', async ({ page }) => {
    // Look for practice mode card by finding its distinct text content
    const practiceCard = page.locator('text=מצב תרגול').locator('xpath=ancestor::div[contains(@class, "cursor-pointer")]').first();
    await expect(practiceCard).toBeVisible();
    
    // Look for exam mode card
    const examCard = page.locator('text=מצב מבחן').locator('xpath=ancestor::div[contains(@class, "cursor-pointer")]').first();
    await expect(examCard).toBeVisible();
    
    // Test clicking exam mode
    await examCard.click();
    
    // Should see blue border indicating selection
    await expect(examCard).toHaveClass(/border-blue-500/);
    
    // Test clicking practice mode
    await practiceCard.click();
    
    // Should see green border indicating selection
    await expect(practiceCard).toHaveClass(/border-green-500/);
  });

  test('Start simulation button is properly sized', async ({ page }) => {
    const startButton = page.locator('button').filter({ hasText: /התחל/ }).first();
    await expect(startButton).toBeVisible();
    
    const buttonBox = await startButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.width).toBeGreaterThanOrEqual(100);
  });
});

test.describe('Mobile Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Login page renders correctly on mobile', async ({ page }) => {
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Form inputs are properly sized for mobile', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Test functionality
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    await passwordInput.fill('testpassword');
    await expect(passwordInput).toHaveValue('testpassword');
    
    // Check sizing
    const emailBox = await emailInput.boundingBox();
    const passwordBox = await passwordInput.boundingBox();
    
    expect(emailBox?.height).toBeGreaterThanOrEqual(40);
    expect(passwordBox?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('Mobile Performance Tests', () => {
  test('Homepage loads quickly on mobile', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds on mobile
    expect(loadTime).toBeLessThan(3000);
    
    // Check that header is visible
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
  });

  test('Mobile menu opens quickly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const startTime = Date.now();
    
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await menuButton.click();
    
    await page.waitForSelector('[data-testid="mobile-menu"]');
    const menuOpenTime = Date.now() - startTime;
    
    // Menu should open within 300ms
    expect(menuOpenTime).toBeLessThan(300);
  });
});

test.describe('Mobile UX Tests', () => {
  test('Responsive breakpoints work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport size is mobile
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(768);
    
    // Desktop navigation should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();
    
    // Mobile menu button should be visible
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible();
  });

  test('Hebrew RTL layout works on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check HTML direction attribute
    const htmlDir = await page.evaluate(() => document.documentElement.dir);
    expect(htmlDir).toBe('rtl');
    
    // Open mobile menu and verify Hebrew text alignment
    const menuButton = page.locator('header button').filter({ has: page.locator('svg') }).first();
    await menuButton.click();
    
    const hebrewLink = page.locator('[data-testid="mobile-menu"] >> text=בית').first();
    await expect(hebrewLink).toBeVisible();
    
    // Check text direction properties
    const textDirection = await hebrewLink.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.direction;
    });
    
    // Should inherit RTL or be explicitly set to RTL
    expect(['rtl', 'inherit']).toContain(textDirection);
  });

  test('Scrolling works smoothly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Test scrolling
    await page.evaluate(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(500);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});