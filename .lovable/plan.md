

## Automated Social Proof Harvester

### The Problem
You post on LinkedIn and Reddit. People comment, engage, praise. Right now you have to screenshot and manually send those to me. That doesn't scale.

### The Solution
Build a daily automated harvester that searches the web for APEX/PSI Protocol mentions, extracts positive signals, and feeds them into the Social Proof Wall — with admin approval before anything goes live.

### How It Works

```text
Daily Cron Job
    │
    ▼
Edge Function: "harvest-social-proof"
    │
    ├── Searches web for "APEX PSI Protocol" / "PSI compliance" / "digital-gallows"
    │   (via Firecrawl search — already available as connector)
    │
    ├── Sends results to AI (Gemini) for analysis:
    │   - Is this a positive mention / endorsement / compliment?
    │   - Extract: quote, author name, title, affiliation, source URL, platform
    │   - Skip criticism (or draft a reply for admin review)
    │
    ├── Inserts qualifying entries into `social_proof` table
    │   with approved = false (awaiting your review)
    │
    └── Logs run results to a `harvest_log` table
         │
         ▼
Admin Panel: "Social Proof" tab
    │
    ├── View pending harvested entries
    ├── One-click approve / reject
    ├── Manual add (for screenshots you paste in)
    └── Approved entries auto-appear on homepage
```

### Technical Components

1. **Connect Firecrawl** — Link the existing Firecrawl connector to this project for web search capabilities

2. **New DB table: `harvest_log`** — Tracks each daily run (timestamp, entries found, entries qualified, errors)

3. **New Edge Function: `harvest-social-proof`**
   - Searches Firecrawl for ~10 queries: "APEX PSI Protocol", "digital gallows compliance", "PSI IETF draft", "provable stateful integrity", site-specific searches on reddit.com and linkedin.com
   - Sends scraped content to Gemini for sentiment analysis + extraction
   - Filters: only positive/neutral-positive mentions, skips spam and self-posts
   - Inserts into `social_proof` with `approved = false`
   - Deduplicates against existing entries by `source_url`

4. **Scheduled daily cron job** — Uses `pg_cron` + `pg_net` to invoke the edge function once per day

5. **Admin Social Proof Management Panel** — New tab in `/admin` with:
   - Pending queue (harvested but not approved)
   - Approve/reject buttons
   - Manual entry form for quotes you find yourself
   - Stats: total approved, total harvested, last run timestamp

6. **Remove fake fallback entries** — Delete "Independent Researcher" and "Protocol Observer" placeholders from `SocialProofWall.tsx`. Keep only real, approved DB entries (with Škultety's real quote as seed data)

### Search Queries (Daily Rotation)
- `"PSI Protocol" AI compliance`
- `"Provable Stateful Integrity"`
- `"digital gallows" compliance`
- `"APEX" AI governance IETF`
- `site:reddit.com "PSI Protocol"`
- `site:linkedin.com "PSI Protocol" OR "APEX compliance"`

### What Gets Captured
- Positive comments on your LinkedIn posts
- Reddit discussions mentioning APEX/PSI
- Blog posts or articles citing the IETF draft
- Academic citations or commentary

### What Gets Filtered Out
- Your own posts (self-promotion)
- Negative criticism (unless you want to display your strong reply)
- Spam or irrelevant mentions

### Prerequisite
- Link the Firecrawl connector to this project (already available in workspace)

### Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `supabase/functions/harvest-social-proof/index.ts` | Daily harvester edge function |
| Create | Admin "Social Proof" tab component | Approve/reject/manual-add panel |
| Migrate | `harvest_log` table | Track daily runs |
| Modify | `src/pages/Admin.tsx` | Add Social Proof management tab |
| Modify | `src/components/SocialProofWall.tsx` | Remove fake entries, DB-only |
| Migrate | Enable `pg_cron` + `pg_net` | Schedule daily runs |

