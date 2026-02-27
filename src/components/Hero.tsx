import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";

const getTimeLeft = () => {
  const target = new Date("2026-08-02T00:00:00Z").getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
};

const Hero = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 grid-bg overflow-hidden">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              {time.days}d {time.hours}h {time.minutes}m until enforcement
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-4 tracking-tight leading-[0.95]">
            THE GALLOWS
            <br />
            <span className="text-gold-gradient">ARE READY</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            EU AI Act 2026 Compliance.{" "}
            <span className="text-foreground font-medium">Verify Without Disclosure.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Privacy-Preserving AI Compliance for the 2026 Enforcement Wave
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8">
              Request Demo <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8">
              <FileText className="mr-1 h-4 w-4" /> View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
