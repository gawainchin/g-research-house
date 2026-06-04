import Link from 'next/link'
import { getMarketWatch, getRelatedNotesForTicker } from '../../lib/research'
import type { MarketTicker } from '../../lib/research'
import { getThemeFilters, getTopMovers, isMarketWatchStale, MARKET_WATCH_STALE_HOURS } from '../../lib/market-watch-utils.mjs'

const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'
const SANS = 'Helvetica Neue, sans-serif'
const RULE = '#ece6dd'

function formatUpdated(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function fmtPrice(ticker: MarketTicker) {
  if (!ticker.dataOk || ticker.price == null) return 'n/a'
  return `${ticker.currency ? `${ticker.currency} ` : ''}${ticker.price.toLocaleString(undefined, { maximumFractionDigits: ticker.price >= 1000 ? 0 : 2 })}`
}

function fmtPct(value?: number | null) {
  if (value == null || Number.isNaN(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function pctColor(value?: number | null) {
  if (value == null || Number.isNaN(value)) return '#73695f'
  if (value > 0) return '#24624f'
  if (value < 0) return '#9a3f36'
  return '#73695f'
}

function fmtMarketCap(value?: number | null, currency?: string | null) {
  if (value == null || Number.isNaN(value)) return '—'
  const abs = Math.abs(value)
  const unit = abs >= 1e12 ? 'T' : abs >= 1e9 ? 'B' : abs >= 1e6 ? 'M' : ''
  const divisor = unit === 'T' ? 1e12 : unit === 'B' ? 1e9 : unit === 'M' ? 1e6 : 1
  return `${currency ? `${currency} ` : ''}${(value / divisor).toFixed(unit === 'T' ? 2 : 1)}${unit}`
}

export default function MarketsPage() {
  const data = getMarketWatch()
  const isStale = isMarketWatchStale(data.updated)
  const topMovers = getTopMovers(data.tickers, 5)
  const themeFilters = getThemeFilters(data.tickers)

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', fontFamily: SANS, fontSize: '0.9rem' }}>
        <Link href="/" style={{ color: '#73695f', textDecoration: 'none' }}>← Home</Link>
        <Link href="/house-view" style={{ color: '#73695f', textDecoration: 'none' }}>House View</Link>
        <Link href="/what-changed" style={{ color: '#73695f', textDecoration: 'none' }}>What Changed</Link>
      </nav>

      <header style={{ borderBottom: `1px solid ${RULE}`, paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: SANS, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.75rem' }}>
          Delayed market snapshot · {formatUpdated(data.updated)}
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '3rem', fontWeight: 400, lineHeight: 1.05, margin: 0, color: '#151515' }}>
          {data.title}
        </h1>
        <p style={{ maxWidth: 760, margin: '1rem 0 0', color: '#48423b', fontFamily: SANS, fontSize: '1.05rem', lineHeight: 1.75 }}>
          {data.summary}
        </p>
        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: '#f7f5f0', border: `1px solid ${RULE}`, color: '#4f473f', fontFamily: SANS, fontSize: '0.9rem', lineHeight: 1.6 }}>
          <strong>Educational context only.</strong> {data.source}. Prices are delayed snapshots and should not be used for trading decisions.
        </div>
        {isStale ? (
          <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', background: '#fff4e6', border: '1px solid #e5b777', color: '#6b4618', fontFamily: SANS, fontSize: '0.9rem', lineHeight: 1.6 }}>
            <strong>Snapshot may be stale.</strong> This market watch was last refreshed more than {MARKET_WATCH_STALE_HOURS} hours ago. Refresh the static data before relying on these moves for current context.
          </div>
        ) : null}
      </header>

      <section style={{ marginBottom: '1.25rem', display: 'grid', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fbfaf7', border: `1px solid ${RULE}`, borderRadius: 6 }}>
          <div style={{ fontFamily: SANS, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.7rem' }}>
            Theme filters
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {themeFilters.map((filter) => (
              <a key={filter.theme} href={`#${filter.anchor}`} style={{ fontFamily: SANS, fontSize: '0.78rem', color: '#5f564d', textDecoration: 'none', border: `1px solid ${RULE}`, borderRadius: 999, padding: '0.35rem 0.65rem', background: '#fffdf8' }}>
                {filter.theme} · {filter.count}
              </a>
            ))}
          </div>
        </div>

        {topMovers.length ? (
          <div style={{ padding: '1rem', background: '#151515', borderRadius: 6, color: '#f7f1e8' }}>
            <div style={{ fontFamily: SANS, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8bfb3', marginBottom: '0.75rem' }}>
              Top movers · 1D absolute move
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' }}>
              {topMovers.map((ticker) => (
                <a key={ticker.symbol} href={`#ticker-${ticker.symbol.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #3a342e', padding: '0.75rem', background: '#1f1f1f' }}>
                  <div style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c8bfb3' }}>{ticker.symbol}</div>
                  <div style={{ fontFamily: SERIF, fontSize: '1.15rem', marginTop: '0.15rem' }}>{fmtPct(ticker.change1D)}</div>
                  <div style={{ fontFamily: SANS, fontSize: '0.72rem', color: '#9f968c', marginTop: '0.2rem' }}>{ticker.theme}</div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section style={{ display: 'grid', gap: '1.25rem' }}>
        {themeFilters.map(({ theme, anchor }) => {
          const tickers = data.tickers.filter((ticker) => ticker.theme === theme)
          return (
          <section id={anchor} key={theme} style={{ background: '#fbfaf7', border: `1px solid ${RULE}`, borderRadius: 6, overflow: 'hidden', scrollMarginTop: '1rem' }}>
            <div style={{ padding: '0.9rem 1rem', borderBottom: `1px solid ${RULE}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: '1.25rem', color: '#181818' }}>{theme}</h2>
              <div style={{ fontFamily: SANS, fontSize: '0.75rem', color: '#80766b' }}>{tickers.length} tickers</div>
            </div>
            <div style={{ display: 'grid' }}>
              {tickers.map((ticker: MarketTicker) => {
                const related = getRelatedNotesForTicker(ticker)
                const tickerAnchor = `ticker-${ticker.symbol.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                return (
                  <div id={tickerAnchor} key={ticker.symbol} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.2fr) repeat(5, minmax(70px, 0.55fr)) minmax(220px, 1fr)', gap: '0.75rem', alignItems: 'center', padding: '0.95rem 1rem', borderTop: `1px solid ${RULE}`, scrollMarginTop: '1rem' }} className="marketTickerRow">
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6f665d' }}>{ticker.symbol}</div>
                      <div style={{ fontFamily: SERIF, color: '#181818', fontSize: '1.08rem' }}>{ticker.name}</div>
                      <div style={{ fontFamily: SANS, color: '#6f665d', fontSize: '0.78rem', marginTop: '0.35rem', lineHeight: 1.45 }}>{ticker.watchReason}</div>
                      {!ticker.dataOk ? <div style={{ fontFamily: SANS, color: '#9a3f36', fontSize: '0.78rem', marginTop: '0.2rem' }}>{ticker.error ?? 'data unavailable'}</div> : null}
                    </div>
                    {[
                      ['Price', fmtPrice(ticker), '#181818'],
                      ['1D', fmtPct(ticker.change1D), pctColor(ticker.change1D)],
                      ['5D', fmtPct(ticker.change5D), pctColor(ticker.change5D)],
                      ['1M', fmtPct(ticker.change1M), pctColor(ticker.change1M)],
                      ['YTD', fmtPct(ticker.changeYTD), pctColor(ticker.changeYTD)],
                    ].map(([label, value, color]) => (
                      <div key={label}>
                        <div style={{ fontFamily: SANS, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9085', marginBottom: '0.15rem' }}>{label}</div>
                        <div style={{ fontFamily: SANS, color, fontWeight: 600, fontSize: '0.92rem' }}>{value}</div>
                      </div>
                    ))}
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9a9085', marginBottom: '0.25rem' }}>Research links</div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {related.slice(0, 2).map((note, index) => (
                          <Link key={note.slug} href={`/research/${note.slug}`} style={{ fontFamily: SANS, fontSize: '0.72rem', color: '#5f564d', textDecoration: 'none', border: `1px solid ${RULE}`, padding: '0.22rem 0.4rem', background: '#fffdf8' }}>
                            Article {index + 1}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          )
        })}
      </section>
    </main>
  )
}
