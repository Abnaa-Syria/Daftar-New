import { Request, Response, NextFunction } from "express";
import * as articlesService from "./articles.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await articlesService.list(req.query as never);
    ApiResponse.paginated(res, data, meta);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articlesService.getById(parseInt(req.params.id));
    ApiResponse.success(res, article);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articlesService.create(req.body);
    ApiResponse.created(res, article);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articlesService.update(parseInt(req.params.id), req.body);
    ApiResponse.success(res, article);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await articlesService.remove(parseInt(req.params.id));
    ApiResponse.success(res, null, "تم حذف المقال بنجاح");
  } catch (err) { next(err); }
}
