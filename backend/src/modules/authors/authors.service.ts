import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; search?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.name = { contains: query.search };

  const [data, total] = await Promise.all([
    prisma.author.findMany({ where, skip, take: limit, orderBy: { name: "asc" }, include: { _count: { select: { articles: true } } } }),
    prisma.author.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const author = await prisma.author.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!author) throw ApiError.notFound("الكاتب غير موجود");
  return author;
}

export async function getBySlug(slug: string) {
  const author = await prisma.author.findUnique({ where: { slug }, include: { _count: { select: { articles: true } } } });
  if (!author) throw ApiError.notFound("الكاتب غير موجود");
  return author;
}

export async function create(data: Record<string, unknown>) {
  const slug = (data.slug as string) || createSlug(data.name as string);
  const exists = await prisma.author.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  return prisma.author.create({ data: { ...data, slug } as never });
}

export async function update(id: number, data: Record<string, unknown>) {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) throw ApiError.notFound("الكاتب غير موجود");
  if (data.slug && data.slug !== author.slug) {
    const exists = await prisma.author.findUnique({ where: { slug: data.slug as string } });
    if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  }
  return prisma.author.update({ where: { id }, data: data as never });
}

export async function remove(id: number) {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) throw ApiError.notFound("الكاتب غير موجود");
  await prisma.author.delete({ where: { id } });
}

export async function getAll() {
  return prisma.author.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, include: { _count: { select: { articles: true } } } });
}
