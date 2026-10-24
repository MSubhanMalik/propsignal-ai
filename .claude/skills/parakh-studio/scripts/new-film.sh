#!/usr/bin/env bash
# Create a working folder for a new Parakh film from the template.
#   scripts/new-film.sh <work-dir> [template]   (template defaults to templates/teaser-16x9.html)
set -euo pipefail
K="$(cd "$(dirname "$0")/.." && pwd)"
W="${1:?usage: new-film.sh <work-dir> [template]}"; TPL="${2:-$K/templates/teaser-16x9.html}"
mkdir -p "$W/img"
cp "$K/assets/film/film.js" "$K/assets/film/film.css" "$W/"
cp "$TPL" "$W/film.html"
cp "$K"/assets/img/*.jpg "$W/img/"
echo "Ready: $W/film.html  (add footage with scripts/prepare-clip.sh into $W/img/)"
