import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import apexLogo from "@/assets/apex-logo.png";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
        <a href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight group">
          <img src={apexLogo} alt="APEX" className="h-9 w-9 object-contain glow-gold" />
          <span>
            <span className="text-gold-gradient">APEX</span>{" "}
            <span className="text-chrome-gradient">DIGITAL GALLOWS</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" asChild>
            <a href="#contact">Request Demo</a>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="block text-sm text-muted-foreground hover:text-gold" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Button variant="hero" size="sm" className="w-full" asChild>
            <a href="#contact">Request Demo</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
