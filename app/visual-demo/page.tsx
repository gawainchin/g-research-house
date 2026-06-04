import Link from 'next/link'
import ArticleBlock from '../../components/article-block'
import type { ContentBlock } from '../../lib/research'

export const metadata = {
  title: 'Visual Demo | G Research House',
  description: 'A showcase of G Research House visual research blocks.',
}

const demoBlocks: { eyebrow: string; summary: string; block: ContentBlock }[] = [
  {
    eyebrow: 'Thesis Card',
    summary: 'A strong opening frame for a research note.',
    block: {
      type: 'thesis-card',
      label: 'Core Thesis',
      title: 'Visual blocks turn long-form research into scan-first judgment.',
      text: 'The goal is not decoration. Each block should compress a decision, comparison, path, or risk into a shape the reader can parse before reading the full argument.',
    },
  },
  {
    eyebrow: 'Key Takeaways',
    summary: 'Fast executive-summary bullets with optional icons.',
    block: {
      type: 'key-takeaways',
      takeaways: [
        { text: 'Use metrics when the reader needs an immediate size-of-prize frame.' },
        { text: 'Use ladders and timelines when sequence or probability matters.' },
        { text: 'Use stack diagrams when the idea spans layers of infrastructure.' },
      ],
    },
  },
  {
    eyebrow: 'Metric Strip',
    summary: 'Compact KPI framing for financial, product, or infrastructure reads.',
    block: {
      type: 'metric-strip',
      metrics: [
        { label: 'Signals', value: '4' },
        { label: 'Scenarios', value: '3' },
        { label: 'Time To Scan', value: '<30s' },
        { label: 'Reader Mode', value: 'Visual' },
      ],
    },
  },
  {
    eyebrow: 'Comparison Table',
    summary: 'Side-by-side analysis for company, architecture, or strategy choices.',
    block: {
      type: 'comparison-table',
      title: 'Visual Block Fit',
      columns: ['Block', 'Best Use', 'Reader Question'],
      rows: [
        ['Scorecard', 'Multi-factor quality check', 'How strong is it?'],
        ['Flowchart', 'Causal or process path', 'What happens next?'],
        ['Scenario ladder', 'Bull/base/bear framing', 'What could change the outcome?'],
        ['Stack diagram', 'Layered systems view', 'Where does this sit?'],
      ],
    },
  },
  {
    eyebrow: 'Flowchart',
    summary: 'Sequential logic for workflows, catalysts, and decision paths.',
    block: {
      type: 'flowchart',
      title: 'From Raw Note To Publishable Research',
      steps: [
        { label: 'Collect signals', note: 'Source facts, market context, and user observations.' },
        { label: 'Choose the lens', note: 'Investor, operator, analyst, or systems view.' },
        { label: 'Shape the visual', note: 'Pick the block that reduces the most reading effort.' },
        { label: 'Validate output', note: 'Run data checks, tests, and build before publishing.' },
      ],
    },
  },
  {
    eyebrow: 'Scenario Ladder',
    summary: 'Probability-weighted outcomes with a concise risk map.',
    block: {
      type: 'scenario-ladder',
      title: 'Launch Readiness Scenarios',
      scenarios: [
        {
          label: 'Bull',
          probability: '25%',
          outcome: 'High adoption',
          description: 'The visual layer makes research easier to browse, share, and revisit.',
        },
        {
          label: 'Base',
          probability: '55%',
          outcome: 'Steady lift',
          description: 'Readers use the demo as a pattern library for future research notes.',
        },
        {
          label: 'Bear',
          probability: '20%',
          outcome: 'Low reuse',
          description: 'Blocks are overused or chosen without a clear analytical purpose.',
        },
      ],
    },
  },
  {
    eyebrow: 'Constraint Stack',
    summary: 'Layered bottleneck map for physical, regulatory, and financial constraints.',
    block: {
      type: 'constraint-stack',
      title: 'Where the AI power constraint really sits',
      layers: [
        { label: 'Demand', status: 'strong', note: 'Hyperscaler load growth remains visible.' },
        { label: 'Site control', status: 'mixed', note: 'Land is necessary but not sufficient.' },
        { label: 'Interconnection queue', status: 'bottleneck', note: 'Approval timing and upgrade scope decide financeability.' },
        { label: 'Reliability studies', status: 'tightening', note: 'Load-drop scrutiny raises the bar before energization.' },
        { label: 'Equipment', status: 'scarce', note: 'Transformers, switchgear, substations and EPC capacity gate execution.' },
        { label: 'Delivered capacity', status: 'output', note: 'Only energized capacity creates monetizable AI infrastructure.' },
      ],
    },
  },
  {
    eyebrow: 'Exposure Matrix',
    summary: 'Investor expression map for bottleneck directness versus public-market cleanliness.',
    block: {
      type: 'exposure-matrix',
      title: 'AI Power Bottleneck Exposure Map',
      xAxis: 'Directness to bottleneck',
      yAxis: 'Public-market investability',
      points: [
        { label: 'ETN / GEV', bucket: 'Power equipment', x: 86, y: 82, note: 'Direct grid-upgrade spend with liquid public equities.' },
        { label: 'PWR', bucket: 'Transmission / EPC', x: 80, y: 56, note: 'Execution lever, less pure AI upside.' },
        { label: 'CEG / VST', bucket: 'Co-location / generation', x: 67, y: 78, note: 'Firm power scarcity, but policy-sensitive.' },
        { label: 'DLR / EQIX', bucket: 'Power-ready data centers', x: 45, y: 72, note: 'Owns campuses, not the whole interconnection chain.' },
        { label: 'Grid studies', bucket: 'Software / compliance', x: 76, y: 28, note: 'Mechanically direct, weak pure-play exposure.' },
      ],
    },
  },
  {
    eyebrow: 'Scorecard',
    summary: 'A structured rating for subjective but repeatable judgments.',
    block: {
      type: 'scorecard',
      title: 'Research Visual Quality',
      criteria: [
        { label: 'Clarity', score: 5, note: 'Can a reader understand the point quickly?' },
        { label: 'Density', score: 4, note: 'Does the visual carry real information?' },
        { label: 'Restraint', score: 4, note: 'Is the block used because it helps, not because it is available?' },
      ],
    },
  },
  {
    eyebrow: 'Bar Chart',
    summary: 'Simple quantitative comparisons without a heavy charting stack.',
    block: {
      type: 'bar-chart',
      title: 'Reader Attention Budget',
      unit: '%',
      bars: [
        { label: 'Headline scan', value: 20, note: 'Title, summary, and key takeaways.' },
        { label: 'Visual blocks', value: 45, note: 'Metrics, tables, ladders, and diagrams.' },
        { label: 'Deep reading', value: 35, note: 'Full argument and supporting prose.' },
      ],
    },
  },
  {
    eyebrow: 'Line Chart',
    summary: 'Trend lines for revenue, adoption, capacity, or index comparisons over time.',
    block: {
      type: 'line-chart',
      title: 'Research System Maturity',
      unit: '%',
      series: [
        {
          label: 'Structured notes',
          points: [
            { label: 'Q1', value: 30 },
            { label: 'Q2', value: 48 },
            { label: 'Q3', value: 68 },
            { label: 'Q4', value: 82 },
          ],
        },
        {
          label: 'Visual coverage',
          points: [
            { label: 'Q1', value: 12 },
            { label: 'Q2', value: 35 },
            { label: 'Q3', value: 54 },
            { label: 'Q4', value: 76 },
          ],
        },
      ],
    },
  },
  {
    eyebrow: 'Timeline',
    summary: 'Catalyst paths, milestones, migrations, or release sequences.',
    block: {
      type: 'timeline',
      title: 'Demo Path',
      events: [
        { date: 'Step 1', label: 'Create route', text: 'Expose the pattern library at a simple URL.' },
        { date: 'Step 2', label: 'Reuse renderer', text: 'Render the same blocks used by production articles.' },
        { date: 'Step 3', label: 'Validate', text: 'Build the site to catch rendering and typing issues.' },
      ],
    },
  },
  {
    eyebrow: 'Stack Diagram',
    summary: 'Layered architecture or market-structure explanations.',
    block: {
      type: 'stack-diagram',
      title: 'Research Experience Stack',
      layers: [
        { label: 'Reader UI', text: 'Pages, cards, and article surfaces.' },
        { label: 'Visual Blocks', text: 'Reusable primitives that encode analysis.' },
        { label: 'Content Model', text: 'Typed research blocks and markdown source.' },
        { label: 'Validation', text: 'Data checks, tests, and static build.' },
      ],
    },
  },
  {
    eyebrow: 'Callout',
    summary: 'A focused warning, risk, insight, or note inside a longer read.',
    block: {
      type: 'callout',
      variant: 'insight',
      label: 'Design Principle',
      text: 'Every visual should answer one reader question. If it does not, plain prose is probably better.',
    },
  },
  {
    eyebrow: 'Verdict',
    summary: 'A strong final synthesis for investment or product conclusions.',
    block: {
      type: 'verdict',
      label: 'Bottom Line',
      text: 'The visual system is strongest when it behaves like research infrastructure: consistent, compact, and easy to verify.',
    },
  },
]

