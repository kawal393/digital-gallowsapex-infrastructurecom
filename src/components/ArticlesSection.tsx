import { FileText, Search, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    icon: FileText,
    article: "Article 12",
    title: "Record-Keeping",
    tech: "Merkle Ledger",
    description: "Immutable audit trail for every AI decision logged via cryptographic Merkle trees.",
  },
  {
    icon: Search,
    article: "Article 13",
    title: "Transparency",
    tech: "ZK Proofs",
    description: "Zero-knowledge proofs demonstrate compliance without revealing proprietary model details.",
  },
  {
    icon: Users,
    article: "Article 14",
    title: "Human Oversight",
    tech: "Sovereign Pause",
    description: "Hardware-level kill switch ensures humans can always intervene in AI operations.",
  },
  {
    icon: Target,
    article: "Article 15",
    title: "Accuracy & Robustness",
    tech: "MPC Testing",
    description: "Multi-party computation validates model accuracy without exposing training data.",
  },
];

const ArticlesSection = () => {
  return (
    <section className="relative py-24 px-4 bg-dark-gradient">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Compliance
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            EU AI Act Coverage
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Full coverage of the four key articles for high-risk AI systems.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {articles.map((a, i) => (
            <motion.div
              key={a.article}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 rounded-xl border border-border bg-card p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex-shrink-0 rounded-lg bg-gold/10 p-3 h-fit">
                <a.icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gold tracking-widest">{a.article}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{a.tech}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
