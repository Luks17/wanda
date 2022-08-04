
import { isJidUser, WASocket } from "@adiwajshing/baileys";


export async function answerMsg(sock: WASocket): Promise<WASocket> {

  // handles pending received messages
  sock.ev.on('messages.upsert', async upsert => {

    // Only checks for messages that are sent when wanda is online
    if (upsert.type === "notify") {
      console.log(JSON.stringify(upsert, undefined, 2));
      for (const m of upsert.messages) {
        // reads message
        await sock.readMessages([m.key]);

        /* 
        Answers message if it's not from themselves AND the message is from an user (not a group, broadcast, business, etc) AND
        the message contains text or media.
        */
        if (!m.key.fromMe && isJidUser(m.key.remoteJid!) && m.message) {

          // gets messageType by getting the first key name from the object m.message
          const messageType = Object.keys(m.message!)[0];
          if (messageType === "audioMessage") {

          }
          else {
            await sock.sendMessage(m.key.remoteJid!, { text: "Hello There! Send me an audio." });
          }
        }
      }

    }
  })

  return sock;
}

