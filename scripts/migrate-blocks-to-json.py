#!/usr/bin/env python3
"""Migrate inline ::: blocks from YAML to JSON syntax.

YAML format (OLD):
  :::bullets
    items:
      - label: foo
        note: bar
        value: baz
  :::

JSON format (NEW):
  :::bullets
  {
    "items": [
      {"label": "foo", "note": "bar", "value": "baz"}
    ]
  }
  :::
"""
import json, os, re

ARTICLES_DIR = '/Users/openclaw/Projects/g-research-house/data/articles/'
BLOCK_RE = re.compile(r'\n:::([a-z-]+)\n([\s\S]*?)\n:::', re.MULTILINE)


def indent(text, spaces=2):
    return '\n'.join(' ' * spaces + ln for ln in text.split('\n'))


def yaml_to_json(yaml_text):
    """Parse YAML block content and re-emit as pretty JSON."""
    import yaml as yl
    # Strip 2-space indent that research.ts adds
    lines = yaml_text.split('\n')
    dedented = [ln[2:] if ln.startswith('  ') else ln for ln in lines]
    try:
        data = yl.safe_load('\n'.join(dedented))
    except Exception:
        data = {'text': yaml_text}

    if data is None:
        return '{}'
    if isinstance(data, str):
        return json.dumps({'text': data}, indent=2)
    return json.dumps(data, indent=2, ensure_ascii=False)


def migrate_block(m):
    block_type = m.group(1).strip()
    raw = m.group(2).rstrip()
    if not raw.strip():
        return f'\n:::{block_type}\n:::'

    json_body = yaml_to_json(raw)
    return f'\n:::{block_type}\n{json_body}\n:::'


fixed = 0
skipped = 0
for fname in sorted(os.listdir(ARTICLES_DIR)):
    if not fname.endswith('.md'):
        continue
    fpath = os.path.join(ARTICLES_DIR, fname)
    with open(fpath) as f:
        content = f.read()

    new_content = BLOCK_RE.sub(migrate_block, content)
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)
        print(f"Migrated: {fname}")
        fixed += 1
    else:
        skipped += 1

print(f"\nMigrated {fixed} files, skipped {skipped} (no YAML blocks found)")
