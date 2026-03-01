import { useEffect, useRef, useState } from "react";
import { Users, TrendingUp, CheckCircle } from "lucide-react";

const stats = [
  { icon: Users, value: 150, suffix: "+", label: "AI Companies Trust Us" },
  { icon: TrendingUp, value: 32, suffix: "", label: "Joined This Week" },
  { icon: CheckCircle, value: 2500, suffix: "+", label: "Compliances Verified" },
];

const useCountUp = (target: number, active: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, active]);
  return count;
};

const StatItem = ({ icon: Icon, value, suffix, label, active }: any) => {
  const count = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-5 w-5 text-primary" />
      <p className="text-2xl font-bold text-gold-gradient tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

const SocialProofBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-10 border-y border-border/50">
      <div className="container mx-auto max-w-4xl px-4 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} active={visible} />
        ))}
      </div>
    </section>
  );
};

export default SocialProofBar;
