import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const statusLabels: Record<string, string> = {
  compliant: "COMPLIANT",
  mostly_compliant: "MOSTLY COMPLIANT",
  partially_compliant: "PARTIALLY COMPLIANT",
  non_compliant: "NON-COMPLIANT",
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
    const userId = userData.user.id;

    const [compRes, vhRes] = await Promise.all([
      supabase.from("compliance_results").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("verification_history").select("*").eq("user_id", userId).order("article_number"),
    ]);

    if (!compRes.data) throw new Error("No compliance results found");

    const comp = compRes.data;
    const verifications = vhRes.data || [];
    const statusColor = comp.status === "compliant" ? "#22c55e" : comp.status === "mostly_compliant" ? "#eab308" : comp.status === "partially_compliant" ? "#f97316" : "#ef4444";

    const articlesHtml = verifications.map(v => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;">${v.article_number}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;">${v.article_title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;color:${v.status === 'verified' ? '#22c55e' : v.status === 'failed' ? '#ef4444' : '#888'};">${v.status.toUpperCase()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1a1a2e;font-family:monospace;font-size:10px;word-break:break-all;">${v.merkle_proof_hash || '—'}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>APEX Compliance Certificate</title></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:40px;background:#0a0b0f;color:#e8e0d0;">
  <div style="max-width:800px;margin:0 auto;background:#0f1019;border:2px solid #d4a017;border-radius:16px;padding:48px;position:relative;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:14px;letter-spacing:6px;color:#d4a017;margin-bottom:8px;">APEX DIGITAL GALLOWS</div>
      <h1 style="font-size:28px;margin:0;color:#fff;letter-spacing:2px;">EU AI ACT COMPLIANCE CERTIFICATE</h1>
      <div style="width:60px;height:2px;background:#d4a017;margin:16px auto;"></div>
    </div>

    <div style="display:flex;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px;">
      <div>
        <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Company</div>
        <div style="font-size:18px;font-weight:bold;color:#fff;">${comp.company_name || "N/A"}</div>
      </div>
      <div style="text-align:right;">
        <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Status</div>
        <div style="font-size:18px;font-weight:bold;color:${statusColor};">${statusLabels[comp.status] || "N/A"}</div>
      </div>
    </div>

    <div style="display:flex;gap:24px;margin-bottom:32px;flex-wrap:wrap;">
      <div style="background:#1a1a2e;border-radius:8px;padding:16px 24px;flex:1;min-width:120px;text-align:center;">
        <div style="font-size:32px;font-weight:bold;color:#d4a017;">${comp.overall_score}%</div>
        <div style="color:#888;font-size:11px;">OVERALL SCORE</div>
      </div>
      <div style="background:#1a1a2e;border-radius:8px;padding:16px 24px;flex:1;min-width:120px;text-align:center;">
        <div style="font-size:32px;font-weight:bold;color:#d4a017;">${comp.trio_mode}</div>
        <div style="color:#888;font-size:11px;">VERIFICATION MODE</div>
      </div>
      <div style="background:#1a1a2e;border-radius:8px;padding:16px 24px;flex:1;min-width:120px;text-align:center;">
        <div style="font-size:16px;font-weight:bold;color:#fff;">${new Date(comp.updated_at).toLocaleDateString()}</div>
        <div style="color:#888;font-size:11px;">ASSESSMENT DATE</div>
      </div>
    </div>

    <h2 style="font-size:16px;color:#d4a017;margin-bottom:12px;">Article Verification Breakdown</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:32px;">
      <thead>
        <tr style="border-bottom:2px solid #d4a017;">
          <th style="padding:8px 12px;text-align:left;color:#d4a017;">Article</th>
          <th style="padding:8px 12px;text-align:left;color:#d4a017;">Title</th>
          <th style="padding:8px 12px;text-align:left;color:#d4a017;">Status</th>
          <th style="padding:8px 12px;text-align:left;color:#d4a017;">Merkle Proof Hash</th>
        </tr>
      </thead>
      <tbody>${articlesHtml}</tbody>
    </table>

    <div style="border-top:1px solid #1a1a2e;padding-top:24px;text-align:center;">
      <div style="color:#888;font-size:11px;margin-bottom:4px;">EU AI Act Enforcement Deadline: August 2, 2026</div>
      <div style="color:#555;font-size:10px;">Issued by APEX Infrastructure Pty Ltd · Melbourne, Australia</div>
      <div style="color:#555;font-size:10px;margin-top:4px;">Certificate ID: APEX-${userId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}</div>
    </div>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="APEX-Certificate-${comp.company_name || "company"}-${new Date().toISOString().slice(0, 10)}.html"`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
