import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const tiers = [
  {
    name: "STARTUP",
    key: "startup",
    price: "$499",
    period: "/month",
    features: [
      "100 verifications/month",
      "Basic dashboard",
      "Email support",
      "SHIELD mode only",
      "Standard response time",
    ],
    featured: false,
  },
  {
    name: "GROWTH",
    key: "growth",
    price: "$2,499",
    period: "/month",
    features: [
      "Unlimited verifications",
      "API access",
      "Priority support",
      "SHIELD + SWORD mode",
      "Public audit trail",
    ],
    featured: true,
  },
  {
    name: "ENTERPRISE",
    key: "enterprise",
    price: "$9,999",
    period: "/month",
    features: [
      "Unlimited everything",
      "Dedicated nodes",
      "24/7 SLA support",
      "All 3 modes (SHIELD/SWORD/JUDGE)",
      "Custom integrations",
      "White-label options",
    ],
    featured: false,
  },
  {
    name: "GOLIATH",
    key: "goliath",
    price: "$49,999",
    period: "/month",
    features: [
      "Sovereign infrastructure",
      "Judge mode licensing",
      "Direct API access",
      "White-label",
      "Custom SLA",
      "Dedicated account manager",
    ],
    featured: false,
  },
];

const Pricing = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierKey: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoadingTier(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier: tierKey },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to create checkout session");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <section className="relative py-24 px-4" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Scale Compliance With Your Ambition
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From startups to sovereigns. Choose the tier that matches your scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {tiers.map((tier, i) => {
            const isCurrentPlan = subscription.subscribed && subscription.tier === tier.key;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  isCurrentPlan
                    ? "border-green-500/60 bg-card shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    : tier.featured
                    ? "border-gold/60 bg-card shadow-gold"
                    : "border-border bg-card"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      YOUR PLAN
                    </span>
                  </div>
                )}
                {!isCurrentPlan && tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-gradient text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-sm font-bold tracking-widest text-gold mb-4">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrentPlan ? "outline" : tier.featured ? "hero" : "heroOutline"}
                  className="w-full"
                  disabled={isCurrentPlan || loadingTier === tier.key}
                  onClick={() => handleSubscribe(tier.key)}
                >
                  {loadingTier === tier.key
                    ? "Loading..."
                    : isCurrentPlan
                    ? "Current Plan"
                    : user
                    ? "Subscribe Now"
                    : "Sign In to Subscribe"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
