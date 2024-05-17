import { Router } from "express";
import { check } from "express-validator";
import { createUser } from "../controllers/user.controller";
import { emailExist } from "../helpers";
import { validateFields } from "../middlewares";

const router: Router = Router();

// http://localhost:4001/api/v1/user/new
router.post(
  "/new",
  [
    check("name").notEmpty().withMessage("El nombre es obligatorio"),
    check("email").isEmail().withMessage("El email es obligatorio"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
      .withMessage(
        "La contraseña debe contener al menos un número, una letra mayúscula, una letra minúscula y un carácter especial(!@#$%^&*)"
      ),
    check("email").custom(emailExist),
    validateFields,
  ],
  createUser
);

export default router;
