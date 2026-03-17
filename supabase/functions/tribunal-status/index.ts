import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const commitId = url.searchParams.get("commit_id");

    if (!commitId) {
      return new Response(JSON.stringify({ error: "Missing commit_id parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get ledger entry
    const { data: ledger } = await serviceClient
      .from("gallows_ledger")
      .select("commit_id, phase, status, ratification_hash, ratified_at, tribunal_votes_approve, tribunal_votes_reject")
      .eq("commit_id", commitId)
      .single();

    if (!ledger) {
      return new Response(JSON.stringify({ error: "Commit not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get reviews (public: verdict + auditor info, no rationale)
    const { data: reviews } = await serviceClient
      .from("tribunal_reviews")
      .select("verdict, created_at, auditor_id, tribunal_auditors(auditor_name, organization, jurisdiction)")
      .eq("commit_id", commitId);

    const votes = (reviews || []).map((r: any) => ({
      verdict: r.verdict,
      created_at: r.created_at,
      auditor_name: r.tribunal_auditors?.auditor_name || "Unknown",
      organization: r.tribunal_auditors?.organization || "Unknown",
      jurisdiction: r.tribunal_auditors?.jurisdiction || "Unknown",
    }));

    const approvals = votes.filter((v) => v.verdict === "approve").length;
    const rejections = votes.filter((v) => v.verdict === "reject").length;
    const abstentions = votes.filter((v) => v.verdict === "abstain").length;
    const totalAuditors = 5;
    const threshold = 3;
    const ratified = approvals >= threshold;

    // Get total registered auditors
    const { count: registeredCount } = await serviceClient
      .from("tribunal_auditors")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");

    return new Response(JSON.stringify({
      commit_id: commitId,
      phase: ledger.phase,
      mpc_status: ledger.status,
      tribunal: {
        votes,
        approvals,
        rejections,
        abstentions,
        totalVotes: votes.length,
        registeredAuditors: registeredCount || 0,
        threshold: `${threshold}-of-${totalAuditors}`,
        ratified,
        ratificationHash: ledger.ratification_hash,
        ratifiedAt: ledger.ratified_at,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Tribunal status error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
