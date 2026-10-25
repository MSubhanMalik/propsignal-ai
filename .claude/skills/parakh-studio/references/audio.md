# Parakh audio

## What works (from feedback)
- **Real sound first**: street/traffic/rickshaw ambience from the footage itself at the start (0–6s), fading
  out as the story turns.
- **Music**: dark D-minor drone under the problem → shimmer arpeggio + rising riser into the reveal → impact
  hit → warm Bb–F–C–Dm progression with a soft piano-like motif and gentle kick pulse to the end.
- **Sparse sound design**. Users disliked "too many sand sounds". Keep whooshes to 2–3 per film (the two on
  "The truth was always public" and its line change were loved). Hits only on story beats (file card, stamp
  flip, bars, reveal, end card). Soft clock ticks only under a year counter.
- **Voice**: no synthetic narrator (sounds AI). Options: (a) no voice; (b) a real person's phone voice memo;
  (c) the short synthetic Urdu tag "جلد آ رہا ہے" at the end (Kokoro `hm_omega`, lang `hi`) — this was liked.

## Generate the music
`scripts/music.py` synthesises the score to WAV from a cues file (all times in seconds):
```json
{"dur":36.4,"ticks":[7.4,9.8],"hits":[6.7,12.75,16.2],"rise":[18.6,23.4],"reveal":23.4,
 "beat":[28.2,35],"end":31.6,"whoosh":[18.4,20.6]}
```
`ticks` = [start,end] of soft ticks ([0,0] for none) · `hits` = low booms · `rise` = arpeggio + riser window
ending at the reveal · `reveal` = impact + chord progression start · `beat` = soft kick window · `end` = final
hit + bright pad · `whoosh` = list of whoosh times.
`python3 scripts/music.py cues.json music.wav` (needs numpy + scipy; ~5s).

## Optional Urdu voice tag
```bash
pip install kokoro-onnx soundfile
curl -L -o kokoro.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
curl -L -o voices.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
python3 -c "import soundfile as sf;from kokoro_onnx import Kokoro;k=Kokoro('kokoro.onnx','voices.bin');a,sr=k.create('जल्द आ रहा है।',voice='hm_omega',speed=0.95,lang='hi');sf.write('jald.wav',a,sr)"
```
(Hindi text produces Urdu-identical speech. Place it ~0.1s after the Urdu text appears.)

## Mix
`scripts/mix.sh silent.mp4 music.wav final.mp4 --street img/clip.wav --voice jald.wav@34.0`
Music fades up over the first 3.4s under the street sound, ducks under voices (sidechain), and the master is
normalised to −15 LUFS (social-media loudness), true peak −1.5 dB.

## Alternative scores (keep the reveal)
`scripts/music_styles.py <style> cues.json reveal_score.wav out.wav` writes a new score up to the logo reveal and
splices in the original score from the reveal on (the approved reveal music stays identical).
- `desi`: tanpura drone + tabla-style hand percussion (keherwa pattern) + plucked melody in a Bhairav-like scale.
  Used for the words teaser. Cues: `{"dur","reveal","hits":[...],"perc":[start,end]}`.
- `pizz`: pizzicato ostinato + ticking hats + a hard silence on the stamp flip + low pulse under the punchline.
  Used for "Approved doesn't mean safe". Cues: `{"dur","reveal","silence":[t,len],"pulse":[start,end]}`.
