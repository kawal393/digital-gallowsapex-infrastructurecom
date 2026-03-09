import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-platform-key, x-node-id, x-request-source",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "node-status";

  // ── ACTION: ping (unauthenticated) ──────────────────────────────────────
  if (action === "ping") {
    return new Response(
      JSON.stringify({
        status: "alive",
        node: "digital-gallows",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

  // ── Cross-node auth ───────────────────────────────────────────────────────
  const platformKey = req.headers.get("X-Platform-Key");
  const latticeKey = Deno.env.get("APEX_LATTICE_KEY");
  const sourceNode = req.headers.get("X-Node-Id") || "unknown";

  let isAuthorized = false;

  if (platformKey && latticeKey && platformKey === latticeKey) {
    isAuthorized = true;
  }

  const authHeader = req.headers.get("Authorization");
  if (!isAuthorized && authHeader?.startsWith("Bearer ")) {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData } = await userClient.auth.getClaims(token);
    if (claimsData?.claims?.sub) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return new Response(
      JSON.stringify({ error: "Unauthorized — valid X-Platform-Key or Bearer token required" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── ACTION: node-status ───────────────────────────────────────────────────
  if (action === "node-status") {
    let metrics: Record<string, unknown> = {};

    try {
      const [ledgerRes, verRes, complianceRes, usersRes] = await Promise.all([
        serviceClient.from("gallows_ledger").select("id", { count: "exact", head: true }),
        serviceClient.from("verification_history").select("id", { count: "exact", head: true }),
        serviceClient.from("compliance_results").select("id", { count: "exact", head: true }),
        serviceClient
          .from("gallows_ledger")
          .select("id", { count: "exact", head: true })
          .eq("phase", "PROVEN"),
      ]);

      metrics = {
        totalLedgerEntries: ledgerRes.count ?? 0,
        totalVerifications: verRes.count ?? 0,
        totalComplianceRecords: complianceRes.count ?? 0,
        totalProvenEntries: usersRes.count ?? 0,
        source: "direct-db",
      };
    } catch {
      metrics = { note: "Metrics unavailable" };
    }

    return new Response(
      JSON.stringify({
        node: "digital-gallows",
        name: "APEX INFRASTRUCTURE / DIGITAL GALLOWS",
        domain: "digital-gallowsapex-infrastructurecom.lovable.app",
        supabaseProjectId: Deno.env.get("SUPABASE_URL")?.match(/\/\/([^.]+)\./)?.[1] ?? "unknown",
        role: "Compliance Engine & Zero-Knowledge Audit Layer",
        status: "online",
        timestamp: new Date().toISOString(),
        metrics,
        requestedBy: sourceNode,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── ACTION: ingest-event ──────────────────────────────────────────────────
  if (action === "ingest-event" && req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    console.log("[sovereign-lattice] Cross-node event from:", sourceNode, body);

    // Optionally store the event in lattice_config for audit
    await serviceClient.from("lattice_config").upsert({
      key: `event:${sourceNode}:${Date.now()}`,
      value: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }),
    }).catch(() => null);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event received by Digital Gallows node",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── ACTION: ledger-snapshot ───────────────────────────────────────────────
  if (action === "ledger-snapshot") {
    const { data } = await serviceClient
      .from("gallows_public_ledger")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({ node: "digital-gallows", ledger: data ?? [], timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Unknown action",
      availableActions: ["node-status", "ingest-event", "ledger-snapshot"],
      node: "digital-gallows",
    }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
