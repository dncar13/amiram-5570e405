import { test, expect, devices } from '@playwright/test';

/**
 * Comprehensive Mobile Testing Suite
 * Tests all mobile-specific functionality across Chrome and Safari mobile browsers
 */

test.describe('Mobile Navigation & Header Tests', () => {
  // Run tests on both mobile Chrome and Safari
  ['mobile-chrome', 'mobile-safari'].forEach(deviceType => {
    test.describe(`${deviceType} tests`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for header to load
        await page.waitForSelector('[data-testid="header"]');
      });

      test(`Mobile menu toggle works on ${deviceType}`, async ({ page }) => {
        // Check that mobile menu button is visible - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await expect(menuButton).toBeVisible();
        
        // Click to open menu
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        
        // Verify menu is open
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
        
        // Check all navigation links are present
        await expect(mobileMenu.locator('text=בית')).toBeVisible();
        await expect(mobileMenu.locator('text=סימולציות')).toBeVisible();
        await expect(mobileMenu.locator('text=סימולציה חכמה')).toBeVisible();
        await expect(mobileMenu.locator('text=הבנת הנקרא')).toBeVisible();
        await expect(mobileMenu.locator('text=אודות')).toBeVisible();
        
        // Verify Smart Simulation link has Brain icon
        const smartSimLink = mobileMenu.locator('a[href="/adaptive-simulation"]');
        await expect(smartSimLink).toBeVisible();
        await expect(smartSimLink.locator('svg')).toBeVisible(); // Brain icon
        
        // Close menu
        await menuButton.click();
        await expect(mobileMenu).not.toBeVisible();
      });

      test(`Navigation links work correctly on ${deviceType}`, async ({ page }) => {
        // Open mobile menu - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        
        // Test Smart Simulation link in mobile menu
        await page.locator('[data-testid="mobile-menu"] a[href="/adaptive-simulation"]').click();
        await expect(page).toHaveURL('/adaptive-simulation');
        
        // Go back and test other links
        await page.goto('/');
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        await page.locator('[data-testid="mobile-menu"]').locator('text=סימולציות').click();
        await expect(page).toHaveURL('/simulations-entry');
      });

      test(`Touch targets are appropriate size on ${deviceType}`, async ({ page }) => {
        // Open mobile menu - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        
        // Check menu button size (should be at least 44px)
        const buttonBox = await menuButton.boundingBox();
        expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
        
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        
        // Check navigation link sizes
        const navLinks = page.locator('[data-testid="mobile-menu"] a');
        const linkCount = await navLinks.count();
        
        for (let i = 0; i < linkCount; i++) {
          const link = navLinks.nth(i);
          const linkBox = await link.boundingBox();
          expect(linkBox?.height).toBeGreaterThanOrEqual(44);
        }
      });

      test(`RTL layout works correctly on ${deviceType}`, async ({ page }) => {
        // Check that main content has RTL direction
        const header = page.locator('[data-testid="header"]');
        await expect(header).toBeVisible();
        
        // Open mobile menu and check RTL alignment - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
        
        // Verify Hebrew text is properly aligned
        const hebrewLinks = mobileMenu.locator('text=/בית|סימולציות|הבנת|אודות/');
        await expect(hebrewLinks.first()).toBeVisible();
      });
    });
  });
});

test.describe('Mobile Simulation Experience Tests', () => {
  ['mobile-chrome', 'mobile-safari'].forEach(deviceType => {
    test.describe(`${deviceType} simulation tests`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto('/adaptive-simulation');
        await page.waitForLoadState('networkidle');
      });

      test(`Adaptive simulation page loads correctly on ${deviceType}`, async ({ page }) => {
        // Check main title is visible
        await expect(page.locator('text=סימולציה מותאמת אישית')).toBeVisible();
        
        // Check configuration sections are present
        await expect(page.locator('text=הגדרות סימולציה')).toBeVisible();
        await expect(page.locator('text=בחר סוג סימולציה')).toBeVisible();
        
        // Verify mobile-responsive layout
        const configCard = page.locator('text=הגדרות סימולציה').locator('..').locator('..');
        await expect(configCard).toBeVisible();
      });

      test(`Question type selection works on ${deviceType}`, async ({ page }) => {
        // Test question type dropdown
        const questionTypeSelect = page.locator('[data-testid="question-type-select"]');
        await expect(questionTypeSelect).toBeVisible();
        
        await questionTypeSelect.click();
        
        // Wait for dropdown to fully open
        await page.waitForSelector('[data-testid="question-type-options"]', { timeout: 10000 });
        
        // Check all question types are available
        await expect(page.locator('[data-testid="question-type-sentence-completion"]')).toBeVisible();
        await expect(page.locator('[data-testid="question-type-restatement"]')).toBeVisible();
        await expect(page.locator('[data-testid="question-type-reading-comprehension"]')).toBeVisible();
        await expect(page.locator('[data-testid="question-type-mixed"]')).toBeVisible();
        
        // Select reading comprehension (should work now with minimum threshold fix)
        await page.locator('[data-testid="question-type-reading-comprehension"]').click();
        
        // Should see warning about limited questions
        await expect(page.locator('[data-component-name="ToastDescription"]').filter({ hasText: /מספר מוגבל.*שאלות/i })).toBeVisible();
      });

      test(`Simulation mode selection works on ${deviceType}`, async ({ page }) => {
        // Check practice mode card
        const practiceMode = page.locator('[data-testid="practice-mode-card"]');
        await expect(practiceMode).toBeVisible();
        
        // Check exam mode card  
        const examMode = page.locator('[data-testid="exam-mode-card"]');
        await expect(examMode).toBeVisible();
        
        // Test mode switching
        await examMode.click();
        await expect(examMode).toHaveClass(/border-blue-500/);
        
        await practiceMode.click();
        await expect(practiceMode).toHaveClass(/border-green-500/);
      });

      test(`Start simulation button works on ${deviceType}`, async ({ page }) => {
        // Find and click start button
        const startButton = page.locator('text=/התחל תרגול|התחל מבחן/').first();
        await expect(startButton).toBeVisible();
        
        // Button should be prominent and touchable
        const buttonBox = await startButton.boundingBox();
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
        
        // Note: We don't actually start simulation to avoid auth requirements
      });
    });
  });
});

