'use client'

import { useEffect, useState } from 'react'

interface Section {
  title: string
  content: string
}

interface Brief {
  date: string
  sections: Section[]
}

function parseBrief(html: string): Brief | null {
  // Simple parser: look for <h2> or <strong> section titles
  const sectionRegex = /<(?:h2|strong)[^>]*>(.*?)<\/(?:h2|strong)>/gi
  const matches = [...html.matchAll(sectionRegex)]
  if (matches.length === 0) return null

  const titles = matches.map(m => m[1].replace(/[*#]/g, '').trim())

  // Split content by section headers
  const parts = html.split(/<(?:h2|strong)[^>]*>.*?<\/(?:h2|strong)>/gi)

  const sections: Section[] = []
  for (let i = 1; i < parts.length; i++) {
    // Strip tags but preserve line breaks
    const content = parts[i]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .trim()
    if (titles[i - 1] && content) {
      sections.push({ title: titles[i - 1], content })
    }
  }

  // Extract date from first h1 or strong
  const dateMatch = html.match(/<(?:h1|strong)[^>]*>([^<]*?,?\s*\w+\s*\d+,?\s*\d{4})/i)
  const date = dateMatch ? dateMatch[1].trim() : ''

  return { date, sections }
}

function Section({ title, content }: Section) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#888',
        marginBottom: '0.5rem',
        fontFamily: 'Helvetica Neue, sans-serif'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '1rem',
        lineHeight: 1.7,
        color: '#222',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Georgia, serif'
      }}>
        {content}
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: '#888',
      fontFamily: 'Helvetica Neue, sans-serif',
      fontSize: '0.875rem'
    }}>
      Loading...
    </div>
  )
}

function ErrorState() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: '#c00',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '0.5rem' }}>No brief available yet.</div>
        <div style={{ fontSize: '0.875rem', color: '#888' }}>
          Run the morning cron to generate one.
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetch('/brief.html')
      .then(r => {
        if (!r.ok) throw new Error('not found')
        setLastUpdated(r.headers.get('Last-Modified') || '')
        return r.text()
      })
      .then(html => {
        const parsed = parseBrief(html)
        setBrief(parsed)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingState />
  if (!brief) return <ErrorState />

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#aaa',
          marginBottom: '0.35rem',
          fontFamily: 'Helvetica Neue, sans-serif'
        }}>
          Market Briefing
        </div>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          color: '#111',
          margin: 0,
          fontFamily: 'Georgia, serif'
        }}>
          {brief.date}
        </h1>
      </header>

      {brief.sections.map((section, i) => (
        <Section key={i} title={section.title} content={section.content} />
      ))}

      <footer style={{
        marginTop: '3rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e5e5',
        fontSize: '0.75rem',
        color: '#bbb',
        fontFamily: 'Helvetica Neue, sans-serif'
      }}>
        Auto-generated · Not financial advice
      </footer>
    </main>
  )
}
