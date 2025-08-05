import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CardComWebhookPayload {
  ResponseCode: number;
  Description?: string;
  TerminalNumber: number;
  LowProfileId: string;
  TranzactionId: number;
  ReturnValue?: string;
  Amount?: number;
  ISOCoinId?: number;
  CardHolderName?: string;
  CardNum?: string;
  CardExpiration?: string;
  OperationResult?: string;
  OperationResultDescription?: string;
  DealDate?: string;
  VoucherNumber?: string;
  AuthNumber?: string;
}

interface ReturnValueData {
  userId: string;
  planType: string;
  timestamp: number;
  source: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CARDCOM-WEBHOOK] ${step}${detailsStr}`);
};

const parseReturnValue = (returnValue: string): ReturnValueData | null => {
  try {
    return JSON.parse(returnValue);
  } catch (error) {
    logStep("Failed to parse return value", { returnValue, error: error.message });
    return null;
  }
};

const sendThankYouEmail = async (supabaseClient: any, userId: string, planType: string) => {
  try {
    // Get user profile to extract email and name
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, display_name')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      logStep("Warning: Could not fetch user profile for thank-you email", profileError);
      return;
    }

    // Map plan type to Hebrew display name
    const planTypeMap: { [key: string]: string } = {
      'daily': 'יומי',
      'weekly': 'שבועי', 
      'monthly': 'חודשי',
      'quarterly': 'רבעוני (3 חודשים)'
    };

    const subscriptionTypeHebrew = planTypeMap[planType] || planType;
    const firstName = profile.display_name || profile.email.split('@')[0];

    // Call email service to send thank-you email
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/email-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        type: 'thank-you',
        to: profile.email,
        firstName: firstName,
        subscriptionType: subscriptionTypeHebrew
      })
    });

    if (emailResponse.ok) {
      logStep("Thank-you email sent successfully", { email: profile.email, planType });
    } else {
      const errorData = await emailResponse.text();
      logStep("Warning: Failed to send thank-you email", { error: errorData });
    }

  } catch (error) {
    logStep("Warning: Error sending thank-you email", error);
  }
};

const createSubscription = async (
  supabaseClient: any,
  userId: string,
  planType: string,
  transactionId: number,
  amount: number,
  payload: CardComWebhookPayload
) => {
  try {
    logStep("Creating subscription", { userId, planType, transactionId, amount });

    // Map plan types to database schema and calculate end date
    const startDate = new Date();
    const endDate = new Date();
    let dbPlanType: string;
    let paymentPlanType: string; // For payment_transactions table
    
    switch (planType) {
      case 'daily':
        dbPlanType = 'day';
        paymentPlanType = 'daily';
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        dbPlanType = 'week';
        paymentPlanType = 'weekly';
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        dbPlanType = 'month';
        paymentPlanType = 'monthly';
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'quarterly':
        dbPlanType = '3months';
        paymentPlanType = 'quarterly';
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      default:
        throw new Error(`Invalid plan type: ${planType}`);
    }

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: dbPlanType,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (subscriptionError) {
      throw subscriptionError;
    }

    logStep("Subscription created successfully", { subscriptionId: subscription.id });

    // Create payment transaction record (updated for new schema)
    const { error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: userId,
        subscription_id: subscription.id,
        low_profile_code: payload.LowProfileId, // New required field
        plan_type: paymentPlanType, // New required field (use mapped planType)
        amount: Math.round(amount), // Convert to integer as required by new schema
        currency: 'ILS',
        status: 'completed',
        metadata: {
          transaction_id: transactionId.toString(),
          payment_method: 'cardcom',
          terminal_number: payload.TerminalNumber,
          deal_date: payload.DealDate,
          voucher_number: payload.VoucherNumber,
          auth_number: payload.AuthNumber
        }
      });

    if (transactionError) {
      logStep("Warning: Failed to create transaction record", transactionError);
    }

    // Send thank-you email after successful subscription creation
    await sendThankYouEmail(supabaseClient, userId, planType);

    return { success: true, subscriptionId: subscription.id };

  } catch (error) {
    logStep("Error creating subscription", error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook request received", { 
      method: req.method, 
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
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

    // Parse webhook payload
    const payload: CardComWebhookPayload = await req.json();
    logStep("Webhook payload received", payload);

    // Validate webhook payload
    if (!payload.LowProfileId || !payload.TerminalNumber) {
      logStep("Invalid webhook payload - missing required fields");
      return new Response(JSON.stringify({ error: "Invalid payload structure" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify terminal number matches our configuration (production or sandbox)
    const expectedProdTerminal = 172801;
    const expectedSandboxTerminal = 1000;
    const isValidTerminal = payload.TerminalNumber === expectedProdTerminal || 
                           payload.TerminalNumber === expectedSandboxTerminal;
    
    if (!isValidTerminal) {
      logStep("Invalid terminal number", { 
        received: payload.TerminalNumber, 
        expectedProd: expectedProdTerminal,
        expectedSandbox: expectedSandboxTerminal
      });
      return new Response(JSON.stringify({ error: "Invalid terminal number" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const isTestPayment = payload.TerminalNumber === expectedSandboxTerminal;
    logStep("Terminal validation passed", { 
      terminalNumber: payload.TerminalNumber,
      environment: isTestPayment ? 'SANDBOX' : 'PRODUCTION'
    });

    // Check if payment was successful
    if (payload.ResponseCode !== 0) {
      logStep("Payment failed", { 
        responseCode: payload.ResponseCode, 
        description: payload.Description 
      });
      
      // Still return success to CardCom to acknowledge receipt
      return new Response(JSON.stringify({ 
        status: "received", 
        message: "Payment failure acknowledged" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse return value to get user and plan information
    if (!payload.ReturnValue) {
      logStep("Missing return value in successful payment");
      return new Response(JSON.stringify({ error: "Missing return value" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const returnData = parseReturnValue(payload.ReturnValue);
    if (!returnData) {
      return new Response(JSON.stringify({ error: "Invalid return value format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the payment source
    if (returnData.source !== 'amiram-premium') {
      logStep("Invalid payment source", { source: returnData.source });
      return new Response(JSON.stringify({ error: "Invalid payment source" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if this transaction was already processed (updated for new schema)
    const { data: existingTransaction } = await supabaseClient
      .from('payment_transactions')
      .select('id')
      .eq('low_profile_code', payload.LowProfileId)
      .single();

    if (existingTransaction) {
      logStep("Transaction already processed", { transactionId: payload.TranzactionId });
      return new Response(JSON.stringify({ 
        status: "already_processed", 
        message: "Transaction already handled" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create subscription for successful payment
    try {
      const result = await createSubscription(
        supabaseClient,
        returnData.userId,
        returnData.planType,
        payload.TranzactionId,
        payload.Amount || 0,
        payload
      );

      logStep("Webhook processed successfully", result);

      // Return success response to CardCom
      return new Response(JSON.stringify({
        status: "success",
        message: "Payment processed successfully",
        subscriptionId: result.subscriptionId
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      logStep("Error processing payment", error);
      
      // Return error but still acknowledge receipt to CardCom
      return new Response(JSON.stringify({
        status: "error",
        message: "Internal processing error",
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    logStep("Webhook error", error);
    
    return new Response(JSON.stringify({
      status: "error",
      message: "Webhook processing failed",
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});