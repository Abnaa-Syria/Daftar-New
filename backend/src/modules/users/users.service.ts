import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

const userSelect = { id: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true };

export async function list(query: { page?: string; limit?: string; search?: string; role?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
    ];
  }
  if (query.role) where.role = query.role;

  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.user.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");
  return user;
}

export async function create(data: { name: string; email: string; password: string; role?: string }) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw ApiError.conflict("البريد الإلكتروني مستخدم بالفعل");

  const hashed = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: { ...data, password: hashed } as never,
    select: userSelect,
  });
}

export async function update(id: number, data: { name?: string; email?: string; password?: string; role?: string; isActive?: boolean }) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");

  if (data.email && data.email !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw ApiError.conflict("البريد الإلكتروني مستخدم بالفعل");
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  return prisma.user.update({ where: { id }, data: updateData as never, select: userSelect });
}

export async function remove(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("المستخدم غير موجود");
  await prisma.user.delete({ where: { id } });
}
