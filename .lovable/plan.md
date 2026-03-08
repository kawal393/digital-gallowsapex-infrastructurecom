

## Plan: Restore Landing Page + Add Gallows as Separate Route

The original marketing site components (Hero, Navbar, Footer, ProblemSection, SolutionSection, etc.) are all still in the codebase — they just need to be wired back into Index.tsx. The Digital Gallows dashboard moves to its own route.

### Changes

**1. `src/pages/Index.tsx`** — Restore the original landing page by re-importing all marketing components (Navbar, Hero, ProblemSection, SolutionSection, TrustSection, HowItWorks, LiveCaseStudy, ComparisonTable, TechSpecs, Pricing, FAQ, ContactSection, Footer, etc.) and rendering them as before.

**2. `src/pages/Gallows.tsx`** — New page containing the current Index.tsx content (the Digital Gallows dashboard with GallowsHeader, GatewayInput, VerificationResult, PredicateRegistry, AuditTrailLog).

**3. `src/App.tsx`** — Add route: `<Route path="/gallows" element={<Gallows />} />`.

**4. Navigation link** — Add a "Digital Gallows" or "Live Demo" link in the Navbar and/or Hero section that navigates to `/gallows`, so visitors can access the compliance gateway from the landing page.

All existing gallows components and engine code remain untouched. The landing page CSS (gold/dark theme) and gallows CSS (terminal theme) are already scoped and won't conflict.

