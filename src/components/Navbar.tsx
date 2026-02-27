import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
        <a href="/" className="text-lg font-bold text-foreground tracking-tight">
          <span className="text-gold">APEX</span> DIGITAL GALLOWS
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-gold transition-colors">Pricing</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">Docs</a>
          <Button variant="hero" size="sm">Request Demo</Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#pricing" className="block text-sm text-muted-foreground hover:text-gold">Pricing</a>
          <a href="#" className="block text-sm text-muted-foreground hover:text-gold">Docs</a>
          <Button variant="hero" size="sm" className="w-full">Request Demo</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
