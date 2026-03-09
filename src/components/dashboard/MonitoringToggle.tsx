import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { toast } from "sonner";

const MonitoringToggle = () => {
  const { user, subscription } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [scheduleId, setScheduleId] = useState<string | null>(null);

  const tier = subscription.subscribed ? (subscription.tier || "startup") : "free";
  const hasAccess = ["enterprise", "goliath"].includes(tier);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("monitoring_schedules")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setEnabled(data.enabled);
          setFrequency(data.frequency);
          setScheduleId(data.id);
        }
        setLoading(false);
      });
  }, [user]);

  const handleToggle = async (checked: boolean) => {
    if (!user) return;
    setEnabled(checked);
    try {
      if (scheduleId) {
        await supabase.from("monitoring_schedules").update({ enabled: checked }).eq("id", scheduleId);
      } else {
        const { data } = await supabase.from("monitoring_schedules").insert({
          user_id: user.id,
          enabled: checked,
          frequency,
        }).select().single();
        if (data) setScheduleId(data.id);
      }
      toast.success(checked ? "Monitoring enabled" : "Monitoring paused");
    } catch {
      toast.error("Failed to update monitoring");
    }
  };

  const handleFrequency = async (val: string) => {
    setFrequency(val);
    if (scheduleId) {
      await supabase.from("monitoring_schedules").update({ frequency: val }).eq("id", scheduleId);
    }
  };

  if (!hasAccess) {
    return (
      <Card className="border-border bg-card/50 opacity-60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Continuous Monitoring
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
          <Eye className="h-4 w-4 text-primary" />
          Continuous Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="monitoring-toggle" className="text-sm">Auto-verify compliance</Label>
          <Switch id="monitoring-toggle" checked={enabled} onCheckedChange={handleToggle} disabled={loading} />
        </div>
        {enabled && (
          <div className="flex items-center gap-3">
            <Label className="text-xs text-muted-foreground">Frequency:</Label>
            <Select value={frequency} onValueChange={handleFrequency}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringToggle;
