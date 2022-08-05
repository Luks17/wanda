
import { isJidUser, WASocket } from "@adiwajshing/baileys";
import { ReplyHandler } from "../lib/wa_replies";


// handles pending received messages
export async function upsertHandler(sock: WASocket): Promise<WASocket> {
  sock.ev.on('messages.upsert', async upsert => {

    // Only checks for messages that are sent when wanda is online
    if (upsert.type === "notify") {
      console.log(JSON.stringify(upsert, undefined, 2));
      for (const m of upsert.messages) {
        await sock.readMessages([m.key]);
        /* 
        Answers message if it's not from themselves AND the message is from an user (not a group, broadcast, business, etc) AND
        the message contains text or media.
        */
        if (!m.key.fromMe && isJidUser(m.key.remoteJid!) && m.message) {
          const replyHandler = new ReplyHandler(sock, m);

          await replyHandler.reply();
        }
      }
    }
  })

  return sock;
}

