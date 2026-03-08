// ═══════════════════════════════════════════════════════════════════════
// APEX GALLOWS — Public Hash Verification API
// POST /verify-hash { hash: "..." }
// Returns verification status against the immutable ledger
// ═══════════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { hash } = await req.json();

    if (!hash || typeof hash !== "string") {
      return new Response(
        JSON.stringify({
          error: "Missing or invalid 'hash' parameter",
          verified: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Search across all hash columns
    const { data, error } = await supabase
      .from("gallows_ledger")
      .select("*")
      .or(
        `commit_hash.eq.${hash},merkle_leaf_hash.eq.${hash},proof_hash.eq.${hash},challenge_hash.eq.${hash}`
      )
      .limit(1);

    if (error) {
      console.error("Database query error:", error);
      return new Response(
        JSON.stringify({
          error: "Database query failed",
          verified: false,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          verified: false,
          found: false,
          message: "Hash not found in the APEX Gallows immutable ledger",
          queried_at: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const entry = data[0];
    const hasMerkleProof = entry.merkle_proof && entry.merkle_root;

    return new Response(
      JSON.stringify({
        verified: true,
        found: true,
        merkle_verified: hasMerkleProof,
        commit_id: entry.commit_id,
        predicate_id: entry.predicate_id,
        phase: entry.phase,
        status: entry.status,
        merkle_root: entry.merkle_root,
        action_summary: entry.action.length > 100 
          ? entry.action.substring(0, 97) + "..." 
          : entry.action,
        created_at: entry.created_at,
        challenged_at: entry.challenged_at,
        proven_at: entry.proven_at,
        verification_time_ms: entry.verification_time_ms,
        violation_found: entry.violation_found,
        queried_at: new Date().toISOString(),
        engine: "APEX Digital Gallows v2.0",
        algorithm: "SHA-256",
        eu_ai_act_compliance: entry.status === "APPROVED",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        verified: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
