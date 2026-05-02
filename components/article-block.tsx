import type { ContentBlock } from '../lib/research'

export default function ArticleBlock({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') {
    return <h2 style={{ margin: '2rem 0 0.75rem', fontSize: '1.3rem', fontWeight: 500, color: '#181818' }}>{block.text}</h2>
  }

  if (block.type === 'bullets' || block.type === 'numbered-list') {
    const ListTag = block.type === 'numbered-list' ? 'ol' : 'ul'
    return (
      <ListTag style={{ margin: '0.5rem 0 1.25rem 1.25rem', color: '#2e2a26', lineHeight: 1.8 }}>
        {block.items?.map((item) => <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>)}
      </ListTag>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote
        style={{
          margin: '1.4rem 0',
          padding: '0.2rem 0 0.2rem 1rem',
          borderLeft: '3px solid #b8ad9f',
          color: '#4d463f',
          fontStyle: 'italic',
        }}
      >
        {block.text}
      </blockquote>
    )
  }

  return <p style={{ margin: '0 0 1rem 0', color: '#2e2a26', lineHeight: 1.85, fontSize: '1.05rem' }}>{block.text}</p>
}
