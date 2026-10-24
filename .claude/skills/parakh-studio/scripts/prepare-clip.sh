#!/usr/bin/env bash
# Cut a clip and convert it to an all-keyframe VP9 WebM that seeks frame-exactly in Chromium
# (Playwright's Chromium cannot decode H.264, and the renderer seeks every frame).
#   scripts/prepare-clip.sh <source.mp4> <start-seconds> <duration-seconds> <out.webm> [crf=24]
# Optional audio: also writes <out>.wav with the clip's sound (fade in 0.3s, fade out last 1.5s).
set -euo pipefail
SRC="$1"; SS="$2"; T="$3"; OUT="$4"; CRF="${5:-24}"
ffmpeg -loglevel error -y -ss "$SS" -t "$T" -i "$SRC" -an -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libvpx-vp9 -b:v 0 -crf "$CRF" -g 1 -deadline good -cpu-used 4 -row-mt 1 "$OUT"
if ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "$SRC" | grep -q .; then
  FO=$(python3 -c "print(max(0.0,$T-1.5))")
  ffmpeg -loglevel error -y -ss "$SS" -t "$T" -i "$SRC" -vn -ac 2 -ar 44100 -af "afade=t=in:d=0.3,afade=t=out:st=$FO:d=1.5" "${OUT%.webm}.wav"
fi
echo "wrote $OUT"
