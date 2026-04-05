import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { ApiError } from "../../utils/ApiError";
import { JwtPayload } from "../../middlewares/auth";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("بريد إلكتروني أو كلمة مرور غير صحيحة");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw ApiError.unauthorized("بريد إلكتروني أو كلمة مرور غير صحيحة");
  }

  const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as never,
  });
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as never,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, lastLogin: true, createdAt: true },
  });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");
  return user;
}

export async function refreshTokens(token: string) {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== token || !user.isActive) {
      throw ApiError.unauthorized("جلسة غير صالحة");
    }

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as never,
    });
    const newRefresh = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as never,
    });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefresh } });
    return { accessToken, refreshToken: newRefresh };
  } catch {
    throw ApiError.unauthorized("يرجى تسجيل الدخول مرة أخرى");
  }
}
