
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // דוחות משופרים
  reporter: [
    ['html', { open: 'never' }],
    ['./reporters/customReporter.ts'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list', { printSteps: true }]
  ],
  
  timeout: 30000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    }
  },
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    
    // התעלמות משגיאות HTTPS
    ignoreHTTPSErrors: true,
    
    // Viewport גלובלי
    viewport: { width: 1280, height: 720 },
    
    // הגדרות נוספות
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    
    // Headers מותאמים אישית
    extraHTTPHeaders: {
      'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8'
    }
  },

  projects: [
    // Desktop browsers
    {
      name: 'desktop-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'desktop-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'desktop-safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 }
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 }
      },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 }
      },
    },
    
    // Special configurations
    {
      name: 'desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'mobile',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 }
      },
    }
  ],

  // Local dev server - שימוש בVite (הפורמט הסטנדרטי)
  webServer: {
    command: 'cd .. && npm run dev || cd .. && npx vite',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    cwd: '..',
  },
  
  // התאמות לvisual regression
  snapshotDir: './screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-{arg}-{projectName}{ext}',
});
