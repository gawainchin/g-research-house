import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import { parseInlineBlocks } from '../lib/inline-blocks.mjs'

export function validateResearchData(root = process.cwd()) {
  const articlesDir = path.join(root, 'data', 'articles')

  const site = JSON.parse(fs.readFileSync(path.join(root, 'data', 'site.json'), 'utf8'))
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'data', 'research-schema.json'), 'utf8'))
  const houseView = JSON.parse(fs.readFileSync(path.join(root, 'data', 'house-view.json'), 'utf8'))

  const allowedSections = new Set(schema.sections.map((s) => s.slug))
  const allowedBlockTypes = new Set(schema.articleShape.contentBlockTypes)

  const articles = []
  for (const file of fs.readdirSync(articlesDir)) {
    if (!file.endsWith('.md')) continue
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8')
    const { data: fm, content: bodyWithoutBlocks } = matter(raw)
    const content = parseInlineBlocks(bodyWithoutBlocks, { strict: true })
    articles.push({ slug, fm, content })
  }

  assert.equal(typeof site.title, 'string')
  assert.ok(Array.isArray(site.sections) && site.sections.length === 2, 'site must define two sections')
  assert.ok(articles.length >= 4, `seed at least four articles, got ${articles.length}`)

  assert.equal(typeof houseView.title, 'string', 'house view title must be a string')
  assert.equal(typeof houseView.updated, 'string', 'house view updated must be a string')
  assert.equal(typeof houseView.summary, 'string', 'house view summary must be a string')
  assert.ok(Array.isArray(houseView.theses) && houseView.theses.length > 0, 'house view must define theses')
  assert.ok(Array.isArray(houseView.clusters) && houseView.clusters.length > 0, 'house view must define clusters')

  const articleSlugs = new Set(articles.map((article) => article.slug))
  const clusterSlugs = new Set(houseView.clusters.map((cluster) => cluster.slug))

  for (const thesis of houseView.theses) {
    assert.ok(thesis.slug && typeof thesis.slug === 'string', 'house thesis missing slug')
    assert.ok(thesis.title && typeof thesis.title === 'string', `${thesis.slug}: house thesis missing title`)
    assert.ok(allowedSections.has(thesis.lens), `${thesis.slug}: invalid thesis lens ${thesis.lens}`)
    assert.ok(clusterSlugs.has(thesis.clusterSlug), `${thesis.slug}: unknown clusterSlug ${thesis.clusterSlug}`)
    for (const field of ['status', 'conviction', 'claim', 'whatChanged', 'wouldChangeView']) {
      assert.ok(typeof thesis[field] === 'string' && thesis[field].trim(), `${thesis.slug}: missing ${field}`)
    }
  }

  for (const cluster of houseView.clusters) {
    assert.ok(cluster.slug && typeof cluster.slug === 'string', 'research cluster missing slug')
    assert.ok(cluster.title && typeof cluster.title === 'string', `${cluster.slug}: research cluster missing title`)
    assert.ok(allowedSections.has(cluster.lens), `${cluster.slug}: invalid cluster lens ${cluster.lens}`)
    assert.ok(Array.isArray(cluster.articleSlugs) && cluster.articleSlugs.length > 0, `${cluster.slug}: articleSlugs must be non-empty`)
    for (const field of ['status', 'conviction', 'summary', 'thesis', 'wouldChangeView']) {
      assert.ok(typeof cluster[field] === 'string' && cluster[field].trim(), `${cluster.slug}: missing ${field}`)
    }
    for (const slug of cluster.articleSlugs) {
      assert.ok(articleSlugs.has(slug), `${cluster.slug}: unknown article slug ${slug}`)
    }
  }

  for (const { slug, fm, content } of articles) {
    assert.ok(slug, `${slug}: missing slug`)
    assert.ok(allowedSections.has(fm.section ?? ''), `invalid section for ${slug}: ${fm.section}`)
    assert.ok(fm.summary, `missing summary for ${slug}`)
    assert.ok(Array.isArray(fm.tags), `tags must be array for ${slug}`)
    assert.ok(Array.isArray(fm.keywords) && fm.keywords.length > 0, `keywords must be non-empty array for ${slug}`)
    assert.ok(fm.keywords.every((keyword) => typeof keyword === 'string' && keyword.trim()), `keywords must be non-empty strings for ${slug}`)

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
            (Array.isArray(block.items) && block.items.length > 0) ||
              (Array.isArray(block.takeaways) && block.takeaways.length > 0),
            `${slug}: items missing/empty in key-takeaways`
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
          assert.ok(
            block.rows.every((row) => Array.isArray(row)),
            `${slug}: every comparison-table row must be an array`
          )
          break
        case 'flowchart':
          assert.ok(
            Array.isArray(block.steps) && block.steps.length > 0,
            `${slug}: steps missing/empty in flowchart`
          )
          assert.ok(
            block.steps.every((step) => step && typeof step === 'object' && typeof step.label === 'string'),
            `${slug}: every flowchart step must define a label`
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
        case 'exposure-matrix':
          assert.ok(
            Array.isArray(block.points) && block.points.length > 0,
            `${slug}: points missing/empty in exposure-matrix`
          )
          assert.ok(
            block.points.every((point) =>
              point &&
              typeof point === 'object' &&
              typeof point.label === 'string' &&
              Number.isFinite(Number(point.x)) &&
              Number.isFinite(Number(point.y))
            ),
            `${slug}: every exposure-matrix point must define label, numeric x, and numeric y`
          )
          break
        case 'constraint-stack':
          assert.ok(
            Array.isArray(block.layers) && block.layers.length > 0,
            `${slug}: layers missing/empty in constraint-stack`
          )
          assert.ok(
            block.layers.every((layer) => layer && typeof layer === 'object' && typeof layer.label === 'string'),
            `${slug}: every constraint-stack layer must define a label`
          )
          break
        case 'scorecard':
          assert.ok(
            Array.isArray(block.criteria) && block.criteria.length > 0,
            `${slug}: criteria missing/empty in scorecard`
          )
          break
        case 'bar-chart':
          assert.ok(
            Array.isArray(block.bars) && block.bars.length > 0,
            `${slug}: bars missing/empty in bar-chart`
          )
          break
        case 'line-chart':
          assert.ok(
            Array.isArray(block.series) && block.series.length > 0,
            `${slug}: series missing/empty in line-chart`
          )
          assert.ok(
            block.series.every((series) =>
              series &&
              typeof series === 'object' &&
              typeof series.label === 'string' &&
              Array.isArray(series.points) &&
              series.points.length > 0 &&
              series.points.every((point) => point && typeof point === 'object' && typeof point.label === 'string' && Number.isFinite(Number(point.value)))
            ),
            `${slug}: every line-chart series must define a label and numeric points`
          )
          break
        case 'timeline':
          assert.ok(
            Array.isArray(block.events) && block.events.length > 0,
            `${slug}: events missing/empty in timeline`
          )
          break
        case 'stack-diagram':
          assert.ok(
            Array.isArray(block.layers) && block.layers.length > 0,
            `${slug}: layers missing/empty in stack-diagram`
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

  return `validated ${articles.length} articles`
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(validateResearchData())
}
