import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, AlertTriangle, ArrowRight, CheckCircle2, FileCheck,
  Clock, Lock, Users, Scale, Hash, Key, Zap, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NDISVerifier from "@/components/verify/NDISVerifier";

const NDIS_DEADLINE = new Date("2026-07-01T00:00:00+10:00").getTime();

const riskCards = [
  {
    icon: AlertTriangle,
    title: "Deregistration",
    desc: "NDIS Commission can revoke provider registration for non-compliant AI usage in care plans and rostering.",
    severity: "CRITICAL",
  },
  {
    icon: Scale,
    title: "Criminal Liability",
    desc: "Directors face personal liability under strengthened NDIS Quality & Safeguards framework for algorithmic harm.",
    severity: "HIGH",
  },
  {
    icon: Lock,
    title: "Funding Suspension",
    desc: "Automated billing flagged without verifiable audit trail results in immediate payment freeze.",
    severity: "HIGH",
  },
  {
    icon: Users,
    title: "Participant Harm",
    desc: "Unverified AI-driven care decisions that cause participant harm trigger mandatory incident reporting.",
    severity: "CRITICAL",
  },
];

const complianceSteps = [
  {
    icon: FileCheck,
    title: "Notarize Every AI Decision",
    desc: "Each automated rostering, care plan, or billing decision is hashed (SHA-256) and signed (Ed25519) via a single API call.",
  },
  {
    icon: Hash,
    title: "Immutable Audit Trail",
    desc: "Every decision receipt is anchored to a global Merkle tree — tamper-proof, regulator-ready, mathematically verifiable.",
  },
  {
    icon: Shield,
    title: "Instant Compliance Proof",
    desc: "Generate PDF certificates with QR verification codes. Auditors can independently verify any decision in seconds.",
  },
  {
    icon: Key,
    title: "Zero Data Exposure",
    desc: "Only hashes leave your system. No participant PII, no care plan details — just cryptographic proof of process integrity.",
  },
];

