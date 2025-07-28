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

      // Get coupon details from database
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (couponError || !coupon) {
        console.log('❌ Coupon not found:', couponError?.message);
        return { valid: false, error: 'קוד קופון לא תקין או פג תוקף' };
      }

      console.log('✅ Coupon found:', coupon);

      // Check expiration
      if (coupon.expire_at && new Date(coupon.expire_at) < new Date()) {
        console.log('❌ Coupon expired:', coupon.expire_at);
        return { valid: false, error: 'קוד קופון פג תוקף' };
      }

      // Check usage limit
      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        console.log('❌ Usage limit reached:', { limit: coupon.usage_limit, used: coupon.used_count });
        return { valid: false, error: 'קוד קופון הגיע למגבלת השימוש' };
      }

      // Check allowed plans
      if (!coupon.allowed_plans.includes(planType)) {
        console.log('❌ Plan not allowed:', { allowed: coupon.allowed_plans, requested: planType });
        return { valid: false, error: 'קוד קופון לא תקף עבור התוכנית הנבחרת' };
      }

      // Check if coupon is assigned to a specific user
      if (coupon.assigned_user_id || coupon.assigned_user_email) {
        if (!userId && !userEmail) {
          return { valid: false, error: 'נדרשת התחברות לחשבון כדי להשתמש בקופון זה' };
        }

        const isUserMatch = (coupon.assigned_user_id && coupon.assigned_user_id === userId) ||
                           (coupon.assigned_user_email && coupon.assigned_user_email === userEmail);

        if (!isUserMatch) {
          return { valid: false, error: 'קוד קופון זה מיועד למשתמש אחר' };
        }

        // Check if personal coupon was already used by this user
        if (userId) {
          const { data: existingUsage } = await supabase
            .from('coupon_usage')
            .select('id')
            .eq('coupon_id', coupon.id)
            .eq('user_id', userId)
            .single();

          if (existingUsage) {
            return { valid: false, error: 'כבר השתמשת בקוד קופון זה' };
          }
        }
      }

      // Calculate discount using centralized pricing with validation
      const discountResult = calculateDiscount(
        planType as PlanType,
        coupon.discount_type as 'percent' | 'amount',
        coupon.discount_value
      );

      const originalAmount = PLAN_PRICES[planType as PlanType] || 99;

      console.log('💰 Centralized calculation results:', { 
        originalAmount, 
        discountType: coupon.discount_type, 
        discountValue: coupon.discount_value,
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
      setCouponSession(coupon.id, coupon.code, planType);

      return {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type as 'percent' | 'amount',
          discount_value: coupon.discount_value,
          is_personal: !!(coupon.assigned_user_id || coupon.assigned_user_email)
        },
        discountAmount,
        finalAmount
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

      // Check if coupon still exists and is valid
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .eq('is_active', true)
        .single();

      if (couponError || !coupon) {
        return { success: false, error: 'קוד קופון לא תקין' };
      }

      // Double-check usage limit
      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return { success: false, error: 'קוד קופון הגיע למגבלת השימוש' };
      }

      // Check if user already used this coupon
      const { data: existingUsage } = await supabase
        .from('coupon_usage')
        .select('id')
        .eq('coupon_id', couponId)
        .eq('user_id', userId)
        .single();

      if (existingUsage) {
        return { success: false, error: 'כבר השתמשת בקוד קופון זה' };
      }

      // Record coupon usage
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_id: userId,
          plan_type: planType,
          original_amount: originalAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount
        });

      if (usageError) {
        console.error('❌ Failed to record usage:', usageError);
        return { success: false, error: 'שגיאה ברישום השימוש בקופון' };
      }

      // Update coupon used count
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ used_count: coupon.used_count + 1 })
        .eq('id', couponId);

      if (updateError) {
        console.warn('⚠️ Failed to update coupon count, but usage was recorded:', updateError);
        // Continue as success since usage was recorded
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