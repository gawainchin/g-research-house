import Link from 'next/link'
import ContentsList from '../components/contents-list'
import { formatDisplayDate, getAllNotes, getSchemaRules, getSiteData } from '../lib/research'

const RULE = '#ece6dd'
const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'

const eyebrow = {
  fontFamily: 'Helvetica Neue, sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a8278',
}

const navLink = {
  color: 'inherit',
  textDecoration: 'none',
}

export default function Home() {
  const site = getSiteData()
  const notes = getAllNotes()
  const rules = getSchemaRules()
  const latest = notes[0]

  return (
    <main
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '1.5rem 1.5rem 4rem',
        fontFamily: SERIF,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          borderBottom: `1px solid ${RULE}`,
          paddingBottom: '0.85rem',
          marginBottom: '3.5rem',
        }}
      >
        <Link href="/" style={{ ...navLink, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span
            style={{
              width: 22,
              height: 22,
              display: 'inline-grid',
              placeItems: 'center',
              border: `1px solid ${RULE}`,
              borderRadius: 3,
              color: '#34302c',
              fontSize: '0.78rem',
              fontFamily: SERIF,
            }}
          >
            G
          </span>
          <span style={{ fontFamily: SERIF, fontSize: '1rem', color: '#171717' }}>G Research House</span>
        </Link>
        <nav
          aria-label="Sections"
          style={{ ...eyebrow, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
        >
          <Link href="/ai-research" style={navLink}>AI Research</Link>
          <span aria-hidden style={{ color: '#bcb3a5' }}>·</span>
          <Link href="/financial-research" style={navLink}>Financial Research</Link>
          <span aria-hidden style={{ color: '#bcb3a5' }}>·</span>
          <Link href="/graph" style={navLink}>Graph</Link>
          <span aria-hidden style={{ color: '#bcb3a5' }}>·</span>
          <Link href="/visual-demo" style={navLink}>Visual</Link>
        </nav>
      </header>

      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ ...eyebrow, marginBottom: '0.85rem' }}>Private research surface</div>
        <h1
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 'clamp(1.9rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.005em',
            color: '#141414',
          }}
        >
          {site.title}
        </h1>
        <p
          style={{
            margin: '1.15rem 0 0 0',
            fontFamily: SERIF,
            fontSize: '1.05rem',
            color: '#403a34',
            lineHeight: 1.55,
            maxWidth: 620,
          }}
        >
          {site.tagline}
        </p>
        <p
          style={{
            margin: '1rem 0 0 0',
            fontFamily: SERIF,
            fontSize: '0.98rem',
            color: '#403a34',
            lineHeight: 1.75,
            maxWidth: 620,
          }}
        >
          {site.intro}
        </p>
      </section>

      <ContentsList notes={notes} />

      <details style={{ borderTop: `1px solid ${RULE}`, paddingTop: '1.2rem', marginTop: '3rem' }}>
        <summary
          style={{ ...eyebrow, cursor: 'pointer', listStyle: 'none', color: '#8a8278' }}
        >
          Editorial rules ▾
        </summary>
        <ul
          style={{
            margin: '0.95rem 0 0 0',
            paddingLeft: '1.2rem',
            fontFamily: SERIF,
            color: '#5a544d',
            lineHeight: 1.8,
            fontSize: '0.95rem',
          }}
        >
          {rules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </details>

      <footer
        style={{
          ...eyebrow,
          marginTop: '2.5rem',
          paddingTop: '1.2rem',
          borderTop: `1px solid ${RULE}`,
        }}
      >
        G Research House · Updated {latest ? formatDisplayDate(latest.date) : '—'}
      </footer>
    </main>
  )
}
