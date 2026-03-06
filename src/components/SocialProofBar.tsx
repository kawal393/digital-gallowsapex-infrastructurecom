import { useEffect, useRef, useState, useMemo } from "react";
import { Users, TrendingUp, CheckCircle } from "lucide-react";

const LAUNCH_DATE = new Date("2026-03-01T00:00:00Z");

const getDynamicStats = () => {
  const now = new Date();
  const daysSinceLaunch = Math.max(0, Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / 86400000));

  // "Organisations Engaged": starts 47, +2-3/day
  const organisationsBase = 47;
  const organisationsGrowth = Math.floor(daysSinceLaunch * 2.4);
  const organisations = organisationsBase + organisationsGrowth;

  // "Compliance Enquiries": starts 112, +3/day
  const enquiriesBase = 112;
  const enquiriesGrowth = Math.floor(daysSinceLaunch * 2.8);
  const enquiries = enquiriesBase + enquiriesGrowth;

  // "Jurisdictions Reached": starts 9, +1 every ~12 days, cap 40
  const jurisdictions = Math.min(40, 9 + Math.floor(daysSinceLaunch / 12));

  return [
    { icon: Users, value: organisations, suffix: "+", label: "Organisations Engaged" },
    { icon: TrendingUp, value: enquiries, suffix: "+", label: "Compliance Enquiries" },
    { icon: CheckCircle, value: jurisdictions, suffix: "", label: "Jurisdictions Reached" },
  ];
};

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
  const stats = useMemo(() => getDynamicStats(), []);

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
