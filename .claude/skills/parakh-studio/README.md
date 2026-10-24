# Parakh Studio — brand, design and motion kit

Everything needed to make Parakh (پرکھ) videos, screens, Figma designs, PDF reports and social posts in the
approved style. Works as a Claude Code skill (`.claude/skills/parakh-studio/`) and as a documentation pack
you can give to any AI.

## Using it with any AI
Give the AI these files (in this order) and then your request:
1. `references/brand.md` — who Parakh is, colours, type, voice, legal rules (always)
2. the reference for the job: `video.md` + `audio.md` (videos) · `design-system.md` (+ `figma.md` for Figma) · `social.md` (posts)
3. the matching template or reference file: `templates/teaser-16x9.html` (video), `assets/web/*.dc.html` (screens/PDF)

Starter prompt:
> You are producing work for Parakh. Follow brand.md exactly (made-up names only; never "verified"/"safe";
> result colours only for results; Plus Jakarta Sans + Noto Nastaliq Urdu; ivory/cobalt palette). Build
> everything in HTML (no screenshots) so it can be animated. Use the motion attributes in video.md and the
> signature moves. Storyboard first (time · words · visual · motion · sound), then the HTML. Task: …

## Folder map
```
SKILL.md                    Claude Code entry point
references/brand.md         brand + legal rules
references/design-system.md pages, components, report + PDF anatomy, RTL rules
references/video.md         motion system, attributes, signature moves, approved teaser, pacing
references/audio.md         music generator, sound design rules, voice, mixing
references/figma.md         Figma Plugin API helpers + patterns
references/social.md        LinkedIn plan, post template, next story video, competitor note
templates/teaser-16x9.html  the approved 36s teaser (v7) — copy and edit
assets/film/film.js|css     animation runtime (seekable timeline) + base styles
assets/img/                 Pakistani architecture photos (Wikimedia Commons — credit or replace)
assets/web/*.dc.html        reference HTML for Home, Report, Checking, Status, How, Report PDF
scripts/new-film.sh         start a new film folder
scripts/prepare-clip.sh     footage → frame-exact VP9 WebM (+ wav of its sound)
scripts/render.sh           stills or full MP4 render (Chromium + ffmpeg)
scripts/music.py            synthesised score from a cues file
scripts/mix.sh              music + street sound + voice → final MP4 (−15 LUFS)
scripts/dc-to-static.py     canvas .dc.html → static HTML (for PDF export)
scripts/html-to-pdf.js      static HTML → A4 PDF
```

## Quick start (video)
```bash
S=.claude/skills/parakh-studio/scripts
$S/new-film.sh work/teaser
$S/prepare-clip.sh street.mp4 1.5 3.4 work/teaser/img/v-crowd.webm   # + v-man.webm, v-lahore.webm (see template)
$S/render.sh work/teaser/film.html --stills 1,5,9,13,17,21,26,30,35
python3 $S/music.py cues.json music.wav                               # cues: references/audio.md
$S/render.sh work/teaser/film.html work/silent.mp4
$S/mix.sh work/silent.mp4 music.wav work/final.mp4 --street work/teaser/img/v-crowd.wav
```
The footage used in v7 (Pexels market street clip 15879891, Badshahi aerial 9003971) is not bundled
(too large); re-download it from Pexels or use your own clips.

## Credits
Photos: Wikimedia Commons contributors (CC licences — keep the credit line or replace with owned photos).
Renderer `scripts/render.mjs` adapted from the Fourtix motion-demo skill.
