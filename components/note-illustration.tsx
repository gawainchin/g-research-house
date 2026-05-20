import type { ReactElement } from 'react'
import type { ResearchSectionSlug } from '../lib/research-types'

// Editorial illustration component.
// Default behavior remains deterministic slug-derived abstract SVG.
// When visualKey is present (or can be inferred from metadata), switch to a
// curated semantic motif so homepage cards can reflect the article thesis.

const CREAM = '#fffdfa'
const INK = '#2a2622'
const PAPER = '#f4efe7'

const COOL_ACCENTS = ['#4a5568', '#1f2c4a', '#5a3a52'] as const
const WARM_ACCENTS = ['#7a3b2e', '#a8804a', '#3d6b5e'] as const

const NUM_VARIANTS = 5

type VisualKey =
  | 'hooks'
  | 'workflow'
  | 'memory-io'
  | 'power-semiconductor'
  | 'valuation'
  | 'infrastructure'

interface Props {
  slug: string
  section: ResearchSectionSlug
  variant: 'hero' | 'card'
  visualKey?: string
  keywords?: string[]
}

function hashSlug(slug: string): number {
  let h = 5381
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function makeRng(seed: number): () => number {
  let s = seed || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function canonicalVisualKey(value?: string | null): VisualKey | null {
  switch ((value || '').trim()) {
    case 'hooks':
    case 'workflow':
    case 'memory-io':
    case 'power-semiconductor':
    case 'valuation':
    case 'infrastructure':
      return value as VisualKey
    default:
      return null
  }
}

function inferVisualKey(slug: string, keywords: string[] = []): VisualKey | null {
  const haystack = `${slug} ${keywords.join(' ')}`.toLowerCase()
  if (/(hook|checkpoint|control plane|pretooluse|posttooluse|workflow enforcement)/.test(haystack)) return 'hooks'
  if (/(workflow|kanban|agent workflow|pipeline|orchestration|handoff)/.test(haystack)) return 'workflow'
  if (/(memory|kv cache|i\/o|bandwidth|storage|cache)/.test(haystack)) return 'memory-io'
  if (/(power semiconductor|semiconductor|silicon carbide|sic|power tree|wafer)/.test(haystack)) return 'power-semiconductor'
  if (/(valuation|multiple|rule of 40|duration|rerating|price)/.test(haystack)) return 'valuation'
  if (/(infrastructure|grid|equipment|transmission|data center power)/.test(haystack)) return 'infrastructure'
  return null
}

function motifHooks(w: number, h: number, accent: string): ReactElement {
  const stemX = w * 0.25
  const branchY = h * 0.52
  const gateX = w * 0.68
  return (
    <g>
      <rect x={w * 0.08} y={h * 0.18} width={w * 0.26} height={h * 0.18} rx={8} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      <path d={`M ${stemX} ${h * 0.36} L ${stemX} ${branchY} L ${gateX} ${branchY}`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${stemX} ${branchY} L ${w * 0.47} ${h * 0.77}`} fill="none" stroke={INK} strokeWidth={1.4} strokeDasharray="4 4" strokeLinecap="round" />
      <rect x={gateX - 18} y={branchY - 18} width={36} height={36} rx={8} fill={accent} opacity={0.92} />
      <line x1={gateX - 9} y1={branchY - 9} x2={gateX + 9} y2={branchY + 9} stroke={CREAM} strokeWidth={2.4} strokeLinecap="round" />
      <line x1={gateX + 9} y1={branchY - 9} x2={gateX - 9} y2={branchY + 9} stroke={CREAM} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={w * 0.47} cy={h * 0.77} r={6.5} fill={CREAM} stroke={INK} strokeWidth={1.2} />
      <circle cx={w * 0.84} cy={branchY} r={7.5} fill={CREAM} stroke={accent} strokeWidth={1.8} />
    </g>
  )
}

function motifWorkflow(w: number, h: number, accent: string): ReactElement {
  const boxW = w * 0.18
  const boxH = h * 0.18
  const y = h * 0.4
  const xs = [w * 0.1, w * 0.39, w * 0.68]
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x} y={y} width={boxW} height={boxH} rx={8} fill={i === 1 ? accent : PAPER} opacity={i === 1 ? 0.92 : 1} stroke={i === 1 ? accent : INK} strokeWidth={1.2} />
          {i < xs.length - 1 && (
            <path d={`M ${x + boxW} ${y + boxH / 2} L ${xs[i + 1] - 14} ${y + boxH / 2}`} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          )}
          {i < xs.length - 1 && (
            <path d={`M ${xs[i + 1] - 19} ${y + boxH / 2 - 5} L ${xs[i + 1] - 10} ${y + boxH / 2} L ${xs[i + 1] - 19} ${y + boxH / 2 + 5}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      ))}
      <path d={`M ${w * 0.48} ${h * 0.22} L ${w * 0.48} ${y - 12}`} stroke={accent} strokeWidth={1.6} strokeDasharray="4 4" />
      <circle cx={w * 0.48} cy={h * 0.18} r={7} fill={CREAM} stroke={accent} strokeWidth={1.8} />
    </g>
  )
}

