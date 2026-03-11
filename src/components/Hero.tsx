import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Globe, Clock } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";
import { useVisitorLocation, useLiveClock } from "@/hooks/use-visitor-info";

const Hero = () => {
  const location = useVisitorLocation();
  const time = useLiveClock();

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formattedDate = time.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const cityDisplay = [location.city, location.country].filter(Boolean).join(", ");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-12 grid-bg overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.08) 0%, hsl(35 80% 45% / 0.04) 40%, transparent 70%)" }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[720px] lg:h-[720px] logo-emerge overflow-hidden rounded-full animate-breathe">
          <img src={apexLogo} alt="" className="w-full h-full object-contain" style={{ opacity: 1, filter: "blur(0.5px)", transform: "scale(1.1)" }} />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 border-glow">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-semibold text-primary tracking-widest uppercase">
              PSI Protocol v1.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-5 sm:mb-6 tracking-tight leading-[0.95]">
            <span className="text-chrome-gradient">APEX PSI:</span>
            <br />
            <span className="text-gold-gradient">The Open Standard for</span>
            <br />
            <span className="text-gold-gradient">Verifiable AI Governance.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-3 sm:mb-4">
            <span className="text-foreground font-semibold">Cryptographically proving AI compliance with the EU AI Act</span>
          </p>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-5 sm:mb-6">
            <span className="text-muted-foreground">through</span>{" "}
            <span className="text-psi-gradient font-bold">ZK-SNARKs</span>{" "}
            <span className="text-muted-foreground">and</span>{" "}
            <span className="text-psi-gradient font-bold">MPC Consensus</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-6 max-w-xl mx-auto">
            RFC 8785 (JCS) · Ed25519 Signatures · Monotonic Sequencing · EU AI Act Articles 12, 14, 15
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-8 sm:mb-10">
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button variant="hero" size="lg" className="text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
              <a href="#contact">Request Consultation <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
              <a href="/protocol"><Shield className="mr-1 h-4 w-4" /> View Protocol Spec</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
