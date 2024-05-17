import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { config } from "./config";
import { dbConnection } from "./database";
import { routerApi } from "./routes";

export class Server {
  private app: Application;
  private readonly PORT = config.port;

  constructor() {
    // express
    this.app = express();
    // database
    this.getConnectionDB();
    // middlewares
    this.middlewares();
    // routes
    this.routes();
  }

  private async getConnectionDB(): Promise<void> {
    const res = await dbConnection();
    console.log(res);
  }

  private middlewares(): void {
    // solicitud http
    this.app.use(morgan("dev"));
    // whitelist
    this.app.use(cors());
    // Parseo body
    this.app.use(express.json());
    // "public"
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private routes(): void {
    routerApi(this.app);
  }

  public listen(): void {
    this.app.listen(this.PORT, () =>
      console.log(`Escuchando el puerto: ${this.PORT}`)
    );
  }
}