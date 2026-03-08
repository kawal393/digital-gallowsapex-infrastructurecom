import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CommitRecord } from "@/lib/gallows-engine";
import { FileText } from "lucide-react";

interface AuditTrailLogProps {
  entries: CommitRecord[];
}

const phaseStyle: Record<string, string> = {
  COMMITTED: 'bg-amber-400/15 text-amber-400',
  CHALLENGED: 'bg-gallows-blocked/15 text-gallows-blocked',
  VERIFIED: 'bg-gallows-approved/15 text-gallows-approved',
  PAUSED: 'bg-gallows-blocked/15 text-gallows-blocked',
};

const AuditTrailLog = ({ entries }: AuditTrailLogProps) => {
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      engine: 'APEX Digital Gallows v2.0',
      algorithm: 'SHA-256',
      merkleOrdering: 'canonical',
      totalEntries: entries.length,
      entries: entries.map(e => ({
        id: e.id,
        action: e.action,
        predicateId: e.predicateId,
        phase: e.phase,
        status: e.status,
        commitHash: e.commitHash,
        merkleLeafHash: e.merkleLeafHash,
        challengeHash: e.challengeHash,
        proofHash: e.proofHash,
        merkleRoot: e.merkleRoot,
        merkleProof: e.merkleProof,
        timestamp: e.timestamp,
        challengedAt: e.challengedAt,
        provenAt: e.provenAt,
        verificationTimeMs: e.verificationTimeMs,
        violationFound: e.violationFound,
      })),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-gallows-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest">
            Immutable Audit Trail ({entries.length} entries)
          </CardTitle>
          {entries.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs font-mono text-gallows-muted hover:text-gallows-approved transition-colors bg-transparent border border-gallows-border rounded px-2 py-1 cursor-pointer"
            >
              <FileText className="h-3 w-3" />
              EXPORT JSON
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-gallows-muted font-mono text-sm text-center py-6">
            No entries yet. Commit an action to begin building the immutable ledger.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gallows-border hover:bg-transparent">
                  <TableHead className="font-mono text-xs text-gallows-muted">Commit ID</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Timestamp</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Action</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Predicate</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Phase</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Status</TableHead>
                  <TableHead className="font-mono text-xs text-gallows-muted">Commit Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="border-gallows-border hover:bg-gallows-bg/50">
                    <TableCell className="font-mono text-xs text-gallows-approved whitespace-nowrap font-bold">
                      {entry.id}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gallows-text whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gallows-text max-w-[180px] truncate">
                      {entry.action}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gallows-muted whitespace-nowrap">
                      {entry.predicateId}
                    </TableCell>
                    <TableCell>
                      <Badge className={`font-mono text-xs border-0 ${phaseStyle[entry.phase] || phaseStyle.COMMITTED}`}>
                        {entry.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.status ? (
                        <Badge className={`font-mono text-xs border-0 ${
                          entry.status === 'APPROVED'
                            ? 'bg-gallows-approved/15 text-gallows-approved'
                            : 'bg-gallows-blocked/15 text-gallows-blocked'
                        }`}>
                          {entry.status}
                        </Badge>
                      ) : (
                        <span className="text-xs font-mono text-gallows-muted">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-gallows-muted max-w-[140px] truncate" title={entry.commitHash}>
                      {entry.commitHash.substring(0, 20)}…
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTrailLog;
