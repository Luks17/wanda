
from vosk import KaldiRecognizer, Model, SetLogLevel
import sys
import wave
import json

SetLogLevel(-1) # disables debug messages

wf = wave.open(sys.argv[1], "rb")
# checks if audio file has the correct type and encodings
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    print(wf.getnchannels())
    print(wf.getsampwidth())
    print(wf.getcomptype())
    exit(1)

model = Model(lang="pt")

rec = KaldiRecognizer(model, wf.getframerate())
rec.SetWords(True)
rec.SetPartialWords(True)

while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        pass

print(json.loads(rec.FinalResult())["text"])
