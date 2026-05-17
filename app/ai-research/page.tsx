import Link from 'next/link'
import NoteList from '../../components/note-list'
import { getNotesBySection, getSectionMeta } from '../../lib/research'

const SECTION_ACCENT = '#4a5568' // AI slate
const ACCENT_LIGHT = '#f0f2f5'
const ACCENT_MID = '#e2e5ea'

export default function AiResearchPage() {
  const section = getSectionMeta('ai-research')
  const notes = getNotesBySection('ai-research')

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, ${SECTION_ACCENT}, ${SECTION_ACCENT}30)`,
        borderRadius: 2,
        marginBottom: '2.5rem',
      }} />

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
        ← Home
      </Link>

      <header style={{ margin: '0 0 2.5rem', borderBottom: `1px solid ${ACCENT_MID}`, paddingBottom: '1.25rem' }}>
        {/* Section label chip */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.28rem 0.7rem',
          background: ACCENT_LIGHT,
          borderRadius: 20,
          fontSize: '0.7rem',
          color: SECTION_ACCENT,
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          ⚙ AI Research
        </div>

        <h1 style={{
          margin: '0 0 0.75rem',
          fontWeight: 400,
          fontSize: '2.2rem',
          color: '#161616',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.2,
        }}>
          {section?.title}
        </h1>

        <p style={{
          margin: 0,
          maxWidth: 680,
          color: '#544e47',
          lineHeight: 1.75,
          fontSize: '1.05rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {section?.description}
        </p>
      </header>

      {/* Format legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '2rem',
        padding: '0.85rem 1rem',
        background: ACCENT_LIGHT,
        borderRadius: 4,
        fontSize: '0.78rem',
        color: '#5a6270',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        <span style={{ fontWeight: 600, color: SECTION_ACCENT }}>Formats:</span>
        <span>⚙ Workflow</span>
        <span style={{ color: ACCENT_MID }}>|</span>
        <span>◉ Indicator</span>
        <span style={{ color: ACCENT_MID }}>|</span>
        <span>◎ Thesis</span>
        <span style={{ color: ACCENT_MID }}>|</span>
        <span>▣ Sector Map</span>
      </div>

      <NoteList notes={notes} section="ai-research" />
    </main>
  )
}
