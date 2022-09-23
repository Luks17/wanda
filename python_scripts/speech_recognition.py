
from vosk import KaldiRecognizer, Model, SetLogLevel
import sys
import wave
import json
import os

filePath = sys.argv[1]
language = sys.argv[2]

languages = {
    "pt": "vosk-model-pt-fb-v0.1.1-20220516_2113",
    "es": "vosk-model-es-0.42",
    "en": "vosk-model-en-us-0.22"
}

SetLogLevel(-1) # disables debug messages

wf = wave.open(filePath, "rb")
# checks if audio file has the correct type and encodings
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    print(wf.getnchannels())
    print(wf.getsampwidth())
    print(wf.getcomptype())
    exit(1)

model = Model(model_name=languages[language])

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

os.remove(filePath)