import { chromium } from '@playwright/test';

/**
 * Global teardown for analytics E2E tests
 * Cleans up after duplicate event detection testing
 */
async function globalTeardown() {
  console.log('🧹 Cleaning up analytics E2E test environment...');
  
  // Launch a browser for cleanup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the app for cleanup
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Clear all test data
    await page.evaluate(() => {
      // Clear analytics tracking data
      localStorage.removeItem('amiram_tracked_events');
      localStorage.removeItem('analytics_debug');
      localStorage.removeItem('utm_params');
      sessionStorage.clear();
      
      console.log('🧹 Cleaned up all test data');
    });
    
    // Report final statistics
    const finalEventCount = await page.evaluate(() => {
      const events = localStorage.getItem('amiram_tracked_events');
      return events ? Object.keys(JSON.parse(events)).length : 0;
    });
    
    console.log(`📊 Final tracked event count: ${finalEventCount}`);
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.warn('⚠️ Global teardown encountered an error:', error);
    // Don't throw - teardown errors shouldn't fail the entire test suite
  } finally {
    await browser.close();
  }
}

export default globalTeardown;