import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const tierConfig: Record<string, { limit: number }> = {
  startup: { limit: 100 },
  growth: { limit: 1000 },
  enterprise: { limit: -1 },
  goliath: { limit: -1 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey) {
    logStep("ERROR: STRIPE_SECRET_KEY not set");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500, headers: corsHeaders });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        logStep("ERROR: Missing stripe-signature header");
        return new Response("Missing signature", { status: 400, headers: corsHeaders });
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { type: event.type });
    } else {
      event = JSON.parse(body);
      logStep("WARNING: No STRIPE_WEBHOOK_SECRET set, skipping signature verification", { type: event.type });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier || "startup";
      const customerEmail = session.customer_email || session.customer_details?.email;

      logStep("Checkout completed", { userId, tier, customerEmail, sessionId: session.id });

      if (!userId) {
        logStep("ERROR: No user_id in session metadata");
        return new Response(JSON.stringify({ error: "No user_id in metadata" }), { status: 400, headers: corsHeaders });
      }

      const config = tierConfig[tier] || tierConfig.startup;

      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          tier,
          status: "active",
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_session_id: session.id,
          verifications_limit: config.limit,
          verifications_used: 0,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: "user_id" });

      if (error) {
        logStep("ERROR upserting subscription", { error: error.message });
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
      }

      logStep("Subscription provisioned", { userId, tier });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

      logStep("Subscription cancelled", { customerId });

      if (customerId) {
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          logStep("ERROR updating cancelled subscription", { error: error.message });
        } else {
          logStep("Subscription marked cancelled", { customerId });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
