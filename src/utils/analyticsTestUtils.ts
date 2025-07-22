// Analytics Testing Utilities for Amiram Academy
// Comprehensive testing and validation of analytics tracking

import analyticsService from '@/services/analytics';

interface AnalyticsTestResults {
  gtmLoaded: boolean;
  dataLayerExists: boolean;
  eventCount: number;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// Test if GTM is properly loaded
export const testGTMIntegration = (): AnalyticsTestResults => {
  const results: AnalyticsTestResults = {
    gtmLoaded: false,
    dataLayerExists: false,
    eventCount: 0,
    errors: [],
    warnings: [],
    recommendations: []
  };

  try {
    // Check if dataLayer exists
    if (typeof window !== 'undefined' && window.dataLayer) {
      results.dataLayerExists = true;
      results.eventCount = window.dataLayer.length;
      
      // Check if GTM container is loaded
      const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
      if (gtmScript) {
        results.gtmLoaded = true;
      } else {
        results.warnings.push('GTM script not found in DOM');
      }
      
      // Check if GTM container ID is correct
      const gtmContainer = document.querySelector('script[src*="GTM-M95H8KJP"]');
      if (!gtmContainer) {
        results.warnings.push('GTM container ID GTM-M95H8KJP not found');
      }
      
      // Validate dataLayer events
      if (results.eventCount === 0) {
        results.warnings.push('No events found in dataLayer');
      }
      
    } else {
      results.errors.push('window.dataLayer is not available');
    }
    
    // Check noscript fallback - more thorough check
    const noscriptElements = document.querySelectorAll('noscript');
    let noscriptFound = false;
    
    noscriptElements.forEach(noscript => {
      const iframe = noscript.querySelector('iframe[src*="googletagmanager.com/ns.html"]');
      if (iframe) {
        noscriptFound = true;
      }
    });
    
    // Also check if noscript contains the GTM container ID
    const noscriptWithContainerId = Array.from(noscriptElements).some(noscript => 
      noscript.innerHTML.includes('GTM-M95H8KJP')
    );
    
    if (!noscriptFound && !noscriptWithContainerId) {
      results.warnings.push('GTM noscript fallback not found');
    } else if (!noscriptWithContainerId) {
      results.warnings.push('GTM noscript found but container ID not verified');
    }
    
  } catch (error) {
    results.errors.push(`GTM integration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return results;
};

// Test analytics service functionality
export const testAnalyticsService = (): AnalyticsTestResults => {
  const results: AnalyticsTestResults = {
    gtmLoaded: true,
    dataLayerExists: true,
    eventCount: 0,
    errors: [],
    warnings: [],
    recommendations: []
  };

  try {
    // Test basic event tracking
    analyticsService.trackEvent({
      event: 'test_event',
      test_parameter: 'test_value'
    });
    
    // Test user ID setting
    analyticsService.setUserId('test_user_123');
    
    // Test user properties
    analyticsService.setUserProperties({
      test_property: 'test_value',
      subscription_status: 'test'
    });
    
    // Test consent management
    analyticsService.consent(true);
    
    // Test error tracking
    analyticsService.trackError({
      event: 'test_error',
      error_type: 'test',
      error_message: 'Test error message'
    });
    
    results.eventCount = window.dataLayer?.length || 0;
    
    if (results.eventCount < 5) {
      results.warnings.push('Expected more events in dataLayer after service tests');
    }
    
  } catch (error) {
    results.errors.push(`Analytics service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return results;
};

// Test specific event types
export const testEventTypes = (): Record<string, boolean> => {
  const eventTests: Record<string, boolean> = {};
  
  try {
    const initialDataLayerLength = window.dataLayer?.length || 0;
    
    // Test authentication events
    analyticsService.trackAuth({
      event: 'test_login',
      method: 'email',
      success: true,
      user_id: 'test_user'
    });
    eventTests.auth_tracking = (window.dataLayer?.length || 0) > initialDataLayerLength;
    
    // Test e-commerce events
    analyticsService.trackEcommerce({
      event: 'test_purchase',
      currency: 'ILS',
      value: 99,
      transaction_id: 'test_123',
      items: [{
        item_id: 'premium_monthly',
        item_name: 'Premium Subscription',
        category: 'subscription',
        price: 99,
        quantity: 1
      }]
    });
    eventTests.ecommerce_tracking = (window.dataLayer?.length || 0) > initialDataLayerLength + 1;
    
    // Test premium events
    analyticsService.trackPremium({
      event: 'test_premium',
      plan_type: 'monthly',
      plan_price: 99,
      payment_status: 'completed'
    });
    eventTests.premium_tracking = (window.dataLayer?.length || 0) > initialDataLayerLength + 2;
    
    // Test simulation events
    analyticsService.trackSimulation({
      event: 'test_simulation',
      simulation_type: 'topic_based',
      simulation_id: 'test_simulation_1',
      score: 85,
      completion_rate: 100
    });
    eventTests.simulation_tracking = (window.dataLayer?.length || 0) > initialDataLayerLength + 3;
    
  } catch (error) {
    console.error('Event types test failed:', error);
  }
  
  return eventTests;
};

// Validate event structure
export const validateEventStructure = (event: any): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!event.event) {
    issues.push('Missing required "event" property');
  }
  
  if (event.event && typeof event.event !== 'string') {
    issues.push('Event name must be a string');
  }
  
  if (event.timestamp && (typeof event.timestamp !== 'number' || event.timestamp <= 0)) {
    issues.push('Invalid timestamp format');
  }
  
  if (event.user_id && typeof event.user_id !== 'string') {
    issues.push('user_id must be a string');
  }
  
  if (event.session_id && typeof event.session_id !== 'string') {
    issues.push('session_id must be a string');
  }
  
  // Validate e-commerce events
  if (event.event === 'purchase') {
    if (!event.value || typeof event.value !== 'number') {
      issues.push('Purchase events must have a numeric value');
    }
    if (!event.currency || typeof event.currency !== 'string') {
      issues.push('Purchase events must have a currency string');
    }
    if (event.items && !Array.isArray(event.items)) {
      issues.push('Items must be an array');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

// Monitor dataLayer for event validation
export const startDataLayerMonitoring = (): () => void => {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('DataLayer monitoring not available');
    return () => {};
  }

  const originalPush = window.dataLayer.push;
  const eventLog: any[] = [];
  
  window.dataLayer.push = function(...args: any[]) {
    // Log all events for debugging
    args.forEach(event => {
      if (typeof event === 'object' && event.event) {
        eventLog.push({
          timestamp: Date.now(),
          event: event.event,
          data: event
        });
        
        // Validate event structure
        const validation = validateEventStructure(event);
        if (!validation.valid) {
          console.warn('Analytics Event Validation Issues:', validation.issues, event);
        } else {
          console.log('✅ Analytics Event Tracked:', event.event, event);
        }
      }
    });
    
    return originalPush.apply(this, args);
  };
  
  // Return cleanup function
  return () => {
    window.dataLayer.push = originalPush;
    console.log('DataLayer monitoring stopped. Events logged:', eventLog.length);
  };
};

// Generate analytics health report
export const generateAnalyticsHealthReport = (): string => {
  const gtmTest = testGTMIntegration();
  const serviceTest = testAnalyticsService();
  const eventTests = testEventTypes();
  
  let report = '🔍 Analytics Health Report\n';
  report += '========================\n\n';
  
  // GTM Integration
  report += '📊 GTM Integration:\n';
  report += `✅ GTM Loaded: ${gtmTest.gtmLoaded}\n`;
  report += `✅ DataLayer Exists: ${gtmTest.dataLayerExists}\n`;
  report += `📈 Event Count: ${gtmTest.eventCount}\n`;
  
  if (gtmTest.errors.length > 0) {
    report += `❌ Errors: ${gtmTest.errors.join(', ')}\n`;
  }
  
  if (gtmTest.warnings.length > 0) {
    report += `⚠️ Warnings: ${gtmTest.warnings.join(', ')}\n`;
  }
  
  report += '\n';
  
  // Service Testing
  report += '⚙️ Analytics Service:\n';
  report += `📤 Events Sent: ${serviceTest.eventCount - gtmTest.eventCount}\n`;
  
  if (serviceTest.errors.length > 0) {
    report += `❌ Service Errors: ${serviceTest.errors.join(', ')}\n`;
  }
  
  report += '\n';
  
  // Event Type Testing
  report += '📝 Event Type Tests:\n';
  Object.entries(eventTests).forEach(([testName, passed]) => {
    report += `${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASS' : 'FAIL'}\n`;
  });
  
  report += '\n';
  
  // Recommendations
  report += '💡 Recommendations:\n';
  if (!gtmTest.gtmLoaded) {
    report += '• Check GTM container ID and script placement\n';
  }
  if (gtmTest.eventCount === 0) {
    report += '• Initialize analytics tracking on page load\n';
  }
  if (Object.values(eventTests).includes(false)) {
    report += '• Review failed event type implementations\n';
  }
  
  return report;
};

// Development mode helpers
export const enableAnalyticsDebugMode = (): void => {
  if (typeof window !== 'undefined') {
    // Enable GTM debug mode
    localStorage.setItem('gtm_debug', 'true');
    
    // Start dataLayer monitoring
    const stopMonitoring = startDataLayerMonitoring();
    
    // Add to window for cleanup
    (window as any).stopAnalyticsDebugMode = stopMonitoring;
    
    console.log('🐛 Analytics Debug Mode Enabled');
    console.log('Run generateAnalyticsHealthReport() to see current status');
    console.log('Run stopAnalyticsDebugMode() to disable monitoring');
  }
};

export const disableAnalyticsDebugMode = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gtm_debug');
    
    if ((window as any).stopAnalyticsDebugMode) {
      (window as any).stopAnalyticsDebugMode();
      delete (window as any).stopAnalyticsDebugMode;
    }
    
    console.log('🔇 Analytics Debug Mode Disabled');
  }
};

// Debug mode helper functions
export const enableAnalyticsDashboard = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('amiram_analytics_debug', 'true');
    console.log('✅ Analytics Dashboard enabled. Reload the page to see it.');
  }
};

export const disableAnalyticsDashboard = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('amiram_analytics_debug');
    console.log('❌ Analytics Dashboard disabled. Reload the page to hide it.');
  }
};

// Export all functions for window access in development
if (typeof window !== 'undefined') {
  (window as any).analyticsTest = {
    testGTMIntegration,
    testAnalyticsService,
    testEventTypes,
    validateEventStructure,
    generateAnalyticsHealthReport,
    enableAnalyticsDebugMode,
    disableAnalyticsDebugMode,
    startDataLayerMonitoring,
    enableAnalyticsDashboard,
    disableAnalyticsDashboard
  };
  
  if (import.meta.env.DEV) {
    console.log('🧪 Analytics Test Utils loaded. Access via window.analyticsTest');
  }
}