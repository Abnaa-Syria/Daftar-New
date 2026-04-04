import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success(res: Response, data: unknown, message = "تمت العملية بنجاح", statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created(res: Response, data: unknown, message = "تم الإنشاء بنجاح") {
    return res.status(201).json({ success: true, message, data });
  }

  static paginated(res: Response, data: unknown[], meta: PaginationMeta, message = "تمت العملية بنجاح") {
    return res.status(200).json({ success: true, message, data, meta });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
