import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

const Hero = () => {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8 border-glow">
            <Shield className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              Proof of Sovereign Integrity
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[0.95]">
            <span className="text-chrome-gradient">PROVE COMPLIANCE</span>
            <br />
            <span className="text-gold-gradient">WITHOUT SURRENDERING</span>
            <br />
            <span className="text-chrome-gradient">YOUR IP</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            The Optimistic ZKML Solution for the EU AI Act.{" "}
            <span className="text-gold-gradient font-medium">99.9% cost reduction over traditional ZK proofs.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-10 max-w-xl mx-auto">
            The World's First Optimistic ZKML Compliance Architecture — by Apex Intelligence Empire
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8" asChild>
              <a href="#contact">Request Sovereign Compliance Audit <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8" asChild>
              <a href="#solution"><Shield className="mr-1 h-4 w-4" /> Learn How PSI Works</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
