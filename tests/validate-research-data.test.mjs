import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseInlineBlocks } from '../lib/inline-blocks.mjs'
import { validateResearchData } from '../scripts/validate-research-data.mjs'
import { isMarketWatchStale } from '../lib/market-watch-utils.mjs'

const workdir = path.resolve(import.meta.dirname, '..')

function copyFixtureRoot() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grh-validate-'))
  fs.cpSync(path.join(workdir, 'data'), path.join(tmp, 'data'), { recursive: true })
  return tmp
}

test('research data validates cleanly', () => {
  const output = execFileSync('node', ['scripts/validate-research-data.mjs'], {
    cwd: workdir,
    encoding: 'utf8',
  })

  assert.match(output, /validated \d+ articles/)
})

test('parses matching triple-colon content blocks', () => {
  const blocks = parseInlineBlocks(':::paragraph\ntext: Hello\n:::')

  assert.deepEqual(blocks, [{ type: 'paragraph', text: 'Hello' }])
})

test('market watch stale helper flags snapshots older than threshold', () => {
  const now = new Date('2026-06-04T12:00:00.000Z')

  assert.equal(isMarketWatchStale('2026-06-03T10:59:59.000Z', now), true)
  assert.equal(isMarketWatchStale('2026-06-03T12:30:00.000Z', now), false)
  assert.equal(isMarketWatchStale('not-a-date', now), true)
})

test('market watch validation rejects successful rows without numeric prices', () => {
  const tmp = copyFixtureRoot()
  const marketWatchPath = path.join(tmp, 'data', 'market-watch.json')
  const marketWatch = JSON.parse(fs.readFileSync(marketWatchPath, 'utf8'))
  marketWatch.tickers[0].dataOk = true
  marketWatch.tickers[0].price = null
  fs.writeFileSync(marketWatchPath, JSON.stringify(marketWatch, null, 2))

  assert.throws(
    () => validateResearchData(tmp),
    /successful market ticker .* numeric price/
  )
})

test('market watchlist config symbols match generated market snapshot symbols', () => {
  const watchlist = JSON.parse(fs.readFileSync(path.join(workdir, 'data', 'market-watchlist.json'), 'utf8'))
  const snapshot = JSON.parse(fs.readFileSync(path.join(workdir, 'data', 'market-watch.json'), 'utf8'))

  assert.deepEqual(
    snapshot.tickers.map((ticker) => ticker.symbol),
    watchlist.tickers.map((ticker) => ticker.symbol)
  )
})

test('parses matching four-colon content blocks', () => {
  const blocks = parseInlineBlocks('::::heading\ntext: Four-colon heading\n::::')

  assert.deepEqual(blocks, [{ type: 'heading', text: 'Four-colon heading' }])
})

test('rejects mismatched content block fences in strict mode', () => {
  assert.throws(
    () => parseInlineBlocks('::::paragraph\ntext: Broken fence\n:::', { strict: true }),
    /malformed or mismatched content block fence/
  )
})

test('preserves literal triple-colon text inside quoted block content', () => {
  const blocks = parseInlineBlocks('::::paragraph\ntext: "Example marker: ::: stays visible"\n::::')

  assert.deepEqual(blocks, [{ type: 'paragraph', text: 'Example marker: ::: stays visible' }])
})

test('parses visual research block shapes', () => {
  const blocks = parseInlineBlocks(`:::scorecard
title: Company Quality Snapshot
criteria:
  - label: Quality
    score: 5
    note: "Best-in-class margin."
:::

:::bar-chart
title: Revenue Growth Comparison
unit: "%"
bars:
  - label: PLTR
    value: 70
:::

:::line-chart
title: Revenue Growth Trend
unit: "$M"
series:
  - label: PLTR
    points:
      - {label: Q1, value: 70}
      - {label: Q2, value: 90}
:::

:::timeline
title: Catalyst Path
events:
  - label: Earnings
    date: Q2 2026
    text: "Watch commercial durability."
:::

:::stack-diagram
title: Agentic AI Stack
layers:
  - label: App Layer
    text: "User-facing workflow surfaces."
:::`)

  assert.equal(blocks.length, 5)
  assert.equal(blocks[0].type, 'scorecard')
  assert.deepEqual(blocks[0].criteria, [{ label: 'Quality', score: 5, note: 'Best-in-class margin.' }])
  assert.equal(blocks[1].type, 'bar-chart')
  assert.deepEqual(blocks[1].bars, [{ label: 'PLTR', value: 70 }])
  assert.equal(blocks[2].type, 'line-chart')
  assert.deepEqual(blocks[2].series, [{ label: 'PLTR', points: [{ label: 'Q1', value: 70 }, { label: 'Q2', value: 90 }] }])
  assert.equal(blocks[3].type, 'timeline')
  assert.deepEqual(blocks[3].events, [{ label: 'Earnings', date: 'Q2 2026', text: 'Watch commercial durability.' }])
  assert.equal(blocks[4].type, 'stack-diagram')
  assert.deepEqual(blocks[4].layers, [{ label: 'App Layer', text: 'User-facing workflow surfaces.' }])
})
