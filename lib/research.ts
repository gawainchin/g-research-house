import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import siteData from '../data/site.json'
import schemaData from '../data/research-schema.json'
import houseViewData from '../data/house-view.json'
import marketWatchData from '../data/market-watch.json'
import whatChangedData from '../data/what-changed.json'
import { parseInlineBlocks } from './inline-blocks.mjs'
import { findAutoLinkedArticleSlugs, mergeArticleSlugs } from './market-watch-utils.mjs'
import type {
  ContentBlock,
  ExternalLink,
  HeroImage,
  HouseThesis,
  HouseViewData,
  MarketWatchData,
  MarketTicker,
  ResearchArticle,
  ResearchCluster,
  ResearchNoteSummary,
  ResearchPerspective,
  ResearchSectionSlug,
  SiteData,
  WhatChangedData,
} from './research-types'

export type {
  ContentBlock,
  ContentBlockType,
  ExternalLink,
  HeroImage,
  HouseThesis,
  HouseViewData,
  MarketTicker,
  MarketWatchData,
  ResearchArticle,
  ResearchCluster,
  ResearchNoteSummary,
  ResearchPerspective,
  ResearchSectionSlug,
  SiteData,
  SiteSection,
  WhatChangedData,
  WhatChangedEntry,
} from './research-types'
export { formatDisplayDate } from './research-types'

const site = siteData as SiteData
const houseView = houseViewData as HouseViewData
const marketWatch = marketWatchData as MarketWatchData
const whatChanged = whatChangedData as WhatChangedData
const schema = schemaData as {
  schemaVersion: number
  rules: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles')

// YAML parses unquoted ISO date literals (e.g. `2026-05-12`) as JS `Date`
// objects. We want a stable `YYYY-MM-DD` string both for sorting and for the
// shared `formatDisplayDate` helper.
function toIsoDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string') {
    return value
  }
  return ''
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
    const content = parseInlineBlocks(bodyWithoutBlocks) as ContentBlock[]
    const article: ResearchArticle = {
      slug,
      title: String(fm.title ?? ''),
      section: (fm.section ?? 'ai-research') as ResearchSectionSlug,
      summary: String(fm.summary ?? ''),
      date: toIsoDateString(fm.date),
      tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      keywords: Array.isArray(fm.keywords) ? fm.keywords.map(String) : [],
      visualKey: typeof fm.visualKey === 'string' ? fm.visualKey : undefined,
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

export function getRelatedNotesForTicker(ticker: MarketTicker) {
  const allNotes = getAllNotes()
  const autoLinkedSlugs = findAutoLinkedArticleSlugs(ticker, allNotes)
  return getRelatedNotes(mergeArticleSlugs(ticker.articleSlugs, autoLinkedSlugs))
}

export function getSectionMeta(section: ResearchSectionSlug) {
  return site.sections.find((item) => item.slug === section)
}

export function getHouseView() {
  return houseView
}

export function getHouseTheses() {
  return houseView.theses
}

export function getResearchClusters() {
  return houseView.clusters
}

export function getResearchClusterBySlug(slug: string) {
  return houseView.clusters.find((cluster) => cluster.slug === slug)
}

export function getClustersForArticleSlug(slug: string) {
  return houseView.clusters.filter((cluster) => cluster.articleSlugs.includes(slug))
}

export function getMarketWatch() {
  return marketWatch
}

export function getWhatChanged() {
  return whatChanged
}

export function getThesisForCluster(clusterSlug: string) {
  return houseView.theses.find((thesis) => thesis.clusterSlug === clusterSlug)
}

export function getNotesForCluster(cluster: ResearchCluster) {
  const allNotes = getAllNotes()
  return cluster.articleSlugs
    .map((slug) => allNotes.find((note) => note.slug === slug))
    .filter(Boolean) as ResearchNoteSummary[]
}
