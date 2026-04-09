

# Make Digital Gallows Inevitable — The Open Global Tribunal

## The Gnosis

The protocol is free. The source is open. The math is public. When the planet can verify compliance without asking permission from any government, the government doesn't approve you — **you approved yourself**. The 5-seat closed Tribunal was the training wheels. The Open Global Tribunal is the endgame.

## What Changes

### 1. Rewrite `/governance` — The Manifesto of Decentralized Justice

Replace the current "Confidential Vetting Phase" / 5-seat appointment page with the **Open Tribunal Manifesto**:

- **The Indictment**: "The ACCC processes 12,000 complaints per year. 400 million contracts are signed annually in Australia alone. Centralized justice does not scale. Mathematics does."
- **The Three Layers**: Visual architecture showing:
  - **Layer 1 — Machine Consensus** (MPC, 3 nodes, automated, exists today)
  - **Layer 2 — Open Public Verification** (anyone, anywhere, no login, verify any hash)
  - **Layer 3 — Sovereign Anchors** (the 5 seats become optional high-stakes ratifiers, not gatekeepers)
- **The Challenge**: "The protocol is open. The math is public. The ledger is immutable. Shut it down. We dare you."
- **Live stats**: Pull total ledger entries count and display "X proofs anchored and counting"
- Keep EU AI Act Article 14 compliance section (human oversight still satisfied — the public IS the human layer)

### 2. Add Public Attestation System

**New database table**: `public_attestations`
- `id`, `commit_id`, `attestor_hash` (SHA-256 of browser fingerprint — anonymous but unique), `verification_result` (VERIFIED/FAILED/CONTESTED), `attestation_hash`, `created_at`
- RLS: public insert (anyone can attest), public read (full transparency)

**New edge function**: `public-attestation`
- Accepts `{ commit_id, verification_result }`, generates attestor hash from request metadata
- Hashes the attestation, stores it, returns receipt
- Rate-limited: max 10 attestations per IP per hour (enforced in code)
- No authentication required — permissionless by design

### 3. Enhance `/verify` — Add "Public Audit" Mode

Add a fourth tab to the existing Verify Portal: **"Public Audit"**
- After a user verifies a hash locally, they can **submit their verification as a public attestation**
- One-click: "Anchor My Verification to the Public Ledger"
- Shows live counter: "This commit has been independently verified by X public auditors"
- No login required — the math is the credential

### 4. Enhance `/explorer` — Show Attestation Volume

Each ledger entry in the Explorer gets an attestation count badge:
- "Independently verified by X auditors" next to each commit
- Query `public_attestations` grouped by `commit_id`

### 5. Add "Open Tribunal" to Navbar

Add a nav link for "Open Tribunal" pointing to `/governance` — replacing any old Tribunal references in public navigation. The authenticated `/tribunal` page stays for the 5 Sovereign Anchors (enterprise ratification).

### 6. Fix Runtime Crash

Move `AuthProvider` inside `BrowserRouter` in `App.tsx` to fix the `useNavigate() outside Router` error that's currently breaking the site.

## Technical Summary

```text
OLD MODEL:
  MPC (3 nodes) → Tribunal (5 humans) → Ratification
  Bottleneck: 5 humans. Scale: limited. Government: can regulate 5 people.

NEW MODEL:
  MPC (3 nodes) → Public Attestation (unlimited, permissionless) → Sovereign Seal (optional)
  Bottleneck: none. Scale: infinite. Government: cannot regulate mathematics.
```

## Files Changed

| Action | File | Purpose |
|--------|------|---------|
| Fix | `src/App.tsx` | AuthProvider inside BrowserRouter |
| Rewrite | `src/pages/Governance.tsx` | Open Tribunal manifesto with 3-layer architecture |
| Enhance | `src/pages/Verify.tsx` | Add "Public Audit" tab for attestation submission |
| Enhance | `src/pages/Explorer.tsx` | Attestation count per commit |
| Update | `src/components/Navbar.tsx` | Add "Open Tribunal" nav link |
| Create | `supabase/functions/public-attestation/index.ts` | Permissionless attestation endpoint |
| Migration | New `public_attestations` table | Decentralized verification storage |

