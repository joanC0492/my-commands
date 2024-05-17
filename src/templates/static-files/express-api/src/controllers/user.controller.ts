import { Request, Response } from "express";
import { RequestCreateUser } from "../domain/user";
import { userService } from "../services/user.service";

const createUser = async (req: Request, res: Response): Promise<void> => {
  const request = req.body as RequestCreateUser;
  const { status, ...restResult } = await userService.createUser(request);
  res.status(status).json(restResult);
};

export { createUser };