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
  | 'scorecard'
  | 'bar-chart'
  | 'line-chart'
  | 'timeline'
  | 'stack-diagram'

export interface ContentBlock {
  type: ContentBlockType
  text?: string
  items?: string[]
  takeaways?: { icon?: string; text: string }[]
  title?: string
  label?: string
  columns?: string[]
  rows?: string[][]
  steps?: { label: string; note?: string }[]
  metrics?: { label: string; value: string }[]
  criteria?: { label: string; score: number; note?: string }[]
  bars?: { label: string; value: number; note?: string }[]
  series?: { label: string; points: { label: string; value: number }[] }[]
  events?: { label: string; date?: string; text: string }[]
  layers?: { label: string; text: string }[]
  unit?: string
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
  keywords: string[]
  visualKey?: string
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

export function formatDisplayDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
