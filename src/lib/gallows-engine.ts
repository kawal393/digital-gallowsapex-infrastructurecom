// ═══════════════════════════════════════════════════════════════════════
// APEX DIGITAL GALLOWS — Sovereign Compliance Engine
// Real Web Crypto API • Real Merkle Trees • Real Predicate Verification
// ═══════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────

export interface Predicate {
  id: string;
  name: string;
  article: string;
  description: string;
  violationPatterns: string[];
  riskLevel: 'HIGH' | 'UNACCEPTABLE' | 'LIMITED' | 'MINIMAL';
  enforcementDate: string;
}

export type GallowsPhase = 'IDLE' | 'COMMITTED' | 'CHALLENGED' | 'PROVING' | 'VERIFIED' | 'PAUSED';

export interface CommitRecord {
  id: string;
  action: string;
  predicateId: string;
  timestamp: string;
  commitHash: string;
  merkleLeafHash: string;
  phase: GallowsPhase;
  challengeHash?: string;
  proofHash?: string;
  merkleProof?: MerkleProofPath;
  merkleRoot?: string;
  verificationTimeMs?: number;
  status?: 'APPROVED' | 'BLOCKED';
  violationFound?: string;
  challengedAt?: string;
  provenAt?: string;
  sovereignPauseAt?: string;
}

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: string;
  index?: number;
}

export interface MerkleProofStep {
  hash: string;
  position: 'left' | 'right';
}

export type MerkleProofPath = MerkleProofStep[];

export interface MerkleTreeState {
  root: string;
  leaves: string[];
  depth: number;
  nodeCount: number;
}

// Keep backward compat
export interface GallowsResult {
  status: 'APPROVED' | 'BLOCKED';
  verificationTimeMs: number;
  auditHash: string;
  predicateId: string;
  timestamp: string;
  actionSummary: string;
  violationFound?: string;
}

// ── Predicates ─────────────────────────────────────────────────────────

