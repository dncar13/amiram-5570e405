import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
}

export const useCoupon = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const { currentUser } = useAuth();

  const validateCoupon = async (code: string, planType: string): Promise<CouponValidationResult> => {
    setIsValidating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: {
          code: code.trim().toUpperCase(),
          planType,
          userId: currentUser?.id,
          userEmail: currentUser?.email
        }
      });

      if (error) throw error;

      const result = data as CouponValidationResult;
      
      if (result.valid) {
        setAppliedCoupon(result);
      } else {
        setAppliedCoupon(null);
      }

      return result;
    } catch (error) {
      console.error('Error validating coupon:', error);
      const result: CouponValidationResult = {
        valid: false,
        error: error instanceof Error ? error.message : 'שגיאה בוויידוק קוד הקופון'
      };
      setAppliedCoupon(null);
      return result;
    } finally {
      setIsValidating(false);
    }
  };

  const useCoupon = async (
    couponId: string, 
    planType: string, 
    originalAmount: number, 
    discountAmount: number, 
    finalAmount: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser?.id) {
      return { success: false, error: 'נדרשת התחברות לחשבון' };
    }

    try {
      const { data, error } = await supabase.functions.invoke('use-coupon', {
        body: {
          couponId,
          userId: currentUser.id,
          planType,
          originalAmount,
          discountAmount,
          finalAmount
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error using coupon:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'שגיאה בשימוש בקוד הקופון'
      };
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
  };

  return {
    validateCoupon,
    useCoupon,
    clearCoupon,
    appliedCoupon,
    isValidating
  };
};