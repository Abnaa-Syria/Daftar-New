import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; status?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.status) where.status = query.status;
  const [data, total] = await Promise.all([
    prisma.staticPage.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.staticPage.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const page = await prisma.staticPage.findUnique({ where: { id } });
  if (!page) throw ApiError.notFound("الصفحة غير موجودة");
  return page;
}

export async function getBySlug(slug: string) {
  const page = await prisma.staticPage.findUnique({ where: { slug } });
  if (!page) throw ApiError.notFound("الصفحة غير موجودة");
  return page;
}

export async function create(data: Record<string, unknown>) {
  const slug = (data.slug as string) || createSlug(data.title as string);
  const exists = await prisma.staticPage.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  return prisma.staticPage.create({ data: { ...data, slug } as never });
}

export async function update(id: number, data: Record<string, unknown>) {
  const page = await prisma.staticPage.findUnique({ where: { id } });
  if (!page) throw ApiError.notFound("الصفحة غير موجودة");
  return prisma.staticPage.update({ where: { id }, data: data as never });
}

export async function remove(id: number) {
  await prisma.staticPage.delete({ where: { id } });
}
