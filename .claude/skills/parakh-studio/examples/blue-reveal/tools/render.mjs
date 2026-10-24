#!/usr/bin/env node
/**
 * Render a Fourtix film (HTML using assets/film.js) to MP4, frame by frame.
 *
 *   node render.mjs <film.html> [--out demo.mp4] [--fps 30] [--from 0] [--to <duration>]
 *                   [--scale 1] [--poster 2.5] [--crf 18] [--stills 1,5,9.5]
 *
 *   --scale 0.5     quick low-res draft
 *   --from/--to     render just a section (seconds) while iterating on one scene
 *   --poster t      also save a PNG still at time t (thumbnail for YouTube/LinkedIn)
 *   --stills a,b,c  review mode: save PNG frames at those times and exit (fast check of layout)
 *
 * Every frame is captured after seeking the film's clock, so motion is perfectly smooth and
 * deterministic regardless of machine speed. Needs: Node 18+, `npm install` in this folder
 * (playwright-core), a Chrome/Chromium binary (auto-detected, or CHROME_PATH), and ffmpeg with libx264.
 */
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const film = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
if (!film) { console.error("usage: node render.mjs <film.html> [--out demo.mp4] ..."); process.exit(1); }
const src = path.resolve(film);
const out = path.resolve(opt("out", src.replace(/\.html?$/, ".mp4")));
const scale = parseFloat(opt("scale", "1"));
const crf = opt("crf", "18");

function findChrome() {
  const c = [process.env.CHROME_PATH];
  const globs = [["/opt/pw-browsers", /^chromium-\d+$/, "chrome-linux/chrome"],
    [path.join(os.homedir(), ".cache/ms-playwright"), /^chromium-\d+$/, "chrome-linux/chrome"],
    [path.join(os.homedir(), "Library/Caches/ms-playwright"), /^chromium-\d+$/, "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]];
  for (const [dir, re, rel] of globs) {
    try { for (const d of fs.readdirSync(dir).filter((n) => re.test(n)).sort().reverse()) c.push(path.join(dir, d, rel)); } catch {}
  }
  c.push("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
  return c.find((p) => p && fs.existsSync(p));
}

const exe = findChrome();
if (!exe) { console.error("No Chrome/Chromium found. Set CHROME_PATH."); process.exit(1); }
const browser = await chromium.launch({ executablePath: exe, args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
const probe = await browser.newPage();
await probe.goto("file://" + src);
const meta = await probe.evaluate(() => ({ d: window.__film?.duration, fps: window.__film?.fps, w: window.__film?.width, h: window.__film?.height }));
await probe.close();
if (!meta.d) { console.error("This page doesn't load film.js (window.__film missing)."); process.exit(1); }

const fps = parseInt(opt("fps", meta.fps || 30), 10);
const from = parseFloat(opt("from", "0"));
const to = Math.min(parseFloat(opt("to", meta.d)), meta.d);
const W = meta.w, H = meta.h;
const outW = Math.round(W * scale / 2) * 2, outH = Math.round(H * scale / 2) * 2;

const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale });
await page.goto("file://" + src, { waitUntil: "networkidle" });
await page.evaluate(() => window.__film.ready);
await page.addStyleTag({ content: ".hint{display:none!important}" });

const stills = opt("stills");
if (stills) {   // review mode: save a few PNG frames and exit (e.g. --stills 1,5.5,12)
  const dir = out.replace(/\.mp4$/, "-stills"); fs.mkdirSync(dir, { recursive: true });
  for (const s of stills.split(",").map(Number)) {
    await page.evaluate((t) => window.__film.seek(t), s);
    await page.screenshot({ path: path.join(dir, `t${s.toFixed(1).padStart(5, "0")}.png`) });
  }
  await browser.close(); console.log(`✓ stills in ${dir}`); process.exit(0);
}

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
  "-vf", `scale=${outW}:${outH}:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
const write = (buf) => new Promise((res) => (ff.stdin.write(buf) ? res() : ff.stdin.once("drain", res)));

const total = Math.round((to - from) * fps);
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = from + i / fps;
  await page.evaluate((t) => window.__film.seek(t), t);
  await write(await page.screenshot({ type: "jpeg", quality: 95 }));
  if (i % fps === 0) process.stdout.write(`\r  ${t.toFixed(1)}s / ${to.toFixed(1)}s`);
}
const poster = opt("poster");
if (poster) {
  await page.evaluate((t) => window.__film.seek(t), parseFloat(poster));
  await page.screenshot({ path: out.replace(/\.mp4$/, "-poster.png") });
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
const mb = (fs.statSync(out).size / 1e6).toFixed(1);
console.log(`\n✓ ${out}  ${outW}×${outH} @${fps}fps  ${(to - from).toFixed(1)}s  ${mb} MB  (rendered in ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
