# Parakh · Blue reveal (from teaser v7, 23.4–28.8s)

5.4s · 1920×1080 · 30fps. Cobalt gradient + two faint rings scale in → **Parakh** blurs in with
"/pə·rəkh/ · to examine, to test the worth of" → both blur out at 1.85s → **پرکھ** + "پرکھنا · کسی چیز کی اصل قدر جانچنا"
blur in at 2.05–2.35s → hold. Sound: impact hit + warm Bb–F–C chords (v7 score), 0.8s fade-out.

| File | What it is |
|---|---|
| `Parakh-Blue-Reveal-16x9.mp4` | the finished clip |
| `source/film.html` | the scene (all timings live here; edit text/colours/timing here) |
| `source/film.js`, `source/film.css` | animation runtime (seekable timeline) + base styles |
| `source/fonts/` | Plus Jakarta Sans + Noto Nastaliq Urdu, local woff2 copies (SIL Open Font License) |
| `source/music-cut.wav` | the exact audio in the clip |
| `tools/render.mjs`, `tools/package.json` | frame-by-frame renderer (Playwright + ffmpeg) |
| `tools/music.py`, `tools/cues-v7.json` | the music generator and v7 cue sheet (regenerates the score) |
| `make.sh` | one command to rebuild (`./make.sh --music` also regenerates the audio) |

Preview live: open `source/film.html` in Chrome (space = pause, R = restart).
Brand colours: cobalt gradient `#112C66 → #1D4A9E → #2B5FC0`, white text. Full brand rules: the parakh-studio skill.
