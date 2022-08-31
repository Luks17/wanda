
import { spawn } from "child_process";
import path from "path";


export function opusToWav(downloadedAudioLocation: string, outputAudioLocation: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffmpeg_process = spawn("ffmpeg", ["-i", downloadedAudioLocation, "-c:a", "pcm_s24le", outputAudioLocation]);

    ffmpeg_process.stdout.on("data", data => console.log(`Converting ${path.basename(downloadedAudioLocation)} to wav`));
    ffmpeg_process.stderr.on("data", data => console.log(data));
    ffmpeg_process.on("close", code => {
      if(code != null) {
        console.log(`Process exited with code ${code}`);
        resolve(code);
      }
      reject(-1);
    });
  });
}
