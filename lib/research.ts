import siteData from '../data/site.json'
import schemaData from '../data/research-schema.json'
import indexData from '../data/research-index.json'
import articlesData from '../data/research-articles.json'

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
  // thesis-card
  title?: string
  // comparison-table
  columns?: string[]
  rows?: string[][]
  // flowchart
  steps?: { label: string; note?: string }[]
  // key-takeaways / verdict
  label?: string
  // metric-strip
  metrics?: { label: string; value: string }[]
  // scenario-ladder
  scenarios?: { label: string; text: string }[]
  // callout
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
const noteIndex = indexData as { notes: ResearchNoteSummary[] }
const articleIndex = articlesData as { articles: ResearchArticle[] }

export function getSiteData() {
  return site
}

export function getSchemaRules() {
  return schema.rules
}

export function getAllNotes() {
  return [...noteIndex.notes].sort((a, b) => b.date.localeCompare(a.date))
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
  return articleIndex.articles.find((article) => article.slug === slug)
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
