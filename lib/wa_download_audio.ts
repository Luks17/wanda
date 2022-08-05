
import { downloadMediaMessage, proto } from "@adiwajshing/baileys";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function downloadAudioMessage(receivedMessage: proto.IWebMessageInfo): Promise <void> {
  const buffer = await downloadMediaMessage(receivedMessage, "buffer", {});

  // creates directory media if it does exist
  try { await mkdir(path.join(__dirname, "..", "media")); }
  catch(err: any) {
    if (err.code !== "EEXIST")
      return console.log(err);
  }
  try { await writeFile(path.join(__dirname, "..", "media", "audio.opus"), buffer); }
  catch (err) { return console.log(err); }
}
