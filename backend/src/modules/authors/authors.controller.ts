import { Request, Response, NextFunction } from "express";
import * as authorsService from "./authors.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try { const { data, meta } = await authorsService.list(req.query as never); ApiResponse.paginated(res, data, meta); } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await authorsService.getById(parseInt(req.params.id as string))); } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.created(res, await authorsService.create(req.body)); } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await authorsService.update(parseInt(req.params.id as string), req.body)); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await authorsService.remove(parseInt(req.params.id as string)); ApiResponse.success(res, null, "تم حذف الكاتب"); } catch (err) { next(err); }
}
