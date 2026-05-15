import type { ContentBlock } from '../lib/research'

// ── Inline markdown → HTML strip ─────────────────────────────────────────────────
// Strips markdown syntax so raw text renders cleanly. Used for paragraph/heading/quote
// bodies that may contain `code`, **bold**, *italic*, or ``` fenced blocks.
function renderText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const codeBlockRe = /```(\w*)\n?([\s\S]*?)```/g

  let last = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRe.exec(text)) !== null) {
    // Text before the code block
    if (match.index > last) {
      parts.push(dangerouslyRenderInline(text.slice(last, match.index)))
    }
    // The code block itself — rendered as <pre>
    const code = match[2].replace(/\n$/, '')
    parts.push(
      <pre key={`cb-${match.index}`} style={{
        margin: '1rem 0',
        padding: '0.9rem 1.1rem',
        background: '#1c1c1e',
        borderRadius: '6px',
        overflowX: 'auto',
        fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace',
        fontSize: '0.85rem',
        color: '#d4d4d4',
        lineHeight: 1.65,
        border: '1px solid #2e2e2e',
      }}>
        <code style={{ background: 'none', color: 'inherit', padding: 0 }}>{code}</code>
      </pre>
    )
    last = codeBlockRe.lastIndex
  }

  if (last < text.length) {
    parts.push(dangerouslyRenderInline(text.slice(last)))
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// Handles **bold**, *italic*, and `inline code` inside plain text segments
function dangerouslyRenderInline(segment: string): React.ReactNode {
  // Split on inline code, bold, italic — preserve order
  const parts: React.ReactNode[] = []
  const re = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(segment)) !== null) {
    if (m.index > last) parts.push(segment.slice(last, m.index))
    if (m[1]) parts.push(<strong key={m.index} style={{ fontWeight: 700 }}>{m[1].slice(2, -2)}</strong>)
    else if (m[2]) parts.push(<em key={m.index} style={{ fontStyle: 'italic' }}>{m[2].slice(1, -1)}</em>)
    else if (m[3]) parts.push(
      <code key={m.index} style={{
        fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
        fontSize: '0.875em',
        background: '#f0ebe3',
        color: '#7c3aed',
        padding: '0.1em 0.35em',
        borderRadius: '3px',
        border: '1px solid #e2d9cc',
      }}>{m[3].slice(1, -1)}</code>
    )
    last = re.lastIndex
  }

  if (last < segment.length) parts.push(segment.slice(last))
  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// ── Shared design tokens ────────────────────────────────────────────────────
const ACCENT = '#3d6b5e' // financial green
const AI_ACCENT = '#4a5568' // AI slate
const CALLOUT_BORDER_WIDTH = '3px'

const sectionTheme = (section?: string) => {
  const isAi = section === 'ai-research'
  return {
    accent: isAi ? AI_ACCENT : ACCENT,
    accentLight: isAi ? '#f7f8fa' : '#f7faf8',
    accentBorder: isAi ? '#d8dce5' : '#c8ded6',
    muted: isAi ? '#5d6678' : '#3d6b5e',
  }
}

const visualTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#3a3530',
  marginBottom: '0.75rem',
  fontFamily: 'Helvetica Neue, sans-serif',
}

const calloutVariantStyle = (variant?: string) => {
  switch (variant) {
    case 'warning':
      return { borderColor: '#d97706', bg: '#fffbeb', labelColor: '#92400e' }
    case 'risk':
      return { borderColor: '#dc2626', bg: '#fef2f2', labelColor: '#991b1b' }
    case 'insight':
      return { borderColor: '#7c3aed', bg: '#f5f3ff', labelColor: '#5b21b6' }
    default:
      return { borderColor: '#4a90a4', bg: '#f0f9fb', labelColor: '#1e6f82' }
  }
}