export default function VisualDemoPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '3.5rem 1.5rem 4.5rem' }}>
      <Link
        href="/"
        style={{
          color: '#73695f',
          textDecoration: 'none',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '1.25rem',
        }}
      >
        {'<- Home'}
      </Link>

      <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #ded6ca', paddingBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.28rem 0.7rem',
          background: '#f0f5f3',
          borderRadius: 20,
          fontSize: '0.7rem',
          color: '#3d6b5e',
          fontFamily: 'Helvetica Neue, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          Visual System
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.15rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.08 }}>
          G Research House Visual Demo
        </h1>
        <p style={{ margin: '1rem 0 0', maxWidth: 760, color: '#4f473f', lineHeight: 1.75, fontFamily: 'Helvetica Neue, sans-serif', fontSize: '1.06rem' }}>
          A live pattern library for the structured visual blocks used across research articles. Each example below is rendered through the same production article component.
        </p>
      </header>

      <section style={{ display: 'grid', gap: '1.25rem' }}>
        {demoBlocks.map(({ eyebrow, summary, block }) => (
          <article
            key={eyebrow}
            className="visualDemoCard"
            style={{
              display: 'grid',
              gap: '1rem',
              padding: '1rem',
              border: '1px solid #ded6ca',
              borderRadius: 8,
              background: '#fffdfa',
            }}
          >
            <div style={{ fontFamily: 'Helvetica Neue, sans-serif', color: '#5b534b' }}>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8278', marginBottom: '0.35rem' }}>
                {eyebrow}
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.9rem' }}>{summary}</p>
            </div>
            <div style={{ minWidth: 0 }}>
              <ArticleBlock block={block} section="financial-research" />
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
