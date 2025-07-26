// Centralized application configuration
// ⚠️ CRITICAL: All plan types, emails, and app constants MUST use these values

// Re-export pricing configuration
export { PLAN_PRICES, PLAN_DURATIONS, getPlanPrice, getPlanDuration, calculateDiscount } from './pricing';
export type { PlanType } from './pricing';

// Plan types used across the application
export const PLAN_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly', 
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
} as const;

// Validate that plan types match the pricing configuration
export type AppPlanType = typeof PLAN_TYPES[keyof typeof PLAN_TYPES];
export const VALID_PLAN_TYPES = Object.values(PLAN_TYPES) as AppPlanType[];

// User access configuration
export const ADMIN_EMAILS = [
  "dncar13@gmail.com"
];

export const PREMIUM_EMAILS = [
  "dncar13@gmail.com"
];

// Helper functions for plan type validation
export const isValidPlanType = (planType: string): planType is AppPlanType => {
  return VALID_PLAN_TYPES.includes(planType as AppPlanType);
};

export const getPlanTypeDisplayName = (planType: AppPlanType): string => {
  const displayNames: Record<AppPlanType, string> = {
    'daily': 'יומי',
    'weekly': 'שבועי', 
    'monthly': 'חודשי',
    'quarterly': 'רבעוני'
  };
  return displayNames[planType];
};