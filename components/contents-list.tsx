'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ResearchNoteSummary, ResearchSectionSlug } from '../lib/research-types'

const RULE = '#ece6dd'
const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'

const eyebrow = {
  fontFamily: 'Helvetica Neue, sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a8278',
}

const SECTION_LABEL: Record<ResearchSectionSlug, string> = {
  'ai-research': 'AI',
  'financial-research': 'Financial',
}

type Filter = 'all' | ResearchSectionSlug

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ai-research', label: 'AI Research' },
  { value: 'financial-research', label: 'Financial Research' },
]

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default function ContentsList({ notes }: { notes: ResearchNoteSummary[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [newestFirst, setNewestFirst] = useState(true)

  const visible = useMemo(() => {
    const f = filter === 'all' ? notes : notes.filter((n) => n.section === filter)
    return [...f].sort((a, b) => (newestFirst ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
  }, [notes, filter, newestFirst])

  const total = visible.length

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div
        style={{
          ...eyebrow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
          borderBottom: `1px solid ${RULE}`,
          paddingBottom: '0.7rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#bcb3a5' }}>Filter ›</span>
          {FILTERS.map((f, i) => (
            <span key={f.value} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              {i > 0 && <span aria-hidden style={{ color: '#bcb3a5' }}>·</span>}
              <button
                type="button"
                className="filterLink"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          className="filterLink"
          onClick={() => setNewestFirst((v) => !v)}
          aria-label="Toggle sort order"
        >
          Sort › {newestFirst ? 'Newest first' : 'Oldest first'} ▾
        </button>
      </div>

      {total === 0 ? (
        <p style={{ ...eyebrow, padding: '2rem 0', color: '#8a8278' }}>No notes for this lens yet.</p>
      ) : (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {visible.map((note, idx) => {
            const num = String(total - idx).padStart(2, '0')
            return (
              <li key={note.slug} style={{ borderBottom: `1px solid ${RULE}` }}>
                <Link
                  href={`/research/${note.slug}`}
                  className="noteRow"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px minmax(0, 1fr) auto',
                    gap: '1.25rem',
                    alignItems: 'baseline',
                    padding: '1rem 0.6rem',
                    margin: '0 -0.6rem',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ ...eyebrow }}>Note {num}</span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: SERIF,
                        fontSize: 'clamp(1.2rem, 2.4vw, 1.32rem)',
                        fontWeight: 400,
                        lineHeight: 1.25,
                        color: '#171717',
                      }}
                    >
                      {note.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: SERIF,
                        fontSize: '0.95rem',
                        color: '#6f675d',
                        lineHeight: 1.55,
                        marginTop: '0.35rem',
                      }}
                    >
                      {note.summary}
                    </span>
                  </span>
                  <span
                    className="noteRowMeta"
                    style={{
                      textAlign: 'right',
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontSize: '0.78rem',
                      color: '#6f675d',
                      lineHeight: 1.55,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ display: 'block', color: '#403a34' }}>
                      {shortDate(note.date)} · {note.readingTime} min
                    </span>
                    <span style={{ display: 'block', color: '#8a8278', textTransform: 'capitalize' }}>
                      {SECTION_LABEL[note.section]} · {note.perspective}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      )}

      <div style={{ ...eyebrow, marginTop: '1.1rem', color: '#a89c8c' }}>
        {total} {total === 1 ? 'note' : 'notes'}
        {filter !== 'all' ? ` · ${FILTERS.find((f) => f.value === filter)?.label}` : ''}
      </div>
    </section>
  )
}
