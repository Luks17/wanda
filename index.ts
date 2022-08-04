
import { connectToWA } from "./lib/wa_connection";
import { answerMsg } from "./lib/wa_answers";


async function main(): Promise<void> {
  const sock = await connectToWA();

  await answerMsg(sock);
}

main();
