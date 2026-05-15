---
name: research-markdown-format
description: Writes and edits G Research House research article markdown. Use when creating or modifying data/articles/*.md, custom research content blocks, frontmatter, article markdown, or fixing article rendering/validation problems.
---

# Research Markdown Format

## When To Use

Use this skill before editing `data/articles/*.md`.

Always preserve the repo's custom content block format. Do not convert articles to ordinary Markdown prose unless the renderer is changed first.

## Required Validation

After editing articles, run:

```bash
npm run validate:data
npm test
```

For rendering-sensitive changes, also run:

```bash
npm run build
```

## Frontmatter

Every article starts with YAML frontmatter:

```yaml
---
title: Article Title
slug: article-slug
section: ai-research
date: 2026-05-14
tags:
  - ai
  - infrastructure
format: thesis
perspective: analyst
summary: "One clear sentence explaining the article."
readingTime: 5
relatedSlugs:
sourceLinks:
  - label: Source label
    url: https://example.com
---
```

Valid `section` values:

- `financial-research`
- `ai-research`

Common `perspective` values:

- `investor`
- `operator`
- `analyst`

## Content Block Fences

Articles use custom fenced blocks:

```markdown
:::paragraph
text: Plain paragraph text.
:::
```

Fence rule:

- Use `:::` for normal blocks.
- Use matching longer fences like `::::` only when the block content itself contains literal `:::` lines.
- The closing fence must use the same number of colons as the opening fence.
- Do not mix `::::paragraph` with a `:::` closing fence.

Good:

```markdown
::::paragraph
text: "This text mentions a literal ::: marker."
::::
```

Bad:

```markdown
::::paragraph
text: "This will not validate."
:::
```

## Supported Blocks

Supported block types:

- `paragraph`
- `heading`
- `bullets`
- `numbered-list`
- `quote`
- `thesis-card`
- `key-takeaways`
- `callout`
- `comparison-table`
- `flowchart`
- `verdict`
- `scenario-ladder`
- `metric-strip`
- `scorecard`
- `bar-chart`
- `timeline`
- `stack-diagram`

## Common Examples

Paragraph:

```markdown
:::paragraph
text: "Use quotes when the text contains colon-heavy syntax, apostrophes, or markdown."
:::
```

Heading:

```markdown
:::heading
text: "The Core Question"
:::
```

Bullets:

```markdown
:::bullets
items:
  - "First point with **bold** emphasis."
  - "Second point with `inline code`."
:::
```

Thesis card:

```markdown
:::thesis-card
label: The Core Thesis
text: "One strong thesis paragraph."
:::
```

Callout:

```markdown
:::callout
variant: risk
label: Watch Item
text: "The main uncertainty is not demand, but timing."
:::
```

Code block inside text:

```markdown
:::paragraph
text: "Use escaped newlines for short code examples:\n\n```bash\nnpm run validate:data\nnpm test\n```"
:::
```

For longer code examples, use YAML block scalars:

```markdown
:::paragraph
text: |
  Example command sequence:

  ```bash
  npm run validate:data
  npm test
  ```
:::
```

## Visual Blocks

Use visual blocks when they reduce scanning effort. Prefer one strong visual over several decorative ones.

Best use cases:

- `scorecard`: Compare quality, valuation, moat, risk, timing, or technical maturity. Best for both finance and AI notes.
- `bar-chart`: Show simple numeric comparisons such as growth, margin, multiple, market share, capex exposure, or capacity.
- `timeline`: Show catalysts, policy milestones, IPO path, earnings checkpoints, product rollouts, or stack evolution.
- `stack-diagram`: Show AI stack layers, infrastructure dependencies, workflow architecture, or power/grid-to-model relationships.
- `flowchart`: Show causal chains, decision paths, workflow stages, or "if X then Y" logic.

Scorecard:

```markdown
:::scorecard
title: Company Quality Snapshot
criteria:
  - label: Quality
    score: 5
    note: "Best-in-class margin and retention."
  - label: Valuation
    score: 2
    note: "Multiple already prices perfection."
  - label: Risk
    score: 3
    note: "Execution is strong, but expectations are high."
:::
```

Bar chart:

```markdown
:::bar-chart
title: Revenue Growth Comparison
unit: "%"
bars:
  - label: PLTR
    value: 70
    note: "Acceleration is the core bull case."
  - label: NOW
    value: 22
  - label: CRM
    value: 11
:::
```

Timeline:

```markdown
:::timeline
title: Catalyst Path
events:
  - label: Earnings
    date: Q2 2026
    text: "Watch commercial growth durability."
  - label: Repricing Window
    date: 2H 2026
    text: "Multiple risk rises if growth cools."
:::
```

Stack diagram:

```markdown
:::stack-diagram
title: Agentic AI Stack
layers:
  - label: App Layer
    text: "User-facing workflow surfaces."
  - label: Orchestration
    text: "Task state, routing, review gates."
  - label: Inference Infra
    text: "Model serving, memory, cache, I/O."
  - label: Power/Grid
    text: "Physical constraint layer for scaled deployment."
:::
```

Flowchart:

```markdown
:::flowchart
title: Workflow Runtime Shift
steps:
  - label: One-shot prompt
    note: "Useful for exploration, weak for repeatability."
  - label: Task state
    note: "Adds durable state and retry paths."
  - label: Review gate
    note: "Keeps human judgment in the loop."
:::
```

## Rules For Agents

- Prefer one content block per logical paragraph or list.
- Keep block content valid YAML.
- Quote strings when they contain `:`, backticks, markdown emphasis, apostrophes, or shell syntax.
- Use `items:` for `bullets` and `numbered-list`.
- Use `takeaways:` or `items:` for `key-takeaways`; each takeaway should have readable text.
- Use visual blocks only when they clarify comparison, sequence, stack structure, or causal flow.
- Never leave raw `::::` or `:::` fence lines inside a block body unless using a longer matching fence.
- If validation fails, fix the article format before changing renderer code.
