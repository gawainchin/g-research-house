#!/bin/bash
# Pushes the latest brief HTML to GitHub → triggers Vercel redeploy.
# Run after generate_brief_html.py has updated public/brief.html

set -e

REPO_DIR="$HOME/Projects/g-research-house"
TODAY=$(date +"%B %d, %Y")
BRANCH=$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)

if [ ! -f "$REPO_DIR/public/brief.html" ]; then
    echo "ERROR: $REPO_DIR/public/brief.html not found — run generate_brief_html.py first"
    exit 1
fi

cd "$REPO_DIR"
git add public/brief.html
git commit -m "Brief update — $TODAY"
git push origin "$BRANCH"

echo "Pushed → Vercel will redeploy shortly."
