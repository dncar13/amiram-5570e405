import { test, expect, Page } from '@playwright/test';

/**
 * End-to-End tests for duplicate event prevention
 * These tests verify that conversion events fire exactly once in GA4 DebugView
 */

// Test configuration
const TEST_CONFIG = {
  GA4_DEBUG_ENDPOINT: 'https://www.google-analytics.com/debug/mp/collect',
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual measurement ID
  TEST_USER_EMAIL: 'test+e2e@amiram.net',
  TEST_USER_PASSWORD: 'TestPassword123!',
  SANDBOX_PAYMENT_DETAILS: {
    cardNumber: '4580458045804580', // CardCom test card
    expiryMonth: '12',
    expiryYear: '25',
    cvv: '123'
  }
};

// Helper to intercept and count GA4 events
async function interceptGA4Events(page: Page): Promise<Map<string, number>> {
  const eventCounts = new Map<string, number>();

  await page.route('**/*google-analytics.com/**', (route, request) => {
    const url = request.url();
    
    // Parse GA4 events from the request
    if (url.includes('collect') || url.includes('debug')) {
      try {
        const body = request.postData();
        if (body) {
          // GA4 events are sent as URL-encoded parameters, not JSON
          const urlParams = new URLSearchParams(body);
          const eventName = urlParams.get('en'); // event name
          const transactionId = urlParams.get('tid') || urlParams.get('transaction_id');
          
          // Also check for events in GTM dataLayer format
          if (body.includes('event') && body.includes('purchase')) {
            const eventMatches = body.match(/event[=:][\s]*['"]*([^'",\s&]+)/i);
            const tidMatches = body.match(/transaction_id[=:][\s]*['"]*([^'",\s&]+)/i);
            
            if (eventMatches && eventMatches[1]) {
              const parsedEventName = eventMatches[1];
              const parsedTransactionId = tidMatches ? tidMatches[1] : null;
              
              if ((parsedEventName === 'purchase' || parsedEventName === 'subscription_upgrade') && parsedTransactionId) {
                const eventKey = `${parsedEventName}_${parsedTransactionId}`;
                eventCounts.set(eventKey, (eventCounts.get(eventKey) || 0) + 1);
                
                console.log(`📊 GA4 Event Intercepted: ${eventKey} (Count: ${eventCounts.get(eventKey)})`);
              }
            }
          }
          
          if (eventName === 'purchase' && transactionId) {
            const eventKey = `${eventName}_${transactionId}`;
            eventCounts.set(eventKey, (eventCounts.get(eventKey) || 0) + 1);
            
            console.log(`📊 GA4 Event Intercepted: ${eventKey} (Count: ${eventCounts.get(eventKey)})`);
          }

          // Track auth events too
          if (eventName === 'login' || eventName === 'sign_up') {
            const eventKey = eventName;
            eventCounts.set(eventKey, (eventCounts.get(eventKey) || 0) + 1);
            console.log(`📊 GA4 Auth Event Intercepted: ${eventKey} (Count: ${eventCounts.get(eventKey)})`);
          }

          // Track simulation events
          if (eventName === 'simulation_start' || eventName === 'simulation_complete') {
            const simulationId = urlParams.get('simulation_id') || 'unknown';
            const eventKey = `${eventName}_${simulationId}`;
            eventCounts.set(eventKey, (eventCounts.get(eventKey) || 0) + 1);
            console.log(`📊 GA4 Simulation Event Intercepted: ${eventKey} (Count: ${eventCounts.get(eventKey)})`);
          }
        }
      } catch (error) {
        console.warn('Failed to parse GA4 event data:', error);
      }
    }
    
    route.continue();
  });

  return eventCounts;
}

// Helper to create a unique test user
async function createTestUser(page: Page): Promise<string> {
  const timestamp = Date.now();
  const testEmail = `test+e2e+${timestamp}@amiram.net`;
  
  console.log(`🧪 Creating test user: ${testEmail}`);
  
  await page.goto('/auth');
  await page.click('[data-testid="signup-tab"]');
  
  await page.fill('[data-testid="email-input"]', testEmail);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USER_PASSWORD);
  await page.fill('[data-testid="confirm-password-input"]', TEST_CONFIG.TEST_USER_PASSWORD);
  
  await page.click('[data-testid="signup-button"]');
  
  // Wait for successful signup
  await expect(page.locator('[data-testid="signup-success"]')).toBeVisible({ timeout: 10000 });
  
  return testEmail;
}

// Helper to simulate CardCom sandbox payment
async function completeCardComPayment(page: Page, planType: string = 'monthly'): Promise<string> {
  console.log(`💳 Completing CardCom sandbox payment for ${planType} plan`);
  
  // Navigate to premium page
  await page.goto('/premium');
  
  // Select plan
  await page.click(`[data-testid="select-plan-${planType}"]`);
  
  // Wait for payment form to load
  await expect(page.locator('[data-testid="cardcom-payment-form"]')).toBeVisible();
  
  // Extract transaction ID from the page for verification
  const transactionId = await page.evaluate(() => {
    return window.localStorage.getItem('pending_transaction_id') || 
           `test_${Date.now()}`;
  });
  
  // Click pay button to redirect to CardCom
  await page.click('[data-testid="pay-button"]');
  
  // Wait for CardCom sandbox page
  await page.waitForURL('**/cardcom.co.il/**', { timeout: 30000 });
  
  // Fill payment details (CardCom sandbox)
  await page.fill('[data-testid="card-number"]', TEST_CONFIG.SANDBOX_PAYMENT_DETAILS.cardNumber);
  await page.fill('[data-testid="expiry-month"]', TEST_CONFIG.SANDBOX_PAYMENT_DETAILS.expiryMonth);
  await page.fill('[data-testid="expiry-year"]', TEST_CONFIG.SANDBOX_PAYMENT_DETAILS.expiryYear);
  await page.fill('[data-testid="cvv"]', TEST_CONFIG.SANDBOX_PAYMENT_DETAILS.cvv);
  
  // Submit payment
  await page.click('[data-testid="submit-payment"]');
  
  // Wait for success redirect back to our site
  await page.waitForURL('**/thank-you**', { timeout: 30000 });
  
  console.log(`✅ Payment completed successfully. Transaction ID: ${transactionId}`);
  return transactionId;
}

test.describe('Analytics Event Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Enable analytics debug mode and force consent
    await page.addInitScript(() => {
      localStorage.setItem('analytics_debug', 'true');
      localStorage.setItem('VITE_ENABLE_ANALYTICS_DEV', 'true');
      
      // Force GTM and GA4 consent
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    });
  });

  test('Auth Tracking: should fire login events correctly', async ({ page }) => {
    const eventCounts = await interceptGA4Events(page);
    
    // Navigate to login page
    await page.goto('/login');
    
    // Perform email login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for events
    await page.waitForTimeout(3000);
    
    // Verify login events
    const loginEventCount = eventCounts.get('login') || 0;
    expect(loginEventCount).toBeGreaterThan(0);
    
    console.log('✅ Auth event test passed:', { loginEvents: loginEventCount });
  });

  test('Simulation Tracking: should fire start and complete events', async ({ page }) => {
    const eventCounts = await interceptGA4Events(page);
    
    // Login first (simplified)
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for login
    await page.waitForTimeout(2000);
    
    // Start a simulation
    await page.goto('/simulation/topic/grammar/easy');
    await page.waitForTimeout(5000);
    
    // Check for simulation start event
    const simulationStartCount = Array.from(eventCounts.entries())
      .filter(([key]) => key.startsWith('simulation_start')).length;
    
    expect(simulationStartCount).toBeGreaterThan(0);
    
    console.log('✅ Simulation event test passed:', { 
      simulationStartEvents: simulationStartCount 
    });
  });

  test('Premium Tracking: should fire subscription upgrade events', async ({ page }) => {
    const eventCounts = await interceptGA4Events(page);
    
    // Navigate to premium page
    await page.goto('/premium');
    
    // Wait for page load and events
    await page.waitForTimeout(3000);
    
    // Trigger premium upgrade event manually for testing
    await page.evaluate(() => {
      if (window.analyticsService) {
        window.analyticsService.trackPremium({
          plan_type: 'monthly',
          plan_price: 99,
          payment_status: 'completed',
          transaction_id: `test_premium_${Date.now()}`
        });
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Check for subscription events
    const subscriptionEvents = Array.from(eventCounts.entries())
      .filter(([key]) => key.includes('subscription_upgrade') || key.includes('purchase'));
    
    expect(subscriptionEvents.length).toBeGreaterThan(0);
    
    console.log('✅ Premium event test passed:', { subscriptionEvents });
  });

  test('should fire purchase event exactly once for CardCom payment', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    
    // Act
    const transactionId = await completeCardComPayment(page, 'monthly');
    
    // Wait for all events to be sent
    await page.waitForTimeout(5000);
    
    // Assert
    const purchaseEventKey = `purchase_${transactionId}`;
    const eventCount = eventCounts.get(purchaseEventKey) || 0;
    
    console.log(`📊 Final event counts:`, Object.fromEntries(eventCounts));
    
    expect(eventCount).toBe(1);
    
    // Verify no duplicate events exist
    const duplicateEvents = Array.from(eventCounts.entries()).filter(([key, count]) => 
      key.startsWith('purchase_') && count > 1
    );
    
    expect(duplicateEvents).toHaveLength(0);
  });

  test('should not fire duplicate events on page refresh', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    const transactionId = await completeCardComPayment(page, 'weekly');
    
    // Wait for initial events
    await page.waitForTimeout(3000);
    const initialCount = eventCounts.get(`purchase_${transactionId}`) || 0;
    
    // Act - Refresh the thank you page multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForTimeout(2000);
    }
    
    // Assert
    const finalCount = eventCounts.get(`purchase_${transactionId}`) || 0;
    
    expect(initialCount).toBe(1);
    expect(finalCount).toBe(1); // Should remain 1 after refreshes
    
    console.log(`🔄 Event count after ${3} refreshes: ${finalCount} (should remain 1)`);
  });

  test('should not fire duplicate events on navigation back and forth', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    const transactionId = await completeCardComPayment(page, 'daily');
    
    // Wait for initial event
    await page.waitForTimeout(3000);
    const initialCount = eventCounts.get(`purchase_${transactionId}`) || 0;
    
    // Act - Navigate away and back
    await page.goto('/simulations-entry');
    await page.waitForTimeout(1000);
    
    await page.goto('/premium');
    await page.waitForTimeout(1000);
    
    await page.goto('/thank-you');
    await page.waitForTimeout(2000);
    
    // Assert
    const finalCount = eventCounts.get(`purchase_${transactionId}`) || 0;
    
    expect(initialCount).toBe(1);
    expect(finalCount).toBe(1); // Should remain 1 after navigation
    
    console.log(`🔄 Event count after navigation: ${finalCount} (should remain 1)`);
  });

  test('should handle multiple users without cross-contamination', async ({ page, context }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    
    // Create first user and complete purchase
    const testEmail1 = await createTestUser(page);
    const transactionId1 = await completeCardComPayment(page, 'monthly');
    
    // Create second user in new page
    const page2 = await context.newPage();
    const eventCounts2 = await interceptGA4Events(page2);
    
    const testEmail2 = await createTestUser(page2);
    const transactionId2 = await completeCardComPayment(page2, 'quarterly');
    
    // Wait for all events
    await page.waitForTimeout(3000);
    await page2.waitForTimeout(3000);
    
    // Assert
    const event1Count = eventCounts.get(`purchase_${transactionId1}`) || 0;
    const event2Count = eventCounts2.get(`purchase_${transactionId2}`) || 0;
    
    expect(event1Count).toBe(1);
    expect(event2Count).toBe(1);
    
    // Verify transaction IDs are different
    expect(transactionId1).not.toBe(transactionId2);
    
    console.log(`👥 Multi-user test results:`, {
      user1Transaction: transactionId1,
      user1EventCount: event1Count,
      user2Transaction: transactionId2, 
      user2EventCount: event2Count
    });
    
    await page2.close();
  });

  test('should enforce 24-hour deduplication window', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    
    // Mock an old event in localStorage (older than 24 hours)
    await page.addInitScript(() => {
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      const oldEvents = {
        'purchase_test_old_transaction': oldTimestamp
      };
      localStorage.setItem('amiram_tracked_events', JSON.stringify(oldEvents));
    });
    
    // Act - Complete a new purchase
    const transactionId = await completeCardComPayment(page, 'weekly');
    
    // Also try to simulate the old transaction (should be allowed since it's old)
    await page.evaluate((oldTxId) => {
      // Simulate tracking an event with the old transaction ID
      window.analyticsService?.trackEvent({
        event: 'purchase',
        transaction_id: oldTxId,
        plan_type: 'weekly',
        plan_price: 49
      });
    }, 'test_old_transaction');
    
    await page.waitForTimeout(5000);
    
    // Assert
    const newEventCount = eventCounts.get(`purchase_${transactionId}`) || 0;
    const oldEventCount = eventCounts.get('purchase_test_old_transaction') || 0;
    
    expect(newEventCount).toBe(1);
    expect(oldEventCount).toBe(1); // Old event should be allowed since it's past 24h window
    
    console.log(`⏰ 24-hour window test:`, {
      newTransaction: transactionId,
      newEventCount,
      oldEventCount
    });
  });

  test('should reject events with invalid checksum', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    
    // Act - Try to send an event with invalid checksum
    await page.evaluate(() => {
      // Simulate tracking an event with invalid checksum
      window.analyticsService?.trackEvent({
        event: 'purchase',
        transaction_id: 'invalid_checksum_test',
        checksum: 'invalid_checksum_value',
        plan_type: 'monthly',
        plan_price: 99,
        timestamp: Date.now(),
        user_id: 'test_user'
      });
    });
    
    await page.waitForTimeout(3000);
    
    // Assert
    const invalidEventCount = eventCounts.get('purchase_invalid_checksum_test') || 0;
    
    expect(invalidEventCount).toBe(0); // Should be rejected
    
    // Check for security violation event
    const securityEvents = Array.from(eventCounts.keys()).filter(key => 
      key.includes('security_violation')
    );
    
    expect(securityEvents.length).toBeGreaterThan(0);
    
    console.log(`🔐 Invalid checksum test: Event blocked, security events: ${securityEvents.length}`);
  });
});

