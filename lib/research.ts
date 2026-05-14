import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import siteData from '../data/site.json'
import schemaData from '../data/research-schema.json'

export type ResearchSectionSlug = 'financial-research' | 'ai-research'
export type ResearchPerspective = 'investor' | 'operator'
export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'bullets'
  | 'numbered-list'
  | 'quote'
  | 'thesis-card'
  | 'key-takeaways'
  | 'callout'
  | 'comparison-table'
  | 'flowchart'
  | 'verdict'
  | 'scenario-ladder'
  | 'metric-strip'

export interface ContentBlock {
  type: ContentBlockType
  text?: string
  items?: string[]
  title?: string
  label?: string
  columns?: string[]
  rows?: string[][]
  steps?: { label: string; note?: string }[]
  metrics?: { label: string; value: string }[]
  scenarios?: {
    label: string
    text?: string
    probability?: string
    outcome?: string
    description?: string
  }[]
  variant?: 'info' | 'warning' | 'insight' | 'risk'
}

export interface ResearchNoteSummary {
  slug: string
  title: string
  section: ResearchSectionSlug
  summary: string
  date: string
  tags: string[]
  readingTime: number
  format: string
  perspective: ResearchPerspective
  relatedSlugs: string[]
}

export interface ExternalLink {
  label: string
  url: string
}

export interface HeroImage {
  url: string
  alt: string
  caption?: string
}

export interface ResearchArticle extends ResearchNoteSummary {
  sourceLinks?: ExternalLink[]
  heroImage?: HeroImage
  content: ContentBlock[]
}

export interface SiteSection {
  slug: ResearchSectionSlug
  title: string
  description: string
}

export interface SiteData {
  title: string
  tagline: string
  intro: string
  featuredSlugs: string[]
  sections: SiteSection[]
}

