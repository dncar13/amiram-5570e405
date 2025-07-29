import { calculateDiscount, PLAN_PRICES, type PlanType } from '@/config/pricing';

// Test script to verify discount calculations
export const testDiscountCalculations = () => {
  console.log('🧪 Testing discount calculations...');
  
  const testCases = [
    // Test basic percentage discounts
    { planType: 'monthly', discountType: 'percent', discountValue: 25, expected: { originalAmount: 99, discountAmount: 25, finalAmount: 74 } },
    { planType: 'daily', discountType: 'percent', discountValue: 15, expected: { originalAmount: 20, discountAmount: 3, finalAmount: 17 } },
    
    // Test amount discounts
    { planType: 'monthly', discountType: 'amount', discountValue: 10, expected: { originalAmount: 99, discountAmount: 10, finalAmount: 89 } },
    { planType: 'daily', discountType: 'amount', discountValue: 5, expected: { originalAmount: 20, discountAmount: 5, finalAmount: 15 } },
    
    // Test edge cases
    { planType: 'daily', discountType: 'percent', discountValue: 100, expected: { originalAmount: 20, discountAmount: 16, finalAmount: 4 } }, // Should be limited by min price (20% = 4)
    { planType: 'monthly', discountType: 'amount', discountValue: 200, expected: { originalAmount: 99, discountAmount: 79, finalAmount: 20 } }, // Should be limited by min price (20% = ~20)
    
    // Test invalid discounts
    { planType: 'monthly', discountType: 'percent', discountValue: 60, expected: null }, // Should fail - over 50% max
  ];
  
  testCases.forEach((testCase, index) => {
    const result = calculateDiscount(
      testCase.planType as PlanType,
      testCase.discountType as 'percent' | 'amount',
      testCase.discountValue
    );
    
    console.log(`Test ${index + 1}:`, {
      input: testCase,
      result: result,
      valid: result.valid,
      passed: testCase.expected ? (
        result.valid && 
        result.finalAmount === testCase.expected.finalAmount &&
        result.discountAmount === testCase.expected.discountAmount
      ) : !result.valid
    });
  });
  
  // Test with actual coupon scenarios
  console.log('\n🎫 Testing realistic coupon scenarios:');
  
  const realisticTests = [
    { plan: 'monthly', type: 'percent', value: 25, name: '25% off monthly plan' },
    { plan: 'daily', type: 'percent', value: 15, name: '15% off daily plan' },
    { plan: 'weekly', type: 'amount', value: 10, name: '10 NIS off weekly plan' },
  ];
  
  realisticTests.forEach(test => {
    const result = calculateDiscount(
      test.plan as PlanType,
      test.type as 'percent' | 'amount',
      test.value
    );
    
    console.log(`${test.name}:`, {
      originalPrice: PLAN_PRICES[test.plan as PlanType],
      discount: result.discountAmount,
      finalPrice: result.finalAmount,
      valid: result.valid,
      isPosistive: result.finalAmount > 0,
      isValidNumber: typeof result.finalAmount === 'number' && !isNaN(result.finalAmount)
    });
  });
};

// Run tests in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Export to window for manual testing in console
  (window as any).testDiscountsCalculations = testDiscountCalculations;
}