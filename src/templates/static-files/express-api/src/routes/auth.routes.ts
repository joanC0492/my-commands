import { Router } from "express";
import { check } from "express-validator";
import { loginUser, validateToken } from "../controllers/auth.controller";
import { validateFields, validateJwt } from "../middlewares";

const router: Router = Router();

// http://localhost:4001/api/v1/auth
// Login
router.post(
  "/",
  [
    check("email").isEmail().withMessage("El email es obligatorio"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
    validateFields,
  ],
  loginUser
);

// http://localhost:4001/api/v1/auth/renew
// Renovar Token
router.get("/renew", validateJwt, validateToken);

export default router;