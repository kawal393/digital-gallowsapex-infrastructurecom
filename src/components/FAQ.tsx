import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What is the EU AI Act and when does it take effect?",
    a: "The EU AI Act is the world's first comprehensive AI regulation. Key provisions for high-risk AI systems become enforceable on August 2, 2026. Non-compliance can result in fines up to €35 million or 7% of global turnover.",
  },
  {
    q: "How does zero-knowledge verification work?",
    a: "Our ZK proof system allows you to prove your AI model complies with specific articles of the EU AI Act without ever revealing your model weights, training data, or proprietary architectures. The proof is mathematically verifiable by regulators.",
  },
  {
    q: "What is Multi-Party Computation (MPC)?",
    a: "MPC allows multiple parties to jointly compute a function over their inputs while keeping those inputs private. We use this to verify compliance properties of your AI model without any single party seeing the full model.",
  },
  {
    q: "Do I need to share my model weights?",
    a: "No. That's the entire point of APEX DIGITAL GALLOWS. Your model weights stay 100% private. We verify compliance through cryptographic proofs — not by accessing your model.",
  },
  {
    q: "What happens if my model fails verification?",
    a: "In SHIELD mode, you receive a private report with specific remediation steps. Your failure is never public. In SWORD mode, failures are reported to the EU AI Office via our whistleblower mechanism.",
  },
  {
    q: "Is this legally binding?",
    a: "JUDGE mode rulings create canonical interpretations of the EU AI Act that can be cited as legal precedent. SHIELD and SWORD certifications provide compliance evidence for regulatory audits.",
  },
];

const FAQ = () => {
  return (
    <section className="relative py-24 px-4 bg-dark-gradient">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-lg border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-foreground text-left text-sm font-semibold hover:text-gold transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
