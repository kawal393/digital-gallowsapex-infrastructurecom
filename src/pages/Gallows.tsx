import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import GallowsHeader from "@/components/gallows/GallowsHeader";
import CommitPanel from "@/components/gallows/CommitPanel";
import PipelineView from "@/components/gallows/PipelineView";
import MerkleVisualizer from "@/components/gallows/MerkleVisualizer";
import AuditTrailLog from "@/components/gallows/AuditTrailLog";
import PredicateRegistry from "@/components/gallows/PredicateRegistry";
import HashVerifier from "@/components/gallows/HashVerifier";
import CertificatePanel from "@/components/gallows/CertificatePanel";
import {
  commitAction,
  challengeCommit,
  proveCommit,
  toggleSovereignPause,
  getCommitLog,
  getTreeState,
  type CommitRecord,
  type MerkleTreeState,
} from "@/lib/gallows-engine";
import { persistCommit, updateCommit, fetchLedger, subscribeLedger, type LedgerEntry } from "@/lib/gallows-persistence";
import { generateCertificate, type ComplianceCertificate } from "@/lib/gallows-certificate";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Gallows = () => {
  const { user } = useAuth();
  const [currentRecord, setCurrentRecord] = useState<CommitRecord | null>(null);
  const [commitLog, setCommitLog] = useState<CommitRecord[]>([]);
  const [treeState, setTreeState] = useState<(MerkleTreeState & { layers: string[][] }) | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<ComplianceCertificate | null>(null);
  const [persistedCount, setPersistedCount] = useState(0);

  const refreshState = () => {
    setCommitLog(getCommitLog());
    setTreeState(getTreeState());
  };

  // Fetch persisted ledger on mount
  useEffect(() => {
    fetchLedger(50).then((entries) => {
      setPersistedCount(entries.length);
    });
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = subscribeLedger((entry) => {
      setPersistedCount((prev) => prev + 1);
      toast.success(`Ledger synced: ${entry.commit_id}`, {
        description: `Phase: ${entry.phase}`,
        duration: 2000,
      });
    });
    return unsubscribe;
  }, []);

  const handleCommit = useCallback(async (action: string, predicateId: string) => {
    setIsProcessing(true);
    setError(null);
    setCertificate(null);
    try {
      const record = await commitAction(action, predicateId);
      setCurrentRecord(record);
      refreshState();

      // Persist to database
      if (user) {
        const result = await persistCommit(record);
        if (result.success) {
          toast.success("Committed to immutable ledger", {
            description: `ID: ${record.id}`,
          });
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const handleChallenge = useCallback(async (commitId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const record = await challengeCommit(commitId);
      setCurrentRecord(record);
      refreshState();

      // Update in database
      if (user) {
        await updateCommit(record);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const handleProve = useCallback(async (commitId: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const record = await proveCommit(commitId);
      setCurrentRecord(record);
      refreshState();

      // Update in database
      if (user) {
        await updateCommit(record);
      }

      // Generate certificate
      const cert = await generateCertificate(record);
      if (cert) {
        setCertificate(cert);
        toast.success("Compliance certificate generated", {
          description: cert.certificateId,
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  const handlePause = useCallback(() => {
    const result = toggleSovereignPause();
    setPaused(result.paused);
    refreshState();
    
    toast[result.paused ? 'warning' : 'success'](
      result.paused ? 'SOVEREIGN PAUSE ACTIVATED' : 'System Resumed',
      {
        description: result.paused 
          ? 'All operations halted per EU AI Act Art. 14'
          : 'Verification pipeline operational',
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gallows-bg text-gallows-text">
      <GallowsHeader paused={paused} onTogglePause={handlePause} persistedCount={persistedCount} />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 md:mx-6 mt-4 p-3 border border-gallows-blocked/40 bg-gallows-blocked/10 rounded font-mono text-sm text-gallows-blocked"
        >
          ⚠ {error}
        </motion.div>
      )}

      <main className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Top row: Commit + Pipeline + Predicates */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_1fr_300px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CommitPanel onCommit={handleCommit} isProcessing={isProcessing} paused={paused} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PipelineView
              record={currentRecord}
              onChallenge={handleChallenge}
              onProve={handleProve}
              isProcessing={isProcessing}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PredicateRegistry />
          </motion.div>
        </div>

        {/* Middle row: Merkle Tree + Hash Verifier + Certificate */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-[1fr_400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MerkleVisualizer treeState={treeState} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <HashVerifier />
            {certificate && <CertificatePanel certificate={certificate} />}
          </motion.div>
        </div>

        {/* Bottom: Full Audit Trail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AuditTrailLog entries={commitLog} />
        </motion.div>
      </main>
    </div>
  );
};

export default Gallows;