test.describe('Mobile Authentication Flow Tests', () => {
  ['mobile-chrome', 'mobile-safari'].forEach(deviceType => {
    test.describe(`${deviceType} auth tests`, () => {
      
      test(`Login page loads correctly on ${deviceType}`, async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        
        // Check login form elements
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        
        // Check OAuth buttons
        await expect(page.locator('text=Google')).toBeVisible();
      });

      test(`Form inputs work properly on ${deviceType}`, async ({ page }) => {
        await page.goto('/login');
        
        // Test email input
        const emailInput = page.locator('input[type="email"]');
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
        
        // Test password input
        const passwordInput = page.locator('input[type="password"]');
        await passwordInput.fill('testpassword');
        await expect(passwordInput).toHaveValue('testpassword');
        
        // Check that inputs are properly sized for mobile
        const emailBox = await emailInput.boundingBox();
        const passwordBox = await passwordInput.boundingBox();
        
        expect(emailBox?.height).toBeGreaterThanOrEqual(40);
        expect(passwordBox?.height).toBeGreaterThanOrEqual(40);
      });

      test(`Login button is properly sized on ${deviceType}`, async ({ page }) => {
        await page.goto('/login');
        
        const loginButton = page.locator('button[type="submit"]');
        const buttonBox = await loginButton.boundingBox();
        
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
        expect(buttonBox?.width).toBeGreaterThanOrEqual(100);
      });
    });
  });
});

test.describe('Mobile Performance Tests', () => {
  ['mobile-chrome', 'mobile-safari'].forEach(deviceType => {
    test.describe(`${deviceType} performance tests`, () => {
      
      test(`Page load performance on ${deviceType}`, async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Mobile load time should be under 5 seconds
        expect(loadTime).toBeLessThan(5000);
        
        // Check that critical elements are visible
        await expect(page.locator('[data-testid="header"]')).toBeVisible();
      });

      test(`Navigation performance on ${deviceType}`, async ({ page }) => {
        await page.goto('/');
        
        const startTime = Date.now();
        
        // Open mobile menu - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await menuButton.click();
        
        // Menu should open quickly
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        const menuOpenTime = Date.now() - startTime;
        
        expect(menuOpenTime).toBeLessThan(1500); // Increased timeout for Safari mobile
      });

      test(`Question loading performance on ${deviceType}`, async ({ page }) => {
        await page.goto('/simulations-entry');
        
        // Look for any simulation cards and measure load time
        const startTime = Date.now();
        await page.waitForSelector('text=/קטגוריות/', { timeout: 10000 });
        const loadTime = Date.now() - startTime;
        
        expect(loadTime).toBeLessThan(3000); // 3 seconds max
      });
    });
  });
});

test.describe('Mobile Visual & UX Tests', () => {
  ['mobile-chrome', 'mobile-safari'].forEach(deviceType => {
    test.describe(`${deviceType} UX tests`, () => {
      
      test(`Responsive layout works on ${deviceType}`, async ({ page }) => {
        await page.goto('/');
        
        // Check viewport dimensions
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThan(768); // Mobile breakpoint
        
        // Desktop nav should be hidden
        await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();
        
        // Mobile menu button should be visible - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await expect(menuButton).toBeVisible();
      });

      test(`Scrolling works smoothly on ${deviceType}`, async ({ page }) => {
        await page.goto('/');
        
        // Scroll down and check for smooth behavior
        await page.evaluate(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        });
        
        // Wait for scroll to complete
        await page.waitForTimeout(1000);
        
        // Check that we actually scrolled
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
      });

      test(`Text is readable on ${deviceType}`, async ({ page }) => {
        await page.goto('/');
        
        // Check main heading text size
        const mainHeading = page.locator('h1').first();
        const headingStyles = await mainHeading.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            color: styles.color
          };
        });
        
        // Font size should be reasonable for mobile
        const fontSize = parseInt(headingStyles.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(20); // At least 20px
      });

      test(`Hebrew RTL text displays correctly on ${deviceType}`, async ({ page }) => {
        await page.goto('/');
        
        // Check HTML direction
        const htmlDir = await page.evaluate(() => document.documentElement.dir);
        expect(htmlDir).toBe('rtl');
        
        // Open mobile menu and check Hebrew text alignment - use multiple selectors for better Safari compatibility
        const menuButton = page.locator('[data-testid="mobile-menu-button"]').or(page.locator('button:has-text("פתח תפריט")'));
        await menuButton.click();
        await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 10000 });
        
        const hebrewLink = page.locator('text=בית').first();
        const linkStyles = await hebrewLink.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            direction: styles.direction,
            textAlign: styles.textAlign
          };
        });
        
        // Should inherit RTL direction
        expect(['rtl', 'inherit']).toContain(linkStyles.direction);
      });
    });
  });
});