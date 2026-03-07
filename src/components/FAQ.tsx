import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What is Proof of Sovereign Integrity (PSI)?",
    a: "PSI is an Optimistic ZKML architecture. Instead of generating expensive Zero-Knowledge proofs for every AI output, PSI assumes compliance by default and only generates targeted proofs when a regulator challenges a specific output — reducing costs by 99.9%.",
  },
  {
    q: "How is this different from traditional ZKML?",
    a: "Traditional ZKML generates a ZK proof for every single AI output, costing $1,000+ each — economically impossible at scale. PSI uses an optimistic model inspired by blockchain rollups: outputs are logged in an immutable ledger and only proven when challenged.",
  },
  {
    q: "What is the EU AI Act enforcement date?",
    a: "August 2, 2026. After this date, non-compliance can result in fines of €35 million or 7% of global turnover, whichever is higher.",
  },
  {
    q: "Do I need to disclose my model weights?",
    a: "No. PSI uses Zero-Knowledge proofs to verify compliance without ever exposing your model weights, training data, or proprietary architecture. Your IP remains completely sovereign.",
  },
  {
    q: "What EU AI Act articles does PSI cover?",
    a: "PSI provides compliance coverage for Articles 11 (Technical Documentation), 12 (Record-Keeping), 13 (Transparency), 14 (Human Oversight), and 15 (Accuracy & Robustness).",
  },
  {
    q: "Is Apex a law firm?",
    a: "No. Apex provides technical compliance tools and infrastructure. We are not a law firm and do not provide legal advice. Our tools assist with regulatory compliance — consult qualified legal counsel for legal matters.",
  },
  {
    q: "How do I get started?",
    a: "Request a Compliance Consultation via our contact form. We'll assess your AI systems and present a tailored PSI deployment plan.",
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
