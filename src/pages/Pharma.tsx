import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, AlertTriangle, ArrowRight, CheckCircle2, FileCheck,
  Clock, Lock, Beaker, Scale, Hash, Key, Zap, ChevronDown,
  DollarSign, TrendingUp, Target, Pill, FlaskConical, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PharmaVerifier from "@/components/verify/PharmaVerifier";

const PATENT_CLIFF_DATE = new Date("2026-09-01T00:00:00Z").getTime();

const marketOpportunity = [
  {
    value: "$250B+",
    label: "Semaglutide Patent Cliff",
    desc: "Total addressable market as GLP-1 patents expire globally",
  },
  {
    value: "72hrs",
    label: "First-to-File Advantage",
    desc: "Average delay between patent expiry and generic market entry",
  },
  {
    value: "14",
    label: "Generic Firms Waiting",
    desc: "Known ANDA/biosimilar applications pending for Semaglutide alone",
  },
  {
    value: "$0.01",
    label: "Per Notarization",
    desc: "Cost to cryptographically prove bioequivalence compliance",
  },
];

const rulingContext = [
  {
    icon: Scale,
    title: "Otsuka v Sun Pharma (2026)",
    desc: "Federal Court stripped patent extensions from formulation-only drugs. High Court granted leave to appeal March 12, 2026 — creating maximum regulatory uncertainty.",
    severity: "LANDMARK",
  },
  {
    icon: AlertTriangle,
    title: "Regulatory Uncertainty = Opportunity",
    desc: "Whether the appeal succeeds or fails, generic firms need cryptographic proof that their biosimilar compliance is mathematically valid — not just legally argued.",
    severity: "CRITICAL",
  },
  {
    icon: Clock,
    title: "First-Mover Window: 6 Months",
    desc: "The appeal decision is expected Q3 2026. Firms that have APEX-notarized compliance trails will file within hours of the ruling. Those without will wait months.",
    severity: "URGENT",
  },
  {
    icon: Lock,
    title: "Zero Formulation Exposure",
    desc: "APEX notarizes the PROOF of bioequivalence — not the formulation itself. Your trade secrets never leave your lab. Only SHA-256 hashes enter the public ledger.",
    severity: "HIGH",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: FlaskConical,
    title: "Submit Bioequivalence Data",
    desc: "Your lab runs dissolution, PK, and stability tests. Results stay on your servers. You send us a JSON payload describing the compliance claim — not the data itself.",
  },
  {
    step: "02",
    icon: Hash,
    title: "Cryptographic Notarization",
    desc: "APEX hashes your claim (SHA-256), signs it (Ed25519), and anchors it to a 255-leaf cumulative Merkle tree. You receive a tamper-proof receipt in <200ms.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Generate Compliance Certificate",
    desc: "A PDF certificate with QR code is generated. Any regulator (TGA, FDA, EMA) can independently verify the receipt against our public Merkle root.",
  },
  {
    step: "04",
    icon: Target,
    title: "File Immediately on Patent Expiry",
    desc: "When the patent falls, your compliance trail is already mathematically proven. File your ANDA/biosimilar application with APEX receipts as supporting evidence.",
  },
];

const competitorComparison = [
  { feature: "Bioequivalence proof without data exposure", apex: true, traditional: false },
  { feature: "Cryptographic tamper-proof audit trail", apex: true, traditional: false },
  { feature: "Sub-200ms notarization latency", apex: true, traditional: false },
  { feature: "IETF-standardized protocol (draft-singh-psi)", apex: true, traditional: false },
  { feature: "Patent-protected infrastructure (AMCZ-2615560564)", apex: true, traditional: false },
  { feature: "Regulator-verifiable QR receipts", apex: true, traditional: false },
  { feature: "Zero formulation data leaves your system", apex: true, traditional: false },
  { feature: "Works regardless of Otsuka appeal outcome", apex: true, traditional: false },
];

