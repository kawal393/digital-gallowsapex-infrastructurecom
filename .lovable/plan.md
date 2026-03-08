
# Implementation Plan: World-Class APEX Features

## Summary
Building the remaining technical features to close the gap with competitors. All are implementable — only formal regulatory submissions require external business action.

---

## 1. Real ZK-SNARK Proofs (Upgrade from Commitments)

**Current State**: Using hash-based ZK commitments in `prove-action` — functional but not mathematically proven zero-knowledge.

**Implementation**:
- Add **snarkjs** WASM integration for browser-based ZK proof generation
- Pre-compile a **Circom circuit** for compliance verification:
  ```
  template ComplianceVerify() {
    signal private input action_hash;
    signal private input predicate_id;
    signal input compliance_status;
    signal output valid;
  }
  ```
- Store pre-generated `.wasm` + `.zkey` files in `/public/zk/`
- Create `src/lib/gallows-zk.ts` with `generateZKProof()` and `verifyZKProof()`
- Update `prove-action` Edge Function to accept and verify snarkjs proofs
- Add UI toggle in CommitPanel for "ZK Privacy Mode"

**Technical Notes**:
- snarkjs runs in browser via WASM — no server-side key ceremony needed for demo
- Production would require trusted setup (Powers of Tau ceremony)

---

## 2. Multi-Party Computation (MPC) Verification Network

**Current State**: Single Edge Function verifies all proofs — technically centralized.

**Implementation**:
- Create **3 independent Edge Functions** acting as MPC nodes:
  - `mpc-node-alpha/index.ts`
  - `mpc-node-beta/index.ts`
  - `mpc-node-gamma/index.ts`
- Each node independently computes:
  - SHA-256 hash verification
  - Merkle proof validation
  - Compliance pattern matching
- New `mpc-coordinator/index.ts` collects 2-of-3 threshold agreement
- Store per-node signatures in `gallows_ledger.mpc_votes` (JSONB)
- Update certificate to show "3-node MPC consensus"

**Flow**:
```
Client → Coordinator → [Alpha, Beta, Gamma] → 2/3 consensus → Result
```

---

## 3. Runtime Inference Blocking SDK (Real Implementation)

**Current State**: SDK docs exist but SDK is marked "Coming Soon".

**Implementation**:
- Create actual `@apex/gallows-sdk` npm package structure in `/packages/gallows-sdk/`
- Implement:
  - `ApexGallows` class with `verify()`, `commit()`, `middleware()`
  - Express/Node.js middleware that **blocks** responses before sending
  - React hook `useGallowsVerify()` for client-side
- Add **pre-flight verification mode**: check compliance BEFORE AI inference runs
- Sub-15ms latency via persistent connections + local pattern cache

**Example**:
```typescript
// Blocks the response if violation detected
app.use('/api/ai', gallows.middleware({
  mode: 'blocking',
  predicates: ['EU_ART_14', 'EU_ART_50']
}));
```

---

## 4. Updated Positioning & Comparison Page

**Implementation**:
- Update Hero copy to: "World's first live, visual compliance engine with Bitcoin-anchored audit trails"
- Create `/compare` page with feature matrix vs competitors
- Add claims with evidence links (OpenTimestamps, Merkle visualizer, etc.)

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/gallows-zk.ts` | Create — snarkjs integration |
| `public/zk/compliance.wasm` | Create — compiled circuit |
| `public/zk/compliance.zkey` | Create — proving key |
| `supabase/functions/mpc-node-alpha/` | Create — MPC node 1 |
| `supabase/functions/mpc-node-beta/` | Create — MPC node 2 |
| `supabase/functions/mpc-node-gamma/` | Create — MPC node 3 |
| `supabase/functions/mpc-coordinator/` | Create — threshold coordinator |
| `src/components/gallows/CommitPanel.tsx` | Modify — ZK mode toggle |
| `src/components/gallows/CertificatePanel.tsx` | Modify — MPC consensus display |
| `src/pages/Compare.tsx` | Create — competitor comparison |
| `src/components/Hero.tsx` | Modify — updated positioning |
| `packages/gallows-sdk/` | Create — npm package structure |

---

## Estimated Complexity

| Feature | Effort | Impact |
|---------|--------|--------|
| ZK-SNARKs | High | Cryptographic differentiation |
| MPC Network | Medium | Decentralization claim |
| Runtime SDK | Medium | Enterprise adoption |
| Comparison Page | Low | Marketing clarity |

---

## What Cannot Be Built (Business/Legal)

- **Formal regulatory submissions** — requires legal team, not code
- **ISO 27001 / SOC 2 certification** — requires audit process
- **GDPR Art. 42 certification** — requires approved body
