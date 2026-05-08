import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8'))

const site = readJson('site.json')
const schema = readJson('research-schema.json')
const index = readJson('research-index.json')
const articles = readJson('research-articles.json')

const allowedSections = new Set(schema.sections.map((section) => section.slug))
const allowedBlockTypes = new Set(schema.articleShape.contentBlockTypes)
const summaryBySlug = new Map(index.notes.map((note) => [note.slug, note]))

assert.equal(typeof site.title, 'string')
assert.ok(Array.isArray(site.sections) && site.sections.length === 2, 'site must define two sections')
assert.ok(index.notes.length >= 4, 'seed at least four notes')
assert.ok(articles.articles.length >= 4, 'seed at least four article bodies')

for (const note of index.notes) {
  assert.ok(note.slug, 'note missing slug')
  assert.ok(allowedSections.has(note.section), `invalid section for ${note.slug}`)
  assert.ok(note.summary, `missing summary for ${note.slug}`)
  assert.ok(Array.isArray(note.tags), `tags must be array for ${note.slug}`)
}

for (const article of articles.articles) {
  assert.ok(summaryBySlug.has(article.slug), `article ${article.slug} missing from research-index.json`)
  assert.ok(Array.isArray(article.content) && article.content.length > 0, `article ${article.slug} missing content`)

  if (article.sourceLinks) {
    assert.ok(Array.isArray(article.sourceLinks), `sourceLinks must be an array in ${article.slug}`)
    for (const link of article.sourceLinks) {
      assert.equal(typeof link.label, 'string', `source link label missing in ${article.slug}`)
      assert.equal(typeof link.url, 'string', `source link url missing in ${article.slug}`)
    }
  }

  if (article.heroImage) {
    assert.equal(typeof article.heroImage.url, 'string', `heroImage.url missing in ${article.slug}`)
    assert.equal(typeof article.heroImage.alt, 'string', `heroImage.alt missing in ${article.slug}`)
    if (article.heroImage.caption !== undefined) {
      assert.equal(typeof article.heroImage.caption, 'string', `heroImage.caption must be string in ${article.slug}`)
    }
  }

  for (const block of article.content) {
    assert.ok(allowedBlockTypes.has(block.type), `invalid block type ${block.type} in ${article.slug}`)

    switch (block.type) {
      case 'bullets':
      case 'numbered-list':
      case 'key-takeaways':
        assert.ok(Array.isArray(block.items) && block.items.length > 0, `items missing in ${article.slug}`)
        break
      case 'comparison-table':
        assert.ok(Array.isArray(block.columns) && block.columns.length > 0, `columns missing in ${article.slug}`)
        assert.ok(Array.isArray(block.rows) && block.rows.length > 0, `rows missing in ${article.slug}`)
        break
      case 'flowchart':
        assert.ok(Array.isArray(block.steps) && block.steps.length > 0, `steps missing in ${article.slug}`)
        break
      case 'scenario-ladder':
        assert.ok(Array.isArray(block.scenarios) && block.scenarios.length > 0, `scenarios missing in ${article.slug}`)
        break
      case 'metric-strip':
        assert.ok(Array.isArray(block.metrics) && block.metrics.length > 0, `metrics missing in ${article.slug}`)
        break
      case 'heading':
      case 'paragraph':
      case 'quote':
      case 'thesis-card':
      case 'callout':
      case 'verdict':
        assert.equal(typeof block.text, 'string', `text missing in ${article.slug}`)
        if (block.type === 'thesis-card' && block.title !== undefined) {
          assert.equal(typeof block.title, 'string', `thesis-card title must be string in ${article.slug}`)
        }
        break
      default:
        assert.fail(`unhandled validator case for ${block.type} in ${article.slug}`)
    }
  }
}

console.log(`validated ${index.notes.length} notes and ${articles.articles.length} articles`)
