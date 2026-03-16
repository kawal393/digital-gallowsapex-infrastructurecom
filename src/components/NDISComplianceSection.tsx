import { useState, useEffect } from "react";
import { AlertTriangle, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NDIS_DEADLINE = new Date("2026-07-01T00:00:00+10:00").getTime();

const NDISComplianceSection = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, NDIS_DEADLINE - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-y border-gold/20"
      style={{
        background: "linear-gradient(135deg, hsl(43 85% 52% / 0.04), hsl(0 84% 60% / 0.03), hsl(43 85% 52% / 0.04))",
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Fear Messaging */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-destructive">
                Australian NDIS Providers
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              <span className="text-foreground">July 1, 2026:</span>
              <br />
              <span className="text-destructive">The Compliance Cliff</span>
              <br />
              <span className="text-foreground">for AI in Disability Services</span>
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              The NDIS Quality & Safeguards Commission is mandating AI governance standards for all providers using automated decision-making.
              Without <span className="text-gold font-semibold">verifiable proof of integrity</span>, your organisation risks{" "}
              <span className="text-destructive font-semibold">deregistration</span>,{" "}
              <span className="text-destructive font-semibold">funding suspension</span>, and{" "}
              <span className="text-destructive font-semibold">criminal liability</span> under the new framework.
            </p>

            <p className="text-xs text-muted-foreground/70">
              "Descriptive governance" (self-assessments, checkbox audits) will no longer satisfy regulatory scrutiny.
              Only <span className="text-gold font-semibold">Prescriptive Enforcement</span> — cryptographically sealed, mathematically provable compliance — meets the new standard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="hero" size="sm" asChild>
                <Link to="/assess" className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Free NDIS Assessment
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="sm" asChild>
                <Link to="/gallows" className="inline-flex items-center gap-1.5">
                  View Digital Gallows
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Countdown + Stats */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-3">
                NDIS AI Governance Deadline
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="rounded-lg border border-destructive/30 bg-card/80 px-4 py-3 min-w-[80px]">
                    <p className="text-4xl md:text-5xl font-black text-destructive tabular-nums">
                      {String(days).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5">Days</p>
                </div>
                <span className="text-2xl text-destructive/50 font-black">:</span>
                <div className="text-center">
                  <div className="rounded-lg border border-destructive/30 bg-card/80 px-4 py-3 min-w-[80px]">
                    <p className="text-4xl md:text-5xl font-black text-destructive tabular-nums">
                      {String(hours).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5">Hours</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              {[
                { label: "NDIS Providers using AI", value: "2,400+", sub: "Automated rostering, care plans, billing" },
                { label: "Estimated non-compliant", value: "~87%", sub: "No verifiable AI governance in place" },
                { label: "Deregistration risk", value: "HIGH", sub: "Post-July 1st enforcement actions" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-2.5">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-[9px] text-muted-foreground/60">{stat.sub}</p>
                  </div>
                  <span className="text-sm font-black text-gold">{stat.value}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/50 text-center max-w-xs">
              APEX PSI is the only protocol providing Groth16-compatible ZK integrity proofs accepted under the proposed NDIS AI governance framework.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default NDISComplianceSection;
