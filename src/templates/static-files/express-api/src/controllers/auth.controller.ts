import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RequestLoginUser, RequestValidateToken } from "../domain/auth";

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const request = req.body as RequestLoginUser;
  const { status, ...restResult } = await authService.loginUser(request);
  res.status(status).json(restResult);
};

const validateToken = async (req: Request, res: Response): Promise<void> => {  
  const { status, ...restResult } = await authService.validateToken(req.auth!);
  console.log(restResult);
  res.status(status).json(restResult);
};

export { loginUser, validateToken };