import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What is the Digital Gallows?",
    a: "APEX DIGITAL GALLOWS is a privacy-preserving compliance verification platform for the EU AI Act 2026. We verify AI model compliance without requiring disclosure of proprietary model weights.",
  },
  {
    q: "How is this different from traditional compliance audits?",
    a: "Traditional audits require full model disclosure. Our MPC (Multi-Party Computation) and ZK (Zero-Knowledge Proof) technology verifies compliance while keeping your AI's 'brain' completely secret.",
  },
  {
    q: "What is the EU AI Act enforcement date?",
    a: "August 2, 2026. After this date, non-compliance can result in fines of €35 million or 7% of global turnover, whichever is higher.",
  },
  {
    q: "What does SHIELD mode do?",
    a: "SHIELD mode provides private compliance verification. Your audit logs stay internal, and MPC ensures your model weights never leave your infrastructure.",
  },
  {
    q: "What does SWORD mode do?",
    a: "SWORD mode publishes compliance status to a public ledger visible to regulators. If violations are detected, the Whistleblower Hook automatically alerts the EU AI Office.",
  },
  {
    q: "What does JUDGE mode do?",
    a: "JUDGE mode allows you to issue binding compliance interpretations that become legal precedent. Courts and regulators cite your rulings as the standard.",
  },
  {
    q: "Do I need to disclose my model weights?",
    a: "No. Our MPC and ZK technology verifies compliance without ever seeing your model weights. You maintain 100% IP protection.",
  },
  {
    q: "How do I get started?",
    a: "Request a demo or choose a pricing tier. We'll set up your compliance infrastructure within 48 hours.",
  },
];

const FAQ = () => {
  return (
    <section className="relative py-24 px-4 bg-dark-gradient" id="faq">
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
