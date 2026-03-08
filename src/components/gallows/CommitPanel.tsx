import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PREDICATES } from "@/lib/gallows-engine";
import { Lock, ArrowRight } from "lucide-react";

interface CommitPanelProps {
  onCommit: (action: string, predicateId: string) => void;
  isProcessing: boolean;
  paused: boolean;
}

const CommitPanel = ({ onCommit, isProcessing, paused }: CommitPanelProps) => {
  const [action, setAction] = useState("");
  const [predicateId, setPredicateId] = useState("EU_ART_50");

  const handleCommit = () => {
    if (!action.trim() || paused) return;
    onCommit(action.trim(), predicateId);
  };

  const selectedPredicate = PREDICATES.find(p => p.id === predicateId);

  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-gallows-approved animate-pulse" />
          Phase 1 — Commit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-mono text-gallows-muted mb-1.5 block">AI ACTION TO VERIFY</label>
          <Textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g. Generate a transparent AI summary with full source attribution and disclosure that this content is AI-generated"
            className="bg-gallows-bg border-gallows-border text-gallows-text font-mono text-sm min-h-[100px] placeholder:text-gallows-muted/50 focus-visible:ring-gallows-approved/50 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-gallows-muted mb-1.5 block">EU AI ACT PREDICATE</label>
          <Select value={predicateId} onValueChange={setPredicateId}>
            <SelectTrigger className="bg-gallows-bg border-gallows-border text-gallows-text font-mono text-sm focus:ring-gallows-approved/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gallows-surface border-gallows-border max-h-[300px]">
              {PREDICATES.map((p) => (
                <SelectItem
                  key={p.id}
                  value={p.id}
                  className="font-mono text-xs text-gallows-text focus:bg-gallows-border focus:text-gallows-text"
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    p.riskLevel === 'UNACCEPTABLE' ? 'bg-gallows-blocked' :
                    p.riskLevel === 'HIGH' ? 'bg-amber-500' :
                    'bg-gallows-approved'
                  }`} />
                  {p.id}: {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPredicate && (
            <div className="mt-2 p-2 rounded bg-gallows-bg border border-gallows-border">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="h-3 w-3 text-gallows-muted" />
                <span className="font-mono text-[10px] text-gallows-muted uppercase tracking-wider">
                  {selectedPredicate.riskLevel} RISK — Enforceable {selectedPredicate.enforcementDate}
                </span>
              </div>
              <p className="font-mono text-[11px] text-gallows-muted leading-relaxed">
                {selectedPredicate.description}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleCommit}
          disabled={isProcessing || !action.trim() || paused}
          className="w-full bg-gallows-bg border border-gallows-approved/40 text-gallows-approved font-mono font-bold tracking-wider hover:bg-gallows-approved/10 hover:shadow-gallows-approved transition-all duration-200 disabled:opacity-40 gap-2"
        >
          {paused ? (
            'SYSTEM PAUSED'
          ) : isProcessing ? (
            'HASHING...'
          ) : (
            <>
              COMMIT TO LEDGER
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommitPanel;
