import { motion } from "framer-motion";
import { Globe, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const VisionSection = () => (
  <section className="relative py-24 px-4 bg-dark-gradient overflow-hidden" id="vision">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(43 85% 52% / 0.04) 0%, transparent 60%)" }}
    />

    <div className="container mx-auto max-w-4xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">The Vision</p>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
          Every AI Company in the World{" "}
          <span className="text-gold-gradient">Uses Apex for Compliance.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          We are building the global standard. Not a tool. Not a service. The infrastructure layer that every AI company depends on to operate legally.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Globe, title: "Global Standard", desc: "One compliance architecture for every jurisdiction." },
            { icon: Target, title: "100% IP Privacy", desc: "Prove compliance without surrendering your model." },
            { icon: Calendar, title: "August 2, 2026", desc: "Full EU AI Act enforcement. The clock is ticking." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card/60 p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <Button variant="hero" size="lg" className="text-base px-8" asChild>
          <a href="#contact">Request Compliance Consultation</a>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default VisionSection;
