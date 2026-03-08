import { useState, useCallback } from "react";
import GallowsHeader from "@/components/gallows/GallowsHeader";
import CommitPanel from "@/components/gallows/CommitPanel";
import PipelineView from "@/components/gallows/PipelineView";
import MerkleVisualizer from "@/components/gallows/MerkleVisualizer";
import AuditTrailLog from "@/components/gallows/AuditTrailLog";
import PredicateRegistry from "@/components/gallows/PredicateRegistry";
import HashVerifier from "@/components/gallows/HashVerifier";
import {
  commitAction,
  challengeCommit,
  proveCommit,
  toggleSovereignPause,
  isSystemPaused,
  getCommitLog,
  getTreeState,
  type CommitRecord,
  type MerkleTreeState,
} from "@/lib/gallows-engine";

const Gallows = () => {
  const [currentRecord, setCurrentRecord] = useState<CommitRecord | null>(null);
  const [commitLog, setCommitLog] = useState<CommitRecord[]>([]);
  const [treeState, setTreeState] = useState<(MerkleTreeState & { layers: string[][] }) | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshState = () => {
    setCommitLog(getCommitLog());
    setTreeState(getTreeState());
  };

  const handleCommit = useCallback(async (action: string, predicateId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const record = await commitAction(action, predicateId);
      setCurrentRecord(record);
      refreshState();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleChallenge = useCallback(async (commitId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const record = await challengeCommit(commitId);
      setCurrentRecord(record);
      refreshState();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleProve = useCallback(async (commitId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const record = await proveCommit(commitId);
      setCurrentRecord(record);
      refreshState();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handlePause = useCallback(() => {
    const result = toggleSovereignPause();
    setPaused(result.paused);
    refreshState();
  }, []);

  return (
    <div className="min-h-screen bg-gallows-bg text-gallows-text">
      <GallowsHeader paused={paused} onTogglePause={handlePause} />

      {error && (
        <div className="mx-4 md:mx-6 mt-4 p-3 border border-gallows-blocked/40 bg-gallows-blocked/10 rounded font-mono text-sm text-gallows-blocked">
          ⚠ {error}
        </div>
      )}

      <main className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Top row: Commit + Pipeline + Predicates */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_1fr_300px]">
          <CommitPanel onCommit={handleCommit} isProcessing={isProcessing} paused={paused} />
          <PipelineView
            record={currentRecord}
            onChallenge={handleChallenge}
            onProve={handleProve}
            isProcessing={isProcessing}
          />
          <PredicateRegistry />
        </div>

        {/* Middle row: Merkle Tree + Hash Verifier */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_400px]">
          <MerkleVisualizer treeState={treeState} />
          <HashVerifier />
        </div>

        {/* Bottom: Full Audit Trail */}
        <AuditTrailLog entries={commitLog} />
      </main>
    </div>
  );
};

export default Gallows;
