import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleBlock from '../../../components/article-block'
import { formatDisplayDate, getAllNotes, getArticleBySlug, getRelatedNotes } from '../../../lib/research'

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }))
}

export default async function ResearchArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedNotes(article.relatedSlugs)
  const sectionHref = `/${article.section}`
  const sectionLabel = article.section === 'financial-research' ? 'Financial Research' : 'AI Research'

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <Link href={sectionHref} style={{ color: '#73695f', textDecoration: 'none', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.9rem' }}>
        ← Back to {sectionLabel}
      </Link>

      <header style={{ margin: '1.5rem 0 2rem', borderBottom: '1px solid #e6e0d6', paddingBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.65rem' }}>
          {sectionLabel} · {article.perspective} · {article.format}
        </div>
        <h1 style={{ margin: 0, fontSize: '2.3rem', fontWeight: 400, color: '#151515' }}>{article.title}</h1>
        <p style={{ margin: '0.85rem 0 0 0', color: '#48423b', lineHeight: 1.75, fontSize: '1.08rem' }}>{article.summary}</p>
        <div style={{ marginTop: '1rem', color: '#7a7166', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.88rem' }}>
          {formatDisplayDate(article.date)} · {article.readingTime} min read
        </div>
      </header>

      <article>
        {article.content.map((block, index) => <ArticleBlock key={`${block.type}-${index}`} block={block} />)}
      </article>

      <footer style={{ marginTop: '3rem', paddingTop: '1.25rem', borderTop: '1px solid #e6e0d6' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.65rem' }}>
          Related notes
        </div>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {related.map((note) => (
            <Link key={note.slug} href={`/research/${note.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '1.05rem', color: '#181818', marginBottom: '0.2rem' }}>{note.title}</div>
              <div style={{ color: '#5a544d', lineHeight: 1.6 }}>{note.summary}</div>
            </Link>
          ))}
        </div>
      </footer>
    </main>
  )
}
