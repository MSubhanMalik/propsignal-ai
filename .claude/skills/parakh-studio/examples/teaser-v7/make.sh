#!/usr/bin/env bash
# Rebuild "Parakh · Coming soon" v7 from the files in this folder.
#   ./make.sh            render with the prepared clips in film/img/
#   ./make.sh --clips    first re-cut the clips from source-footage/ (same cuts as the original)
set -euo pipefail
cd "$(dirname "$0")"; SK=../../scripts; mkdir -p out
if [ "${1:-}" = "--clips" ]; then
  $SK/prepare-clip.sh source-footage/market-street-pexels-15879891.mp4 1.5  3.4 film/img/v-crowd.webm 24
  $SK/prepare-clip.sh source-footage/market-street-pexels-15879891.mp4 36.8 3.4 film/img/v-man.webm 24
  $SK/prepare-clip.sh source-footage/badshahi-aerial-pexels-9003971.mp4 1.0 5.6 film/img/v-lahore.webm 30
  # street ambience = 6.4s from 1.5s of the market clip, faded (v7 used this longer cut)
  ffmpeg -loglevel error -y -ss 1.5 -t 6.4 -i source-footage/market-street-pexels-15879891.mp4 -vn -ac 2 -ar 44100 \
    -af "afade=t=in:d=0.3,afade=t=out:st=4.4:d=1.9" audio/street.wav
fi
python3 $SK/music.py audio/cues.json out/music.wav                 # identical to audio/music.wav (seeded)
$SK/render.sh film/film.html out/silent.mp4 --poster 12.9
$SK/mix.sh out/silent.mp4 out/music.wav out/Parakh-Coming-Soon-v7.mp4 --street audio/street.wav --voice audio/jald-urdu.wav@34.0
echo "done → out/Parakh-Coming-Soon-v7.mp4 (reference: final/Parakh-Coming-Soon-v7.mp4)"
