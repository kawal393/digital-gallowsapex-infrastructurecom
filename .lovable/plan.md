

## Analysis

This project (Digital Gallows) **already has** a `sovereign-lattice` edge function deployed with `node-status`, `ingest-event`, and `ledger-snapshot` actions, plus the `APEX_LATTICE_KEY` secret and `config.toml` entry. The function is live and was previously tested successfully.

The user's message contains **instructions to paste into the Digital Gallows chat** — but this IS Digital Gallows. The function already exists and covers the requested functionality (and more).

However, the user's spec requests a `?action=ping` endpoint (simple alive check) and uses a different secret value (`apex-sovereign-lattice-key-2025` vs the current `APEX_LATTICE_KEY_2024_SL_f8a3c7d9e2b1`). The current function also requires auth for ALL actions, whereas the spec wants `ping` to be unauthenticated.

## Plan

**Update the existing `sovereign-lattice` edge function** to align with the Apex Bounty integration spec:

1. **Add `?action=ping` handler** — unauthenticated, returns `{ status: "alive", node: "digital-gallows", timestamp }`. Move it BEFORE the auth check so any node can verify liveness without credentials.

2. **Enhance `ingest-event`** — accept the specified body fields (`source_node`, `event_type`, `title`, `description`, `severity`, `payload`, `timestamp`) and store them structured in `lattice_config`.

3. **Update `APEX_LATTICE_KEY` secret** — set to `apex-sovereign-lattice-key-2025` to match what Apex Bounty will send.

No database or config.toml changes needed — those are already in place.

### Files to modify
- `supabase/functions/sovereign-lattice/index.ts` — add `ping` action before auth gate, update `ingest-event` to log structured fields

### Secret to update
- `APEX_LATTICE_KEY` → `apex-sovereign-lattice-key-2025`

