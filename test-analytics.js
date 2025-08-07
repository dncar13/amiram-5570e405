// Simple Analytics Test Script
// Run this in browser console to test analytics events

console.log('🔍 Starting Analytics Test...');

// Test 1: Check if analytics service is loaded
if (typeof window.analyticsService !== 'undefined') {
  console.log('✅ Analytics service is loaded');
} else {
  console.error('❌ Analytics service not found');
  console.log('Available window properties:', Object.keys(window).filter(k => k.includes('analytic')));
}

// Test 2: Check dataLayer
if (window.dataLayer) {
  console.log('✅ DataLayer exists with', window.dataLayer.length, 'events');
  console.log('Recent dataLayer events:', window.dataLayer.slice(-5));
} else {
  console.error('❌ DataLayer not found');
}

// Test 3: Check GTM
if (window.gtm) {
  console.log('✅ GTM is loaded');
} else {
  console.log('⚠️ GTM not detected (may be blocked or still loading)');
}

// Test 4: Check GA4 gtag
if (window.gtag) {
  console.log('✅ gtag function is available');
} else {
  console.log('⚠️ gtag function not available');
}

// Test 5: Test a simple event
function testAuthEvent() {
  console.log('🧪 Testing auth event...');
  
  if (window.analyticsService) {
    window.analyticsService.trackAuth({
      event: 'login',
      method: 'email', 
      success: true,
      user_id: 'test_user_' + Date.now()
    });
    console.log('✅ Auth event sent');
  } else {
    console.error('❌ Cannot test auth event - analytics service not available');
  }
}

// Test 6: Test a premium event
function testPremiumEvent() {
  console.log('🧪 Testing premium event...');
  
  if (window.analyticsService) {
    window.analyticsService.trackPremium({
      plan_type: 'monthly',
      plan_price: 99,
      payment_status: 'completed',
      transaction_id: 'test_premium_' + Date.now()
    });
    console.log('✅ Premium event sent');
  } else {
    console.error('❌ Cannot test premium event - analytics service not available');
  }
}

// Test 7: Test simulation event
function testSimulationEvent() {
  console.log('🧪 Testing simulation event...');
  
  if (window.analyticsService) {
    const simulationId = 'test_sim_' + Date.now();
    window.analyticsService.trackSimulation({
      event: 'simulation_start',
      simulation_type: 'test',
      simulation_id: simulationId,
      difficulty_level: 'medium',
      question_count: 10
    });
    console.log('✅ Simulation event sent');
  } else {
    console.error('❌ Cannot test simulation event - analytics service not available');
  }
}

// Test 8: Check environment variables
function checkEnvironment() {
  console.log('🔧 Environment check:');
  console.log('- DEV mode:', import.meta?.env?.DEV);
  console.log('- Analytics debug:', localStorage.getItem('analytics_debug'));
  console.log('- GA4 Measurement ID:', window.analyticsService?.config?.measurementId || 'Not set');
  console.log('- GTM ID:', window.analyticsService?.config?.gtmId || 'Not set');
}

// Run all tests
function runAllTests() {
  console.log('\n🚀 Running all analytics tests...\n');
  
  checkEnvironment();
  testAuthEvent();
  setTimeout(testPremiumEvent, 1000);
  setTimeout(testSimulationEvent, 2000);
  
  setTimeout(() => {
    console.log('\n📊 Final dataLayer state:');
    console.log(window.dataLayer?.slice(-10) || 'No dataLayer');
  }, 3000);
}

// Export functions for manual testing
window.analyticsTest = {
  testAuthEvent,
  testPremiumEvent, 
  testSimulationEvent,
  checkEnvironment,
  runAllTests
};

console.log('✅ Analytics test utilities loaded. Run window.analyticsTest.runAllTests() to test all events.');