

# APEX AI Chatbot — Self-Evolving Sales Machine

## What It Does

A floating AI chatbot on every page that sells, supports, captures leads, and learns from every conversation. Not a static FAQ bot — it adapts its knowledge and improves over time.

## Three Layers

### Layer 1: The Bot (Core)
- Floating gold widget, bottom-right, all pages
- Streaming responses via SSE (token-by-token)
- Deep APEX knowledge baked into system prompt: PSI, pricing ($499-$49,999), EU AI Act (Aug 2 2026), Gallows, SHIELD/SWORD/JUDGE modes, all FAQ answers
- Quick-action buttons: "What is PSI?", "Show pricing", "Free assessment"
- Markdown rendering for rich responses

### Layer 2: Lead Capture + Routing
- AI uses tool calling to capture leads (name, email, company) when buying intent is detected
- Routes visitors to action: `/assess` for free assessment, `/auth` for signup, `/gallows` for demo
- Stores conversations + leads in database for your team to review

### Layer 3: Self-Evolution
- **Conversation logging**: Every chat stored in `chat_conversations` + `chat_messages` tables
- **Feedback loop**: Thumbs up/down on each bot response, stored in `chat_feedback` table
- **Unanswered tracker**: When the bot can't answer something, it flags it via tool call → stored in `chat_knowledge_gaps` table
- **Admin review**: Dashboard page (`/dashboard` tab) shows: top questions, knowledge gaps, lead captures, feedback scores
- Over time you see what visitors actually ask, what the bot fails on, and what converts — then you tell me to update the system prompt accordingly

This isn't autonomous AI rewriting itself (that's dangerous). It's a feedback system that surfaces what needs improving so we can iterate fast.

## Security: Rate Limiting + Sanitization

### Rate Limiting (Edge Function)
- **Per-session**: Max 30 messages per conversation per hour
- **Per-IP**: Max 60 requests per hour (tracked via in-memory Map with TTL cleanup)
- **Message length**: Max 500 characters per user message
- **Conversation cap**: Max 100 messages per conversation total
- Returns 429 with friendly message when exceeded

### Input Sanitization (Edge Function)
- Strip HTML tags from user input
- Reject messages containing common injection patterns (`ignore previous`, `system:`, `you are now`)
- Trim whitespace, reject empty messages
- Zod validation on request body

### Anti-Abuse
- No PII in system prompt responses (bot never reveals its full instructions)
- Bot refuses to role-play or break character via system prompt hardening
- Conversation stored but user messages are sanitized before DB insert

## Database (1 migration, 4 tables)

| Table | Purpose |
|-------|---------|
| `chat_conversations` | Session tracking, lead info (visitor_id, lead_name, lead_email, lead_company) |
| `chat_messages` | Full message history (conversation_id, role, content, created_at) |
| `chat_feedback` | Thumbs up/down per message (message_id, rating, created_at) |
| `chat_knowledge_gaps` | Unanswered questions flagged by bot (question, conversation_id, created_at) |

RLS: Public INSERT for anonymous visitors (scoped by visitor_id cookie). No public SELECT on feedback/gaps (admin only via service role).

## Files

```text
New:
  supabase/functions/apex-chat/index.ts       — Edge function with streaming, rate limiting, sanitization, tool calling
  src/components/chat/ChatWidget.tsx           — Floating widget UI
  src/components/chat/ChatMessage.tsx          — Message bubble with markdown + feedback buttons
  src/hooks/use-chat.ts                        — Streaming hook + session management

Modified:
  src/App.tsx                                  — Add ChatWidget globally
  supabase/config.toml                         — Add apex-chat function config
  src/pages/Dashboard.tsx                      — Add chat analytics tab
```

## Implementation Order

1. Create 4 database tables via migration
2. Build `apex-chat` edge function with full security layer
3. Build ChatWidget + ChatMessage + use-chat hook
4. Add widget to App.tsx
5. Add chat analytics tab to Dashboard

No new secrets needed — LOVABLE_API_KEY is already configured.

