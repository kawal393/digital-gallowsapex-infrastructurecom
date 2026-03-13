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
      return new Response(JSON.stringify({ error: "Forbidden: Master access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { method } = await req.json().catch(() => ({ method: "GET" }));
    const body = await req.clone().json().catch(() => ({}));

    // Handle different actions
    if (body.action === "toggle_partner_access") {
      const { assignment_id, is_active } = body;
      const { error } = await supabase
        .from("silo_assignments")
        .update({ is_active })
        .eq("id", assignment_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "assign_partner") {
      const { user_id, silo_id, access_level } = body;
      const { error } = await supabase
        .from("silo_assignments")
        .upsert({ user_id, silo_id, access_level: access_level || "partner", granted_by: userData.user.id, is_active: true }, { onConflict: "user_id,silo_id" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "revoke_partner") {
      const { user_id, silo_id } = body;
      const { error } = await supabase
        .from("silo_assignments")
        .update({ is_active: false })
        .eq("user_id", user_id)
        .eq("silo_id", silo_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "trigger_kill_switch") {
      const { silo_id, reason, severity } = body;
      const { error } = await supabase
        .from("kill_switch_log")
        .insert({ silo_id, triggered_by: userData.user.id, reason, severity: severity || "critical" });
      if (error) throw error;
      // Also deactivate all silo data
      await supabase
        .from("silo_data")
        .update({ status: "halted" })
        .eq("silo_id", silo_id)
        .eq("status", "active");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "resolve_kill_switch") {
      const { kill_switch_id, silo_id } = body;
      const { error } = await supabase
        .from("kill_switch_log")
        .update({ resolved_at: new Date().toISOString() })
        .eq("id", kill_switch_id);
      if (error) throw error;
      await supabase
        .from("silo_data")
        .update({ status: "active" })
        .eq("silo_id", silo_id)
        .eq("status", "halted");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "add_silo_data") {
      const { silo_id, record_type, title, description, metadata } = body;
      const { error } = await supabase
        .from("silo_data")
        .insert({ silo_id, record_type, title, description, metadata, created_by: userData.user.id });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "add_revenue_split") {
      const { silo_id, partner_user_id, deal_name, total_amount, partner_share, master_share } = body;
      const { error } = await supabase
        .from("revenue_splits")
        .insert({ silo_id, partner_user_id, deal_name, total_amount, partner_share: partner_share || 50, master_share: master_share || 50 });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: GET all master data
    const [silosRes, assignmentsRes, siloDataRes, revenueRes, killRes, usersRes] = await Promise.all([
      supabase.from("industry_silos").select("*").order("created_at"),
      supabase.from("silo_assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("silo_data").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("revenue_splits").select("*").order("created_at", { ascending: false }),
      supabase.from("kill_switch_log").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.auth.admin.listUsers({ perPage: 500 }),
    ]);

    const users = usersRes.data?.users || [];
    const silos = silosRes.data || [];
    const assignments = assignmentsRes.data || [];
    const siloData = siloDataRes.data || [];
    const revenue = revenueRes.data || [];
    const killLogs = killRes.data || [];

    // Compute per-silo stats
    const siloStats = silos.map(silo => {
      const siloRecords = siloData.filter(d => d.silo_id === silo.id);
      const siloRevenue = revenue.filter(r => r.silo_id === silo.id);
      const siloPartners = assignments.filter(a => a.silo_id === silo.id && a.is_active);
      const activeKills = killLogs.filter(k => k.silo_id === silo.id && !k.resolved_at);
      const totalRevenue = siloRevenue.reduce((s, r) => s + Number(r.total_amount), 0);
      const masterRevenue = siloRevenue.reduce((s, r) => s + (Number(r.total_amount) * Number(r.master_share) / 100), 0);

      return {
        ...silo,
        record_count: siloRecords.length,
        partner_count: siloPartners.length,
        total_revenue: totalRevenue,
        master_revenue: masterRevenue,
        active_kills: activeKills.length,
        is_halted: activeKills.length > 0,
      };
    });

    // Build partner list with user details
    const partnerList = assignments.map(a => {
      const u = users.find(u => u.id === a.user_id);
      const silo = silos.find(s => s.id === a.silo_id);
      return {
        ...a,
        email: u?.email || "Unknown",
        silo_name: silo?.display_name || "Unknown",
        silo_color: silo?.color || "#888",
      };
    });

    // Global revenue totals
    const totalGlobalRevenue = revenue.reduce((s, r) => s + Number(r.total_amount), 0);
    const totalMasterShare = revenue.reduce((s, r) => s + (Number(r.total_amount) * Number(r.master_share) / 100), 0);
    const totalPartnerShare = revenue.reduce((s, r) => s + (Number(r.total_amount) * Number(r.partner_share) / 100), 0);

    return new Response(JSON.stringify({
      silos: siloStats,
      partners: partnerList,
      silo_data: siloData,
      revenue,
      kill_logs: killLogs,
      users: users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at })),
      global_stats: {
        total_users: users.length,
        total_silos: silos.length,
        total_revenue: totalGlobalRevenue,
        master_share: totalMasterShare,
        partner_share: totalPartnerShare,
        active_kills: killLogs.filter(k => !k.resolved_at).length,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: error instanceof Error && msg.includes("Forbidden") ? 403 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
