# @apex/gallows-sdk

> **Runtime AI compliance verification — Block non-compliant AI actions before they reach users.**

Part of the [APEX PSI Protocol](https://digital-gallowsapex-infrastructurecom.lovable.app/protocol) — the sovereign standard for verifiable AI governance.

---

## What This Does

The Gallows SDK is the enforcement layer of APEX PSI. It sits between your AI system and your users, cryptographically verifying every output against regulatory predicates **before** it ships.

- **Commit** — SHA-256 hash + Merkle tree inclusion proof for every AI action
- **Challenge** — Regulators flag specific outputs for verification
- **Prove** — ZK-SNARK fraud proofs generated on demand
- **Block** — Non-compliant outputs stopped at the gate

---

## Install

```bash
npm install @apex/gallows-sdk
```

---

## Usage

### Basic Verification

```typescript
import { ApexGallows } from '@apex/gallows-sdk';

const gallows = new ApexGallows({
  endpoint: 'https://your-instance.apex.dev/functions/v1',
  predicates: ['EU_ART_14', 'EU_ART_50'],
  mode: 'blocking',
});

const result = await gallows.verify(
  'AI-generated financial advice without risk disclosure',
  'MIFID_ART_25'
);

console.log(result.compliant);      // false
console.log(result.status);         // 'BLOCKED'
console.log(result.violationFound); // 'no suitability check'
console.log(result.commitHash);     // SHA-256 hash chain entry
console.log(result.merkleProof);    // Cryptographic inclusion proof
```

### Express Middleware

```typescript
import express from 'express';
import { ApexGallows } from '@apex/gallows-sdk';

const app = express();
const gallows = new ApexGallows({
  endpoint: process.env.APEX_ENDPOINT!,
  mode: 'blocking',
});

app.use('/api/ai', gallows.middleware({
  predicates: ['EU_ART_14', 'EU_ART_50', 'MIFID_ART_25'],
  mode: 'blocking',
  onViolation: (result, req, res) => {
    res.status(451).json({
      error: 'AI response blocked for regulatory compliance',
      predicate: result.predicateId,
      violation: result.violationFound,
      commitId: result.commitId,
    });
  },
}));
```

### Local Pre-flight (Sub-1ms)

```typescript
const check = gallows.checkLocal(
  'Deploy facial recognition in public spaces',
  'EU_ART_5'
);
// { compliant: false, violationFound: 'biometric identification public' }
```

---

## Predicate Registry

### EU AI Act
| ID | Article | Risk Level |
|---|---|---|
| `EU_ART_5` | Prohibited Practices | UNACCEPTABLE |
| `EU_ART_6` | High-Risk Classification | HIGH |
| `EU_ART_9` | Risk Management | HIGH |
| `EU_ART_10` | Data Governance | HIGH |
| `EU_ART_11` | Technical Documentation | HIGH |
| `EU_ART_12` | Record-Keeping | HIGH |
| `EU_ART_13` | Transparency to Users | HIGH |
| `EU_ART_14` | Human Oversight | HIGH |
| `EU_ART_15` | Accuracy & Robustness | HIGH |
| `EU_ART_50` | Transparency Obligations | LIMITED |
| `EU_ART_52` | Disclosure Obligations | LIMITED |
| `EU_ANNEX_III` | High-Risk Classification | HIGH |

### MiFID II
| ID | Article | Focus |
|---|---|---|
| `MIFID_ART_16` | Organisational Requirements | Algo controls |
| `MIFID_ART_17` | Algorithmic Trading | Market integrity |
| `MIFID_ART_25` | Suitability | Client protection |
| `MIFID_ART_27` | Best Execution | Order handling |

### DORA
| ID | Article | Focus |
|---|---|---|
| `DORA_ART_5` | ICT Risk Management | Cyber resilience |
| `DORA_ART_6` | ICT Systems | System maintenance |
| `DORA_ART_9` | Detection | Threat monitoring |
| `DORA_ART_11` | Response & Recovery | Disaster recovery |
| `DORA_ART_17` | Incident Reporting | Transparency |
| `DORA_ART_26` | Third-Party Risk | Vendor assessment |

### NIST AI RMF (United States)
| ID | Function | Focus |
|---|---|---|
| `NIST_MAP_1` | Map | Context & stakeholders |
| `NIST_MEASURE_2` | Measure | Bias & fairness testing |
| `NIST_MANAGE_3` | Manage | Risk treatment |
| `NIST_GOVERN_1` | Govern | AI governance policy |

### UK AI Safety Institute
| ID | Standard | Focus |
|---|---|---|
| `UK_AISI_1` | Safety Testing | Deployment safety |
| `UK_AISI_2` | Evaluation Framework | Capability assessment |
| `UK_AISI_3` | Alignment | Goal alignment |

### Canada Bill C-27 (AIDA)
| ID | Section | Focus |
|---|---|---|
| `CA_AIDA_5` | Impact Assessment | High-impact review |
| `CA_AIDA_6` | Mitigation | Harm mitigation |
| `CA_AIDA_7` | Transparency | Public disclosure |
| `CA_AIDA_11` | Record-Keeping | Audit records |

### NDIS (Australia)
| ID | Standard | Focus |
|---|---|---|
| `NDIS_PRACTICE` | Practice Standards | Service delivery |
| `NDIS_QUALITY` | Quality Indicators | Compliance quality |

---

## Cryptographic Specifications

| Component | Standard |
|---|---|
| Hash Function | SHA-256 |
| Signatures | Ed25519 |
| Canonicalization | RFC 8785 (JCS) |
| Inclusion Proofs | Merkle Trees |
| Sequencing | Monotonic (gap-free) |
| Consensus | 3-Node MPC, 2-of-3 threshold |

---

## License

**MIT** — The math is free. Inspect everything.

© APEX Intelligence Empire
