import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const includeItems = {
  items: {
    orderBy: { sortOrder: "asc" as const },
    include: { children: { orderBy: { sortOrder: "asc" as const } } },
  },
};

export async function list() {
  return prisma.menu.findMany({ orderBy: { createdAt: "asc" }, include: includeItems });
}

export async function getById(id: number) {
  const menu = await prisma.menu.findUnique({ where: { id }, include: includeItems });
  if (!menu) throw ApiError.notFound("القائمة غير موجودة");
  return menu;
}

export async function getByLocation(location: string) {
  return prisma.menu.findMany({
    where: { location: location as never, isActive: true },
    include: {
      items: {
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function create(data: Record<string, unknown>) {
  const { items, ...rest } = data as { items?: Record<string, unknown>[];[key: string]: unknown };
  return prisma.menu.create({
    data: {
      ...(rest as object),
      items: items?.length
        ? { create: items.map((item, i) => ({ ...item, sortOrder: i })) as never }
        : undefined,
    } as never,
    include: includeItems,
  });
}

export async function update(id: number, data: Record<string, unknown>) {
  const menu = await prisma.menu.findUnique({ where: { id } });
  if (!menu) throw ApiError.notFound("القائمة غير موجودة");

  const { items, ...rest } = data as { items?: Record<string, unknown>[];[key: string]: unknown };

  if (items !== undefined) {
    await prisma.menuItem.deleteMany({ where: { menuId: id } });
    if (items.length) {
      await prisma.menuItem.createMany({
        data: items.map((item, i) => ({ ...item, menuId: id, sortOrder: i })) as never,
      });
    }
  }

  return prisma.menu.update({ where: { id }, data: rest as never, include: includeItems });
}

export async function remove(id: number) {
  await prisma.menu.delete({ where: { id } });
}
