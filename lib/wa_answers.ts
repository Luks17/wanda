
import { isJidUser, WASocket } from "@adiwajshing/baileys";


export async function answerMsg(sock: WASocket): Promise<WASocket> {

  // handles pending received messages
  sock.ev.on('messages.upsert', async upsert => {
    console.log(JSON.stringify(upsert, undefined, 2));

    for (const message of upsert.messages) {
      // reads message
      await sock.readMessages([message.key]);

      // answers message if it's not from themselves and the message is from an user (not a group, broadcast, business, etc)
      if (!message.key.fromMe && isJidUser(message.key.remoteJid!)) {
        await sock.sendMessage(message.key.remoteJid!, { text: "Hello There!" });
      }
    }
  })

  return sock;
}

