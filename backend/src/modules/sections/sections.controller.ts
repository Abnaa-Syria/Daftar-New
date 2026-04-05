import { Request, Response, NextFunction } from "express";
import * as sectionsService from "./sections.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await sectionsService.list(req.query as never);
    ApiResponse.paginated(res, data, meta);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const section = await sectionsService.getById(parseInt(req.params.id as string));
    ApiResponse.success(res, section);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const section = await sectionsService.create(req.body);
    ApiResponse.created(res, section);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const section = await sectionsService.update(parseInt(req.params.id as string), req.body);
    ApiResponse.success(res, section);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await sectionsService.remove(parseInt(req.params.id as string));
    ApiResponse.success(res, null, "تم حذف القسم بنجاح");
  } catch (err) { next(err); }
}
