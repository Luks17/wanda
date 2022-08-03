
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

export async function connectToWA() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "cache", "auth_info.json")
  )

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  })

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom).output?.statusCode !== DisconnectReason.loggedOut
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWA()
      }
    } else if (connection === 'open') {
      console.log('opened connection')
    }
  })


  return sock;
};
