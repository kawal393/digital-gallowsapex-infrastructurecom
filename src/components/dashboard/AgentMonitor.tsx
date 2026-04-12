import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Bot, Shield, AlertTriangle, CheckCircle, Clock, Zap, Network } from "lucide-react";

interface AgentAction {
  id: string;
  agentId: string;
  action: string;
  predicateId: string;
  status: "pending" | "verified" | "blocked" | "in_progress";
  latencyMs: number;
  timestamp: string;
  chainDepth: number;
}

interface AgentNode {
  id: string;
  name: string;
  type: "orchestrator" | "executor" | "tool" | "retriever";
  status: "active" | "paused" | "blocked";
  actionsProcessed: number;
  complianceRate: number;
  avgLatencyMs: number;
}

const MOCK_AGENTS: AgentNode[] = [
  { id: "orch-1", name: "Planning Agent", type: "orchestrator", status: "active", actionsProcessed: 1247, complianceRate: 99.8, avgLatencyMs: 3.2 },
  { id: "exec-1", name: "Execution Agent", type: "executor", status: "active", actionsProcessed: 3891, complianceRate: 99.6, avgLatencyMs: 4.1 },
  { id: "tool-1", name: "Tool Call Agent", type: "tool", status: "active", actionsProcessed: 892, complianceRate: 100, avgLatencyMs: 1.8 },
  { id: "ret-1", name: "RAG Retriever", type: "retriever", status: "paused", actionsProcessed: 2104, complianceRate: 99.9, avgLatencyMs: 2.5 },
];

const typeColors: Record<string, string> = {
  orchestrator: "bg-primary/15 text-primary border-primary/30",
  executor: "bg-amber-500/15 text-amber-400 border-amber-400/30",
  tool: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  retriever: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />,
  paused: <Clock className="h-3.5 w-3.5 text-amber-400" />,
  blocked: <AlertTriangle className="h-3.5 w-3.5 text-destructive" />,
};

const AgentMonitor = () => {
  const [agents, setAgents] = useState<AgentNode[]>(MOCK_AGENTS);
  const [recentActions, setRecentActions] = useState<AgentAction[]>([]);
  const [totalIntercepted, setTotalIntercepted] = useState(0);
  const [isLive, setIsLive] = useState(true);

  const simulateAction = useCallback(() => {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const predicates = ["EU_ART_14", "EU_ART_50", "CO_AI_DISCLOSURE", "CA_ADT_NOTICE", "ISO_42001_RISK", "NIST_GOVERN"];
    const actions = [
      "Generate financial advice response",
      "Execute tool: search_database",
      "Retrieve context for user query",
      "Plan multi-step reasoning chain",
      "Generate content for social media",
      "Process automated decision request",
    ];
    const statuses: AgentAction["status"][] = ["verified", "verified", "verified", "verified", "blocked", "verified"];

    const action: AgentAction = {
      id: crypto.randomUUID().substring(0, 8),
      agentId: agent.id,
      action: actions[Math.floor(Math.random() * actions.length)],
      predicateId: predicates[Math.floor(Math.random() * predicates.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      latencyMs: Math.round((Math.random() * 8 + 1) * 10) / 10,
      timestamp: new Date().toISOString(),
      chainDepth: Math.floor(Math.random() * 5) + 1,
    };

    setRecentActions((prev) => [action, ...prev].slice(0, 12));
    setTotalIntercepted((prev) => prev + 1);
  }, [agents]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(simulateAction, 2500);
    return () => clearInterval(interval);
  }, [isLive, simulateAction]);

  const blockedCount = recentActions.filter((a) => a.status === "blocked").length;
  const avgLatency = recentActions.length > 0
    ? (recentActions.reduce((sum, a) => sum + a.latencyMs, 0) / recentActions.length).toFixed(1)
    : "0.0";

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
            <Bot className="h-4 w-4" />
            Agentic AI Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`font-mono text-[10px] ${isLive ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/30" : "bg-muted text-muted-foreground border-border"}`}>
              {isLive ? "● LIVE" : "○ PAUSED"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsLive(!isLive)} className="h-6 px-2 text-xs font-mono">
              {isLive ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded border border-border p-2.5 text-center">
            <div className="text-lg font-bold font-mono text-foreground">{totalIntercepted}</div>
            <div className="text-[10px] font-mono text-muted-foreground">INTERCEPTED</div>
          </div>
          <div className="rounded border border-border p-2.5 text-center">
            <div className="text-lg font-bold font-mono text-destructive">{blockedCount}</div>
            <div className="text-[10px] font-mono text-muted-foreground">BLOCKED</div>
          </div>
          <div className="rounded border border-border p-2.5 text-center">
            <div className="text-lg font-bold font-mono text-primary">{avgLatency}ms</div>
            <div className="text-[10px] font-mono text-muted-foreground">AVG LATENCY</div>
          </div>
        </div>

        {/* Agent nodes */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Agent Nodes</div>
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2 rounded border border-border p-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {statusIcons[agent.status]}
                <span className="font-mono text-xs text-foreground truncate">{agent.name}</span>
              </div>
              <Badge className={`font-mono text-[9px] border ${typeColors[agent.type]} px-1.5 py-0 shrink-0`}>
                {agent.type}
              </Badge>
              <div className="text-[10px] font-mono text-muted-foreground shrink-0 w-16 text-right">
                {agent.complianceRate}%
              </div>
              <Progress value={agent.complianceRate} className="w-12 h-1.5 shrink-0" />
            </div>
          ))}
        </div>

        {/* Recent actions stream */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live Action Stream</div>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center gap-2 text-[10px] font-mono py-1 border-b border-border/30">
                {action.status === "blocked" ? (
                  <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
                ) : (
                  <Shield className="h-3 w-3 text-emerald-400 shrink-0" />
                )}
                <span className="text-muted-foreground truncate flex-1">{action.action}</span>
                <Badge className={`text-[8px] px-1 py-0 ${action.status === "blocked" ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-400/20"}`}>
                  {action.predicateId}
                </Badge>
                <span className="text-muted-foreground shrink-0">{action.latencyMs}ms</span>
              </div>
            ))}
            {recentActions.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-xs">
                Waiting for agent actions...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMonitor;
