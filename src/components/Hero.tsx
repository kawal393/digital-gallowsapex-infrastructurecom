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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 grid-bg overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.08) 0%, hsl(35 80% 45% / 0.04) 40%, transparent 70%)" }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[720px] md:h-[720px] logo-emerge overflow-hidden rounded-full animate-breathe">
          <img src={apexLogo} alt="" className="w-full h-full object-contain" style={{ opacity: 1, filter: "blur(0.5px)", transform: "scale(1.1)" }} />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {/* WORLD'S FIRST badge */}
          <div className="mb-4">
            <span className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-gold-gradient">
              WORLD&apos;S FIRST
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8 border-glow">
            <Shield className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              Proof of Sovereign Integrity
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[0.95]">
            <span className="text-chrome-gradient">THE WORLD FEARS AI.</span>
            <br />
            <span className="text-gold-gradient">AI FEARS US.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-2">
            <span className="text-foreground font-bold">Global Compliance Standard for the AI Age.</span>
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-4">
            <span className="text-foreground font-semibold">Optimistic ZKML Compliance Architecture.</span>{" "}
            <span className="text-gold-gradient font-medium">99.9% cost reduction over traditional ZK proofs.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
            By Apex Intelligence Empire
          </p>

          {/* Live clock & location */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-10">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-gold/70" />
              {cityDisplay}
            </span>
            <span className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-gold/70" />
              <span className="tabular-nums">{formattedTime}</span>
            </span>
            <span className="text-border">|</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8" asChild>
              <a href="#contact">Request Compliance Consultation <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8" asChild>
              <a href="#solution"><Shield className="mr-1 h-4 w-4" /> How PSI Works</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