const pricingTiers = [
  {
    name: "Generic Starter",
    price: "Free",
    period: "",
    desc: "For firms evaluating the platform",
    features: [
      "100 notarizations/day",
      "SHA-256 + Ed25519 signing",
      "Merkle tree anchoring",
      "Basic PDF receipts",
      "Community support",
    ],
    cta: "Start Free",
    href: "/notary",
    highlight: false,
  },
  {
    name: "Biosimilar Pro",
    price: "$999",
    period: "/month",
    desc: "For active ANDA/biosimilar applicants",
    features: [
      "50,000 notarizations/day",
      "Batch API (100 per call)",
      "Priority PDF generation",
      "Webhook integrations",
      "Dedicated API keys",
      "Bioequivalence predicate templates",
      "Email + priority support",
    ],
    cta: "Get Started",
    href: "/auth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Equity Deal",
    period: "",
    desc: "For firms seeking market entry speed",
    features: [
      "Unlimited notarizations",
      "Custom predicate rules",
      "On-premise deployment",
      "Tribunal governance access",
      "Dedicated account team",
      "SLA guarantee",
      "Revenue-share model available",
    ],
    cta: "Book a Demo",
    href: "/#contact",
    highlight: false,
  },
];

const Pharma = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, PATENT_CLIFF_DATE - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Pharma Sniper — Biosimilar Compliance Notarization for Generic Manufacturers | APEX</title>
        <meta
          name="description"
          content="Generic drug manufacturers: cryptographically prove biosimilar compliance before patent expiry. APEX notarizes bioequivalence data without exposing trade secrets. $250B Semaglutide opportunity."
        />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 20%, hsl(142 76% 36% / 0.08), transparent 70%)",
          }}
        />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            <Badge className="bg-[hsl(var(--compliant))]/10 text-[hsl(var(--compliant))] border-[hsl(var(--compliant))]/30 text-xs tracking-widest uppercase">
              <Pill className="h-3 w-3 mr-1.5" />
              Pharma Sniper — Patent Cliff Intelligence
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
              <span className="text-foreground">Prove Biosimilar Compliance.</span>
              <br />
              <span className="text-gold-gradient">File First. Win the Market.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The $250B Semaglutide patent cliff is approaching. Generic firms that can{" "}
              <span className="text-foreground font-semibold">mathematically prove</span> bioequivalence compliance
              will file within hours of patent expiry.{" "}
              <span className="text-[hsl(var(--compliant))] font-semibold">APEX notarizes the proof — not the formula.</span>
            </p>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-1 pt-4">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mr-3">Patent Cliff Window:</span>
              {[
                { v: days, l: "Days" },
                { v: hours, l: "Hrs" },
                { v: minutes, l: "Min" },
                { v: seconds, l: "Sec" },
              ].map((u) => (
                <div key={u.l} className="flex flex-col items-center mx-1">
                  <span className="text-2xl md:text-3xl font-mono font-black text-[hsl(var(--compliant))] tabular-nums">
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{u.l}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/notary">
                  Notarize Bioequivalence Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#ruling">
                  <Scale className="mr-2 h-4 w-4" />
                  Otsuka v Sun Pharma Context
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {marketOpportunity.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <p className="text-3xl md:text-4xl font-black text-gold-gradient">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ruling Context */}
      <section id="ruling" className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs tracking-widest uppercase">Legal Context</Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              The Ruling That Changed{" "}
              <span className="text-gold-gradient">Everything</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Otsuka v Sun Pharma decision created a $250B+ market opportunity.
              Whether the High Court appeal succeeds or fails, generic firms need cryptographic proof — not legal arguments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rulingContext.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 h-full hover:border-[hsl(var(--compliant))]/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <card.icon className="h-5 w-5 text-[hsl(var(--compliant))]" />
                      <Badge
                        className={`text-[10px] ${
                          card.severity === "LANDMARK"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : card.severity === "CRITICAL"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30"
                        }`}
                      >
                        {card.severity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs tracking-widest uppercase">Technical Process</Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              From Lab to Market Entry in{" "}
              <span className="text-gold-gradient">Four Steps</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your formulation stays in your lab. Only the cryptographic proof of compliance enters the public ledger.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 h-full relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="absolute top-3 right-3 text-5xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                    {step.step}
                  </div>
                  <CardHeader className="pb-3">
                    <step.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs tracking-widest uppercase">Live Demo</Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              Try It Now —{" "}
              <span className="text-gold-gradient">Notarize a Biosimilar Claim</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Paste bioequivalence compliance data below. The hash is computed locally — your formulation never leaves your browser.
            </p>
          </div>
          <PharmaVerifier />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs tracking-widest uppercase">Competitive Edge</Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              APEX vs{" "}
              <span className="text-muted-foreground">Traditional Compliance</span>
            </h2>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-card">
                  <th className="text-left text-sm font-semibold p-4 text-foreground">Capability</th>
                  <th className="text-center text-sm font-semibold p-4 text-primary">APEX Notary</th>
                  <th className="text-center text-sm font-semibold p-4 text-muted-foreground">Traditional CRO</th>
                </tr>
              </thead>
              <tbody>
                {competitorComparison.map((row, i) => (
                  <tr key={i} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">{row.feature}</td>
                    <td className="p-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-[hsl(var(--compliant))] mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      {row.traditional ? (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--compliant))] mx-auto" />
                      ) : (
                        <span className="text-destructive text-lg">✕</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Curl Command */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black">
            One API Call. <span className="text-gold-gradient">Compliance Proven.</span>
          </h2>
          <div className="bg-card border border-border rounded-lg p-6 text-left font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground whitespace-pre-wrap">
              <span className="text-[hsl(var(--compliant))]">$</span>{" "}
              {`curl -X POST ${window.location.origin.replace('localhost', 'your-domain')}/functions/v1/notarize \\
  -H "Content-Type: application/json" \\
  -d '{
    "decision": "Bioequivalence study BE-2026-0471: dissolution profile matches reference within ±15% at pH 1.2, 4.5, 6.8",
    "model_id": "lab-hplc-v3",
    "context": {
      "drug": "Semaglutide biosimilar",
      "study_type": "dissolution",
      "reference_product": "Ozempic",
      "f2_similarity": 87.3
    },
    "predicate": "TGA_BIOSIMILAR"
  }'`}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Returns a signed receipt with SHA-256 hash, Ed25519 signature, Merkle proof, and verify URL. Your formulation data never leaves your system.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs tracking-widest uppercase">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              The Math is Free.{" "}
              <span className="text-gold-gradient">The Signature is the Product.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`h-full relative overflow-hidden ${
                    tier.highlight
                      ? "border-primary/50 bg-primary/5"
                      : "bg-card/50 border-border/50"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[hsl(var(--compliant))]" />
                  )}
                  <CardHeader>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{tier.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-foreground">{tier.price}</span>
                      {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.desc}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--compliant))] shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={tier.highlight ? "hero" : "heroOutline"}
                      className="w-full"
                      asChild
                    >
                      <Link to={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity CTA */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 p-8 md:p-12 text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs tracking-widest uppercase">
              <DollarSign className="h-3 w-3 mr-1" />
              Equity-for-Speed Model
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black">
              We Don't Want Your Money.{" "}
              <span className="text-gold-gradient">We Want Your Market.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              For the first 3 generic manufacturers to integrate APEX for biosimilar filing: we provide
              unlimited notarization infrastructure at zero cost in exchange for a revenue-share on the
              first 12 months of market sales. You bring the molecule. We bring the proof.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/#contact">
                  Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/notary">
                  <Activity className="mr-2 h-4 w-4" />
                  Try Notary API First
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pharma;