test.describe('Refund Event Tracking', () => {
  test('should track refund events with negative values', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    const originalTransactionId = await completeCardComPayment(page, 'monthly');
    
    // Wait for purchase event
    await page.waitForTimeout(3000);
    
    // Simulate refund process
    await page.evaluate(async (originalTxId) => {
      await window.analyticsService?.trackRefund({
        original_transaction_id: originalTxId,
        refund_transaction_id: `refund_${originalTxId}_${Date.now()}`,
        refund_amount: 50, // Partial refund
        original_amount: 99,
        currency: 'ILS',
        refund_reason: 'subscription_cancellation',
        plan_type: 'monthly'
      });
    }, originalTransactionId);
    
    await page.waitForTimeout(3000);
    
    // Assert
    const purchaseEventCount = eventCounts.get(`purchase_${originalTransactionId}`) || 0;
    const refundEvents = Array.from(eventCounts.keys()).filter(key => key.startsWith('refund_'));
    
    expect(purchaseEventCount).toBe(1);
    expect(refundEvents.length).toBe(1);
    
    // Verify refund has negative value
    const refundEventData = await page.evaluate(() => {
      return window.dataLayer?.find((item: any) => 
        item.event === 'refund'
      );
    });
    
    expect(refundEventData?.value).toBeLessThan(0);
    
    console.log(`💰 Refund event test:`, {
      purchaseCount: purchaseEventCount,
      refundEvents: refundEvents.length,
      refundValue: refundEventData?.value
    });
  });

  test('should not fire duplicate refund events', async ({ page }) => {
    // Arrange
    const eventCounts = await interceptGA4Events(page);
    const testEmail = await createTestUser(page);
    const originalTransactionId = await completeCardComPayment(page, 'quarterly');
    
    const refundTransactionId = `refund_${originalTransactionId}_${Date.now()}`;
    
    // Act - Try to track the same refund multiple times
    for (let i = 0; i < 3; i++) {
      await page.evaluate(async (data) => {
        await window.analyticsService?.trackRefund({
          original_transaction_id: data.originalTxId,
          refund_transaction_id: data.refundTxId,
          refund_amount: 150,
          original_amount: 299,
          currency: 'ILS',
          refund_reason: 'subscription_cancellation',
          plan_type: 'quarterly'
        });
      }, { originalTxId: originalTransactionId, refundTxId: refundTransactionId });
      
      await page.waitForTimeout(1000);
    }
    
    await page.waitForTimeout(3000);
    
    // Assert
    const refundEventCount = eventCounts.get(`refund_${refundTransactionId}`) || 0;
    
    expect(refundEventCount).toBe(1); // Should only fire once despite 3 attempts
    
    console.log(`🔄 Duplicate refund prevention: ${refundEventCount} events (should be 1)`);
  });
});