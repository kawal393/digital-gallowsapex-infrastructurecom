import { motion } from "framer-motion";
import { Handshake, Users, TrendingUp, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: Shield,
    title: "Infrastructure Partner",
    subtitle: "Aligned Incentives",
    desc: "We deploy our full PSI compliance stack into your AI company. We don't sell software licences — we become your compliance infrastructure partner with skin in the game.",
    details: [
      "Full PSI deployment and integration",
      "Ongoing compliance monitoring",
      "Regulatory updates and adaptation",
      "Terms discussed under NDA",
    ],
    cta: "Discuss Partnership",
    ctaHref: "#contact",
    variant: "hero" as const,
  },
  {
    icon: Users,
    title: "Revenue Partner Program",
    subtitle: "Industry-Leading Commission",
    desc: "Introduce AI companies trapped by the compliance paradox to our solution. Earn recurring revenue from every company you bring in.",
    details: [
      "No technical work required",
      "Recurring commission structure",
      "Full marketing and sales support",
      "Apply to learn terms",
    ],
    cta: "Apply as Revenue Partner",
    ctaHref: "/partner",
    variant: "heroOutline" as const,
    isRoute: true,
  },
];

const BusinessModel = () => (
  <section className="relative py-24 px-4" id="business-model">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Partnership</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          We Are the <span className="text-gold-gradient">Partner</span>, Not the Vendor
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We deploy sovereign compliance infrastructure and share in the value we create. All partnership terms are discussed privately.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card/60 p-8 hover:border-gold/30 transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
              <p.icon className="h-7 w-7 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">{p.title}</h3>
            <p className="text-2xl font-black text-gold-gradient mb-4">{p.subtitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>
            <ul className="space-y-2 mb-6">
              {p.details.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-gold mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
            <Button variant={p.variant} asChild>
              {p.isRoute ? (
                <Link to={p.ctaHref}>{p.cta}</Link>
              ) : (
                <a href={p.ctaHref}>{p.cta}</a>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 grid grid-cols-3 gap-4 text-center"
      >
        {[
          { value: "€17B+", label: "Projected Market (2030)" },
          { value: "Aug 2026", label: "Enforcement Deadline" },
          { value: "27 EU States", label: "Mandatory Jurisdiction" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card/40 p-4">
            <p className="text-xl md:text-2xl font-black text-gold-gradient">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BusinessModel;
