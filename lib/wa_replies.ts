
import { AnyMessageContent, delay, proto, WASocket } from "@adiwajshing/baileys"
import { downloadAudioMessage } from "./wa_download_audio";


export class ReplyHandler {
  readonly sock: WASocket;
  readonly receivedMessage: proto.IWebMessageInfo;
  readonly remoteJid: string;

  constructor(socket: WASocket, receivedMessage: proto.IWebMessageInfo) {
    this.sock = socket;
    this.receivedMessage = receivedMessage;
    this.remoteJid = receivedMessage.key.remoteJid!;
  }

  getReceivedMessageType(): string {
    // gets messageType by getting the first key name from the object receivedMessage.message
    return Object.keys(this.receivedMessage.message!)[0];
  }

  private async compose(msg: AnyMessageContent): Promise<void> {
    await this.sock.presenceSubscribe(this.remoteJid);
    await delay(500);

    await this.sock.sendPresenceUpdate('composing', this.remoteJid);
    await delay(2000);

    await this.sock.sendPresenceUpdate('paused', this.remoteJid);

    await this.sock.sendMessage(this.remoteJid, msg);
  }

  private async speechToText(audioLocation: string): Promise<void> {
    console.log("to be implemented");
    // const childPython = spawn("python", [path.join(__dirname, "..", "..", "scripts", "speech_recognition.py")]);
    // childPython.stdout.on("data", data => console.log(`Python stdout: ${data}`));
    // childPython.stderr.on("data", data => console.log(`Python stderr: ${data}`));
    // childPython.on("close", code => console.log(`Python Script exited with code ${code}`));
  }

  async reply(): Promise<void> {
    const messageType = this.getReceivedMessageType();
    if (messageType === "audioMessage") {
      downloadAudioMessage(this.receivedMessage).then(outputLocation => {
        this.speechToText(outputLocation);
      })
      .catch(err => {
        console.log(err);
        this.compose({ text: "Something went wrong! Try again later.\nAlgo deu errado, tente novamente mais tarde." });
      })
    }
    else {
      this.compose({ text: "Hello There! Send me an audio.\nOlá! Me mande um audio." });
    }
  }
}
