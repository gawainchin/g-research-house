import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'path'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import yaml from 'js-yaml'

// ── Block parser ─────────────────────────────────────────────────────────────────
const BLOCK_RE = /^(:{3,})([a-z-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm
const STRAY_FENCE_RE = /^:{3,}(?:[a-z-]+)?[ \t]*$/m

function escapeDelimitersOutsideQuotes(content) {
  let result = ''
  let i = 0
  let inDoubleQuote = false
  let escapeNext = false

  while (i < content.length) {
    const ch = content[i]

    if (escapeNext) {
      result += ch
      escapeNext = false
      i++
      continue
    }

    if (ch === '\\') {
      result += ch
      const next = content[i + 1]
      if (next === '"' || next === '\\' || next === 'n' || next === 't' ||
          next === 'r' || next === 'b' || next === 'f' ||
          (next === 'x' && /^[0-9a-fA-F]{2}$/.test(content.slice(i + 2, i + 4)))) {
        escapeNext = true
      }
      i++
      continue
    }

    if (ch === '"') {
      let count = 0
      let j = i - 1
      while (j >= 0 && content[j] === '\\') { count++; j-- }
      if (count % 2 === 0) {
        inDoubleQuote = !inDoubleQuote
      }
    }

    if (!inDoubleQuote && content.slice(i, i + 3) === ':::') {
      const following = content[i + 3]
      if (following !== ':' && following !== '{' && following !== '[' && following !== ' ' && following !== '-' && following !== '#') {
        result += '\\x3a\\x3a\\x3a'
        i += 3
        continue
      }
    }

    result += ch
    i++
  }

  return result
}

function protectBlockContent(content) {
  let result = ''
  let i = 0
  let inDoubleQuote = false
  let escapeNext = false

  while (i < content.length) {
    const ch = content[i]

    if (escapeNext) {
      result += ch
      escapeNext = false
      i++
      continue
    }

    if (ch === '\\') {
      result += ch
      const next = content[i + 1]
      if (next === '"' || next === '\\' || next === 'n' || next === 't' ||
          next === 'r' || next === 'b' || next === 'f' ||
          (next === 'x' && /^[0-9a-fA-F]{2}$/.test(content.slice(i + 2, i + 4)))) {
        escapeNext = true
      }
      i++
      continue
    }

    if (ch === '"') {
      let count = 0
      let j = i - 1
      while (j >= 0 && content[j] === '\\') { count++; j-- }
      if (count % 2 === 0) {
        inDoubleQuote = !inDoubleQuote
      }
    }

    if (inDoubleQuote && content.slice(i, i + 3) === ':::') {
      result += '__TC__'
      i += 3
      continue
    }

    result += ch
    i++
  }

  return result
}

function restoreBlockContentInFields(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === 'string') {
      out[k] = v.replace(/__TC__/g, ':::')
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) => typeof item === 'string' ? item.replace(/__TC__/g, ':::') : item)
    } else {
      out[k] = v
    }
  }
  return out
}

export function parseInlineBlocks(body, { strict = false } = {}) {
  const blocks = []
  let lastIndex = 0
  let match
  BLOCK_RE.lastIndex = 0
  while ((match = BLOCK_RE.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const plain = body.slice(lastIndex, match.index).trim()
      if (plain) {
        if (strict && STRAY_FENCE_RE.test(plain)) {
          throw new Error(`malformed or mismatched content block fence near: ${plain.split('\n').find((line) => line.trim().startsWith(':::'))}`)
        }
        blocks.push({ type: 'paragraph', text: plain })
      }
    }

    const blockType = match[2].trim()
    const raw = match[3].trimEnd()
    if (strict && STRAY_FENCE_RE.test(raw)) {
      throw new Error(`malformed or mismatched content block fence inside ${blockType}`)
    }
    if (!raw.trim()) {
      blocks.push({ type: blockType })
      lastIndex = BLOCK_RE.lastIndex
      continue
    }
    let fields
    const safeForYaml = protectBlockContent(escapeDelimitersOutsideQuotes(raw))
    try {
      fields = JSON.parse(raw)
    } catch {
      try {
        fields = yaml.load(safeForYaml)
      } catch {
        fields = { text: raw }
      }
    }
    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      blocks.push({ type: blockType, ...restoreBlockContentInFields(fields) })
    } else {
      blocks.push({ type: blockType, text: String(fields) })
    }
    lastIndex = BLOCK_RE.lastIndex
  }

  if (lastIndex < body.length) {
    const tail = body.slice(lastIndex).trim()
    if (tail) {
      if (strict && STRAY_FENCE_RE.test(tail)) {
        throw new Error(`malformed or mismatched content block fence near: ${tail.split('\n').find((line) => line.trim().startsWith(':::'))}`)
      }
      blocks.push({ type: 'paragraph', text: tail })
    }
  }

  return blocks
}

export function validateResearchData(root = process.cwd()) {
  const articlesDir = path.join(root, 'data', 'articles')

  const site = JSON.parse(fs.readFileSync(path.join(root, 'data', 'site.json'), 'utf8'))
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'data', 'research-schema.json'), 'utf8'))

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
