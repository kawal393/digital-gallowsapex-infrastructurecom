import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];

const FAQ = () => {
  const { t } = useTranslation();

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
            {t("faq.badge")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("faq.headline")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqKeys.map((key, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-lg border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-foreground text-left text-sm font-semibold hover:text-gold transition-colors">
                  {t(`faq.${key}`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {t(`faq.a${key.slice(1)}`)}
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