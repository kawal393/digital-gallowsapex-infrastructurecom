import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifyHash, verifyMerkleProof } from "@/lib/gallows-engine";
import { Search, ShieldCheck, ShieldX } from "lucide-react";

const HashVerifier = () => {
  const [inputHash, setInputHash] = useState("");
  const [result, setResult] = useState<{
    found: boolean;
    verified: boolean;
    merkleRoot: string;
    commitId?: string;
    status?: string;
    predicateId?: string;
    merkleVerified?: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  const handleVerify = async () => {
    if (!inputHash.trim()) return;
    setChecking(true);
    try {
      const res = await verifyHash(inputHash.trim());
      setResult({
        found: res.found,
        verified: res.verified,
        merkleRoot: res.merkleRoot,
        commitId: res.record?.id,
        status: res.record?.status,
        predicateId: res.record?.predicateId,
        merkleVerified: res.verified,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest flex items-center gap-2">
          <Search className="h-4 w-4" />
          Independent Hash Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs font-mono text-gallows-muted">
          Paste any commit hash, leaf hash, or proof hash to verify its inclusion in the Merkle tree.
        </p>
        <div className="flex gap-2">
          <Input
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            placeholder="Paste SHA-256 hash..."
            className="bg-gallows-bg border-gallows-border text-gallows-text font-mono text-xs focus-visible:ring-gallows-approved/50"
          />
          <Button
            onClick={handleVerify}
            disabled={checking || !inputHash.trim()}
            className="bg-gallows-bg border border-gallows-border text-gallows-text font-mono text-xs hover:bg-gallows-border shrink-0"
            variant="outline"
            size="sm"
          >
            {checking ? '...' : 'VERIFY'}
          </Button>
        </div>

        {result && (
          <div className={`p-3 rounded border space-y-2 ${
            result.found && result.merkleVerified
              ? 'border-gallows-approved/30 bg-gallows-approved/5'
              : result.found
              ? 'border-amber-400/30 bg-amber-400/5'
              : 'border-gallows-blocked/30 bg-gallows-blocked/5'
          }`}>
            {result.found ? (
              <>
                <div className="flex items-center gap-2">
                  {result.merkleVerified ? (
                    <ShieldCheck className="h-4 w-4 text-gallows-approved" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                  )}
                  <span className={`font-mono text-xs font-bold ${result.merkleVerified ? 'text-gallows-approved' : 'text-amber-400'}`}>
                    {result.merkleVerified ? 'MERKLE INCLUSION VERIFIED' : 'RECORD FOUND — AWAITING PROOF'}
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  {result.commitId && (
                    <div><span className="text-gallows-muted">Commit: </span><span className="text-gallows-text">{result.commitId}</span></div>
                  )}
                  {result.predicateId && (
                    <div><span className="text-gallows-muted">Predicate: </span><span className="text-gallows-text">{result.predicateId}</span></div>
                  )}
                  {result.status && (
                    <div>
                      <span className="text-gallows-muted">Status: </span>
                      <Badge className={`font-mono text-xs border-0 ${
                        result.status === 'APPROVED' ? 'bg-gallows-approved/15 text-gallows-approved' : 'bg-gallows-blocked/15 text-gallows-blocked'
                      }`}>{result.status}</Badge>
                    </div>
                  )}
                  <div><span className="text-gallows-muted">Current Root: </span><span className="text-gallows-text/70 break-all text-[10px]">{result.merkleRoot}</span></div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldX className="h-4 w-4 text-gallows-blocked" />
                <span className="font-mono text-xs font-bold text-gallows-blocked">
                  HASH NOT FOUND IN LEDGER
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HashVerifier;
