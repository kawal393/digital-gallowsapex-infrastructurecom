import { Shield, Swords, Gavel, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const modes = [
  {
    icon: Shield,
    title: "SHIELD",
    role: "Lawyer",
    headline: "Defend the Giants",
    description:
      "Private compliance verification. MPC keeps their weights 100% secret. Your AI stays protected.",
    features: ["Private Merkle Tree Ledger", "Internal Safety Flags", "Private Compliance Reports", "MPC Verification (secret weights)"],
  },
  {
    icon: Swords,
    title: "SWORD",
    role: "Police",
    headline: "Expose the Truth",
    description:
      "Public ledger for regulators. Whistleblower hook sends violations directly to EU AI Office.",
    features: ["Public Audit Trail (Regulator-visible)", "EU Whistleblower Integration", "ZK Proof Verification", "Public Certificate of Trust"],
  },
  {
    icon: Gavel,
    title: "JUDGE",
    role: "Authority",
    headline: "Set the Standards",
    description:
      "Binding legal rulings. Your interpretations become precedent. Courts cite YOUR rulings.",
    features: ["Canonical Standards", "Legal Precedent", "Binding Interpretations", "Court-Recognized Authority"],
  },
];

const TrioSection = () => {
  return (
    <section className="relative py-24 px-4 bg-dark-gradient overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 85% 52% / 0.04) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            The Trio
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-chrome-gradient">Three Modes.</span>{" "}
            <span className="text-gold-gradient">One Platform.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The Police. The Lawyer. The Judge.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-xl border border-border bg-card p-8 hover:border-gold/30 hover:shadow-gold transition-all duration-500"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gold/10 p-3 group-hover:bg-gold/15 transition-colors">
                  <mode.icon className="h-6 w-6 text-gold glow-gold" />
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-widest text-gold uppercase">
                    {mode.role}
                  </span>
                  <h3 className="text-xl font-bold text-chrome-gradient">{mode.title}</h3>
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-2">{mode.headline}</p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {mode.description}
              </p>

              <ul className="space-y-2">
                {mode.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <ArrowRight className="h-3 w-3 text-gold flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrioSection;
