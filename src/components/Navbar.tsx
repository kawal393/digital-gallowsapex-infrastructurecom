import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import apexLogo from "@/assets/apex-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.problem"), href: "#problem" },
    { label: t("nav.solution"), href: "#solution" },
    { label: t("nav.pillars"), href: "#pillars" },
    { label: t("nav.digitalGallows"), href: "/gallows", isRoute: true },
    { label: t("nav.architecture"), href: "/architecture", isRoute: true },
    { label: t("nav.contact"), href: "#contact" },
  ];

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
                onClick={() => handleNavClick(link.href, (link as any).isRoute)}
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
            <LanguageSelector />
            {user ? (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4 mr-1" />{t("nav.dashboard")}
              </Button>
            ) : (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-1" />{t("nav.login")}
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => handleNavClick("#contact")}>
              {t("nav.getStarted")}
            </Button>
          </div>
        </div>

        <div className="md:hidden relative flex items-center h-16 px-4">
          <LanguageSelector />
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
              onClick={() => handleNavClick(link.href, (link as any).isRoute)}
              className="block text-sm text-muted-foreground hover:text-primary w-full text-left bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <Button variant="heroOutline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/dashboard"); }}>
              {t("nav.dashboard")}
            </Button>
          ) : (
            <Button variant="heroOutline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/auth"); }}>
              {t("nav.login")}
            </Button>
          )}
          <Button variant="hero" size="sm" className="w-full" onClick={() => handleNavClick("#contact")}>
            {t("nav.getStarted")}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
