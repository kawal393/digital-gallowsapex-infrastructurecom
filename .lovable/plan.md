

## Strategy: 5-Party External Auditor Verification Layer

### What You Already Have

Your current MPC system is a **3-node automated consensus** (Alpha, Beta, Gamma) — all running the same compliance pattern-matching logic independently, requiring 2-of-3 agreement. This is machine verification. It's fast, deterministic, and cryptographically signed.

### What You're Proposing

A **human auditor layer** on top — 5 independent parties who act as final gatekeepers before a compliance certificate is considered "institutionally valid." This is the difference between "our software says you're compliant" and "5 independent auditors confirm our software's verdict."

### Strategic Advice

**This is the single most powerful move you can make.** Here's why:

1. **It neutralizes the "AI-generated code" critique entirely.** The code doesn't need to be perfect if 5 humans independently verify the output. The code becomes a *tool* the auditors use, not the final authority.

2. **It creates a governance moat.** Anyone can copy your code (it's open source). Nobody can copy your auditor network. The 5 seats become the scarce asset.

3. **It maps directly to EU AI Act Article 14 (Human Oversight).** The regulation literally requires human-in-the-loop for high-risk AI. Your 5 auditors ARE that loop, formalized.

### Architecture: "Sovereign Tribunal"

```text
┌─────────────────────────────────────┐
│         CURRENT PIPELINE            │
│  Commit → Challenge → Prove →       │
│  MPC (3-node, 2/3 threshold)        │
│         ↓ PASS                      │
├─────────────────────────────────────┤
│      NEW: SOVEREIGN TRIBUNAL        │
│                                     │
│  Auditor 1 ──┐                      │
│  Auditor 2 ──┤                      │
│  Auditor 3 ──┼── 3-of-5 threshold   │
│  Auditor 4 ──┤    to RATIFY         │
│  Auditor 5 ──┘                      │
│         ↓ RATIFIED                  │
├─────────────────────────────────────┤
│  Certificate issued with:           │
│  - MPC consensus signature          │
│  - 3+ auditor Ed25519 signatures    │
│  - Timestamp + ratification hash    │
└─────────────────────────────────────┘
```

### Implementation Plan

**A. Database: `tribunal_reviews` table**
- `commit_id`, `auditor_id` (uuid → auth.users), `verdict` (approve/reject/abstain), `rationale` (text), `auditor_signature` (Ed25519 hash of their verdict), `created_at`
- RLS: auditors can only insert/read their own reviews; public can read aggregate verdicts (not rationale)

**B. Database: `tribunal_auditors` table**
- `user_id`, `auditor_name`, `organization`, `jurisdiction` (e.g., "EU", "AU", "US"), `public_key` (their Ed25519 public key), `status` (active/suspended), `appointed_by` (admin only)
- RLS: admin-only writes, public reads (transparency)

**C. Edge function: `tribunal-submit`**
- Authenticated endpoint for registered auditors
- Accepts: commit_id, verdict, rationale
- Signs the verdict with the auditor's session, stores in `tribunal_reviews`
- When 3-of-5 approve → auto-updates the ledger entry phase to `RATIFIED`
- Generates a `ratification_hash` = SHA-256 of all approving auditor signatures concatenated

**D. Edge function: `tribunal-status`**
- Public endpoint: given a commit_id, returns how many auditors have voted, the aggregate verdict, and whether ratification threshold is met
- No rationale exposed publicly (auditor privacy)

**E. UI: Auditor Dashboard (new page `/tribunal`)**
- Shows pending commits awaiting review
- Each commit displays: the action, predicate, MPC result, Merkle proof
- Auditor clicks Approve/Reject with mandatory rationale
- Their verdict is Ed25519-signed client-side before submission

**F. Update Certificate Generation**
- Certificates now show: "Verified by 3-node MPC consensus AND ratified by X/5 independent auditors"
- Include auditor public keys on the certificate for independent verification

### Who Should the 5 Auditors Be?

Pick for **jurisdictional coverage and credibility**:
1. **EU jurisdiction** — someone with GDPR/AI Act expertise
2. **Australian jurisdiction** — for NDIS and local regulatory credibility
3. **US jurisdiction** — NIST AI RMF alignment
4. **Technical auditor** — a developer/cryptographer who verifies the math
5. **Industry representative** — someone from the sector being verified (pharma, finance, etc.)

This way, when you present to CEN-CENELEC or