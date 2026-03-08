

## APEX Digital Gallows — AI Compliance Gateway Dashboard

Your critique is exactly right. The previous plan was pseudocode theater. This plan builds a **real, working compliance verification engine** using actual Web Crypto API hashing, real `performance.now()` timing, and deterministic predicate matching — no fictional imports, no hand-waving.

### What Gets Built

A single-page terminal-style dashboard that replaces the current marketing site. Users type an AI action, select an EU AI Act predicate, and the system runs a real compliance check with cryptographic audit output.

### Architecture

```text
src/
├── lib/gallows-engine.ts          ← Real engine, real crypto
├── pages/Index.tsx                 ← Dashboard (replaces marketing site)
├── components/gallows/
│   ├── GallowsHeader.tsx          ← Title + system status
│   ├── GatewayInput.tsx           ← Textarea + predicate selector + execute button
│   ├── VerificationResult.tsx     ← APPROVED/BLOCKED verdict with hash + timing
│   ├── AuditTrailLog.tsx          ← Session-persistent table of all checks
│   └── PredicateRegistry.tsx      ← 4 predicates with real hashes, LOCKED status
└── index.css                      ← Terminal glow styles added
```

### Core Engine (`gallows-engine.ts`)

No fictional imports. Four real functions:

1. **`hashSHA256(data: string): Promise<string>`** — `crypto.subtle.digest('SHA-256', ...)` returning hex. Real hash, verifiable.

2. **`PREDICATES`** — 4 objects, each with `id`, `name`, `article`, `description`, and `violationPatterns` (lowercase keyword arrays):
   - `EU_ART_50` (Transparency): `["undisclosed ai", "no attribution", "hidden synthetic", "deepfake without label"]`
   - `EU_ART_14` (Human Oversight): `["autonomous decision", "no human review", "override human", "bypass approval"]`
   - `EU_ART_15` (Accuracy): `["unverified data", "no validation", "untested model", "fabricated"]`
   - `EU_ART_52` (Disclosure): `["impersonate human", "pretend to be person", "hide ai identity", "no bot disclosure"]`

3. **`checkCompliance(action, predicateId): boolean`** — Lowercases action text, checks if any violation pattern substring exists. Returns `true` if clean, `false` if violation found.

4. **`runGallows(action, predicateId): Promise<GallowsResult>`** — Starts `performance.now()` timer, runs compliance check, hashes `action + predicateId + ISO timestamp + result` via `hashSHA256`, returns `{ status, verificationTimeMs, auditHash, predicateId, timestamp, actionSummary }`.

### Visual Design

- Background `#0a0a0a`, text `#e0e0e0`, all technical output in `font-mono`
- APPROVED: `#00ff41` with `box-shadow: 0 0 20px rgba(0,255,65,0.5)`
- BLOCKED: `#ff0040` with `box-shadow: 0 0 20px rgba(255,0,64,0.5)`
- "APEX DIGITAL GALLOWS" header with CSS pulse animation
- Uses existing shadcn components: Card, Table, Select, Button, Badge, Textarea

### Dashboard Layout

- **Header**: Title with pulse, subtitle, green "SYSTEM ACTIVE" dot
- **Left panel**: Textarea (placeholder shows sample compliant action), predicate dropdown (4 options), "EXECUTE GALLOWS" button
- **Right panel**: Verdict badge (large, glowing), verification time in ms, full SHA-256 audit hash in monospace, semantic explanation of result
- **Bottom**: Audit trail table — Timestamp, Action (truncated), Predicate, Status badge (color-coded), Audit Hash. Newest first. Persisted in React state.
- **Side panel**: Predicate Registry — each predicate shows ID, article name, SHA-256 hash of its definition (computed on mount via Web Crypto), and "LOCKED" with lock icon

### What Changes

| File | Action |
|------|--------|
| `src/lib/gallows-engine.ts` | **Create** — engine with real crypto |
| `src/components/gallows/*.tsx` (5 files) | **Create** — dashboard components |
| `src/pages/Index.tsx` | **Replace** — swap marketing site for dashboard |
| `src/index.css` | **Append** — terminal glow utilities + pulse keyframes |

All other pages (auth, dashboard, partner, legal) remain untouched. The existing marketing components stay in the codebase but are no longer imported by Index.

