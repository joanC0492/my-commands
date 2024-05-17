import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user";
import { generateJwt } from "../helpers";
import { RequestCreateUser, ResponseCreateUser } from "../domain/user";

const createUser = async (
  request: RequestCreateUser
): Promise<ResponseCreateUser> => {
  const { password } = request;
  try {
    // Create new Model
    const userDoc = new UserModel(request);
    // Encrypt Password
    const salt = bcryptjs.genSaltSync(10);
    userDoc.password = bcryptjs.hashSync(password, salt);
    // Save in MongoDB
    await userDoc.save();
    // Generate JWT
    const token = await generateJwt(userDoc.id, userDoc.name);

    return {
      ok: true,
      status: 201,
      data: {
        uid: userDoc.id,
        name: userDoc.name,
        token,
      },
    };
  } catch (error) {
    let msg = "";
    if (error instanceof Error) msg += error.message;
    return {
      ok: false,
      status: 500,
      msg,
    };
  }
};

export const userService = {
  createUser,
};
