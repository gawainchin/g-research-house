# G Research House

Public research site for curated **financial research** and **AI research**.

This is a static JSON-first Next.js app.
Obsidian is the research source, but published content is manually curated into JSON for quality control.

## Stack

- Next.js App Router
- Static JSON content model
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
npm run build
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
