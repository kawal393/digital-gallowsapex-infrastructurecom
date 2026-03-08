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
import type { GallowsResult } from "@/lib/gallows-engine";

interface AuditTrailLogProps {
  entries: GallowsResult[];
}

const AuditTrailLog = ({ entries }: AuditTrailLogProps) => {
  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest">
          Audit Trail Log ({entries.length} entries)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-gallows-muted font-mono text-sm text-center py-6">No entries yet. Execute a compliance check to begin.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gallows-border hover:bg-transparent">
                <TableHead className="font-mono text-xs text-gallows-muted">Timestamp</TableHead>
                <TableHead className="font-mono text-xs text-gallows-muted">Action</TableHead>
                <TableHead className="font-mono text-xs text-gallows-muted">Predicate</TableHead>
                <TableHead className="font-mono text-xs text-gallows-muted">Status</TableHead>
                <TableHead className="font-mono text-xs text-gallows-muted">Audit Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, i) => (
                <TableRow key={i} className="border-gallows-border hover:bg-gallows-bg/50">
                  <TableCell className="font-mono text-xs text-gallows-text whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gallows-text max-w-[200px] truncate">
                    {entry.actionSummary}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gallows-muted">
                    {entry.predicateId}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`font-mono text-xs border-0 ${
                        entry.status === 'APPROVED'
                          ? 'bg-gallows-approved/15 text-gallows-approved'
                          : 'bg-gallows-blocked/15 text-gallows-blocked'
                      }`}
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gallows-muted max-w-[180px] truncate">
                    {entry.auditHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTrailLog;
