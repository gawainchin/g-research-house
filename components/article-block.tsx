import type { ContentBlock } from '../lib/research'

// ── Shared design tokens ────────────────────────────────────────────────────
const ACCENT = '#3d6b5e' // financial green
const AI_ACCENT = '#4a5568' // AI slate
const CALLOUT_BORDER_WIDTH = '3px'

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
        {block.text}
      </p>
    </div>
  )
}

// ── Key Takeaways ──────────────────────────────────────────────────────────
function KeyTakeaways({ block }: { block: ContentBlock }) {
  const items = block.items ?? []
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
          <li key={i} style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>{item}</li>
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
        {block.text}
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
        {block.text}
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
  const isAi = section === 'ai-research'
  const accentColor = isAi ? '#4a5568' : '#3d6b5e'
  const stepBg = isAi ? '#f7f8fa' : '#f7faf8'
  const connectorColor = isAi ? '#c0c4d0' : '#b8d4cc'

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

// ── Main renderer ────────────────────────────────────────────────────────────
export default function ArticleBlock({ block, section }: { block: ContentBlock; section?: string }) {
  switch (block.type) {
    case 'heading':
      return <h2 style={{ margin: '2rem 0 0.75rem', fontSize: '1.3rem', fontWeight: 500, color: '#181818', fontFamily: 'Helvetica Neue, sans-serif' }}>{block.text}</h2>

    case 'bullets':
    case 'numbered-list': {
      const ListTag = block.type === 'numbered-list' ? 'ol' : 'ul'
      return (
        <ListTag style={{ margin: '0.5rem 0 1.25rem 1.25rem', color: '#2e2a26', lineHeight: 1.8, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '1rem' }}>
          {block.items?.map((item) => <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>)}
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
          {block.text}
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

    default:
      return <p style={{ margin: '0 0 1rem 0', color: '#2e2a26', lineHeight: 1.85, fontSize: '1.05rem', fontFamily: 'Helvetica Neue, sans-serif' }}>{block.text}</p>
  }
}
