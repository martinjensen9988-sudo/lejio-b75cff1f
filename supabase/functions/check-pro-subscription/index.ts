import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map price IDs to tier names
const PRICE_TO_TIER: Record<string, string> = {
  "price_1SdNcKHoHnimcmNgf138iD4F": "starter",
  "price_1SdNcPHoHnimcmNgLizHnZML": "standard",
  "price_1SdNcRHoHnimcmNgDGcli7JG": "enterprise",
};

const TIER_DETAILS: Record<string, { name: string; maxVehicles: number; price: number }> = {
  starter: { name: "LEJIO Pro - Starter", maxVehicles: 5, price: 299 },
  standard: { name: "LEJIO Pro - Standard", maxVehicles: 15, price: 499 },
  enterprise: { name: "LEJIO Pro - Enterprise", maxVehicles: 999, price: 799 },
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PRO-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("LEJIO_STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("LEJIO_STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get profile to check trial status
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('user_type, trial_ends_at, subscription_status')
      .eq('id', user.id)
      .single();

    // Check if user is in active trial period
    const isInTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date();
    const trialDaysLeft = isInTrial 
      ? Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    logStep("Trial status", { isInTrial, trialDaysLeft, trialEndsAt: profile?.trial_ends_at });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({
        subscribed: false,
        tier: null,
        tier_name: null,
        max_vehicles: isInTrial ? 5 : 1, // Trial users get starter limits
        subscription_end: null,
        stripe_customer_id: null,
        is_trial: isInTrial,
        trial_days_left: trialDaysLeft,
        trial_ends_at: profile?.trial_ends_at || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logStep("No active subscription found");

      // Update profile to reflect no subscription
      await supabaseClient
        .from('profiles')
        .update({
          subscription_status: isInTrial ? 'trial' : 'inactive',
          stripe_customer_id: customerId,
          stripe_subscription_id: null,
        })
        .eq('id', user.id);

      return new Response(JSON.stringify({
        subscribed: false,
        tier: null,
        tier_name: null,
        max_vehicles: isInTrial ? 5 : 1, // Trial users get starter limits
        subscription_end: null,
        stripe_customer_id: customerId,
        is_trial: isInTrial,
        trial_days_left: trialDaysLeft,
        trial_ends_at: profile?.trial_ends_at || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    const tier = PRICE_TO_TIER[priceId] || "starter";
    const tierDetails = TIER_DETAILS[tier];
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

    logStep("Active subscription found", {
      subscriptionId: subscription.id,
      priceId,
      tier,
      endDate: subscriptionEnd,
    });

    // Update profile with subscription info
    await supabaseClient
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_tier: tier,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        subscription_started_at: new Date(subscription.start_date * 1000).toISOString(),
        subscription_ends_at: subscriptionEnd,
      })
      .eq('id', user.id);

    logStep("Profile updated with subscription info");

    return new Response(JSON.stringify({
      subscribed: true,
      tier: tier,
      tier_name: tierDetails.name,
      max_vehicles: tierDetails.maxVehicles,
      price: tierDetails.price,
      subscription_end: subscriptionEnd,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      is_trial: false,
      trial_days_left: 0,
      trial_ends_at: null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
