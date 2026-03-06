import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ShieldCheck, TrendingDown } from "lucide-react";

const steps = [
  {
    icon: CheckCircle2,
    step: "01",
    title: "Innocent Until Proven Guilty",
    desc: "All AI outputs are registered in our immutable ledger by default. No expensive proofs generated. Your AI operates at full speed with zero overhead.",
  },
  {
    icon: AlertCircle,
    step: "02",
    title: "Regulator Challenge (Fraud Proof)",
    desc: "When a regulator challenges a specific output, we trigger a targeted Fraud Proof. This happens for less than 0.1% of outputs — the vast majority are never questioned.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Targeted ZK Proof Generation",
    desc: "We generate a Zero-Knowledge proof only for that specific challenged output. The regulator gets mathematical certainty. Your model weights remain completely private.",
  },
  {
    icon: TrendingDown,
    step: "04",
    title: "99.9% Cost Reduction",
    desc: "Instead of $1,000+ per output, you pay less than $0.01. Compliance becomes economically viable for every AI company, from startup to sovereign.",
  },
];

const OptimisticModel = () => (
  <section className="relative py-24 px-4" id="how-it-works">
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">The Optimistic Model</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          How <span className="text-gold-gradient">PSI</span> Actually Works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Inspired by optimistic rollups in blockchain. Assume compliance, prove only when challenged.
        </p>
      </motion.div>

      <div className="space-y-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="flex gap-6 rounded-xl border border-border bg-card/60 p-6 hover:border-gold/30 transition-colors"
          >
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-xs font-bold text-gold mb-2">STEP</span>
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <s.icon className="h-7 w-7 text-gold" />
              </div>
              <span className="text-2xl font-black text-gold/30 mt-2">{s.step}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OptimisticModel;
