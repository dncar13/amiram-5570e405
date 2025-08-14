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
  checksum?: string; // Optional checksum for validation
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CARDCOM-WEBHOOK] ${step}${detailsStr}`);
};

/**
 * Generate checksum for validation (matches client-side implementation)
 * Format: SHA-256(timestamp + userId + SECRET_SALT)
 */
const generateChecksum = async (timestamp: number, userId: string): Promise<string> => {
  const SECRET_SALT = 'amiram_analytics_2025_salt_key'; // Should match client-side
  const data = `${timestamp}_${userId}_${SECRET_SALT}`;
  
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Return first 16 characters for compactness (matches client)
    return hashHex.substring(0, 16);
  } catch (error) {
    logStep("Checksum generation failed, using fallback", error);
    // Fallback for environments without crypto.subtle
    const fallback = btoa(`${timestamp}_${userId}_${Date.now()}`).replace(/[+/=]/g, '');
    return fallback.substring(0, 16);
  }
};

/**
 * Validate transaction checksum
 */
const validateChecksum = async (timestamp: number, userId: string, providedChecksum: string): Promise<boolean> => {
  try {
    const expectedChecksum = await generateChecksum(timestamp, userId);
    const isValid = expectedChecksum === providedChecksum;
    
    logStep("Checksum validation", {
      expected: expectedChecksum,
      provided: providedChecksum,
      valid: isValid
    });
    
    return isValid;
  } catch (error) {
    logStep("Checksum validation error", error);
    return false; // Fail secure - reject invalid checksums
  }
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
  payload: CardComWebhookPayload,
  checksum?: string
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
        dbPlanType = 'daily';
        paymentPlanType = 'daily';
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        dbPlanType = 'weekly';
        paymentPlanType = 'weekly';
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        dbPlanType = 'monthly';
        paymentPlanType = 'monthly';
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'quarterly':
        dbPlanType = 'quarterly';
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

    // Use idempotent transaction creation function
    const { data: transactionResult, error: transactionError } = await supabaseClient
      .rpc('create_idempotent_transaction', {
        p_user_id: userId,
        p_subscription_id: subscription.id,
        p_low_profile_code: payload.LowProfileId,
        p_plan_type: paymentPlanType,
        p_amount: Math.round(amount),
        p_currency: 'ILS',
        p_status: 'completed',
        p_transaction_id: transactionId.toString(),
        p_checksum: checksum,
        p_metadata: {
          payment_method: 'cardcom',
          terminal_number: payload.TerminalNumber,
          deal_date: payload.DealDate,
          voucher_number: payload.VoucherNumber,
          auth_number: payload.AuthNumber,
          cardcom_transaction_id: transactionId
        }
      });

    if (transactionError) {
      throw new Error(`Failed to create idempotent transaction: ${transactionError.message}`);
    }

    const result = transactionResult[0];
    if (!result.created) {
      // Transaction already exists - this is a duplicate webhook
      logStep("Duplicate transaction detected", {
        existingTransactionId: result.transaction_id,
        message: result.message
      });
      
      // Log the duplicate attempt
      await supabaseClient
        .from('transaction_idempotency_log')
        .insert({
          low_profile_code: payload.LowProfileId,
          transaction_id: transactionId.toString(),
          checksum: checksum,
          user_id: userId,
          failure_reason: 'Duplicate webhook received',
          request_data: {
            payload: payload,
            planType: planType,
            amount: amount
          }
        });

      // Return 409 Conflict for duplicate
      throw new Error(`DUPLICATE_TRANSACTION:${result.transaction_id}`);
    }

    logStep("Idempotent transaction created successfully", {
      transactionId: result.transaction_id,
      created: result.created,
      message: result.message
    });

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

    // Validate checksum if provided (optional for backward compatibility)
    if (returnData.checksum && returnData.timestamp) {
      const isValidChecksum = await validateChecksum(returnData.timestamp, returnData.userId, returnData.checksum);
      
      if (!isValidChecksum) {
        logStep("Invalid transaction checksum", {
          userId: returnData.userId,
          timestamp: returnData.timestamp,
          checksum: returnData.checksum
        });
        
        return new Response(JSON.stringify({ 
          error: "Invalid transaction checksum",
          code: "CHECKSUM_VALIDATION_FAILED"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      logStep("Checksum validation passed", { userId: returnData.userId });
    } else {
      logStep("No checksum provided - allowing for backward compatibility");
    }

    // Use idempotent transaction creation with HTTP 409 for conflicts
    // This will be handled by the createSubscription function with proper error codes

    // Record webhook event idempotently
    const provider = 'cardcom';
    const eventId = String(payload.TranzactionId);
    const headersObj = Object.fromEntries(req.headers.entries());

    const { error: eventInsertError } = await supabaseClient
      .from('payment_webhook_events')
      .insert({ provider, event_id: eventId, payload, headers: headersObj }, {
        onConflict: 'provider,event_id',
        ignoreDuplicates: true,
      });

    if (eventInsertError && eventInsertError.code !== '23505') {
      logStep("Error inserting webhook event", eventInsertError);
      return new Response(JSON.stringify({ error: "Event logging failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If duplicate event already handled, exit gracefully
    const { data: existingEvent } = await supabaseClient
      .from('payment_webhook_events')
      .select('handled')
      .eq('provider', provider)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent?.handled) {
      return new Response(JSON.stringify({
        status: "duplicate",
        message: "Event already processed",
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
        payload,
        returnData.checksum // Pass checksum for idempotency
      );

      logStep("Webhook processed successfully", result);

      // Mark event as handled
      await supabaseClient
        .from('payment_webhook_events')
        .update({ handled: true })
        .eq('provider', provider)
        .eq('event_id', eventId);

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
      
      // Check if this is a duplicate transaction error
      if (error.message && error.message.startsWith('DUPLICATE_TRANSACTION:')) {
        const existingTransactionId = error.message.split(':')[1];
        
        return new Response(JSON.stringify({
          status: "duplicate",
          message: "Transaction already processed",
          existing_transaction_id: existingTransactionId,
          code: "TRANSACTION_ALREADY_EXISTS"
        }), {
          status: 409, // HTTP 409 Conflict
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Return error but still acknowledge receipt to CardCom for other errors
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