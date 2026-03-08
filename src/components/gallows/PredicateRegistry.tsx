import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PREDICATES, hashSHA256 } from "@/lib/gallows-engine";
import { Lock } from "lucide-react";

const PredicateRegistry = () => {
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    const computeHashes = async () => {
      const result: Record<string, string> = {};
      for (const p of PREDICATES) {
        result[p.id] = await hashSHA256(`${p.id}|${p.article}|${p.description}|${p.violationPatterns.join(',')}`);
      }
      setHashes(result);
    };
    computeHashes();
  }, []);

  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest">
          Predicate Registry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {PREDICATES.map((p) => (
          <div key={p.id} className="border border-gallows-border rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gallows-approved font-bold">{p.id}</span>
              <Badge className="bg-gallows-bg border border-gallows-border text-gallows-muted font-mono text-xs gap-1">
                <Lock className="h-2.5 w-2.5" />
                LOCKED
              </Badge>
            </div>
            <p className="font-mono text-xs text-gallows-text">{p.article}: {p.name}</p>
            <p className="font-mono text-[10px] text-gallows-muted break-all">
              {hashes[p.id] ? `sha256:${hashes[p.id].substring(0, 32)}...` : 'computing...'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PredicateRegistry;
