"""Alternative pre-reveal scores for Parakh films, spliced into an existing score at the logo reveal.

  python3 music_styles.py <style> <cues.json> <reveal_score.wav> <out.wav>

style:  "desi"   tanpura drone + tabla-style hand percussion + plucked melody in a Bhairav-like scale
        "pizz"   pizzicato ostinato + ticking hats + hard silence on the stamp + low pulse
cues:   {"dur":26.5,"reveal":13.5,"hits":[...],"perc":[start,end],"silence":[t,len],"pulse":[start,end]}
The output takes the new score from 0 to `reveal` and the original `reveal_score.wav` from `reveal` on
(0.12s crossfade), so the approved logo-reveal music stays identical.
"""
import json, sys, wave
import numpy as np
from scipy.signal import lfilter

SR = 44100
style, cues = sys.argv[1], json.load(open(sys.argv[2]))
D, RV = cues["dur"], cues["reveal"]
N = int(SR * (RV + 1.0))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(11)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, c):
    a = np.exp(-2 * np.pi * c / SR); return lfilter([1 - a], [1, -a], x)
def hp(x, c): return x - lp(x, c)
def place(s, at, g=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(s) <= 0: return
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s)); s = s[: j - i] * g
    L[i:j] += s * (1 - max(pan, 0)); R[i:j] += s * (1 + min(pan, 0))
def t_(d): return np.arange(int(d * SR)) / SR

def boom(at, g=0.6):
    t = t_(1.4); f = 55 * np.exp(-t * 3) + 32
    place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6), at, g)

def riser(a, b, g=0.25):
    t = t_(b - a); x = rng.standard_normal(len(t)); k = (t / t[-1]) ** 2
    place((lp(x, 700) * (1 - k) + hp(x, 2600) * k) * k, a, g)

if style == "desi":
    # tanpura: Pa Sa Sa Sa cycle (A2 D3 D3 D2), long buzzy plucks
    def tanpura(m, at, g):
        t = t_(3.2); f = hz(m); s = np.zeros_like(t)
        for k in range(1, 16):
            buzz = 1 + 0.5 * np.sin(2 * np.pi * (0.7 + k * 0.13) * t)
            s += np.sin(2 * np.pi * f * k * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) * (1 / k ** 0.9) * buzz
        s *= np.exp(-t / 1.8) * np.minimum(1, t / 0.01)
        place(lp(s, 3500), at, g, pan=0.2)
    cyc = [45, 50, 50, 38]
    for i, x in enumerate(np.arange(0, RV - 0.4, 0.9)):
        tanpura(cyc[i % 4], x, 0.05)
    # tabla-style: dha (bayan + dayan), na (dayan ring), ti (short)
    def bayan(at, g):
        t = t_(0.5); f = 95 * np.exp(-t * 6) + 62
        place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7), at, g)
    def dayan(at, g, ring=0.25, f0=520):
        t = t_(ring + 0.05)
        s = sum(np.sin(2 * np.pi * f0 * p * t) * a for p, a in ((1, 1), (2.01, .5), (2.98, .3), (4.1, .15))) * np.exp(-t / (ring / 4))
        s += hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 90) * 0.4
        place(s, at, g, pan=-0.25)
    a, b = cues.get("perc", [2.7, 11.0]); step = 0.33
    patt = ["dha", "ge", "na", "ti", "na", "ka", "dhi", "na"]
    for i, x in enumerate(np.arange(a, b, step)):
        p = patt[i % 8]
        if p in ("dha", "dhi", "ge"): bayan(x, 0.32)
        if p in ("dha", "dhi", "na"): dayan(x, 0.13, 0.28)
        if p in ("ti", "ka"): dayan(x, 0.08, 0.08, 700)
    # plucked melody, Bhairav-like (D Eb F# G A Bb C#)
    scale = [62, 63, 66, 67, 69, 70, 73, 74]
    mel = [0, 2, 3, 4, 3, 2, 1, 0, 4, 5, 4, 3, 2, 1, 2, 0]
    def pluck(m, at, g):
        t = t_(1.0); f = hz(m)
        s = (np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * 2 * f * t) + .2 * np.sin(2 * np.pi * 3 * f * t) + .1 * np.sin(2 * np.pi * 4.02 * f * t)) * np.exp(-t * 4.5)
        place(s * np.minimum(1, t / 0.003), at, g, pan=0.15)
    for i, x in enumerate(np.arange(0.4, RV - 2.6, 0.66)):
        pluck(scale[mel[i % len(mel)]], x, 0.075)
    for h in cues.get("hits", []): boom(h, 0.55)
    riser(RV - 2.4, RV, 0.22)

elif style == "pizz":
    def pizz(m, at, g, pan=0.0):
        t = t_(0.35); f = hz(m)
        s = (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2 * f * t) + .25 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t * 14)
        place(s * np.minimum(1, t / 0.002), at, g, pan)
    def tick(at, g):
        t = t_(0.04); place(hp(rng.standard_normal(len(t)), 6000) * np.exp(-t * 140), at, g, pan=0.35)
    sil_t, sil_len = cues.get("silence", [5.15, 0.45])
    ost = [50, 53, 57, 62, 57, 53, 50, 57]; ost2 = [46, 50, 53, 58, 53, 50, 46, 53]
    for i, x in enumerate(np.arange(0.2, RV - 3.4, 0.125)):
        if sil_t - 0.05 <= x < sil_t + sil_len: continue
        seq = ost if (int(x / 2) % 2 == 0) else ost2
        pizz(seq[i % 8], x, 0.11 + 0.04 * (i % 4 == 0), pan=(-0.3 if i % 2 else 0.3))
        if i % 2 == 0: tick(x, 0.05)
    # stamp: thud + silence
    t = t_(0.5); place(np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 9) + 40) / SR) * np.exp(-t * 10), sil_t, 0.75)
    # low pulse under "Approved doesn't mean safe"
    a, b = cues.get("pulse", [7.6, RV])
    for x in np.arange(a, b - 0.2, 0.75):
        t = t_(0.5); place(np.sin(2 * np.pi * np.cumsum(52 * np.exp(-t * 5) + 38) / SR) * np.exp(-t * 6), x, 0.5)
    sus = t_(b - a); place(np.sin(2 * np.pi * hz(38) * sus) * 0.2 * np.minimum(1, sus / 0.8), a, 0.6)
    for h in cues.get("hits", []): boom(h, 0.55)
    riser(RV - 1.8, RV, 0.2)
else:
    sys.exit("unknown style " + style)

# light room reverb
irn = int(1.4 * SR); ir = rng.standard_normal(irn) * np.exp(-np.arange(irn) / SR * 3.2); ir[0] = 0
def conv(x):
    m = len(x) + irn; n = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]
L += 0.01 * conv(L); R += 0.01 * conv(R)
pre = np.stack([L, R], 1)
pre /= np.max(np.abs(pre[: int(RV * SR)])) + 1e-9; pre *= 0.8

# splice into the original score at the reveal
with wave.open(sys.argv[3]) as w:
    orig = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(float).reshape(-1, 2) / 32767
ri = int(RV * SR); xf = int(0.12 * SR)
out = orig[: int(D * SR)].copy()
out[: ri - xf] = pre[: ri - xf]
k = np.linspace(0, 1, xf)[:, None]
out[ri - xf: ri] = pre[ri - xf: ri] * (1 - k) + orig[ri - xf: ri] * k
with wave.open(sys.argv[4], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes())
print("ok", style, D)
