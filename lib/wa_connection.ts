
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, WASocket } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from "path";


// returns socket with WA connection
export async function connectToWA(): Promise<WASocket> {
  // saves session and credentials in cache folder
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "cache")
  );

  const { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  // checks for connection updates and handles them
  sock.ev.on('connection.update', async update => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom).output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        await connectToWA();
      }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  return sock;
};
