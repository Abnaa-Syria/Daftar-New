import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getPagination, getPaginationMeta } from "../../utils/pagination";

export async function list(query: { page?: string; limit?: string; active?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.active !== undefined) where.isActive = query.active === "true";
  const [data, total] = await Promise.all([
    prisma.breakingItem.findMany({ where, skip, take: limit, orderBy: { sortOrder: "asc" }, include: { article: { select: { id: true, slug: true, title: true } } } }),
    prisma.breakingItem.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const item = await prisma.breakingItem.findUnique({ where: { id }, include: { article: true } });
  if (!item) throw ApiError.notFound("العنصر غير موجود");
  return item;
}

export async function create(data: Record<string, unknown>) {
  const payload = { ...(data as Record<string, unknown>) };
  const articleId = payload.articleId ? Number(payload.articleId) : undefined;
  if (articleId) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, status: true },
    });
    if (!article) throw ApiError.badRequest("المقال المرتبط غير موجود");
    if (article.status !== "PUBLISHED") throw ApiError.badRequest("يجب ربط الخبر العاجل بمقال منشور");
    payload.articleId = article.id;
    if (!String(payload.title || "").trim()) {
      payload.title = article.title;
    }
  }
  return prisma.breakingItem.create({
    data: payload as never,
    include: { article: { select: { id: true, slug: true, title: true } } },
  });
}

export async function update(id: number, data: Record<string, unknown>) {
  const item = await prisma.breakingItem.findUnique({ where: { id } });
  if (!item) throw ApiError.notFound("العنصر غير موجود");
  const payload = { ...(data as Record<string, unknown>) };
  const articleId = payload.articleId ? Number(payload.articleId) : undefined;
  if (articleId) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, status: true },
    });
    if (!article) throw ApiError.badRequest("المقال المرتبط غير موجود");
    if (article.status !== "PUBLISHED") throw ApiError.badRequest("يجب ربط الخبر العاجل بمقال منشور");
    payload.articleId = article.id;
    if (!String(payload.title || "").trim()) {
      payload.title = article.title;
    }
  }
  return prisma.breakingItem.update({
    where: { id },
    data: payload as never,
    include: { article: { select: { id: true, slug: true, title: true } } },
  });
}

export async function remove(id: number) {
  await prisma.breakingItem.delete({ where: { id } });
}

export async function getActive() {
  return prisma.breakingItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { article: { select: { slug: true, title: true } } },
  });
}
