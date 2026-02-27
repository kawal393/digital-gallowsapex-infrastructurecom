import { Github, FileText, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-foreground mb-2">
              <span className="text-gold">APEX</span> DIGITAL GALLOWS
            </h3>
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
              <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2"><FileText className="h-3 w-3" /> Documentation</a></li>
              <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2"><Github className="h-3 w-3" /> GitHub</a></li>
              <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2"><Shield className="h-3 w-3" /> Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Cookie Policy</a></li>
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
};

export default Footer;
