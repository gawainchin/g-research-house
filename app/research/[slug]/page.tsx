import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleBlock from '../../../components/article-block'
import { ArticleResearchGraph } from '../../../components/research-graph'
import { formatDisplayDate, getAllNotes, getArticleBySlug, getRelatedNotes } from '../../../lib/research'
import type { ContentBlock } from '../../../lib/research'

// ── Section accent colors ────────────────────────────────────────────────────
const SECTION_STYLE = {
  'ai-research': {
    accent: '#4a5568',
    accentLight: '#f7f8fa',
    accentBorder: '#e2e5ea',
    chipBg: '#e8eaf0',
    chipText: '#3d4560',
  },
  'financial-research': {
    accent: '#3d6b5e',
    accentLight: '#f4f9f7',
    accentBorder: '#c8ded6',
    chipBg: '#e4f0ec',
    chipText: '#1e4d3a',
  },
} as const

type SectionSlug = keyof typeof SECTION_STYLE

function isSectionSlug(s: string): s is SectionSlug {
  return s in SECTION_STYLE
}

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }))
}

export const dynamicParams = false

// ── Format icon map ──────────────────────────────────────────────────────────
const FORMAT_ICONS: Record<string, string> = {
  'workflow': '⚙',
  'thesis': '◎',
  'company-compare': '◈',
  'indicator': '◉',
  'sector-map': '▣',
  'default': '▤',
}

function getFormatIcon(format: string) {
  return FORMAT_ICONS[format] ?? FORMAT_ICONS['default']
}

