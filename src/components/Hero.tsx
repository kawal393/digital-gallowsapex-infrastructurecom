import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useVisitorLocation, useLiveClock } from "@/hooks/use-visitor-info";

const Hero = () => {
  const location = useVisitorLocation();
  const time = useLiveClock();

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const cityDisplay = [location.city, location.country].filter(Boolean).join(", ");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

          {/* Status line */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            <span className="inline-block text-[10px] sm:text-xs font-bold text-primary tracking-[0.3em] uppercase border-b border-primary/30 pb-1">
              Reference Implementation of draft-singh-psi-00
            </span>
          </motion.div>

          {/* THE DECLARATION */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="block text-chrome-gradient"
            >
              OPEN GLOBAL
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="block text-gold-gradient"
            >
              TRIBUNAL.
            </motion.span>
          </h1>

          {/* Sub-declaration pillars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8"
          >
            {["OPEN SOURCE", "FREE FOREVER", "PERMISSIONLESS"].map((word, i) => (
              <span key={word} className="text-sm sm:text-base md:text-lg font-black tracking-[0.2em] text-gold uppercase">
                {word}
                {i < 2 && <span className="text-border ml-6 hidden sm:inline">·</span>}
              </span>
            ))}
          </motion.div>

          {/* Core message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <p className="text-base sm:text-lg md:text-xl text-foreground font-semibold mb-3">
              The definitive standard for verifiable AI governance.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Cryptographic compliance with the EU AI Act through{" "}
              <span className="text-gold font-bold">Zero-Knowledge Proofs</span>,{" "}
              <span className="text-gold font-bold">MPC Consensus</span> &{" "}
              <span className="text-gold font-bold">Public Attestation</span>.
            </p>
          </motion.div>

          {/* Tech specs line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[10px] sm:text-xs text-muted-foreground font-mono tracking-widest uppercase mb-8"
          >
            RFC 8785 (JCS) · Ed25519 · Monotonic Sequencing · EU AI Act Art. 12, 14, 15
          </motion.p>

          {/* Location + time bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-10"
          >
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-primary/70" />
              {cityDisplay}
            </span>
            <span className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary/70" />
              <span className="tabular-nums">{formattedTime}</span>
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">{formattedDate}</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button variant="hero" size="lg" className="text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
              <Link to="/gallows">Access the Protocol <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
              <Link to="/governance"><Shield className="mr-1 h-4 w-4" /> The Manifesto</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
