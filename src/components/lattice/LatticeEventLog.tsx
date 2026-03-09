import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

interface LatticeEvent {
  key: string;
  value: string;
  created_at: string;
}

export default function LatticeEventLog({ events }: { events: LatticeEvent[] }) {
  const parsed = events.map((e) => {
    try {
      return { ...JSON.parse(e.value), created_at: e.created_at, key: e.key };
    } catch {
      return { title: e.key, created_at: e.created_at };
    }
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        Cross-Node Event Log
      </h2>
      <ScrollArea className="h-64">
        {parsed.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No cross-node events recorded yet</p>
        ) : (
          <div className="space-y-2">
            {parsed.map((evt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  evt.severity === "critical" ? "bg-destructive" :
                  evt.severity === "warning" ? "bg-[hsl(var(--warning))]" :
                  "bg-[hsl(var(--compliant))]"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {evt.title || evt.event_type || "Event"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {evt.source_node && <span className="font-mono">{evt.source_node}</span>}
                    {evt.source_node && " · "}
                    {new Date(evt.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