// ── Article header scaffolding ───────────────────────────────────────────────
function ArticleHeader({ article }: {
  article: ReturnType<typeof getArticleBySlug> & { content: ContentBlock[] }
}) {
  const sectionSlug = article.section
  const style = isSectionSlug(sectionSlug) ? SECTION_STYLE[sectionSlug] : SECTION_STYLE['ai-research']
  const isFinancialResearch = article.section === 'financial-research'

  // Pull out leading special blocks for visual treatment
  const thesisBlock = article.content.find(b => b.type === 'thesis-card')
  const keyTakeawaysBlock = article.content.find(b => b.type === 'key-takeaways')

  return (
    <>
      {/* ── Back nav + format badge strip ─────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <Link
          href={`/${article.section}`}
          style={{
            color: '#73695f',
            textDecoration: 'none',
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '0.9rem',
          }}
        >
          ← {article.section === 'financial-research' ? 'Financial Research' : 'AI Research'}
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.65rem',
          background: style.chipBg,
          borderRadius: 20,
          fontSize: '0.72rem',
          color: style.chipText,
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}>
          <span>{getFormatIcon(article.format)}</span>
          <span style={{ textTransform: 'capitalize' }}>{article.format.replace('-', ' ')}</span>
        </div>
      </div>

      {/* ── Section accent bar ─────────────────────────────────── */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, ${style.accent}, ${style.accent}40)`,
        borderRadius: 2,
        marginBottom: '1.75rem',
      }} />

      {/* ── Title block ─────────────────────────────────────────── */}
      <header style={{ margin: '0 0 2rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '0.85rem',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a8278',
            fontFamily: 'Helvetica Neue, sans-serif',
          }}>
            {article.perspective}
          </span>
          <span style={{ color: '#d0c8bc', fontSize: '0.7rem' }}>·</span>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a8278',
            fontFamily: 'Helvetica Neue, sans-serif',
          }}>
            {article.readingTime} min read
          </span>
          <span style={{ color: '#d0c8bc', fontSize: '0.7rem' }}>·</span>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a8278',
            fontFamily: 'Helvetica Neue, sans-serif',
          }}>
            {formatDisplayDate(article.date)}
          </span>
        </div>

        <h1 style={{
          margin: '0 0 0.9rem',
          fontSize: '2.3rem',
          fontWeight: 400,
          color: '#151515',
          lineHeight: 1.25,
          fontFamily: 'Georgia, serif',
        }}>
          {article.title}
        </h1>

        <p style={{
          margin: 0,
          color: '#48423b',
          lineHeight: 1.75,
          fontSize: '1.1rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {article.summary}
        </p>

        {isFinancialResearch ? (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            background: '#f7f5f0',
            border: '1px solid #e6e0d6',
            borderLeft: '3px solid #3d6b5e',
            borderRadius: '0 4px 4px 0',
            color: '#4f473f',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            fontFamily: 'Helvetica Neue, sans-serif',
          }}>
            <strong style={{ color: '#1e4d3a' }}>Educational purposes only.</strong> This research is general information, not personalized investment advice or a recommendation to buy or sell any security.
          </div>
        ) : null}

        {article.sourceLinks?.length ? (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginTop: '1rem',
          }}>
            {article.sourceLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.75rem',
                  background: '#faf8f5',
                  border: '1px solid #e6e0d6',
                  borderRadius: 999,
                  color: '#2e2a26',
                  textDecoration: 'none',
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                <span>↗</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {article.heroImage ? (
        <figure style={{ margin: '0 0 2rem' }}>
          <img
            src={article.heroImage.url}
            alt={article.heroImage.alt}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '6px',
              border: '1px solid #e6e0d6',
              background: '#f7f5f0',
            }}
          />
          {article.heroImage.caption ? (
            <figcaption style={{
              marginTop: '0.65rem',
              color: '#73695f',
              fontSize: '0.85rem',
              lineHeight: 1.55,
              fontFamily: 'Helvetica Neue, sans-serif',
            }}>
              {article.heroImage.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* ── Thesis card (pulled to top) ─────────────────────────── */}
      {thesisBlock && (
        <div style={{ marginBottom: '1.75rem' }}>
          <ArticleBlock block={thesisBlock} section={sectionSlug} />
        </div>
      )}

      {/* ── Key takeaways (pulled to top) ──────────────────────── */}
      {keyTakeawaysBlock && (
        <div style={{ marginBottom: '1.75rem' }}>
          <ArticleBlock block={keyTakeawaysBlock} section={sectionSlug} />
        </div>
      )}
    </>
  )
}

// ── Article footer with verdict ─────────────────────────────────────────────
function ArticleFooter({ article }: {
  article: ReturnType<typeof getArticleBySlug> & { content: ContentBlock[] }
}) {
  const verdictBlock = article.content.find(b => b.type === 'verdict')
  const related = getRelatedNotes(article.relatedSlugs)

  return (
    <>
      {/* ── Verdict (pulled to bottom) ──────────────────────────── */}
      {verdictBlock && (
        <div style={{ marginTop: '2.5rem' }}>
          <ArticleBlock block={verdictBlock} section={article.section} />
        </div>
      )}

      {/* ── Related notes ───────────────────────────────────────── */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e6e0d6' }}>
        <div style={{
          fontSize: '0.68rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#8a8278',
          fontFamily: 'Helvetica Neue, sans-serif',
          marginBottom: '0.75rem',
        }}>
          Related notes
        </div>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {related.map((note) => (
            <Link
              key={note.slug}
              href={`/research/${note.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                padding: '0.85rem 1rem',
                background: '#faf8f5',
                border: '1px solid #ede8df',
                borderRadius: '2px',
                transition: 'border-color 0.15s',
              }}>
                <div style={{
                  fontSize: '1.05rem',
                  color: '#181818',
                  marginBottom: '0.2rem',
                  fontFamily: 'Helvetica Neue, sans-serif',
                }}>
                  {note.title}
                </div>
                <div style={{
                  color: '#5a544d',
                  lineHeight: 1.6,
                  fontSize: '0.88rem',
                  fontFamily: 'Helvetica Neue, sans-serif',
                }}>
                  {note.summary}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </footer>
    </>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ResearchArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const sectionSlug = article.section
  const sectionStyle = isSectionSlug(sectionSlug) ? SECTION_STYLE[sectionSlug] : SECTION_STYLE['ai-research']

  // Content blocks with thesis/key-takeaways/verdict filtered out (rendered separately)
  const renderedBlocks = article.content.filter(
    b => !['thesis-card', 'key-takeaways', 'verdict'].includes(b.type)
  )

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '3.5rem 1.5rem 4rem' }}>
      <ArticleHeader article={{ ...article, content: article.content } as ReturnType<typeof getArticleBySlug> & { content: ContentBlock[] }} />

      <article>
        {renderedBlocks.map((block, index) => (
          <ArticleBlock key={`${block.type}-${index}`} block={block} section={sectionSlug} />
        ))}
      </article>

      <ArticleResearchGraph article={article} related={getRelatedNotes(article.relatedSlugs)} />

      <ArticleFooter article={{ ...article, content: article.content } as ReturnType<typeof getArticleBySlug> & { content: ContentBlock[] }} />
    </main>
  )
}
