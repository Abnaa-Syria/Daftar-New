import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

const includeArticles = {
  articles: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      article: {
        select: { id: true, slug: true, title: true, excerpt: true, image: true, publishedAt: true },
      },
    },
  },
};

export async function list(query: { page?: string; limit?: string; search?: string; status?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.title = { contains: query.search };
  if (query.status) where.status = query.status;
  const [data, total] = await Promise.all([
    prisma.specialFile.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: includeArticles }),
    prisma.specialFile.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const item = await prisma.specialFile.findUnique({ where: { id }, include: includeArticles });
  if (!item) throw ApiError.notFound("الملف غير موجود");
  return item;
}

export async function getBySlug(slug: string) {
  const item = await prisma.specialFile.findUnique({ where: { slug }, include: includeArticles });
  if (!item) throw ApiError.notFound("الملف غير موجود");
  return item;
}

export async function create(data: Record<string, unknown>) {
  const { articleIds, ...rest } = data as { articleIds?: number[];[key: string]: unknown };
  const slug = (rest.slug as string) || createSlug(rest.title as string);
  const exists = await prisma.specialFile.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");

  return prisma.specialFile.create({
    data: {
      ...rest as never,
      slug,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt as string) : undefined,
      articles: articleIds?.length ? { create: articleIds.map((articleId, i) => ({ articleId, sortOrder: i })) } : undefined,
    },
    include: includeArticles,
  });
}

export async function update(id: number, data: Record<string, unknown>) {
  const item = await prisma.specialFile.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound("الملف غير موجود");

  const { articleIds, ...rest } = data as { articleIds?: number[];[key: string]: unknown };

  if (articleIds !== undefined) {
    await prisma.specialFileArticle.deleteMany({ where: { specialFileId: id } });
    if (articleIds.length) {
      await prisma.specialFileArticle.createMany({ data: articleIds.map((articleId, i) => ({ specialFileId: id, articleId, sortOrder: i })) });
    }
  }

  return prisma.specialFile.update({ where: { id }, data: rest as never, include: includeArticles });
}

export async function remove(id: number) {
  await prisma.specialFile.delete({ where: { id } });
}

export async function getPublished() {
  return prisma.specialFile.findMany({
    where: { status: "PUBLISHED" },
    include: includeArticles,
    orderBy: { publishedAt: "desc" },
  });
}
