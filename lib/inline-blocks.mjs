import yaml from 'js-yaml'

const BLOCK_RE = /^(:{3,})([a-z-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm
const STRAY_FENCE_RE = /^:{3,}(?:[a-z-]+)?[ \t]*$/m

function escapeDelimitersOutsideQuotes(content) {
  let result = ''
  let i = 0
  let inDoubleQuote = false
  let escapeNext = false

  while (i < content.length) {
    const ch = content[i]

    if (escapeNext) {
      result += ch
      escapeNext = false
      i++
      continue
    }

    if (ch === '\\') {
      result += ch
      const next = content[i + 1]
      if (next === '"' || next === '\\' || next === 'n' || next === 't' ||
          next === 'r' || next === 'b' || next === 'f' ||
          (next === 'x' && /^[0-9a-fA-F]{2}$/.test(content.slice(i + 2, i + 4)))) {
        escapeNext = true
      }
      i++
      continue
    }

    if (ch === '"') {
      let count = 0
      let j = i - 1
      while (j >= 0 && content[j] === '\\') { count++; j-- }
      if (count % 2 === 0) {
        inDoubleQuote = !inDoubleQuote
      }
    }

    if (!inDoubleQuote && content.slice(i, i + 3) === ':::') {
      const following = content[i + 3]
      if (following !== ':' && following !== '{' && following !== '[' && following !== ' ' && following !== '-' && following !== '#') {
        result += '\\x3a\\x3a\\x3a'
        i += 3
        continue
      }
    }

    result += ch
    i++
  }

  return result
}

function protectBlockContent(content) {
  let result = ''
  let i = 0
  let inDoubleQuote = false
  let escapeNext = false

  while (i < content.length) {
    const ch = content[i]

    if (escapeNext) {
      result += ch
      escapeNext = false
      i++
      continue
    }

    if (ch === '\\') {
      result += ch
      const next = content[i + 1]
      if (next === '"' || next === '\\' || next === 'n' || next === 't' ||
          next === 'r' || next === 'b' || next === 'f' ||
          (next === 'x' && /^[0-9a-fA-F]{2}$/.test(content.slice(i + 2, i + 4)))) {
        escapeNext = true
      }
      i++
      continue
    }

    if (ch === '"') {
      let count = 0
      let j = i - 1
      while (j >= 0 && content[j] === '\\') { count++; j-- }
      if (count % 2 === 0) {
        inDoubleQuote = !inDoubleQuote
      }
    }

    if (inDoubleQuote && content.slice(i, i + 3) === ':::') {
      result += '__TC__'
      i += 3
      continue
    }

    result += ch
    i++
  }

  return result
}

function restoreBlockContentInFields(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === 'string') {
      out[k] = v.replace(/__TC__/g, ':::')
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) => typeof item === 'string' ? item.replace(/__TC__/g, ':::') : item)
    } else {
      out[k] = v
    }
  }
  return out
}

/**
 * Parse custom triple-colon/four-colon inline blocks from article markdown.
 * Returns a plain array of block objects so both app runtime and validation
 * scripts share exactly the same parsing behavior.
 */
export function parseInlineBlocks(body, { strict = false } = {}) {
  const blocks = []
  let lastIndex = 0
  let match
  BLOCK_RE.lastIndex = 0

  while ((match = BLOCK_RE.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const plain = body.slice(lastIndex, match.index).trim()
      if (plain) {
        if (strict && STRAY_FENCE_RE.test(plain)) {
          throw new Error(`malformed or mismatched content block fence near: ${plain.split('\n').find((line) => line.trim().startsWith(':::'))}`)
        }
        blocks.push({ type: 'paragraph', text: plain })
      }
    }

    const blockType = match[2].trim()
    const raw = match[3].trimEnd()
    if (strict && STRAY_FENCE_RE.test(raw)) {
      throw new Error(`malformed or mismatched content block fence inside ${blockType}`)
    }
    if (!raw.trim()) {
      blocks.push({ type: blockType })
      lastIndex = BLOCK_RE.lastIndex
      continue
    }

    let fields
    const safeForYaml = protectBlockContent(escapeDelimitersOutsideQuotes(raw))
    try {
      fields = JSON.parse(raw)
    } catch {
      try {
        fields = yaml.load(safeForYaml)
      } catch {
        fields = { text: raw }
      }
    }

    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      blocks.push({ type: blockType, ...restoreBlockContentInFields(fields) })
    } else {
      blocks.push({ type: blockType, text: String(fields) })
    }
    lastIndex = BLOCK_RE.lastIndex
  }

  if (lastIndex < body.length) {
    const tail = body.slice(lastIndex).trim()
    if (tail) {
      if (strict && STRAY_FENCE_RE.test(tail)) {
        throw new Error(`malformed or mismatched content block fence near: ${tail.split('\n').find((line) => line.trim().startsWith(':::'))}`)
      }
      blocks.push({ type: 'paragraph', text: tail })
    }
  }

  return blocks
}