export const PREDICATES: Predicate[] = [
  {
    id: 'EU_ART_5',
    name: 'Prohibited AI Practices',
    article: 'Article 5',
    description: 'Bans AI systems that deploy subliminal manipulation, exploit vulnerabilities, enable social scoring by governments, or perform real-time biometric identification in public spaces.',
    violationPatterns: ['subliminal manipulation', 'exploit vulnerability', 'social scoring', 'mass surveillance', 'biometric identification public', 'manipulate behavior'],
    riskLevel: 'UNACCEPTABLE',
    enforcementDate: '2025-02-02',
  },
  {
    id: 'EU_ART_6',
    name: 'High-Risk Classification',
    article: 'Article 6',
    description: 'AI systems used as safety components or in Annex III areas (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) are classified high-risk.',
    violationPatterns: ['unclassified high risk', 'no risk assessment', 'skip classification', 'bypass annex iii', 'undeclared safety component'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_9',
    name: 'Risk Management System',
    article: 'Article 9',
    description: 'High-risk AI systems must implement a continuous, iterative risk management system throughout the entire lifecycle, identifying and mitigating risks to health, safety, and fundamental rights.',
    violationPatterns: ['no risk management', 'skip risk assessment', 'static risk', 'no lifecycle monitoring', 'ignore residual risk'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_11',
    name: 'Technical Documentation',
    article: 'Article 11',
    description: 'Technical documentation must be drawn up before a high-risk AI system is placed on the market, demonstrating compliance and providing authorities with information to assess conformity.',
    violationPatterns: ['no documentation', 'undocumented model', 'missing technical docs', 'no conformity record', 'skip documentation'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_12',
    name: 'Record-Keeping',
    article: 'Article 12',
    description: 'High-risk AI systems must include logging capabilities that enable automatic recording of events relevant to identifying risks and substantial modifications throughout the lifecycle.',
    violationPatterns: ['no logging', 'disable audit trail', 'no record keeping', 'delete logs', 'unauditable', 'no event recording'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_13',
    name: 'Transparency & Information',
    article: 'Article 13',
    description: 'High-risk AI systems must be designed to be sufficiently transparent to enable deployers to interpret outputs and use them appropriately.',
    violationPatterns: ['black box', 'no interpretability', 'opaque model', 'unexplainable', 'no transparency', 'hidden logic'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_14',
    name: 'Human Oversight',
    article: 'Article 14',
    description: 'High-risk AI systems must allow effective human oversight, including ability to fully understand, monitor, intervene, and halt the system (kill switch mandate).',
    violationPatterns: ['autonomous decision', 'no human review', 'override human', 'bypass approval', 'without human', 'remove oversight', 'disable kill switch'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_15',
    name: 'Accuracy, Robustness & Cybersecurity',
    article: 'Article 15',
    description: 'High-risk AI must achieve appropriate accuracy, be resilient to errors and inconsistencies, and be robust against unauthorized third-party manipulation.',
    violationPatterns: ['unverified data', 'no validation', 'untested model', 'fabricated', 'unvalidated', 'no adversarial testing', 'skip security'],
    riskLevel: 'HIGH',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_50',
    name: 'Transparency for GPAI & Content',
    article: 'Article 50',
    description: 'AI-generated content (text, audio, image, video) must be machine-readable as AI-generated. Deepfakes must be disclosed. Users must be informed of AI interactions.',
    violationPatterns: ['undisclosed ai', 'no attribution', 'hidden synthetic', 'deepfake without label', 'without disclosure', 'unlabeled generation'],
    riskLevel: 'LIMITED',
    enforcementDate: '2026-08-02',
  },
  {
    id: 'EU_ART_52',
    name: 'AI Interaction Disclosure',
    article: 'Article 52',
    description: 'Persons interacting with AI must be informed they are doing so. AI systems generating deep fakes or synthetic content must disclose this fact clearly.',
    violationPatterns: ['impersonate human', 'pretend to be person', 'hide ai identity', 'no bot disclosure', 'pose as human', 'conceal ai nature'],
    riskLevel: 'LIMITED',
    enforcementDate: '2026-08-02',
  },
];

// ── Cryptographic Primitives ───────────────────────────────────────────

export async function hashSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateCommitId(): Promise<string> {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `APEX-${hex.substring(0, 8).toUpperCase()}-${hex.substring(8, 12).toUpperCase()}`;
}

// ── Merkle Tree Implementation ─────────────────────────────────────────

export class MerkleTree {
  private leaves: string[] = [];
  private layers: string[][] = [];

  constructor(leaves: string[] = []) {
    this.leaves = [...leaves];
    if (leaves.length > 0) {
      // Will be built async via initFromLeaves
    }
  }

  private async computeLayers(): Promise<string[][]> {
    if (this.leaves.length === 0) return [['0'.repeat(64)]];

    let currentLayer = [...this.leaves];
    const layers: string[][] = [currentLayer];

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : currentLayer[i]; // duplicate last if odd
        const combined = left < right ? left + right : right + left; // canonical ordering
        const parentHash = await hashSHA256(combined);
        nextLayer.push(parentHash);
      }
      currentLayer = nextLayer;
      layers.push(currentLayer);
    }

    return layers;
  }

  /**
   * Initialize tree from existing leaves (for persistence recovery)
   */
  async initFromLeaves(leaves: string[]): Promise<void> {
    this.leaves = [...leaves];
    this.layers = await this.computeLayers();
  }

  async addLeaf(leafHash: string): Promise<void> {
    this.leaves.push(leafHash);
    this.layers = await this.computeLayers();
  }

  async getRoot(): Promise<string> {
    if (this.layers.length === 0) {
      this.layers = await this.computeLayers();
    }
    const topLayer = this.layers[this.layers.length - 1];
    return topLayer ? topLayer[0] : '0'.repeat(64);
  }

  async getProof(leafIndex: number): Promise<MerkleProofPath> {
    if (this.layers.length === 0) {
      this.layers = await this.computeLayers();
    }

    const proof: MerkleProofPath = [];
    let idx = leafIndex;

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i];
      const isRight = idx % 2 === 1;
      const siblingIdx = isRight ? idx - 1 : idx + 1;

      if (siblingIdx < layer.length) {
        proof.push({
          hash: layer[siblingIdx],
          position: isRight ? 'left' : 'right',
        });
      }

      idx = Math.floor(idx / 2);
    }

    return proof;
  }

  getLeafCount(): number {
    return this.leaves.length;
  }

  getDepth(): number {
    return this.layers.length;
  }

  getState(): MerkleTreeState {
    return {
      root: this.layers.length > 0 ? this.layers[this.layers.length - 1][0] : '0'.repeat(64),
      leaves: [...this.leaves],
      depth: this.layers.length,
      nodeCount: this.layers.reduce((sum, l) => sum + l.length, 0),
    };
  }

  getLayers(): string[][] {
    return this.layers.map(l => [...l]);
  }

  /**
   * Clear all state (for reset)
   */
  clear(): void {
    this.leaves = [];
    this.layers = [];
  }
}

// ── Static Verification (Merkle proof verification without tree) ───────

export async function verifyMerkleProof(
  leafHash: string,
  proof: MerkleProofPath,
  root: string
): Promise<boolean> {
  let computedHash = leafHash;

  for (const step of proof) {
    const left = step.position === 'left' ? step.hash : computedHash;
    const right = step.position === 'left' ? computedHash : step.hash;
    const combined = left < right ? left + right : right + left;
    computedHash = await hashSHA256(combined);
  }

  return computedHash === root;
}

// ── Compliance Check ───────────────────────────────────────────────────

export function checkCompliance(actionText: string, predicateId: string): { compliant: boolean; violationFound?: string; predicate?: Predicate } {
  const predicate = PREDICATES.find(p => p.id === predicateId);
  if (!predicate) return { compliant: true };

  const lowerAction = actionText.toLowerCase();
  for (const pattern of predicate.violationPatterns) {
    if (lowerAction.includes(pattern)) {
      return { compliant: false, violationFound: pattern, predicate };
    }
  }
  return { compliant: true, predicate };
}

// ── Full Pipeline: Commit → Challenge → Prove → Verify ─────────────────

const globalTree = new MerkleTree();
let commitLog: CommitRecord[] = [];
let systemPaused = false;
let initialized = false;

export function isSystemPaused(): boolean {
  return systemPaused;
}

export function toggleSovereignPause(): { paused: boolean; timestamp: string } {
  systemPaused = !systemPaused;
  const timestamp = new Date().toISOString();
  return { paused: systemPaused, timestamp };
}

export function getCommitLog(): CommitRecord[] {
  return [...commitLog];
}

export function getTreeState(): MerkleTreeState & { layers: string[][] } {
  return {
    ...globalTree.getState(),
    layers: globalTree.getLayers(),
  };
}

/**
 * Initialize engine from persisted ledger entries
 * Call this on page load to restore cryptographic state
 */
export async function initializeFromLedger(entries: {
  id: string;
  commit_id: string;
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
}[]): Promise<{ loaded: number; merkleRoot: string }> {
  if (initialized && entries.length === 0) {
    return { loaded: 0, merkleRoot: await globalTree.getRoot() };
  }

  // Sort by created_at ascending to rebuild in correct order
  const sorted = [...entries].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Extract leaf hashes and rebuild tree
  const leafHashes = sorted.map(e => e.merkle_leaf_hash);
  await globalTree.initFromLeaves(leafHashes);

  // Reconstruct commit log
  commitLog = sorted.map(e => ({
    id: e.commit_id,
    action: e.action,
    predicateId: e.predicate_id,
    timestamp: e.created_at,
    commitHash: e.commit_hash,
    merkleLeafHash: e.merkle_leaf_hash,
    phase: e.phase as GallowsPhase,
    challengeHash: e.challenge_hash ?? undefined,
    proofHash: e.proof_hash ?? undefined,
    merkleProof: e.merkle_proof ?? undefined,
    merkleRoot: e.merkle_root ?? undefined,
    verificationTimeMs: e.verification_time_ms ?? undefined,
    status: e.status as 'APPROVED' | 'BLOCKED' | undefined,
    violationFound: e.violation_found ?? undefined,
    challengedAt: e.challenged_at ?? undefined,
    provenAt: e.proven_at ?? undefined,
  })).reverse(); // Reverse so newest is first in commit log

  initialized = true;
  const merkleRoot = await globalTree.getRoot();
  
  return { loaded: sorted.length, merkleRoot };
}

/**
 * Check if engine is initialized
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Reset engine state (for testing)
 */
export function resetEngine(): void {
  globalTree.clear();
  commitLog = [];
  systemPaused = false;
  initialized = false;
}

/**
 * Update a local record with server-side values
 * Used to sync client state with server after challenge/prove
 */
export function updateRecordFromServer(
  commitId: string,
  serverData: Partial<CommitRecord>
): CommitRecord | null {
  const idx = commitLog.findIndex(r => r.id === commitId);
  if (idx === -1) return null;

  const updatedRecord = { ...commitLog[idx], ...serverData };
  commitLog[idx] = updatedRecord;
  
  return updatedRecord;
}

// Phase 1: COMMIT — Hash the action into a Merkle leaf
export async function commitAction(action: string, predicateId: string): Promise<CommitRecord> {
  if (systemPaused) {
    throw new Error('SOVEREIGN PAUSE ACTIVE — All operations halted by human oversight authority (EU AI Act Art. 14)');
  }

  const t0 = performance.now();
  const id = await generateCommitId();
  const timestamp = new Date().toISOString();

  // Create commit hash: H(action | predicateId | timestamp)
  const commitHash = await hashSHA256(`${action}|${predicateId}|${timestamp}`);

  // Create Merkle leaf: H(commitId | commitHash)
  const merkleLeafHash = await hashSHA256(`${id}|${commitHash}`);

  // Add to Merkle tree
  await globalTree.addLeaf(merkleLeafHash);
  const merkleRoot = await globalTree.getRoot();

  const record: CommitRecord = {
    id,
    action,
    predicateId,
    timestamp,
    commitHash,
    merkleLeafHash,
    phase: 'COMMITTED',
    merkleRoot,
    verificationTimeMs: Math.round((performance.now() - t0) * 100) / 100,
  };

  commitLog = [record, ...commitLog];
  return record;
}

// Phase 2: CHALLENGE — Regulator challenges a committed action
export async function challengeCommit(commitId: string): Promise<CommitRecord> {
  if (systemPaused) {
    throw new Error('SOVEREIGN PAUSE ACTIVE — All operations halted by human oversight authority (EU AI Act Art. 14)');
  }

  const t0 = performance.now();
  const idx = commitLog.findIndex(r => r.id === commitId);
  if (idx === -1) throw new Error(`Commit ${commitId} not found in ledger`);

  const record = { ...commitLog[idx] };
  const challengeTimestamp = new Date().toISOString();

  // Challenge hash: H(commitHash | challengeTimestamp | predicateId)
  record.challengeHash = await hashSHA256(`${record.commitHash}|${challengeTimestamp}|${record.predicateId}`);
  record.challengedAt = challengeTimestamp;
  record.phase = 'CHALLENGED';

  // Run compliance check
  const { compliant, violationFound } = checkCompliance(record.action, record.predicateId);
  record.status = compliant ? 'APPROVED' : 'BLOCKED';
  record.violationFound = violationFound;

  record.verificationTimeMs = Math.round((performance.now() - t0) * 100) / 100;
  commitLog[idx] = record;
  return record;
}

// Phase 3: PROVE — Generate Merkle inclusion proof
export async function proveCommit(commitId: string): Promise<CommitRecord> {
  if (systemPaused) {
    throw new Error('SOVEREIGN PAUSE ACTIVE — All operations halted by human oversight authority (EU AI Act Art. 14)');
  }

  const t0 = performance.now();
  const idx = commitLog.findIndex(r => r.id === commitId);
  if (idx === -1) throw new Error(`Commit ${commitId} not found in ledger`);

  const record = { ...commitLog[idx] };

  // Find the leaf index in the tree
  const treeState = globalTree.getState();
  const leafIndex = treeState.leaves.indexOf(record.merkleLeafHash);
  if (leafIndex === -1) throw new Error('Merkle leaf not found in tree');

  // Generate Merkle proof
  const merkleProof = await globalTree.getProof(leafIndex);
  const merkleRoot = await globalTree.getRoot();

  // Proof hash: H(merkleRoot | proofPath | status)
  const proofData = `${merkleRoot}|${JSON.stringify(merkleProof)}|${record.status || 'PENDING'}`;
  record.proofHash = await hashSHA256(proofData);
  record.merkleProof = merkleProof;
  record.merkleRoot = merkleRoot;
  record.provenAt = new Date().toISOString();
  record.phase = 'VERIFIED';

  record.verificationTimeMs = (record.verificationTimeMs || 0) + Math.round((performance.now() - t0) * 100) / 100;
  commitLog[idx] = record;
  return record;
}

// Verify any hash against the current Merkle root
export async function verifyHash(hash: string): Promise<{
  found: boolean;
  record?: CommitRecord;
  verified: boolean;
  merkleRoot: string;
}> {
  const merkleRoot = await globalTree.getRoot();
  const record = commitLog.find(
    r => r.commitHash === hash || r.merkleLeafHash === hash || r.proofHash === hash || r.challengeHash === hash
  );

  if (!record) {
    return { found: false, verified: false, merkleRoot };
  }

  // Verify Merkle inclusion if proof exists
  let verified = false;
  if (record.merkleProof && record.merkleRoot) {
    verified = await verifyMerkleProof(record.merkleLeafHash, record.merkleProof, record.merkleRoot);
  }

  return { found: true, record, verified, merkleRoot };
}

// Legacy compat
export async function runGallows(actionText: string, predicateId: string): Promise<GallowsResult> {
  const record = await commitAction(actionText, predicateId);
  const challenged = await challengeCommit(record.id);
  const proven = await proveCommit(record.id);

  return {
    status: proven.status || 'APPROVED',
    verificationTimeMs: proven.verificationTimeMs || 0,
    auditHash: proven.proofHash || proven.commitHash,
    predicateId,
    timestamp: proven.timestamp,
    actionSummary: actionText.length > 80 ? actionText.substring(0, 77) + '...' : actionText,
    violationFound: proven.violationFound,
  };
}
