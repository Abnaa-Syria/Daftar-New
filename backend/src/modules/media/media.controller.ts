import { Request, Response, NextFunction } from "express";
import * as service from "./media.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function list(req: Request, res: Response, next: NextFunction) {
  try { const { data, meta } = await service.list(req.query as never); ApiResponse.paginated(res, data, meta); } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.getById(parseInt(req.params.id as string))); } catch (err) { next(err); }
}

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return next(new Error("يرجى رفع ملف"));
    const media = await service.createFromUpload(req.file, req.body.alt);
    ApiResponse.created(res, media, "تم رفع الملف بنجاح");
  } catch (err) { next(err); }
}

export async function uploadMultiple(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return next(new Error("يرجى رفع ملفات"));
    const results = await Promise.all(files.map((f) => service.createFromUpload(f)));
    ApiResponse.created(res, results, "تم رفع الملفات بنجاح");
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try { ApiResponse.success(res, await service.update(parseInt(req.params.id as string), req.body)); } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try { await service.remove(parseInt(req.params.id as string)); ApiResponse.success(res, null, "تم الحذف"); } catch (err) { next(err); }
}
