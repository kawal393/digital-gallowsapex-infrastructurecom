import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Props {
  siloId: string;
  siloName: string;
  currentScore: number;
}

export default function RemediationPanel({ siloId, siloName, currentScore }: Props) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-remediation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ silo_id: siloId, silo_name: siloName, current_score: currentScore, use_ai: true }),
      });
      if (resp.ok) {
        setPlan(await resp.json());
        setExpanded(true);
      }
    } catch (e) {
      console.error("Remediation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors: Record<string, string> = {
    critical: "text-destructive border-destructive bg-destructive/10",
    high: "text-yellow-500 border-yellow-500 bg-yellow-500/10",
    medium: "text-primary border-primary bg-primary/10",
    low: "text-muted-foreground border-muted bg-muted",
  };

  if (!plan) {
    return (
      <Button
        onClick={generate}
        disabled={loading}
        variant="outline"
        size="sm"
        className="text-xs border-primary/30 hover:bg-primary/10"
      >
        <Brain className="h-3 w-3 mr-1" />
        {loading ? "Generating..." : "AI Remediation Plan"}
      </Button>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs sm:text-sm">AI Remediation Plan</CardTitle>
            <Badge className={urgencyColors[plan.urgency_level] || ""}>
              {plan.urgency_level?.toUpperCase()}
            </Badge>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-destructive">{plan.current_score}%</div>
              <div className="text-[9px] text-muted-foreground uppercase">Current</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">{plan.target_score}%</div>
              <div className="text-[9px] text-muted-foreground uppercase">Target</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-foreground">{plan.estimated_days}d</div>
              <div className="text-[9px] text-muted-foreground uppercase">Timeline</div>
            </div>
          </div>

          {/* AI Analysis */}
          {plan.ai_analysis && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-[10px] uppercase text-primary font-semibold mb-1">AI Analysis</p>
              <div className="text-xs text-muted-foreground prose prose-sm max-w-none">
                <ReactMarkdown>{plan.ai_analysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Articles */}
          <div className="space-y-2">
            {plan.articles?.map((article: any) => (
              <div key={article.number} className="bg-muted/30 rounded-lg p-2.5 border border-border">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] font-mono">{article.number}</Badge>
                    <span className="text-xs font-semibold text-foreground">{article.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {article.deadline_days}d
                  </div>
                </div>
                <ul className="space-y-1">
                  {article.actions?.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                      <CheckCircle className="h-2.5 w-2.5 text-primary shrink-0 mt-0.5" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Button onClick={generate} variant="outline" size="sm" className="w-full text-xs" disabled={loading}>
            <Brain className="h-3 w-3 mr-1" /> {loading ? "Regenerating..." : "Regenerate Plan"}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
