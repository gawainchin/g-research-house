import Link from 'next/link'
import type { HouseViewData } from '../lib/research-types'

const RULE = '#ece6dd'
const SERIF = 'var(--font-newsreader), Newsreader, Georgia, serif'

const eyebrow = {
  fontFamily: 'Helvetica Neue, sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a8278',
}

const LENS_ACCENT = {
  'ai-research': '#4a5568',
  'financial-research': '#3d6b5e',
} as const

export default function HouseViewSummary({ houseView }: { houseView: HouseViewData }) {
  const theses = houseView.theses.slice(0, 4)

  return (
    <section style={{ margin: '0 0 3rem', borderTop: `1px solid ${RULE}`, paddingTop: '1.35rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.15rem',
        }}
      >
        <div>
          <div style={{ ...eyebrow, marginBottom: '0.55rem' }}>House View</div>
          <h2
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontSize: '1.65rem',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#171717',
            }}
          >
            Current theses before the archive
          </h2>
          <p style={{ margin: '0.65rem 0 0', maxWidth: 620, color: '#514b44', lineHeight: 1.65, fontSize: '0.98rem' }}>
            {houseView.summary}
          </p>
        </div>
        <Link className="readerPill" href="/house-view" style={{ ...eyebrow, color: '#5a544d' }}>
          Open house view →
        </Link>
      </div>

      <div className="houseThesisGrid">
        {theses.map((thesis) => {
          const accent = LENS_ACCENT[thesis.lens]
          return (
            <Link
              key={thesis.slug}
              href={`/themes/${thesis.clusterSlug}`}
              className="houseThesisCard"
              style={{ borderTopColor: accent }}
            >
              <div style={{ ...eyebrow, color: accent, marginBottom: '0.55rem' }}>
                {thesis.status} · {thesis.conviction}
              </div>
              <h3 style={{ margin: 0, fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.25 }}>
                {thesis.title}
              </h3>
              <p style={{ margin: '0.55rem 0 0', color: '#5a544d', lineHeight: 1.55, fontSize: '0.9rem' }}>
                {thesis.claim}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
