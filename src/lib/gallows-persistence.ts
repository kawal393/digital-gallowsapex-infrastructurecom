// ═══════════════════════════════════════════════════════════════════════
// APEX GALLOWS — Database Persistence Layer
// Persists cryptographic audit trail to Lovable Cloud
// ═══════════════════════════════════════════════════════════════════════

import { supabase } from "@/integrations/supabase/client";
import type { CommitRecord, MerkleProofPath } from "./gallows-engine";

export interface LedgerEntry {
  id: string;
  commit_id: string;
  user_id: string | null;
  action: string;
  predicate_id: string;
  phase: string;
  status: string | null;
  commit_hash: string;
  merkle_leaf_hash: string;
  challenge_hash: string | null;
  proof_hash: string | null;
  merkle_root: string | null;
  merkle_proof: MerkleProofPath | null;
  violation_found: string | null;
  verification_time_ms: number | null;
  challenged_at: string | null;
  proven_at: string | null;
  created_at: string;
}

/**
 * Persist a commit record to the database
 */
export async function persistCommit(record: CommitRecord): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Use type assertion since gallows_ledger isn't in generated types yet
  const { error } = await (supabase.from('gallows_ledger' as any) as any).insert({
    commit_id: record.id,
    user_id: user?.id ?? null,
    action: record.action,
    predicate_id: record.predicateId,
    phase: record.phase,
    status: record.status ?? null,
    commit_hash: record.commitHash,
    merkle_leaf_hash: record.merkleLeafHash,
    challenge_hash: record.challengeHash ?? null,
    proof_hash: record.proofHash ?? null,
    merkle_root: record.merkleRoot ?? null,
    merkle_proof: record.merkleProof ? JSON.parse(JSON.stringify(record.merkleProof)) : null,
    violation_found: record.violationFound ?? null,
    verification_time_ms: record.verificationTimeMs ?? null,
    challenged_at: record.challengedAt ?? null,
    proven_at: record.provenAt ?? null,
  });

  if (error) {
    console.error('[Gallows Persistence] Insert failed:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Update a commit record after challenge or proof
 */
export async function updateCommit(record: CommitRecord): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('gallows_ledger').update({
    phase: record.phase,
    status: record.status ?? null,
    challenge_hash: record.challengeHash ?? null,
    proof_hash: record.proofHash ?? null,
    merkle_root: record.merkleRoot ?? null,
    merkle_proof: record.merkleProof ?? null,
    violation_found: record.violationFound ?? null,
    verification_time_ms: record.verificationTimeMs ?? null,
    challenged_at: record.challengedAt ?? null,
    proven_at: record.provenAt ?? null,
  }).eq('commit_id', record.id);

  if (error) {
    console.error('[Gallows Persistence] Update failed:', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Fetch all ledger entries (public audit trail)
 */
export async function fetchLedger(limit = 100): Promise<LedgerEntry[]> {
  const { data, error } = await supabase
    .from('gallows_ledger')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Gallows Persistence] Fetch failed:', error.message);
    return [];
  }

  return (data ?? []) as unknown as LedgerEntry[];
}

/**
 * Verify a hash against the public ledger
 */
export async function verifyHashInLedger(hash: string): Promise<{
  found: boolean;
  entry?: LedgerEntry;
}> {
  // Search across all hash columns
  const { data, error } = await supabase
    .from('gallows_ledger')
    .select('*')
    .or(`commit_hash.eq.${hash},merkle_leaf_hash.eq.${hash},proof_hash.eq.${hash},challenge_hash.eq.${hash}`)
    .limit(1);

  if (error || !data || data.length === 0) {
    return { found: false };
  }

  return { found: true, entry: data[0] as unknown as LedgerEntry };
}

/**
 * Get current Merkle root from the latest entry
 */
export async function getLatestMerkleRoot(): Promise<string | null> {
  const { data, error } = await supabase
    .from('gallows_ledger')
    .select('merkle_root')
    .not('merkle_root', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return (data[0] as unknown as { merkle_root: string }).merkle_root;
}

/**
 * Subscribe to realtime ledger updates
 */
export function subscribeLedger(callback: (entry: LedgerEntry) => void) {
  const channel = supabase
    .channel('gallows_ledger_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'gallows_ledger',
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as unknown as LedgerEntry);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
