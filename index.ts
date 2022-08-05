
import { connectToWA } from "./WAListeners/connection";
import { upsertHandler } from "./WAListeners/upsert";


async function main(): Promise<void> {
  const sock = await connectToWA();

  await upsertHandler(sock);
}

main();
