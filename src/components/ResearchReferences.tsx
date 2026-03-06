import { motion } from "framer-motion";
import { ExternalLink, FileText, BookOpen, Landmark } from "lucide-react";

const references = [
  {
    icon: Landmark,
    category: "REGULATION",
    title: "EU AI Act (Regulation 2024/1689)",
    source: "Official Journal of the European Union",
    desc: "The world's first comprehensive AI regulation. Full enforcement for high-risk systems: August 2, 2026.",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    icon: FileText,
    category: "RESEARCH",
    title: "opML: Optimistic Machine Learning on Blockchain",
    source: "arXiv:2401.17555 — Conway, So, Yu, Wong (2024)",
    desc: "The foundational paper on optimistic verification for ML. Proves fraud-proof patterns work for ML inference. PSI extends this to regulatory compliance.",
    url: "https://arxiv.org/abs/2401.17555",
  },
  {
    icon: BookOpen,
    category: "ANALYSIS",
    title: "AI Act Technical Documentation: Article 11 & Annex IV Guide",
    source: "AiActo (Feb 2026)",
    desc: "Comprehensive guide to the 9 mandatory sections of technical documentation required for high-risk AI systems.",
    url: "https://www.aiacto.eu/en/blog/documentation-technique-ai-act-article-11-annexe-iv",
  },
  {
    icon: BookOpen,
    category: "MARKET",
    title: "EU AI Act Compliance: €17 Billion Opportunity",
    source: "Medium / Prieditis (Nov 2025)",
    desc: "Analysis of the compliance market created by the EU AI Act's requirements for high-risk AI systems across 27 member states.",
    url: "https://medium.com/@arturs.prieditis/the-eu-ai-acts-hidden-market-how-high-risk-ai-compliance-became-a-17-billion-opportunity-734cea9b41e2",
  },
  {
    icon: FileText,
    category: "RESEARCH",
    title: "zkAgent: Verifiable Agent Execution via ZK Proof",
    source: "ePrint 2026/199",
    desc: "Latest research on verifiable AI agent execution using zero-knowledge proofs. Validates the technical feasibility of ZK approaches for AI compliance.",
    url: "https://eprint.iacr.org/2026/199",
  },
  {
    icon: BookOpen,
    category: "ANALYSIS",
    title: "Hidden Costs of AI Act Compliance",
    source: "EU AI Risk (2025)",
    desc: "Breakdown of the true financial landscape of AI Act compliance — the cost problem PSI solves.",
    url: "https://euairisk.com/resources/hidden-costs-ai-act-compliance-cfo-guide",
  },
];

const ResearchReferences = () => (
  <section className="relative py-24 px-4" id="research">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
          Research & References
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Built on <span className="text-gold-gradient">Verified Research</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Every claim we make is grounded in published regulation, peer-reviewed research, and market analysis.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {references.map((r, i) => (
          <motion.a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group rounded-xl border border-border bg-card/60 p-5 hover:border-gold/30 transition-all hover:bg-card/80 block"
          >
            <div className="flex items-center gap-2 mb-3">
              <r.icon className="h-4 w-4 text-gold" />
              <span className="text-[10px] font-black tracking-widest text-gold/70 uppercase">{r.category}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/30 ml-auto group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1 leading-tight">{r.title}</h3>
            <p className="text-[11px] text-gold/60 font-medium mb-2">{r.source}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ResearchReferences;
