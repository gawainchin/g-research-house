#!/usr/bin/env python3
"""Repair YAML blocks in .md files: fix nested YAML with orphaned dict keys.

The original blocks use nested YAML with 2-space indent for dict values inside
lists. research.ts strips exactly 2 leading spaces, which orphans the note:/
value: lines. This script parses the original nested YAML correctly and re-emits
using inline dict syntax (no nested indent) so it survives the 2-space dedent.
"""
import yaml, os, re, subprocess


def _quote_val(val):
    """Return a properly quoted YAML string value."""
    if not val:
        return '""'
    needs_quotes = (
        '\n' in val or
        any(c in val for c in ':{}[]&*#?|-<>=!%@`\'"') or
        re.search(r'\w:', val) or  # word char + colon
        (val[0] == ' ' or val[-1] == ' ')
    )
    if not needs_quotes:
        return val
    inner = val.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return f'"{inner}"'


def format_block_lines(block):
    """Serialize a block dict to YAML. List-of-dicts use inline {} syntax."""
    lines = []
    for key, val in block.items():
        if val is None:
            lines.append(f'{key}:')
        elif isinstance(val, str):
            if '\n' in val:
                lines.append(f'{key}: |')
                for ln in val.split('\n'):
                    lines.append(f'  {ln}')
            else:
                quoted = _quote_val(val)
                lines.append(f'{key}: {quoted}')
        elif isinstance(val, list):
            lines.append(f'{key}:')
            for item in val:
                if isinstance(item, str):
                    lines.append(f'  - {item}')
                elif isinstance(item, dict):
                    parts = [f'{dk}: {_quote_val(dv)}' for dk, dv in item.items()]
                    lines.append(f'  - {{{", ".join(part for part in parts)}}}')
                else:
                    lines.append(f'  - {item}')
        elif isinstance(val, dict):
            lines.append(f'{key}:')
            for dk, dv in val.items():
                quoted = _quote_val(dv)
                lines.append(f'  {dk}: {quoted}')
        else:
            lines.append(f'{key}: {val}')
    return '\n'.join(lines)


def _build_inline_dict(label, orphans):
    """Build an inline dict string: {label: "...", note: "...", value: "..."}"""
    parts = [f'label: {_quote_val(label)}']
    for ok, ov in orphans:
        parts.append(f'{ok}: {_quote_val(ov)}')
    return '{' + ', '.join(parts) + '}'


def yaml_join(lines):
    """Parse dedented YAML list+dict content.

    Original format has orphaned dict keys (note:, value:) with no indent after
    2-space dedent. These look like top-level keys to the YAML parser.
    We detect them and merge them into their parent list item as inline dicts.
    """
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith('- '):
            # Start of a list item
            item_label = stripped[2:]
            orphans = []
            last_item_has_pipe = '|' in item_label

            # Collect orphaned continuation lines (no leading spaces, no dash)
            j = i + 1
            while j < len(lines):
                next_line = lines[j]
                next_stripped = next_line.strip()
                if not next_stripped:
                    # Empty line — stop
                    break
                if (next_stripped and ':' in next_stripped
                        and not next_line.startswith(' ')
                        and not next_stripped.startswith('-')):
                    # Orphaned key:value
                    key = next_stripped.split(':', 1)[0].strip()
                    val = next_stripped.split(':', 1)[1].strip()
                    orphans.append((key, val))
                    j += 1
                elif not next_line.startswith(' ') and next_stripped:
                    # Bare continuation line (no leading spaces)
                    # Stop absorbing if: prev item had | (pipe), starts with
                    # shell metachar, or contains # (comment marker embedded)
                    if last_item_has_pipe:
                        break
                    if next_stripped.startswith(('#', '$', '-', '|', '+', '!')):
                        break
                    if '#' in item_label or '#' in next_stripped:
                        break
                    # Absorb as continuation
                    sep = ' ' if item_label and item_label[-1].isalnum() else ''
                    item_label += sep + next_stripped
                    j += 1
                else:
                    break

            if orphans:
                result.append('  - ' + _build_inline_dict(item_label, orphans))
            else:
                result.append(f'  - {item_label}')
            i = j
        elif stripped.startswith('-'):
            # Continuation of previous list item (indented -)
            result.append(line)
            i += 1
        elif stripped and ':' in stripped and not stripped.startswith('-'):
            # Orphaned key at top level — merge into last list item
            key = stripped.split(':', 1)[0].strip()
            val = stripped.split(':', 1)[1].strip()
            last = result[-1] if result else ''
            if last.startswith('  - '):
                old_val = last[4:]
                if last.startswith('  - {') or last.startswith('  - "'):
                    result.append(line)
                else:
                    orphans = [(key, val)]
                    result[-1] = '  - ' + _build_inline_dict(old_val, orphans)
            else:
                result.append(line)
            i += 1
        elif ':' in stripped or not stripped:
            result.append(line)
            i += 1
        elif not line.startswith(' ') and result:
            last = result.pop()
            sep = ' ' if last and last[-1].isalnum() else ''
            result.append(last + sep + stripped)
            i += 1
        else:
            result.append(line)
            i += 1
    return result


BLOCK_RE = re.compile(r'\n:::([a-z\-]+)\n([\s\S]*?)\n:::', re.MULTILINE)
ARTICLES_DIR = '/Users/openclaw/Projects/g-research-house/data/articles/'

fixed = 0
for fname in sorted(os.listdir(ARTICLES_DIR)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(ARTICLES_DIR, fname)
    with open(fpath) as f:
        content = f.read()

    def rep(m):
        block_type = m.group(1).strip()
        raw = m.group(2).rstrip()
        if not raw.strip():
            return f'\n:::{block_type}\n:::'
        lines = raw.split('\n')
        dedented = [ln[2:] if ln.startswith('  ') else ln for ln in lines]
        reassembled = yaml_join(dedented)
        try:
            fields = yaml.safe_load('\n'.join(reassembled)) or {}
        except:
            try:
                fields = yaml.safe_load('\n'.join(dedented)) or {}
            except:
                return m.group(0)
        if isinstance(fields, str):
            fields = {'text': fields}
        elif fields is None:
            fields = {}
        block_lines = format_block_lines(fields)
        return f'\n:::{block_type}\n{block_lines}\n:::'

    new_content = BLOCK_RE.sub(rep, content)
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)
        print(f"Fixed: {fname}")
        fixed += 1

print(f"\nTotal fixed: {fixed}")

r = subprocess.run(
    ['node', '/Users/openclaw/Projects/g-research-house/scripts/validate-research-data.mjs'],
    capture_output=True, text=True,
    cwd='/Users/openclaw/Projects/g-research-house'
)
print(f"\nValidate: exit={r.returncode}")
if r.stdout: print(r.stdout[:500])
if r.stderr:
    err = r.stderr[:600]
    if r.returncode != 0:
        print(err)
