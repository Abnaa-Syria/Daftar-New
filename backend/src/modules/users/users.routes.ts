import { Router } from "express";
import * as usersController from "./users.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createUserSchema, updateUserSchema } from "./users.schema";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/", usersController.list);
router.get("/:id", usersController.getById);
router.post("/", validate(createUserSchema), usersController.create);
router.put("/:id", validate(updateUserSchema), usersController.update);
router.delete("/:id", usersController.remove);

export default router;
