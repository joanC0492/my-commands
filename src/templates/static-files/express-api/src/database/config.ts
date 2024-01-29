import mongoose, { connect } from "mongoose";
import { config } from "../config/config";

export const dbConnection = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false); // Da un error
    await connect(config.dbConnection!);
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciralizar la BD");
  }
};
