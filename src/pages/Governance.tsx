import { motion } from "framer-motion";
import { Shield, Users, Clock, Key, FileText, CheckCircle2, Scale, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tribunalSeats = [
  {
    seat: "Seat 1",
    title: "Lead Cryptographer",
    jurisdiction: "Global",
    focus: "ZK-proof architecture, Ed25519 signature integrity, MPC consensus validation",
    status: "Appointment in Progress",
  },
  {
    seat: "Seat 2",
    title: "Regulatory Liaison",
    jurisdiction: "European Union",
    focus: "EU AI Act (2024/1689), GDPR, DORA, CEN-CENELEC harmonised standards",
    status: "Appointment in Progress",
  },
  {
    seat: "Seat 3",
    title: "Industry Representative",
    jurisdiction: "Asia-Pacific / Americas",
    focus: "Enterprise AI deployment, NIST AI RMF, Australia Privacy Act 2026, India IT Rules",
    status: "Appointment in Progress",
  },
  {
    seat: "Seat 4",
    title: "Medical Ethics Lead",
    jurisdiction: "United Kingdom / EU",
    focus: "Healthcare AI governance, TGA compliance, NDIS regulatory frameworks, clinical AI oversight",
    status: "Appointment in Progress",
  },
  {
    seat: "Seat 5",
    title: "Sovereign Anchor",
    jurisdiction: "MENA / Global",
    focus: "Cross-jurisdictional enforcement, emerging AI frameworks, global Merkle root integrity",
    status: "Appointment in Progress",
  },
];

const processSteps = [
  {
    step: "1",
    title: "MPC Verification Completes",
    description: "The 3-node MPC cluster produces a VERIFIED verdict with 2/3 consensus. The commit enters the Tribunal queue.",
    icon: Shield,
  },
  {
    step: "2",
    title: "Auditor Review",
    description: "Each of the 5 independent auditors reviews the commit, its predicate mapping, and the MPC evidence. They submit an APPROVE or REJECT verdict with mandatory written rationale.",
    icon: FileText,
  },
  {
    step: "3",
    title: "Ed25519 Signed Verdicts",
    description: "Every auditor verdict is digitally signed with the auditor's Ed25519 private key, providing cryptographic non-repudiation. No verdict can be altered after signing.",
    icon: Key,
  },
  {
    step: "4",
    title: "3-of-5 Ratification",
    description: "When 3 or more auditors approve, the commit reaches RATIFIED status. A ratification_hash is computed: SHA-256(sorted(auditor_signatures).join('||')).",
    icon: CheckCircle2,
  },
  {
    step: "5",
    title: "48-Hour SLA Enforcement",
    description: "If the 3-of-5 quorum is not met within 48 hours, the MPC verdict stands automatically with a TRIBUNAL_TIMEOUT flag. This prevents governance bottlenecks.",
    icon: Clock,
  },
];

const qualifications = [
  "Active professional certification in law, cybersecurity, AI ethics, or regulatory compliance",
  "Minimum 5 years of experience in AI governance, data protection, or technology regulation",
  "No active conflicts of interest with entities subject to PSI verification",
  "Ability to commit to the 48-hour SLA review window",
  "Willingness to sign verdicts with a personal Ed25519 key for non-repudiation",
];

const Governance = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.06) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="border-primary/30 text-primary mb-4">
                FOUNDING TRIBUNAL — GOVERNANCE MODEL
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                <span className="text-chrome-gradient">Sovereign</span>{" "}
                <span className="text-gold-gradient">Tribunal</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                A 5-party independent auditor ratification layer providing human oversight
                of automated compliance verdicts — satisfying EU AI Act Article 14 requirements
                through cryptographically signed, transparent governance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vetting Phase Notice */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gold/30 bg-gold/5 p-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-gold" />
                <h3 className="text-sm font-black tracking-widest text-gold uppercase">Confidential Vetting Phase</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                The Apex Sovereign Tribunal is currently in a <span className="text-foreground font-semibold">Confidential Vetting Phase</span> to
                ensure institutional credibility and jurisdictional diversity. All 5 seats are undergoing rigorous credential
                verification to guarantee <span className="text-foreground font-semibold">3-of-5 consensus integrity</span> for
                all Sovereign Audits beginning <span className="text-gold font-bold">July 2026</span>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What It Is / What It Is Not */}
        <section className="px-4 py-12">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="rounded-xl border border-compliant/30 bg-compliant/5 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-compliant" /> What the Tribunal IS
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>• A governance mechanism for human oversight of automated verdicts</li>
                  <li>• 5 independent credentialed professionals with jurisdictional diversity</li>
                  <li>• Ed25519-signed verdicts with mandatory written rationale</li>
                  <li>• A 3-of-5 consensus threshold preventing single-auditor compromise</li>
                  <li>• Compliant with EU AI Act Article 14 (Human Oversight)</li>
                  <li>• Transparent — all ratification hashes are publicly verifiable</li>
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-destructive" /> What the Tribunal is NOT
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>• NOT a court of law or judicial body</li>
                  <li>• NOT a regulatory authority or government agency</li>
                  <li>• NOT a replacement for official conformity assessment</li>
                  <li>• NOT binding on any third party — it is an internal governance layer</li>
                  <li>• NOT a tribunal in the legal sense — the name reflects the gravity of the function</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5 Named Seats */}
        <section className="px-4 py-12 bg-card/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-2 text-center">
                <span className="text-chrome-gradient">Founding Tribunal</span>{" "}
                <span className="text-gold-gradient">— 5 Seats</span>
              </h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">
                Each seat represents a critical domain of expertise. No single discipline or geography controls the outcome.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tribunalSeats.map((role, idx) => (
                <motion.div key={role.seat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl border border-border bg-card/80 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">{role.seat}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-gold/40 text-gold font-bold">
                      {role.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{role.title}</h4>
                  <p className="text-[11px] text-muted-foreground mb-1 font-medium">{role.jurisdiction}</p>
                  <p className="text-xs text-muted-foreground">{role.focus}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ratification Process */}
        <section className="px-4 py-12">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-2 text-center">
                <span className="text-chrome-gradient">Ratification</span>{" "}
                <span className="text-gold-gradient">Process</span>
              </h2>
              <p className="text-muted-foreground text-center mb-10 text-sm">
                How a machine verdict becomes a human-ratified compliance proof.
              </p>
            </motion.div>

            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.08 }}
                  className="rounded-xl border border-border bg-card/80 p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Auditor Qualifications */}
        <section className="px-4 py-12 bg-card/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-2 text-center">
                <span className="text-chrome-gradient">Auditor</span>{" "}
                <span className="text-gold-gradient">Qualifications</span>
              </h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">
                Tribunal auditors are credentialed professionals, not anonymous validators.
              </p>

              <div className="rounded-xl border border-border bg-card/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground">Requirements</h3>
                </div>
                <ul className="space-y-3">
                  {qualifications.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-compliant shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
                <h4 className="font-bold text-foreground mb-2">Expressions of Interest</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The Founding Tribunal is in a Confidential Vetting Phase.
                  Expressions of interest from qualified professionals with relevant credentials are welcome.
                </p>
                <p className="text-sm text-primary font-mono">contact@apex-infrastructure.com</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article 14 Compliance */}
        <section className="px-4 py-12">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-primary/20 bg-card/80 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  EU AI Act Article 14 Compliance
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Article 14 requires that high-risk AI systems "shall be designed and developed in such a way
                  [...] that they can be effectively overseen by natural persons." The Sovereign Tribunal satisfies
                  this through:
                </p>
                <div className="space-y-2 ml-4">
                  {[
                    "Human-in-the-loop: Every MPC verdict is reviewed by natural persons before ratification",
                    "Diversity: 5 auditors across 5 domains prevent monocultural oversight",
                    "Non-repudiation: Ed25519 signatures ensure auditors cannot deny their verdicts",
                    "Accountability: Mandatory rationale creates an auditable decision trail",
                    "Timeliness: 48-hour SLA prevents indefinite delays in compliance certification",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-compliant shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-4 py-12 bg-card/30">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-6">
                <span className="text-chrome-gradient">Institutional</span>{" "}
                <span className="text-gold-gradient">Timeline</span>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { date: "Q2 2026", label: "Vetting Phase Concludes", desc: "All 5 seats credentialed and enshrined" },
                  { date: "July 2026", label: "Tribunal Operational", desc: "3-of-5 Sovereign Audits begin" },
                  { date: "Aug 2, 2026", label: "EU AI Act Enforcement", desc: "Full regulatory compliance required" },
                ].map((m) => (
                  <div key={m.date} className="rounded-lg border border-border bg-card/60 p-4">
                    <p className="text-lg font-black text-gold-gradient">{m.date}</p>
                    <p className="text-xs font-bold text-foreground mt-1">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Governance;
