import { motion } from "framer-motion";
import { Quote, ExternalLink, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProofEntry {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_affiliation: string;
  source_url: string;
  source_type: string;
}

// No fake fallback entries — only real, approved DB entries are shown

const sourceColors: Record<string, string> = {
  linkedin: "bg-psi-blue/10 text-psi-blue border-psi-blue/20",
  citation: "bg-gold/10 text-gold border-gold/20",
  commentary: "bg-compliant/10 text-compliant border-compliant/20",
  ietf: "bg-primary/10 text-primary border-primary/20",
};

const SocialProofWall = () => {
  const [entries, setEntries] = useState<ProofEntry[]>(fallbackEntries);

  useEffect(() => {
    const fetchProof = async () => {
      const { data } = await supabase
        .from("social_proof")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data && data.length > 0) {
        setEntries(data as ProofEntry[]);
      }
    };
    fetchProof();
  }, []);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="text-gold font-semibold tracking-widest uppercase text-sm">
              Industry Signals
            </p>
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            The Industry Is Watching
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Researchers, architects, and governance leaders engaging with PSI Protocol
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-card/80 border border-border rounded-xl p-6 hover:border-gold/20 hover:shadow-gold transition-all duration-500"
            >
              <Quote className="h-5 w-5 text-gold/30 mb-3" />
              <p className="text-foreground/90 text-sm leading-relaxed mb-4 italic">
                "{entry.quote}"
              </p>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-foreground font-semibold text-sm">
                    {entry.author_name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {entry.author_title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {entry.author_affiliation}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${sourceColors[entry.source_type] || sourceColors.commentary}`}
                  >
                    {entry.source_type}
                  </span>
                  {entry.source_url && (
                    <a
                      href={entry.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-gold transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofWall;
