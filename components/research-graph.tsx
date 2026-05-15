import Link from 'next/link'
import CytoscapeResearchGraph from './cytoscape-research-graph'
import type { ResearchNoteSummary } from '../lib/research'

type GraphNodeKind = 'article' | 'keyword' | 'related'

interface PositionedNode {
  id: string
  label: string
  kind: GraphNodeKind
  x: number
  y: number
  href?: string
  section?: string
}

interface GraphEdge {
  from: string
  to: string
  kind?: 'keyword' | 'related'
}

const GRAPH_COLORS = {
  article: { fill: '#fffdfa', stroke: '#2f4f46', text: '#171717' },
  related: { fill: '#f4f9f7', stroke: '#3d6b5e', text: '#1e4d3a' },
  keyword: { fill: '#f7f5f0', stroke: '#cbbfae', text: '#5a5148' },
}

function polarPoint(cx: number, cy: number, radius: number, index: number, total: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(total, 1)
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }
}

function nodeRadius(node: PositionedNode) {
  if (node.kind === 'article') return 42
  if (node.kind === 'related') return 34
  return 28
}

function trimLabel(label: string, max = 26) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function normalizeKeyword(keyword: string) {
  return keyword.trim().toLowerCase()
}

function GraphSvg({ nodes, edges, title, height = 520 }: { nodes: PositionedNode[]; edges: GraphEdge[]; title: string; height?: number }) {
  const width = 900
  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        role="img"
        aria-label={title}
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', minWidth: 680, height: 'auto', display: 'block', fontFamily: 'Helvetica Neue, sans-serif' }}
      >
        <rect x="0" y="0" width={width} height={height} rx="8" fill="#faf8f5" />
        {edges.map((edge, index) => {
          const from = nodeById.get(edge.from)
          const to = nodeById.get(edge.to)
          if (!from || !to) return null
          return (
            <line
              key={`${edge.from}-${edge.to}-${index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={edge.kind === 'related' ? '#9fbfb5' : '#ddd5c5'}
              strokeWidth={edge.kind === 'related' ? 1.8 : 1.2}
            />
          )
        })}
        {nodes.map((node) => {
          const colors = GRAPH_COLORS[node.kind]
          const radius = nodeRadius(node)
          const content = (
            <g>
              <circle cx={node.x} cy={node.y} r={radius} fill={colors.fill} stroke={colors.stroke} strokeWidth="1.5" />
              <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize={node.kind === 'article' ? 11 : 10} fontWeight={node.kind === 'keyword' ? 500 : 700} fill={colors.text}>
                {trimLabel(node.label, node.kind === 'article' ? 24 : 18)}
              </text>
              <text x={node.x} y={node.y + 13} textAnchor="middle" fontSize="8" letterSpacing="0.04em" fill="#8a8278">
                {node.kind.toUpperCase()}
              </text>
            </g>
          )

          return node.href ? (
            <a key={node.id} href={node.href} aria-label={node.label}>
              {content}
            </a>
          ) : (
            <g key={node.id}>{content}</g>
          )
        })}
      </svg>
    </div>
  )
}

function GraphShell({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section style={{ margin: '2.5rem 0', padding: '1rem', background: '#fffdfa', border: '1px solid #e6e0d6', borderRadius: 8 }}>
      <div style={{ marginBottom: '0.9rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0.35rem' }}>
          Knowledge Graph
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: '#181818', fontFamily: 'Helvetica Neue, sans-serif' }}>{title}</h2>
        <p style={{ margin: '0.4rem 0 0', color: '#5a544d', lineHeight: 1.65, fontSize: '0.9rem', fontFamily: 'Helvetica Neue, sans-serif' }}>{description}</p>
      </div>
      {children}
      {footer}
    </section>
  )
}

export function ArticleResearchGraph({ article, related }: { article: ResearchNoteSummary; related: ResearchNoteSummary[] }) {
  const width = 900
  const height = 460
  const cx = width / 2
  const cy = height / 2
  const keywords = article.keywords.slice(0, 8)
  const keywordNodes = keywords.map((keyword, index) => ({
    id: `keyword:${normalizeKeyword(keyword)}`,
    label: keyword,
    kind: 'keyword' as const,
    ...polarPoint(cx, cy, 135, index, keywords.length),
  }))
  const relatedNodes = related.slice(0, 5).map((note, index) => ({
    id: `article:${note.slug}`,
    label: note.title,
    kind: 'related' as const,
    href: `/research/${note.slug}`,
    section: note.section,
    ...polarPoint(cx, cy, 205, index, Math.max(related.length, 1)),
  }))
  const centerNode: PositionedNode = {
    id: `article:${article.slug}`,
    label: article.title,
    kind: 'article',
    href: `/research/${article.slug}`,
    section: article.section,
    x: cx,
    y: cy,
  }
  const nodes: PositionedNode[] = [centerNode, ...keywordNodes, ...relatedNodes]
  const edges: GraphEdge[] = [
    ...keywordNodes.map((node) => ({ from: centerNode.id, to: node.id, kind: 'keyword' as const })),
    ...relatedNodes.map((node) => ({ from: centerNode.id, to: node.id, kind: 'related' as const })),
  ]

  return (
    <GraphShell
      title="Related Keywords And Articles"
      description="A map of the concepts this article anchors and the notes it directly points to."
      footer={(
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.9rem', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.8rem' }}>
          {keywords.map((keyword) => (
            <span key={keyword} style={{ padding: '0.2rem 0.45rem', border: '1px solid #ddd5c5', borderRadius: 999, color: '#5a5148', background: '#faf8f5' }}>{keyword}</span>
          ))}
        </div>
      )}
    >
      <GraphSvg nodes={nodes} edges={edges} title={`${article.title} keyword graph`} height={height} />
    </GraphShell>
  )
}

export function SiteResearchGraph({ articles }: { articles: ResearchNoteSummary[] }) {
  const keywordCounts = new Map<string, { label: string; count: number }>()
  for (const article of articles) {
    for (const keyword of article.keywords) {
      const key = normalizeKeyword(keyword)
      const current = keywordCounts.get(key)
      keywordCounts.set(key, { label: current?.label ?? keyword, count: (current?.count ?? 0) + 1 })
    }
  }
  const keywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label))
    .slice(0, 18)

  const articleNodes = articles.map((article) => ({
    id: `article:${article.slug}`,
    label: article.title,
    kind: 'article' as const,
    href: `/research/${article.slug}`,
    section: article.section,
    weight: 5,
  }))
  const keywordNodes = keywords.map(([key, value]) => ({
    id: `keyword:${key}`,
    label: value.label,
    kind: 'keyword' as const,
    weight: Math.min(5, Math.max(1, value.count)),
  }))
  const keywordIds = new Set(keywordNodes.map((node) => node.id))
  const nodes = [...articleNodes, ...keywordNodes]
  const edges: { id: string; source: string; target: string; kind: 'keyword' | 'related' }[] = []
  for (const article of articles) {
    for (const keyword of article.keywords) {
      const keywordId = `keyword:${normalizeKeyword(keyword)}`
      if (keywordIds.has(keywordId)) {
        edges.push({ id: `keyword:${article.slug}:${normalizeKeyword(keyword)}`, source: `article:${article.slug}`, target: keywordId, kind: 'keyword' })
      }
    }
    for (const relatedSlug of article.relatedSlugs) {
      if (articles.some((candidate) => candidate.slug === relatedSlug)) {
        edges.push({ id: `related:${article.slug}:${relatedSlug}`, source: `article:${article.slug}`, target: `article:${relatedSlug}`, kind: 'related' })
      }
    }
  }

  return (
    <GraphShell
      title="Site-Wide Research Graph"
      description="Articles orbit the strongest keyword nodes, with explicit related-note links drawn between article nodes."
      footer={(
        <div style={{ marginTop: '1rem', fontFamily: 'Helvetica Neue, sans-serif', color: '#5a544d', fontSize: '0.88rem', lineHeight: 1.65 }}>
          Showing {articles.length} articles and the top {keywordNodes.length} keyword nodes by reuse.
        </div>
      )}
    >
      <CytoscapeResearchGraph nodes={nodes} edges={edges} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.7rem', marginTop: '1rem' }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/research/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none', border: '1px solid #ede8df', borderRadius: 6, padding: '0.7rem', background: '#faf8f5' }}>
            <div style={{ fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.86rem', color: '#181818', marginBottom: '0.35rem' }}>{article.title}</div>
            <div style={{ color: '#73695f', fontSize: '0.76rem', lineHeight: 1.5 }}>{article.keywords.slice(0, 3).join(' · ')}</div>
          </Link>
        ))}
      </div>
    </GraphShell>
  )
}