const pricingTiers = [
  {
    name: "SIL Starter",
    price: "Free",
    period: "",
    desc: "For small providers testing compliance",
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
    name: "SIL Professional",
    price: "$299",
    period: "/month",
    desc: "For mid-size SIL providers",
    features: [
      "10,000 notarizations/day",
      "Batch API (100 per call)",
      "Webhook integrations",
      "Priority PDF generation",
      "Dedicated API keys",
      "Email support",
    ],
    cta: "Get Started",
    href: "/auth",
    highlight: true,
  },
  {
    name: "SIL Enterprise",
    price: "Custom",
    period: "",
    desc: "For large providers & plan managers",
    features: [
      "Unlimited notarizations",
      "On-premise deployment option",
      "Custom predicate rules",
      "Tribunal governance access",
      "SLA guarantee",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    href: "/#contact",
    highlight: false,
  },
];

const NDIS = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, NDIS_DEADLINE - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>NDIS AI Compliance — Cryptographic Audit Trail for SIL Providers | APEX</title>
        <meta
          name="description"
          content="Australian NDIS providers face July 1, 2026 AI governance deadline. APEX provides mathematically verifiable compliance receipts for automated rostering, care plans, and billing decisions."
        />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 20%, hsl(0 84% 60% / 0.06), transparent 70%)",
          }}
        />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-1.5 mb-6">
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.15em] text-destructive">
                Mandatory Compliance Deadline
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">July 1, 2026:</span>
              <br />
              <span className="text-destructive">Your AI Must Prove</span>
              <br />
              <span className="text-gold-gradient">It Didn't Harm Anyone</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-base">
              The NDIS Quality & Safeguards Commission is mandating verifiable AI governance
              for all providers using automated decision-making in participant care.
              Without <span className="text-gold font-semibold">cryptographic proof</span>,
              your organisation faces deregistration.
            </p>

            {/* Countdown */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-8">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Minutes" },
                { value: seconds, label: "Seconds" },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="rounded-xl border border-destructive/30 bg-card/80 backdrop-blur-sm px-4 py-3 min-w-[70px] sm:min-w-[90px]">
                    <p className="text-3xl sm:text-5xl font-black text-destructive tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                    {unit.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/assess">
                  <Shield className="h-4 w-4 mr-2" />
                  Free NDIS Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#demo">
                  <Zap className="h-4 w-4 mr-2" />
                  Try Live Demo
                  <ChevronDown className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risk Cards */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              <span className="text-chrome-gradient">What Happens If You</span>{" "}
              <span className="text-destructive">Don't Comply</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Post-July 1, 2026 enforcement actions for providers using AI without verifiable governance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-destructive/20 bg-card/60 p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-destructive/5 rounded-bl-full" />
                <Badge
                  variant="outline"
                  className="mb-3 border-destructive/30 text-destructive text-[10px]"
                >
                  {card.severity}
                </Badge>
                <card.icon className="h-8 w-8 text-destructive mb-3" />
                <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How APEX Solves It */}
      <section className="py-16 px-4 border-t border-border bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              <span className="text-chrome-gradient">One API Call.</span>{" "}
              <span className="text-gold-gradient">Total Compliance.</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              APEX NOTARY provides cryptographic proof of every AI decision — without exposing participant data.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {complianceSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-primary/20 bg-card/60 p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* curl example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-xl border border-gold/20 bg-card/80 p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-3">
              Integration Example — SIL Rostering Decision
            </p>
            <pre className="text-xs text-muted-foreground overflow-x-auto font-mono leading-relaxed">
{`curl -X POST https://qhtntebpcribjiwrdtdd.supabase.co/functions/v1/notarize \\
  -H "Content-Type: application/json" \\
  -d '{
    "decision": "Assigned support worker #SW-4521 to participant #P-7890 for SIL shift 2026-03-22T06:00",
    "model_id": "rostering-engine-v3",
    "context": { "participant_plan": "core-supports", "worker_qualification": "cert-iii" },
    "predicate": "NDIS_INTEGRITY"
  }'`}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              <span className="text-chrome-gradient">Live</span>{" "}
              <span className="text-gold-gradient">Demo</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Test the NDIS Invoice Integrity Verifier. No data leaves your browser.
            </p>
          </motion.div>
          <NDISVerifier />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-t border-border bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "2,400+", label: "NDIS Providers Using AI" },
              { value: "~87%", label: "Currently Non-Compliant" },
              { value: "<200ms", label: "Receipt Generation Time" },
              { value: "$0", label: "Free Tier Cost" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-border bg-card/60">
                <p className="text-2xl sm:text-3xl font-black text-gold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              <span className="text-chrome-gradient">NDIS</span>{" "}
              <span className="text-gold-gradient">Pricing</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Start free. Scale as you grow. No lock-in.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? "border-gold/40 bg-card/80 ring-1 ring-gold/20"
                    : "border-border bg-card/60"
                }`}
              >
                {tier.highlight && (
                  <Badge className="self-start mb-3 bg-gold/10 text-gold border-gold/30 text-[10px]">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-1">
                  <span className="text-3xl font-black text-foreground">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">{tier.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-compliant mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlight ? "hero" : "heroOutline"}
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link to={tier.href}>{tier.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 border-t border-gold/20" style={{
        background: "linear-gradient(135deg, hsl(43 85% 52% / 0.04), transparent, hsl(43 85% 52% / 0.04))",
      }}>
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            <span className="text-foreground">Don't Wait for the</span>{" "}
            <span className="text-destructive">Compliance Cliff</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-8">
            Every day without verifiable AI governance is a day closer to deregistration.
            APEX NOTARY takes 5 minutes to integrate. Start now.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/notary">
                <Shield className="h-4 w-4 mr-2" />
                Start Notarizing — Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/gallows">
                View Digital Gallows
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NDIS;