function motifMemoryIo(w: number, h: number, accent: string): ReactElement {
  const left = w * 0.12
  const right = w * 0.62
  const top = h * 0.22
  const rowH = h * 0.12
  return (
    <g>
      <rect x={left} y={top} width={w * 0.28} height={rowH * 3.3} rx={10} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      <rect x={right} y={top + rowH * 0.2} width={w * 0.2} height={rowH * 2.9} rx={10} fill={accent} opacity={0.9} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={left + 12} y1={top + rowH * (i + 0.7)} x2={left + w * 0.22} y2={top + rowH * (i + 0.7)} stroke={i === 1 ? accent : INK} strokeWidth={1.4} opacity={0.9} />
          <path d={`M ${left + w * 0.28} ${top + rowH * (i + 0.7)} C ${w * 0.5} ${top + rowH * (i + 0.55)} ${w * 0.53} ${top + rowH * (i + 0.85)} ${right} ${top + rowH * (i + 0.7)}`} fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}
      <circle cx={w * 0.53} cy={h * 0.76} r={12} fill={CREAM} stroke={accent} strokeWidth={2} />
      <path d={`M ${w * 0.49} ${h * 0.76} L ${w * 0.53} ${h * 0.72} L ${w * 0.57} ${h * 0.76} L ${w * 0.53} ${h * 0.8} Z`} fill={accent} />
    </g>
  )
}

function motifPowerSemiconductor(w: number, h: number, accent: string): ReactElement {
  const waferX = w * 0.18
  const waferY = h * 0.2
  const waferW = w * 0.26
  const waferH = h * 0.52
  const nodeY = h * 0.46
  return (
    <g>
      <rect x={waferX} y={waferY} width={waferW} height={waferH} rx={10} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      {[1, 2, 3].map((i) => <line key={`v-${i}`} x1={waferX + (waferW / 4) * i} y1={waferY + 8} x2={waferX + (waferW / 4) * i} y2={waferY + waferH - 8} stroke={INK} strokeWidth={0.8} opacity={0.45} />)}
      {[1, 2, 3].map((i) => <line key={`h-${i}`} x1={waferX + 8} y1={waferY + (waferH / 4) * i} x2={waferX + waferW - 8} y2={waferY + (waferH / 4) * i} stroke={INK} strokeWidth={0.8} opacity={0.45} />)}
      <path d={`M ${waferX + waferW} ${nodeY} L ${w * 0.62} ${nodeY}`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${w * 0.62} ${nodeY} L ${w * 0.74} ${h * 0.28} L ${w * 0.86} ${h * 0.28}`} stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${w * 0.62} ${nodeY} L ${w * 0.74} ${h * 0.64} L ${w * 0.86} ${h * 0.64}`} stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w * 0.62} cy={nodeY} r={8} fill={accent} />
      <rect x={w * 0.86} y={h * 0.22} width={w * 0.08} height={h * 0.12} rx={4} fill={accent} opacity={0.95} />
      <rect x={w * 0.86} y={h * 0.58} width={w * 0.08} height={h * 0.12} rx={4} fill={CREAM} stroke={accent} strokeWidth={1.8} />
    </g>
  )
}

