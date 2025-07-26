import { supabase } from '@/integrations/supabase/client';

export interface FreeCouponResult {
  success: boolean;
  subscriptionId?: string;
  message?: string;
  error?: string;
}

/**
 * Specialized service for handling 100% discount coupons that create free subscriptions
 */
export const freeCouponService = {
  /**
   * Process a free coupon (100% discount) and create subscription
   */
  async processFreeCouponSubscription(
    userId: string,
    couponId: string,
    planType: string,
    originalAmount: number,
    discountAmount: number,
    finalAmount: number
  ): Promise<FreeCouponResult> {
    try {
      console.log('🎫 Processing free coupon subscription:', {
        userId,
        couponId,
        planType,
        originalAmount,
        discountAmount,
        finalAmount
      });

      // Only handle 100% discount coupons with final amount 0
      if (finalAmount !== 0) {
        return {
          success: false,
          error: 'This service only handles 100% discount coupons'
        };
      }

      // Use the database function to handle the entire process atomically
      const { data, error } = await supabase.rpc('process_free_coupon_subscription', {
        p_user_id: userId,
        p_coupon_id: couponId,
        p_plan_type: planType,
        p_original_amount: originalAmount,
        p_discount_amount: discountAmount,
        p_final_amount: finalAmount
      });

      if (error) {
        console.error('❌ Database function error:', error);
        return {
          success: false,
          error: error.message || 'Database error processing free coupon'
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: 'No response from database function'
        };
      }

      const result = data[0];
      console.log('✅ Free coupon processing result:', result);

      if (result.success) {
        return {
          success: true,
          subscriptionId: result.subscription_id,
          message: result.message
        };
      } else {
        return {
          success: false,
          error: result.message
        };
      }

    } catch (error) {
      console.error('❌ Error in freeCouponService:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error processing free coupon'
      };
    }
  }
};