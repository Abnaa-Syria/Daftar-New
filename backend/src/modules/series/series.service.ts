import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; search?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.name = { contains: query.search };
  const [data, total] = await Promise.all([
    prisma.series.findMany({ where, skip, take: limit, orderBy: { sortOrder: "asc" }, include: { section: { select: { id: true, name: true, slug: true } }, _count: { select: { articles: true } } } }),
    prisma.series.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const series = await prisma.series.findUnique({ where: { id }, include: { section: true, articles: { include: { section: true, author: true }, orderBy: { publishedAt: "desc" } } } });
  if (!series) throw ApiError.notFound("السلسلة غير موجودة");
  return series;
}

export async function getBySlug(slug: string) {
  const series = await prisma.series.findUnique({ where: { slug }, include: { section: true, articles: { where: { status: "PUBLISHED" }, include: { section: { select: { id: true, slug: true, name: true, color: true } }, author: { select: { id: true, slug: true, name: true, avatar: true } } }, orderBy: { publishedAt: "desc" } } } });
  if (!series) throw ApiError.notFound("السلسلة غير موجودة");
  return series;
}

export async function create(data: Record<string, unknown>) {
  const slug = (data.slug as string) || createSlug(data.name as string);
  const exists = await prisma.series.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  return prisma.series.create({ data: { ...data, slug } as never });
}

export async function update(id: number, data: Record<string, unknown>) {
  const series = await prisma.series.findUnique({ where: { id } });
  if (!series) throw ApiError.notFound("السلسلة غير موجودة");
  return prisma.series.update({ where: { id }, data: data as never });
}

export async function remove(id: number) {
  const series = await prisma.series.findUnique({ where: { id } });
  if (!series) throw ApiError.notFound("السلسلة غير موجودة");
  await prisma.series.delete({ where: { id } });
}
