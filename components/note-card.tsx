import Link from 'next/link'
import { formatDisplayDate, type ResearchNoteSummary } from '../lib/research'

export default function NoteCard({ note }: { note: ResearchNoteSummary }) {
  return (
    <article
      className="noteCard"
      style={{
        padding: '1.25rem 0.25rem 1.25rem 0.65rem',
        borderBottom: '1px solid #e6e0d6',
        position: 'relative',
      }}
    >
      <div className="blockHandle" aria-hidden="true">+</div>
      <div
        style={{
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#8a8278',
          fontFamily: 'Helvetica Neue, sans-serif',
          marginBottom: '0.5rem',
        }}
      >
        {note.perspective} · {note.format} · {formatDisplayDate(note.date)}
      </div>
      <h2 style={{ margin: '0 0 0.45rem 0', fontSize: '1.35rem', fontWeight: 400, color: '#171717' }}>
        <Link href={`/research/${note.slug}`} className="titleLink" style={{ color: 'inherit', textDecoration: 'none' }}>
          {note.title}
        </Link>
      </h2>
      <p
        style={{
          margin: '0 0 0.75rem 0',
          color: '#45413c',
          lineHeight: 1.7,
          fontSize: '1rem',
          maxWidth: 740,
        }}
      >
        {note.summary}
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '0.8rem',
          color: '#6f675d',
        }}
      >
        {note.tags.map((tag) => (
          <span key={tag} style={{ border: '1px solid #ddd5ca', borderRadius: 999, padding: '0.2rem 0.55rem' }}>
            {tag}
          </span>
        ))}
      </div>
      <div className="noteActions" aria-hidden="true">
        <span>Open</span>
        <span>Duplicate</span>
      </div>
    </article>
  )
}
