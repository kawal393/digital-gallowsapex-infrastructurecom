import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Palette, Globe, Save, Eye, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface WhiteLabelConfig {
  brand_name: string;
  primary_color: string;
  accent_color: string;
  logo_url: string;
  custom_domain: string;
  tagline: string;
}

const DEFAULT_CONFIG: WhiteLabelConfig = {
  brand_name: "",
  primary_color: "#D4AF37",
  accent_color: "#1a1a2e",
  logo_url: "",
  custom_domain: "",
  tagline: "AI Compliance Platform",
};

const STORAGE_KEY = "apex_whitelabel_config";

export default function WhiteLabelSettings() {
  const [config, setConfig] = useState<WhiteLabelConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
    } catch { return DEFAULT_CONFIG; }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    toast.success("White-label configuration saved");
  };

  const embedCode = `<!-- APEX White-Label Widget -->
<iframe 
  src="${window.location.origin}/embed/pulse/__SILO_ID__?brand=${encodeURIComponent(config.brand_name)}&color=${encodeURIComponent(config.primary_color)}&tagline=${encodeURIComponent(config.tagline)}"
  width="100%" 
  height="400" 
  frameborder="0" 
  style="border-radius: 12px; border: 1px solid ${config.primary_color}20;"
></iframe>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Embed code copied");
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">White-Label Portal</CardTitle>
            <Badge variant="outline" className="text-[10px]">PARTNER</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand Name</label>
              <Input
                value={config.brand_name}
                onChange={e => setConfig(c => ({ ...c, brand_name: e.target.value }))}
                placeholder="Your Company"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tagline</label>
              <Input
                value={config.tagline}
                onChange={e => setConfig(c => ({ ...c, tagline: e.target.value }))}
                placeholder="AI Compliance Platform"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.primary_color}
                  onChange={e => setConfig(c => ({ ...c, primary_color: e.target.value }))}
                  className="h-9 w-12 rounded border border-border cursor-pointer"
                />
                <Input
                  value={config.primary_color}
                  onChange={e => setConfig(c => ({ ...c, primary_color: e.target.value }))}
                  className="h-9 text-sm font-mono flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.accent_color}
                  onChange={e => setConfig(c => ({ ...c, accent_color: e.target.value }))}
                  className="h-9 w-12 rounded border border-border cursor-pointer"
                />
                <Input
                  value={config.accent_color}
                  onChange={e => setConfig(c => ({ ...c, accent_color: e.target.value }))}
                  className="h-9 text-sm font-mono flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Logo URL</label>
              <Input
                value={config.logo_url}
                onChange={e => setConfig(c => ({ ...c, logo_url: e.target.value }))}
                placeholder="https://your-domain.com/logo.png"
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Custom Domain</label>
              <div className="flex items-center gap-1">
                <Input
                  value={config.custom_domain}
                  onChange={e => setConfig(c => ({ ...c, custom_domain: e.target.value }))}
                  placeholder="compliance.yourcompany.com"
                  className="h-9 text-sm"
                />
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={save} size="sm" className="text-xs">
              <Save className="h-3 w-3 mr-1" /> Save Config
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm" className="text-xs">
              <Eye className="h-3 w-3 mr-1" /> {showPreview ? "Hide" : "Show"} Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      {showPreview && (
        <Card style={{ borderColor: `${config.primary_color}40` }}>
          <CardContent className="pt-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: config.accent_color }}>
              <div className="flex items-center gap-2 mb-3">
                {config.logo_url ? (
                  <img src={config.logo_url} alt="" className="h-8 w-8 rounded" />
                ) : (
                  <div className="h-8 w-8 rounded" style={{ backgroundColor: config.primary_color }} />
                )}
                <div>
                  <p className="text-sm font-bold" style={{ color: config.primary_color }}>
                    {config.brand_name || "Your Brand"}
                  </p>
                  <p className="text-[10px]" style={{ color: `${config.primary_color}99` }}>
                    {config.tagline}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Compliance Score", "Active Systems", "Risk Level"].map(label => (
                  <div key={label} className="rounded-lg p-2 text-center" style={{ backgroundColor: `${config.primary_color}15` }}>
                    <div className="text-sm font-bold" style={{ color: config.primary_color }}>
                      {label === "Compliance Score" ? "87%" : label === "Active Systems" ? "12" : "Low"}
                    </div>
                    <div className="text-[8px]" style={{ color: `${config.primary_color}80` }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Embed Code */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs">Embed Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted rounded-lg p-3 text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
            {embedCode}
          </pre>
          <Button onClick={copyEmbed} variant="outline" size="sm" className="mt-2 text-xs">
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied!" : "Copy Embed Code"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
