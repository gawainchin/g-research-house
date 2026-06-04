import Link from 'next/link'
import { formatDisplayDate, getHouseView, getNotesForCluster } from '../../lib/research'

const RULE = '#ece6dd'
const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'
const LENS_ACCENT = {
  'ai-research': '#4a5568',
  'financial-research': '#3d6b5e',
} as const

const eyebrow = {
  fontFamily: 'Helvetica Neue, sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a8278',
}

export default function HouseViewPage() {
  const houseView = getHouseView()

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '3.5rem 1.5rem 4rem', fontFamily: SERIF }}>
      <Link href="/" style={{ color: '#73695f', textDecoration: 'none', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.9rem' }}>
        ← Home
      </Link>

      <header style={{ margin: '2rem 0 2.5rem', borderBottom: `1px solid ${RULE}`, paddingBottom: '1.5rem' }}>
        <div style={{ ...eyebrow, marginBottom: '0.75rem' }}>Updated {formatDisplayDate(houseView.updated)}</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.05, fontWeight: 400, color: '#141414' }}>
          {houseView.title}
        </h1>
        <p style={{ margin: '1rem 0 0', maxWidth: 680, color: '#403a34', lineHeight: 1.7, fontSize: '1.05rem' }}>
          {houseView.summary}
        </p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ ...eyebrow, marginBottom: '1rem' }}>Current working theses</div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {houseView.theses.map((thesis) => {
            const accent = LENS_ACCENT[thesis.lens]
            return (
              <article key={thesis.slug} style={{ background: '#fffdfa', border: `1px solid ${RULE}`, borderLeft: `3px solid ${accent}`, borderRadius: '0 5px 5px 0', padding: '1.25rem' }}>
                <div style={{ ...eyebrow, color: accent, marginBottom: '0.6rem' }}>
                  {thesis.status} · {thesis.conviction} conviction · {thesis.lens.replace('-', ' ')}
                </div>
                <h2 style={{ margin: 0, fontWeight: 400, fontSize: '1.45rem', lineHeight: 1.2 }}>
                  {thesis.title}
                </h2>
                <p style={{ margin: '0.7rem 0 0', color: '#403a34', lineHeight: 1.65, fontSize: '1rem' }}>
                  {thesis.claim}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem', marginTop: '1rem' }}>
                  <div style={{ background: '#faf6ed', border: `1px solid ${RULE}`, padding: '0.85rem' }}>
                    <div style={{ ...eyebrow, marginBottom: '0.35rem' }}>What changed</div>
                    <p style={{ margin: 0, color: '#514b44', lineHeight: 1.55, fontSize: '0.92rem' }}>{thesis.whatChanged}</p>
                  </div>
                  <div style={{ background: '#faf6ed', border: `1px solid ${RULE}`, padding: '0.85rem' }}>
                    <div style={{ ...eyebrow, marginBottom: '0.35rem' }}>Would change view</div>
                    <p style={{ margin: 0, color: '#514b44', lineHeight: 1.55, fontSize: '0.92rem' }}>{thesis.wouldChangeView}</p>
                  </div>
                </div>
                <Link href={`/themes/${thesis.clusterSlug}`} className="readerPill" style={{ ...eyebrow, display: 'inline-block', marginTop: '1rem', color: accent }}>
                  Open research cluster →
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <div style={{ ...eyebrow, marginBottom: '1rem' }}>Research clusters</div>
        <div className="houseThesisGrid">
          {houseView.clusters.map((cluster) => {
            const accent = LENS_ACCENT[cluster.lens]
            const notes = getNotesForCluster(cluster)
            return (
              <Link key={cluster.slug} href={`/themes/${cluster.slug}`} className="clusterCard" style={{ borderTopColor: accent }}>
                <div style={{ ...eyebrow, color: accent, marginBottom: '0.55rem' }}>
                  {cluster.status} · {cluster.conviction} · {notes.length} notes
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 400, lineHeight: 1.2 }}>
                  {cluster.title}
                </h3>
                <p style={{ margin: '0.6rem 0 0', color: '#5a544d', lineHeight: 1.55, fontSize: '0.92rem' }}>
                  {cluster.summary}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
