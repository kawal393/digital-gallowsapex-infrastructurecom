

## Diagnosis: The Plan Will Work — But Priority 0 (Build Fix) Must Land First

The blank white screen is caused by `react-i18next@13.5.0` augmenting React's `children` type with `ReactI18NextChildren`, which conflicts with every Radix UI component (accordion, button, dialog, drawer, context-menu, breadcrumb, etc.). Despite `skipLibCheck: true` in tsconfig, Vite's build step still catches these within your own `src/` files because the type augmentation leaks into every component that accepts `children`.

### The Fix (Priority 0)

Create a single file `src/react-i18next.d.ts`:

```typescript
import "react-i18next";
declare module "react-i18next" {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: false;
  }
}
```

This disables the problematic `ReactI18NextChildren` type augmentation at the module level. No dependency changes needed — `react-i18next@13.5.0` stays pinned. This is a well-documented fix for the exact Radix UI + react-i18next conflict shown in the build errors.

**Confidence: High.** The errors all trace to the same root cause (`ReactI18NextChildren` not assignable to `ReactNode`), and this declaration override is the canonical solution.

### After the Fix — Sovereign Engine Blueprint (Tasks 1-6)

Once the screen loads, all 6 tasks from the previous plan are implementable with zero new dependencies:

1. **Hero subtitle** — one line added to `Hero.tsx`
2. **Nav restructure** — update `navLinks` array in `Navbar.tsx`, add external GitHub link
3. **Open Source Gateway** — new component, added to Index and Protocol pages
4. **Verify page enhancements** — privacy badge + Integrity Shield visual (already uses `@noble/ed25519`)
5. **Compliance Ledger legal mapping** — tooltip/subtitle additions to `ComplianceLedger.tsx`
6. **Sector verifiers** — two new tab components on `/verify` (Pharma Sniper + NDIS Integrity)

All use existing design tokens (gold/chrome gradients, `grid-bg`, `border-glow`). No new packages required.

### Execution Order

1. Create `src/react-i18next.d.ts` → screen loads
2. Tasks 1-2 (Hero + Nav) → identity pivot complete
3. Tasks 3-4 (Open Source + Verify upgrade) → credibility layer
4. Tasks 5-6 (Ledger mapping + Sector verifiers) → regulatory utility

