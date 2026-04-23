import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skull, ShieldCheck, Code2, Crown, Globe, Gauge, Swords, Infinity as InfinityIcon } from "lucide-react";

const threats = [
  {
    icon: Skull,
    killer: "IETF says no",
    answer: "Reference implementation already shipped",
    moat: "draft-singh-psi-00 + working SDK + live ledger. Committees adopt code that runs.",
  },
  {
    icon: Globe,
    killer: "EU picks ISO 42001",
    answer: "We sit beneath ISO, not against it",
    moat: "ISO 42001 = management system. PSI = cryptographic proof layer. Complementary, not competing.",
  },
  {
    icon: Crown,
    killer: "Patent = poison pill",
    answer: "Royalty-free pledge for conformant impls",
    moat: "Patent protects the managed service. Protocol stays open. Stripe model: own the rails, free the spec.",
  },
  {
    icon: Gauge,
    killer: "Too early — no pain yet",
    answer: "Aug 2026 GPAI fines. Aug 2027 high-risk.",
    moat: "Runway aligned to enforcement curve. First €35M fine = inbound flood. We're the only deployed answer.",
  },
  {
    icon: Code2,
    killer: "Too heavy = no adoption",
    answer: "Sub-1ms local cache, async anchoring",
    moat: "Hot path adds <1ms. Heavy crypto runs off-thread. Already benchmarked in production SDK.",
  },
  {
    icon: Swords,
    killer: "Big Lab ships 'Proof Mode'",
    answer: "Self-attestation ≠ third-party proof",
    moat: "GPT-6 saying 'I'm compliant' is the problem we exist to solve. Regulators need independent verification.",
  },
];

const layers = [
  {
    label: "Layer 1 — Protocol",
    title: "Royalty-Free, IETF-Track",
    desc: "draft-singh-psi · RFC 8785 · Ed25519. Non-assertion pledge for conformant implementations.",
    tag: "OPEN",
  },
  {
    label: "Layer 2 — Reference",
    title: "MIT-Licensed SDK",
    desc: "@apex/gallows-sdk. The only working implementation on day one. Developer mindshare.",
    tag: "FREE",
  },
  {
    label: "Layer 3 — Service",
    title: "Patent-Protected Infrastructure",
    desc: "3-node MPC mesh, Notary API, Bitcoin/Polygon anchoring, regulator-ready receipts.",
    tag: "PAID",
  },
];

const InevitabilityDoctrine = () => {
  return (
    <section className="relative py-24 px-4" id="inevitability">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-5">
            <InfinityIcon className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] font-semibold text-gold tracking-widest uppercase">
              The Inevitability Doctrine
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            <span className="text-chrome-gradient">Six Ways We Die.</span>{" "}
            <span className="text-gold-gradient">Six Reasons We Don't.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Every standard fight has a graveyard. We mapped every way APEX PSI dies — then engineered the moat for each one. Patent ≠ Standard. We're building both, on different layers.
          </p>
        </motion.div>

        {/* Threat / Moat grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {threats.map((t, i) => (
            <motion.div
              key={t.killer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-gold/40 transition-colors group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 shrink-0">
                  <t.icon className="h-4 w-4 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-destructive/80 font-semibold mb-0.5">
                    Killer
                  </p>
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {t.killer}
                  </p>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-[10px] uppercase tracking-widest text-gold/80 font-semibold mb-1">
                  Moat
                </p>
                <p className="text-sm font-semibold text-foreground/90 mb-1.5 leading-snug">
                  {t.answer}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.moat}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Three-layer strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gold/20 bg-card/80 backdrop-blur-sm p-6 sm:p-10 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, hsl(var(--gold) / 0.06) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <div className="text-center mb-8">
              <p className="text-gold font-semibold tracking-widest uppercase text-xs mb-3">
                The Three-Layer Doctrine
              </p>
              <h3 className="text-2xl sm:text-3xl font-black mb-3">
                <span className="text-chrome-gradient">Open the Protocol.</span>{" "}
                <span className="text-gold-gradient">Patent the Rails.</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                You don't pick standard <span className="italic">or</span> revenue. You separate them by layer — the way Stripe separated HTTPS from Stripe, the way Linux separated POSIX from Red Hat.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {layers.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="rounded-xl border border-border bg-background/60 p-5 relative"
                >
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest text-gold/80 border border-gold/30 rounded px-1.5 py-0.5 bg-gold/5">
                    {l.tag}
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    {l.label}
                  </p>
                  <h4 className="text-base font-black text-foreground mb-2 leading-tight">
                    {l.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {l.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-bold text-foreground">
                  <Link to="/pledge" className="text-gold hover:underline">Patent Pledge</Link>:
                </span>{" "}
                APEX commits to non-assertion against any conformant implementation of the published PSI Protocol. The patent guards the operational service — never the standard.{" "}
                <Link to="/pledge" className="text-gold/80 hover:text-gold underline-offset-2 hover:underline">Read the full pledge →</Link>
              </p>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground/80 italic max-w-xl mx-auto">
              We do not solicit adoption. The standard exists. Conformant implementations are welcome.
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] text-muted-foreground/60 mt-8 italic max-w-2xl mx-auto"
        >
          "Standards are for glory. Service is for revenue. We're playing for both — on different layers."
        </motion.p>
      </div>
    </section>
  );
};

export default InevitabilityDoctrine;
