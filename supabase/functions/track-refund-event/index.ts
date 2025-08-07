import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefundEventData {
  original_transaction_id: string;
  refund_transaction_id?: string;
  refund_amount: number;
  original_amount: number;
  currency?: string;
  refund_reason?: string;
  plan_type?: string;
  user_id?: string;
  subscription_id?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TRACK-REFUND] ${step}${detailsStr}`);
};

const trackRefundToGA4 = async (refundData: RefundEventData) => {
  try {
    // Send event to Google Analytics 4 via Measurement Protocol
    const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID") || "G-XXXXXXXXXX";
    const GA4_API_SECRET = Deno.env.get("GA4_API_SECRET");
    
    if (!GA4_API_SECRET) {
      logStep("GA4 API secret not configured, skipping GA4 tracking");
      return;
    }

    const payload = {
      client_id: refundData.user_id || 'anonymous',
      events: [{
        name: 'refund',
        parameters: {
          transaction_id: refundData.refund_transaction_id || `refund_${refundData.original_transaction_id}_${Date.now()}`,
          original_transaction_id: refundData.original_transaction_id,
          value: -Math.abs(refundData.refund_amount), // Always negative for refunds
          currency: refundData.currency || 'ILS',
          refund_reason: refundData.refund_reason,
          plan_type: refundData.plan_type,
          subscription_id: refundData.subscription_id,
          items: [{
            item_id: `refund_${refundData.plan_type}`,
            item_name: `Refund for ${refundData.plan_type} subscription`,
            item_category: 'refund',
            price: -Math.abs(refundData.refund_amount),
            quantity: 1
          }]
        }
      }]
    };

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      logStep("Refund event sent to GA4 successfully");
    } else {
      logStep("Failed to send refund event to GA4", { status: response.status });
    }
  } catch (error) {
    logStep("Error sending refund event to GA4", error);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Refund tracking request received", { method: req.method });

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const refundData: RefundEventData = await req.json();
    
    logStep("Processing refund event", {
      originalTransactionId: refundData.original_transaction_id,
      refundAmount: refundData.refund_amount,
      planType: refundData.plan_type
    });

    // Validate required fields
    if (!refundData.original_transaction_id || !refundData.refund_amount) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields: original_transaction_id and refund_amount" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure refund amount is positive (we'll make it negative in tracking)
    if (refundData.refund_amount <= 0) {
      return new Response(JSON.stringify({ 
        error: "Refund amount must be positive" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Track the refund event
    await trackRefundToGA4(refundData);

    logStep("Refund event tracked successfully");

    return new Response(JSON.stringify({
      status: "success",
      message: "Refund event tracked successfully",
      transaction_id: refundData.refund_transaction_id || `refund_${refundData.original_transaction_id}_${Date.now()}`
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Error processing refund tracking", error);
    
    return new Response(JSON.stringify({
      status: "error",
      message: "Failed to track refund event",
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});