import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        const el = document.getElementById(href.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2 text-base font-bold tracking-tight bg-transparent border-none cursor-pointer shrink-0"
          >
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-gold-gradient">DIGITAL</span>
            <span className="text-chrome-gradient">GALLOWS</span>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.isRoute)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
            {user ? (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                {t("nav.dashboard")}
              </Button>
            ) : (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-1.5" />
                {t("nav.login")}
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => handleNavClick("#contact")}>
              {t("nav.getStarted")}
            </Button>
          </div>
        </div>

        {/* Tablet (md but not lg) */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16 gap-4">
          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer shrink-0"
          >
            <img src={apexLogo} alt="APEX" className="h-7 w-7 object-contain glow-gold" />
            <span className="text-sm font-bold text-gold-gradient">DIGITAL GALLOWS</span>
          </button>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            {user ? (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="heroOutline" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4" />
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => handleNavClick("#contact")}>
              {t("nav.getStarted")}
            </Button>
            <button
              className="ml-1 text-foreground bg-transparent border-none cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between h-14">
          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
          >
            <img src={apexLogo} alt="APEX" className="h-7 w-7 object-contain glow-gold" />
            <span className="text-sm font-bold text-gold-gradient">DIGITAL GALLOWS</span>
          </button>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              className="text-foreground bg-transparent border-none cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu for tablet + mobile */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto max-w-6xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.isRoute)}
                className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-border/50 space-y-2">
              {user ? (
                <Button variant="heroOutline" size="sm" className="w-full justify-center" onClick={() => { setOpen(false); navigate("/dashboard"); }}>
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  {t("nav.dashboard")}
                </Button>
              ) : (
                <Button variant="heroOutline" size="sm" className="w-full justify-center" onClick={() => { setOpen(false); navigate("/auth"); }}>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  {t("nav.login")}
                </Button>
              )}
              <Button variant="hero" size="sm" className="w-full justify-center" onClick={() => handleNavClick("#contact")}>
                {t("nav.getStarted")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
