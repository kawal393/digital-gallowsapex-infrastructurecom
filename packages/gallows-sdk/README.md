# @apex/gallows-sdk

> Runtime AI compliance verification — Block non-compliant AI actions **before** they reach users.

## Features

- 🔒 **Cryptographic Verification** — SHA-256 commit hashes, Merkle tree inclusion proofs
- ⚡ **Sub-15ms Local Checks** — Cached pattern matching for pre-flight screening
- 🌐 **MPC Consensus** — 3-node distributed verification with 2-of-3 threshold
- 🔐 **ZK-SNARK Privacy** — Prove compliance without revealing proprietary AI actions
- 🇪🇺 **Multi-Regulatory** — EU AI Act, MiFID II, DORA predicates

## Quick Start

```bash
npm install @apex/gallows-sdk
```

```typescript
import { ApexGallows } from '@apex/gallows-sdk';

const gallows = new ApexGallows({
  endpoint: 'https://your-project.supabase.co/functions/v1',
  predicates: ['EU_ART_14', 'EU_ART_50'],
  mode: 'blocking',
});

// Verify AI output before serving
const result = await gallows.verify(
  'AI-generated financial advice without risk disclosure',
  'MIFID_ART_25'
);

console.log(result.compliant);     // false
console.log(result.status);        // 'BLOCKED'
console.log(result.violationFound); // 'no suitability check'
```

## Express Middleware

```typescript
import express from 'express';
import { ApexGallows } from '@apex/gallows-sdk';

const app = express();
const gallows = new ApexGallows({
  endpoint: process.env.APEX_ENDPOINT!,
  mode: 'blocking',
});

// Block non-compliant AI responses
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

## Local Pre-flight Check

For sub-1ms screening without network calls:

```typescript
const check = gallows.checkLocal(
  'Deploy facial recognition in public spaces',
  'EU_ART_5'
);
// { compliant: false, violationFound: 'biometric identification public' }
```

## Supported Predicates

### EU AI Act
| ID | Article | Risk Level |
|----|---------|-----------|
| EU_ART_5 | Prohibited Practices | UNACCEPTABLE |
| EU_ART_14 | Human Oversight | HIGH |
| EU_ART_50 | Transparency | LIMITED |

### MiFID II
| ID | Article | Focus |
|----|---------|-------|
| MIFID_ART_17 | Algorithmic Trading | Market integrity |
| MIFID_ART_25 | Suitability | Client protection |

### DORA
| ID | Article | Focus |
|----|---------|-------|
| DORA_ART_5 | ICT Risk Management | Cyber resilience |
| DORA_ART_17 | Incident Reporting | Transparency |

## License

MIT © Apex Intelligence Empire
