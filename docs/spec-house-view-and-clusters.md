# House View and Research Clusters Implementation Spec

> **For Hermes:** Use this as the implementation spec for turning G Research House from a chronological note archive into a thesis-led research surface.

**Goal:** Add a House View layer that exposes G Research House's current active theses and article clusters before the reader reaches the archive list.

**Architecture:** Keep the existing file-based markdown article loader. Add a small curated `data/house-view.json` file for house-level theses and clusters, then render it through a dedicated `/house-view` route, per-cluster `/themes/[slug]` routes, and a compact homepage module. No Obsidian sync, CMS, database, or article-model migration.

**Tech Stack:** Next.js App Router, TypeScript, static JSON, existing markdown article loader, existing card/illustration components.

---

## Product Requirements

### 1. Homepage should become thesis-led

Current problem: the homepage is polished but still behaves like an archive: newest note first, then chronological cards.

Required behavior:
- Add a compact House View module above the archive list.
- Show 3–4 active theses with status labels and links to cluster pages.
- Keep the archive list below as the complete research shelf.

### 2. Add `/house-view`

Purpose: one page that answers “what does G Research House currently believe?”

Required content:
- House-level title and intro.
- Thesis cards: title, status, conviction, one-sentence claim, what changed, what would change the view.
- Research clusters: cluster title, description, article count, linked articles.

### 3. Add `/themes/[slug]`

Purpose: cluster landing pages for major research threads.

Required content:
- Cluster title, summary, lens, status, conviction.
- Short thesis statement and “what would change the view.”
- Linked article cards, sorted newest first.

### 4. Validate references

The validator should fail if:
- a featured house thesis points to an unknown cluster;
- a cluster references an article slug that does not exist;
- required house-view fields are missing.

### 5. Stay deliberately simple

Non-goals:
- no full tag pages yet;
- no Obsidian live sync;
- no search;
- no CMS;
- no database;
- no new visual block system.

## Data Model

Create `data/house-view.json`:

```json
{
  "title": "House View",
  "updated": "2026-06-04",
  "summary": "Current working theses across AI infrastructure, agent workflows, and valuation discipline.",
  "theses": [
    {
      "slug": "ai-physical-bottlenecks",
      "title": "AI physical bottlenecks are becoming the investable edge",
      "status": "Strengthening",
      "conviction": "High",
      "lens": "financial-research",
      "claim": "The AI trade is shifting from model excitement toward power, packaging, memory, cooling, and interconnect scarcity.",
      "whatChanged": "Power, packaging, and memory evidence strengthened; optics and brownfield liquid cooling remain threshold-gated.",
      "wouldChangeView": "Evidence that hyperscalers can source power, memory, and advanced packaging faster than current lead-time signals imply.",
      "clusterSlug": "ai-physical-bottlenecks"
    }
  ],
  "clusters": [
    {
      "slug": "ai-physical-bottlenecks",
      "title": "AI Physical Bottlenecks",
      "lens": "financial-research",
      "status": "Active",
      "conviction": "High",
      "summary": "Power, cooling, memory, packaging, and infrastructure constraints behind the AI buildout.",
      "thesis": "The market is increasingly pricing AI as a physical infrastructure problem, not only a model/software problem.",
      "wouldChangeView": "Clear evidence that bottleneck lead times normalize without margin pressure or capex overshoot.",
      "articleSlugs": [
        "ai-is-not-the-climate-bubble-valuation-rhymes",
        "agentic-inference-memory-io-pressure-indicator",
        "ai-cooling-next-data-center-bottleneck",
        "ai-power-semis-wolfspeed-onsemi-infineon",
        "china-ai-infrastructure-hidden-power-play"
      ]
    }
  ]
}
```

## Implementation Tasks

### Task 1: Add types and loader functions

Files:
- Modify `lib/research-types.ts`
- Modify `lib/research.ts`

Add interfaces:
- `HouseViewData`
- `HouseThesis`
- `ResearchCluster`

Add functions:
- `getHouseView()`
- `getResearchClusters()`
- `getResearchClusterBySlug(slug)`
- `getNotesForCluster(cluster)`

### Task 2: Add data and validator coverage

Files:
- Create `data/house-view.json`
- Modify `scripts/validate-research-data.mjs`

Validator should assert:
- `houseView.title`, `updated`, `summary` are strings;
- `theses` and `clusters` are non-empty arrays;
- all thesis `clusterSlug` values exist;
- all cluster `articleSlugs` values exist in `data/articles/*.md`.

### Task 3: Add `/house-view`

Files:
- Create `app/house-view/page.tsx`

Use existing editorial visual language:
- max-width centered page;
- House View title;
- thesis cards;
- cluster cards linking to `/themes/[slug]`.

### Task 4: Add `/themes/[slug]`

Files:
- Create `app/themes/[slug]/page.tsx`

Behavior:
- generate static params from clusters;
- 404 for unknown cluster;
- show cluster metadata and article cards.

### Task 5: Add homepage module and nav link

Files:
- Modify `app/page.tsx`

Add:
- nav link to `/house-view`;
- compact House View section above `ContentsList`;
- links to the first 3–4 theses / clusters.

### Task 6: Verify

Commands:
- `npm run validate:data`
- `npm run build`

Browser checks:
- `/` shows House View module above article archive;
- `/house-view` renders thesis and clusters;
- `/themes/ai-physical-bottlenecks` renders linked article cards;
- no blank summaries or broken links.
