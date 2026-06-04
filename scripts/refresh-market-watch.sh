#!/bin/bash
# Refreshes the static market-watch snapshot and verifies the site data/build.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

python3 scripts/update-market-data.py
npm run validate:data
npm run build

echo "Market watch refreshed and build verified."
