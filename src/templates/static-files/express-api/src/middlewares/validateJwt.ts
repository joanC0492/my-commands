import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserModel } from "../models/user";
import { Payload } from "../domain/types";
import { UserFromDb } from "../domain/user";

export const validateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-token");
  if (!token)
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });

  try {
    const payload = jwt.verify(token, config.secretJwtSeed) as Payload;
    const userAuthenticated: UserFromDb | null = await UserModel.findById(
      payload.uid
    );

    if (userAuthenticated === null)
      return res.status(401).json({
        msg: "Usuario no registrado",
      });

    if (userAuthenticated.state === false)
      return res.status(401).json({
        msg: "Usuario no habilitado",
      });

    // Pasamos la data obtenida del JWT al "req.auth"
    // Esto lo definimos en types como global
    req.auth = {
      uidAuthenticated: payload.uid,
      nameAuthenticated: payload.name,
    };
    
  } catch (error) {
    let msg = "";
    if (error instanceof Error) msg += error.message;
    return res.status(500).json({
      ok: false,
      msg: `Token no valido | ${msg}`,
    });
  }
  next();
};
