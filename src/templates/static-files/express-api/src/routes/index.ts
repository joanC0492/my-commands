import { Application, Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

export const routerApi = (app: Application) => {
  const router = Router();

  app.use("/api/v1", router);
  router.use("/auth", authRouter);
  router.use("/user", userRouter);
};