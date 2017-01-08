#!/bin/sh

# ./keyframe_extract.sh input.mkv

ffmpeg -i $1 -vf "select=eq(pict_type\,I)" -vsync vfr "./example/keyframe_extract/"$1"%04d.jpg" -hide_banner
# ffmpeg -i $INPUT -vf "fps=1,scale=320:-1:flags=lanczos" $INPUT%04d.jpg -hide_banner
