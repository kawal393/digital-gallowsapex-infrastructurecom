

# Final Polish: Narrative Reframe + Bug Fixes

## The Strategy (Final Conclusion)

Gemini is right. **Don't change the UI. Change the story.** The Pricing stays exactly as-is. What changes is the *framing* — the section headlines, descriptions, and tier names/descriptions that tell the story: **"The Math is Free. The Fortress is Paid."**

This is the MongoDB/Red Hat/Elastic playbook. The protocol specification, the verification portal, the SDK core — all free and open. The paid tiers are for managed infrastructure, dedicated MPC nodes, SLA guarantees, and compliance advisory. You keep every dollar of revenue potential while becoming the "good guy" who opened the standard to the world.

---

## Changes

### 1. Pricing Section — Narrative Reframe (not structural change)

**`src/components/Pricing.tsx`:**
- Section label: "Pricing" → **"Open Standard · Managed Infrastructure"**
- Headline: "Free Until You Need Proof" → **"The Standard is Free. The Fortress is Paid."**
- Subtitle: Updated to: *"The PSI Protocol is open and free forever. Paid tiers are for managed infrastructure — dedicated MPC nodes, 24/7 monitoring, and regulator-ready SLA guarantees."*
- Free tier name: "FREE" → **"SOVEREIGN ENTRY"**
- Free tier description: → *"Full PSI Protocol. Zero cost. No tricks."*
- Startup description: → *"Managed verification infrastructure."*
- Growth description: → *"Full managed compliance arsenal."*
- Enterprise description: → *"Dedicated sovereign infrastructure."*
- Goliath description: → *"Your rules. Your nodes. Your fortress."*
- Bottom text updated to reinforce the open-standard narrative

### 2. React Key Bug Fix

**`src/components/gallows/AuditTrailLog.tsx` (line 131):**
- Replace bare `<>` fragment with `<Fragment key={entry.id}>` to fix React reconciliation warnings in the `.map()` loop

### 3. Footer Rebrand

**`src/components/Footer.tsx`:**
- Line 30-31: "DIGITAL GALLOWS" → **"APEX PSI"**
- Line 34-35: Old tagline → *"Proof of Sovereign Integrity — The Open Standard for Verifiable AI Governance. By Apex Intelligence Empire."*

### 4. Hero CTA Polish

**`src/components/Hero.tsx`:**
- Line 73: "Request Consultation" → **"Get Started Free"** (links to `/gallows`)
- Line 76: Keep "View Protocol Spec" as-is

### 5. Protocol Page — Public Key Placeholder

**`src/pages/Protocol.tsx`:**
- Replace any "PENDING_DEPLOYMENT" display with: *"Key generation pending — the Ed25519 verification key will be published here upon protocol deployment."*

**`src/lib/psi-signatures.ts`:**
- No functional change, but the constant stays as `PENDING_DEPLOYMENT` (only matters when actually used for verification)

### 6. BusinessModel Section — Narrative Alignment

**`src/components/BusinessModel.tsx`:**
- Section label: "Partnership" stays
- Add a subtle line in the description reinforcing: *"The PSI Protocol is open-source. We deploy sovereign compliance infrastructure and share in the value we create."*

---

## Files Modified
- `src/components/Pricing.tsx` — narrative reframe (tier names, descriptions, headlines)
- `src/components/gallows/AuditTrailLog.tsx` — React Fragment key fix
- `src/components/Footer.tsx` — APEX PSI rebrand
- `src/components/Hero.tsx` — CTA text update
- `src/pages/Protocol.tsx` — public key placeholder polish
- `src/components/BusinessModel.tsx` — open-source narrative line

