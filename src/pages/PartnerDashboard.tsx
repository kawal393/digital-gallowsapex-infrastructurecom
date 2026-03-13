import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, LogOut, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import apexLogo from "@/assets/apex-logo.png";
import PartnerEarnings from "@/components/partner/PartnerEarnings";
import PartnerReferralTable from "@/components/partner/PartnerReferralTable";

const PartnerDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partner, setPartner] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [payoutEmail, setPayoutEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase
        .from("partners" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!p) {
        navigate("/partner");
        return;
      }
      setPartner(p);
      setPayoutEmail((p as any).payout_email || "");

      const { data: refs } = await supabase
        .from("partner_referrals" as any)
        .select("*")
        .eq("partner_id", (p as any).id)
        .order("created_at", { ascending: false });
      setReferrals(refs || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const link = partner ? `${window.location.origin}?ref=${(partner as any).partner_code}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied." });
  };

  const savePayout = async () => {
    if (!partner) return;
    await supabase
      .from("partners" as any)
      .update({ payout_email: payoutEmail } as any)
      .eq("id", (partner as any).id);
    toast({ title: "Saved", description: "Payout email updated." });
  };

  const conversions = referrals.filter((r) => r.status === "converted" || r.status === "paid").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <a href="/" className="flex items-center gap-2">
            <img src={apexLogo} alt="APEX" className="h-7 w-7 glow-gold" />
            <span className="font-bold text-gold-gradient text-sm">APEX</span>
            <span className="text-xs text-muted-foreground ml-1">Partner</span>
          </a>
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="text-xl font-bold text-gold-gradient">Partner Dashboard</h1>

        <PartnerEarnings
          totalEarnings={(partner as any).total_earnings}
          totalReferrals={(partner as any).total_referrals}
          conversions={conversions}
        />

        {/* Referral Link */}
        <div className="rounded-xl border border-border bg-card/60 p-5 space-y-3">
          <h3 className="text-sm font-semibold">Your Referral Link</h3>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-secondary rounded px-3 py-2 text-foreground/80 truncate font-mono">
              {link}
            </code>
            <Button variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Referral Activity */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Referral Activity</h3>
          <PartnerReferralTable referrals={referrals} />
        </div>

        {/* Payout Settings */}
        <div className="rounded-xl border border-border bg-card/60 p-5 space-y-3">
          <h3 className="text-sm font-semibold">Payout Settings</h3>
          <div className="flex items-center gap-2 max-w-md">
            <Input
              placeholder="your@paypal.com"
              value={payoutEmail}
              onChange={(e) => setPayoutEmail(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={savePayout}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Enter the email where you'd like to receive payouts.</p>
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
