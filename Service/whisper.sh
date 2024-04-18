ffmpeg -i ./uploads/* -ar 16000 -ac 1 -c:a pcm_s16le ./uploads/output.wav
./whisper.cpp/main -m /Users/derekashby/Library/CloudStorage/OneDrive-BrighamYoungUniversity/ML/Winter2024/CS260/Startup/Service/whisper.cpp/models/ggml-base.bin -f ./uploads/output.wav -otxt -of ./downloads/output
# ./whisper.cpp/main -m /home/ubuntu/services/startup/whisper.cpp/models/ggml-base.bin -f ./uploads/output.wav -otxt -of ./downloads/output
