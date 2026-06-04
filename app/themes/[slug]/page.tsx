import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoteList from '../../../components/note-list'
import {
  getNotesForCluster,
  getResearchClusterBySlug,
  getResearchClusters,
  getThesisForCluster,
} from '../../../lib/research'

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

export function generateStaticParams() {
  return getResearchClusters().map((cluster) => ({ slug: cluster.slug }))
}

export const dynamicParams = false

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cluster = getResearchClusterBySlug(slug)
  if (!cluster) notFound()

  const notes = getNotesForCluster(cluster)
  const thesis = getThesisForCluster(cluster.slug)
  const accent = LENS_ACCENT[cluster.lens]

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '3.5rem 1.5rem 4rem', fontFamily: SERIF }}>
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.9rem' }}>
        <Link href="/" style={{ color: '#73695f', textDecoration: 'none' }}>← Home</Link>
        <span style={{ color: '#c7beb0' }}>/</span>
        <Link href="/house-view" style={{ color: '#73695f', textDecoration: 'none' }}>House View</Link>
      </div>

      <div style={{ height: 3, background: `linear-gradient(to right, ${accent}, ${accent}30)`, borderRadius: 2, marginBottom: '2rem' }} />

      <header style={{ marginBottom: '2.5rem', borderBottom: `1px solid ${RULE}`, paddingBottom: '1.4rem' }}>
        <div style={{ ...eyebrow, color: accent, marginBottom: '0.75rem' }}>
          {cluster.status} · {cluster.conviction} conviction · {cluster.lens.replace('-', ' ')}
        </div>
        <h1 style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(2rem, 5vw, 3.1rem)', lineHeight: 1.08, color: '#141414' }}>
          {cluster.title}
        </h1>
        <p style={{ margin: '1rem 0 0', maxWidth: 700, color: '#403a34', lineHeight: 1.7, fontSize: '1.05rem' }}>
          {cluster.summary}
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(220px, 0.7fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <article style={{ background: '#fffdfa', border: `1px solid ${RULE}`, borderLeft: `3px solid ${accent}`, padding: '1.1rem', borderRadius: '0 5px 5px 0' }}>
          <div style={{ ...eyebrow, color: accent, marginBottom: '0.5rem' }}>Cluster thesis</div>
          <p style={{ margin: 0, color: '#403a34', lineHeight: 1.7, fontSize: '1rem' }}>{cluster.thesis}</p>
        </article>
        <article style={{ background: '#faf6ed', border: `1px solid ${RULE}`, padding: '1.1rem', borderRadius: 5 }}>
          <div style={{ ...eyebrow, marginBottom: '0.5rem' }}>Would change view</div>
          <p style={{ margin: 0, color: '#514b44', lineHeight: 1.6, fontSize: '0.94rem' }}>{cluster.wouldChangeView}</p>
        </article>
      </section>

      {thesis && (
        <section style={{ marginBottom: '2.5rem', background: '#fffdfa', border: `1px solid ${RULE}`, padding: '1rem 1.1rem', borderRadius: 5 }}>
          <div style={{ ...eyebrow, color: accent, marginBottom: '0.5rem' }}>Current house claim</div>
          <p style={{ margin: 0, color: '#403a34', lineHeight: 1.65 }}>{thesis.claim}</p>
        </section>
      )}

      <section>
        <div style={{ ...eyebrow, marginBottom: '1rem' }}>Linked research</div>
        <NoteList notes={notes} section={cluster.lens} />
      </section>
    </main>
  )
}
