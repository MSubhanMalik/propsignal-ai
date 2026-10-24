# Example: "Parakh · Coming soon" v7 (final, approved)

36.4s · 1920×1080 · 30fps · no narrator · music + sound design + real street sound + one Urdu voice tag.
Final file: `final/Parakh-Coming-Soon-v7.mp4`. Source of truth for every timing: `film/film.html`.

| # | Time | Background | On screen | Motion | Sound |
|---|---|---|---|---|---|
| 1 | 0–3.4 | Footage `v-crowd.webm` (market street, Pakistani flags) + bottom-dark gradient | kicker PAKISTAN · "Every year, families put their **life savings**" (amber) | kicker `track`; words `wordblur` 0.08s stagger; slow push-in 1.0→1.04 | real crowd/traffic (`audio/street.wav`); music fades up from 25% |
| 2 | 3.4–6.6 | Footage `v-man.webm` (man with moustache looking around) + left-dark gradient | "into a **promise.**" · gold rule · "Some are still waiting for possession." | words blur in; rule `line`; pull-out 1.04→1.0 | street sound fades out |
| 3 | 6.6–10.6 | Night + `v-lahore.webm` at 32% opacity, grayscale | kicker PLOT FILE · EXAMPLE · "Booked in 2012." · "Still waiting for possession." (amber) · sand ALLOTMENT FILE card: Possession promised 2015 / Today **2012→2026** (red) | card `rise`; year `data-count` + `data-nogroup` | hit 6.7; soft ticks 7.4–9.8 |
| 4 | 10.6–14.6 | Ivory | kicker THE AD SAID · "“LDA approved.”" · "The record said otherwise." (red) · cobalt ad card "PLOTS FOR SALE · PHASE 3 / Easy instalments. Possession soon." with SVG plot map (Phase 3 in amber) · stamps | ad `fade-left`; green **LDA APPROVED** stamp scales in 0.9s, blurs out 1.9s; red **PHASE 3: NOT APPROVED** scales in 2.1s (−8° rotation on an outer wrapper) | hit 12.75 (stamp flip) |
| 5 | 14.6–18.4 | Night | kicker ADVERTISED VS APPROVED · "1,200 kanal advertised" + white bar 1620px · "800 kanal approved" + amber bar 1080px · "Example figures. Every project is different." | bars `line` (scaleX) | hit 16.2 |
| 6 | 18.4–23.4 | Ivory | 9 grey source labels (Development authority lists, Court records, Regulator filings, Old news reports, NOCs, Buyer groups, Layout plans, Company registers, Illegal scheme notices) · "The truth was always public." → "It was just never in one place." (cobalt) | labels `blur` in (0.1s stagger) and out; headline words in, out, second line in | whooshes 18.4 + 20.6 (the liked "sand" sound); arpeggio + riser to 23.4 |
| 7 | 23.4–28.2 | Cobalt gradient + 2 faint rings | "Parakh" + "/pə·rəkh/ · to examine, to test the worth of" → **پرکھ** + "پرکھنا · کسی چیز کی اصل قدر جانچنا" | rings `scale`; English `blur` out at 1.85s, Urdu `blur` in at 2.05s | impact hit 23.4; warm chord progression starts |
| 8 | 28.2–31.6 | Ivory | kicker CREDIBILITY, MEASURED · "Know a project’s credibility" · "before you invest." (cobalt) · **58** (amber, counts 0→58) · rule · "Credibility score, out of 100" · "Every point backed by a source" | number `blur` + count | soft kick pulse from 28.2 |
| 9 | 31.6–36.4 | `multan.jpg` (Shah Rukn-e-Alam, 1920px) + vignette | **Parakh پرکھ** · "COMING SOON" → **جلد آ رہا ہے** (amber) · "Check before you invest." | lockup `blur`; English kicker `blur` out 2.1s, Urdu in 2.3s; push-in 1.0→1.05 | end hit 31.6; Urdu voice "جلد آ رہا ہے" at 34.0s (`audio/jald-urdu.wav`, Kokoro hm_omega) |

## Files
- `film/film.html` — the film (with the word splitter and video-sync shim). `film/film.js`, `film/film.css` — runtime + base styles (exact versions used).
- `film/img/` — the three prepared VP9 clips (all-keyframe) and the Multan photo.
- `audio/cues.json` → `music.wav` (score) · `street.wav` (ambience) · `jald-urdu.wav` (voice tag) · `final-mix.wav` (the exact mastered mix in the final MP4).
- `source-footage/` — the two original Pexels clips (free Pexels licence) the WebMs were cut from.
- `make.sh` — rebuilds the video (`--clips` to re-cut from source first). Needs the skill's `scripts/` two folders up.

## Decisions that shaped v7 (from feedback rounds)
v1 too plain → v2 no screenshots, HTML-built, word transitions → v3 AI narrator rejected, low-res end photo replaced → v5 too many "sand" whooshes cut to two, opening redesigned → v6 real Pakistani street footage + sound added; a Delhi mosque clip and clips showing a real developer/portal brand rejected → v7 slower (28→36s) and the real-estate problem made concrete (file card, ad stamp flip, kanal bars).
