import { motion } from "framer-motion";
import { Shield, FileText, Lock, Eye, Server, Hash, Key, Clock, GitBranch, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const protocolVersion = "1.0";

const legalMapping = [
  {
    article: "Article 12",
    title: "Record-Keeping (Logging)",
    requirement: "High-risk AI systems must include logging capabilities for automatic recording of events relevant to risk identification.",
    psiSolution: [
      "Immutable event streaming via SHA-256 hash-chained audit trail",
      "RFC 8785 JSON Canonicalization (JCS) ensures deterministic log formatting across all systems",
      "Monotonic sequence counter with gap detection prevents log deletion or tampering",
      "Real-time Merkle tree inclusion proofs for every logged event",
    ],
    icon: FileText,
    color: "text-primary",
  },
  {
    article: "Article 14",
    title: "Human Oversight",
    requirement: "High-risk AI systems must allow effective human oversight, including the ability to intervene and halt the system.",
    psiSolution: [
      "5-second Sovereign Pause kill-switch halts all pipeline operations instantly",
      "Human Notary sign-off required before verification phase completes",
      "Full audit trail of all pause/resume actions with timestamps",
      "Art. 14 compliance attestation embedded in every certificate",
    ],
    icon: Eye,
    color: "text-gold",
  },
  {
    article: "Article 15",
    title: "Accuracy, Robustness & Cybersecurity",
    requirement: "High-risk AI must be resilient to errors and robust against unauthorized third-party manipulation.",
    psiSolution: [
      "MPC (Multi-Party Computation) 3-node consensus with 2/3 threshold verification",
      "Ed25519 digital signatures on every Merkle root for non-repudiation",
      "ZK-SNARK privacy proofs (Groth16/BN128) prevent IP disclosure during verification",
      "Distributed verification prevents single-point-of-failure attacks",
    ],
    icon: Lock,
    color: "text-compliant",
  },
];

const cryptoSpecs = [
  { algorithm: "SHA-256", purpose: "Commit hashing & Merkle tree", standard: "FIPS 180-4", strength: "256-bit" },
  { algorithm: "Ed25519", purpose: "Merkle root digital signatures", standard: "RFC 8032", strength: "~128-bit equivalent" },
  { algorithm: "Groth16 / BN128", purpose: "ZK-SNARK privacy proofs", standard: "EIP-197 (Ethereum)", strength: "128-bit" },
  { algorithm: "JCS", purpose: "JSON canonicalization for deterministic hashing", standard: "RFC 8785", strength: "N/A (format)" },
  { algorithm: "MPC (Shamir)", purpose: "Distributed threshold verification", standard: "Shamir's Secret Sharing", strength: "2/3 threshold" },
];

const changelog = [
  {
    version: "1.0",
    date: "2026-03-10",
    changes: [
      "Initial PSI Protocol specification",
      "RFC 8785 JSON Canonicalization Scheme integration",
      "Ed25519 digital signatures for Merkle roots",
      "Monotonic sequence counter with gap detection",
      "3-node MPC consensus verification",
      "ZK-SNARK privacy proofs (Groth16/BN128)",
      "Legal-to-technical mapping for Articles 12, 14, 15",
      "Independent regulator verification portal",
      "Proof bundle export format specification",
    ],
  },
];

const Protocol = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 px-4 grid-bg overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.06) 0%, transparent 60%)" }}
          />
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="border-primary/30 text-primary mb-4">
                PROTOCOL SPECIFICATION
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                <span className="text-chrome-gradient">PSI Protocol</span>{" "}
                <span className="text-psi-gradient">v{protocolVersion}</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                The Proof of Sovereign Integrity (PSI) Protocol is an open cryptographic standard
                for verifiable AI governance. It enables organizations to prove regulatory compliance
                without disclosing proprietary model architectures, training data, or inference logic.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Legal-to-Technical Mapping */}
        <section className="px-4 py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 text-center">
                <span className="text-chrome-gradient">Legal-to-Technical</span>{" "}
                <span className="text-psi-gradient">Mapping</span>
              </h2>
              <p className="text-muted-foreground text-center mb-10 text-sm max-w-2xl mx-auto">
                How PSI Protocol satisfies EU AI Act requirements through cryptographic primitives.
              </p>
            </motion.div>

            <div className="space-y-6">
              {legalMapping.map((item, idx) => (
                <motion.div
                  key={item.article}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                  className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{item.article}: {item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.requirement}</p>
                      </div>
                    </div>

                    <div className="ml-14 space-y-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">PSI Protocol Implementation</p>
                      {item.psiSolution.map((solution, si) => (
                        <div key={si} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-compliant shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cryptographic Specifications */}
        <section className="px-4 py-12 sm:py-16 bg-card/30">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 text-center">
                <span className="text-chrome-gradient">Cryptographic</span>{" "}
                <span className="text-psi-gradient">Specifications</span>
              </h2>
              <p className="text-muted-foreground text-center mb-10 text-sm">
                All algorithms used in the PSI Protocol verification pipeline.
              </p>
            </motion.div>

            <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Algorithm</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Purpose</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Standard</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoSpecs.map((spec, idx) => (
                      <tr key={spec.algorithm} className={`border-b border-border/50 ${idx % 2 === 0 ? 'bg-muted/5' : ''}`}>
                        <td className="px-6 py-4 text-sm font-mono font-bold text-primary">{spec.algorithm}</td>
                        <td className="px-6 py-4 text-sm text-foreground/80">{spec.purpose}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{spec.standard}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{spec.strength}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Public Verification Key */}
        <section className="px-4 py-12 sm:py-16">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Public Verification Key (Ed25519)</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Use this public key to independently verify Ed25519 signatures on PSI Merkle roots.
                  Any regulator or auditor can validate proof bundles without contacting APEX.
                </p>
                <div className="rounded-lg bg-background border border-border p-4 font-mono text-xs text-primary break-all">
                  <span className="text-muted-foreground text-[10px] block mb-1">Ed25519 Public Key (hex)</span>
                  PENDING_DEPLOYMENT — Key will be published upon Ed25519 secret configuration
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Algorithm: Ed25519 (RFC 8032) · Curve: Curve25519 · Key size: 256-bit
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Protocol Changelog */}
        <section className="px-4 py-12 sm:py-16 bg-card/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-black mb-8 text-center">
                <span className="text-chrome-gradient">Protocol</span>{" "}
                <span className="text-psi-gradient">Changelog</span>
              </h2>

              {changelog.map((entry) => (
                <div key={entry.version} className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-bold text-foreground">v{entry.version}</span>
                      <span className="text-muted-foreground text-sm ml-3">{entry.date}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-8">
                    {entry.changes.map((change, ci) => (
                      <li key={ci} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-compliant shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Protocol;
