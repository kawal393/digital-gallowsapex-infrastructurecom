import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CommitRecord } from "@/lib/gallows-engine";
import { Swords, Scale, ShieldCheck, ArrowRight, Clock } from "lucide-react";

interface PipelineViewProps {
  record: CommitRecord | null;
  onChallenge: (commitId: string) => void;
  onProve: (commitId: string) => void;
  isProcessing: boolean;
}

const phaseColors: Record<string, string> = {
  COMMITTED: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  CHALLENGED: 'text-gallows-blocked border-gallows-blocked/30 bg-gallows-blocked/10',
  PROVING: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  VERIFIED: 'text-gallows-approved border-gallows-approved/30 bg-gallows-approved/10',
  PAUSED: 'text-gallows-blocked border-gallows-blocked/30 bg-gallows-blocked/10',
};

const PipelineView = ({ record, onChallenge, onProve, isProcessing }: PipelineViewProps) => {
  if (!record) {
    return (
      <Card className="bg-gallows-surface border-gallows-border flex items-center justify-center min-h-[280px]">
        <div className="text-center space-y-2">
          <div className="text-gallows-muted font-mono text-sm">PIPELINE IDLE</div>
          <div className="text-gallows-muted/50 font-mono text-xs">Commit an action to begin verification</div>
        </div>
      </Card>
    );
  }

  const isApproved = record.status === 'APPROVED';
  const isBlocked = record.status === 'BLOCKED';

  return (
    <Card className={`bg-gallows-surface border min-h-[280px] ${
      record.phase === 'VERIFIED'
        ? isApproved ? 'border-gallows-approved/30' : 'border-gallows-blocked/30'
        : 'border-gallows-border'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest">
            Verification Pipeline
          </CardTitle>
          <Badge className={`font-mono text-xs border ${phaseColors[record.phase] || phaseColors.COMMITTED}`}>
            {record.phase}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Commit ID */}
        <div className="p-2 bg-gallows-bg rounded border border-gallows-border">
          <span className="text-[10px] font-mono text-gallows-muted block">COMMIT ID</span>
          <span className="text-sm font-mono text-gallows-text font-bold">{record.id}</span>
        </div>

        {/* Phase Progress */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className={record.commitHash ? 'text-gallows-approved' : 'text-gallows-muted'}>COMMIT</span>
          <ArrowRight className="h-3 w-3 text-gallows-muted" />
          <span className={record.challengeHash ? 'text-gallows-approved' : 'text-gallows-muted'}>CHALLENGE</span>
          <ArrowRight className="h-3 w-3 text-gallows-muted" />
          <span className={record.proofHash ? 'text-gallows-approved' : 'text-gallows-muted'}>PROVE</span>
          <ArrowRight className="h-3 w-3 text-gallows-muted" />
          <span className={record.phase === 'VERIFIED' ? 'text-gallows-approved' : 'text-gallows-muted'}>VERIFY</span>
        </div>

        {/* Hashes */}
        <div className="space-y-2">
          <HashRow label="Commit Hash" hash={record.commitHash} />
          <HashRow label="Merkle Leaf" hash={record.merkleLeafHash} />
          {record.challengeHash && <HashRow label="Challenge Hash" hash={record.challengeHash} />}
          {record.proofHash && <HashRow label="Proof Hash" hash={record.proofHash} />}
          {record.merkleRoot && <HashRow label="Merkle Root" hash={record.merkleRoot} accent />}
        </div>

        {/* Timing */}
        {record.verificationTimeMs !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-gallows-muted">
            <Clock className="h-3 w-3" />
            {record.verificationTimeMs}ms total pipeline
          </div>
        )}

        {/* Verdict */}
        {record.phase === 'VERIFIED' && (
          <div className={`p-3 rounded border ${isApproved ? 'border-gallows-approved/30 bg-gallows-approved/5' : 'border-gallows-blocked/30 bg-gallows-blocked/5'}`}>
            <Badge className={`text-base px-4 py-1.5 font-mono font-bold tracking-wider border-0 mb-2 ${
              isApproved
                ? 'bg-gallows-approved/15 text-gallows-approved shadow-gallows-approved'
                : 'bg-gallows-blocked/15 text-gallows-blocked shadow-gallows-blocked'
            }`}>
              {isApproved ? '✓ STRUCTURALLY VERIFIED' : '✗ STRUCTURALLY BLOCKED'}
            </Badge>
            <p className={`text-xs font-mono ${isApproved ? 'text-gallows-approved' : 'text-gallows-blocked'}`}>
              {isApproved
                ? `Action verified via Merkle inclusion proof against [${record.predicateId}]. Cryptographic evidence immutably recorded.`
                : `Violation detected: "${record.violationFound}" — Action structurally blocked by locked predicate [${record.predicateId}].`
              }
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {record.phase === 'COMMITTED' && (
            <Button
              onClick={() => onChallenge(record.id)}
              disabled={isProcessing}
              className="flex-1 bg-gallows-bg border border-gallows-blocked/40 text-gallows-blocked font-mono text-xs tracking-wider hover:bg-gallows-blocked/10 gap-1.5"
              variant="outline"
              size="sm"
            >
              <Swords className="h-3.5 w-3.5" />
              CHALLENGE (Art. 50)
            </Button>
          )}
          {record.phase === 'CHALLENGED' && (
            <Button
              onClick={() => onProve(record.id)}
              disabled={isProcessing}
              className="flex-1 bg-gallows-bg border border-blue-400/40 text-blue-400 font-mono text-xs tracking-wider hover:bg-blue-400/10 gap-1.5"
              variant="outline"
              size="sm"
            >
              <Scale className="h-3.5 w-3.5" />
              GENERATE MERKLE PROOF
            </Button>
          )}
          {record.phase === 'VERIFIED' && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-gallows-approved">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pipeline complete — proof recorded
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const HashRow = ({ label, hash, accent }: { label: string; hash: string; accent?: boolean }) => (
  <div>
    <span className="text-[10px] font-mono text-gallows-muted block">{label}</span>
    <span className={`font-mono text-[11px] break-all ${accent ? 'text-amber-400' : 'text-gallows-text/80'}`}>
      {hash}
    </span>
  </div>
);

export default PipelineView;
