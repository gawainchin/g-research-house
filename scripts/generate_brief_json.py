#!/usr/bin/env python3
"""
Converts morning brief text to JSON.
Run: generate_brief_json.py --input brief.txt --output public/brief.json

Section headers (plain uppercase):
  OVERNIGHT MAP, US CLOSE MOVERS, HK LIVE MOVERS, MARKET NEWS, ACTION BOARD
"""
import argparse
import json
import re
from datetime import datetime

def parse_brief(text: str) -> tuple[str, list]:
    known_sections = [
        "OVERNIGHT MAP",
        "US CLOSE MOVERS",
        "HK LIVE MOVERS",
        "MARKET NEWS",
        "ACTION BOARD",
    ]
    lines = text.strip().split('\n')
    date_str = datetime.now().strftime("%B %d, %Y")

    if lines:
        m = re.search(r'\w+\s+\d{1,2},\s+\d{4}', lines[0])
        if m:
            date_str = m.group()

    header_positions = [(i, ln.strip()) for i, ln in enumerate(lines) if ln.strip() in known_sections]

    sections = []
    for idx, (pos, title) in enumerate(header_positions):
        next_pos = header_positions[idx + 1][0] if idx + 1 < len(header_positions) else len(lines)
        content = '\n'.join(lines[pos + 1:next_pos]).strip()
        sections.append({"title": title, "content": content})

    return date_str, sections

def main():
    parser = argparse.ArgumentParser(description='Convert brief text to JSON')
    parser.add_argument('--input', '-i', help='Input text file (default: stdin)')
    parser.add_argument('--output', '-o', required=True, help='Output JSON file')
    args = parser.parse_args()

    text = open(args.input).read() if args.input else sys.stdin.read()
    date_str, sections = parse_brief(text)
    json.dump({"date": date_str, "sections": sections}, open(args.output, 'w'), indent=2)
    print(f"Written: {args.output} ({len(sections)} sections)")

if __name__ == '__main__':
    import sys
    main()
