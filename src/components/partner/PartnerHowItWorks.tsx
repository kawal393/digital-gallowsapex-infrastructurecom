import { UserPlus, Share2, DollarSign } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up", desc: "Create your free account and activate your partnership in one click." },
  { icon: Share2, title: "Share Your Link", desc: "Get a unique referral link. Share it with your network, audience, or clients." },
  { icon: DollarSign, title: "Earn 50%", desc: "Every paying customer you refer earns you 50% commission. No cap, no limits." },
];

const PartnerHowItWorks = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        How It <span className="text-gold-gradient">Works</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center p-6 rounded-xl border border-border bg-card/60 hover:border-primary/40 transition-colors">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <s.icon className="h-7 w-7 text-primary" />
            </div>
            <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerHowItWorks;
