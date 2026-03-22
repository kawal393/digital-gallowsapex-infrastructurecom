

# Brutal Audit: Claude/Nil Claw is WRONG About Mock Signatures

## The Actual State of the Code

I just read every line of `supabase/functions/notarize/index.ts` and `commit-action/index.ts`. Here is the truth:

**There are NO mock signatures. There are NO mock roots.**

### What the code ACTUALLY does (line by line):

1. **SHA-256 hashing** (line 25-28): Uses `crypto.subtle.digest("SHA-256", ...)` — the real Web Crypto API. NOT a JS wrapper. This is FIPS 180-4 compliant.

2. **Ed25519 signing** (lines 36-56): Builds a real PKCS8 DER-encoded Ed25519 key from the service role secret, imports it via `crypto.subtle.importKey("pkcs8", ...)`, and signs with `crypto.subtle.sign("Ed25519", ...)`. This is RFC 8032 compliant.

3. **Merkle leaf computation** (line 147): `merkleLeaf = SHA256(receiptId | commitHash)` — real hash.

4. **Merkle root** (line 148): `merkleRoot = SHA256(merkleLeaf | timestamp)` — this is a simplified single-leaf root, not a full tree traversal. This is the ONE legitimate criticism.

5. **Fallback** (line 53-55): If Ed25519 is unavailable in the runtime (unlikely on Deno), it falls back to HMAC-style hash. But the primary path is real Ed25519.

### What Nil Claw Got Wrong

Claude was analyzing from memory of an OLDER version of the code or making assumptions. The current `notarize` function has been hardened since the initial build. The `commit-action` function was hardened even earlier with the same PKCS8 Ed25519 pattern.

### What IS Legitimately Weak (The Real Fix Needed)

1. **Merkle root is single-leaf** — `SHA256(leaf | timestamp)` is not a proper tree root computed from ALL leaves. A real auditor would note this doesn't prove inclusion against previous entries. Fix: compute root from the last N leaves in the ledger.

2. **No curl command on the /notary hero** — The docs section has it, but the hero should have a one-liner that engineers can copy in 2 seconds.

3. **Supabase project ID is hardcoded** in NotaryDocs.tsx code examples (line 9, 20, 35, 69) — should use the env variable pattern for cleanliness.

4. **No "Verify a Receipt" integration** — The receipt returns a `verify_url` but the /verify page doesn't accept receipt IDs from the notary.

---

## The Plan: Close the REAL Gaps (Not the Imaginary Ones)

### 1. Fix Merkle Root to Be a Real Cumulative Root

In `supabase/functions/notarize/index.ts`: After inserting the new leaf, query the last N leaves from `gallows_ledger` and compute a proper binary Merkle root from them. Store the real root on the new entry.

### 2. Add One-Line curl to /notary Hero

Add a copy-paste `curl` command directly in `NotaryHero.tsx` below the tagline. Engineers should see it in the first 2 seconds of landing on the page.

### 3. Remove Hardcoded Project IDs from Docs

In `NotaryDocs.tsx`, replace the hardcoded Supabase URL with a dynamic reference using the environment variable.

### 4. Add Receipt Verification to /verify Page

Allow users to paste a `receipt_id` (APEX-NTR-...) into the existing verify page and see the Merkle proof + signature validation.

---

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/notarize/index.ts` | Compute real cumulative Merkle root from ledger |
| `src/components/notary/NotaryHero.tsx` | Add instant curl command with copy button |
| `src/components/notary/NotaryDocs.tsx` | Replace hardcoded project ID with env var pattern |
| `src/pages/Verify.tsx` | Add receipt ID lookup and verification display |

