import Link from 'next/link'
import NoteCard from '../../components/note-card'
import { getNotesBySection, getSectionMeta } from '../../lib/research'

export default function AiResearchPage() {
  const section = getSectionMeta('ai-research')
  const notes = getNotesBySection('ai-research')

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <Link href="/" style={{ color: '#73695f', textDecoration: 'none', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.9rem' }}>
        ← Back to home
      </Link>
      <header style={{ margin: '1.5rem 0 2rem', borderBottom: '1px solid #e6e0d6', paddingBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.5rem' }}>
          Section
        </div>
        <h1 style={{ margin: 0, fontWeight: 400, fontSize: '2.2rem', color: '#161616' }}>{section?.title}</h1>
        <p style={{ margin: '0.75rem 0 0 0', maxWidth: 760, color: '#544e47', lineHeight: 1.75 }}>{section?.description}</p>
      </header>
      {notes.map((note) => <NoteCard key={note.slug} note={note} />)}
    </main>
  )
}
