import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Lock } from "lucide-react";

const NotaryHero = () => (
  <section className="relative py-20 sm:py-32 px-4 overflow-hidden">
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.08) 0%, transparent 60%)" }}
    />
    <div className="container mx-auto max-w-5xl relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Badge variant="outline" className="border-primary/30 text-primary mb-6 text-xs tracking-widest">
          APEX NOTARY — CRYPTOGRAPHIC ATTESTATION API
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[0.95]">
          <span className="text-chrome-gradient">Every AI Decision.</span>
          <br />
          <span className="text-gold-gradient">Mathematically Notarized.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-10">
          One API call. SHA-256 hashed. Ed25519 signed. Merkle-anchored.
          A tamper-proof receipt for every AI decision your system makes —
          satisfying EU AI Act Articles 12, 13 & 14.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: Shield, label: "Ed25519 Signed", desc: "Cryptographic non-repudiation" },
            { icon: FileText, label: "Merkle Anchored", desc: "Inclusion proof for every receipt" },
            { icon: Lock, label: "Zero IP Exposure", desc: "Only hashes leave your system" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 bg-card/60 border border-border rounded-xl px-5 py-3">
              <item.icon className="h-5 w-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default NotaryHero;
