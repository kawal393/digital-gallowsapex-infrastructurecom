import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Handshake } from "lucide-react";

const PartnerCTA = () => (
  <section className="py-16 px-4">
    <div className="container mx-auto max-w-4xl">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-8 md:p-12 text-center">
        <Handshake className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Earn <span className="text-gold-gradient">50%</span> on Every Subscription
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Join our partner program and earn half of every subscription you refer. No cap, no limits, no strings.
        </p>
        <Button variant="hero" size="lg" asChild>
          <Link to="/partner">Become a Partner</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default PartnerCTA;
