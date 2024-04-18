ffmpeg -i ./uploads/* -ar 16000 -ac 1 -c:a pcm_s16le ./uploads/output.wav
