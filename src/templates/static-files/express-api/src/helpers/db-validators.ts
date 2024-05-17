import { UserModel } from "../models/user";

// Da error si el email existe en la coleccion users
export const emailExist = async (email = ""): Promise<void> => {
  const hasEmail = await UserModel.findOne({ email });
  if (!!hasEmail)
    throw new Error(`El email '${email}' ya esta registrado en la BD`);
};