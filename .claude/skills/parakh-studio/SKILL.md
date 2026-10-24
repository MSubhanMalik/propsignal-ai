---
name: parakh-studio
description: Parakh (پرکھ) brand studio. Use for anything that represents Parakh visually or in words — motion videos (teasers, LinkedIn/Instagram cuts, story videos), web and mobile screens, Figma designs, PDF reports, carousels, social images and post copy — in English and Urdu. Triggers on "Parakh", "پرکھ", "PropSignal", "make a video for Parakh", "coming soon video", "LinkedIn post for Parakh", "design a Parakh screen", "Parakh report", or any request to create Parakh marketing or product visuals.
---

# Parakh Studio

Parakh helps people in Pakistan judge a property project's credibility before they invest. This skill holds
everything needed to produce Parakh work that looks and sounds like the approved "Direction D" design:
brand rules, the design system, the motion system, ready templates and the scripts that render films.

**Read before producing anything:** `references/brand.md` (voice, colours, type, legal rules). Then the
reference for the job:

| Job | Read | Start from |
|---|---|---|
| Video (teaser, story, social cut) | `references/video.md`, `references/audio.md` | `templates/teaser-16x9.html` via `scripts/new-film.sh` |
| Web / mobile screens, HTML pages | `references/design-system.md` | `assets/web/*.dc.html` (reference implementations) |
| Figma screens | `references/design-system.md`, `references/figma.md` | helper code in `references/figma.md` |
| PDF report | `references/design-system.md` § Report PDF | `assets/web/ReportPDF.dc.html` + `scripts/dc-to-static.py` + `scripts/html-to-pdf.js` |
| LinkedIn / social posts | `references/social.md` | — |

## Non-negotiables (summary — full list in brand.md)
1. **Made-up names only** in every design, video and example: "Sample Gardens, Lahore", "Sample Builders (example)". Never show a real society, developer or property brand next to a negative finding, and never use footage or photos that show one (Bahria Town, DHA, Graana, Zameen… logos, gates, billboards).
2. **Never say** "verified", "safe", "guaranteed" or "never wrong". Parakh reports what is public online.
3. **Green / amber / red / grey are reserved for results** (no serious problems / some problems / serious problems / not enough information). Never use them as decoration — except red/amber accents on the problem words in videos, which stand for those results.
4. **Every number is labelled** as real (with source) or example ("Example figures").
5. **Pakistani footage only.** Check landmarks (e.g. Delhi's Jama Masjid looks like Lahore's Badshahi — do not use it).
6. **No AI voice-over** for narration (it reads as fake). Use music + sound design, on-screen text, and real recorded voices. One short Urdu tag line ("جلد آ رہا ہے") is the only synthetic voice that has worked; keep it optional.

## Video workflow (short)
1. Storyboard first: one line per scene — time, on-screen words (≤ 10), visual, motion, sound cue. Story beats beat explanations: show a concrete buyer moment (booked 2012 → still waiting; ad said "LDA approved" → record said otherwise) before showing Parakh.
2. `scripts/new-film.sh work/my-film` → edit `work/my-film/film.html` (scenes, timings). Footage: `scripts/prepare-clip.sh src.mp4 <start> <dur> work/my-film/img/clip.webm`.
3. Review: `scripts/render.sh work/my-film/film.html --stills 1,4,8,…` and look at every still (overlaps, wraps, legibility at phone size, real-brand leaks).
4. Music: write cues JSON (scene times) → `python3 scripts/music.py cues.json music.wav`.
5. Render + mix: `scripts/render.sh film.html silent.mp4` → `scripts/mix.sh silent.mp4 music.wav final.mp4 [--street clip.wav] [--voice line.wav@34.0]`.
6. Check a full-size frame of the last scene (resolution), then deliver the MP4 plus a zip (some clients can't download raw MP4).

Requirements: Node 18+, ffmpeg (libx264, libvpx-vp9), Chromium (Playwright's works; `render.sh` finds it or set `CHROME_PATH`), Python 3 with numpy + scipy.
