import { Router } from "express";
import * as ctrl from "./media.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

const router = Router();
router.use(authenticate);

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.post("/upload", authorize("SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "EDITOR", "MEDIA_MANAGER"), upload.single("file"), ctrl.upload);
router.post("/upload-multiple", authorize("SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "EDITOR", "MEDIA_MANAGER"), upload.array("files", 20), ctrl.uploadMultiple);
router.put("/:id", ctrl.update);
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN", "MEDIA_MANAGER"), ctrl.remove);

export default router;
