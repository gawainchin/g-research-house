import Link from 'next/link'
import { formatDisplayDate, type ResearchNoteSummary } from '../lib/research'

const SECTION_STYLE = {
  'ai-research': {
    chipBg: '#e8eaf0',
    chipText: '#3d4560',
    borderAccent: '#4a5568',
    cardBg: '#f7f8fa',
    cardBorder: '#e2e5ea',
  },
  'financial-research': {
    chipBg: '#e4f0ec',
    chipText: '#1e4d3a',
    borderAccent: '#3d6b5e',
    cardBg: '#f7faf8',
    cardBorder: '#c8ded6',
  },
} as const

type SectionSlug = keyof typeof SECTION_STYLE
function isSectionSlug(s?: string): s is SectionSlug {
  return !!s && s in SECTION_STYLE
}

const FORMAT_ICONS: Record<string, string> = {
  'workflow': '⚙',
  'thesis': '◎',
  'company-compare': '◈',
  'indicator': '◉',
  'sector-map': '▣',
  'default': '▤',
}

export default function NoteCard({ note, section }: { note: ResearchNoteSummary; section?: string }) {
  const style = isSectionSlug(section) ? SECTION_STYLE[section] : SECTION_STYLE['ai-research']

  return (
    <article
      className="noteCard"
      style={{
        padding: '1.25rem',
        background: style.cardBg,
        border: `1px solid ${style.cardBorder}`,
        borderLeft: `3px solid ${style.borderAccent}`,
        borderRadius: '0 4px 4px 0',
        transition: 'border-color 0.15s',
      }}
    >
      {/* Metadata strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.6rem',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.68rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#8a8278',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {note.perspective}
        </span>
        <span style={{ color: '#d0c8bc', fontSize: '0.7rem' }}>·</span>

        {/* Format chip */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.15rem 0.5rem',
          background: style.chipBg,
          borderRadius: 999,
          fontSize: '0.68rem',
          color: style.chipText,
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 500,
        }}>
          {FORMAT_ICONS[note.format] ?? '▤'} {note.format.replace('-', ' ')}
        </span>

        <span style={{ color: '#d0c8bc', fontSize: '0.7rem' }}>·</span>
        <span style={{
          fontSize: '0.72rem',
          color: '#8a8278',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {note.readingTime} min
        </span>
        <span style={{ color: '#d0c8bc', fontSize: '0.7rem' }}>·</span>
        <span style={{
          fontSize: '0.72rem',
          color: '#8a8278',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {formatDisplayDate(note.date)}
        </span>
      </div>

      {/* Title */}
      <h2 style={{
        margin: '0 0 0.45rem 0',
        fontSize: '1.3rem',
        fontWeight: 400,
        color: '#171717',
        fontFamily: 'Georgia, serif',
        lineHeight: 1.3,
      }}>
        <Link href={`/research/${note.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {note.title}
        </Link>
      </h2>

      {/* Summary */}
      <p style={{
        margin: '0 0 0.85rem 0',
        color: '#45413c',
        lineHeight: 1.7,
        fontSize: '0.97rem',
        maxWidth: 740,
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        {note.summary}
      </p>

      {/* Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        fontFamily: 'Helvetica Neue, sans-serif',
        fontSize: '0.78rem',
        color: '#6f675d',
      }}>
        {note.tags.map((tag) => (
          <span key={tag} style={{
            border: '1px solid #ddd5ca',
            borderRadius: 999,
            padding: '0.18rem 0.5rem',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
