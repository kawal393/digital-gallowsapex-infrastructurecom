import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Verify admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const { data: roleCheck } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleCheck) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch aggregated data using service role (bypasses RLS)
    const [subsRes, compRes, vhRes, gallowsRes, usersRes] = await Promise.all([
      supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("compliance_results").select("*").order("updated_at", { ascending: false }),
      supabase.from("verification_history").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("gallows_ledger").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.auth.admin.listUsers({ perPage: 500 }),
    ]);

    const subscriptions = subsRes.data || [];
    const complianceResults = compRes.data || [];
    const recentVerifications = vhRes.data || [];
    const recentLedger = gallowsRes.data || [];
    const users = usersRes.data?.users || [];

    // Calculate stats
    const totalUsers = users.length;
    const paidUsers = subscriptions.filter(s => s.status === "active" && s.tier !== "free").length;
    const tierCounts: Record<string, number> = {};
    subscriptions.forEach(s => {
      const t = s.tier || "free";
      tierCounts[t] = (tierCounts[t] || 0) + 1;
    });

    const totalVerifications = subscriptions.reduce((sum, s) => sum + (s.verifications_used || 0), 0);
    const avgScore = complianceResults.length > 0
      ? Math.round(complianceResults.reduce((sum, c) => sum + c.overall_score, 0) / complianceResults.length)
      : 0;

    // Build customer list with user info
    const customers = users.map(u => {
      const sub = subscriptions.find(s => s.user_id === u.id);
      const comp = complianceResults.find(c => c.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        tier: sub?.tier || "free",
        status: sub?.status || "none",
        verifications_used: sub?.verifications_used || 0,
        compliance_score: comp?.overall_score ?? null,
        compliance_status: comp?.status ?? null,
        trio_mode: comp?.trio_mode ?? null,
        company_name: comp?.company_name ?? null,
      };
    });

    return new Response(JSON.stringify({
      stats: {
        total_users: totalUsers,
        paid_users: paidUsers,
        tier_counts: tierCounts,
        total_verifications: totalVerifications,
        avg_compliance_score: avgScore,
      },
      customers,
      recent_verifications: recentVerifications.slice(0, 50),
      recent_ledger: recentLedger,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
