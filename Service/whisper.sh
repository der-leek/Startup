ffmpeg -i Test.m4a -ar 16000 -ac 1 -c:a pcm_s16le output.wav
./main -m /home/ubuntu/services/startup/whisper.cpp/models/ggml-base.bin -f output.wav -otxt -of output.txt
# ./main -m /Users/derekashby/Library/CloudStorage/OneDrive-BrighamYoungUniversity/ML/Winter2024/CS260/Startup/Service/whisper.cpp/models/ggml-base.bin -f output.wav -otxt -of output.txt
