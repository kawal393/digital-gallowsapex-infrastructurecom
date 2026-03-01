import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "STARTUP",
    price: "$499",
    period: "/month",
    features: [
      "100 verifications/month",
      "Basic dashboard",
      "Email support",
      "SHIELD mode only",
      "Standard response time",
    ],
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/fZudR15c5bH2fUIdAEb7y05",
    featured: false,
  },
  {
    name: "GROWTH",
    price: "$2,499",
    period: "/month",
    features: [
      "Unlimited verifications",
      "API access",
      "Priority support",
      "SHIELD + SWORD mode",
      "Public audit trail",
    ],
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/dRm14feMF6mI5g4aosb7y06",
    featured: true,
  },
  {
    name: "ENTERPRISE",
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
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/3cI3cndIBbH223Saosb7y07",
    featured: false,
  },
  {
    name: "GOLIATH",
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
    cta: "Subscribe Now",
    link: "https://buy.stripe.com/4gM6oz6g99yU9wkcwAb7y08",
    featured: false,
  },
];

const Pricing = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.featured
                  ? "border-gold/60 bg-card shadow-gold"
                  : "border-border bg-card"
              }`}
            >
              {tier.featured && (
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
                variant={tier.featured ? "hero" : "heroOutline"}
                className="w-full"
                asChild
              >
                <a href={tier.link} target="_blank" rel="noopener noreferrer">{tier.cta}</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
