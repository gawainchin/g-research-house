# G Research House

Private research site for curated **financial research** and **AI research**.

This is a static JSON-first Next.js app protected by a lightweight shared-password gate.
Obsidian is the research source, but published content is manually curated into JSON for quality control.

## Stack

- Next.js App Router
- Static JSON content model
- Shared-password auth gate
- Manual curation from Obsidian into publishable research pages

## Project structure

- `data/site.json` — site metadata and section framing
- `data/research-schema.json` — editorial schema for each section
- `data/research-index.json` — article summaries / index
- `data/research-articles.json` — structured article content blocks
- `app/financial-research` — finance section
- `app/ai-research` — AI section
- `app/research/[slug]` — article detail pages
- `lib/research.ts` — typed data access helpers

## Lightweight auth gate

Set these environment variables locally or in Vercel:

```bash
BRIEF_GATE_PASSWORD=your-shared-password
BRIEF_GATE_COOKIE_SECRET=a-long-random-secret
```

Protected routes:
- `/`
- `/financial-research`
- `/ai-research`
- `/research/:slug`

Users sign in at `/login`. Successful login sets an HTTP-only cookie. `/logout` clears it.

## Local development

```bash
cd ~/Projects/g-research-house
npm install
npm run dev
```

## Validation

```bash
npm test
npm run validate:data
BRIEF_GATE_PASSWORD=testpass BRIEF_GATE_COOKIE_SECRET=testsecret npm run build
```

## Deployment

```bash
npm i -g vercel
vercel login
cd ~/Projects/g-research-house
vercel deploy
vercel --prod
```

## Editorial model

The two sections are intentionally different:

- **Financial Research** = investor lens, valuation, positioning, rerating path, risk
- **AI Research** = systems lens, bottlenecks, workflows, infrastructure, what is technically real

One note should have one dominant lens. Cross-linking is fine. Duplication is not.
