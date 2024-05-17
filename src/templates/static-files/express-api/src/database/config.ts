import mongoose, { connect } from "mongoose";
import { config } from "../config";

export const dbConnection = async (): Promise<string> => {
  let message: string = "";
  try {
    mongoose.set("strictQuery", false); // Da un error
    await connect(config.dbConnection);
    message += "Conectado a mongo :)";
  } catch (error) {
    if (error instanceof Error)
      message += `Error al inicializar la BD: \`${error.message}\``;
  } finally {
    return message;
  }
};
