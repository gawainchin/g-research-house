import type { ReactElement } from 'react'
import type { ResearchSectionSlug } from '../lib/research-types'

// Editorial illustration component.
// Generates a deterministic, slug-derived SVG composition that echoes Riso-print
// editorial art: cream background, one muted accent + ink line work, 5 templates.
// Pure server-renderable, no client state.

const CREAM = '#fffdfa'
const INK = '#2a2622'

// AI Research leans cool; Financial Research leans warm.
const COOL_ACCENTS = ['#4a5568', '#1f2c4a', '#5a3a52'] as const // slate, navy, plum
const WARM_ACCENTS = ['#7a3b2e', '#a8804a', '#3d6b5e'] as const // oxblood, ochre, forest

const NUM_VARIANTS = 5

interface Props {
  slug: string
  section: ResearchSectionSlug
  variant: 'hero' | 'card'
}

function hashSlug(slug: string): number {
  // djb2 — small, dependency-free, stable.
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

// ── Composition templates ────────────────────────────────────────────────────

// 0 · Stacked overlapping circles. Four circles spanning the canvas, one large
// accent fill plus ink outlines for a Riso layered feel.
function stackedCircles(
  rand: () => number,
  w: number,
  h: number,
  accent: string,
): ReactElement {
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

// 1 · Orbit / concentric arcs. Off-center pivot, 5 arcs, two filled satellites.
function orbitArcs(
  rand: () => number,
  w: number,
  h: number,
  accent: string,
): ReactElement {
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
    arcs.push(
      <path
        key={i}
        d={`M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`}
        stroke={stroke}
        strokeWidth={i === 2 ? 1.6 : 1}
        fill="none"
      />,
    )
  }
  // Two satellites at different orbits.
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

// 2 · Contour bands. Six parallel curved lines drifting diagonally, with one
// accent dot anchoring the composition.
function contourBands(
  rand: () => number,
  w: number,
  h: number,
  accent: string,
): ReactElement {
  const lines: ReactElement[] = []
  const count = 6
  const drop = h * 0.13
  const startY = h * (0.1 + rand() * 0.06)
  const ctrlOffset = h * (0.2 + rand() * 0.08)
  const accentRow = 1 + Math.floor(rand() * 3) // 1..3 so accent stays in the upper-middle
  for (let i = 0; i < count; i++) {
    const y = startY + i * drop
    const c1x = w * (0.28 + rand() * 0.06)
    const c1y = y - ctrlOffset
    const c2x = w * (0.7 + rand() * 0.06)
    const c2y = y + ctrlOffset
    const endY = y + h * 0.05
    const stroke = i === accentRow ? accent : INK
    lines.push(
      <path
        key={i}
        d={`M ${-4} ${y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${(w + 4).toFixed(2)} ${endY.toFixed(2)}`}
        stroke={stroke}
        strokeWidth={i === accentRow ? 1.8 : 1}
        fill="none"
        strokeLinecap="round"
      />,
    )
  }
  // Anchoring dot on the accent line.
  const dx = w * (0.62 + rand() * 0.12)
  const dy = startY + accentRow * drop + (rand() - 0.5) * drop * 0.4
  return (
    <g>
      {lines}
      <circle cx={dx} cy={dy} r={3.8} fill={accent} />
    </g>
  )
}

// 3 · Sparse dot grid with one larger filled accent shape.
function dotGridShape(
  rand: () => number,
  w: number,
  h: number,
  accent: string,
): ReactElement {
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
  // Single thin ink line crossing the shape for tension.
  const lineY = cy + (rand() - 0.5) * radius * 0.6
  return (
    <g>
      {dots}
      <circle cx={cx} cy={cy} r={radius} fill={accent} opacity={0.94} />
      <line x1={padX * 0.6} y1={lineY} x2={w - padX * 0.6} y2={lineY} stroke={INK} strokeWidth={1} />
    </g>
  )
}

// 4 · Stepped polygon. Wider stair shape filled accent, parallel ink hatches
// behind, and a small counter-block on the opposite side to balance the canvas.
function stepPolygon(
  rand: () => number,
  w: number,
  h: number,
  accent: string,
): ReactElement {
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
  // Hatch lines behind / right of the staircase, top to bottom of canvas.
  const hatchStartX = x + w * 0.04
  const hatchEndX = w - w * 0.06
  const hatchCount = 7
  const hatchTop = h * 0.12
  const hatchStep = (baseY - hatchTop) / (hatchCount - 1)
  const hatches: ReactElement[] = []
  for (let i = 0; i < hatchCount; i++) {
    const hy = hatchTop + i * hatchStep
    hatches.push(
      <line
        key={i}
        x1={hatchStartX}
        y1={hy}
        x2={hatchEndX}
        y2={hy + (rand() - 0.5) * 1.6}
        stroke={INK}
        strokeWidth={1}
        opacity={0.7}
      />,
    )
  }
  // Small counter-square upper right.
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

export default function NoteIllustration({ slug, section, variant }: Props) {
  const seed = hashSlug(slug)
  const palette = section === 'ai-research' ? COOL_ACCENTS : WARM_ACCENTS
  // Pick color and composition from independent bit ranges of the hash so
  // colour-spread and shape-spread don't correlate. The shifts were chosen for
  // an even distribution across the current article set; with djb2 the very
  // low bits cluster, so we skip them.
  const accent = palette[((seed >>> 5) & 0x7fffffff) % palette.length]
  const compositionIdx = ((seed >>> 17) & 0x7fffffff) % NUM_VARIANTS
  const width = 200
  const height = variant === 'hero' ? 120 : 150
  const rand = makeRng(seed + 1013)
  const body = COMPOSITIONS[compositionIdx](rand, width, height, accent)
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
