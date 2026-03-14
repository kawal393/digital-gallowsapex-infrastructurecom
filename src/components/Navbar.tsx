import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LayoutDashboard, ChevronDown, Hash, Globe, Shield, Award, Code, Layers, FileText, Bot, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import apexLogo from "@/assets/apex-logo.png";

const infraLinks = [
  { label: "Verified Registry", href: "/registry", icon: Shield, desc: "Public verified entity ledger" },
  { label: "Verify Hash", href: "/verify", icon: Hash, desc: "Public SHA-256 verification" },
  { label: "Regulation Map", href: "/regulations", icon: Globe, desc: "AI laws in 25+ countries" },
  { label: "Free Score", href: "/assess", icon: Shield, desc: "Compliance in 2 minutes" },
  { label: "Trust Badge", href: "/badge", icon: Award, desc: "Embeddable PSI badge" },
  { label: "Submission Kit", href: "/submission-kit", icon: FileText, desc: "CEN-CENELEC regulatory package" },
  { label: "SDK", href: "/sdk", icon: Code, desc: "Developer integration" },
  { label: "Architecture", href: "/architecture", icon: Layers, desc: "Technical deep-dive" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [infraOpen, setInfraOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const infraRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);

  const navLinks = [
    { label: "Engine", href: "/gallows", isRoute: true },
    { label: "Verify Portal", href: "/verify", isRoute: true },
    { label: "LDSL Specs", href: "/protocol", isRoute: true },
    { label: "Open Source", href: "https://github.com/apex-digital-gallows", isRoute: false, external: true },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (infraRef.current && !infraRef.current.contains(e.target as Node)) {
        setInfraOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setOpen(false);
    setInfraOpen(false);
    if (isRoute) {
      navigate(href);
    } else if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        const el = document.getElementById(href.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (href === "#top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between h-16 gap-6">
          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2 text-base font-bold tracking-tight bg-transparent border-none cursor-pointer shrink-0"
          >
            <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain glow-gold" />
            <span className="text-gold-gradient">APEX</span>
            <span className="text-chrome-gradient">PSI</span>
          </button>

          <div className="flex items-center gap-1">
            {navLinks.map((link) =>
              (link as any).external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              )
            )}

            {/* Infrastructure Dropdown */}
            <div ref={infraRef} className="relative">
              <button
                onClick={() => setInfraOpen(!infraOpen)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                Infrastructure
                <ChevronDown className={`h-3 w-3 transition-transform ${infraOpen ? "rotate-180" : ""}`} />
              </button>
              {infraOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-border bg-background/95 backdrop-blur-xl shadow-xl py-2 z-50">
                  {infraLinks.map((tool) => (
                    <button
                      key={tool.label}
                      onClick={() => handleNavClick(tool.href, true)}
                      className="w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-muted/50 transition-colors bg-transparent border-none cursor-pointer group"
                    >
                      <tool.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{tool.label}</p>
                        <p className="text-[11px] text-muted-foreground">{tool.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <LanguageSelector />
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="border-gold/40 text-gold hover:bg-gold/10">
                <Bot className="h-4 w-4 mr-1.5" />
                Admin
              </Button>
            )}
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

        {/* Tablet */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16 gap-4">
          <button
            onClick={() => handleNavClick("#top")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer shrink-0"
          >
            <img src={apexLogo} alt="APEX" className="h-7 w-7 object-contain glow-gold" />
            <span className="text-sm font-bold text-gold-gradient">APEX PSI</span>
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
            <span className="text-sm font-bold text-gold-gradient">APEX PSI</span>
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
            {navLinks.map((link) =>
              (link as any).external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors flex items-center gap-1"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors bg-transparent border-none cursor-pointer"
                >
                  {link.label}
                </button>
              )
            )}
            <div className="pt-2 pb-1">
              <p className="px-3 text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Infrastructure</p>
            </div>
            {infraLinks.map((tool) => (
              <button
                key={tool.label}
                onClick={() => handleNavClick(tool.href, true)}
                className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
              >
                <tool.icon className="h-3.5 w-3.5 text-primary" />
                {tool.label}
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
