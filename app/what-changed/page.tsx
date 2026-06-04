import Link from 'next/link'
import { formatDisplayDate, getResearchClusterBySlug, getRelatedNotes, getWhatChanged } from '../../lib/research'

const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'
const SANS = 'Helvetica Neue, sans-serif'
const RULE = '#ece6dd'

function badgeTone(direction: string) {
  const normalized = direction.toLowerCase()
  if (normalized.includes('strength')) return { bg: '#e8f2ee', color: '#245646', border: '#c8ded6' }
  if (normalized.includes('watch')) return { bg: '#f7f2e8', color: '#7a5727', border: '#e8d8b8' }
  return { bg: '#eceff3', color: '#394454', border: '#d9dee6' }
}

export default function WhatChangedPage() {
  const data = getWhatChanged()

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', fontFamily: SANS, fontSize: '0.9rem' }}>
        <Link href="/" style={{ color: '#73695f', textDecoration: 'none' }}>← Home</Link>
        <Link href="/house-view" style={{ color: '#73695f', textDecoration: 'none' }}>House View</Link>
        <Link href="/markets" style={{ color: '#73695f', textDecoration: 'none' }}>Ticker Monitor</Link>
      </nav>

      <header style={{ borderBottom: `1px solid ${RULE}`, paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: SANS, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.75rem' }}>
          Research delta log · updated {formatDisplayDate(data.updated)}
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '3rem', fontWeight: 400, lineHeight: 1.05, margin: 0, color: '#151515' }}>
          {data.title}
        </h1>
        <p style={{ maxWidth: 760, margin: '1rem 0 0', color: '#48423b', fontFamily: SANS, fontSize: '1.05rem', lineHeight: 1.75 }}>
          {data.summary}
        </p>
        <div style={{ marginTop: '1rem', color: '#80766b', fontFamily: SANS, fontSize: '0.86rem' }}>
          Source: {data.sourceNote}
        </div>
      </header>

      <section style={{ display: 'grid', gap: '1rem' }}>
        {data.entries.map((entry) => {
          const cluster = entry.clusterSlug ? getResearchClusterBySlug(entry.clusterSlug) : undefined
          const related = getRelatedNotes(entry.articleSlugs)
          const tone = badgeTone(entry.direction)
          return (
            <article key={entry.id} style={{ padding: '1.25rem', background: '#fbfaf7', border: `1px solid ${RULE}`, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.45rem' }}>
                    {formatDisplayDate(entry.date)} · {entry.status}
                  </div>
                  <h2 style={{ fontFamily: SERIF, fontSize: '1.45rem', fontWeight: 400, color: '#181818', margin: 0 }}>
                    {entry.title}
                  </h2>
                </div>
                <span style={{ fontFamily: SANS, fontSize: '0.75rem', border: `1px solid ${tone.border}`, background: tone.bg, color: tone.color, padding: '0.3rem 0.55rem', borderRadius: 999, whiteSpace: 'nowrap' }}>
                  {entry.direction}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }} className="twoColResponsive">
                {[
                  ['What changed', entry.whatChanged],
                  ['Thesis impact', entry.thesisImpact],
                  ['Expression impact', entry.expressionImpact],
                  ['Follow-up', entry.followUp],
                ].map(([label, text]) => (
                  <div key={label} style={{ borderTop: `1px solid ${RULE}`, paddingTop: '0.75rem' }}>
                    <div style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.35rem' }}>{label}</div>
                    <p style={{ margin: 0, fontFamily: SANS, color: '#4f473f', lineHeight: 1.65, fontSize: '0.92rem' }}>{text}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${RULE}` }}>
                {cluster ? <Link href={`/themes/${cluster.slug}`} style={{ color: '#1f2933', fontFamily: SANS, fontSize: '0.86rem', textDecoration: 'none', border: `1px solid ${RULE}`, padding: '0.4rem 0.65rem', background: '#fffdf8' }}>Theme: {cluster.title}</Link> : null}
                {related.map((note) => (
                  <Link key={note.slug} href={`/research/${note.slug}`} style={{ color: '#5f564d', fontFamily: SANS, fontSize: '0.86rem', textDecoration: 'none', border: `1px solid ${RULE}`, padding: '0.4rem 0.65rem', background: '#fffdf8' }}>
                    {note.title}
                  </Link>
                ))}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
