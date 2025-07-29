// Centralized pricing configuration
// ⚠️ CRITICAL: All pricing across the app MUST use these values

export const PLAN_PRICES = {
  daily: 20,
  weekly: 50,
  monthly: 99,
  quarterly: 239
} as const;

export const PLAN_DURATIONS = {
  daily: 1,        // 1 day
  weekly: 7,       // 7 days  
  monthly: 30,     // 30 days
  quarterly: 90    // 90 days
} as const;

export type PlanType = keyof typeof PLAN_PRICES;

export const getPlanPrice = (planType: PlanType): number => {
  return PLAN_PRICES[planType];
};

export const getPlanDuration = (planType: PlanType): number => {
  return PLAN_DURATIONS[planType];
};

// Discount validation rules
export const DISCOUNT_RULES = {
  MAX_DISCOUNT_PERCENT: 50, // Maximum 50% discount
  MIN_FINAL_PRICE: 5, // Minimum final price in NIS
  MIN_PRICE_PERCENT: 20 // Final price cannot be less than 20% of original
} as const;

export const calculateDiscount = (
  planType: PlanType,
  discountType: 'percent' | 'amount',
  discountValue: number
): { discountAmount: number; finalAmount: number; valid: boolean; error?: string } => {
  const originalAmount = getPlanPrice(planType);
  let discountAmount = 0;

  if (discountType === 'percent') {
    // Enforce maximum discount percentage
    if (discountValue > DISCOUNT_RULES.MAX_DISCOUNT_PERCENT) {
      return {
        discountAmount: 0,
        finalAmount: originalAmount,
        valid: false,
        error: `הנחה מקסימלית מותרת: ${DISCOUNT_RULES.MAX_DISCOUNT_PERCENT}%`
      };
    }
    discountAmount = Math.round(originalAmount * (discountValue / 100));
  } else if (discountType === 'amount') {
    discountAmount = Math.min(discountValue, originalAmount);
  }

  let finalAmount = Math.max(0, originalAmount - discountAmount);
  
  // Enforce minimum final price
  if (finalAmount < DISCOUNT_RULES.MIN_FINAL_PRICE) {
    finalAmount = DISCOUNT_RULES.MIN_FINAL_PRICE;
    discountAmount = originalAmount - finalAmount;
  }
  
  // Enforce minimum price percentage
  const minAllowedPrice = Math.round(originalAmount * (DISCOUNT_RULES.MIN_PRICE_PERCENT / 100));
  if (finalAmount < minAllowedPrice) {
    finalAmount = minAllowedPrice;
    discountAmount = originalAmount - finalAmount;
  }

  // Ensure amounts are integers (avoid floating point precision issues)
  finalAmount = Math.round(finalAmount);
  discountAmount = Math.round(discountAmount);

  // Final validation
  if (finalAmount <= 0 || !isFinite(finalAmount) || isNaN(finalAmount)) {
    console.error('Invalid final amount calculated:', { originalAmount, discountAmount, finalAmount });
    return {
      discountAmount: 0,
      finalAmount: originalAmount,
      valid: false,
      error: 'שגיאה בחישוב הנחה'
    };
  }

  return { discountAmount, finalAmount, valid: true };
};