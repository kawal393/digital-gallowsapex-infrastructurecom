

# What I Can Fix — Full Audit

## Critical Security Fixes (3 issues)

### 1. Subscriptions table: Anyone can create/modify any subscription
The `subscriptions` table has INSERT and UPDATE policies with `WITH CHECK (true)` applied to the public role. Any user can give themselves an enterprise subscription with unlimited verifications. This is a **privilege escalation vulnerability**.

**Fix:** Drop the permissive INSERT/UPDATE policies. The service role (used by edge functions) already bypasses RLS — no public write policies are needed.

### 2. Gallows ledger: Anonymous users can insert fake records
The `gallows_ledger` INSERT policy uses `WITH CHECK (true)` on the public role. Anyone can pollute the compliance ledger with fabricated data.

**Fix:** Restrict INSERT to authenticated users with `auth.uid() = user_id`.

### 3. Translation cache: Anonymous users can overwrite translations
The `translation_cache` INSERT/UPDATE policies are wide open. Anyone can inject malicious translations.

**Fix:** Drop public INSERT/UPDATE policies. Only the edge function (service role) should write translations.

### 4. Leaked password protection disabled
Users can sign up with passwords known to be in data breaches.

**Fix:** Enable leaked password protection via auth configuration.

---

## Frontend Fixes (4 issues)

### 5. Partner hero shows fake "150+ partners" claim
`PartnerHero.tsx` line: "Join 150+ partners earning with APEX" — this is a hardcoded fabricated number.

**Fix:** Replace with honest copy like "Join our partner program" or "Start earning with APEX".

### 6. Partner CTA repeats the same fabrication
`PartnerCTA.tsx` also claims partner numbers that don't exist.

**Fix:** Remove specific numbers, keep the value proposition.

### 7. Missing JSON-LD structured data
No structured data for search engines. Hurts SEO for a compliance product that needs to be discoverable.

**Fix:** Add Organization + SoftwareApplication JSON-LD schema to `index.html`.

### 8. OG URL mismatch
`index.html` has `og:url` pointing to the lovable.app subdomain, but `canonical` points to `digital-gallows.apex-infrastructure.com`. These should match.

**Fix:** Align og:url with the canonical URL.

---

## Summary

| # | Issue | Severity | Effort |
|---|-------|----------|--------|
| 1 | Subscriptions privilege escalation | Critical | 1 migration |
| 2 | Gallows ledger open writes | High | 1 migration |
| 3 | Translation cache open writes | Medium | 1 migration |
| 4 | Leaked password protection | Medium | 1 config change |
| 5 | Fake partner count in hero | Low | Text edit |
| 6 | Fake partner count in CTA | Low | Text edit |
| 7 | Missing JSON-LD | Low | Add to index.html |
| 8 | OG URL mismatch | Low | Fix meta tag |

All fixes can be done in a single pass. Security fixes first, then frontend cleanup.

