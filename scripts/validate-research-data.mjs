import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import matter from 'gray-matter'
import yaml from 'js-yaml'

const root = process.cwd()
const ARTICLES_DIR = path.join(root, 'data', 'articles')

const site = JSON.parse(fs.readFileSync(path.join(root, 'data', 'site.json'), 'utf8'))
const schema = JSON.parse(fs.readFileSync(path.join(root, 'data', 'research-schema.json'), 'utf8'))

const allowedSections = new Set(schema.sections.map((s) => s.slug))
const allowedBlockTypes = new Set(schema.articleShape.contentBlockTypes)

// ── Block regex ─────────────────────────────────────────────────────────────────
const BLOCK_RE = /:::([a-z-]+)\n([\s\S]*?)\n:::/gm

function parseInlineBlocks(body) {
  const blocks = []
  let match
  BLOCK_RE.lastIndex = 0
  while ((match = BLOCK_RE.exec(body)) !== null) {
    const blockType = match[1].trim()
    const raw = match[2].trimEnd()
    if (!raw.trim()) {
      blocks.push({ type: blockType })
      continue
    }
    const lines = raw.split('\n')
    const dedented = lines.map(l => l.replace(/^  /, '')).join('\n')
    let fields
    // Try JSON first (handles pure JSON blocks), then YAML (handles inline-dict YAML blocks)
    try {
      fields = JSON.parse(raw)
    } catch {
      try {
        fields = JSON.parse(dedented)
      } catch {
        try {
          fields = yaml.load(dedented)
        } catch {
          fields = { text: raw }
        }
      }
    }
    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      blocks.push({ type: blockType, ...fields })
    } else {
      blocks.push({ type: blockType, text: String(fields) })
    }
  }
  return blocks
}

// ── Load all .md files ──────────────────────────────────────────────────────────
const articles = []
for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith('.md')) continue
  const slug = file.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')
  const { data: fm, content: bodyWithoutBlocks } = matter(raw)
  const content = parseInlineBlocks(bodyWithoutBlocks)
  articles.push({ slug, fm, content })
}

// ── Basic structural checks ─────────────────────────────────────────────────────
assert.equal(typeof site.title, 'string')
assert.ok(Array.isArray(site.sections) && site.sections.length === 2, 'site must define two sections')
assert.ok(articles.length >= 4, `seed at least four articles, got ${articles.length}`)

for (const { slug, fm, content } of articles) {
  assert.ok(slug, `${slug}: missing slug`)
  assert.ok(allowedSections.has(fm.section ?? ''), `invalid section for ${slug}: ${fm.section}`)
  assert.ok(fm.summary, `missing summary for ${slug}`)
  assert.ok(Array.isArray(fm.tags), `tags must be array for ${slug}`)

  assert.ok(
    Array.isArray(content) && content.length > 0,
    `article ${slug} has no content blocks — add ::: block markers or remove the file`
  )

  for (const block of content) {
    assert.ok(
      allowedBlockTypes.has(block.type),
      `invalid block type "${block.type}" in ${slug} — check block syntax or schema`
    )

    switch (block.type) {
      case 'key-takeaways':
        assert.ok(
          Array.isArray(block.takeaways) && block.takeaways.length > 0,
          `${slug}: takeaways missing/empty in key-takeaways`
        )
        break
      case 'bullets':
      case 'numbered-list':
        assert.ok(
          Array.isArray(block.items) && block.items.length > 0,
          `${slug}: items missing/empty in ${block.type}`
        )
        break
      case 'comparison-table':
        assert.ok(
          Array.isArray(block.columns) && block.columns.length > 0,
          `${slug}: columns missing/empty in comparison-table`
        )
        assert.ok(
          Array.isArray(block.rows) && block.rows.length > 0,
          `${slug}: rows missing/empty in comparison-table`
        )
        break
      case 'flowchart':
        assert.ok(
          Array.isArray(block.steps) && block.steps.length > 0,
          `${slug}: steps missing/empty in flowchart`
        )
        break
      case 'scenario-ladder':
        assert.ok(
          Array.isArray(block.scenarios) && block.scenarios.length > 0,
          `${slug}: scenarios missing/empty in scenario-ladder`
        )
        break
      case 'metric-strip':
        assert.ok(
          Array.isArray(block.metrics) && block.metrics.length > 0,
          `${slug}: metrics missing/empty in metric-strip`
        )
        break
      case 'thesis-card':
      case 'paragraph':
      case 'heading':
      case 'quote':
      case 'callout':
      case 'verdict':
        assert.equal(
          typeof block.text,
          'string',
          `${slug}: text missing/wrong type in ${block.type}`
        )
        break
      default:
        assert.fail(`unhandled validator case for block type "${block.type}" in ${slug}`)
    }
  }
}

console.log(`validated ${articles.length} articles`)
