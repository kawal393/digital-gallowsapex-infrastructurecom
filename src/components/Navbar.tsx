import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl">
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16 px-4">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#top" className="flex items-center gap-2.5 text-base font-bold tracking-tight justify-self-center">
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-gold-gradient">APEX</span>
            <span className="text-chrome-gradient hidden lg:inline">DIGITAL GALLOWS</span>
          </a>

          <div className="justify-self-end">
            <Button variant="hero" size="sm" asChild>
              <a href="#contact">Request Demo</a>
            </Button>
          </div>
        </div>

        <div className="md:hidden relative flex items-center h-16 px-4">
          <a href="#top" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-sm font-bold text-gold-gradient">APEX</span>
          </a>

          <button className="ml-auto text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-gold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" className="w-full" asChild>
            <a href="#contact" onClick={() => setOpen(false)}>Request Demo</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
