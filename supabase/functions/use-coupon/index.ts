import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UseCouponRequest {
  couponId: string;
  userId: string;
  planType: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[USE-COUPON] ${step}${detailsStr}`);
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

    const { couponId, userId, planType, originalAmount, discountAmount, finalAmount }: UseCouponRequest = await req.json();
    logStep("Request received", { couponId, userId, planType, originalAmount, discountAmount, finalAmount });

    if (!couponId || !userId || !planType) {
      throw new Error("פרמטרים חסרים לשימוש בקופון");
    }

    // Start transaction by checking if coupon can still be used
    const { data: coupon, error: couponError } = await supabaseClient
      .from("coupons")
      .select("*")
      .eq("id", couponId)
      .eq("is_active", true)
      .single();

    if (couponError || !coupon) {
      logStep("Coupon not found or inactive", { couponId, error: couponError?.message });
      throw new Error("קוד קופון לא תקין");
    }

    // Double-check usage limit
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      logStep("Usage limit exceeded", { usageLimit: coupon.usage_limit, usedCount: coupon.used_count });
      throw new Error("קוד קופון הגיע למגבלת השימוש");
    }

    // Check if user already used this coupon (prevent double usage)
    const { data: existingUsage } = await supabaseClient
      .from("coupon_usage")
      .select("id")
      .eq("coupon_id", couponId)
      .eq("user_id", userId)
      .single();

    if (existingUsage) {
      logStep("Coupon already used by user", { userId, couponId });
      throw new Error("כבר השתמשת בקוד קופון זה");
    }

    // Record coupon usage
    const { error: usageError } = await supabaseClient
      .from("coupon_usage")
      .insert({
        coupon_id: couponId,
        user_id: userId,
        plan_type: planType,
        original_amount: originalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount
      });

    if (usageError) {
      logStep("Failed to record usage", { error: usageError.message });
      throw new Error("שגיאה ברישום השימוש בקופון");
    }

    // Update coupon used count
    const { error: updateError } = await supabaseClient
      .from("coupons")
      .update({ used_count: coupon.used_count + 1 })
      .eq("id", couponId);

    if (updateError) {
      logStep("Failed to update coupon count", { error: updateError.message });
      // Note: This is not critical as the usage was already recorded
      console.warn("Failed to update coupon usage count, but usage was recorded");
    }

    logStep("Coupon used successfully", { couponId, userId, newUsedCount: coupon.used_count + 1 });

    return new Response(JSON.stringify({
      success: true,
      message: "קוד קופון נוצל בהצלחה"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in use-coupon", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});