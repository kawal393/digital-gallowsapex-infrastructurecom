import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, FileText, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import apexLogo from "@/assets/apex-logo.png";
import { useVisitorLocation, useLiveClock } from "@/hooks/use-visitor-info";

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
  const location = useVisitorLocation();
  const clock = useLiveClock();

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 grid-bg overflow-hidden">
      {/* Warm ambient glow layers */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.08) 0%, hsl(35 80% 45% / 0.04) 40%, transparent 70%)" }}
      />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(35 60% 35% / 0.06) 0%, transparent 70%)" }}
      />

      {/* Logo emerging from behind the screen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[520px] md:w-[760px] md:h-[760px] logo-emerge animate-breathe overflow-hidden">
          <img
            src={apexLogo}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: "translate(-18%, -10%) scale(1.22)" }}
          />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8 border-glow">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-xs font-semibold text-gold tracking-widest uppercase">
              {time.days}d {time.hours}h {time.minutes}m until enforcement
            </span>
          </div>

          {/* Visitor location + live clock */}
          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
            {location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-gold" />
                {location.country ? `${location.city}, ${location.country}` : location.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-gold" />
              {clock.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {" · "}
              {clock.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight leading-[0.95]">
            <span className="text-chrome-gradient">THE GALLOWS</span>
            <br />
            <span className="text-gold-gradient">ARE READY</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            EU AI Act 2026 Compliance.{" "}
            <span className="text-gold-gradient font-medium">Verify Without Disclosure.</span>
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            Privacy-Preserving AI Compliance for the 2026 Enforcement Wave
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8" asChild>
              <a href="#contact">Request Demo <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8" asChild>
              <a href="#how-it-works"><FileText className="mr-1 h-4 w-4" /> View Documentation</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
