#!/usr/bin/env node

// Test script to validate analytics event fixes
// Run this in the browser console to test all event types

console.log('🧪 Testing Analytics Event Fixes');
console.log('================================');

// Test Auth Events
function testAuthEvents() {
  console.log('\n📝 Testing Auth Events...');
  
  // Test login event
  window.analyticsTest.testGTMIntegration();
  
  // Simulate auth events directly
  if (window.gtag) {
    window.gtag('event', 'login', {
      method: 'password',
      user_id: 'test_user_123'
    });
    console.log('✅ Login event fired with method parameter');
    
    window.gtag('event', 'sign_up', {
      method: 'email',
      user_id: 'test_user_124'
    });
    console.log('✅ Sign-up event fired with method parameter');
  }
}

// Test E-commerce Events
function testEcommerceEvents() {
  console.log('\n🛒 Testing E-commerce Events...');
  
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: 'test_tx_' + Date.now(),
      value: 99.00,
      currency: 'ILS',
      items: [{
        item_id: 'premium_monthly',
        item_name: 'Premium Monthly Subscription',
        category: 'subscription',
        price: 99.00,
        quantity: 1
      }]
    });
    console.log('✅ Purchase event fired with all required parameters');
  }
}

// Test Premium Events  
function testPremiumEvents() {
  console.log('\n💎 Testing Premium Events...');
  
  if (window.gtag) {
    window.gtag('event', 'subscription_upgrade', {
      plan_id: 'monthly', // This is the key fix
      plan_type: 'monthly', // Keep for backward compatibility
      value: 99.00,
      currency: 'ILS',
      transaction_id: 'premium_tx_' + Date.now()
    });
    console.log('✅ Subscription upgrade event fired with plan_id parameter');
  }
}

// Test Simulation Events
function testSimulationEvents() {
  console.log('\n🎯 Testing Simulation Events...');
  
  if (window.gtag) {
    const simulationId = 'test_sim_' + Date.now();
    
    window.gtag('event', 'simulation_start', {
      simulation_id: simulationId,
      topic: 'mathematics', // This is the key fix
      simulation_type: 'topic_based',
      difficulty_level: 'medium',
      question_count: 10
    });
    console.log('✅ Simulation start event fired with topic parameter');
    
    window.gtag('event', 'simulation_complete', {
      simulation_id: simulationId,
      topic: 'mathematics', // This is the key fix
      simulation_type: 'topic_based',
      score: 85,
      completion_rate: 100,
      time_spent: 300
    });
    console.log('✅ Simulation complete event fired with topic parameter');
  }
}

// Run all tests
function runAllEventTests() {
  console.log('🚀 Running all event tests...\n');
  
  // Check if GTM is loaded
  if (!window.dataLayer) {
    console.error('❌ GTM/dataLayer not found. Make sure GTM is loaded.');
    return;
  }
  
  if (!window.gtag) {
    console.error('❌ gtag function not found. Make sure GA4 is loaded.');
    return;
  }
  
  // Get initial dataLayer count
  const initialCount = window.dataLayer.length;
  console.log(`📊 Initial dataLayer events: ${initialCount}`);
  
  // Run tests
  testAuthEvents();
  testEcommerceEvents(); 
  testPremiumEvents();
  testSimulationEvents();
  
  // Check final count
  setTimeout(() => {
    const finalCount = window.dataLayer.length;
    const newEvents = finalCount - initialCount;
    console.log(`\n📈 Final dataLayer events: ${finalCount}`);
    console.log(`✨ New events added: ${newEvents}`);
    
    if (newEvents >= 4) {
      console.log('✅ SUCCESS: All event types appear to be working');
      console.log('\n📋 Next steps:');
      console.log('1. Check Analytics Dashboard for PASS status');
      console.log('2. Verify Network tab shows collect?v= requests');
      console.log('3. Check GA4 DebugView for real-time events');
    } else {
      console.log('⚠️  WARNING: Expected at least 4 new events');
      console.log('Check browser console for any gtag errors');
    }
  }, 1000);
}

// Export functions for manual testing
if (typeof window !== 'undefined') {
  window.testAnalyticsFixes = {
    runAllEventTests,
    testAuthEvents,
    testEcommerceEvents, 
    testPremiumEvents,
    testSimulationEvents
  };
  
  console.log('🔧 Analytics test functions loaded.');
  console.log('Run: window.testAnalyticsFixes.runAllEventTests()');
}

// Auto-run if in browser
if (typeof window !== 'undefined' && window.location) {
  // Only auto-run in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(runAllEventTests, 2000);
  }
}

module.exports = { runAllEventTests, testAuthEvents, testEcommerceEvents, testPremiumEvents, testSimulationEvents };