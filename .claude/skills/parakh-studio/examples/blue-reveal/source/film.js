/* ==========================================================================
   Fourtix film runtime — declarative, seekable motion for product demo videos.

   Author scenes in plain HTML with data-attributes. The same file:
     • plays live in any browser (preview; press R to replay, Space to pause)
     • can be seeked frame-by-frame by scripts/render.mjs → crisp MP4

   <body data-duration="25" data-fps="30" data-width="1920" data-height="1080">
   <section class="scene" data-from="0" data-to="4"> … </section>     visible window (crossfades 0.45s)

   Inside a scene (times are seconds RELATIVE to the scene start):
     data-in="fade|fade-up|fade-down|fade-left|fade-right|scale|wipe|rise"  data-at="0.4" [data-dur="0.8"]
     data-out="fade|fade-up|scale" data-out-at="3.2" [data-out-dur="0.5"]
     data-pan="scale(1) translateY(0%) | scale(1.08) translateY(-10%)" [data-pan-at] [data-pan-dur]
         → slow camera move; put it on an INNER element (e.g. the <img>), not on one that also has data-in
     data-count="7>8" data-count-at="1.2" [data-count-dur="0.6"] [data-count-decimals="0"] [data-prefix] [data-suffix]
     data-type="Text to type" data-type-at="0.5" [data-type-cps="18"]     typewriter
     class="cursor" data-path="0:960,980; 1.1:1320,640; 2:1320,640" [data-clicks="1.3, 2.4"]
         → pointer moves through points (time:x,y in px of the 1920×1080 frame) and pulses on clicks
     data-highlight-at="1.4" [data-highlight-dur="1.2"]     soft purple focus ring pulse

   Everything is driven from one clock, so a frame at t is always identical — no randomness, no rAF drift.
   ========================================================================== */
