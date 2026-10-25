#!/usr/bin/env bash
# Rebuild Parakh-Unapproved-Words-16x9.mp4 from this folder only (no internet needed after `npm install`).
# Needs: Node 18+, ffmpeg (libx264 + aac), Chromium/Chrome (auto-found, or set CHROME_PATH), Python 3 + numpy + scipy (only for --music).
#   ./make.sh           render + use source/music-cut.wav
#   ./make.sh --music   also regenerate the music (v5 score, cut from 5.9s)
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p out
[ -d tools/node_modules/playwright-core ] || (cd tools && npm install --silent)
if [ -z "${CHROME_PATH:-}" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux64/chrome /opt/pw-browsers/chromium-*/chrome-linux/chrome \
           ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           /usr/bin/google-chrome /usr/bin/chromium; do [ -x "$c" ] && export CHROME_PATH="$c" && break; done
fi
MUSIC=source/music-cut.wav
if [ "${1:-}" = "--music" ]; then
  python3 tools/music.py tools/cues-v5.json out/music-v5.wav
  ffmpeg -loglevel error -y -ss 3.2 -t 8.5 -i out/music-v5.wav -af "afade=t=in:d=0.4,afade=t=out:st=7.7:d=0.8,loudnorm=I=-15:TP=-1.5:LRA=11" -ar 44100 out/music-cut.wav
  MUSIC=out/music-cut.wav
fi
node tools/render.mjs source/film.html --out "$PWD/out/silent.mp4" --poster 6.0
ffmpeg -loglevel error -y -i out/silent.mp4 -i "$MUSIC" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/Parakh-Unapproved-Words-16x9.mp4
echo "done → out/Parakh-Unapproved-Words-16x9.mp4"
