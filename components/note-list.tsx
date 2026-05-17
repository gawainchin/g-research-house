'use client'

import { useMemo, useState } from 'react'
import NoteCard from './note-card'
import type { ResearchNoteSummary } from '../lib/research-types'

export type NoteSortKey = 'date-desc' | 'date-asc' | 'title-asc'

const SORT_OPTIONS: { key: NoteSortKey; label: string; shortLabel: string }[] = [
  { key: 'date-desc', label: 'Newest first', shortLabel: 'Newest' },
  { key: 'date-asc', label: 'Oldest first', shortLabel: 'Oldest' },
  { key: 'title-asc', label: 'Title A → Z', shortLabel: 'Title' },
]

const SECTION_ACCENTS: Record<string, { accent: string; tint: string; mid: string }> = {
  'ai-research': { accent: '#4a5568', tint: '#f0f2f5', mid: '#e2e5ea' },
  'financial-research': { accent: '#3d6b5e', tint: '#f0f5f3', mid: '#c8ded6' },
}

function sortNotes(notes: ResearchNoteSummary[], key: NoteSortKey): ResearchNoteSummary[] {
  const copy = [...notes]
  switch (key) {
    case 'date-asc':
      return copy.sort((a, b) => a.date.localeCompare(b.date))
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'date-desc':
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date))
  }
}

export default function NoteList({
  notes,
  section,
  defaultSort = 'date-desc',
}: {
  notes: ResearchNoteSummary[]
  section: 'ai-research' | 'financial-research'
  defaultSort?: NoteSortKey
}) {
  const [sortKey, setSortKey] = useState<NoteSortKey>(defaultSort)
  const sorted = useMemo(() => sortNotes(notes, sortKey), [notes, sortKey])
  const palette = SECTION_ACCENTS[section] ?? SECTION_ACCENTS['ai-research']

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Sort articles"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a8278',
          }}
        >
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} · sorted by{' '}
          <span style={{ color: palette.accent, fontWeight: 600 }}>
            {SORT_OPTIONS.find((opt) => opt.key === sortKey)?.label.toLowerCase()}
          </span>
        </span>

        <div
          role="group"
          aria-label="Sort order"
          style={{
            display: 'inline-flex',
            border: `1px solid ${palette.mid}`,
            borderRadius: 999,
            background: '#fffdfa',
            padding: 2,
            overflow: 'hidden',
          }}
        >
          {SORT_OPTIONS.map((opt) => {
            const active = opt.key === sortKey
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSortKey(opt.key)}
                title={opt.label}
                style={{
                  appearance: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.78rem',
                  padding: '0.32rem 0.75rem',
                  borderRadius: 999,
                  background: active ? palette.accent : 'transparent',
                  color: active ? '#fffdfa' : '#5a544d',
                  fontWeight: active ? 600 : 500,
                  letterSpacing: '0.01em',
                  transition: 'background-color 140ms ease, color 140ms ease',
                }}
              >
                {opt.shortLabel}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sorted.map((note) => (
          <NoteCard key={note.slug} note={note} section={section} />
        ))}
      </div>
    </div>
  )
}
