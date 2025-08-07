import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for analytics E2E tests
 * Prepares the environment for duplicate event detection testing
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up analytics E2E test environment...');
  
  // Launch a browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Setup test environment
    const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3000';
    
    // Navigate to the app to ensure it's running
    console.log(`📡 Checking if app is running at ${baseURL}...`);
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Clear any existing analytics data
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear analytics tracking data specifically
      localStorage.removeItem('amiram_tracked_events');
      localStorage.removeItem('utm_params');
      sessionStorage.removeItem('utm_params');
      
      console.log('🧹 Cleared all local storage and session storage');
    });
    
    // Verify analytics service is available
    const analyticsAvailable = await page.evaluate(() => {
      return typeof window.analyticsService !== 'undefined';
    });
    
    if (!analyticsAvailable) {
      console.warn('⚠️ Analytics service not available - tests may fail');
    } else {
      console.log('✅ Analytics service is available');
    }
    
    // Setup debug mode for all tests
    await page.addInitScript(() => {
      localStorage.setItem('analytics_debug', 'true');
      console.log('🔍 Analytics debug mode enabled for tests');
    });
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;