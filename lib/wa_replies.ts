
import { AnyMessageContent, delay, proto, WASocket } from "@adiwajshing/baileys"
import { downloadAudioMessage } from "./wa_download_audio";
import { speechToText } from "./speech_to_text";


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

  async reply(): Promise<void> {
    const messageType = this.getReceivedMessageType();
    if (messageType === "audioMessage") {
      downloadAudioMessage(this.receivedMessage).then(async outputLocation => {
        const speechTranscription = await speechToText(outputLocation);
        this.compose({ text: speechTranscription });
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
