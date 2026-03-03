import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simulated Merkle tree hash generation
function generateMerkleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const timestamp = Date.now().toString(16);
  return `0x${hex}${timestamp}`.slice(0, 42).padEnd(42, '0');
}

// SHIELD mode: Private compliance verification
function runShieldVerification(questionnaire: any, article: string) {
  const checks: Record<string, () => { pass: boolean; details: string }> = {
    "Article 12": () => {
      const hasGovernance = questionnaire.governance_policy === "documented";
      const hasOfficer = questionnaire.compliance_officer === "yes";
      return {
        pass: hasGovernance && hasOfficer,
        details: hasGovernance ? "Record-keeping framework documented" : "Missing formal record-keeping policy",
      };
    },
    "Article 13": () => {
      const informed = questionnaire.users_informed === "always";
      const labeled = questionnaire.ai_content_labeled === "yes";
      return {
        pass: informed && labeled,
        details: informed ? "Transparency requirements met" : "Users not consistently informed about AI usage",
      };
    },
    "Article 14": () => {
      const explanation = questionnaire.right_to_explanation === "fully";
      const noAutoDecisions = questionnaire.automated_decisions === "no";
      return {
        pass: explanation || noAutoDecisions,
        details: explanation ? "Human oversight mechanisms in place" : "Insufficient human oversight controls",
      };
    },
    "Article 15": () => {
      const riskAssessment = questionnaire.risk_assessments === "recent";
      const noHighRisk = (questionnaire.high_risk_uses || []).filter((u: string) => u !== "None").length === 0;
      return {
        pass: riskAssessment || noHighRisk,
        details: riskAssessment ? "Recent risk assessment conducted" : "Risk assessment outdated or missing",
      };
    },
  };

  const check = checks[article];
  if (!check) return { pass: false, details: "Unknown article" };
  return check();
}

// SWORD mode: Public audit trail verification (adds public proof)
function runSwordVerification(questionnaire: any, article: string) {
  const shield = runShieldVerification(questionnaire, article);
  return {
    ...shield,
    publicAudit: true,
    auditTrailId: `SWORD-${Date.now().toString(36).toUpperCase()}`,
  };
}

// JUDGE mode: Canonical standard verification (strictest)
function runJudgeVerification(questionnaire: any, article: string) {
  const sword = runSwordVerification(questionnaire, article);
  // Judge mode requires ALL criteria to be met at the highest standard
  const strictChecks: Record<string, boolean> = {
    "Article 12": questionnaire.governance_policy === "documented" && questionnaire.compliance_officer === "yes" && questionnaire.risk_assessments === "recent",
    "Article 13": questionnaire.users_informed === "always" && questionnaire.ai_content_labeled === "yes" && questionnaire.right_to_explanation === "fully",
    "Article 14": questionnaire.right_to_explanation === "fully" && questionnaire.automated_decisions === "no",
    "Article 15": questionnaire.risk_assessments === "recent" && (questionnaire.high_risk_uses || []).filter((u: string) => u !== "None").length === 0,
  };

  return {
    ...sword,
    canonicalStandard: true,
    pass: strictChecks[article] ?? false,
    details: strictChecks[article] ? `${article} meets JUDGE canonical standard` : `${article} does not meet JUDGE-level requirements`,
  };
}

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

    // Get compliance results and questionnaire
    const [compRes, qRes] = await Promise.all([
      supabaseClient.from("compliance_results").select("*").eq("user_id", user.id).maybeSingle(),
      supabaseClient.from("questionnaire_responses").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    if (!compRes.data) throw new Error("No compliance results found. Complete the questionnaire first.");
    if (!qRes.data || !qRes.data.completed) throw new Error("Complete the compliance questionnaire first.");

    // Check subscription for verification limits
    const subRes = await supabaseClient.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
    if (!subRes.data || subRes.data.status !== "active") {
      throw new Error("Active subscription required for verification");
    }

    // Check verification limits (startup = 100, others unlimited)
    if (subRes.data.verifications_limit > 0 && subRes.data.verifications_used >= subRes.data.verifications_limit) {
      throw new Error("Verification limit reached for your plan. Upgrade to continue.");
    }

    const mode = compRes.data.trio_mode || "SHIELD";
    const articles = ["Article 12", "Article 13", "Article 14", "Article 15"];
    const results: any[] = [];

    for (const article of articles) {
      let result;
      switch (mode) {
        case "SWORD":
          result = runSwordVerification(qRes.data, article);
          break;
        case "JUDGE":
          result = runJudgeVerification(qRes.data, article);
          break;
        default:
          result = runShieldVerification(qRes.data, article);
      }

      const merkleHash = result.pass ? generateMerkleHash(`${user.id}-${article}-${mode}-${Date.now()}`) : null;

      // Update verification_history
      await supabaseClient
        .from("verification_history")
        .update({
          status: result.pass ? "verified" : "failed",
          verified_at: result.pass ? new Date().toISOString() : null,
          merkle_proof_hash: merkleHash,
        })
        .eq("user_id", user.id)
        .eq("article_number", article);

      results.push({
        article,
        status: result.pass ? "verified" : "failed",
        details: result.details,
        merkle_hash: merkleHash,
        mode,
      });
    }

    // Increment verifications_used
    await supabaseClient
      .from("subscriptions")
      .update({ verifications_used: (subRes.data.verifications_used || 0) + 1 })
      .eq("id", subRes.data.id);

    // Recalculate overall score based on verification results
    const verified = results.filter(r => r.status === "verified").length;
    const newScore = Math.round((verified / articles.length) * 100);
    let newStatus = "non_compliant";
    if (newScore >= 90) newStatus = "compliant";
    else if (newScore >= 70) newStatus = "mostly_compliant";
    else if (newScore >= 50) newStatus = "partially_compliant";

    await supabaseClient
      .from("compliance_results")
      .update({ overall_score: newScore, status: newStatus, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({
      mode,
      score: newScore,
      status: newStatus,
      articles: results,
      verified_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
