import { Request, Response, NextFunction } from "express";
import * as service from "./breaking.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try { const { data, meta } = await service.list(req.query as never); ApiResponse.paginated(res, data, meta); } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.getById(parseInt(req.params.id as string))); } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.created(res, await service.create(req.body)); } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.update(parseInt(req.params.id as string), req.body)); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await service.remove(parseInt(req.params.id as string)); ApiResponse.success(res, null, "تم الحذف"); } catch (err) { next(err); }
}
