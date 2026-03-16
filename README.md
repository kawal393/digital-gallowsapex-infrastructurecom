<p align="center">
  <img src="public/apex.svg" width="120" alt="APEX PSI" />
</p>

<h1 align="center">APEX PSI Protocol</h1>
<h3 align="center">The Sovereign Standard for Verifiable AI Governance</h3>

<p align="center">
  <strong>Prescriptive Enforcement · Not Descriptive Governance</strong>
</p>

<p align="center">
  <a href="https://digital-gallowsapex-infrastructurecom.lovable.app">Live Platform</a> ·
  <a href="https://digital-gallowsapex-infrastructurecom.lovable.app/protocol">Protocol Spec (LDSL v1.1)</a> ·
  <a href="https://digital-gallowsapex-infrastructurecom.lovable.app/gallows">Verification Engine</a> ·
  <a href="https://digital-gallowsapex-infrastructurecom.lovable.app/verify">Verify a Proof</a>
</p>

<p align="center">
  <code>RFC 8785 (JCS) · Ed25519 Signatures · SHA-256 Hash Chains · Monotonic Sequencing</code>
</p>

---

## The Situation

Governments demanded AI transparency. AI companies refused to open up. Regulators wrote laws no one could follow. **The industry froze.**

We didn't wait.

We open-sourced the math. Built sovereign verification. Made compliance provable without disclosure. No committee. No permission. **Just code.**

> *"We don't talk about becoming the standard. We maintain it."*

---

## What This Is

**APEX PSI (Proof of Sovereign Integrity)** is an Optimistic ZKML protocol that cryptographically proves AI compliance with the EU AI Act — without exposing proprietary models, training data, or business logic.

The architecture assumes compliance by default (**Optimistic**) and generates expensive fraud proofs only when challenged — reducing verification costs by **99.9%** while satisfying Articles 12, 14, 15, and Annex III of the EU AI Act.

### The Math Is Free. The Fortress Is Paid.

| Layer | What It Does | Status |
|---|---|---|
| **Commit** | SHA-256 hash chain + Merkle tree of AI action | ✅ Live |
| **Challenge** | Regulator flags a specific output for proof | ✅ Live |
| **Prove** | ZK-SNARK fraud proof generated on demand | ✅ Live |
| **Anchor** | Optional Bitcoin/Ethereum timestamp anchoring | RFC-001 |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 APEX PSI v1.1                    │
├─────────────┬─────────────┬─────────────────────┤
│  Commit     │  Challenge  │  Prove              │
│  ─────────  │  ─────────  │  ─────────          │
│  SHA-256    │  Regulator  │  ZK-SNARK           │
│  Merkle     │  Flag       │  Fraud Proof        │
│  Ed25519    │  Scope      │  Verification       │
├─────────────┴─────────────┴─────────────────────┤
│              Sovereign Lattice                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Node α  │  │ Node β  │  │ Node γ  │         │
│  │ (Alpha) │  │ (Beta)  │  │ (Gamma) │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│           MPC Consensus (2-of-3)                 │
├─────────────────────────────────────────────────┤
│  35 Predicates · 7 Jurisdictions · 3 Nodes      │
└─────────────────────────────────────────────────┘
```

---

## Predicate Coverage

### EU AI Act
| Predicate | Article | Risk Tier |
|---|---|---|
| `EU_ART_5` | Prohibited Practices | UNACCEPTABLE |
| `EU_ART_6` | High-Risk Classification | HIGH |
| `EU_ART_9` | Risk Management | HIGH |
| `EU_ART_10` | Data Governance | HIGH |
| `EU_ART_11` | Technical Documentation | HIGH |
| `EU_ART_12` | Record-Keeping | HIGH |
| `EU_ART_14` | Human Oversight | HIGH |
| `EU_ART_15` | Accuracy & Robustness | HIGH |
| `EU_ART_50` | Transparency | LIMITED |
| `EU_ART_52` | Disclosure Obligations | LIMITED |
| `EU_ANNEX_III` | High-Risk Classification | HIGH |

### MiFID II · DORA · NDIS
| Predicate | Regulation | Focus |
|---|---|---|
| `MIFID_ART_17` | MiFID II | Algorithmic Trading |
| `MIFID_ART_25` | MiFID II | Suitability |
| `DORA_ART_5` | DORA | ICT Risk Management |
| `DORA_ART_17` | DORA | Incident Reporting |
| `NDIS_PRACTICE` | NDIS Standards | Practice Standards |
| `NDIS_QUALITY` | NDIS Standards | Quality Indicators |

---

## Quick Start

```bash
npm install @apex/gallows-sdk
```

```typescript
import { ApexGallows } from '@apex/gallows-sdk';

const gallows = new ApexGallows({
  endpoint: 'https://your-instance.apex.dev/functions/v1',
  predicates: ['EU_ART_14', 'EU_ART_50'],
  mode: 'blocking',
});

// Verify before serving
const result = await gallows.verify(
  'AI-generated financial advice without risk disclosure',
  'MIFID_ART_25'
);

console.log(result.compliant);      // false
console.log(result.status);         // 'BLOCKED'
console.log(result.violationFound); // 'no suitability check'
console.log(result.commitHash);     // 'a3f8c2...' (SHA-256)
console.log(result.merkleProof);    // Inclusion proof
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · TypeScript · Vite · Tailwind CSS · Framer Motion |
| UI System | shadcn/ui · Radix Primitives |
| Backend | Supabase Edge Functions (Deno) |
| Cryptography | SHA-256 · Ed25519 · Merkle Trees · RFC 8785 JCS |
| Consensus | 3-Node MPC (Alpha, Beta, Gamma) · 2-of-3 Threshold |
| Database | PostgreSQL with RLS · Immutable Ledger |
| Verification | Optimistic ZKML · Fraud Proofs on Demand |

---

## Protocol RFCs

| RFC | Title | Status |
|---|---|---|
| PSI-RFC-001 | Bitcoin Timestamp Anchoring | Draft |
| PSI-RFC-002 | Formal Verification of Predicate Circuits | Draft |
| PSI-RFC-003 | Cross-Protocol Interoperability | Draft |

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## Ed25519 Public Key

For independent audit verification:

```
MCowBQYDK2VwAyEA... (published on /protocol)
```

---

## License

**MIT** — The math is free. Inspect everything.

---

<p align="center">
  <strong>APEX Intelligence Empire</strong><br/>
  <em>35 Predicates · 7 Jurisdictions · 3 Sovereign Nodes · Live</em><br/><br/>
  <code>Trust is not earned. It is verified.</code>
</p>
