import { Router } from "express";
import * as articlesController from "./articles.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createArticleSchema, updateArticleSchema } from "./articles.schema";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "EDITOR", "AUTHOR"));

router.get("/", articlesController.list);
router.get("/:id", articlesController.getById);
router.post("/", validate(createArticleSchema), articlesController.create);
router.put("/:id", validate(updateArticleSchema), articlesController.update);
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF"), articlesController.remove);

export default router;
