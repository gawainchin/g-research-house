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
  | 'exposure-matrix'
  | 'constraint-stack'
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
  xAxis?: string
  yAxis?: string
  points?: { label: string; bucket?: string; x: number; y: number; note?: string }[]
  criteria?: { label: string; score: number; note?: string }[]
  bars?: { label: string; value: number; note?: string }[]
  series?: { label: string; points: { label: string; value: number }[] }[]
  events?: { label: string; date?: string; text: string }[]
  layers?: { label: string; text?: string; note?: string; status?: string }[]
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

export interface HouseThesis {
  slug: string
  title: string
  status: string
  conviction: string
  lens: ResearchSectionSlug
  claim: string
  whatChanged: string
  wouldChangeView: string
  clusterSlug: string
}

export interface ResearchCluster {
  slug: string
  title: string
  lens: ResearchSectionSlug
  status: string
  conviction: string
  summary: string
  thesis: string
  wouldChangeView: string
  articleSlugs: string[]
}

export interface HouseViewData {
  title: string
  updated: string
  summary: string
  theses: HouseThesis[]
  clusters: ResearchCluster[]
}

export interface WhatChangedEntry {
  id: string
  date: string
  clusterSlug?: string
  title: string
  direction: string
  status: string
  whatChanged: string
  thesisImpact: string
  expressionImpact: string
  followUp: string
  articleSlugs: string[]
}

export interface WhatChangedData {
  title: string
  updated: string
  sourceNote: string
  summary: string
  entries: WhatChangedEntry[]
}

export interface MarketTicker {
  symbol: string
  name: string
  theme: string
  articleSlugs: string[]
  currency?: string | null
  price?: number | null
  change1D?: number | null
  change5D?: number | null
  change1M?: number | null
  changeYTD?: number | null
  marketCap?: number | null
  dataOk: boolean
  error?: string | null
}

export interface MarketWatchData {
  title: string
  updated: string
  source: string
  summary: string
  tickers: MarketTicker[]
}

export function formatDisplayDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
