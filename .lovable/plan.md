

# Clean Orbital + Build APEX NOTARY

## What I'm Building and Why

### 1. Remove Apex Orbital (Credibility Surgery)

Orbital references exist in **10 files** across the codebase. Every technical expert who reads "radiation-tolerant ZK proofs on ARM Cortex-M satellites" will dismiss the entire project. It undermines the real, working cryptographic infrastructure.

**Verification source:** Our own prior analysis confirmed Orbital is rank 1/10 as a business venture. Satellites fall under the launching state's jurisdiction (Outer Space Treaty 1967, Article VIII), destroying the "beyond jurisdiction" claim. Launch costs ($500K+ per cubesat) with zero revenue path. Keeping it on the site risks the "vaporware" label we've been fighting to shed.

**Files to clean:**
- `src/components/gallows/GatewayInput.tsx` — Remove "ORBITAL REGISTRY ID" field
- `src/components/gallows/VerificationResult.tsx` — Remove Orbital Registry ID display and text
- `src/components/Pricing.tsx` — Remove "Orbital Registry entry" from certification features
- `src/pages/Protocol.tsx` — Remove PSI-RFC-005 (OIP) from roadmap
- `src/pages/Paper.tsx` — Remove Section 8 "FUTURE WORK: ORBITAL EXTENSIONS" and trim Conclusion's orbital references
- `src/pages/IETFDraft.tsx` — Remove Section 14.7 (Orbital Attack Vectors), Section 16 (entire OIP), orbital IANA entries, orbital URI schemes
- `src/pages/Research.tsx` — Remove "Orbital Registry" from description
- `src/pages/Governance.tsx` — Remove "Orbital Registry integrity" from jurisdiction focus

**What replaces it:** Nothing. Clean removal. The remaining infrastructure (Merkle trees, Ed25519, MPC consensus, Tribunal) is real and doesn't need mythological decoration.

---

### 2. Build APEX NOTARY — "The Viral Hook"

**What it is:** A public API endpoint (`POST /notarize`) that accepts any AI decision payload and returns a cryptographically signed, Merkle-anchored receipt. Think "DocuSign for AI decisions" — but with mathematical proof, not just a signature image.

**Why this is the right move (verification sources):**
- **EU AI Act Article 12** (Record-Keeping) and **Article 13** (Transparency) require documented AI decision trails. Every receipt we issue is a compliance artifact.
- **EU AI Act Article 14** (Human Oversight) requires the ability to audit AI decisions post-hoc. A Merkle-anchored receipt enables this.
- The existing `commit-action` edge function already does SHA-256 hashing, Ed25519 signing, Merkle tree insertion, and ledger persistence. NOTARY is a **thin wrapper** around infrastructure that already works.
- **Lock-in mechanism:** Every receipt references our Merkle root. To verify any receipt, you need our tree. Once 1,000 receipts exist in production systems, switching cost is infinite.

**Why I guarantee this moves us in the right direction:**
1. It's the lowest-friction entry point — a single API call, no signup required for free tier
2. It creates network effects — every receipt issued makes the Merkle tree more valuable (more leaves = harder to forge)
3. It's the "SSL certificate" model: the math is free, the trusted signature costs money
4. It directly feeds the APEX CERTIFY and APEX INSURANCE ORACLE plays (insurers can query receipt volume as a trust signal)

### NOTARY Implementation

**A. New Edge Function: `notarize`**
- `POST /notarize` — accepts JSON payload:
  ```json
  {
    "decision": "Model approved loan application #4521",
    "model_id": "gpt-4-turbo",
    "context": { "applicant_risk": "low", "amount": 50000 },
    "predicate": "EU_ART_12"  // optional, defaults to general record-keeping
  }
  ```
- Returns a signed receipt:
  ```json
  {
    "receipt_id": "APEX-NTR-A1B2C3D4",
    "timestamp": "2026-03-20T...",
    "decision_hash": "sha256:...",
    "merkle_leaf": "sha256:...",
    "merkle_root": "sha256:...",
    "ed25519_signature": "...",
    "verify_url": "https://digital-gallows.com/verify?id=APEX-NTR-A1B2C3D4",
    "predicate_applied": "EU_ART_12",
    "receipt_version": "PSI-1.2"
  }
  ```
- Reuses existing `commit-action` logic (SHA-256, Ed25519, Merkle insertion, ledger persistence)
- Rate limited: 100 free receipts/day per IP, then requires API key
- Stores in `gallows_ledger` with a new action prefix (`NOTARIZE:`)

**B. New Database Table: `notary_api_keys`**
- `id`, `user_id`, `api_key` (hashed), `name`, `tier` (free/pro/enterprise), `daily_limit`, `daily_used`, `last_reset`, `created_at`
- RLS: users can only read/manage their own keys
- Free tier: 100/day. Pro: 10,000/day. Enterprise: unlimited.

**C. New Page: `/notary`**
A "larger than life" landing page with:
- Hero: "Every AI Decision. Mathematically Notarized." with the receipt visualization
- Live demo: paste a JSON payload, get a real signed receipt back instantly
- API documentation with code examples (curl, Python, Node.js, Go)
- Pricing tiers (Free 100/day → Pro → Enterprise)
- "Verify a Receipt" tool — paste a receipt ID, see the Merkle proof
- Integration with existing `/verify` infrastructure

**D. Add to Navbar and Index page**
- Add NOTARY link to main navigation
- Add a NOTARY CTA section on the homepage (between TechSpecs and Pricing)

**E. SDK Extension**
- Add `notarize()` method to the existing `@apex/gallows-sdk` package documentation on the `/sdk` page

---

## Brutal Self-Criticism: What Could Go Wrong

1. **Volume chicken-and-egg:** A Merkle tree with 3 leaves isn't impressive. We need to seed it with synthetic but legitimate test entries to demonstrate density.
2. **Free tier abuse:** Bots could spam 100 receipts/day to pollute the ledger. Mitigation: rate limiting + requiring valid JSON schema.
3. **Legal status of a "notarized" AI receipt:** It's not a legal notarization. We must be precise: "Cryptographic attestation" not "Notarization" in legal contexts. The brand name NOTARY is fine for marketing.

---

## File Summary

```text
Remove Orbital from:
  src/components/gallows/GatewayInput.tsx
  src/components/gallows/VerificationResult.tsx
  src/components/Pricing.tsx
  src/pages/Protocol.tsx
  src/pages/Paper.tsx
  src/pages/IETFDraft.tsx
  src/pages/Research.tsx
  src/pages/Governance.tsx

New files:
  supabase/functions/notarize/index.ts
  src/pages/Notary.tsx
  src/components/notary/NotaryHero.tsx
  src/components/notary/NotaryDemo.tsx
  src/components/notary/NotaryDocs.tsx
  src/components/notary/NotaryPricing.tsx
  src/components/notary/ReceiptVisualizer.tsx

Modified files:
  src/App.tsx              — Add /notary route
  src/components/Navbar.tsx — Add NOTARY nav link
  src/pages/Index.tsx      — Add NotaryCTA section
  src/pages/SDK.tsx         — Add notarize() docs
  Database migration        — notary_api_keys table
```

## Implementation Order
1. Remove all Orbital references (8 files)
2. Create `notary_api_keys` table via migration
3. Build `notarize` edge function (reusing commit-action patterns)
4. Build `/notary` page with hero, live demo, API docs, pricing
5. Add receipt verification to existing `/verify` page
6. Wire into navigation and homepage

