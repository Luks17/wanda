
import { SessionHandler } from "./wa_session";
import { proto } from "@adiwajshing/baileys";


export function selectSessionLanguage(session: SessionHandler,message: proto.IMessage) {
  // checks if message is a button message response, ignores it if it is not
  if (message.buttonsResponseMessage) {
    // selects message for session if the message code is valid, throws error otherwise
    try {
      session.selectLanguage(message.buttonsResponseMessage.selectedButtonId!);
    }
    catch (err) {
      console.log(err);
    }
  }
}

export function sessionsLifeSpanHandler(activeSessions: Map<string, SessionHandler>): void {
  setInterval(() => {
    activeSessions.forEach((value: SessionHandler) => {
      value.progressLifeSpan();
      if(value.getSessionLifeSpan() === 0) {
        activeSessions.delete(value.getSessionRemoteJid());
        value.defaultGoodByeMessage();
        return;
      }
    })
  }, 100000);
}