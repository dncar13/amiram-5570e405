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

export const calculateDiscount = (
  planType: PlanType,
  discountType: 'percent' | 'amount',
  discountValue: number
): { discountAmount: number; finalAmount: number } => {
  const originalAmount = getPlanPrice(planType);
  let discountAmount = 0;

  if (discountType === 'percent') {
    discountAmount = Math.round(originalAmount * (discountValue / 100));
  } else if (discountType === 'amount') {
    discountAmount = Math.min(discountValue, originalAmount);
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);

  return { discountAmount, finalAmount };
};