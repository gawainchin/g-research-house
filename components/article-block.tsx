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

// ── Exposure Matrix ─────────────────────────────────────────────────────────
function ExposureMatrix({ block, section }: { block: ContentBlock; section?: string }) {
  const points = block.points ?? []
  const theme = sectionTheme(section)
  const clampPct = (value: number) => Math.max(6, Math.min(94, Number(value) || 0))

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ position: 'relative', minHeight: 360, padding: '1rem 1rem 2.4rem 2.4rem', background: '#fffdfa', border: '1px solid #e6e0d6', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '1rem 1rem 2.4rem 2.4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
          <div style={{ background: '#f8f4ec' }} />
          <div style={{ background: theme.accentLight }} />
          <div style={{ background: '#fbf9f5' }} />
          <div style={{ background: '#f7f5f0' }} />
        </div>

        <div style={{ position: 'absolute', left: '2.4rem', right: '1rem', bottom: '2.4rem', borderTop: '1.5px solid #9b9185' }} />
        <div style={{ position: 'absolute', left: '2.4rem', top: '1rem', bottom: '2.4rem', borderLeft: '1.5px solid #9b9185' }} />
        <div style={{ position: 'absolute', left: 'calc(50% + 0.7rem)', top: '1rem', bottom: '2.4rem', borderLeft: '1px dashed #d8d0c3' }} />
        <div style={{ position: 'absolute', left: '2.4rem', right: '1rem', top: 'calc(50% - 0.2rem)', borderTop: '1px dashed #d8d0c3' }} />

        <div style={{ position: 'absolute', right: '1rem', bottom: '0.65rem', color: theme.muted, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {block.xAxis ?? 'Directness'} →
        </div>
        <div style={{ position: 'absolute', left: '-0.9rem', top: '46%', transform: 'rotate(-90deg)', transformOrigin: 'center', color: theme.muted, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {block.yAxis ?? 'Investability'} →
        </div>
        <div style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', color: '#776d63', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.72rem', fontWeight: 600 }}>
          Cleaner expressions
        </div>
        <div style={{ position: 'absolute', left: '2.75rem', top: '1.25rem', color: '#958b80', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.72rem' }}>
          Liquid, but less direct
        </div>
        <div style={{ position: 'absolute', right: '1.25rem', bottom: '2.8rem', color: '#958b80', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.72rem' }}>
          Direct, but harder to own cleanly
        </div>

        <div style={{ position: 'absolute', inset: '1rem 1rem 2.4rem 2.4rem' }}>
          {points.map((point, index) => {
            const x = clampPct(point.x)
            const y = clampPct(point.y)
            const isPrimary = x >= 75 && y >= 65
            return (
              <div
                key={`${point.label}-${index}`}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  bottom: `${y}%`,
                  transform: 'translate(-50%, 50%)',
                  maxWidth: 132,
                  padding: '0.42rem 0.55rem',
                  background: isPrimary ? theme.accent : '#fffdfa',
                  color: isPrimary ? '#fffdfa' : '#2e2a26',
                  border: `1px solid ${isPrimary ? theme.accent : '#d8d0c3'}`,
                  boxShadow: '0 5px 14px rgba(42, 38, 34, 0.08)',
                  borderRadius: 6,
                  fontFamily: 'Helvetica Neue, sans-serif',
                  zIndex: 1,
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}>{point.label}</div>
                {point.bucket && <div style={{ marginTop: '0.15rem', fontSize: '0.68rem', lineHeight: 1.25, opacity: 0.82 }}>{point.bucket}</div>}
              </div>
            )
          })}
        </div>
      </div>
      {points.some((point) => point.note) && (
        <div style={{ display: 'grid', gap: '0.4rem', marginTop: '0.75rem', fontFamily: 'Helvetica Neue, sans-serif' }}>
          {points.map((point) => point.note ? (
            <div key={`${point.label}-note`} style={{ display: 'grid', gridTemplateColumns: '82px 1fr', gap: '0.55rem', color: '#5f564d', fontSize: '0.78rem', lineHeight: 1.45 }}>
              <span style={{ color: theme.accent, fontWeight: 700 }}>{point.label}</span>
              <span>{renderText(point.note)}</span>
            </div>
          ) : null)}
        </div>
      )}
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

// ── Line Chart ────────────────────────────────────────────────────────────────
function LineChart({ block, section }: { block: ContentBlock; section?: string }) {
  const theme = sectionTheme(section)
  const palette = [theme.accent, '#7c3aed', '#b45309', '#1d4ed8']
  const series = (block.series ?? [])
    .map((item) => ({
      ...item,
      points: item.points.filter((point) => Number.isFinite(Number(point.value))),
    }))
    .filter((item) => item.points.length > 0)
  const labels = Array.from(new Set(series.flatMap((item) => item.points.map((point) => point.label))))
  const values = series.flatMap((item) => item.points.map((point) => Number(point.value)))

  if (series.length === 0 || labels.length === 0 || values.length === 0) {
    return null
  }

  const chartWidth = 640
  const chartHeight = 280
  const padding = { top: 22, right: 20, bottom: 44, left: 52 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const lowerBound = minValue > 0 ? 0 : minValue
  const upperBound = maxValue === lowerBound ? maxValue + 1 : maxValue
  const valueRange = upperBound - lowerBound || 1
  const xFor = (label: string) => {
    const index = Math.max(0, labels.indexOf(label))
    return padding.left + (labels.length === 1 ? plotWidth / 2 : (index / (labels.length - 1)) * plotWidth)
  }
  const yFor = (value: number) => padding.top + ((upperBound - value) / valueRange) * plotHeight
  const formatValue = (value: number) => `${value}${block.unit ?? ''}`
  const tickCount = 4
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => lowerBound + (valueRange / tickCount) * index)

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ overflowX: 'auto' }}>
        <svg
          role="img"
          aria-label={block.title ?? 'Line chart'}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', minWidth: 420, height: 'auto', display: 'block', fontFamily: 'Helvetica Neue, sans-serif' }}
        >
          <rect x={padding.left} y={padding.top} width={plotWidth} height={plotHeight} fill="#fffdfa" stroke="#e6e0d6" />
          {ticks.map((tick) => {
            const y = yFor(tick)
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={padding.left + plotWidth} y2={y} stroke="#ede8df" strokeWidth="1" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#8a8278">
                  {formatValue(Math.round(tick * 10) / 10)}
                </text>
              </g>
            )
          })}
          {labels.map((label) => {
            const x = xFor(label)
            return (
              <g key={label}>
                <line x1={x} y1={padding.top} x2={x} y2={padding.top + plotHeight} stroke="#f1ece4" strokeWidth="1" />
                <text x={x} y={chartHeight - 18} textAnchor="middle" fontSize="10" fill="#6b635a">
                  {label}
                </text>
              </g>
            )
          })}
          {series.map((item, seriesIndex) => {
            const color = palette[seriesIndex % palette.length]
            const points = item.points.map((point) => `${xFor(point.label)},${yFor(Number(point.value))}`).join(' ')
            return (
              <g key={item.label}>
                <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {item.points.map((point) => (
                  <circle key={`${item.label}-${point.label}`} cx={xFor(point.label)} cy={yFor(Number(point.value))} r="3.5" fill="#fffdfa" stroke={color} strokeWidth="2" />
                ))}
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.75rem', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.8rem', color: '#5f564d' }}>
        {series.map((item, index) => (
          <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: palette[index % palette.length], display: 'inline-block' }} />
            <span>{item.label}</span>
          </div>
        ))}
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

// ── Constraint Stack ─────────────────────────────────────────────────────────
function ConstraintStack({ block, section }: { block: ContentBlock; section?: string }) {
  const layers = block.layers ?? []
  const theme = sectionTheme(section)
  const statusStyle = (status?: string) => {
    const normalized = (status ?? '').toLowerCase()
    if (['bottleneck', 'scarce', 'blocked'].includes(normalized)) return { background: theme.accent, color: '#fffdfa', border: theme.accent }
    if (['tightening', 'watch', 'mixed'].includes(normalized)) return { background: '#fff3d8', color: '#8a5a10', border: '#e6c37a' }
    if (['strong', 'clear', 'healthy'].includes(normalized)) return { background: '#eaf4ea', color: '#386641', border: '#b7d8b7' }
    if (['output', 'delivered'].includes(normalized)) return { background: '#ece7ff', color: '#5b45a3', border: '#cfc4ff' }
    return { background: '#f1ece4', color: '#6b635a', border: '#ddd5c5' }
  }

  return (
    <div style={{ margin: '1.5rem 0 2rem', padding: '1rem', background: '#faf8f5', border: '1px solid #e6e0d6', borderRadius: '4px' }}>
      {block.title && <div style={visualTitleStyle}>{block.title}</div>}
      <div style={{ display: 'grid', gap: '0.65rem' }}>
        {layers.map((layer, index) => {
          const style = statusStyle(layer.status)
          const isBottleneck = ['bottleneck', 'scarce', 'blocked'].includes((layer.status ?? '').toLowerCase())
          return (
            <div key={`${layer.label}-${index}`} style={{ position: 'relative' }}>
              {index > 0 && <div style={{ position: 'absolute', left: 18, top: -10, width: 2, height: 12, background: '#d8d0c3' }} />}
              <div style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 0.85rem', background: isBottleneck ? theme.accentLight : '#fffdfa', border: `1px solid ${isBottleneck ? theme.accentBorder : '#e6e0d6'}`, borderRadius: 6, boxShadow: isBottleneck ? '0 6px 18px rgba(42, 38, 34, 0.08)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: isBottleneck ? theme.accent : '#eee7dc', color: isBottleneck ? '#fffdfa' : '#6b635a', display: 'grid', placeItems: 'center', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.78rem', fontWeight: 700 }}>{index + 1}</div>
                <div>
                  <div style={{ color: '#2e2a26', fontWeight: 700, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.92rem', lineHeight: 1.25 }}>{layer.label}</div>
                  {(layer.note ?? layer.text) && <div style={{ marginTop: '0.18rem', color: '#5f564d', lineHeight: 1.45, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.82rem' }}>{renderText(layer.note ?? layer.text ?? '')}</div>}
                </div>
                {layer.status && <div style={{ alignSelf: 'start', padding: '0.22rem 0.48rem', borderRadius: 999, background: style.background, color: style.color, border: `1px solid ${style.border}`, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.62rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{layer.status}</div>}
              </div>
            </div>
          )
        })}
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

    case 'exposure-matrix':
      return <ExposureMatrix block={block} section={section} />

    case 'constraint-stack':
      return <ConstraintStack block={block} section={section} />

    case 'scorecard':
      return <Scorecard block={block} section={section} />

    case 'bar-chart':
      return <BarChart block={block} section={section} />

    case 'line-chart':
      return <LineChart block={block} section={section} />

    case 'timeline':
      return <Timeline block={block} section={section} />

    case 'stack-diagram':
      return <StackDiagram block={block} section={section} />

    default:
      return <p style={{ margin: '0 0 1rem 0', color: '#2e2a26', lineHeight: 1.85, fontSize: '1.05rem', fontFamily: 'Helvetica Neue, sans-serif' }}>{renderText(block.text ?? '')}</p>
  }
}
