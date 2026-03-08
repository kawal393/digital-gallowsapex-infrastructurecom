import { motion } from "framer-motion";
import { AlertTriangle, Eye, Lock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProblemSection = () => {
  const { t } = useTranslation();

  const problems = [
    { icon: Eye, titleKey: "problem.card1Title", descKey: "problem.card1Desc" },
    { icon: Lock, titleKey: "problem.card2Title", descKey: "problem.card2Desc" },
    { icon: DollarSign, titleKey: "problem.card3Title", descKey: "problem.card3Desc" },
    { icon: AlertTriangle, titleKey: "problem.card4Title", descKey: "problem.card4Desc" },
  ];

  return (
    <section className="relative py-24 px-4" id="problem">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">{t("problem.badge")}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("problem.headline")}{" "}
            <span className="text-gold-gradient">{t("problem.headlineGold")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("problem.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border bg-card/60 p-6 transition-colors ${
                i === 3
                  ? "border-gold/40 hover:border-gold/60 hover:shadow-gold"
                  : "border-border hover:border-destructive/40"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                i === 3 ? "bg-gold/10" : "bg-destructive/10"
              }`}>
                <p.icon className={`h-6 w-6 ${i === 3 ? "text-gold" : "text-destructive"}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${i === 3 ? "text-gold-gradient" : "text-foreground"}`}>{t(p.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
