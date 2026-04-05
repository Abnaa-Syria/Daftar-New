import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

const includeImages = { images: { orderBy: { sortOrder: "asc" as const } } };

export async function list(query: { page?: string; limit?: string; search?: string; status?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.title = { contains: query.search };
  if (query.status) where.status = query.status;
  const [data, total] = await Promise.all([
    prisma.infographic.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: includeImages }),
    prisma.infographic.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const item = await prisma.infographic.findUnique({ where: { id }, include: includeImages });
  if (!item) throw ApiError.notFound("الانفوجراف غير موجود");
  return item;
}

export async function getBySlug(slug: string) {
  const item = await prisma.infographic.findUnique({ where: { slug }, include: includeImages });
  if (!item) throw ApiError.notFound("الانفوجراف غير موجود");
  return item;
}

export async function create(data: Record<string, unknown>) {
  const { imageUrls, ...rest } = data as { imageUrls?: string[];[key: string]: unknown };
  const slug = (rest.slug as string) || createSlug(rest.title as string);
  const exists = await prisma.infographic.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");

  return prisma.infographic.create({
    data: {
      ...(rest as object),
      slug,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt as string) : undefined,
      images: imageUrls?.length ? { create: imageUrls.map((url, i) => ({ url, sortOrder: i })) } : undefined,
    } as never,
    include: includeImages,
  });
}

export async function update(id: number, data: Record<string, unknown>) {
  const item = await prisma.infographic.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound("الانفوجراف غير موجود");

  const { imageUrls, ...rest } = data as { imageUrls?: string[];[key: string]: unknown };

  if (imageUrls !== undefined) {
    await prisma.infographicImage.deleteMany({ where: { infographicId: id } });
    if (imageUrls.length) {
      await prisma.infographicImage.createMany({ data: imageUrls.map((url, i) => ({ infographicId: id, url, sortOrder: i })) });
    }
  }

  return prisma.infographic.update({ where: { id }, data: rest as never, include: includeImages });
}

export async function remove(id: number) {
  await prisma.infographic.delete({ where: { id } });
}

export async function getPublished(limit = 20) {
  return prisma.infographic.findMany({
    where: { status: "PUBLISHED" },
    include: includeImages,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
