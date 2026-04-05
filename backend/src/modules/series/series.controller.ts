import { Request, Response, NextFunction } from "express";
import * as seriesService from "./series.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try { const { data, meta } = await seriesService.list(req.query as never); ApiResponse.paginated(res, data, meta); } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await seriesService.getById(parseInt(req.params.id as string))); } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.created(res, await seriesService.create(req.body)); } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await seriesService.update(parseInt(req.params.id as string), req.body)); } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await seriesService.remove(parseInt(req.params.id as string)); ApiResponse.success(res, null, "تم الحذف"); } catch (err) { next(err); }
}
