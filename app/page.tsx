import Link from 'next/link'
import NoteCard from '../components/note-card'
import { getFeaturedNotes, getSchemaRules, getSiteData } from '../lib/research'

const ui = {
  colors: {
    text: '#171717',
    mutedText: '#6f675d',
    subtleText: '#8a8278',
    surface: '#fffdfa',
    pageBorder: '#e6e0d6',
    cardBorder: '#dfd8cd',
    chipBorder: '#ddd5ca',
    hoverSurface: '#f5f1e9',
    calloutSurface: '#f8f3ea',
    focus: '#8b7d6b',
  },
  radius: {
    sm: 6,
    md: 8,
    pill: 999,
  },
}

const labelStyle = {
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: ui.colors.subtleText,
  fontFamily: 'Helvetica Neue, sans-serif',
}

const chipStyle = {
  border: `1px solid ${ui.colors.chipBorder}`,
  borderRadius: ui.radius.sm,
  padding: '0.24rem 0.5rem',
  background: ui.colors.surface,
}

const propertyStyle = {
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  gap: '0.7rem',
  alignItems: 'start',
  padding: '0.55rem 0',
  borderBottom: '1px solid #ece6dd',
  color: '#4b4640',
  lineHeight: 1.55,
}

export default function Home() {
  const site = getSiteData()
  const featured = getFeaturedNotes()
  const rules = getSchemaRules()
  const noteCount = featured.length
  const latestNote = featured[0]

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>
      <nav
        aria-label="Workspace"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem',
          marginBottom: '2.6rem',
          color: '#6c645b',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '0.86rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <span style={{ width: 22, height: 22, display: 'inline-grid', placeItems: 'center', border: '1px solid #ded6ca', borderRadius: 6, background: '#fffdfa', color: '#34302c', fontSize: '0.75rem' }}>G</span>
          <span>Research House</span>
          <span style={{ color: '#b5aa9d' }}>/</span>
          <span style={{ color: '#2f2b27' }}>Home</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span style={chipStyle}>Private</span>
          <span style={chipStyle}>{noteCount} featured</span>
        </div>
      </nav>

      <header style={{ marginBottom: '2.5rem', borderBottom: `1px solid ${ui.colors.pageBorder}`, paddingBottom: '1.5rem' }}>
        <div style={{ width: 58, height: 58, border: '1px solid #ded6ca', borderRadius: 8, background: '#fffdfa', display: 'grid', placeItems: 'center', color: '#211f1c', font: '400 1.45rem Georgia, serif', marginBottom: '1.15rem' }}>
          G
        </div>
        <div style={{ ...labelStyle, marginBottom: '0.55rem' }}>Private research surface</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.15rem, 5vw, 4.5rem)', fontWeight: 400, color: '#141414', lineHeight: 1.03 }}>{site.title}</h1>
        <p style={{ margin: '1rem 0 0 0', fontSize: '1.15rem', color: '#403a34', lineHeight: 1.7, maxWidth: 780 }}>{site.tagline}</p>
        <p style={{ margin: '0.75rem 0 0 0', color: '#5a544d', lineHeight: 1.75, maxWidth: 780 }}>{site.intro}</p>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '0.82rem',
            color: ui.colors.mutedText,
          }}
        >
          {latestNote && (
            <Link href={`/research/${latestNote.slug}`} className="readerPill">
              Start with latest
            </Link>
          )}
          <span style={chipStyle}>Curated notes</span>
          <span style={chipStyle}>Updated when research is ready</span>
          <Link href={`/${site.sections[0]?.slug ?? ''}`} className="readerPill">
            Browse by lens
          </Link>
        </div>

        <div style={{ marginTop: '1.65rem', maxWidth: 760, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.9rem' }}>
          <div style={propertyStyle}>
            <div style={{ color: ui.colors.subtleText }}>Status</div>
            <div>Active private research workspace</div>
          </div>
          <div style={propertyStyle}>
            <div style={{ color: ui.colors.subtleText }}>Lenses</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {site.sections.map((section) => (
                <Link key={section.slug} href={`/${section.slug}`} className="interactiveChip" style={{ color: '#37322d', textDecoration: 'none', border: `1px solid ${ui.colors.chipBorder}`, borderRadius: ui.radius.sm, padding: '0.18rem 0.45rem', background: ui.colors.surface }}>
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
          <div style={propertyStyle}>
            <div style={{ color: '#8a8278' }}>Output</div>
            <div>Theses, maps, compares, workflow notes, and infrastructure reads</div>
          </div>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
        {site.sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${section.slug}`}
            className="sectionCard"
            style={{
              border: `1px solid ${ui.colors.cardBorder}`,
              borderRadius: ui.radius.md,
              padding: '1.25rem',
              textDecoration: 'none',
              color: 'inherit',
              background: ui.colors.surface,
            }}
          >
            <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Section</div>
            <div style={{ fontSize: '1.35rem', marginBottom: '0.45rem', color: ui.colors.text }}>{section.title}</div>
            <div style={{ color: '#544e47', lineHeight: 1.65 }}>{section.description}</div>
          </Link>
        ))}
      </section>

      <section style={{ marginBottom: '3rem', border: `1px solid ${ui.colors.cardBorder}`, borderRadius: ui.radius.md, background: ui.colors.calloutSurface, padding: '1rem 1.1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 auto', width: 28, height: 28, borderRadius: ui.radius.sm, display: 'grid', placeItems: 'center', background: '#efe7dc', color: '#4f463d', fontFamily: 'Helvetica Neue, sans-serif' }}>i</div>
          <div>
            <div style={{ ...labelStyle, marginBottom: '0.55rem' }}>Editorial rules</div>
            <details open>
              <summary className="rulesSummary">Research writing standards</summary>
              <ul style={{ margin: '0.55rem 0 0 0', paddingLeft: '1.2rem', color: '#49433d', lineHeight: 1.8 }}>
                {rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
            </details>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderBottom: `1px solid ${ui.colors.pageBorder}`, paddingBottom: '0.75rem', marginBottom: '0.35rem' }}>
          <div>
            <div style={{ ...labelStyle, marginBottom: '0.3rem' }}>Featured database</div>
            <h2 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 400, color: ui.colors.text }}>Notes</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.82rem', color: ui.colors.mutedText }}>
            <span style={{ ...chipStyle, fontWeight: 600 }}>Latest first</span>
            <span style={chipStyle}>Grouped by topic</span>
            <span style={chipStyle}>{noteCount} selected reads</span>
            {latestNote && (
              <Link href={`/research/${latestNote.slug}`} className="readerPill">
                Read latest
              </Link>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {featured.map((note) => <NoteCard key={note.slug} note={note} section={note.section} />)}
        </div>
      </section>
    </main>
  )
}
