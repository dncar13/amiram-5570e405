import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidateCouponRequest {
  code: string;
  planType: string;
  userId?: string;
  userEmail?: string;
}

interface ValidateCouponResponse {
  valid: boolean;
  coupon?: any;
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
}

// Centralized pricing configuration - MUST match src/config/pricing.ts
const PLAN_PRICES = {
  daily: 20,
  weekly: 50,   // FIXED: Must match UI pricing ₪50
  monthly: 99,
  quarterly: 239
} as const;

const calculateDiscount = (
  planType: keyof typeof PLAN_PRICES,
  discountType: 'percent' | 'amount',
  discountValue: number
): { discountAmount: number; finalAmount: number; originalAmount: number } => {
  const originalAmount = PLAN_PRICES[planType];
  let discountAmount = 0;

  if (discountType === 'percent') {
    discountAmount = Math.round(originalAmount * (discountValue / 100));
  } else if (discountType === 'amount') {
    discountAmount = Math.min(discountValue, originalAmount);
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);
  return { discountAmount, finalAmount, originalAmount };
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-COUPON] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { code, planType, userId, userEmail }: ValidateCouponRequest = await req.json();
    logStep("Request received", { code, planType, userId, userEmail });

    if (!code || !planType) {
      throw new Error("קוד קופון וסוג תוכנית נדרשים");
    }

    // Get coupon details
    const { data: coupon, error: couponError } = await supabaseClient
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (couponError || !coupon) {
      logStep("Coupon not found", { code, error: couponError?.message });
      return new Response(JSON.stringify({
        valid: false,
        error: "קוד קופון לא תקין או פג תוקף"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Coupon found", { couponId: coupon.id, discountType: coupon.discount_type });

    // Check expiration
    if (coupon.expire_at && new Date(coupon.expire_at) < new Date()) {
      logStep("Coupon expired", { expireAt: coupon.expire_at });
      return new Response(JSON.stringify({
        valid: false,
        error: "קוד קופון פג תוקף"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      logStep("Usage limit reached", { usageLimit: coupon.usage_limit, usedCount: coupon.used_count });
      return new Response(JSON.stringify({
        valid: false,
        error: "קוד קופון הגיע למגבלת השימוש"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check allowed plans
    if (!coupon.allowed_plans.includes(planType)) {
      logStep("Plan not allowed", { allowedPlans: coupon.allowed_plans, requestedPlan: planType });
      return new Response(JSON.stringify({
        valid: false,
        error: "קוד קופון לא תקף עבור התוכנית הנבחרת"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if coupon is assigned to a specific user
    if (coupon.assigned_user_id || coupon.assigned_user_email) {
      if (!userId && !userEmail) {
        logStep("Personal coupon requires user identification");
        return new Response(JSON.stringify({
          valid: false,
          error: "נדרשת התחברות לחשבון כדי להשתמש בקופון זה"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const isUserMatch = (coupon.assigned_user_id && coupon.assigned_user_id === userId) ||
                         (coupon.assigned_user_email && coupon.assigned_user_email === userEmail);

      if (!isUserMatch) {
        logStep("User not authorized for personal coupon", { 
          assignedUserId: coupon.assigned_user_id, 
          assignedUserEmail: coupon.assigned_user_email,
          requestUserId: userId,
          requestUserEmail: userEmail
        });
        return new Response(JSON.stringify({
          valid: false,
          error: "קוד קופון זה מיועד למשתמש אחר"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Check if personal coupon was already used by this user
      if (userId) {
        const { data: existingUsage } = await supabaseClient
          .from("coupon_usage")
          .select("id")
          .eq("coupon_id", coupon.id)
          .eq("user_id", userId)
          .single();

        if (existingUsage) {
          logStep("Personal coupon already used");
          return new Response(JSON.stringify({
            valid: false,
            error: "כבר השתמשת בקוד קופון זה"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
    }

    // Calculate discount using centralized function
    const { originalAmount, discountAmount, finalAmount } = calculateDiscount(
      planType as keyof typeof PLAN_PRICES,
      coupon.discount_type as 'percent' | 'amount',
      coupon.discount_value
    );

    logStep("Centralized calculation results", { 
      planType,
      originalAmount, 
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount,
      finalAmount
    });

    logStep("Validation successful", { 
      originalAmount, 
      discountAmount, 
      finalAmount, 
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value
    });

    return new Response(JSON.stringify({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        is_personal: !!(coupon.assigned_user_id || coupon.assigned_user_email)
      },
      discountAmount,
      finalAmount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in validate-coupon", { message: errorMessage });
    return new Response(JSON.stringify({ 
      valid: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});