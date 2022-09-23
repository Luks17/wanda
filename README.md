# Wanda - An Audio Transcripter Bot for WhatsApp

  Wanda is a WhatsApp bot that receives audio messages and sends back the text transcript.

## Setup and Usage

  Node, Python and FFmpeg are required. Windows is not supported.

### Instalation

  ```bash
  $ git clone https://github.com/Luks17/wanda.git && cd ./wanda
  $ chmod +x ./run.sh && ./run.sh
  ```

  Wait for the instalation and scan the QR Code when prompted.
  
  Alternatively, if you don't want to use curl, create the models directory manually, download and extract each model and place them there. Then just use run.sh and it should work normally.

### Usage

  Go to where wanda is located and use run.sh again:

  ```bash
  $ ./run.sh
  ```

## Roadmap

- [x] Basic WhatsApp connection and functionality;
- [x] Retrieve audio files from socket;
- [x] Audio to transcription backend;
- [x] Multiple languages support;
- [x] Finish project.
