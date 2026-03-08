import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Users } from "lucide-react";
import { useState } from "react";

interface Props {
  isPartner: boolean;
}

const PartnerHero = ({ isPartner }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activating, setActivating] = useState(false);

  const activate = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isPartner) {
      navigate("/partner/dashboard");
      return;
    }
    setActivating(true);
    const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
    const { error } = await supabase.from("partners").insert({
      user_id: user.id,
      partner_code: code,
    } as any);
    setActivating(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome, Partner!", description: "Your partnership is now active." });
      navigate("/partner/dashboard");
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 text-center relative">
      <div className="container mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
          <Users className="h-4 w-4" />
          Start earning with APEX
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-gold-gradient">Earn 50% Commission</span>
          <br />
          <span className="text-foreground">on Every Subscription</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Share your unique referral link. When someone signs up and becomes a paying customer,
          you earn <span className="text-primary font-semibold">50% of the revenue</span>. Simple. Transparent. Unlimited.
        </p>
        <Button size="lg" variant="hero" onClick={activate} disabled={activating} className="text-base px-8">
          <Rocket className="h-5 w-5 mr-2" />
          {isPartner ? "Go to Partner Dashboard" : activating ? "Activating…" : "Become a Partner"}
        </Button>
      </div>
    </section>
  );
};

export default PartnerHero;