const site = siteData as SiteData
const schema = schemaData as {
  schemaVersion: number
  rules: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles')

// ── Block parser ─────────────────────────────────────────────────────────────────

// Escape ::: with \x3a when it appears OUTSIDE double-quoted strings.
// yaml.load() (YAML 1.1) treats ::: as a document separator — this breaks any
// text field that contains ::: outside quotes. We escape those so YAML sees them
// as literal characters. Inside quotes, ::: is already valid YAML content.
function escapeDelimitersOutsideQuotes(content: string): string {
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
      // Only set escapeNext for actual YAML escape sequences in double-quoted context.
      // This prevents \\" (escaped backslash) from accidentally closing the string.
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
      const precedingBackslashes = (() => {
        let count = 0
        let j = i - 1
        while (j >= 0 && content[j] === '\\') { count++; j-- }
        return count
      })()
      if (precedingBackslashes % 2 === 0) {
        inDoubleQuote = !inDoubleQuote
        result += ch
        i++
        continue
      }
      result += ch
      i++
      continue
    }

    // When outside quotes, escape ::: so YAML 1.1 doesn't treat it as a separator.
    // Only escape when it's clearly the delimiter pattern — not when followed by
    // characters that make it part of valid YAML syntax already.
    if (!inDoubleQuote && content.slice(i, i + 3) === ':::') {
      const following = content[i + 3]
      // Don't escape if followed by : (already a YAML 1.1 separator context)
      // or by { [ (which are structural
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

// Replace ::: with __TC__ when inside a double-quoted YAML string.
// This prevents yaml.load() (YAML 1.1) from treating ::: as a document
// separator inside quoted content (e.g. code examples with bash heredoc syntax).
function protectBlockContent(content: string): string {
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
      // Peek ahead: is this \ followed by a YAML escape char?
      // Valid YAML 1.1 double-quoted escapes: \" \\ \n \t \r \b \f
      // Also handle \xNN hex escapes
      const next = content[i + 1]
      if (next === '"' || next === '\\' || next === 'n' || next === 't' ||
          next === 'r' || next === 'b' || next === 'f' ||
          (next === 'x' && /^[0-9a-fA-F]{2}$/.test(content.slice(i + 2, i + 4)))) {
        escapeNext = true
      }
      i++
      continue
    }

    // Toggle quote state only on unescaped double quotes.
    // In YAML double-quoted scalars, \" is an escaped quote (literal content),
    // not a string delimiter. We detect it by checking if the " is preceded by
    // an odd number of backslashes.
    if (ch === '"') {
      const precedingBackslashes = (() => {
        let count = 0
        let j = i - 1
        while (j >= 0 && content[j] === '\\') { count++; j-- }
        return count
      })()
      if (precedingBackslashes % 2 === 0) {
        // Unescaped quote — toggle string boundary
        inDoubleQuote = !inDoubleQuote
        result += ch
        i++
        continue
      }
      // Escaped quote (preceded by \): stays in current string state
      result += ch
      i++
      continue
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

// Restore __TC__ -> ::: in string values after YAML parsing.
// This reverses the protectBlockContent() pass so the renderer sees real :::.
function restoreBlockContentInFields(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
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

const BLOCK_RE = /:::([a-z-]+)\n([\s\S]*?)\n:::/gm

function parseInlineBlocks(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  let lastIndex = 0
  let match

  BLOCK_RE.lastIndex = 0
  while ((match = BLOCK_RE.exec(body)) !== null) {
    // Emit plain text before this block as a paragraph
    if (match.index > lastIndex) {
      const plain = body.slice(lastIndex, match.index).trim()
      if (plain) blocks.push({ type: 'paragraph', text: plain })
    }

    const blockType = match[1].trim() as ContentBlockType
    const raw = match[2].trimEnd()

    if (!raw.trim()) {
      blocks.push({ type: blockType })
    } else {
      // Two-stage preprocessing for yaml.load (YAML 1.1):
      // 1. escapeDelimitersOutsideQuotes: escapes ::: when outside double quotes
      //    so YAML doesn't treat them as document separators
      // 2. protectBlockContent: replaces ::: inside double quotes with __TC__
      //    (also prevents YAML doc-separator interpretation)
      // After parsing, restoreBlockContentInFields converts __TC__ back to :::
      // so the renderer sees the real content.
      const safeForYaml = protectBlockContent(escapeDelimitersOutsideQuotes(raw))
      try {
        const fields = yaml.load(safeForYaml) as Record<string, unknown>
        const restored = restoreBlockContentInFields(
          (fields && typeof fields === 'object' && !Array.isArray(fields)) ? fields as Record<string, unknown> : {}
        )
        if (Object.keys(restored).length > 0) {
          blocks.push({ type: blockType, ...restored } as ContentBlock)
        } else {
          blocks.push({ type: blockType, text: String(fields) })
        }
      } catch {
        // Fallback: parse simple key: value lines (YAML-style without indentation constraints)
        const parsed: Record<string, string> = {}
        for (const line of raw.split('\n')) {
          const colonIdx = line.indexOf(':')
          if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim()
            const value = line.slice(colonIdx + 1).trim()
            if (key && !parsed[key]) parsed[key] = value
          }
        }
        if (Object.keys(parsed).length > 0) {
          blocks.push({ type: blockType, ...parsed } as ContentBlock)
        } else {
          blocks.push({ type: blockType, text: raw })
        }
      }
    }

    lastIndex = BLOCK_RE.lastIndex
  }

  // Emit any remaining plain text after the last block
  if (lastIndex < body.length) {
    const tail = body.slice(lastIndex).trim()
    if (tail) blocks.push({ type: 'paragraph', text: tail })
  }

  return blocks
}

// ── File-based article readers ───────────────────────────────────────────────────

let _articleCache: Map<string, ResearchArticle> | null = null

function getArticleCache(): Map<string, ResearchArticle> {
  if (_articleCache) return _articleCache
  _articleCache = new Map()
  if (!fs.existsSync(ARTICLES_DIR)) return _articleCache
  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith('.md')) continue
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8')
    const { data, content: bodyWithoutBlocks } = matter(raw)
    const fm = data as Record<string, unknown>
    const content = parseInlineBlocks(bodyWithoutBlocks)
    const article: ResearchArticle = {
      slug,
      title: String(fm.title ?? ''),
      section: (fm.section ?? 'ai-research') as ResearchSectionSlug,
      summary: String(fm.summary ?? ''),
      date: String(fm.date ?? ''),
      tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      readingTime: Number(fm.readingTime ?? 5),
      format: String(fm.format ?? 'thesis'),
      perspective: (fm.perspective ?? 'investor') as ResearchPerspective,
      relatedSlugs: Array.isArray(fm.relatedSlugs) ? fm.relatedSlugs.map(String) : [],
      sourceLinks: Array.isArray(fm.sourceLinks) ? (fm.sourceLinks as ExternalLink[]) : undefined,
      heroImage: fm.heroImage as HeroImage | undefined,
      content,
    }
    _articleCache.set(slug, article)
  }
  return _articleCache
}

function getNoteSummaries(): ResearchNoteSummary[] {
  return Array.from(getArticleCache().values()).map(
    ({ content: _c, sourceLinks: _sl, heroImage: _hi, ...summary }) => summary
  )
}

export function getSiteData() {
  return site
}

export function getSchemaRules() {
  return schema.rules
}

export function getAllNotes() {
  return [...getNoteSummaries()].sort((a, b) => b.date.localeCompare(a.date))
}

export function getNotesBySection(section: ResearchSectionSlug) {
  return getAllNotes().filter((note) => note.section === section)
}

export function getFeaturedNotes() {
  const allNotes = getAllNotes()
  return site.featuredSlugs
    .map((slug) => allNotes.find((note) => note.slug === slug))
    .filter(Boolean) as ResearchNoteSummary[]
}

export function getArticleBySlug(slug: string) {
  return getArticleCache().get(slug)
}

export function getRelatedNotes(slugs: string[]) {
  const allNotes = getAllNotes()
  return slugs
    .map((slug) => allNotes.find((note) => note.slug === slug))
    .filter(Boolean) as ResearchNoteSummary[]
}

export function getSectionMeta(section: ResearchSectionSlug) {
  return site.sections.find((item) => item.slug === section)
}

export function formatDisplayDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}