import { Upload, Lock, Award, Eye } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Submit Model",
    description: "Upload your AI model hash — no weights revealed.",
  },
  {
    icon: Lock,
    step: "02",
    title: "MPC Verification",
    description: "Our network verifies compliance in secret using multi-party computation.",
  },
  {
    icon: Award,
    step: "03",
    title: "Get Certificate",
    description: "Receive your EU AI Act compliant certificate on-chain.",
  },
  {
    icon: Eye,
    step: "04",
    title: "Stay Compliant",
    description: "Continuous monitoring for Articles 12–15 with real-time alerts.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Process
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                <s.icon className="h-7 w-7 text-gold" />
              </div>
              <span className="text-xs font-bold text-gold tracking-widest">{s.step}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
