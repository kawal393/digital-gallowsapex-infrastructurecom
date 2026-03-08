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
 * Persist a commit record via server-side Edge Function
 * Server re-computes hashes to prevent client-side tampering
 */
export async function persistCommit(record: CommitRecord): Promise<{ 
  success: boolean; 
  error?: string;
  serverVerified?: boolean;
  hashMismatch?: boolean;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('commit-action', {
      body: {
        action: record.action,
        predicate_id: record.predicateId,
        // Send client hashes for server-side verification
        client_commit_hash: record.commitHash,
        client_leaf_hash: record.merkleLeafHash,
      },
    });

    if (error) {
      console.error('[Gallows Persistence] Server commit failed:', error.message);
      return { success: false, error: error.message };
    }

    // Check for rate limiting
    if (data?.error === 'Rate limit exceeded') {
      return { 
        success: false, 
        error: `Rate limited: ${data.message}`,
      };
    }

    return { 
      success: true,
      serverVerified: data?.hash_verified_server_side ?? false,
      hashMismatch: data?.hash_mismatch_detected ?? false,
    };
  } catch (e: any) {
    console.error('[Gallows Persistence] Insert failed:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Update a commit record after challenge or proof
 */
export async function updateCommit(record: CommitRecord): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase.from('gallows_ledger' as any) as any).update({
    phase: record.phase,
    status: record.status ?? null,
    challenge_hash: record.challengeHash ?? null,
    proof_hash: record.proofHash ?? null,
    merkle_root: record.merkleRoot ?? null,
    merkle_proof: record.merkleProof ? JSON.parse(JSON.stringify(record.merkleProof)) : null,
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
 * Sorted by created_at ascending for tree reconstruction
 */
export async function fetchLedger(limit = 500): Promise<LedgerEntry[]> {
  const { data, error } = await (supabase.from('gallows_ledger' as any) as any)
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[Gallows Persistence] Fetch failed:', error.message);
    return [];
  }

  return (data ?? []) as LedgerEntry[];
}

/**
 * Fetch ledger entries sorted descending for display
 */
export async function fetchLedgerDescending(limit = 100): Promise<LedgerEntry[]> {
  const { data, error } = await (supabase.from('gallows_ledger' as any) as any)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Gallows Persistence] Fetch failed:', error.message);
    return [];
  }

  return (data ?? []) as LedgerEntry[];
}

/**
 * Verify a hash against the public ledger
 */
export async function verifyHashInLedger(hash: string): Promise<{
  found: boolean;
  entry?: LedgerEntry;
}> {
  // Search across all hash columns
  const { data, error } = await (supabase.from('gallows_ledger' as any) as any)
    .select('*')
    .or(`commit_hash.eq.${hash},merkle_leaf_hash.eq.${hash},proof_hash.eq.${hash},challenge_hash.eq.${hash}`)
    .limit(1);

  if (error || !data || data.length === 0) {
    return { found: false };
  }

  return { found: true, entry: data[0] as LedgerEntry };
}

/**
 * Get current Merkle root from the latest entry
 */
export async function getLatestMerkleRoot(): Promise<string | null> {
  const { data, error } = await (supabase.from('gallows_ledger' as any) as any)
    .select('merkle_root')
    .not('merkle_root', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return (data[0] as { merkle_root: string }).merkle_root;
}

/**
 * Subscribe to realtime ledger updates
 * Generates a unique session ID to filter out own inserts
 */
let sessionId: string | null = null;

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

export function subscribeLedger(
  callback: (entry: LedgerEntry) => void,
  options?: { includeOwnInserts?: boolean }
) {
  const channel = supabase
    .channel('gallows_ledger_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'gallows_ledger',
      },
      (payload) => {
        if (payload.new) {
          // Only invoke callback for new entries
          // The filtering of own vs others happens at UI level
          callback(payload.new as unknown as LedgerEntry);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
