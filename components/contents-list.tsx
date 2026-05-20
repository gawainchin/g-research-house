'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import NoteIllustration from './note-illustration'
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
  'ai-research': 'AI Research',
  'financial-research': 'Financial Research',
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
  const lead = visible[0]
  const rest = visible.slice(1)

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
          marginBottom: '1.25rem',
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
          <span style={{ color: '#bcb3a5', marginLeft: '0.4rem' }}>·</span>
          <span style={{ color: '#a89c8c' }}>
            {total} {total === 1 ? 'note' : 'notes'}
          </span>
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
        <>
          <Link
            key={lead.slug}
            href={`/research/${lead.slug}`}
            className="leadCard"
            aria-label={`${lead.title} — lead note`}
          >
            <div className="cardArt cardArtHero">
              <NoteIllustration slug={lead.slug} section={lead.section} variant="hero" visualKey={lead.visualKey} keywords={lead.keywords} />
            </div>
            <div className="leadCardBody">
              <div className="cardEyebrow">{SECTION_LABEL[lead.section]}</div>
              <h3 className="leadCardTitle" style={{ fontFamily: SERIF }}>
                {lead.title}
              </h3>
              <p className="cardSummary" style={{ fontFamily: SERIF }}>
                {lead.summary}
              </p>
              <div className="cardMeta">
                {shortDate(lead.date)} · {lead.readingTime} min ·{' '}
                <span style={{ textTransform: 'capitalize' }}>{lead.perspective}</span>
              </div>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="cardGrid">
              {rest.map((note) => (
                <Link
                  key={note.slug}
                  href={`/research/${note.slug}`}
                  className="gridCard"
                  aria-label={note.title}
                >
                  <div className="cardArt">
                    <NoteIllustration slug={note.slug} section={note.section} variant="card" visualKey={note.visualKey} keywords={note.keywords} />
                  </div>
                  <div className="gridCardBody">
                    <div className="cardEyebrow">{SECTION_LABEL[note.section]}</div>
                    <h4 className="gridCardTitle" style={{ fontFamily: SERIF }}>
                      {note.title}
                    </h4>
                    <p className="cardSummary" style={{ fontFamily: SERIF }}>
                      {note.summary}
                    </p>
                    <div className="cardMeta">
                      {shortDate(note.date)} · {note.readingTime} min ·{' '}
                      <span style={{ textTransform: 'capitalize' }}>{note.perspective}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
