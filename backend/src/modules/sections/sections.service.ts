import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; search?: string; active?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.name = { contains: query.search };
  if (query.active !== undefined) where.isActive = query.active === "true";

  const [data, total] = await Promise.all([
    prisma.section.findMany({ where, skip, take: limit, orderBy: { sortOrder: "asc" }, include: { _count: { select: { articles: true } } } }),
    prisma.section.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const section = await prisma.section.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!section) throw ApiError.notFound("القسم غير موجود");
  return section;
}

export async function getBySlug(slug: string) {
  const section = await prisma.section.findUnique({ where: { slug }, include: { _count: { select: { articles: true } } } });
  if (!section) throw ApiError.notFound("القسم غير موجود");
  return section;
}

export async function create(data: { name: string; slug?: string; description?: string; color?: string; icon?: string; sortOrder?: number; isActive?: boolean }) {
  const slug = data.slug || createSlug(data.name);
  const exists = await prisma.section.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  return prisma.section.create({ data: { ...data, slug } });
}

export async function update(id: number, data: Record<string, unknown>) {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) throw ApiError.notFound("القسم غير موجود");
  if (data.slug && data.slug !== section.slug) {
    const exists = await prisma.section.findUnique({ where: { slug: data.slug as string } });
    if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  }
  return prisma.section.update({ where: { id }, data: data as never });
}

export async function remove(id: number) {
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) throw ApiError.notFound("القسم غير موجود");
  await prisma.section.delete({ where: { id } });
}

export async function getAll() {
  return prisma.section.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}
