import Link from 'next/link'
import NoteCard from '../components/note-card'
import { getFeaturedNotes, getSchemaRules, getSiteData } from '../lib/research'

export default function Home() {
  const site = getSiteData()
  const featured = getFeaturedNotes()
  const rules = getSchemaRules()

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid #e6e0d6', paddingBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.55rem' }}>
          Private research surface
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 400, color: '#141414' }}>{site.title}</h1>
        <p style={{ margin: '0.8rem 0 0 0', fontSize: '1.15rem', color: '#403a34', lineHeight: 1.7, maxWidth: 760 }}>{site.tagline}</p>
        <p style={{ margin: '0.75rem 0 0 0', color: '#5a544d', lineHeight: 1.75, maxWidth: 760 }}>{site.intro}</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {site.sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${section.slug}`}
            style={{
              border: '1px solid #dfd8cd',
              borderRadius: 18,
              padding: '1.25rem',
              textDecoration: 'none',
              color: 'inherit',
              background: '#fffdfa',
            }}
          >
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.5rem' }}>
              Section
            </div>
            <div style={{ fontSize: '1.35rem', marginBottom: '0.45rem', color: '#171717' }}>{section.title}</div>
            <div style={{ color: '#544e47', lineHeight: 1.65 }}>{section.description}</div>
          </Link>
        ))}
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.85rem' }}>
          Editorial rules
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#49433d', lineHeight: 1.8 }}>
          {rules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </section>

      <section>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.85rem' }}>
          Featured notes
        </div>
        {featured.map((note) => <NoteCard key={note.slug} note={note} />)}
      </section>
    </main>
  )
}
