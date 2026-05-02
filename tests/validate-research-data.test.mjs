import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const workdir = path.resolve(import.meta.dirname, '..')

test('research data validates cleanly', () => {
  const output = execFileSync('node', ['scripts/validate-research-data.mjs'], {
    cwd: workdir,
    encoding: 'utf8',
  })

  assert.match(output, /validated \d+ notes and \d+ articles/)
})