// ── Thesis Card ─────────────────────────────────────────────────────────────
function ThesisCard({ block }: { block: ContentBlock }) {
  return (
    <div style={{
      margin: '1.5rem 0 2rem',
      padding: '1.25rem 1.5rem',
      background: '#f8f6f2',
      border: '1px solid #e0d8cc',
      borderTop: '3px solid #2c2c2c',
      borderRadius: '2px',
    }}>
      {block.label && (
        <div style={{
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8a8278',
          marginBottom: '0.5rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {block.label}
        </div>
      )}
      {block.title && (
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#181818',
          marginBottom: '0.5rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {block.title}
        </div>
      )}
      <p style={{
        margin: 0,
        color: '#2e2a26',
        lineHeight: 1.75,
        fontSize: '1.05rem',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        {renderText(block.text ?? '')}
      </p>
    </div>
  )
}

// ── Key Takeaways ──────────────────────────────────────────────────────────
function KeyTakeaways({ block }: { block: ContentBlock }) {
  const items = block.items ?? block.takeaways?.map((takeaway) => (
    takeaway.icon ? `${takeaway.icon} ${takeaway.text}` : takeaway.text
  )) ?? []
  return (
    <div style={{
      margin: '1.5rem 0 2rem',
      padding: '1.25rem 1.5rem',
      background: '#f7f5f0',
      border: '1px solid #ddd5c5',
      borderRadius: '2px',
    }}>
      <div style={{
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#8a8278',
        marginBottom: '0.75rem',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        Key Takeaways
      </div>
      <ul style={{
        margin: 0,
        padding: '0 0 0 1.1rem',
        color: '#2e2a26',
        lineHeight: 1.8,
      }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>{renderText(item)}</li>
        ))}
      </ul>
    </div>
  )
}

// ── Verdict ─────────────────────────────────────────────────────────────────
function Verdict({ block }: { block: ContentBlock }) {
  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.25rem 1.5rem',
      background: '#1a1a1a',
      borderRadius: '2px',
      color: '#f5f0e8',
    }}>
      <div style={{
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#9a9080',
        marginBottom: '0.6rem',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        {block.label ?? 'Bottom Line'}
      </div>
      <p style={{
        margin: 0,
        color: '#f0ebe2',
        lineHeight: 1.75,
        fontSize: '1.05rem',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        {renderText(block.text ?? '')}
      </p>
    </div>
  )
}

// ── Callout ─────────────────────────────────────────────────────────────────
function Callout({ block }: { block: ContentBlock }) {
  const style = calloutVariantStyle(block.variant)
  const labelText = block.label ?? 'Note'
  return (
    <div style={{
      margin: '1.25rem 0',
      padding: '1rem 1.25rem',
      background: style.bg,
      borderLeft: `${CALLOUT_BORDER_WIDTH} solid ${style.borderColor}`,
      borderRadius: '0 2px 2px 0',
    }}>
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: style.labelColor,
        marginBottom: '0.4rem',
        fontFamily: 'Helvetica Neue, sans-serif',
        fontWeight: 600,
      }}>
        {labelText}
      </div>
      <p style={{
        margin: 0,
        color: '#2e2a26',
        lineHeight: 1.7,
        fontSize: '1rem',
        fontFamily: 'Helvetica Neue, sans-serif',
      }}>
        {renderText(block.text ?? '')}
      </p>
    </div>
  )
}

// ── Comparison Table ────────────────────────────────────────────────────────
function ComparisonTable({ block }: { block: ContentBlock }) {
  const columns = block.columns ?? []
  const rows = block.rows ?? []
  const colWidth = `calc(100% / ${columns.length})`

  return (
    <div style={{ margin: '1.5rem 0 2rem', overflowX: 'auto' }}>
      {block.title && (
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#3a3530',
          marginBottom: '0.6rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {block.title}
        </div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'Helvetica Neue, sans-serif',
        fontSize: '0.9rem',
        minWidth: 400,
      }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding: '0.6rem 0.85rem',
                  textAlign: 'left',
                  background: i === 0 ? '#f0ebe3' : '#f7f5f0',
                  color: i === 0 ? '#2c2c2c' : '#5a544d',
                  fontWeight: i === 0 ? 600 : 400,
                  fontSize: '0.78rem',
                  letterSpacing: '0.05em',
                  textTransform: i === 0 ? 'none' : 'uppercase',
                  borderBottom: '2px solid #ddd5c5',
                  width: colWidth,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#ffffff' : '#faf8f5' }}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '0.65rem 0.85rem',
                    color: ci === 0 ? '#2c2c2c' : '#3d3830',
                    borderBottom: '1px solid #ede8df',
                    lineHeight: 1.55,
                    fontSize: '0.9rem',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Flowchart ───────────────────────────────────────────────────────────────
function Flowchart({ block, section }: { block: ContentBlock; section?: string }) {
  const steps = block.steps ?? []
  const theme = sectionTheme(section)
  const accentColor = theme.accent
  const stepBg = theme.accentLight
  const connectorColor = theme.accentBorder

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && (
        <div style={visualTitleStyle}>
          {block.title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
            {/* Step box */}
            <div style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: stepBg,
              border: `1px solid ${i === 0 ? accentColor : connectorColor}`,
              borderRadius: i === 0 ? '4px 4px 0 0' : i === steps.length - 1 ? '0 0 4px 4px' : '0',
              borderTop: i > 0 ? 'none' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                background: accentColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'Helvetica Neue, sans-serif',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  fontFamily: 'Helvetica Neue, sans-serif',
                }}>
                  {step.label}
                </div>
                {step.note && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6b635a',
                    marginTop: '0.15rem',
                    lineHeight: 1.5,
                    fontFamily: 'Helvetica Neue, sans-serif',
                  }}>
                    {step.note}
                  </div>
                )}
              </div>
            </div>
            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <div style={{
                width: 28,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fff',
                borderLeft: `1px solid ${connectorColor}`,
                borderRight: `1px solid ${connectorColor}`,
                padding: '2px 0',
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `7px solid ${connectorColor}`,
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Scenario Ladder ─────────────────────────────────────────────────────────
function ScenarioLadder({ block }: { block: ContentBlock }) {
  const scenarios = block.scenarios ?? []
  const colors = ['#166534', '#854d0e', '#991b1b']
  const bgColors = ['#f0fdf4', '#fffbeb', '#fef2f2']

  return (
    <div style={{ margin: '1.5rem 0 2rem' }}>
      {block.title && (
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#3a3530',
          marginBottom: '0.75rem',
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {block.title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {scenarios.map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 0,
          }}>
            <div style={{
              width: 80,
              padding: '0.65rem 0.75rem',
              background: colors[i],
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Helvetica Neue, sans-serif',
              flexShrink: 0,
            }}>
              {s.label}
            </div>
            <div style={{
              flex: 1,
              padding: '0.65rem 1rem',
              background: bgColors[i],
              border: `1px solid ${colors[i]}22`,
              borderLeft: 'none',
              borderRadius: '0 4px 4px 0',
              fontSize: '0.9rem',
              color: '#2e2a26',
              lineHeight: 1.6,
              fontFamily: 'Helvetica Neue, sans-serif',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: s.description || s.text ? '0.4rem' : 0 }}>
                {s.probability ? (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: colors[i],
                    fontFamily: 'Helvetica Neue, sans-serif',
                  }}>
                    Prob. {s.probability}
                  </span>
                ) : null}
                {s.outcome ? (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#5f564d',
                    fontFamily: 'Helvetica Neue, sans-serif',
                  }}>
                    Outcome {s.outcome}
                  </span>
                ) : null}
              </div>
              {s.description ?? s.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Metric Strip ────────────────────────────────────────────────────────────
function MetricStrip({ block }: { block: ContentBlock }) {
  const metrics = block.metrics ?? []
  return (
    <div style={{
      margin: '1.5rem 0 2rem',
      display: 'grid',
      gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
      gap: '1px',
      background: '#ddd5c5',
      border: '1px solid #ddd5c5',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      {metrics.map((m, i) => (
        <div key={i} style={{
          padding: '0.85rem 1rem',
          background: '#faf8f5',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1a1a1a',
            fontFamily: 'Helvetica Neue, sans-serif',
            lineHeight: 1.2,
          }}>
            {m.value}
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: '#8a8278',
            marginTop: '0.2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: 'Helvetica Neue, sans-serif',
          }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Scorecard ────────────────────────────────────────────────────────────────
function Scorecard({ block, section }: { block: ContentBlock; section?: string }) {
  const criteria = block.criteria ?? []
  const theme = sectionTheme(section)

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        {criteria.map((item) => {
          const score = Math.max(0, Math.min(5, Number(item.score) || 0))
          return (
            <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0.8rem', alignItems: 'center' }}>
              <div style={{ color: '#3a3530', fontWeight: 600, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.88rem' }}>{item.label}</div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px', marginBottom: item.note ? '0.25rem' : 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: 9,
                        borderRadius: 999,
                        background: i < score ? theme.accent : '#e7e0d7',
                        opacity: i < score ? 0.45 + (i + 1) * 0.1 : 1,
                      }}
                    />
                  ))}
                </div>
                {item.note && <div style={{ color: '#6b635a', fontSize: '0.8rem', lineHeight: 1.45, fontFamily: 'Helvetica Neue, sans-serif' }}>{renderText(item.note)}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ block, section }: { block: ContentBlock; section?: string }) {
  const bars = block.bars ?? []
  const theme = sectionTheme(section)
  const max = Math.max(...bars.map((bar) => Number(bar.value) || 0), 1)

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {bars.map((bar) => {
          const value = Number(bar.value) || 0
          const width = `${Math.max(2, Math.min(100, (value / max) * 100))}%`
          return (
            <div key={bar.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.25rem', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.85rem' }}>
                <span style={{ color: '#3a3530', fontWeight: 600 }}>{bar.label}</span>
                <span style={{ color: '#6b635a' }}>{value}{block.unit ?? ''}</span>
              </div>
              <div style={{ height: 11, background: '#ece6dd', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width, height: '100%', background: theme.accent, borderRadius: 999 }} />
              </div>
              {bar.note && <div style={{ marginTop: '0.25rem', color: '#6b635a', fontSize: '0.78rem', lineHeight: 1.45, fontFamily: 'Helvetica Neue, sans-serif' }}>{renderText(bar.note)}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ block, section }: { block: ContentBlock; section?: string }) {
  const events = block.events ?? []
  const theme = sectionTheme(section)

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ display: 'grid', gap: '0.85rem' }}>
        {events.map((event, i) => (
          <div key={`${event.label}-${i}`} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.85rem', alignItems: 'start' }}>
            <div style={{ color: theme.muted, fontWeight: 600, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{event.date ?? `Step ${i + 1}`}</div>
            <div style={{ position: 'relative', paddingLeft: '1rem', borderLeft: `2px solid ${theme.accentBorder}` }}>
              <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: theme.accent }} />
              <div style={{ color: '#2e2a26', fontWeight: 600, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.92rem', marginBottom: '0.15rem' }}>{event.label}</div>
              <div style={{ color: '#5f564d', lineHeight: 1.55, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.88rem' }}>{renderText(event.text)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stack Diagram ────────────────────────────────────────────────────────────
function StackDiagram({ block, section }: { block: ContentBlock; section?: string }) {
  const layers = block.layers ?? []
  const theme = sectionTheme(section)

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '1px', background: '#ddd5c5', border: '1px solid #ddd5c5', borderRadius: '4px', overflow: 'hidden' }}>
        {layers.map((layer, i) => (
          <div key={`${layer.label}-${i}`} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 0.9rem', background: i % 2 === 0 ? theme.accentLight : '#fffdfa' }}>
            <div style={{ color: theme.accent, fontWeight: 700, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.82rem' }}>{layer.label}</div>
            <div style={{ color: '#4f473f', lineHeight: 1.55, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.88rem' }}>{renderText(layer.text)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main renderer ────────────────────────────────────────────────────────────
export default function ArticleBlock({ block, section }: { block: ContentBlock; section?: string }) {
  switch (block.type) {
    case 'heading':
      return <h2 style={{ margin: '2rem 0 0.75rem', fontSize: '1.3rem', fontWeight: 500, color: '#181818', fontFamily: 'Helvetica Neue, sans-serif' }}>{renderText(block.text ?? '')}</h2>

    case 'bullets':
    case 'numbered-list': {
      const ListTag = block.type === 'numbered-list' ? 'ol' : 'ul'
      return (
        <ListTag style={{ margin: '0.5rem 0 1.25rem 1.25rem', color: '#2e2a26', lineHeight: 1.8, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '1rem' }}>
          {block.items?.map((item) => <li key={item} style={{ marginBottom: '0.35rem' }}>{renderText(item)}</li>)}
        </ListTag>
      )
    }

    case 'quote':
      return (
        <blockquote style={{
          margin: '1.4rem 0',
          padding: '0.2rem 0 0.2rem 1rem',
          borderLeft: '3px solid #b8ad9f',
          color: '#4d463f',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          lineHeight: 1.75,
          fontFamily: 'Helvetica Neue, sans-serif',
        }}>
          {renderText(block.text ?? '')}
        </blockquote>
      )

    case 'thesis-card':
      return <ThesisCard block={block} />

    case 'key-takeaways':
      return <KeyTakeaways block={block} />

    case 'verdict':
      return <Verdict block={block} />

    case 'callout':
      return <Callout block={block} />

    case 'comparison-table':
      return <ComparisonTable block={block} />

    case 'flowchart':
      return <Flowchart block={block} section={section} />

    case 'scenario-ladder':
      return <ScenarioLadder block={block} />

    case 'metric-strip':
      return <MetricStrip block={block} />

    case 'scorecard':
      return <Scorecard block={block} section={section} />

    case 'bar-chart':
      return <BarChart block={block} section={section} />

    case 'timeline':
      return <Timeline block={block} section={section} />

    case 'stack-diagram':
      return <StackDiagram block={block} section={section} />

    default:
      return <p style={{ margin: '0 0 1rem 0', color: '#2e2a26', lineHeight: 1.85, fontSize: '1.05rem', fontFamily: 'Helvetica Neue, sans-serif' }}>{renderText(block.text ?? '')}</p>
  }
}
