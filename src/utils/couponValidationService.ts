import { supabase } from '@/integrations/supabase/client';
import { PLAN_PRICES, calculateDiscount, type PlanType, DISCOUNT_RULES } from '@/config/pricing';

interface CouponValidationResult {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    discount_type: 'percent' | 'amount';
    discount_value: number;
    is_personal: boolean;
  };
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
  sessionLocked?: boolean;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  allowed_plans: string[];
  expire_at: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  assigned_user_id: string | null;
  assigned_user_email: string | null;
}

// Session-based coupon tracking to prevent stacking
const COUPON_SESSION_KEY = 'applied_coupon_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

interface CouponSession {
  couponId: string;
  couponCode: string;
  planType: string;
  appliedAt: number;
  locked: boolean;
}

const getCouponSession = (): CouponSession | null => {
  try {
    const stored = localStorage.getItem(COUPON_SESSION_KEY);
    if (!stored) return null;
    
    const session: CouponSession = JSON.parse(stored);
    
    // Check if session expired
    if (Date.now() - session.appliedAt > SESSION_DURATION) {
      localStorage.removeItem(COUPON_SESSION_KEY);
      return null;
    }
    
    return session;
  } catch {
    localStorage.removeItem(COUPON_SESSION_KEY);
    return null;
  }
};

const setCouponSession = (couponId: string, couponCode: string, planType: string, locked: boolean = false) => {
  const session: CouponSession = {
    couponId,
    couponCode,
    planType,
    appliedAt: Date.now(),
    locked
  };
  localStorage.setItem(COUPON_SESSION_KEY, JSON.stringify(session));
};

const clearCouponSession = () => {
  localStorage.removeItem(COUPON_SESSION_KEY);
};

const lockCouponSession = () => {
  const session = getCouponSession();
  if (session) {
    session.locked = true;
    localStorage.setItem(COUPON_SESSION_KEY, JSON.stringify(session));
  }
};

export const couponValidationService = {
  getCouponSession,
  setCouponSession,
  clearCouponSession,
  lockCouponSession,
  async validateCoupon(
    code: string, 
    planType: string, 
    userId?: string, 
    userEmail?: string
  ): Promise<CouponValidationResult> {
    try {
      console.log('🔍 Client-side coupon validation:', { code, planType, userId, userEmail });

      if (!code || !planType) {
        return { valid: false, error: 'קוד קופון וסוג תוכנית נדרשים' };
      }

      // Check for existing coupon session to prevent stacking
      const existingSession = getCouponSession();
      if (existingSession) {
        if (existingSession.locked) {
          return { 
            valid: false, 
            error: 'תשלום בתהליך - לא ניתן לשנות קופון',
            sessionLocked: true 
          };
        }
        
        if (existingSession.couponCode !== code.toUpperCase()) {
          return { 
            valid: false, 
            error: 'יש כבר קופון פעיל. בטל אותו לפני החלת קופון חדש' 
          };
        }
        
        if (existingSession.planType !== planType) {
          // Plan changed, clear session and continue validation
          clearCouponSession();
        } else {
          // Same coupon and plan, return cached result
          return { 
            valid: false, 
            error: 'קופון זה כבר הוחל' 
          };
        }
      }

      // Validate coupon via secure RPC to avoid exposing table directly
      const { data: rpc, error: rpcError } = await supabase
        .rpc('validate_coupon_secure', {
          p_code: code,
          p_plan_type: planType,
          p_user_id: userId ?? null,
          p_user_email: userEmail ?? null,
        })
        .maybeSingle();

      if (rpcError || !rpc) {
        console.log('❌ RPC validation error:', rpcError?.message);
        return { valid: false, error: 'קוד קופון לא תקין או פג תוקף' };
      }

      if (!rpc.valid) {
        return { valid: false, error: rpc.error || 'קוד קופון לא תקין' };
      }

      // Calculate discount using centralized pricing with validation
      const discountResult = calculateDiscount(
        planType as PlanType,
        rpc.discount_type as 'percent' | 'amount',
        rpc.discount_value
      );

      const originalAmount = PLAN_PRICES[planType as PlanType] || 99;

      console.log('💰 Centralized calculation results:', { 
        originalAmount, 
        discountType: rpc.discount_type, 
        discountValue: rpc.discount_value,
        discountAmount: discountResult.discountAmount,
        finalAmount: discountResult.finalAmount,
        valid: discountResult.valid
      });

      // Check if discount calculation was valid
      if (!discountResult.valid) {
        return { valid: false, error: discountResult.error || 'הנחה לא תקינה' };
      }

      const { discountAmount, finalAmount } = discountResult;

      // Additional validation check
      if (finalAmount > originalAmount) {
        console.error('🚨 CALCULATION ERROR: Final amount is higher than original!');
        return { valid: false, error: 'שגיאה בחישוב הנחה' };
        }

      // Set coupon session to prevent stacking
      setCouponSession(rpc.coupon_id, rpc.code, planType);

      return {
        valid: true,
        coupon: {
          id: rpc.coupon_id,
          code: rpc.code,
          discount_type: rpc.discount_type as 'percent' | 'amount',
          discount_value: rpc.discount_value,
          is_personal: !!rpc.is_personal,
        },
        discountAmount,
        finalAmount,
      };

    } catch (error) {
      console.error('❌ Error in client-side validation:', error);
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בוויידוק קוד הקופון';
      return { valid: false, error: errorMessage };
    }
  },

  async useCoupon(
    couponId: string, 
    userId: string, 
    planType: string, 
    originalAmount: number, 
    discountAmount: number, 
    finalAmount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🎫 Recording coupon usage:', { couponId, userId, planType, originalAmount, discountAmount, finalAmount });

      if (!userId) {
        return { success: false, error: 'נדרשת התחברות לחשבון' };
      }

      // Record coupon usage via secure RPC (handles limits and ownership)
      const { data: rpc, error: rpcError } = await supabase
        .rpc('record_coupon_usage_secure', {
          p_coupon_id: couponId,
          p_user_id: userId,
          p_plan_type: planType,
          p_original_amount: originalAmount,
          p_discount_amount: discountAmount,
          p_final_amount: finalAmount,
        })
        .maybeSingle();

      if (rpcError || !rpc) {
        console.error('❌ Failed to record usage via RPC:', rpcError);
        return { success: false, error: 'שגיאה ברישום השימוש בקופון' };
      }

      if (!rpc.success) {
        return { success: false, error: rpc.message || 'שגיאה ברישום השימוש בקופון' };
      }

      // Lock the coupon session to prevent further modifications
      lockCouponSession();
      console.log('✅ Coupon used successfully and session locked');
      return { success: true };

    } catch (error) {
      console.error('❌ Error using coupon:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'שגיאה בשימוש בקוד הקופון'
      };
    }
  }
};