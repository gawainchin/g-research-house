import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
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

const BLOCK_RE = /:::([a-z-]+)\n([\s\S]*?)\n:::/gm

function parseInlineBlocks(body: string): ContentBlock[] {
  const blocks: ContentBlock[] = []
  let match
  BLOCK_RE.lastIndex = 0
  while ((match = BLOCK_RE.exec(body)) !== null) {
    const blockType = match[1].trim() as ContentBlockType
    const raw = match[2].trimEnd()
    if (!raw.trim()) {
      blocks.push({ type: blockType })
      continue
    }
    // Parse JSON body
    try {
      const fields = JSON.parse(raw) as Record<string, unknown>
      if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
        blocks.push({ type: blockType, ...fields } as ContentBlock)
      } else {
        blocks.push({ type: blockType, text: String(fields) })
      }
    } catch {
      // Fallback: treat raw body as plain text
      blocks.push({ type: blockType, text: raw })
    }
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