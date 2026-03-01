import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface BreakdownItem {
  score: number;
  max: number;
  label: string;
}

interface Props {
  breakdown: Record<string, BreakdownItem>;
}

const ScoreBreakdown = ({ breakdown }: Props) => (
  <Card className="border-glow bg-card/80">
    <CardHeader className="pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        Per-Article Breakdown
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {Object.entries(breakdown).map(([article, info]) => (
        <div key={article} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-foreground font-medium">{article}: {info.label}</span>
            <span className="text-muted-foreground">{info.score}/{info.max}</span>
          </div>
          <Progress value={(info.score / info.max) * 100} className="h-1.5" />
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ScoreBreakdown;
