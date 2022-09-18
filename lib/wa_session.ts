
import { AnyMessageContent, delay, proto, WASocket } from "@adiwajshing/baileys"
import { downloadAudioMessage } from "./wa_download_audio";
import { speechToText } from "./speech_to_text";


export class SessionHandler {
  readonly sock: WASocket;
  readonly remoteJid: string;
  selectedLanguage: string;
  availableLanguages: Array<string>;

  constructor(socket: WASocket, remoteJid: string) {
    this.sock = socket;
    this.remoteJid = remoteJid;
    this.selectedLanguage = "";
    this.availableLanguages = [
      "en-us",
      "es",
      "pt"
    ]
  }

  static getReceivedMessageType(receivedMessage: proto.IWebMessageInfo): string {
    // gets messageType by getting the first key name from the object receivedMessage.message
    return Object.keys(receivedMessage.message!)[0];
  }

  private async compose(msg: AnyMessageContent): Promise<proto.WebMessageInfo | undefined> {
    await this.sock.presenceSubscribe(this.remoteJid);
    await delay(500);

    await this.sock.sendPresenceUpdate('composing', this.remoteJid);
    await delay(2000);

    await this.sock.sendPresenceUpdate('paused', this.remoteJid);

    return await this.sock.sendMessage(this.remoteJid, msg);
  }

  private async defaultMessage(): Promise<void> {
    switch (this.selectedLanguage) {
      case "en-us":
        this.compose({ text: "Hello There! Send me an audio." });
        break;
      case "pt":
        this.compose({ text: "Olá! Me mande um áudio." });
        break;
      case "es":
        this.compose({ text: "¡Hola! Enviame un audio." });
        break;
    }
  }

  private async defaultErrorMessage(): Promise<void> {
    switch (this.selectedLanguage) {
      case "en-us":
        this.compose({ text: "Something went wrong! Try again later." });
        break;
      case "pt":
        this.compose({ text: "Algo deu errado, tente novamente mais tarde." });
        break;
      case "es":
        this.compose({ text: "Algo salió mal, inténtelo de nuevo más tarde." });
        break;
    }
  }

  async sendLanguageButtons(): Promise<void> {
    const buttons = [
      {buttonId: 'en-us', buttonText: {displayText: 'English'}, type: 1},
      {buttonId: 'pt', buttonText: {displayText: 'Português'}, type: 1},
      {buttonId: 'es', buttonText: {displayText: 'Español'}, type: 1}
    ]

    const buttonMessage = {
      text: "Escolha uma linguagem",
      footer: "Selecione uma das opções abaixo 👇",
      buttons: buttons,
      headerType: 1
    }

    this.compose(buttonMessage);
  }

  selectLanguage(languageCode: string): void {
    if(this.availableLanguages.includes(languageCode)) {
      this.selectedLanguage = languageCode;
    }
    else {
      throw new Error("Invalid language code");
    }
  }

  async reply(receivedMessage: proto.IWebMessageInfo): Promise<void> {
    // ignores the message if no language is selected
    if(this.selectedLanguage.length === 0)
      return;

    const messageType = SessionHandler.getReceivedMessageType(receivedMessage);
    if (messageType === "audioMessage") {
      downloadAudioMessage(receivedMessage).then(async outputLocation => {
        const speechTranscription = await speechToText(outputLocation, this.selectedLanguage);
        this.compose({ text: speechTranscription });
      })
      .catch(err => {
        console.log(err);
        this.defaultErrorMessage();
      })
    }
    else {
      this.defaultMessage();
    }
  }
}