function motifValuation(w: number, h: number, accent: string): ReactElement {
  const pad = w * 0.12
  const baseY = h * 0.72
  const xs = [pad, w * 0.42, w * 0.7]
  const heights = [h * 0.14, h * 0.28, h * 0.43]
  return (
    <g>
      <line x1={pad} y1={baseY} x2={w - pad * 0.5} y2={baseY} stroke={INK} strokeWidth={1.4} />
      {xs.map((x, i) => (
        <rect key={x} x={x} y={baseY - heights[i]} width={w * 0.12} height={heights[i]} rx={6} fill={i === 1 ? accent : PAPER} stroke={i === 1 ? accent : INK} strokeWidth={1.2} />
      ))}
      <path d={`M ${pad - 2} ${h * 0.34} C ${w * 0.3} ${h * 0.52} ${w * 0.54} ${h * 0.16} ${w * 0.84} ${h * 0.26}`} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <circle cx={w * 0.84} cy={h * 0.26} r={6.5} fill={accent} />
    </g>
  )
}

function motifInfrastructure(w: number, h: number, accent: string): ReactElement {
  return (
    <g>
      <path d={`M ${w * 0.18} ${h * 0.76} L ${w * 0.26} ${h * 0.24} L ${w * 0.34} ${h * 0.76}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M ${w * 0.58} ${h * 0.76} L ${w * 0.66} ${h * 0.24} L ${w * 0.74} ${h * 0.76}`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinejoin="round" />
      {[0.34, 0.5, 0.66].map((y) => (
        <line key={y} x1={w * 0.22} y1={h * y} x2={w * 0.3} y2={h * y} stroke={INK} strokeWidth={1.2} />
      ))}
      {[0.34, 0.5, 0.66].map((y) => (
        <line key={`r-${y}`} x1={w * 0.62} y1={h * y} x2={w * 0.7} y2={h * y} stroke={accent} strokeWidth={1.2} />
      ))}
      <path d={`M ${w * 0.3} ${h * 0.34} C ${w * 0.43} ${h * 0.2} ${w * 0.53} ${h * 0.2} ${w * 0.62} ${h * 0.34}`} fill="none" stroke={INK} strokeWidth={1.6} strokeDasharray="4 4" />
      <path d={`M ${w * 0.3} ${h * 0.66} C ${w * 0.43} ${h * 0.8} ${w * 0.53} ${h * 0.8} ${w * 0.62} ${h * 0.66}`} fill="none" stroke={accent} strokeWidth={1.6} />
      <circle cx={w * 0.46} cy={h * 0.5} r={11} fill={CREAM} stroke={INK} strokeWidth={1.4} />
      <circle cx={w * 0.46} cy={h * 0.5} r={4.5} fill={accent} />
    </g>
  )
}

const SEMANTIC_MOTIFS: Record<VisualKey, (w: number, h: number, accent: string) => ReactElement> = {
  hooks: motifHooks,
  workflow: motifWorkflow,
  'memory-io': motifMemoryIo,
  'power-semiconductor': motifPowerSemiconductor,
  valuation: motifValuation,
  infrastructure: motifInfrastructure,
}

function stackedCircles(rand: () => number, w: number, h: number, accent: string): ReactElement {
  const ref = Math.min(w, h)
  const cx0 = w * (0.32 + rand() * 0.04)
  const cy0 = h * (0.5 + rand() * 0.06)
  const r0 = ref * (0.44 + rand() * 0.04)
  const cx1 = w * (0.62 + rand() * 0.04)
  const cy1 = h * (0.42 + rand() * 0.08)
  const r1 = ref * (0.3 + rand() * 0.04)
  const cx2 = w * (0.78 + rand() * 0.04)
  const cy2 = h * (0.7 + rand() * 0.04)
  const r2 = ref * (0.18 + rand() * 0.03)
  const cx3 = w * (0.18 + rand() * 0.04)
  const cy3 = h * (0.74 + rand() * 0.04)
  const r3 = ref * (0.1 + rand() * 0.03)
  return (
    <g>
      <circle cx={cx0} cy={cy0} r={r0} fill="none" stroke={INK} strokeWidth={1} />
      <circle cx={cx1} cy={cy1} r={r1} fill={accent} opacity={0.9} />
      <circle cx={cx2} cy={cy2} r={r2} fill="none" stroke={accent} strokeWidth={1.4} />
      <circle cx={cx3} cy={cy3} r={r3} fill={INK} opacity={0.85} />
    </g>
  )
}

function orbitArcs(rand: () => number, w: number, h: number, accent: string): ReactElement {
  const cx = w * (0.22 + rand() * 0.08)
  const cy = h * (0.78 + rand() * 0.08)
  const base = Math.min(w, h) * 0.22
  const spacing = Math.min(w, h) * (0.16 + rand() * 0.02)
  const arcs: ReactElement[] = []
  for (let i = 0; i < 5; i++) {
    const r = base + i * spacing
    const stroke = i === 2 ? accent : INK
    const startAngle = -Math.PI * (0.95 + rand() * 0.05)
    const endAngle = -rand() * 0.15
    const x0 = cx + Math.cos(startAngle) * r
    const y0 = cy + Math.sin(startAngle) * r
    const x1 = cx + Math.cos(endAngle) * r
    const y1 = cy + Math.sin(endAngle) * r
    const large = endAngle - startAngle > Math.PI ? 1 : 0
    arcs.push(<path key={i} d={`M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`} stroke={stroke} strokeWidth={i === 2 ? 1.6 : 1} fill="none" />)
  }
  const a1 = -Math.PI * (0.3 + rand() * 0.15)
  const r1 = base + 3.2 * spacing
  const sx1 = cx + Math.cos(a1) * r1
  const sy1 = cy + Math.sin(a1) * r1
  const a2 = -Math.PI * (0.6 + rand() * 0.1)
  const r2 = base + 1.4 * spacing
  const sx2 = cx + Math.cos(a2) * r2
  const sy2 = cy + Math.sin(a2) * r2
  return (
    <g>
      {arcs}
      <circle cx={sx1} cy={sy1} r={3.6} fill={accent} />
      <circle cx={sx2} cy={sy2} r={2.2} fill={INK} />
    </g>
  )
}

function contourBands(rand: () => number, w: number, h: number, accent: string): ReactElement {
  const lines: ReactElement[] = []
  const count = 6
  const drop = h * 0.13
  const startY = h * (0.1 + rand() * 0.06)
  const ctrlOffset = h * (0.2 + rand() * 0.08)
  const accentRow = 1 + Math.floor(rand() * 3)
  for (let i = 0; i < count; i++) {
    const y = startY + i * drop
    const c1x = w * (0.28 + rand() * 0.06)
    const c1y = y - ctrlOffset
    const c2x = w * (0.7 + rand() * 0.06)
    const c2y = y + ctrlOffset
    const endY = y + h * 0.05
    const stroke = i === accentRow ? accent : INK
    lines.push(<path key={i} d={`M ${-4} ${y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${(w + 4).toFixed(2)} ${endY.toFixed(2)}`} stroke={stroke} strokeWidth={i === accentRow ? 1.8 : 1} fill="none" strokeLinecap="round" />)
  }
  const dx = w * (0.62 + rand() * 0.12)
  const dy = startY + accentRow * drop + (rand() - 0.5) * drop * 0.4
  return (
    <g>
      {lines}
      <circle cx={dx} cy={dy} r={3.8} fill={accent} />
    </g>
  )
}

function dotGridShape(rand: () => number, w: number, h: number, accent: string): ReactElement {
  const cols = 11
  const rows = Math.max(5, Math.round((h / w) * cols))
  const padX = w * 0.08
  const padY = h * 0.12
  const stepX = (w - padX * 2) / (cols - 1)
  const stepY = (h - padY * 2) / (rows - 1)
  const dots: ReactElement[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * stepX
      const y = padY + r * stepY
      dots.push(<circle key={`${r}-${c}`} cx={x} cy={y} r={0.85} fill={INK} opacity={0.55} />)
    }
  }
  const cx = w * (0.36 + rand() * 0.28)
  const cy = h * (0.42 + rand() * 0.22)
  const radius = Math.min(w, h) * (0.22 + rand() * 0.05)
  const lineY = cy + (rand() - 0.5) * radius * 0.6
  return (
    <g>
      {dots}
      <circle cx={cx} cy={cy} r={radius} fill={accent} opacity={0.94} />
      <line x1={padX * 0.6} y1={lineY} x2={w - padX * 0.6} y2={lineY} stroke={INK} strokeWidth={1} />
    </g>
  )
}

