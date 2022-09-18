
import { spawn } from "child_process";
import path from "path";


export function speechToText(audioLocation: string, languageCode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      path.join(__dirname, "..", "..", "venv", "bin", "python"),
      [path.join(__dirname, "..", "..", "python_scripts", "speech_recognition.py"), audioLocation, languageCode],
    );

    pythonProcess.stdout.on("data", data => {
      resolve(data.toString());
    })
    pythonProcess.stderr.on("data", data => {
      console.log(data.toString());
      reject(new Error("Something went wrong during speech recognition."));
    })
    pythonProcess.on("close", code => {
      console.log(`Python process exited with code ${code}.`);
    })
  })
}
