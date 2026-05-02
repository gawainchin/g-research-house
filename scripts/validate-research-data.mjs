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
  for (const block of article.content) {
    assert.ok(allowedBlockTypes.has(block.type), `invalid block type ${block.type} in ${article.slug}`)
    if (block.type === 'bullets' || block.type === 'numbered-list') {
      assert.ok(Array.isArray(block.items) && block.items.length > 0, `list block missing items in ${article.slug}`)
    } else {
      assert.equal(typeof block.text, 'string', `text block missing text in ${article.slug}`)
    }
  }
}

console.log(`validated ${index.notes.length} notes and ${articles.articles.length} articles`)
