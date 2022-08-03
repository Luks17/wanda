
import { connectToWA } from "./lib/wa_connection";


async function main(): Promise<void> {
  await connectToWA();
}

main();
