#!/usr/bin/env python3
"""
Wraps morning brief text into self-contained HTML.
Run after the brief is generated: generate_brief_html.py --input brief.txt --output public/brief.html

INPUT FORMAT CONTRACT:
  Section headers are plain uppercase lines (no markdown):
    OVERNIGHT MAP, US CLOSE MOVERS, HK LIVE MOVERS, MARKET NEWS, ACTION BOARD
  NOT **bold markdown** or any other format.

OUTPUT FORMAT CONTRACT:
  Section titles are <h2> tags (matching the React parser regex in page.tsx):
    /<(?:h2|strong)[^>]*>(.*?)<\/(?:h2|strong)>/gi
  If you change the output tag, update app/page.tsx parser to match.

VERIFICATION:
  After running, confirm: grep -c "<section>" output.html  # should be 5
"""
import argparse
import sys
import re
from datetime import datetime

def wrap_html(date_str: str, sections: list) -> str:
    """Build the HTML page."""
    sections_html = ""
    for title, content in sections:
        # Escape HTML entities in content
        content_escaped = (
            content
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
        )
        sections_html += f"""
      <section>
        <h2>{title}</h2>
        <div class="body">{content_escaped}</div>
      </section>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Morning Brief — {date_str}</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: Georgia, 'Times New Roman', serif;
      background: #fafaf8;
      color: #222;
      -webkit-font-smoothing: antialiased;
    }}
    main {{
      max-width: 680px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }}
    header {{
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e5e5;
    }}
    .eyebrow {{
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #c0c0b8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin-bottom: 0.35rem;
    }}
    h1 {{
      font-size: 1.4rem;
      font-weight: 400;
      color: #111;
    }}
    section {{
      margin-bottom: 2rem;
    }}
    .label {{
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #999;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin-bottom: 0.5rem;
    }}
    .body {{
      font-size: 1rem;
      line-height: 1.75;
      color: #333;
      white-space: pre-wrap;
    }}
    footer {{
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e5e5;
      font-size: 0.72rem;
      color: #ccc;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }}
    @media (max-width: 480px) {{
      main {{ padding: 2rem 1rem; }}
    }}
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">Market Briefing</div>
      <h1>{date_str}</h1>
    </header>
    {sections_html}
    <footer>Auto-generated · Not financial advice</footer>
  </main>
</body>
</html>"""

def parse_plain_brief(text: str) -> tuple[str, list]:
    """
    Parse the plain-text brief into (date_str, [(title, content), ...]).

    Section headers: lines matching the known canonical section titles.
    Content is everything between this header and the next.
    """
    known_sections = [
        # Weekday headers
        "OVERNIGHT MAP",
        "US CLOSE MOVERS",
        "HK LIVE MOVERS",
        "MARKET NEWS",
        "ACTION BOARD",
        # Sunday headers
        "WEEKEND MAP",
        "CRYPTO / 24-7 MARKETS",
        "WHAT MATTERS THIS WEEK",
        "WATCHLIST SETUP",
    ]

    lines = text.strip().split('\n')
    date_str = datetime.now().strftime("%B %d, %Y")

    # Extract date from first line if present
    if lines:
        header_match = re.search(r'\w+\s+\d{1,2},\s+\d{4}', lines[0])
        if header_match:
            date_str = header_match.group()

    # Find all header positions
    header_positions = []
    for i, line in enumerate(lines):
        if line.strip() in known_sections:
            header_positions.append((i, line.strip()))

    # Extract content between headers
    sections = []
    for idx, (pos, title) in enumerate(header_positions):
        next_pos = header_positions[idx + 1][0] if idx + 1 < len(header_positions) else len(lines)
        content_lines = lines[pos + 1:next_pos]
        sections.append((title, '\n'.join(content_lines).strip()))

    return date_str, sections


def main():
    parser = argparse.ArgumentParser(description='Wrap brief text in HTML')
    parser.add_argument('--input', '-i', help='Input text file (default: stdin)')
    parser.add_argument('--output', '-o', required=True, help='Output HTML file')
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            text = f.read()
    else:
        text = sys.stdin.read()

    date_str, sections = parse_plain_brief(text)
    html = wrap_html(date_str, sections)

    with open(args.output, 'w') as f:
        f.write(html)
    print(f"Written: {args.output}")

if __name__ == '__main__':
    main()
