import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateJwt = (uid: string, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Save uid,name in Token
    const payload = { uid, name };
    // Permite saber al backend si el token es el que yo genere
    jwt.sign(
      payload,
      // Firmamos nuestro token
      config.secretJwtSeed,
      {
        expiresIn: "2h",
        // expiresIn: "20s",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        resolve(token!);
      }
    );
  });
};
