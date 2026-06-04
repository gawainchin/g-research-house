export const MARKET_WATCH_STALE_HOURS = 24

export function isMarketWatchStale(updated, now = new Date(), staleHours = MARKET_WATCH_STALE_HOURS) {
  const updatedDate = new Date(updated)
  const nowDate = now instanceof Date ? now : new Date(now)
  if (Number.isNaN(updatedDate.getTime()) || Number.isNaN(nowDate.getTime())) return true
  return nowDate.getTime() - updatedDate.getTime() > staleHours * 60 * 60 * 1000
}

export function slugifyTheme(theme) {
  return String(theme ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getThemeFilters(tickers) {
  const counts = new Map()
  for (const ticker of tickers ?? []) {
    if (!ticker?.theme) continue
    counts.set(ticker.theme, (counts.get(ticker.theme) ?? 0) + 1)
  }
  return Array.from(counts.entries()).map(([theme, count]) => ({
    theme,
    anchor: slugifyTheme(theme),
    count,
  }))
}

export function getTopMovers(tickers, limit = 5) {
  return [...(tickers ?? [])]
    .filter((ticker) => ticker?.dataOk && Number.isFinite(ticker.change1D))
    .sort((a, b) => Math.abs(b.change1D) - Math.abs(a.change1D))
    .slice(0, limit)
}

export function mergeArticleSlugs(...slugGroups) {
  const seen = new Set()
  const merged = []
  for (const group of slugGroups) {
    for (const slug of group ?? []) {
      if (!slug || seen.has(slug)) continue
      seen.add(slug)
      merged.push(slug)
    }
  }
  return merged
}

function articleSearchText(article) {
  return [
    article?.title,
    article?.summary,
    ...(article?.tags ?? []),
    ...(article?.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function findAutoLinkedArticleSlugs(ticker, articles, limit = 4) {
  const manual = new Set(ticker?.articleSlugs ?? [])
  const keywords = [ticker?.symbol, ticker?.name, ...(ticker?.autoLinkKeywords ?? [])]
    .filter(Boolean)
    .map((keyword) => String(keyword).toLowerCase())

  if (!keywords.length) return []

  const matches = []
  for (const article of articles ?? []) {
    if (!article?.slug || manual.has(article.slug)) continue
    const text = articleSearchText(article)
    const score = keywords.reduce((acc, keyword) => acc + (text.includes(keyword) ? 1 : 0), 0)
    if (score > 0) matches.push({ slug: article.slug, score, date: article.date ?? '' })
  }

  return matches
    .sort((a, b) => b.score - a.score || String(b.date).localeCompare(String(a.date)))
    .slice(0, limit)
    .map((match) => match.slug)
}
