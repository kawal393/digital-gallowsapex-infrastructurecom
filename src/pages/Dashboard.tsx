import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Crown, Shield, RefreshCw, Zap, RotateCcw } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import TrioModeSelector from "@/components/dashboard/TrioModeSelector";
import ComplianceLedger from "@/components/dashboard/ComplianceLedger";
import ReferralCard from "@/components/dashboard/ReferralCard";
import ComplianceQuestionnaire from "@/components/dashboard/ComplianceQuestionnaire";
import ComplianceCertificate from "@/components/dashboard/ComplianceCertificate";
import ScoreBreakdown from "@/components/dashboard/ScoreBreakdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const TIER_LABELS: Record<string, string> = {
  startup: "STARTUP",
  growth: "GROWTH",
  enterprise: "ENTERPRISE",
  goliath: "GOLIATH",
};

function calculateBreakdown(qData: any) {
  if (!qData) return null;
  const breakdown: Record<string, { score: number; max: number; label: string }> = {};
  const hrCount = (qData.high_risk_uses || []).filter((u: string) => u !== "None").length;
  breakdown["Article 5"] = { score: hrCount === 0 ? 20 : hrCount === 1 ? 10 : 0, max: 20, label: "Prohibited Practices" };
  breakdown["Article 6"] = { score: qData.automated_decisions === "no" ? 15 : qData.automated_decisions === "occasionally" ? 10 : 5, max: 15, label: "Classification" };
  breakdown["Article 9"] = { score: qData.governance_policy === "documented" ? 20 : qData.governance_policy === "informal" ? 10 : 0, max: 20, label: "Risk Management" };
  breakdown["Article 13"] = { score: qData.users_informed === "always" ? 15 : qData.users_informed === "sometimes" ? 8 : 0, max: 15, label: "Transparency" };
  breakdown["Article 14"] = { score: qData.right_to_explanation === "fully" ? 15 : qData.right_to_explanation === "partially" ? 8 : 0, max: 15, label: "Human Oversight" };
  breakdown["Article 52"] = { score: qData.ai_content_labeled === "yes" ? 15 : qData.ai_content_labeled === "somewhat" ? 8 : 0, max: 15, label: "Content Labeling" };
  return breakdown;
}

const Dashboard = () => {
  const { user, signOut, subscription, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [compliance, setCompliance] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [qLoaded, setQLoaded] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showRetake, setShowRetake] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Payment successful! Refreshing your subscription...");
      checkSubscription();
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!user) return;
    const [crRes, vhRes, qRes] = await Promise.all([
      supabase.from("compliance_results").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("verification_history").select("*").eq("user_id", user.id).order("article_number"),
      supabase.from("questionnaire_responses").select("*").eq("user_id", user.id).maybeSingle(),
    ]);
    setCompliance(crRes.data);
    setVerifications(vhRes.data || []);
    setQuestionnaire(qRes.data);
    setQLoaded(true);
    setShowRetake(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const updateTrioMode = async (mode: string) => {
    if (!compliance) return;
    await supabase.from("compliance_results").update({ trio_mode: mode }).eq("id", compliance.id);
    setCompliance({ ...compliance, trio_mode: mode });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Failed to open subscription management");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("run-verification");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Verification complete! Score: ${data.score}% (${data.mode} mode)`);
      await fetchData();
    } catch (e: any) {
      toast.error(e.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleRetake = () => {
    setShowRetake(true);
  };

  const showQuestionnaire = qLoaded && (!questionnaire || !questionnaire.completed || showRetake);
  const breakdown = questionnaire?.completed && !showRetake ? calculateBreakdown(questionnaire) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <a href="/" className="flex items-center gap-2">
            <img src={apexLogo} alt="APEX" className="h-7 w-7 glow-gold" />
            <span className="font-bold text-gold-gradient text-sm">APEX</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-bold text-gold-gradient mb-6">Compliance Dashboard</h1>

        {/* Subscription Card */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {subscription.subscribed ? (
                <Crown className="h-6 w-6 text-gold" />
              ) : (
                <Shield className="h-6 w-6 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-bold text-foreground">
                  {subscription.subscribed
                    ? `${TIER_LABELS[subscription.tier || ""] || subscription.tier?.toUpperCase()} Plan`
                    : "No Active Subscription"}
                </p>
                {subscription.subscribed && subscription.subscriptionEnd && (
                  <p className="text-xs text-muted-foreground">
                    Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                  </p>
                )}
                {!subscription.subscribed && (
                  <p className="text-xs text-muted-foreground">
                    Subscribe to unlock compliance verifications
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={checkSubscription}>
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
              {subscription.subscribed ? (
                <Button variant="heroOutline" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
                  {portalLoading ? "Loading..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button variant="hero" size="sm" onClick={() => {
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else navigate("/#pricing");
                }}>
                  View Plans
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Questionnaire or Dashboard */}
        {!qLoaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : showQuestionnaire ? (
          <ComplianceQuestionnaire onComplete={fetchData} existingData={showRetake ? questionnaire : questionnaire} />
        ) : compliance ? (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="hero"
                size="sm"
                onClick={handleRunVerification}
                disabled={verifying || !subscription.subscribed}
              >
                <Zap className="h-4 w-4 mr-1" />
                {verifying ? "Verifying…" : "Run TRIO Verification"}
              </Button>
              <Button variant="heroOutline" size="sm" onClick={handleRetake}>
                <RotateCcw className="h-4 w-4 mr-1" /> Retake Assessment
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ComplianceStatus score={compliance.overall_score} status={compliance.status} />
              <TrioModeSelector mode={compliance.trio_mode} onModeChange={updateTrioMode} />
              {breakdown && <ScoreBreakdown breakdown={breakdown} />}
              <ComplianceCertificate
                companyName={compliance.company_name}
                score={compliance.overall_score}
                status={compliance.status}
                date={compliance.updated_at}
                merkleHash={verifications.find(v => v.merkle_proof_hash)?.merkle_proof_hash}
              />
              <ComplianceLedger verifications={verifications} />
              <ReferralCard referralCode={compliance.referral_code || ""} referralCount={compliance.referral_count} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
