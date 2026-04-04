import { Router } from "express";
import * as sectionsController from "./sections.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createSectionSchema, updateSectionSchema } from "./sections.schema";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF"));

router.get("/", sectionsController.list);
router.get("/:id", sectionsController.getById);
router.post("/", validate(createSectionSchema), sectionsController.create);
router.put("/:id", validate(updateSectionSchema), sectionsController.update);
router.delete("/:id", sectionsController.remove);

export default router;
