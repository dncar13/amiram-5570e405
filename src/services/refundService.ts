/**
 * Refund Service for Subscription Cancellations
 * Implements Israeli law compliance for partial refunds
 */

import type { RefundCalculation, RefundPreview } from '@/types/cardcom.types';
import { PLAN_PRICES } from '@/config/pricing';

export type PlanTypeDB = 'day' | 'week' | 'month' | '3months';
export type PlanTypeUI = 'daily' | 'weekly' | 'monthly' | 'quarterly';

/**
 * Map UI plan types to database plan types
 */
export const mapPlanTypeToDb = (planType: PlanTypeUI): PlanTypeDB => {
  const mapping: Record<PlanTypeUI, PlanTypeDB> = {
    'daily': 'day',
    'weekly': 'week', 
    'monthly': 'month',
    'quarterly': '3months'
  };
  return mapping[planType];
};

/**
 * Map database plan types to UI plan types
 */
export const mapPlanTypeToUI = (planType: PlanTypeDB): PlanTypeUI => {
  const mapping: Record<PlanTypeDB, PlanTypeUI> = {
    'day': 'daily',
    'week': 'weekly',
    'month': 'monthly',
    '3months': 'quarterly'
  };
  return mapping[planType];
};

/**
 * Calculate refund amount according to Israeli law
 * Formula: (Unused days ÷ Total subscription days) × Total amount paid – cancellation fee
 * Cancellation fee: 5% or ₪100, whichever is lower
 * Minimum refund: ₪2 (below this, no refund is processed)
 */
export const calculateRefundAmount = (
  originalAmount: number,
  startDate: Date,
  endDate: Date,
  cancelDate: Date = new Date(),
  planType: PlanTypeDB
): RefundCalculation => {
  console.log('🧮 Calculating refund:', {
    originalAmount,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    cancelDate: cancelDate.toISOString(),
    planType
  });

  // Daily subscriptions are not eligible for refunds
  if (planType === 'day') {
    console.log('📅 Daily subscription - no refund eligible');
    return {
      refundAmount: 0,
      cancellationFee: 0,
      unusedDays: 0,
      totalDays: 1,
      eligibleForRefund: false,
      originalAmount
    };
  }

  // Calculate total days and unused days
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const unusedDays = Math.max(0, Math.ceil((endDate.getTime() - cancelDate.getTime()) / (1000 * 3600 * 24)));

  console.log('📊 Day calculations:', { totalDays, unusedDays });

  // If no unused days, no refund
  if (unusedDays <= 0) {
    console.log('⏰ No unused days - no refund');
    return {
      refundAmount: 0,
      cancellationFee: 0,
      unusedDays: 0,
      totalDays,
      eligibleForRefund: false,
      originalAmount
    };
  }

  // Calculate proportional refund before fee
  const refundBeforeFee = originalAmount * (unusedDays / totalDays);
  
  // Calculate cancellation fee (5% or ₪100, whichever is lower)
  const cancellationFee = Math.min(originalAmount * 0.05, 100);
  
  // Calculate final refund amount
  let finalRefund = Math.max(0, refundBeforeFee - cancellationFee);
  
  // Round to 2 decimal places
  finalRefund = Math.round(finalRefund * 100) / 100;
  const roundedCancellationFee = Math.round(cancellationFee * 100) / 100;

  console.log('💰 Refund calculation:', {
    refundBeforeFee: Math.round(refundBeforeFee * 100) / 100,
    cancellationFee: roundedCancellationFee,
    finalRefund
  });

  // Check if refund meets minimum threshold (₪2)
  const eligibleForRefund = finalRefund >= 2;
  
  if (!eligibleForRefund) {
    console.log('📉 Refund below minimum threshold (₪2) - no refund');
    return {
      refundAmount: 0,
      cancellationFee: 0,
      unusedDays,
      totalDays,
      eligibleForRefund: false,
      originalAmount
    };
  }

  console.log('✅ Refund calculation complete:', {
    refundAmount: finalRefund,
    cancellationFee: roundedCancellationFee,
    eligibleForRefund
  });

  return {
    refundAmount: finalRefund,
    cancellationFee: roundedCancellationFee,
    unusedDays,
    totalDays,
    eligibleForRefund: true,
    originalAmount
  };
};

/**
 * Get refund formula explanation in Hebrew
 */
export const getRefundFormulaExplanation = (): string => {
  return "סכום החזר = (ימים שלא נוצלו ÷ סה\"כ ימי המנוי) × הסכום ששולם - דמי ביטול (5% או ₪100, הנמוך מביניהם)";
};

/**
 * Get processing time explanation in Hebrew
 */
export const getProcessingTimeExplanation = (): string => {
  return "החזר יבוצע תוך 14 ימי עסקים לאמצעי התשלום המקורי";
};

/**
 * Create a refund preview for the UI
 */
export const createRefundPreview = (
  subscriptionId: string,
  transactionId: number,
  originalAmount: number,
  startDate: Date,
  endDate: Date,
  planType: PlanTypeDB,
  cancelDate: Date = new Date()
): RefundPreview => {
  const calculation = calculateRefundAmount(
    originalAmount,
    startDate,
    endDate,
    cancelDate,
    planType
  );

  return {
    calculation,
    planType: mapPlanTypeToUI(planType),
    subscriptionId,
    transactionId,
    refundFormula: getRefundFormulaExplanation(),
    processingTime: getProcessingTimeExplanation()
  };
};

/**
 * Validate refund request before processing
 */
export const validateRefundRequest = (
  calculation: RefundCalculation,
  subscriptionStatus: string,
  planType: PlanTypeDB
): { valid: boolean; error?: string } => {
  // Check if subscription is active
  if (subscriptionStatus !== 'active') {
    return {
      valid: false,
      error: 'ניתן לבטל רק מנויים פעילים'
    };
  }

  // Check if daily subscription
  if (planType === 'day') {
    return {
      valid: false,
      error: 'מנוי יומי (₪20) אינו זכאי להחזר כיוון שהשירות מסופק מיידית'
    };
  }

  // Check if eligible for refund
  if (!calculation.eligibleForRefund) {
    return {
      valid: false,
      error: 'סכום ההחזר נמוך מהסכום המינימלי (₪2) ולכן לא יבוצע החזר'
    };
  }

  // Check if refund amount is reasonable
  if (calculation.refundAmount <= 0) {
    return {
      valid: false,
      error: 'לא נותרו ימים שלא נוצלו במנוי'
    };
  }

  return { valid: true };
};

/**
 * Get plan display name in Hebrew
 */
export const getPlanDisplayName = (planType: PlanTypeDB | PlanTypeUI): string => {
  const displayNames: Record<string, string> = {
    'day': 'יום אחד',
    'daily': 'יום אחד',
    'week': 'שבוע אחד',
    'weekly': 'שבוع אחד',
    'month': 'חודש אחד',
    'monthly': 'חודש אחד',
    '3months': '3 חודשים',
    'quarterly': '3 חודשים'
  };
  return displayNames[planType] || planType;
};

/**
 * Get plan price from config
 */
export const getPlanPrice = (planType: PlanTypeUI): number => {
  return PLAN_PRICES[planType];
};