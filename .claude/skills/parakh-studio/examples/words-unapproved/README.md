# Parakh · "Unapproved. Unsanctioned. Undelivered." (from teaser v5, 5.9–11.1s)

5.8s · 1920×1080 · 30fps · black background. "SOME ARE" (letter-spacing tracks in) → **Unapproved.** (coral, blurs in
at 0.15s) → swaps in place to **Unsanctioned.** (amber, 1.8s) → **Undelivered.** (pale grey, 3.4s) → "Even legal projects
can take decades to hand over." (4.0s). A low boom lands on each word (v5 score).

| File | What it is |
|---|---|
| `Parakh-Unapproved-Words-16x9.mp4` | the finished clip |
| `source/film.html` | the scene (all words, colours and timings) |
| `source/film.js`, `source/film.css` | animation runtime + base styles |
| `source/fonts/` | Plus Jakarta Sans + Noto Nastaliq Urdu, local woff2 (SIL Open Font License) |
| `source/music-cut.wav` | the exact audio in the clip |
| `tools/render.mjs`, `tools/package.json` | frame-by-frame renderer |
| `tools/music.py`, `tools/cues-v5.json` | music generator + v5 cue sheet |
| `make.sh` | rebuild (`--music` regenerates the audio too) |

Swap-in-place technique: the three words sit in one stacked spot; each has `data-in="blur"` and the previous one
`data-out="blur"` ~0.2s earlier. Brand note: coral/amber/grey stand for the result colours (problems) — keep that meaning.
