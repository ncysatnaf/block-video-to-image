#!/bin/sh

# ./gif_extract_quality.sh input.mkv output.gif

palette="/tmp/palette.png"

start=10:38
duration=10

filters="fps=15,scale=320:-1:flags=lanczos"

ffmpeg -v warning -ss $start -t $duration -i $1 -vf "$filters,palettegen" -y $palette
ffmpeg -v warning -ss $start -t $duration -i $1 -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y $2