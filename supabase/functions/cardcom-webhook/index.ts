import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  terminalNumber: string;
  lowProfileCode: string;
  transactionId: string;
  operation: string;
  responseCode: string;
  description: string;
  amount: number;
  currency: string;
  transactionType: string;
  cardNumber?: string;
  cardExpiry?: string;
  customerName?: string;
  customerEmail?: string;
  customFields?: Record<string, any>;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('CardCom webhook received');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();
    console.log('Webhook payload:', payload);

    // Validate required fields
    if (!payload.terminalNumber || !payload.lowProfileCode || !payload.transactionId) {
      console.error('Missing required fields in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate terminal number (basic security check)
    const expectedTerminal = '1000'; // Should match your CardCom terminal
    if (payload.terminalNumber !== expectedTerminal) {
      console.error('Invalid terminal number:', payload.terminalNumber);
      return new Response(
        JSON.stringify({ error: 'Invalid terminal number' }), 
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find the payment transaction by lowProfileCode
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('low_profile_code', payload.lowProfileCode)
      .single();

    if (fetchError) {
      console.error('Error fetching transaction:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine payment status based on CardCom response
    let status: 'completed' | 'failed' | 'cancelled' = 'failed';
    
    if (payload.responseCode === '0' || payload.responseCode === '000') {
      status = 'completed';
    } else if (payload.operation === 'cancel') {
      status = 'cancelled';
    }

    console.log('Payment status:', status);

    // Update transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        transaction_id: payload.transactionId,
        status,
        metadata: {
          ...transaction.metadata,
          cardcom_response: payload,
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update transaction' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If payment successful, create subscription
    if (status === 'completed') {
      console.log('Creating subscription for user:', transaction.user_id);
      
      // Calculate subscription end date based on plan type
      const now = new Date();
      let endDate = new Date(now);
      
      switch (transaction.plan_type) {
        case 'daily':
          endDate.setDate(now.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(now.getDate() + 7);
          break;
        case 'monthly':
          endDate.setDate(now.getDate() + 30);
          break;
        case 'quarterly':
          endDate.setDate(now.getDate() + 90);
          break;
        default:
          console.error('Unknown plan type:', transaction.plan_type);
          endDate.setDate(now.getDate() + 30); // Default to monthly
      }

      // Create or update subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: transaction.user_id,
          plan_type: transaction.plan_type,
          status: 'active',
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: now.toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
        // Don't fail the webhook if subscription creation fails
        // The transaction is still recorded as successful
      } else {
        console.log('Subscription created successfully');
      }
    }

    console.log('Webhook processed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        status,
        transactionId: payload.transactionId 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});