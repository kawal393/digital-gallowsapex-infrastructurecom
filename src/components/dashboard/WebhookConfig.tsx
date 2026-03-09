import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Webhook, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const WebhookConfig = () => {
  const { user, subscription } = useAuth();
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [endpointId, setEndpointId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const tier = subscription.subscribed ? (subscription.tier || "startup") : "free";
  const hasAccess = ["enterprise", "goliath"].includes(tier);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("webhook_endpoints")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setUrl(data.url);
          setSecret(data.secret);
          setEnabled(data.enabled);
          setEndpointId(data.id);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user || !url.trim()) return;
    setSaving(true);
    try {
      if (endpointId) {
        await supabase.from("webhook_endpoints").update({ url, enabled }).eq("id", endpointId);
      } else {
        const { data } = await supabase.from("webhook_endpoints").insert({
          user_id: user.id,
          url,
          enabled,
        }).select().single();
        if (data) {
          setEndpointId(data.id);
          setSecret(data.secret);
        }
      }
      toast.success("Webhook saved");
    } catch {
      toast.error("Failed to save webhook");
    } finally {
      setSaving(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasAccess) {
    return (
      <Card className="border-border bg-card/50 opacity-60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Webhook className="h-4 w-4 text-muted-foreground" />
            Webhook Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Available on Enterprise & Goliath plans.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-glow bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Webhook className="h-4 w-4 text-primary" />
          Webhook Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Endpoint URL</Label>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://your-api.com/webhook"
            className="mt-1 text-xs"
          />
        </div>
        {secret && (
          <div>
            <Label className="text-xs text-muted-foreground">Signing Secret</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={secret} readOnly className="text-xs font-mono" />
              <Button variant="ghost" size="icon" onClick={copySecret} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-compliant" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label className="text-sm">Enabled</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <Button variant="hero" size="sm" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Webhook"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
