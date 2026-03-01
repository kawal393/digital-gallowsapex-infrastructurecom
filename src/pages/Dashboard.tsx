import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import ComplianceStatus from "@/components/dashboard/ComplianceStatus";
import TrioModeSelector from "@/components/dashboard/TrioModeSelector";
import ComplianceLedger from "@/components/dashboard/ComplianceLedger";
import ReferralCard from "@/components/dashboard/ReferralCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [compliance, setCompliance] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: cr } = await supabase
        .from("compliance_results")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setCompliance(cr);

      const { data: vh } = await supabase
        .from("verification_history")
        .select("*")
        .eq("user_id", user.id)
        .order("article_number");
      setVerifications(vh || []);
    };
    fetchData();
  }, [user]);

  const updateTrioMode = async (mode: string) => {
    if (!compliance) return;
    await supabase
      .from("compliance_results")
      .update({ trio_mode: mode })
      .eq("id", compliance.id);
    setCompliance({ ...compliance, trio_mode: mode });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
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

        {compliance ? (
          <div className="grid gap-4 md:grid-cols-2">
            <ComplianceStatus score={compliance.overall_score} status={compliance.status} />
            <TrioModeSelector mode={compliance.trio_mode} onModeChange={updateTrioMode} />
            <ComplianceLedger verifications={verifications} />
            <ReferralCard referralCode={compliance.referral_code || ""} referralCount={compliance.referral_count} />
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
