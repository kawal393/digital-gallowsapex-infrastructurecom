import { motion } from "framer-motion";
import { Handshake, Percent, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BusinessModel = () => (
  <section className="relative py-24 px-4" id="business-model">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Business Model</p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          We Don't <span className="text-gold-gradient">Sell Software</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We are the partner, not the vendor. We deploy sovereign compliance infrastructure and share in the outcome.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-gold/30 bg-card/60 p-8"
        >
          <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
            <Percent className="h-7 w-7 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Equity Partnership</h3>
          <p className="text-3xl font-black text-gold-gradient mb-4">10–15% Equity</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            We deploy our full PSI compliance stack into your AI company. In exchange, we take a 10–15% equity stake. Your compliance becomes our investment. We succeed when you succeed.
          </p>
          <Button variant="hero" asChild>
            <a href="#contact">Discuss Partnership</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card/60 p-8"
        >
          <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
            <Users className="h-7 w-7 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Revenue Partner Commission</h3>
          <p className="text-3xl font-black text-gold-gradient mb-4">50% Commission</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Know an AI company trapped by the compliance paradox? Introduce them to us. You earn 50% of all revenue generated from your referral. No cap. No limits.
          </p>
          <Button variant="heroOutline" asChild>
            <Link to="/partner">Become a Revenue Partner</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BusinessModel;
