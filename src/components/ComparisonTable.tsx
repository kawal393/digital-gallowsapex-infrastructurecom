import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const rows = [
  {
    approach: "Full ZKML",
    cost: "$1,000+",
    feasibility: "Impossible at Scale",
    feasibilityIcon: "bad",
    acceptance: "High",
    acceptanceIcon: "good",
    highlight: false,
  },
  {
    approach: "Apex PSI",
    cost: "<$0.01",
    feasibility: "Deployable Today",
    feasibilityIcon: "good",
    acceptance: "High",
    acceptanceIcon: "good",
    highlight: true,
  },
  {
    approach: "Documentation Only",
    cost: "$0",
    feasibility: "Low Effort",
    feasibilityIcon: "mid",
    acceptance: "Medium",
    acceptanceIcon: "mid",
    highlight: false,
  },
];

const StatusIcon = ({ type }: { type: string }) => {
  if (type === "good") return <Check className="h-4 w-4 text-compliant inline" />;
  if (type === "bad") return <X className="h-4 w-4 text-destructive inline" />;
  return <Minus className="h-4 w-4 text-warning inline" />;
};

const ComparisonTable = () => (
  <section className="relative py-24 px-4" id="comparison">
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Why PSI Wins</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          The <span className="text-gold-gradient">Numbers Don't Lie</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-x-auto"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Approach</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Cost per Output</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Feasibility</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Regulator Acceptance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.approach}
                className={`border-b border-border ${
                  r.highlight ? "bg-gold/5 border-gold/30" : ""
                }`}
              >
                <td className={`py-4 px-4 font-bold ${r.highlight ? "text-gold" : "text-foreground"}`}>
                  {r.approach}
                </td>
                <td className={`py-4 px-4 font-mono ${r.highlight ? "text-gold font-bold" : "text-foreground"}`}>
                  {r.cost}
                </td>
                <td className="py-4 px-4 text-foreground/80">
                  <StatusIcon type={r.feasibilityIcon} /> <span className="ml-1">{r.feasibility}</span>
                </td>
                <td className="py-4 px-4 text-foreground/80">
                  <StatusIcon type={r.acceptanceIcon} /> <span className="ml-1">{r.acceptance}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export default ComparisonTable;
