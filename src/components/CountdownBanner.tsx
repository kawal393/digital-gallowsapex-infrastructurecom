import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="relative overflow-hidden bg-gradient-to-r from-destructive/20 via-warning/15 to-destructive/20 border-y border-destructive/30">
      <div className="container mx-auto max-w-6xl px-4 py-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-destructive">
          <AlertTriangle className="h-4 w-4" />
          EU AI Act Enforcement: August 2, 2026
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {[
            { val: days, label: "Days" },
            { val: hours, label: "Hours" },
            { val: minutes, label: "Min" },
            { val: seconds, label: "Sec" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{String(t.val).padStart(2, "0")}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Penalties: <span className="text-destructive font-semibold">€35,000,000</span> or <span className="text-destructive font-semibold">7% Global Turnover</span>
        </p>

        <Button variant="hero" size="sm" asChild>
          <a href="#contact">Get Compliant Now</a>
        </Button>
      </div>
    </section>
  );
};

export default CountdownBanner;
