import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const tiers = [
  {
    name: "SOVEREIGN ENTRY",
    key: "free",
    price: "$0",
    period: "forever",
    description: "Full PSI Protocol. Zero cost. No tricks.",
    features: [
      { text: "Full compliance assessment", included: true },
      { text: "Compliance score + status", included: true },
      { text: "Embeddable trust badge (SHIELD)", included: true },
      { text: "Public hash verification", included: true },
      { text: "3 TRIO verifications/month", included: true },
      { text: "1 certificate/month", included: true },
      { text: "Community support", included: true },
      { text: "SWORD + JUDGE modes", included: false },
      { text: "Regulator-ready audit export", included: false },
      { text: "Continuous automated monitoring", included: false },
    ],
    featured: false,
    isFree: true,
  },
  {
    name: "STARTUP",
    key: "startup",
    price: "$499",
    period: "/month",
    description: "Prove compliance. Sleep at night.",
    features: [
      { text: "Everything in Free", included: true },
      { text: "100 verifications/month", included: true },
      { text: "SHIELD mode (full)", included: true },
      { text: "Regulator-ready certificates", included: true },
      { text: "Merkle audit trail export", included: true },
      { text: "Email support (24h SLA)", included: true },
      { text: "SDK access (basic)", included: true },
      { text: "SWORD + JUDGE modes", included: false },
      { text: "Continuous monitoring", included: false },
    ],
    featured: false,
    isFree: false,
  },
  {
    name: "GROWTH",
    key: "growth",
    price: "$2,499",
    period: "/month",
    description: "Full compliance arsenal.",
    features: [
      { text: "Everything in Startup", included: true },
      { text: "Unlimited verifications", included: true },
      { text: "SHIELD + SWORD modes", included: true },
      { text: "Public audit trail", included: true },
      { text: "API access + webhooks", included: true },
      { text: "Priority support (4h SLA)", included: true },
      { text: "SDK (full ZK + runtime)", included: true },
      { text: "Continuous monitoring", included: true },
      { text: "JUDGE mode", included: false },
    ],
    featured: true,
    isFree: false,
  },
  {
    name: "ENTERPRISE",
    key: "enterprise",
    price: "$9,999",
    period: "/month",
    description: "The complete compliance fortress.",
    features: [
      { text: "Everything in Growth", included: true },
      { text: "All 3 modes (SHIELD/SWORD/JUDGE)", included: true },
      { text: "Dedicated MPC nodes", included: true },
      { text: "24/7 SLA support", included: true },
      { text: "Custom integrations", included: true },
      { text: "White-label options", included: true },
      { text: "Dedicated compliance advisor", included: true },
      { text: "Automated continuous monitoring", included: true },
    ],
    featured: false,
    isFree: false,
  },
  {
    name: "GOLIATH",
    key: "goliath",
    price: "Custom",
    period: "",
    description: "Sovereign infrastructure. Your rules.",
    features: [
      { text: "Everything in Enterprise", included: true },
      { text: "Sovereign infrastructure", included: true },
      { text: "Judge mode licensing", included: true },
      { text: "White-label platform", included: true },
      { text: "Custom SLA + legal guarantee", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "On-premise deployment option", included: true },
    ],
    featured: false,
    isFree: false,
  },
];

const Pricing = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierKey: string) => {
    if (tierKey === "free") {
      navigate("/auth");
      return;
    }
    if (tierKey === "goliath") {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
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
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Failed to create checkout session");
    } finally {
      setLoadingTier(null);
    }
  };

  const currentTier = subscription.subscribed ? subscription.tier : "free";

  return (
    <section className="relative py-24 px-4" id="pricing">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Free Until You Need Proof
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Know your risk for free. Pay when you need regulator-ready evidence. The free tier is real — no credit card, no trial, no tricks.
          </p>
        </motion.div>

        {/* Enforcement urgency banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-sm text-foreground">
            <Zap className="h-4 w-4 text-warning inline mr-1 -mt-0.5" />
            <span className="font-bold text-warning">EU AI Act enforcement: August 2, 2026.</span>
            {" "}Non-compliance fines up to <span className="font-bold">€35M or 7% of global revenue</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {tiers.map((tier, i) => {
            const isCurrentPlan = currentTier === tier.key;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl border p-5 flex flex-col ${
                  isCurrentPlan
                    ? "border-compliant/60 bg-card shadow-[0_0_20px_rgba(34,197,94,0.12)]"
                    : tier.featured
                    ? "border-gold/60 bg-card shadow-gold"
                    : tier.isFree
                    ? "border-gold/30 bg-card"
                    : "border-border bg-card"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-compliant text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      YOUR PLAN
                    </span>
                  </div>
                )}
                {!isCurrentPlan && tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-gradient text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                {!isCurrentPlan && tier.isFree && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="border border-gold/50 bg-card text-gold text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> FREE FOREVER
                    </span>
                  </div>
                )}

                <h3 className="text-xs font-bold tracking-widest text-gold mb-2 mt-1">{tier.name}</h3>
                <div className="mb-1">
                  <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground text-xs">{tier.period}</span>}
                </div>
                <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? "text-foreground/80" : "text-muted-foreground/40"}`}>
                      {f.included ? (
                        <Check className="h-3.5 w-3.5 text-gold flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrentPlan ? "outline" : tier.featured ? "hero" : tier.isFree ? "hero" : "heroOutline"}
                  className="w-full"
                  size="sm"
                  disabled={isCurrentPlan || loadingTier === tier.key}
                  onClick={() => handleSubscribe(tier.key)}
                >
                  {loadingTier === tier.key
                    ? "Loading..."
                    : isCurrentPlan
                    ? "Current Plan"
                    : tier.isFree
                    ? user ? "Current Plan" : "Get Started Free"
                    : tier.key === "goliath"
                    ? "Contact Sales"
                    : user
                    ? "Upgrade Now"
                    : "Sign In to Subscribe"}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          All paid plans include a 14-day money-back guarantee. Cancel anytime from your dashboard. Prices in USD.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
