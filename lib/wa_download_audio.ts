
import { downloadMediaMessage, proto } from "@adiwajshing/baileys";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { opusToWav } from "./opus_to_wav";
import { newRandomId } from "./random_id";


export function downloadAudioMessage(receivedMessage: proto.IWebMessageInfo): Promise <string> {
  return new Promise(async (resolve, reject) => {
    const buffer = await downloadMediaMessage(receivedMessage, "buffer", {});
    const mediaDir = path.join(__dirname, "..", "media");
    const downloadedAudioName = newRandomId(12) + ".opus";

    // creates directory media if it does exist
    try { await mkdir(mediaDir); }
    catch (err: any) {
      if (err.code !== "EEXIST") {
        console.log(err);
        reject(new Error("Could not create media folder"));
      }
    }
    try { await writeFile(path.join(mediaDir, downloadedAudioName), buffer); }
    catch (err) {
      console.log(err);
      reject(new Error(`Could not write buffer to ${downloadAudioMessage}`));
    }

    try {
      const outputLocation = await downloadedAudioHandler(mediaDir, downloadedAudioName);
      resolve(outputLocation);
    }
    catch(err) { reject(err); }
  });
}

function downloadedAudioHandler(mediaDir: string, downloadedAudioName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const downloadedAudioLocation = path.join(mediaDir, downloadedAudioName);
    // basically uses the same file name but replaces its extension with .wav
    const outputAudioLocation = path.join(mediaDir, downloadedAudioName.replace(/\..+/g, "") + ".wav");

    //converts audio to wav
    opusToWav(downloadedAudioLocation, outputAudioLocation).then(code => {
      if (code !== 0) {
        reject(new Error("Could not convert opus to wav"));
      }
      // deletes the original opus file
      unlink(path.join(mediaDir, downloadedAudioName));

      resolve(outputAudioLocation);
    });
  });
}
