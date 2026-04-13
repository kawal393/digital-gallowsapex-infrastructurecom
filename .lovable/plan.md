

## Plan: Strategic Response — Competitive Hardening + Market Position

### Context

Three direct competitors have emerged in cryptographic AI governance (GuardianChain, Attested Intelligence, Aegis). APEX PSI still holds architectural advantages (IETF draft, MPC consensus, predicate engine, ZKML) but needs to close gaps in public visibility: NIST/CISA mappings, sealed capsule metrics, and published control frameworks.

### What to Build

**1. NIST AI RMF + CISA Control Mapping Page**
- New `/standards` page showing how each of the 55 PSI predicates maps to specific NIST AI 100-1 controls and CISA guidelines
- Interactive table: Predicate → NIST Control → ISO 42001 Clause → EU AI Act Article
- This directly counters Attested Intelligence's published mappings

**2. Live Protocol Metrics Dashboard**
- Add a real-time counter on the homepage showing total commits processed, verifications completed, and certificates issued
- Query the existing `psi_ledger` and `psi_commits` tables for actual counts
- Display: "X,XXX governance artifacts sealed" — directly competitive with GuardianChain's "64,000+ capsules" claim

**3. Competitive Differentiation Section**
- Update the Compare page with a new "Cryptographic Governance" category
- Add GuardianChain and Attested Intelligence as named competitors alongside the existing checklist vendors
- Show the architectural differences: single-signer vs MPC consensus, single-chain vs Bitcoin anchoring, no predicates vs 55+ predicates

**4. Agentic AI Runtime Governance**
- Expand the existing Agent Monitor component to show "Cryptographic Runtime Governance" capabilities
- Add terminology that matches the emerging category language (CRG, sealed artifacts, runtime attestation)
- This positions APEX PSI in the same category Attested Intelligence is trying to own

**5. Homepage Stats Update**
- Update VisionSection stats from "35 Predicates" to "55 Predicates" and "7 Jurisdictions" to "12 Jurisdictions"
- Add a "Governance Artifacts Sealed" counter

### Files to Create/Modify
- Create `src/pages/Standards.tsx` — NIST/ISO/CISA mapping page
- Modify `src/pages/Compare.tsx` — add cryptographic governance competitors
- Modify `src/components/VisionSection.tsx` — update stats
- Modify `src/components/TechSpecs.tsx` — update predicate/jurisdiction counts
- Modify `src/components/dashboard/AgentMonitor.tsx` — add CRG terminology
- Modify `src/App.tsx` — add /standards route

### Why This Order
Revenue (NDIS Consumer Shield) ships first. These changes are defensive positioning to ensure that when the open protocol launches, APEX PSI is already the most complete, most mapped, most referenced standard in the space — making competitor adoption a downgrade rather than an alternative.

