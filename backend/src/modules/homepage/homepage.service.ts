import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const includeItems = {
  items: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      article: {
        select: { id: true, slug: true, title: true, excerpt: true, image: true, publishedAt: true, views: true },
      },
    },
  },
};

export async function list() {
  return prisma.homepageModule.findMany({
    orderBy: { sortOrder: "asc" },
    include: includeItems,
  });
}

export async function getById(id: number) {
  const mod = await prisma.homepageModule.findUnique({ where: { id }, include: includeItems });
  if (!mod) throw ApiError.notFound("الموديول غير موجود");
  return mod;
}

export async function create(data: Record<string, unknown>) {
  const { articleIds, ...rest } = data as { articleIds?: number[];[key: string]: unknown };
  return prisma.homepageModule.create({
    data: {
      ...(rest as object),
      items: articleIds?.length ? { create: articleIds.map((articleId, i) => ({ articleId, sortOrder: i })) } : undefined,
    } as never,
    include: includeItems,
  });
}

export async function update(id: number, data: Record<string, unknown>) {
  const mod = await prisma.homepageModule.findUnique({ where: { id } });
  if (!mod) throw ApiError.notFound("الموديول غير موجود");

  const { articleIds, ...rest } = data as { articleIds?: number[];[key: string]: unknown };

  if (articleIds !== undefined) {
    await prisma.homepageModuleItem.deleteMany({ where: { moduleId: id } });
    if (articleIds.length) {
      await prisma.homepageModuleItem.createMany({ data: articleIds.map((articleId, i) => ({ moduleId: id, articleId, sortOrder: i })) });
    }
  }

  return prisma.homepageModule.update({ where: { id }, data: rest as never, include: includeItems });
}

export async function remove(id: number) {
  await prisma.homepageModule.delete({ where: { id } });
}

export async function reorder(moduleIds: number[]) {
  const updates = moduleIds.map((id, index) =>
    prisma.homepageModule.update({ where: { id }, data: { sortOrder: index } })
  );
  await prisma.$transaction(updates);
}

export async function getActiveModules() {
  return prisma.homepageModule.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: includeItems,
  });
}
