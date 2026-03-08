import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MerkleTreeState } from "@/lib/gallows-engine";
import { GitBranch, Layers } from "lucide-react";

interface MerkleVisualizerProps {
  treeState: (MerkleTreeState & { layers: string[][] }) | null;
}

const MerkleVisualizer = ({ treeState }: MerkleVisualizerProps) => {
  if (!treeState || treeState.leaves.length === 0) {
    return (
      <Card className="bg-gallows-surface border-gallows-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Merkle Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gallows-muted font-mono text-sm text-center py-8">
            Tree empty — commit actions to build the hash tree
          </p>
        </CardContent>
      </Card>
    );
  }

  const reversedLayers = [...treeState.layers].reverse();

  return (
    <Card className="bg-gallows-surface border-gallows-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono text-gallows-muted uppercase tracking-widest flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Merkle Tree — Live State
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className="bg-gallows-bg border border-gallows-border text-gallows-muted font-mono text-xs gap-1">
              <Layers className="h-3 w-3" />
              {treeState.depth} layers
            </Badge>
            <Badge className="bg-gallows-bg border border-gallows-border text-gallows-muted font-mono text-xs">
              {treeState.leaves.length} leaves
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Merkle Root Highlight */}
        <div className="mb-4 p-3 rounded border border-amber-400/30 bg-amber-400/5">
          <span className="text-[10px] font-mono text-amber-400 block mb-1">MERKLE ROOT</span>
          <span className="font-mono text-xs text-amber-400 break-all font-bold">
            {treeState.root}
          </span>
        </div>

        {/* Tree Visualization */}
        <div className="space-y-3 overflow-x-auto">
          {reversedLayers.map((layer, layerIdx) => {
            const isRoot = layerIdx === 0;
            const isLeaf = layerIdx === reversedLayers.length - 1;
            const label = isRoot ? 'ROOT' : isLeaf ? 'LEAVES' : `L${reversedLayers.length - 1 - layerIdx}`;

            return (
              <div key={layerIdx}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-gallows-muted w-12 shrink-0">{label}</span>
                  <div className="h-px flex-1 bg-gallows-border" />
                </div>
                <div className="flex flex-wrap gap-1.5 pl-14">
                  {layer.map((hash, nodeIdx) => (
                    <div
                      key={nodeIdx}
                      className={`px-2 py-1 rounded border font-mono text-[10px] break-all max-w-[200px] truncate ${
                        isRoot
                          ? 'border-amber-400/40 bg-amber-400/10 text-amber-400'
                          : isLeaf
                          ? 'border-gallows-approved/30 bg-gallows-approved/5 text-gallows-approved/80'
                          : 'border-gallows-border bg-gallows-bg text-gallows-muted'
                      }`}
                      title={hash}
                    >
                      {hash.substring(0, 16)}…
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-3 border-t border-gallows-border flex gap-4 text-xs font-mono text-gallows-muted">
          <span>Nodes: {treeState.nodeCount}</span>
          <span>Algorithm: SHA-256</span>
          <span>Ordering: Canonical</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerkleVisualizer;
