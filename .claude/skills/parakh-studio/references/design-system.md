# Parakh design system ("Direction D")

Light, warm, dense, culturally Pakistani — not a generic SaaS look. Ivory pages, Multani-cobalt actions, big
photo heroes with warm overlays, arched city photos, numbered lists, thin warm dividers. No dark-navy pages,
no "trust badge" strips, no star ratings, no kashi-tile pattern bands.

Reference implementations (HTML, readable as plain HTML/CSS; `{{…}}` holes and `sc-for` loops come from the
claude.ai Design canvas format and can be read as templates): `assets/web/HomeD.dc.html`, `ReportD.dc.html`,
`CheckingD.dc.html`, `StatusD.dc.html` (error/offline), `HowD.dc.html`, `ReportPDF.dc.html`.

## Layout
- Desktop frame 1280 wide; content max 1240 with 40px side padding (18px ≤ 900px wide). Mobile 390 with 16–20px padding.
- Section rhythm: 56–88px vertical padding desktop, 28–40px mobile. Alternate ivory and sand sections.
- Cards: white, 1px `#E3DACA` border, **no shadows in print/PDF** (PDF viewers render blur shadows as grey
  boxes). Radius 0–6px (squarish, editorial). Buttons square-cornered.
- Tap targets ≥ 44px; buttons 56px tall desktop, 48px mobile.

## Page header (shared on every page)
Sits on the photo band: `Parakh پرکھ` (white) · nav: How we check · My checks · Contact · WhatsApp:
[YOUR NUMBER] · language switch (اردو / English). Bottom border `rgba(255,255,255,.18)`. Mobile: logo · language
chip · menu icon.

## Hero / photo band (every page)
- Home: 820px tall photo (Badshahi) with warm left-to-right overlay (`rgba(22,16,10,.88 → .25)`), H1 64px, white search bar + cobalt button, sample result card.
- Other pages: a short band (300–460px) with the photo of the **project's city**, the page title in it, and the main card **overlapping the band's bottom by 64–120px** (negative spacing).
- Footer (shared): night `#14100B`, logo, disclaimer "Parakh does not verify or guarantee any project. It only shows what is public online. It is not legal advice.", links, photo credit.

## Pages (all exist in EN + UR, desktop + mobile)
Home · Checking (4 steps + progress, "While you wait" questions) · Report ×3 results (some problems /
serious / not enough info) · Error · No internet · How we check / About · Contact (WhatsApp first, email,
corrections; form with topic chips; "How corrections work"; developer right of reply) · My checks (private
history, filters, change badges, "Alert me if this changes" toggles, "Saved on this phone only — add WhatsApp
number").
Not built on purpose: a public ranked list of projects (legal risk). A future public directory may show official
status only.

## Report anatomy (web)
1. Band: breadcrumb, project name, developer, checked date, source count.
2. Overlapping result card: colour bar (result colour) · RESULT tag · label · one-line summary · score /100 (or "—") · Share on WhatsApp · Download PDF · Check another · Request a correction.
3. Key facts: LDA approval · NOC · Layout plan · Court cases · Complaints, each with a status chip (✓ ! ✕ –).
4. Body: Summary → Problems found (type tag, Serious / Allegation tags, title, detail, "Source: X · date ↗") → Good signs → Where we found this.
5. Aside: blue "What you should do next" (numbered) · What we checked (Found / Nothing found) · What we did not check (sand) · disclaimer.

## Report PDF (A4, 5 pages, 794×1123px per page)
1 Summary (photo band, verdict, key facts, In short, official records at a glance, contents, next steps, **QR "Is this report genuine?"**) ·
2 Official records table (scheme status, NOC + ref, layout plan, illegal list, PRERA, SECP, PLRA land, High Court) + status legend + other-city authorities (CDA, RDA, MDA, SBCA/KDA, FDA) ·
3 Documents (found / not found cards + "Ask the developer for these") + Ads vs records table ·
4 Timeline + Problems / Good signs + complaint counts ·
5 Developer profile + other projects · Developer's reply · What we did not check · numbered sources · legal note.
Running header (logo · project · report ID · result chip) and footer (checked date · verify link · page X of 5).
Static export: `python3 scripts/dc-to-static.py ReportPDF.dc.html report.html photo.jpg` then
`node scripts/html-to-pdf.js $PWD/report.html $PWD/report.pdf` (uses `@page{size:A4;margin:0}`).

## Status chips
`ok ✓` green · `warn !` amber · `bad ✕` red · `none –` grey; 10.5–14px bold, 4px radius, tint background.

## Urdu / RTL
- `dir="rtl"`, right-align everything, mirror every horizontal row (logo goes right, arrows flip → ←, colour bars on the right).
- Nastaliq line-height ≥ 185%; reduce size ~8%; ExtraBold → Bold (Nastaliq has no 800).
- Keep Latin tokens (Parakh, PK-LHR-000123, ✓, scores) in Plus Jakarta Sans.
- Progress bars fill from the right.
- Translations of all core strings are in the reference HTML files (`PR`, `PC`, `PS`, `PH` dictionaries).

## Content rules for designs
Made-up names: Sample Gardens (Lahore), Sample Valley Phase 2 (Multan), Sample Heights (Rawalpindi), Sample
Enclave (Islamabad), Sample Builders / Sample Developers (example). Example report ID PK-LHR-000123. Example
score 58 (medium), 22 (high), 81 (low), — (unknown).
