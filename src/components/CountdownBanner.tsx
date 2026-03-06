import { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DEADLINE = new Date("2026-08-02T00:00:00Z").getTime();

const CountdownBanner = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, DEADLINE - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden border-y border-destructive/30"
      style={{
        background: "linear-gradient(90deg, hsl(0 84% 60% / 0.08), hsl(38 92% 50% / 0.06), hsl(0 84% 60% / 0.08))",
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 py-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-destructive">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          EU AI Act Full Enforcement Deadline
          <AlertTriangle className="h-4 w-4 animate-pulse" />
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {[
            { val: days, label: "Days" },
            { val: hours, label: "Hours" },
            { val: minutes, label: "Min" },
            { val: seconds, label: "Sec" },
          ].map((t, i) => (
            <div key={t.label} className="text-center">
              <div className="rounded-lg border border-border bg-card/80 px-3 py-2 min-w-[56px]">
                <p className="text-2xl sm:text-4xl font-black text-foreground tabular-nums">
                  {String(t.val).padStart(2, "0")}
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-foreground font-semibold">
            August 2, 2026 — Full obligations for high-risk AI systems
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum penalties: <span className="text-destructive font-bold">€35,000,000</span> or{" "}
            <span className="text-destructive font-bold">7% of global annual turnover</span>
            <span className="text-muted-foreground/60"> — EU AI Act Art. 99</span>
          </p>
        </div>

        <Button variant="hero" size="sm" asChild>
          <a href="#contact" className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Start Your Compliance Assessment
          </a>
        </Button>
      </div>
    </motion.section>
  );
};

export default CountdownBanner;
