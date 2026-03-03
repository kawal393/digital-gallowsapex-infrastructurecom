import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check subscription — API access requires Growth+ tier
    const subRes = await supabaseClient.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
    if (!subRes.data || subRes.data.status !== "active") {
      throw new Error("Active subscription required for API access");
    }

    const allowedTiers = ["growth", "enterprise", "goliath"];
    if (!allowedTiers.includes(subRes.data.tier)) {
      throw new Error("API access requires Growth tier or above. Please upgrade your plan.");
    }

    // Get compliance data
    const [compRes, vhRes, qRes] = await Promise.all([
      supabaseClient.from("compliance_results").select("*").eq("user_id", user.id).maybeSingle(),
      supabaseClient.from("verification_history").select("*").eq("user_id", user.id).order("article_number"),
      supabaseClient.from("questionnaire_responses").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    if (!compRes.data) {
      return new Response(JSON.stringify({ error: "No compliance data found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const response = {
      company: compRes.data.company_name,
      score: compRes.data.overall_score,
      status: compRes.data.status,
      trio_mode: compRes.data.trio_mode,
      next_audit: compRes.data.next_audit_date,
      updated_at: compRes.data.updated_at,
      articles: (vhRes.data || []).map((v: any) => ({
        article: v.article_number,
        title: v.article_title,
        status: v.status,
        verified_at: v.verified_at,
        merkle_hash: v.merkle_proof_hash,
      })),
      subscription: {
        tier: subRes.data.tier,
        verifications_used: subRes.data.verifications_used,
        verifications_limit: subRes.data.verifications_limit,
        period_end: subRes.data.current_period_end,
      },
      questionnaire_completed: qRes.data?.completed ?? false,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const status = msg.includes("requires Growth") ? 403 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });
  }
});
