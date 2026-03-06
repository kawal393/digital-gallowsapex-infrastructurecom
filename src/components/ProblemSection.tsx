import { motion } from "framer-motion";
import { AlertTriangle, Eye, Lock, DollarSign } from "lucide-react";

const problems = [
  {
    icon: Eye,
    title: "Regulators Demand Transparency",
    desc: "The EU AI Act requires full auditability of AI decision-making. Articles 11–15 demand technical documentation, logging, and human oversight.",
  },
  {
    icon: Lock,
    title: "AI Companies Demand Privacy",
    desc: "Model weights are the crown jewels. Disclosing them destroys competitive advantage and invites IP theft. No company will comply voluntarily.",
  },
  {
    icon: DollarSign,
    title: "Traditional ZKML Costs $1,000+ Per Output",
    desc: "Zero-Knowledge Machine Learning can prove compliance without disclosure — but generating a ZK proof for every AI output is economically impossible at scale.",
  },
  {
    icon: AlertTriangle,
    title: "The Compliance Paradox",
    desc: "Prove you're compliant without revealing how your AI works. Current solutions are either too expensive, too slow, or too invasive. This is the trap.",
  },
];

const ProblemSection = () => (
  <section className="relative py-24 px-4" id="problem">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">The Problem</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          The <span className="text-gold-gradient">Compliance Paradox</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI companies are trapped between regulatory demands and commercial survival. Every existing path leads to a dead end.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card/60 p-6 hover:border-destructive/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
              <p.icon className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
