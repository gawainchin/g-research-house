#!/usr/bin/env python3
"""Repair YAML blocks in .md files: join folded multi-line strings and re-emit with | literal scalars."""
import yaml, os, re, subprocess

def format_block_lines(block):
    """Serialize a block dict to YAML with | literal scalars for multi-line strings."""
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
                lines.append(f'{key}: {val}')
        elif isinstance(val, list):
            lines.append(f'{key}:')
            for item in val:
                if isinstance(item, str):
                    if '\n' in item:
                        lines.append(f'  - |')
                        for ln in item.split('\n'):
                            lines.append(f'    {ln}')
                    else:
                        lines.append(f'  - {item}')
                elif isinstance(item, dict):
                    for dk, dv in item.items():
                        if isinstance(dv, str) and '\n' in dv:
                            lines.append(f'  - {dk}: |')
                            for ln in dv.split('\n'):
                                lines.append(f'    {ln}')
                        else:
                            lines.append(f'  - {dk}: {dv}')
                else:
                    lines.append(f'  - {item}')
        elif isinstance(val, dict):
            lines.append(f'{key}:')
            for dk, dv in val.items():
                if isinstance(dv, str) and '\n' in dv:
                    lines.append(f'  {dk}: |')
                    for ln in dv.split('\n'):
                        lines.append(f'    {ln}')
                else:
                    lines.append(f'  {dk}: {dv}')
        else:
            lines.append(f'{key}: {val}')
    return '\n'.join(lines)


def smart_join(lines):
    """Reassemble YAML folded multi-line strings into single values."""
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if stripped.startswith('- '):
            item_content = stripped[2:]
            j = i + 1
            while j < len(lines):
                next_line = lines[j]
                next_stripped = next_line.strip()
                if next_line.startswith('  ') and next_stripped:
                    # Continuation
                    sep = ' ' if item_content and item_content[-1].isalnum() else ''
                    item_content += sep + next_stripped
                    j += 1
                else:
                    break
            result.append(('- ' + item_content) if item_content else stripped)
            i = j
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
        lines = smart_join(lines)
        dedented = [ln[2:] if ln.startswith('  ') else ln for ln in lines]
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

# Validate
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
