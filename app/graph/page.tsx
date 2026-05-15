import Link from 'next/link'
import { SiteResearchGraph } from '../../components/research-graph'
import { getAllNotes } from '../../lib/research'

export const metadata = {
  title: 'Research Graph | G Research House',
  description: 'A site-wide graph of articles, related notes, and research keywords.',
}

export default function ResearchGraphPage() {
  const articles = getAllNotes()

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '3.5rem 1.5rem 4.5rem' }}>
      <Link
        href="/"
        style={{
          color: '#73695f',
          textDecoration: 'none',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '1.25rem',
        }}
      >
        {'<- Home'}
      </Link>

      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #ded6ca', paddingBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.28rem 0.7rem',
          background: '#f0f5f3',
          borderRadius: 20,
          fontSize: '0.7rem',
          color: '#3d6b5e',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          Research Graph
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.15rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.08 }}>
          Article And Keyword Map
        </h1>
        <p style={{ margin: '1rem 0 0', maxWidth: 760, color: '#4f473f', lineHeight: 1.75, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '1.06rem' }}>
          A site-wide view of how research notes connect through explicit related links and article-level keywords.
        </p>
      </header>

      <SiteResearchGraph articles={articles} />
    </main>
  )
}
