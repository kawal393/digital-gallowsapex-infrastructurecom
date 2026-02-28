import { forwardRef } from "react";
import { Github, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import apexLogo from "@/assets/apex-logo.png";

const GITHUB_URL = "https://github.com/kawal393/-apex-digital-gallows";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t border-border py-12 px-4 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 85% 52% / 0.03) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={apexLogo} alt="APEX" className="h-8 w-8 object-contain" />
              <h3 className="text-lg font-bold">
                <span className="text-gold-gradient">APEX</span>{" "}
                <span className="text-chrome-gradient">DIGITAL GALLOWS</span>
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-4">
              Privacy-preserving AI compliance for the 2026 enforcement wave. The standard the industry will be measured against.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>A division of <span className="text-foreground/80">APEX INTELLIGENCE EMPIRE</span></p>
              <p>ABN: 71 672 237 795 &nbsp;|&nbsp; ACN: 672 237 795</p>
              <p>Registered in Victoria, Australia</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-gold transition-colors flex items-center gap-2"><FileText className="h-3 w-3" /> Documentation</a></li>
              <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2"><Github className="h-3 w-3" /> GitHub</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors flex items-center gap-2"><Shield className="h-3 w-3" /> Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-gold transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Digital Gallows Technologies Pty Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Ready for August 2, 2026.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
