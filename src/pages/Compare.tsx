import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Minus, Shield, ArrowRight, Zap, Globe, Lock, Network, FileCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    category: "Cryptographic Infrastructure",
    items: [
      { name: "SHA-256 Commit Hashing", apex: true, veritaschain: true, ethicshield: true },
      { name: "Live Merkle Tree Visualization", apex: true, veritaschain: false, ethicshield: false },
      { name: "Bitcoin-Anchored Audit Trails (OpenTimestamps)", apex: true, veritaschain: true, ethicshield: false },
      { name: "Groth16-Compatible ZK Privacy Proofs (BN128)", apex: true, veritaschain: false, ethicshield: false },
      { name: "Real-time Merkle Inclusion Proofs", apex: true, veritaschain: true, ethicshield: false },
    ],
  },
  {
    category: "Verification Architecture",
    items: [
      { name: "3-Node MPC Consensus (2-of-3 Threshold)", apex: true, veritaschain: false, ethicshield: false },
      { name: "Server-Side Hash Recomputation", apex: true, veritaschain: true, ethicshield: false },
      { name: "Sovereign Pause — Protocol Intervention Layer (Art. 14)", apex: true, veritaschain: false, ethicshield: "partial" as const },
      { name: "Visual 4-Stage Pipeline", apex: true, veritaschain: false, ethicshield: false },
      { name: "QR Code Verification Certificates", apex: true, veritaschain: true, ethicshield: false },
    ],
  },
  {
    category: "Regulatory Coverage",
    items: [
      { name: "EU AI Act (10 Articles)", apex: true, veritaschain: true, ethicshield: true },
      { name: "MiFID II Financial Trading", apex: true, veritaschain: false, ethicshield: false },
      { name: "DORA Operational Resilience", apex: true, veritaschain: false, ethicshield: false },
      { name: "Multi-Regulatory Predicate Engine", apex: true, veritaschain: "partial" as const, ethicshield: false },
      { name: "Formal Regulatory Submissions", apex: false, veritaschain: true, ethicshield: "partial" as const },
    ],
  },
  {
    category: "Developer Experience",
    items: [
      { name: "Runtime Inference Blocking SDK", apex: true, veritaschain: false, ethicshield: false },
      { name: "Express/Node.js Middleware", apex: true, veritaschain: false, ethicshield: false },
      { name: "Sub-15ms Local Pattern Cache", apex: true, veritaschain: false, ethicshield: false },
      { name: "REST API with Full Documentation", apex: true, veritaschain: true, ethicshield: true },
      { name: "Open Technical Architecture Docs", apex: true, veritaschain: false, ethicshield: false },
    ],
  },
];

const CellIcon = ({ value }: { value: boolean | "partial" }) => {
  if (value === true) return <Check className="h-5 w-5 text-gallows-approved" />;
  if (value === "partial") return <Minus className="h-5 w-5 text-amber-400" />;
  return <X className="h-5 w-5 text-muted-foreground/30" />;
};

const pillars = [
  { icon: Lock, title: "ZK Privacy Proofs", desc: "Groth16-compatible commitments on BN128 curve. Prove compliance without revealing proprietary AI logic." },
  { icon: Network, title: "MPC Consensus", desc: "3 independent nodes verify every action. 2-of-3 threshold prevents single point of failure." },
  { icon: Zap, title: "Runtime SDK", desc: "Block non-compliant AI responses in <15ms. Express middleware drops in with one line." },
  { icon: Globe, title: "Bitcoin Anchoring", desc: "Every Merkle root timestamped via OpenTimestamps. Immutable external proof of existence." },
  { icon: Shield, title: "Multi-Regulatory", desc: "EU AI Act + MiFID II + DORA. 20+ predicates across 3 regulatory frameworks." },
  { icon: FileCode, title: "Open Architecture", desc: "Full technical documentation. Every hash, proof, and certificate independently verifiable." },
];

const Compare = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-black text-xl tracking-tight bg-transparent border-none cursor-pointer">
            <span className="text-gold-gradient">APEX</span>
          </button>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/gallows")} className="font-mono text-xs">
              Live Demo
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/architecture")} className="font-mono text-xs">
              Architecture
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/sdk")} className="font-mono text-xs">
              SDK Docs
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
            COMPETITIVE ANALYSIS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-gold-gradient">World's First</span>{" "}
            <span className="text-foreground">Live Visual</span>
            <br />
            <span className="text-foreground">Compliance Engine</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The only platform combining Groth16-compatible ZK privacy proofs, MPC distributed verification,
            and Bitcoin-anchored audit trails with a live visual pipeline.
          </p>
        </motion.section>

        {/* Pillar Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors h-full">
                <CardContent className="pt-6 space-y-3">
                  <p.icon className="h-8 w-8 text-primary" />
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Feature Matrix */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Feature Comparison Matrix</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-mono text-muted-foreground w-[40%]">FEATURE</th>
                  <th className="text-center py-4 px-4 w-[20%]">
                    <span className="text-gold-gradient font-black text-lg">APEX</span>
                    <Badge className="ml-2 bg-primary/10 text-primary border-0 text-[10px]">YOU ARE HERE</Badge>
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-mono text-muted-foreground w-[20%]">VeritasChain</th>
                  <th className="text-center py-4 px-4 text-sm font-mono text-muted-foreground w-[20%]">EthicShield</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category) => (
                  <>
                    <tr key={category.category}>
                      <td colSpan={4} className="pt-6 pb-2 px-4">
                        <span className="text-xs font-mono text-primary tracking-widest uppercase">
                          {category.category}
                        </span>
                      </td>
                    </tr>
                    {category.items.map((item) => (
                      <tr key={item.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-sm">{item.name}</td>
                        <td className="py-3 px-4 text-center"><CellIcon value={item.apex} /></td>
                        <td className="py-3 px-4 text-center"><CellIcon value={item.veritaschain} /></td>
                        <td className="py-3 px-4 text-center"><CellIcon value={item.ethicshield} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* CTA */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-3xl font-black">
            <span className="text-gold-gradient">Ready to verify?</span>
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button onClick={() => navigate("/gallows")} className="bg-primary text-primary-foreground font-mono gap-2">
              Try APEX PSI <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/sdk")} className="font-mono gap-2">
              <FileCode className="h-4 w-4" /> SDK Documentation
            </Button>
            <Button variant="outline" onClick={() => navigate("/#contact")} className="font-mono gap-2">
              Request Consultation
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compare;
