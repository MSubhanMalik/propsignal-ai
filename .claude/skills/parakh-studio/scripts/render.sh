#!/usr/bin/env bash
# Render a film to MP4 (silent), or stills for review.
#   scripts/render.sh <film.html> <out.mp4>            full render, 30fps, 1080p
#   scripts/render.sh <film.html> --stills 1,4.5,9     PNG stills into <film>-stills/
set -euo pipefail
K="$(cd "$(dirname "$0")" && pwd)"
[ -d "$K/node_modules/playwright-core" ] || (cd "$K" && npm install --silent)
if [ -z "${CHROME_PATH:-}" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux64/chrome /opt/pw-browsers/chromium-*/chrome-linux/chrome ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome; do [ -x "$c" ] && export CHROME_PATH="$c" && break; done
fi
FILM="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; shift
if [ "${1:-}" = "--stills" ]; then node "$K/render.mjs" "$FILM" --stills "$2"
else node "$K/render.mjs" "$FILM" --out "$(realpath -m "$1")" "${@:2}"; fi
