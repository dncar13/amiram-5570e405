import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBSCRIPTION-END-EMAILS] ${step}${detailsStr}`);
};

const sendSubscriptionEndEmail = async (email: string, firstName: string) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/email-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        type: 'subscription-end',
        to: email,
        firstName: firstName
      })
    });

    if (emailResponse.ok) {
      logStep("Subscription-end email sent successfully", { email });
      return true;
    } else {
      const errorData = await emailResponse.text();
      logStep("Failed to send subscription-end email", { email, error: errorData });
      return false;
    }

  } catch (error) {
    logStep("Error sending subscription-end email", { email, error: error.message });
    return false;
  }
};

const processExpiredSubscriptions = async (supabaseClient: any) => {
  try {
    logStep("Starting to process expired subscriptions");

    // Get subscriptions that expired today (within the last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today = new Date();

    // Get expired subscriptions with user data from auth.users
    const { data: expiredSubscriptions, error } = await supabaseClient
      .from('subscriptions')
      .select(`
        id,
        user_id,
        end_date
      `)
      .eq('status', 'active')
      .gte('end_date', yesterday.toISOString())
      .lt('end_date', today.toISOString());

    if (error) {
      logStep("Error fetching expired subscriptions", error);
      throw error;
    }

    if (!expiredSubscriptions || expiredSubscriptions.length === 0) {
      logStep("No expired subscriptions found for today");
      return { processed: 0, successful: 0, failed: 0 };
    }

    logStep(`Found ${expiredSubscriptions.length} expired subscriptions to process`);

    let successful = 0;
    let failed = 0;

    // Process each expired subscription
    for (const subscription of expiredSubscriptions) {
      try {
        // Get user email from auth.users
        const { data: user, error: userError } = await supabaseClient.auth.admin.getUserById(subscription.user_id);
        
        if (userError || !user?.user?.email) {
          logStep("Could not get user email", { userId: subscription.user_id, error: userError });
          failed++;
          continue;
        }

        const userEmail = user.user.email;
        const firstName = user.user.user_metadata?.display_name || 
                         user.user.user_metadata?.name ||
                         userEmail.split('@')[0];

        // Check if we already sent an end-of-subscription email for this user recently
        const { data: recentEmail } = await supabaseClient
          .from('email_logs')
          .select('id')
          .eq('email_type', 'subscription-end')
          .eq('recipient_email', userEmail)
          .eq('status', 'sent')
          .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
          .limit(1)
          .single();

        if (recentEmail) {
          logStep("Subscription-end email already sent recently", {
            userId: subscription.user_id,
            email: userEmail
          });
          continue;
        }

        // Send subscription-end email
        const emailSent = await sendSubscriptionEndEmail(
          userEmail,
          firstName
        );

        if (emailSent) {
          successful++;
          
          // Update subscription status to expired
          const { error: updateError } = await supabaseClient
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', subscription.id);

          if (updateError) {
            logStep("Warning: Failed to update subscription status", {
              subscriptionId: subscription.id,
              error: updateError
            });
          }
        } else {
          failed++;
        }

      } catch (subscriptionError) {
        logStep("Error processing individual subscription", {
          subscriptionId: subscription.id,
          error: subscriptionError
        });
        failed++;
      }
    }

    logStep("Finished processing expired subscriptions", {
      total: expiredSubscriptions.length,
      successful,
      failed
    });

    return { processed: expiredSubscriptions.length, successful, failed };

  } catch (error) {
    logStep("Error processing expired subscriptions", error);
    throw error;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Subscription end emails job started", { 
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // This function can be called via POST request or scheduled via cron
    if (req.method !== "POST" && req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify authorization for scheduled calls
    const authHeader = req.headers.get('Authorization');
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!authHeader || (!authHeader.includes(supabaseServiceKey!) && !authHeader.includes('Bearer'))) {
      logStep("Unauthorized request");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      supabaseServiceKey ?? "",
      { auth: { persistSession: false } }
    );

    // Process expired subscriptions
    const result = await processExpiredSubscriptions(supabaseClient);

    logStep("Subscription end emails job completed", result);

    return new Response(JSON.stringify({
      status: "success",
      message: "Subscription end emails processed successfully",
      result: result
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Subscription end emails job error", error);
    
    return new Response(JSON.stringify({
      status: "error",
      message: "Subscription end emails job failed",
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});