import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "./auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);
router.post("/refresh", authController.refresh);

export default router;
