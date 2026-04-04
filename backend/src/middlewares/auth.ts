import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("يرجى تسجيل الدخول"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(ApiError.unauthorized("جلسة منتهية، يرجى تسجيل الدخول مرة أخرى"));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("ليس لديك صلاحية للقيام بهذا الإجراء"));
    }
    next();
  };
}
