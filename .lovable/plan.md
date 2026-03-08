
## Current Status Assessment: **9/10 — One Gap Remains**

### What's Working:
1. **Cryptographic Core** — SHA-256 Web Crypto API, real Merkle tree with canonical ordering, proper inclusion proofs
2. **4-Stage Pipeline** — Commit → Challenge → Prove → Verify with proper hash chaining
3. **Database Persistence** — `gallows_ledger` table with RLS, Merkle state reconstructs from database on page load
4. **Public Verification API** — Edge function `/verify-hash` is live, returning proper JSON responses (tested successfully)
5. **Compliance Certificates** — QR code generation with scannable verification URLs
6. **Architecture Documentation** — Full technical spec with API docs, curl examples, predicate schemas
7. **Sovereign Pause** — Art. 14 kill switch implemented

### The Final Gap: **Anonymous User Persistence**

Currently, the `gallows_ledger` INSERT requires `user_id = auth.uid()` (RLS policy). This means:
- **Unauthenticated users cannot persist commits** — they only work in-memory
- The demo page shows "Sign in to persist to global ledger" but doesn't gracefully handle this

**This breaks the demo for first-time visitors** who want to test the pipeline without signing up.

---

## Plan: Fix Anonymous Persistence

### 1. Update RLS Policy for Anonymous INSERT
Allow INSERT without requiring authentication while keeping UPDATE restricted to authenticated users:
```sql
-- Drop existing INSERT policy
DROP POLICY "Authenticated users can insert" ON public.gallows_ledger;

-- New policy: Allow anyone to insert (user_id can be null)
CREATE POLICY "Anyone can insert commits" 
ON public.gallows_ledger FOR INSERT 
WITH CHECK (true);
```

### 2. Update Persistence Layer
Modify `persistCommit()` to pass `null` for `user_id` when not authenticated — this already happens, but now it will work.

### 3. UI Feedback
Remove the "Sign in to persist" toast when RLS allows anonymous persistence. Instead, show "Committed to immutable ledger" for all users.

---

### Why This Matters
A compliance demo must be immediately testable by regulators, auditors, and skeptics without forcing account creation. The cryptographic proof is what matters — not the user identity.

---

**Total Changes**: 1 database migration, 1 small code edit