function stepPolygon(rand: () => number, w: number, h: number, accent: string): ReactElement {
  const steps = 4
  const startX = w * (0.08 + rand() * 0.04)
  const baseY = h * (0.86 + rand() * 0.03)
  const stepW = w * 0.11
  const stepH = h * (0.16 + rand() * 0.03)
  const pts: string[] = []
  pts.push(`${startX.toFixed(2)},${baseY.toFixed(2)}`)
  let x = startX
  let y = baseY
  for (let i = 0; i < steps; i++) {
    y -= stepH
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    x += stepW
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  pts.push(`${x.toFixed(2)},${baseY.toFixed(2)}`)
  const hatchStartX = x + w * 0.04
  const hatchEndX = w - w * 0.06
  const hatchCount = 7
  const hatchTop = h * 0.12
  const hatchStep = (baseY - hatchTop) / (hatchCount - 1)
  const hatches: ReactElement[] = []
  for (let i = 0; i < hatchCount; i++) {
    const hy = hatchTop + i * hatchStep
    hatches.push(<line key={i} x1={hatchStartX} y1={hy} x2={hatchEndX} y2={hy + (rand() - 0.5) * 1.6} stroke={INK} strokeWidth={1} opacity={0.7} />)
  }
  const sqSize = Math.min(w, h) * 0.12
  const sqX = w * 0.78 + rand() * w * 0.04
  const sqY = h * 0.12
  return (
    <g>
      {hatches}
      <polygon points={pts.join(' ')} fill={accent} fillOpacity={0.18} stroke={accent} strokeWidth={1.6} strokeLinejoin="miter" />
      <rect x={sqX} y={sqY} width={sqSize} height={sqSize} fill={accent} opacity={0.92} />
    </g>
  )
}

const COMPOSITIONS = [stackedCircles, orbitArcs, contourBands, dotGridShape, stepPolygon] as const

export default function NoteIllustration({ slug, section, variant, visualKey, keywords }: Props) {
  const seed = hashSlug(slug)
  const palette = section === 'ai-research' ? COOL_ACCENTS : WARM_ACCENTS
  const accent = palette[((seed >>> 5) & 0x7fffffff) % palette.length]
  const width = 200
  const height = variant === 'hero' ? 120 : 150

  const chosenKey = canonicalVisualKey(visualKey) ?? inferVisualKey(slug, keywords)
  const body = chosenKey
    ? SEMANTIC_MOTIFS[chosenKey](width, height, accent)
    : COMPOSITIONS[((seed >>> 17) & 0x7fffffff) % NUM_VARIANTS](makeRng(seed + 1013), width, height, accent)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect width={width} height={height} fill={CREAM} />
      {body}
    </svg>
  )
}