(function () {
  const body = document.body;
  const DURATION = parseFloat(body.dataset.duration || "10");
  const FPS = parseInt(body.dataset.fps || "30", 10);
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";      // Fourtix expo-out
  const EASE_INOUT = "cubic-bezier(0.45, 0, 0.55, 1)"; // camera moves
  const XFADE = 0.45;
  const anims = [];
  const drivers = []; // functions of time t (seconds) for non-CSS effects

  const IN = {
    "fade": [{ opacity: 0 }, { opacity: 1 }],
    "fade-up": [{ opacity: 0, transform: "translateY(48px)" }, { opacity: 1, transform: "none" }],
    "fade-down": [{ opacity: 0, transform: "translateY(-48px)" }, { opacity: 1, transform: "none" }],
    "fade-left": [{ opacity: 0, transform: "translateX(80px)" }, { opacity: 1, transform: "none" }],
    "fade-right": [{ opacity: 0, transform: "translateX(-80px)" }, { opacity: 1, transform: "none" }],
    "scale": [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
    "rise": [{ opacity: 0, transform: "translateY(140px) scale(0.98)" }, { opacity: 1, transform: "none" }],
    "wipe": [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }],
    "blur": [{ opacity: 0, filter: "blur(28px)", transform: "scale(1.08)" }, { opacity: 1, filter: "blur(0px)", transform: "none" }],
    "word": [{ transform: "translateY(115%)" }, { transform: "none" }],
    "wordblur": [{ opacity: 0, transform: "translateY(0.35em)", filter: "blur(14px)" }, { opacity: 1, transform: "none", filter: "blur(0px)" }],
    "track": [{ opacity: 0, letterSpacing: "0.7em" }, { opacity: 1, letterSpacing: "0.22em" }],
    "line": [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
  };
  const OUT = {
    "fade": [{ opacity: 1 }, { opacity: 0 }],
    "fade-up": [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-40px)" }],
    "scale": [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(1.03)" }],
    "blur": [{ opacity: 1, filter: "blur(0px)", transform: "none" }, { opacity: 0, filter: "blur(28px)", transform: "scale(0.94)" }],
    "word": [{ transform: "none" }, { transform: "translateY(-115%)" }],
    "wordblur": [{ opacity: 1, transform: "none", filter: "blur(0px)" }, { opacity: 0, transform: "translateY(-0.25em)", filter: "blur(14px)" }],
  };

  const num = (v, d) => (v === undefined || v === "" ? d : parseFloat(v));
  const add = (el, frames, delay, dur, easing, fill) => {
    const a = el.animate(frames, { delay: delay * 1000, duration: Math.max(1, dur * 1000), easing, fill });
    anims.push(a);
    return a;
  };
  const sceneStart = (el) => {
    const s = el.closest(".scene");
    return s ? num(s.dataset.from, 0) : 0;
  };

  // Centre of an element in stage pixels (measured before any animation offsets are applied).
  const targetCache = {};
  function target(sel) {
    if (targetCache[sel]) return targetCache[sel];
    const el = document.querySelector(sel), st = document.querySelector(".stage");
    if (!el || !st) { console.warn("film.js: cursor target not found", sel); return { x: 0, y: 0 }; }
    const r = el.getBoundingClientRect(), sr = st.getBoundingClientRect(), k = sr.width / (st.offsetWidth || 1920);
    return (targetCache[sel] = { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k });
  }
  function resolveTargets() {
    document.querySelectorAll(".cursor[data-path]").forEach((el) => el.dataset.path.split(";").forEach((p) => {
      const v = p.slice(p.indexOf(":") + 1).trim(); if (v.startsWith("#") || v.startsWith(".")) target(v.split("@")[0]);
    }));
  }

  function build() {
    resolveTargets();
    // Scenes: visible only inside their window, crossfading at the edges.
    document.querySelectorAll(".scene").forEach((s) => {
      const from = num(s.dataset.from, 0), to = num(s.dataset.to, DURATION);
      add(s, [{ opacity: 0 }, { opacity: 1 }], from === 0 ? 0 : from - XFADE / 2, from === 0 ? 0.001 : XFADE, "linear", "both");
      if (to < DURATION) add(s, [{ opacity: 1 }, { opacity: 0 }], to - XFADE / 2, XFADE, "linear", "forwards");
    });

    document.querySelectorAll("[data-in]").forEach((el) => {
      const f = IN[el.dataset.in] || IN.fade;
      add(el, f, sceneStart(el) + num(el.dataset.at, 0), num(el.dataset.dur, 0.8), EASE, "both");
    });
    document.querySelectorAll("[data-out]").forEach((el) => {
      const f = OUT[el.dataset.out] || OUT.fade;
      add(el, f, sceneStart(el) + num(el.dataset.outAt, 0), num(el.dataset.outDur, 0.5), EASE, "forwards");
    });
    document.querySelectorAll("[data-pan]").forEach((el) => {
      const [a, b] = el.dataset.pan.split("|").map((x) => x.trim());
      const s = el.closest(".scene");
      const start = sceneStart(el) + num(el.dataset.panAt, 0);
      const dur = num(el.dataset.panDur, s ? num(s.dataset.to, DURATION) - num(s.dataset.from, 0) : DURATION);
      add(el, [{ transform: a }, { transform: b }], start, dur, EASE_INOUT, "both");
    });
    document.querySelectorAll("[data-highlight-at]").forEach((el) => {
      const at = sceneStart(el) + num(el.dataset.highlightAt, 0), d = num(el.dataset.highlightDur, 1.2);
      add(el, [
        { boxShadow: "0 0 0 0 rgba(140,124,245,0)" },
        { boxShadow: "0 0 0 6px rgba(140,124,245,.28)", offset: 0.35 },
        { boxShadow: "0 0 0 0 rgba(140,124,245,0)" },
      ], at, d, "ease-out", "none");
    });

    // Cursor paths + click pulses. Points are "t:x,y" (stage px) or "t:#selector" / "t:#selector@dx,dy" (element centre).
    document.querySelectorAll(".cursor[data-path]").forEach((el) => {
      const pts = el.dataset.path.split(";").map((p) => p.trim()).filter(Boolean).map((p) => {
        const i = p.indexOf(":"), t = +p.slice(0, i), v = p.slice(i + 1).trim();
        if (v.startsWith("#") || v.startsWith(".")) {
          const [sel, off = "0,0"] = v.split("@"); const [dx, dy] = off.split(",").map(Number);
          return { t, ...target(sel), dx, dy };
        }
        const [x, y] = v.split(",").map(Number); return { t, x, y, dx: 0, dy: 0 };
      }).map((p) => ({ t: p.t, x: p.x + p.dx, y: p.y + p.dy }));
      const base = sceneStart(el), t0 = pts[0].t, t1 = pts[pts.length - 1].t, span = Math.max(0.001, t1 - t0);
      const frames = pts.map((p) => ({ transform: `translate(${p.x}px, ${p.y}px)`, offset: (p.t - t0) / span, easing: EASE }));
      add(el, frames, base + t0, span, "linear", "both");
      // Visible only around its path: fade in just before the first point, out after the last.
      add(el, [{ opacity: 0 }, { opacity: 1 }], base + t0 - 0.3, 0.3, "linear", "both");
      add(el, [{ opacity: 1 }, { opacity: 0 }], base + t1 + 0.5, 0.3, "linear", "forwards");
      const ring = document.createElement("i"); ring.className = "cursor-ring"; el.appendChild(ring);
      (el.dataset.clicks || "").split(",").map((v) => v.trim()).filter(Boolean).forEach((c) => {
        add(ring, [{ opacity: 0.55, transform: "scale(0.4)" }, { opacity: 0, transform: "scale(1.6)" }], base + +c, 0.55, "ease-out", "none");
        add(el.querySelector("svg") || el, [{ transform: "scale(1)" }, { transform: "scale(0.86)", offset: 0.4 }, { transform: "scale(1)" }], base + +c, 0.3, "ease-out", "none");
      });
    });

    // Counters.
    document.querySelectorAll("[data-count]").forEach((el) => {
      const [a, b] = el.dataset.count.split(">").map(Number);
      const at = sceneStart(el) + num(el.dataset.countAt, 0), d = num(el.dataset.countDur, 0.8);
      const dec = parseInt(el.dataset.countDecimals || "0", 10), pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const fmt = new Intl.NumberFormat("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: !("nogroup" in el.dataset) });
      drivers.push((t) => {
        const k = Math.min(1, Math.max(0, (t - at) / d));
        const e = 1 - Math.pow(1 - k, 4);
        el.textContent = pre + fmt.format(a + (b - a) * e) + suf;
      });
    });
    // Typewriter.
    document.querySelectorAll("[data-type]").forEach((el) => {
      const text = el.dataset.type, at = sceneStart(el) + num(el.dataset.typeAt, 0), cps = num(el.dataset.typeCps, 18);
      drivers.push((t) => { el.textContent = text.slice(0, Math.max(0, Math.floor((t - at) * cps))); });
    });
  }

  function seek(t) {
    for (const a of anims) { a.pause(); a.currentTime = t * 1000; }
    for (const d of drivers) d(t);
  }

  // ---- live preview ----
  let t0 = performance.now(), paused = false, pausedAt = 0, rendering = false;
  function tick() {
    if (rendering) return;
    if (!paused) {
      const t = (performance.now() - t0) / 1000;
      if (t > DURATION + 1.5) restart();
      else for (const d of drivers) d(t);
    }
    requestAnimationFrame(tick);
  }
  function restart() { t0 = performance.now(); paused = false; for (const a of anims) { a.currentTime = 0; a.play(); } }
  addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") restart();
    if (e.key === " ") {
      e.preventDefault();
      if (paused) { t0 = performance.now() - pausedAt * 1000; anims.forEach((a) => a.play()); paused = false; }
      else { pausedAt = (performance.now() - t0) / 1000; anims.forEach((a) => a.pause()); paused = true; }
    }
  });

  const imgs = [...document.images].map((im) => im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; }));
  const ready = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), ...imgs]);

  // Preview: scale the 1920×1080 stage to fit the window (rendering uses the exact size).
  const W = parseInt(body.dataset.width || "1920", 10), H = parseInt(body.dataset.height || "1080", 10);
  const stage = document.querySelector(".stage");
  function fit() {
    if (!stage) return;
    if (rendering) { stage.style.transform = "none"; stage.style.left = stage.style.top = "0px"; return; }
    const k = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `scale(${k})`;
    stage.style.left = (innerWidth - W * k) / 2 + "px";
    stage.style.top = (innerHeight - H * k) / 2 + "px";
  }
  addEventListener("resize", fit);
  fit();

  build();
  requestAnimationFrame(tick);
  window.__film = {
    duration: DURATION, fps: FPS,
    width: parseInt(body.dataset.width || "1920", 10), height: parseInt(body.dataset.height || "1080", 10),
    ready, seek: (t) => { if (!rendering) { rendering = true; fit(); } seek(t); },
  };
})();
