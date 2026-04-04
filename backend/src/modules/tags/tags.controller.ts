import { Request, Response, NextFunction } from "express";
import * as tagsService from "./tags.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try { const { data, meta } = await tagsService.list(req.query as never); ApiResponse.paginated(res, data, meta); } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await tagsService.getById(parseInt(req.params.id))); } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.created(res, await tagsService.create(req.body)); } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await tagsService.update(parseInt(req.params.id), req.body)); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await tagsService.remove(parseInt(req.params.id)); ApiResponse.success(res, null, "تم حذف الوسم"); } catch (err) { next(err); }
}
