import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Fingerprint, TrendingDown } from "lucide-react";

const steps = [
  {
    icon: ShieldCheck,
    step: "01",
    title: "Optimistic Registration",
    label: "DEFAULT STATE",
    desc: "All AI outputs registered in our immutable SHA-256 hash chain ledger. Outputs are assumed compliant by default — \"innocent until proven guilty.\" Inspired by optimistic rollups (Optimism, Arbitrum).",
  },
  {
    icon: AlertTriangle,
    step: "02",
    title: "Regulatory Challenge",
    label: "CHALLENGE WINDOW",
    desc: "A regulator, auditor, or affected party challenges a specific output. This triggers a formal challenge window — just like a fraud proof challenge period in blockchain.",
  },
  {
    icon: Fingerprint,
    step: "03",
    title: "Targeted ZK Fraud Proof",
    label: "PROOF GENERATION",
    desc: "Only for the challenged output, we generate a targeted Zero-Knowledge proof. This proves the output was produced by a compliant model — without revealing model weights or proprietary architecture.",
  },
  {
    icon: TrendingDown,
    step: "04",
    title: "99.9% Cost Reduction",
    label: "RESULT",
    desc: "Since less than 0.1% of outputs are ever challenged, you only pay for proofs when needed. Cost drops from $1,000+ per output (full ZKML) to <$0.01 average — making compliance economically viable for the first time.",
  },
];

const OptimisticModel = () => (
  <section className="relative py-24 px-4 bg-dark-gradient" id="how-it-works">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">The Optimistic Model</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          How <span className="text-gold-gradient">PSI</span> Works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Borrowed from blockchain's optimistic rollup pattern and applied to regulatory compliance for the first time.
          <span className="text-foreground font-medium"> No one else has done this.</span>
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden sm:block" />

        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-5 sm:gap-8"
            >
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <s.icon className="h-6 w-6 md:h-7 md:w-7 text-gold" />
                </div>
              </div>
              <div className="flex-1 rounded-xl border border-border bg-card/60 p-5 md:p-6 hover:border-gold/20 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-gold tracking-widest">STEP {s.step}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {s.label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-xl border border-gold/20 bg-gold/5 p-6 text-center"
      >
        <p className="text-sm text-foreground font-semibold mb-1">The Key Insight</p>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          opML (ORA, arXiv:2401.17555, 2024) proved optimistic verification works for on-chain ML inference.
          <span className="text-gold font-semibold"> We are the first to apply this pattern to regulatory compliance</span> —
          specifically the EU AI Act's Articles 11–15 requirements for high-risk AI systems.
        </p>
      </motion.div>
    </div>
  </section>
);

export default OptimisticModel;
