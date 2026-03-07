import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import apexLogo from "@/assets/apex-logo.png";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Pillars", href: "#pillars" },
  { label: "Demo", href: "#demo" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setOpen(false);
    if (isRoute) {
      navigate(href);
    } else if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + href);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl">
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16 px-4">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight justify-self-center bg-transparent border-none cursor-pointer"
          >
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-gold-gradient">DIGITAL</span>
            <span className="text-chrome-gradient hidden lg:inline">GALLOWS</span>
          </button>

          <div className="justify-self-end flex items-center gap-2">
            {user ? (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4 mr-1" />Dashboard
              </Button>
            ) : (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-1" />Login
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => handleNavClick("#contact")}>
              Get Started
            </Button>
          </div>
        </div>

        <div className="md:hidden relative flex items-center h-16 px-4">
          <button
            onClick={() => handleNavClick("#top")}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-sm font-bold text-gold-gradient">DIGITAL GALLOWS</span>
          </button>

          <button className="ml-auto text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block text-sm text-muted-foreground hover:text-primary w-full text-left bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <Button variant="heroOutline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/dashboard"); }}>
              Dashboard
            </Button>
          ) : (
            <Button variant="heroOutline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/auth"); }}>
              Login
            </Button>
          )}
          <Button variant="hero" size="sm" className="w-full" onClick={() => handleNavClick("#contact")}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
