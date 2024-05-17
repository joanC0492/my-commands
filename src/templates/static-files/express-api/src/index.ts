console.clear();
import { Server } from "./app";

const main = (): void => {
  const app = new Server();
  app.listen();
};

main();