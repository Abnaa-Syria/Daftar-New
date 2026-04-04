import { Request, Response, NextFunction } from "express";
import * as service from "./homepage.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.list()); } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.getById(parseInt(req.params.id))); } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.created(res, await service.create(req.body)); } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.update(parseInt(req.params.id), req.body)); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await service.remove(parseInt(req.params.id)); ApiResponse.success(res, null, "تم الحذف"); } catch (err) { next(err); }
}
export async function reorder(req: Request, res: Response, next: NextFunction) {
  try { await service.reorder(req.body.moduleIds); ApiResponse.success(res, null, "تم إعادة الترتيب"); } catch (err) { next(err); }
}
