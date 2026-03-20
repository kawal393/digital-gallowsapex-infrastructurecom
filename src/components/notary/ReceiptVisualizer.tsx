import { motion } from "framer-motion";
import { Shield, Hash, Key, FileText, Clock, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: FileText, label: "Decision Submitted", desc: "JSON payload received via POST /notarize", color: "text-primary" },
  { icon: Hash, label: "SHA-256 Hashed", desc: "Decision canonicalized & hashed (FIPS 180-4)", color: "text-gold" },
  { icon: Shield, label: "Merkle Anchored", desc: "Leaf inserted into global binary Merkle tree", color: "text-primary" },
  { icon: Key, label: "Ed25519 Signed", desc: "Merkle leaf signed with sovereign key (RFC 8032)", color: "text-gold" },
  { icon: Clock, label: "Timestamped", desc: "ISO-8601 timestamp + monotonic sequence counter", color: "text-primary" },
  { icon: CheckCircle2, label: "Receipt Issued", desc: "Tamper-proof receipt with verify URL returned", color: "text-compliant" },
];

const ReceiptVisualizer = () => (
  <section className="px-4 py-16 sm:py-24 bg-card/30">
    <div className="container mx-auto max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black mb-3">
          <span className="text-chrome-gradient">How It</span>{" "}
          <span className="text-gold-gradient">Works</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          From JSON payload to cryptographic receipt in under 200ms.
        </p>
      </motion.div>

      <div className="space-y-1">
        {steps.map((step, idx) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/80"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              {idx < steps.length - 1 && <div className="w-px h-4 bg-border" />}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReceiptVisualizer;
