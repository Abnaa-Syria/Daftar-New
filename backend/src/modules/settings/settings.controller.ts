import { Request, Response, NextFunction } from "express";
import * as service from "./settings.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.getAll()); } catch (err) { next(err); }
}
export async function upsert(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.upsert(req.body.key, req.body.value, req.body.group)); } catch (err) { next(err); }
}
export async function bulkUpsert(req: Request, res: Response, next: NextFunction) {
  try { await service.bulkUpsert(req.body.settings); ApiResponse.success(res, null, "تم تحديث الإعدادات"); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await service.remove(req.params.key as string); ApiResponse.success(res, null, "تم الحذف"); } catch (err) { next(err); }
}
