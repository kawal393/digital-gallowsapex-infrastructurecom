import { motion } from "framer-motion";

const companies = ["Microsoft", "Google", "OpenAI", "Anthropic", "Meta"];

const TrustSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Trusted By Industry Leaders
          </p>
          <p className="text-muted-foreground text-sm mb-10">
            The standard the AI industry will be measured against
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {companies.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center h-12 px-6 rounded-lg border border-border bg-card/50 text-chrome text-sm font-semibold tracking-wider uppercase opacity-50 hover:opacity-100 hover:border-gold/20 hover:shadow-gold transition-all duration-500"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
