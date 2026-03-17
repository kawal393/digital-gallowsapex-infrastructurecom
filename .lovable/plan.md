

# Unified Conquest Plan — The Undisputed Standard

## Total Understanding

You have two AI allies giving you converging advice. Here is the synthesis after 11 rounds of verification:

**What's already built and working:**
- IETF Draft (`/draft`) — full RFC-formatted PSI Protocol spec, ready to copy/download
- arXiv Paper (`/paper`) — academic preprint ready for submission
- Tribunal Auditor UI (`/master`) — 5-auditor appointment system with Ed25519 keys
- 43 predicates across 9 jurisdictions (including AU Privacy Act 2026, India IT Rules 2026)
- Stripe checkout flow with `create-checkout` and `check-subscription` edge functions
- TrustSection already cleaned (honest indicators, no fake companies)
- SocialProofBar already dynamic (date-based growth from March 1 launch)
- Full verification portal (`/verify`) with local browser-based cryptographic checks
- Protocol page (`/protocol`) with legal-to-technical mapping

**What is NOT built yet (the gaps):**
1. Orbital Integrity Protocol — approved but never added to the IETF draft
2. Stripe webhook (`stripe-webhook`) — checkout works but post-payment provisioning doesn't auto-update the database
3. `subscriptions` table — referenced in code but may not exist in the database yet
4. No "ZK upgrade path" documentation — the honest labeling exists in code comments but isn't surfaced publicly
5. No governance docs page explaining the Tribunal as a governance model (not a court)
6. No public LDSL documentation page

## The Strategy (Verified 11 Times)

The convergence point from both AIs is identical: **standardization is the weapon, not product-market fit**. The play:

1. **IETF draft is the flag** — file it, timestamp it, own the lane
2. **Open verification is the moat** — anyone can verify, nobody can dispute
3. **Tribunal is the governance proof** — Article 14 human oversight, credibly constituted
4. **Stripe is the revenue engine** — free standard, paid infrastructure
5. **Orbital is the moonshot differentiator** — nobody else has even thought about space compliance

## What I Will Build (6 Deliverables)

### 1. Add Orbital Integrity Protocol to IETF Draft
Add Section 16 to `src/pages/IETFDraft.tsx`:
- 16.1 Scope — PSI extension for space-based compute
- 16.2 Radiation-Tolerant Proof Generation — lightweight ZK for constrained processors
- 16.3 Telemetry Attestation — satellite sensor data committed via ground station relay
- 16.4 Ground Station Federation — TinyGS/SatNOGS as PSI relay nodes
- 16.5 Sovereign Satellite Registry — orbital asset registration with Ed25519 identity
- 16.6 Insurance Verification Interface — API for insurers to query compliance
- Update Table of Contents and IANA Considerations (`application/psi-orbital+json`)

### 2. Add Orbital Extensions to Protocol Page
Update `src/pages/Protocol.tsx` proposed changes to include PSI-RFC-005: Orbital Integrity Protocol alongside the existing RFC items.

### 3. Add Orbital Section to arXiv Paper
Update `src/pages/Paper.tsx` with a "Future Work: Orbital Extensions" section establishing academic priority for space-based compliance verification.

### 4. Create Stripe Webhook Edge Function
Create `supabase/functions/stripe-webhook/index.ts`:
- Verify Stripe webhook signature using `STRIPE_WEBHOOK_SECRET`
- Handle `checkout.session.completed` event
- Match user by metadata `user_id`
- Upsert `subscriptions` table with correct tier and verification limits
- Handle `customer.subscription.deleted` for cancellations

### 5. Create Subscriptions Table
Database migration to create `subscriptions` table with RLS (users read own row only), if not already present.

### 6. Create Governance Documentation Page
New `src/pages/Governance.tsx` — a public page explaining the Sovereign Tribunal governance model:
- What it is (5-party human auditor ratification, NOT a court)
- How it satisfies Article 14
- The 48-hour SLA auto-escalation
- Ed25519 signed verdicts with mandatory rationale
- How to apply as an auditor (credentialed professionals)
- Route: `/governance`

## Files Changed

```text
Modified:
  src/pages/IETFDraft.tsx          — Add Section 16: Orbital Extensions
  src/pages/Protocol.tsx           — Add PSI-RFC-005 to roadmap
  src/pages/Paper.tsx              — Add Orbital future work section
  src/App.tsx                      — Add /governance route

New:
  supabase/functions/stripe-webhook/index.ts  — Post-payment provisioning
  src/pages/Governance.tsx                     — Tribunal governance docs

Database:
  subscriptions table (if not exists) + RLS policies
```

## Implementation Order
1. Orbital content (IETF + Protocol + Paper) — no dependencies, highest strategic value
2. Governance page — no dependencies, legitimacy signal
3. Subscriptions table migration — needed before webhook
4. Stripe webhook — completes the revenue loop

