
from vosk import KaldiRecognizer, Model, SetLogLevel
import sys
import wave
import json
import os

filePath = sys.argv[1]
language = sys.argv[2]

# assigns each language to the environment variables declared in run.sh
languages = {
    "pt": os.environ["PORTUGUESE_MODEL"],
    "es": os.environ["SPANISH_MODEL"],
    "en-us": os.environ["ENGLISH_MODEL"]
}

# gets model using the environment variable MODELS_DIR declared in run.sh
path_to_model = os.path.join(os.environ["MODELS_DIR"], languages[language])

SetLogLevel(-1) # disables debug messages

wf = wave.open(filePath, "rb")
# checks if audio file has the correct type and encodings
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    print(wf.getnchannels())
    print(wf.getsampwidth())
    print(wf.getcomptype())
    exit(1)

model = Model(lang=language, model_path=path_to_model)

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