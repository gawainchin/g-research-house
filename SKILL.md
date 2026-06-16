---
name: g-research-house-repo-workflow
description: Repo-local workflow for editing, validating, and publishing G Research House articles.
---

# G Research House repo workflow

Use this when working inside this repository.

## Source of truth

Articles live in:

- `data/articles/<slug>.md`

Do not manually edit generated JSON artifacts unless the codebase explicitly changes back to JSON-driven runtime. The current loader and validator read markdown articles directly.

## Standard verification

Before committing article/content/runtime changes, run:

```bash
npm run validate:data
npm test
npm run build
```

For article rendering issues, do not trust build success alone. Use browser or DOM inspection to confirm structured blocks and headings render as intended.

## AI/operator article style

For AI/operator pieces, prefer the BiasedRead-style operator essay path documented in:

- `docs/editorial-style-biasedread-operator-essay.md`

Default reader path:

> scene -> pain -> villain -> reframing -> mechanism -> protocol -> payoff -> question

Use this for workflow, agents, evals, second-brain systems, personal tooling, and DS operating habits.

Keep the evidence discipline:

- personal scene opens the door
- source-backed mechanism earns trust
- practical protocol makes the piece useful
- caveats say where the pattern breaks

## Financial articles

Financial research should stay more analyst-note structured:

- thesis / setup
- numbers and source links
- scenario framing
- risks and what remains unproven
- educational-only disclaimer where required by the app/site layer

Do not force the BiasedRead format onto valuation notes.

## Article readiness checklist

Before publication, check:

- [ ] Title, summary, slug, tags, and source links are coherent.
- [ ] All claims and numbers have appropriate sources.
- [ ] Required native visual blocks are present and render meaningful content.
- [ ] No raw Markdown headings render literally inside article body.
- [ ] `npm run validate:data` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Live route resolves after push/deploy.

## Publishing

Publication is satisfied by committing the canonical markdown file and pushing `main` when the GitHub/Vercel deployment is connected.

After pushing, verify the live URL rather than assuming deployment completed.
