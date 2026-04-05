import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await usersService.list(req.query as never);
    ApiResponse.paginated(res, data, meta);
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getById(parseInt(req.params.id as string));
    ApiResponse.success(res, user);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.create(req.body);
    ApiResponse.created(res, user, "تم إنشاء المستخدم بنجاح");
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.update(parseInt(req.params.id as string), req.body);
    ApiResponse.success(res, user, "تم تحديث المستخدم بنجاح");
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await usersService.remove(parseInt(req.params.id as string));
    ApiResponse.success(res, null, "تم حذف المستخدم بنجاح");
  } catch (err) { next(err); }
}
