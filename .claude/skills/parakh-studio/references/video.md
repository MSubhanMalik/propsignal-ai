# Parakh motion system

A film is one HTML file driven by `assets/film/film.js` (a seekable timeline). It plays live in a browser for
review and `scripts/render.sh` captures it frame by frame (30 fps) into a perfectly smooth MP4. Everything —
text, cards, stamps, counters, maps, footage — is built in HTML so it can be animated. **Never use screenshots
of designs**; rebuild the element in HTML.

## File structure
```html
<body data-duration="36.4" data-fps="30" data-width="1920" data-height="1080">
<div class="stage">
  <section class="scene night" data-from="0" data-to="3.4"> … </section>   <!-- scenes crossfade 0.45s -->
  …
</div>
<script> /* word splitter — see template */ </script>
<script src="film.js"></script>
<script> /* video sync shim — see template */ </script>
</body>
```
Scene backgrounds (classes): `night` (#0D0B08, white text), `ivory` (#FBF8F2, ink text), `cobalt` (brand
gradient, white text). Times inside a scene are **relative to the scene start**.

## Animation attributes
| Attribute | Effect |
|---|---|
| `data-in="…" data-at="0.4" data-dur="0.8"` | entrance. Types: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale`, `rise`, `wipe`, **`blur`** (blur 28px + scale 1.08 → sharp), **`wordblur`** (per word: rise .35em + blur 14px → sharp), `word` (masked rise), **`track`** (letter-spacing .7em → .22em, for kickers), **`line`** (scaleX 0 → 1, for rules and bars) |
| `data-out="…" data-out-at="2.6" data-out-dur="0.45"` | exit: `fade`, `fade-up`, `scale`, **`blur`**, **`wordblur`**, `word` |
| `data-words="at,stagger,dur[,outAt,outStagger]"` | splits the text into words that `wordblur` in one by one (and out). A `<span>` inside marks highlighted words (amber on dark, cobalt on ivory). |
| `data-pan="scale(1.04) \| scale(1.0)" data-pan-dur="3"` | slow camera move — on the inner `<img>`/`<video>`. Keep scale ≤ 1.1 and never above the source resolution. |
| `data-count="2012>2026" data-count-at="0.9" data-count-dur="2.4"` | number count-up; add `data-nogroup` for years (no thousands separator). Locale en-IN (25,00,000). `data-prefix`, `data-suffix`. |
| `<video src="img/clip.webm" data-vfrom="SCENE_START" muted>` | footage, frame-synced by the shim. Must be VP9 WebM, all keyframes (`scripts/prepare-clip.sh`). |

## The signature moves (use these)
1. **Word-by-word blur reveal** for every headline (`data-words`, stagger 0.06–0.1s, dur 0.7s).
2. **Swap in place**: two lines stacked in one spot; the first `data-out="blur"`, the second `data-in="blur"`
   0.1–0.2s later. Used for English → Urdu (Parakh → پرکھ, "Coming soon" → "جلد آ رہا ہے") and for problem
   words. This is the most-liked effect.
3. **Scattered sources dissolving**: 8–9 grey labels blur in around the frame (0.1s stagger), then blur out
   while the headline lands ("The truth was always public." → "It was just never in one place.").
4. **Stamp flip**: a rotated (−8°) green "LDA APPROVED" stamp scales in, blurs out, and a red
   "PHASE 3: NOT APPROVED" stamp scales in (0.3s) with a sound hit. Wrap the stamp in an outer div that holds
   the rotation; animate the inner div.
5. **File card + year counter**: a sand "ALLOTMENT FILE" card rises; "Possession promised 2015"; "Today" counts
   2012 → 2026 in red.
6. **Bars**: advertised vs approved (1,200 vs 800 kanal) drawn with `data-in="line"`; always add
   "Example figures. Every project is different."
7. **Brand reveal on cobalt**: two faint rings scale in, "Parakh" blurs in, meaning line fades up, both blur
   out, پرکھ + Urdu meaning blur in.
8. **End card on a photo**: lockup `Parakh پرکھ` + "Coming soon" (`track`) swapping to "جلد آ رہا ہے" + "Check
   before you invest."

## Approved teaser structure (36.4s, `templates/teaser-16x9.html`)
| # | Time | Scene | Notes |
|---|---|---|---|
| 1 | 0–3.4 | Street market footage + real crowd/traffic sound: "PAKISTAN" · "Every year, families put their **life savings**" | bottom-left text over a bottom-dark gradient |
| 2 | 3.4–6.6 | Close-up of a waiting man: "into a **promise.**" + gold rule + "Some are still waiting for possession." | left-dark gradient |
| 3 | 6.6–10.6 | Night + dim Lahore aerial: "Booked in 2012. Still waiting for possession." + file card, year counter | soft ticks |
| 4 | 10.6–14.6 | Ivory: "The ad said 'LDA approved.'" + plot-map ad + stamp flip; "The record said otherwise." | hit at the flip |
| 5 | 14.6–18.4 | Night: 1,200 kanal advertised vs 800 kanal approved bars | hit |
| 6 | 18.4–23.4 | Ivory: scattered sources → "The truth was always public." → "It was just never in one place." | two whooshes (liked) + riser |
| 7 | 23.4–28.2 | Cobalt brand reveal + English→Urdu meaning swap | impact hit |
| 8 | 28.2–31.6 | Ivory: "Know a project's credibility before you invest." + score counts to 58 | soft pulse |
| 9 | 31.6–36.4 | Multan photo end card: Parakh پرکھ · Coming soon → جلد آ رہا ہے | Urdu voice tag at 34.0s |

## Pacing rules (learned from feedback)
- ~0.3s reading time per word + 0.8–1s hold. Scenes 3–5s. Problem beats need a full beat to *feel*, not just
  read: 4s each.
- Concrete buyer moments over abstract words. The video must say "real estate" in the first 5 seconds.
- Max 3 things animating at once. Teasers hide the product — show at most one hint (the score).
- First frame matters most on social: real people/footage or a strong typographic line — never a lone number.

## Formats
- 16:9 1920×1080 (YouTube, site). LinkedIn feed: **1080×1350** (4:5). Reels/Status: 1080×1920. Change
  `data-width/height` on `<body>`, set `.stage{width;height}` in a `<style>` override, and re-flow positions.
- LinkedIn: burn in English subtitles (most watch muted); keep Urdu on-screen lines with English underneath.

## Review checklist (look at stills, every scene)
Overlapping labels/headlines · line wraps leaving one orphan word · Nastaliq clipped (raise line-height) ·
real brands/landmarks in footage · image sharpness on full-size frames · counters ending on true/example
numbers · nothing within 60px of the frame edge on social cuts.
