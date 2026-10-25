"""Synthesize the Parakh teaser score. Usage: python3 music.py cues.json out.wav
cues.json: {"dur":25.5,"ticks":[0,3.4],"hits":[6.3,7.5,8.7],"rise":[10.2,14.0],"reveal":14.0,"beat":[18.6,24],"end":21.8}
"""
import json, sys
import numpy as np

SR = 44100
cues = json.load(open(sys.argv[1]))
D = cues["dur"]
N = int(SR * (D + 2.5))
L = np.zeros(N); R = np.zeros(N)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)

def hz(n):  # midi -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def env(n, a, d, s, r, hold):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    h = max(int(hold * SR) - a - d, 0)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(h, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))

from scipy.signal import lfilter
def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR)
    y = lfilter([1 - a], [1, -a], x)
    return lfilter([1 - a], [1, -a], y)

def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i >= N: return
    g = sig[: j - i] * gain
    L[i:j] += g * (1 - max(pan, 0)); R[i:j] += g * (1 + min(pan, 0))

def saw(f, dur, det=0.0):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for k in range(1, 14):
        if f * k > 9000: break
        out += np.sin(2 * np.pi * f * (1 + det) * k * t) / k
    return out

def pad(notes, at, dur, gain, cut=1200, a=1.5, r=2.0):
    n = int((dur + r) * SR)
    for m in notes:
        for det, pan in ((-0.004, -0.5), (0.004, 0.5)):
            s = saw(hz(m), dur + r, det)[:n]
            s = lowpass(s, cut) * env(n, a, 0.5, 0.8, r, dur)
            place(s, at, gain / len(notes), pan)

def pluck(m, at, gain, dec=1.2, pan=0.0):
    n = int((dec + 0.1) * SR); t = np.arange(n) / SR
    f = hz(m)
    s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t / (dec / 4))
    s *= np.minimum(1, t / 0.004)
    place(s, at, gain, pan)

def boom(at, gain=0.9):
    n = int(1.6 * SR); t = np.arange(n) / SR
    f = 55 * np.exp(-t * 3) + 32
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.4)
    nz = lowpass(rng.standard_normal(n), 500) * np.exp(-t * 14) * 0.15
    place(s + nz, at, gain)

def kick(at, gain=0.55):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 110 * np.exp(-t * 28) + 45
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    place(s, at, gain)

def tick(at, gain=0.18):
    n = int(0.05 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160)
    place(s, at, gain, pan=0.3)

def riser(a, b, gain=0.35):
    n = int((b - a) * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # sweep: blend increasingly bright noise
    lo = lowpass(x, 600); hi = x - lowpass(x, 2500)
    k = (t / t[-1]) ** 2
    s = (lo * (1 - k) + hi * k) * k * 0.8
    f = 110 + 330 * k
    s += 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * k
    place(s, a, gain)

def reverse_swell(at, len_=0.7, gain=0.3):
    n = int(len_ * SR); t = np.arange(n) / SR
    s = lowpass(rng.standard_normal(n), 1800) * (t / t[-1]) ** 3
    place(s, at - len_, gain)

def whoosh(at, len_=0.45, gain=0.28, pan=0.0):
    n = int(len_ * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    k = np.sin(np.pi * t / t[-1]) ** 2
    u = t / t[-1]; s = ((x - lowpass(x, 500)) * (1 - u) + (x - lowpass(x, 2800)) * u) * k
    place(s, at - len_ * 0.6, gain, pan)
for w in cues.get("whoosh", []):
    whoosh(w, 0.5, 0.3)
# --- arrangement ---
dm, bb, f_, c_ = [38, 45, 50, 53], [34, 41, 46, 50], [41, 48, 53, 57], [36, 43, 48, 52]
# Opening drone (dark, D minor)
pad([26, 38, 45], 0.0, cues["reveal"] - 0.2, 0.45, cut=500, a=1.2, r=0.6)
for x in np.arange(cues["ticks"][0] + 0.2, cues["ticks"][1], 0.25):
    tick(x, 0.14)
# Word hits
for h in cues["hits"]:
    boom(h, 0.6)
# Shimmer arpeggio over scattered sources
arp = [62, 65, 69, 72, 69, 65]
a0, a1 = cues["rise"]
for i, x in enumerate(np.arange(a0, a1 - 0.2, 0.2)):
    pluck(arp[i % len(arp)], x, 0.12, 0.8, pan=(-0.4 if i % 2 else 0.4))
riser(a0 + 0.6, a1, 0.32)
# Reveal: impact + warm progression
rv = cues["reveal"]
boom(rv, 1.0)
prog = [(bb, 2.3), (f_, 2.3), (c_, 2.3), (dm, 4.0)]
x = rv
for chord, ln in prog:
    if x > D: break
    pad(chord, x, ln, 0.34, cut=1800, a=0.25, r=1.2)
    x += ln
# Piano-like motif after reveal
mot = [74, 72, 69, 72, 77, 76, 72, 69]
for i, xx in enumerate(np.arange(rv + 0.6, D - 1.2, 0.42)):
    pluck(mot[i % len(mot)], xx, 0.16, 1.4, pan=0.15 * ((i % 3) - 1))
# Soft pulse
b0, b1 = cues["beat"]
for xx in np.arange(b0, b1, 0.5):
    kick(xx, 0.42)
boom(cues["end"], 0.85)
pad([50, 57, 62, 65], cues["end"], max(D - cues["end"] - 0.5, 1), 0.3, cut=2200, a=0.1, r=2.2)

# --- reverb (FFT convolution with decaying noise) ---
irn = int(2.2 * SR); ti = np.arange(irn) / SR
ir = rng.standard_normal(irn) * np.exp(-ti * 2.6); ir[0] = 0
def conv(x):
    m = len(x) + irn
    nfft = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
wetL, wetR = conv(L), conv(R)
L2 = L + 0.012 * wetL; R2 = R + 0.012 * wetR
mix = np.stack([L2, R2], 1)
mix = mix[: int(SR * D)]
fade = int(1.5 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
import wave
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("music ok", D)
