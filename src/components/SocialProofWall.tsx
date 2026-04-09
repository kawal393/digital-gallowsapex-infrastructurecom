import { motion } from "framer-motion";
import { Quote, ExternalLink, Sparkles, Linkedin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProofEntry {
  id: string;
  quote: string;
  author_name: string;
  author_title: string | null;
  author_affiliation: string | null;
  source_url: string | null;
  source_type: string;
  featured: boolean;
}

const sourceColors: Record<string, string> = {
  linkedin: "bg-psi-blue/10 text-psi-blue border-psi-blue/20",
  citation: "bg-gold/10 text-gold border-gold/20",
  commentary: "bg-compliant/10 text-compliant border-compliant/20",
  ietf: "bg-primary/10 text-primary border-primary/20",
};

const SocialProofWall = () => {
  const [entries, setEntries] = useState<ProofEntry[]>([]);

  useEffect(() => {
    const fetchProof = async () => {
      const { data } = await supabase
        .from("social_proof")
        .select("*")
        .eq("approved", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(18);
      if (data) {
        setEntries(data as ProofEntry[]);
      }
    };
    fetchProof();
  }, []);

  if (entries.length === 0) return null;

  const featuredEntries = entries.filter((e) => e.featured);
  const regularEntries = entries.filter((e) => !e.featured);

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
            Real engagement from researchers, governance leaders, and compliance architects worldwide
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Linkedin className="h-4 w-4 text-psi-blue" />
            <span className="text-xs text-muted-foreground font-mono">Verified LinkedIn Mentions</span>
          </div>
        </motion.div>

        {/* Featured testimonials - larger cards */}
        {featuredEntries.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {featuredEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-card/80 border border-gold/20 rounded-xl p-6 hover:border-gold/40 hover:shadow-gold transition-all duration-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Quote className="h-5 w-5 text-gold/40" />
                  <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
                  <MessageCircle className="h-3.5 w-3.5 text-gold/30" />
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-4 italic">
                  "{entry.quote}"
                </p>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-foreground font-semibold text-sm">
                      {entry.author_name}
                    </p>
                    {entry.author_title && (
                      <p className="text-muted-foreground text-xs">{entry.author_title}</p>
                    )}
                    {entry.author_affiliation && (
                      <p className="text-muted-foreground text-xs">{entry.author_affiliation}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${sourceColors[entry.source_type] || sourceColors.commentary}`}>
                    {entry.source_type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Regular testimonials - 3 column grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {regularEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-card/60 border border-border rounded-xl p-5 hover:border-gold/20 hover:shadow-gold transition-all duration-500"
            >
              <Quote className="h-4 w-4 text-gold/20 mb-2" />
              <p className="text-foreground/80 text-xs leading-relaxed mb-3 italic">
                "{entry.quote}"
              </p>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-foreground font-semibold text-xs">{entry.author_name}</p>
                  {entry.author_title && (
                    <p className="text-muted-foreground text-[10px]">{entry.author_title}</p>
                  )}
                </div>
                <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${sourceColors[entry.source_type] || sourceColors.commentary}`}>
                  {entry.source_type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofWall;
