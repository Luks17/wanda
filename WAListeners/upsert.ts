
import { isJidUser, WASocket } from "@adiwajshing/baileys";
import { SessionHandler } from "../lib/wa_session";
import { selectSessionLanguage, sessionsLifeSpanHandler } from "../lib/session_utils";


// handles pending received messages
export async function upsertHandler(sock: WASocket): Promise<WASocket> {
  const activeSessions = new Map();
  sessionsLifeSpanHandler(activeSessions);

  sock.ev.on('messages.upsert', async upsert => {

    // Only checks for messages that are sent when wanda is online
    if (upsert.type === "notify") {
      console.log(JSON.stringify(upsert, undefined, 2));
      for (const m of upsert.messages) {
        await sock.readMessages([m.key]);
        const remoteJid = m.key.remoteJid!;
        /* 
        Answers message if it's not from themselves AND the message is from an user (not a group, broadcast, business, etc) AND
        the message contains text or media.
        */
        if (!m.key.fromMe && isJidUser(remoteJid) && m.message) {
          let sessionHandler: SessionHandler;

          // checks if a session with the jid already exists, creating one if it does not and restoring it if it does
          if(!activeSessions.has(remoteJid)) {
            sessionHandler = new SessionHandler(sock, remoteJid);
            sessionHandler.sendLanguageButtons();
            activeSessions.set(remoteJid, sessionHandler);
          }
          else {
            sessionHandler = activeSessions.get(remoteJid);
            sessionHandler.refreshLifeSpan();
            selectSessionLanguage(sessionHandler, m.message);
            sessionHandler.reply(m)
          }
        }
      }
    }
  })

  return sock;
}

