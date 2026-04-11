import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_EMAIL = "apex.manraj888@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { event, data } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.log("RESEND_API_KEY not set, skipping notification");
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subject = "";
    let html = "";

    switch (event) {
      case "lead_captured":
        subject = `🎯 New Lead: ${data.email || "Unknown"}`;
        html = `
          <h2 style="color:#d4a017;">New Lead Captured via Chat</h2>
          <p><strong>Name:</strong> ${data.name || "N/A"}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "N/A"}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p>💡 Drip sequence has been initiated.</p>
        `;
        break;

      case "compliance_change":
        subject = `📊 Compliance Change: ${data.company || "User"} → ${data.status}`;
        html = `
          <h2 style="color:#d4a017;">Compliance Status Changed</h2>
          <p><strong>Company:</strong> ${data.company || "N/A"}</p>
          <p><strong>New Score:</strong> ${data.score}%</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Mode:</strong> ${data.mode || "SHIELD"}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `;
        break;

      case "knowledge_gap":
        subject = `⚠️ Knowledge Gap: Bot couldn't answer`;
        html = `
          <h2 style="color:#d4a017;">Knowledge Gap Detected</h2>
          <p><strong>Question:</strong> ${data.question}</p>
          <p><strong>Conversation:</strong> ${data.conversation_id || "N/A"}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p>Consider updating the system prompt to cover this topic.</p>
        `;
        break;

      case "negative_feedback":
        subject = `👎 Negative Feedback on Chat`;
        html = `
          <h2 style="color:#d4a017;">Negative Chat Feedback</h2>
          <p><strong>Message:</strong> ${data.message_content || "N/A"}</p>
          <p><strong>Conversation:</strong> ${data.conversation_id || "N/A"}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `;
        break;

      default:
        return new Response(JSON.stringify({ error: "Unknown event type" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "APEX Notifications <onboarding@resend.dev>",
        to: [TARGET_EMAIL],
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0b0f;color:#e8e0d0;border-radius:12px;">${html}<hr style="border:none;border-top:1px solid #1a1a2e;margin-top:24px;"><p style="color:#555;font-size:11px;">APEX PSI · Automated Notification</p></div>`,
      }),
    });

    console.log("Webhook notification sent:", emailRes.status, event);

    return new Response(JSON.stringify({ success: true, event }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook-notify error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
