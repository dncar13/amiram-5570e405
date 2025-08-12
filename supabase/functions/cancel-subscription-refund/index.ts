import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CancelSubscriptionRequest {
  userId: string;
  subscriptionId: string;
  cancellationReason?: string;
  provider?: string;
  idemKey?: string;
  refundCents?: number;
}

interface RefundCalculationResult {
  refund_amount: number;
  cancellation_fee: number;
  unused_days: number;
  total_days: number;
  eligible_for_refund: boolean;
}

interface CardComRefundRequest {
  ApiName: string;
  ApiPassword: string;
  TransactionId: string;
  PartialSum: number;
  AllowMultipleRefunds: boolean;
}

interface CardComRefundResponse {
  ResponseCode: number;
  Description?: string;
  NewTranzactionId?: number;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-REFUND] ${step}${detailsStr}`);
};

const getCardComApiUrl = (): string => {
  // Check if we're in test environment based on hostname or environment variable
  const isTest = Deno.env.get("ENVIRONMENT") === "test" || 
                 Deno.env.get("CARDCOM_ENVIRONMENT") === "sandbox";
  
  return isTest 
    ? "https://secure.cardcom.solutions"  // Sandbox
    : "https://secure.cardcom.solutions"; // Production (same base URL, different credentials)
};

const processCardComRefund = async (
  transactionId: string,
  refundAmount: number
): Promise<{ success: boolean; refundTransactionId?: number; error?: string }> => {
  const apiName = Deno.env.get("CARDCOM_API_NAME");
  const apiPassword = Deno.env.get("CARDCOM_API_PASSWORD");
  
  if (!apiName || !apiPassword) {
    logStep("Missing CardCom credentials");
    return { success: false, error: "חסרים פרטי התחברות ל-CardCom" };
  }
  
  const refundRequest: CardComRefundRequest = {
    ApiName: apiName,
    ApiPassword: apiPassword,
    TransactionId: transactionId,
    PartialSum: refundAmount,
    AllowMultipleRefunds: false
  };
  
  logStep("Sending refund request to CardCom", {
    TransactionId: transactionId,
    PartialSum: refundAmount
  });
  
  try {
    const apiUrl = `${getCardComApiUrl()}/api/v11/Transactions/RefundByTransactionId`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(refundRequest)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CardComRefundResponse = await response.json();
    
    logStep("CardCom refund response", result);
    
    if (result.ResponseCode === 0 && result.NewTranzactionId) {
      return {
        success: true,
        refundTransactionId: result.NewTranzactionId
      };
    } else {
      return {
        success: false,
        error: result.Description || "שגיאה בביצוע החזר"
      };
    }
  } catch (error) {
    logStep("CardCom refund error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "שגיאה לא ידועה"
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Cancel subscription refund request received", {
      method: req.method,
      url: req.url
    });

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body
    const requestBody: CancelSubscriptionRequest = await req.json();
    logStep("Request body", requestBody);

    const { userId, subscriptionId, cancellationReason = "ביטול על ידי המשתמש" } = requestBody;
    const provider = requestBody.provider || 'cardcom';
    const idemKey = requestBody.idemKey ?? null;


    // Step 1: Get subscription details
    logStep("Fetching subscription details", { subscriptionId });
    
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscription) {
      logStep("Subscription not found or not active", subscriptionError);
      return new Response(JSON.stringify({ 
        error: "מנוי לא נמצא או כבר בוטל" 
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Subscription found", subscription);

    // Step 2: Get payment transaction details
    logStep("Fetching payment transaction");
    
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (transactionError) {
      logStep("Error querying payment transaction", transactionError);
      return new Response(JSON.stringify({ 
        error: "שגיאה בשליפת נתוני עסקת התשלום" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!transaction) {
      logStep("No completed payment transaction found for subscription - handling as free/coupon subscription", { subscriptionId });
      
      // For free/coupon subscriptions without payment transaction, just cancel without refund
      const { error: cancelError } = await supabaseClient
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancellationReason
        })
        .eq('id', subscriptionId);

      if (cancelError) {
        logStep("Failed to cancel free subscription", cancelError);
        return new Response(JSON.stringify({ 
          error: "שגיאה בביטול המנוי" 
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Return success response for free subscription cancellation
      const response = {
        success: true,
        message: "ביטול המנוי בוצע בהצלחה",
        refund: {
          eligible: false,
          amount: 0,
          cancellationFee: 0,
          processed: false,
          refundTransactionId: null
        },
        subscription: {
          id: subscriptionId,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        }
      };

      logStep("Free subscription cancelled successfully", response);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Payment transaction found", {
      transactionId: transaction.transaction_id,
      amount: transaction.amount
    });

    // Step 3: Calculate refund amount
    logStep("Calculating refund amount");
    
    const { data: refundCalc, error: calcError } = await supabaseClient
      .rpc('calculate_refund_amount', {
        p_original_amount: transaction.amount,
        p_start_date: subscription.start_date,
        p_end_date: subscription.end_date,
        p_cancel_date: new Date().toISOString(),
        p_plan_type: subscription.plan_type
      }) as { data: RefundCalculationResult[] | null, error: any };

    if (calcError || !refundCalc || refundCalc.length === 0) {
      logStep("Failed to calculate refund", calcError);
      return new Response(JSON.stringify({ 
        error: "שגיאה בחישוב החזר" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const calculation = refundCalc[0];
    logStep("Refund calculation result", calculation);

    // Step 4: Create refund log entry
    logStep("Creating refund log entry");
    
    const { data: refundLog, error: logError } = await supabaseClient
      .from('refund_logs')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        original_transaction_id: transaction.transaction_id,
        original_amount: transaction.amount,
        refund_amount: calculation.refund_amount,
        cancellation_fee: calculation.cancellation_fee,
        unused_days: calculation.unused_days,
        total_days: calculation.total_days,
        status: calculation.eligible_for_refund ? 'pending' : 'completed'
      })
      .select()
      .single();

    if (logError) {
      logStep("Failed to create refund log", logError);
      return new Response(JSON.stringify({ 
        error: "שגיאה ביצירת רישום החזר" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let refundResult = null;
    
    // Step 5: Process refund if eligible
    if (calculation.eligible_for_refund && calculation.refund_amount > 0) {
      logStep("Processing refund with CardCom");
      
      refundResult = await processCardComRefund(
        transaction.transaction_id,
        calculation.refund_amount
      );

      // Update refund log with result
      const updateData: any = {
        processed_at: new Date().toISOString(),
        status: refundResult.success ? 'completed' : 'failed'
      };

      if (refundResult.success && refundResult.refundTransactionId) {
        updateData.refund_transaction_id = refundResult.refundTransactionId.toString();
      }

      if (!refundResult.success && refundResult.error) {  
        updateData.error_message = refundResult.error;
      }

      await supabaseClient
        .from('refund_logs')
        .update(updateData)
        .eq('id', refundLog.id);

      logStep("Refund log updated", updateData);
    }

    // Step 6: Cancel subscription
    logStep("Cancelling subscription");
    
    const subscriptionUpdateData: any = {
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: cancellationReason
    };

    if (refundResult?.success && refundResult.refundTransactionId) {
      subscriptionUpdateData.refunded_at = new Date().toISOString();
      subscriptionUpdateData.refunded_amount = calculation.refund_amount;
      subscriptionUpdateData.refunded_transaction_id = refundResult.refundTransactionId.toString();
    }

    const { error: cancelError } = await supabaseClient
      .from('subscriptions')
      .update(subscriptionUpdateData)
      .eq('id', subscriptionId);

    if (cancelError) {
      logStep("Failed to cancel subscription", cancelError);
      return new Response(JSON.stringify({ 
        error: "שגיאה בביטול המנוי" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 7: Create payment transaction record for refund (if processed)
    if (refundResult?.success && refundResult.refundTransactionId) {
      logStep("Creating refund transaction record");

      // Build unique low_profile_code for refund idempotency
      const refundLpc = `${transaction.low_profile_code}:refund:${idemKey ?? crypto.randomUUID()}`;

      // Optional idempotency key registration
      if (idemKey) {
        await supabaseClient
          .from('idempotency_keys')
          .insert({ key: idemKey, expires_at: new Date(Date.now() + 24*60*60*1000).toISOString() }, {
            onConflict: 'key',
            ignoreDuplicates: true,
          });
      }
      
      // Track refund event for analytics BEFORE creating transaction record
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        
        if (supabaseUrl && supabaseServiceKey) {
          await fetch(`${supabaseUrl}/functions/v1/track-refund-event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({
              original_transaction_id: transaction.transaction_id,
              refund_transaction_id: refundResult.refundTransactionId.toString(),
              refund_amount: calculation.refund_amount,
              original_amount: transaction.amount,
              currency: transaction.currency,
              refund_reason: 'subscription_cancellation',
              plan_type: subscription.plan_type,
              user_id: userId,
              subscription_id: subscriptionId
            })
          });
          
          logStep("Refund event tracked successfully");
        }
      } catch (error) {
        logStep("Warning: Failed to track refund event", error);
        // Don't fail the refund process if tracking fails
      }
      
      const insertPayload = {
        user_id: userId,
        subscription_id: subscriptionId,
        transaction_id: refundResult.refundTransactionId.toString(),
        provider,
        low_profile_code: refundLpc,
        amount: -calculation.refund_amount, // Negative amount for refund
        currency: transaction.currency,
        status: 'completed',
        is_refund: true,
        original_transaction_id: transaction.transaction_id,
        refund_reason: cancellationReason
      };

      const { error: refundInsertError } = await supabaseClient
        .from('payment_transactions')
        .insert(insertPayload, { onConflict: 'provider,low_profile_code', ignoreDuplicates: true });

      if (refundInsertError) {
        logStep('Warning: refund transaction insert error', refundInsertError);
      }

      // Link idempotency key to the refund transaction
      if (idemKey) {
        const { data: existingRefund } = await supabaseClient
          .from('payment_transactions')
          .select('id')
          .eq('provider', provider)
          .eq('low_profile_code', refundLpc)
          .maybeSingle();

        if (existingRefund?.id) {
          await supabaseClient
            .from('idempotency_keys')
            .update({ used_by: existingRefund.id })
            .eq('key', idemKey);
        }
      }
    }

    // Step 8: Return success response
    const response = {
      success: true,
      message: calculation.eligible_for_refund && calculation.refund_amount > 0
        ? "ביטול המנוי בוצע בהצלחה. החזר יבוצע תוך 14 ימי עסקים"
        : "ביטול המנוי בוצע בהצלחה",
      refund: {
        eligible: calculation.eligible_for_refund,
        amount: calculation.refund_amount,
        cancellationFee: calculation.cancellation_fee,
        processed: refundResult?.success || false,
        refundTransactionId: refundResult?.refundTransactionId || null
      },
      subscription: {
        id: subscriptionId,
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      }
    };

    logStep("Cancel subscription refund completed successfully", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Edge function error", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: "שגיאה פנימית בשרת",
      details: error instanceof Error ? error.message : "שגיאה לא ידועה"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});