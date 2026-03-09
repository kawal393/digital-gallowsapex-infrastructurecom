import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function TriVerifiedBadge({ active }: { active: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 3 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-xs font-bold tracking-widest ${
        active
          ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <ShieldCheck className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      {active ? "APEX LATTICE ACTIVE" : "LATTICE INACTIVE"}
    </motion.div>
  );
}
