import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Sword, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

const modes = [
  { id: "SHIELD", label: "SHIELD", desc: "Private verification — keep results confidential", icon: Shield },
  { id: "SWORD", label: "SWORD", desc: "Report violations to EU regulators", icon: Sword },
  { id: "JUDGE", label: "JUDGE", desc: "Set the compliance standard", icon: Scale },
];

const TrioModeSelector = ({ mode, onModeChange }: Props) => (
  <Card className="border-glow bg-card/80">
    <CardHeader className="pb-3">
      <CardTitle className="text-base">TRIO Verification Mode</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-2">
      {modes.map((m) => {
        const Icon = m.icon;
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md border text-left transition-all",
              active
                ? "border-primary bg-primary/10 shadow-gold"
                : "border-border hover:border-primary/40"
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
            <div>
              <p className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </CardContent>
  </Card>
);

export default TrioModeSelector;
