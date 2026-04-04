import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { createSlug } from "../../utils/slugify";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

const articleInclude = {
  section: { select: { id: true, slug: true, name: true, color: true } },
  author: { select: { id: true, slug: true, name: true, avatar: true, role: true } },
  series: { select: { id: true, slug: true, name: true } },
  tags: { include: { tag: { select: { id: true, slug: true, name: true } } } },
  images: { orderBy: { sortOrder: "asc" as const } },
};

interface ListQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  sectionId?: string;
  authorId?: string;
  isFeatured?: string;
  isBreaking?: string;
  sort?: string;
}

export async function list(query: ListQuery) {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.ArticleWhereInput = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { excerpt: { contains: query.search } },
    ];
  }
  if (query.status) where.status = query.status as never;
  if (query.sectionId) where.sectionId = parseInt(query.sectionId);
  if (query.authorId) where.authorId = parseInt(query.authorId);
  if (query.isFeatured === "true") where.isFeatured = true;
  if (query.isBreaking === "true") where.isBreaking = true;

  let orderBy: Prisma.ArticleOrderByWithRelationInput = { createdAt: "desc" };
  if (query.sort === "publishedAt") orderBy = { publishedAt: "desc" };
  if (query.sort === "views") orderBy = { views: "desc" };
  if (query.sort === "title") orderBy = { title: "asc" };

  const [data, total] = await Promise.all([
    prisma.article.findMany({ where, include: articleInclude, skip, take: limit, orderBy }),
    prisma.article.count({ where }),
  ]);

  const mapped = data.map(mapArticle);
  return { data: mapped, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const article = await prisma.article.findUnique({ where: { id }, include: articleInclude });
  if (!article) throw ApiError.notFound("المقال غير موجود");
  return mapArticle(article);
}

export async function getBySlug(slug: string) {
  const article = await prisma.article.findUnique({ where: { slug }, include: articleInclude });
  if (!article) throw ApiError.notFound("المقال غير موجود");
  return mapArticle(article);
}

export async function create(data: Record<string, unknown>) {
  const { tagIds, galleryImages, ...rest } = data as { tagIds?: number[]; galleryImages?: string[];[key: string]: unknown };
  const slug = (rest.slug as string) || createSlug(rest.title as string);
  const exists = await prisma.article.findUnique({ where: { slug } });
  if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");

  if (rest.status === "PUBLISHED" && !rest.publishedAt) {
    rest.publishedAt = new Date().toISOString();
  }

  const article = await prisma.article.create({
    data: {
      ...rest as never,
      slug,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt as string) : undefined,
      scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt as string) : undefined,
      tags: tagIds?.length ? { create: tagIds.map((tagId) => ({ tagId })) } : undefined,
      images: galleryImages?.length ? { create: galleryImages.map((url, i) => ({ url, sortOrder: i })) } : undefined,
    },
    include: articleInclude,
  });
  return mapArticle(article);
}

export async function update(id: number, data: Record<string, unknown>) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw ApiError.notFound("المقال غير موجود");

  const { tagIds, galleryImages, ...rest } = data as { tagIds?: number[]; galleryImages?: string[];[key: string]: unknown };

  if (rest.slug && rest.slug !== article.slug) {
    const exists = await prisma.article.findUnique({ where: { slug: rest.slug as string } });
    if (exists) throw ApiError.conflict("هذا الرابط مستخدم بالفعل");
  }

  if (rest.status === "PUBLISHED" && article.status !== "PUBLISHED" && !rest.publishedAt) {
    rest.publishedAt = new Date().toISOString();
  }

  const updateData: Prisma.ArticleUpdateInput = {
    ...rest as never,
    publishedAt: rest.publishedAt ? new Date(rest.publishedAt as string) : undefined,
    scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt as string) : undefined,
  };

  if (tagIds !== undefined) {
    await prisma.articleTag.deleteMany({ where: { articleId: id } });
    if (tagIds.length) {
      await prisma.articleTag.createMany({ data: tagIds.map((tagId) => ({ articleId: id, tagId })) });
    }
  }

  if (galleryImages !== undefined) {
    await prisma.articleImage.deleteMany({ where: { articleId: id } });
    if (galleryImages.length) {
      await prisma.articleImage.createMany({ data: galleryImages.map((url, i) => ({ articleId: id, url, sortOrder: i })) });
    }
  }

  const updated = await prisma.article.update({ where: { id }, data: updateData, include: articleInclude });
  return mapArticle(updated);
}

export async function remove(id: number) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw ApiError.notFound("المقال غير موجود");
  await prisma.article.delete({ where: { id } });
}

export async function incrementViews(id: number) {
  await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
}

export async function getRelated(slug: string, limit = 4) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { tags: true },
  });
  if (!article) throw ApiError.notFound("المقال غير موجود");

  const tagIds = article.tags.map((t) => t.tagId);
  const related = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      status: "PUBLISHED",
      OR: [
        { sectionId: article.sectionId },
        ...(tagIds.length ? [{ tags: { some: { tagId: { in: tagIds } } } }] : []),
      ],
    },
    include: articleInclude,
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
  return related.map(mapArticle);
}

export async function getMostRead(limit = 10) {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: articleInclude,
    orderBy: { views: "desc" },
    take: limit,
  });
  return articles.map(mapArticle);
}

// flatten tags for API response
function mapArticle(article: Record<string, unknown>) {
  const tags = (article.tags as { tag: unknown }[])?.map((at) => at.tag) || [];
  const { tags: _t, ...rest } = article;
  return { ...rest, tags };
}
