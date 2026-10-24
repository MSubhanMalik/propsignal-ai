#!/usr/bin/env bash
# Mix the final soundtrack and mux it onto the silent render.
#   scripts/mix.sh <silent.mp4> <music.wav> <out.mp4> [--street street.wav] [--voice voice.wav@SECONDS ...]
# Music ducks under voices (sidechain), street sound plays on top, result is loudness-normalised to -15 LUFS.
set -euo pipefail
SILENT="$1"; MUSIC="$2"; OUT="$3"; shift 3
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SILENT")
IN=(-i "$MUSIC"); FC="[0]volume='if(lt(t,3.4),0.25+0.22*t,1)':eval=frame,volume=0.55[m];"; n=1; VO=(); ST=""
while [ $# -gt 0 ]; do case "$1" in
  --street) IN+=(-i "$2"); ST="[$n]volume=1.1,apad=whole_dur=$DUR[st];"; STL="[st]"; n=$((n+1)); shift 2;;
  --voice) f="${2%@*}"; at="${2##*@}"; ms=$(python3 -c "print(int(float('$at')*1000))"); IN+=(-i "$f")
           FC+="[$n]adelay=$ms|$ms,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=1.6,aformat=channel_layouts=stereo,apad=whole_dur=$DUR[v$n];"; VO+=("[v$n]"); n=$((n+1)); shift 2;;
  *) echo "unknown arg $1"; exit 1;; esac; done
if [ ${#VO[@]} -gt 0 ]; then
  FC+="$(printf '%s' "${VO[@]}")amix=inputs=${#VO[@]}:normalize=0,asplit[vk][vm];[m][vk]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md];"; LIST="[md][vm]"; K=2
else LIST="[m]"; K=1; fi
FC+="$ST"; [ -n "$ST" ] && LIST+="$STL" && K=$((K+1))
FC+="${LIST}amix=inputs=$K:normalize=0,alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5:LRA=11[a]"
ffmpeg -loglevel error -y "${IN[@]}" -filter_complex "$FC" -map "[a]" -ar 44100 /tmp/_parakh_mix.wav
ffmpeg -loglevel error -y -i "$SILENT" -i /tmp/_parakh_mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "$OUT"
echo "wrote $OUT"
