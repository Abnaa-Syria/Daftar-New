import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    ApiResponse.success(res, result, "تم تسجيل الدخول بنجاح");
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    ApiResponse.success(res, user);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    ApiResponse.success(res, tokens, "تم تحديث الجلسة");
  } catch (err) {
    next(err);
  }
}
