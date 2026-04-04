import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; search?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.name = { contains: query.search };
  const [data, total] = await Promise.all([
    prisma.tag.findMany({ where, skip, take: limit, orderBy: { name: "asc" }, include: { _count: { select: { articles: true } } } }),
    prisma.tag.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const tag = await prisma.tag.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!tag) throw ApiError.notFound("الوسم غير موجود");
  return tag;
}

export async function getBySlug(slug: string) {
  const tag = await prisma.tag.findUnique({ where: { slug }, include: { _count: { select: { articles: true } } } });
  if (!tag) throw ApiError.notFound("الوسم غير موجود");
  return tag;
}

export async function create(data: { name: string; slug?: string; description?: string }) {
  const slug = data.slug || createSlug(data.name);
  const exists = await prisma.tag.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الوسم موجود بالفعل");
  return prisma.tag.create({ data: { ...data, slug } });
}

export async function update(id: number, data: Record<string, unknown>) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) throw ApiError.notFound("الوسم غير موجود");
  return prisma.tag.update({ where: { id }, data: data as never });
}

export async function remove(id: number) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) throw ApiError.notFound("الوسم غير موجود");
  await prisma.tag.delete({ where: { id } });
}

export async function getAll() {
  return prisma.tag.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { articles: true } } } });
}
