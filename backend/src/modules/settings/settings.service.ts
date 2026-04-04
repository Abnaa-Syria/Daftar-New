import { prisma } from "../../lib/prisma";

export async function getAll() {
  const settings = await prisma.siteSetting.findMany();
  const result: Record<string, Record<string, string>> = {};
  for (const s of settings) {
    if (!result[s.group]) result[s.group] = {};
    result[s.group][s.key] = s.value;
  }
  return result;
}

export async function getByGroup(group: string) {
  const settings = await prisma.siteSetting.findMany({ where: { group } });
  const result: Record<string, string> = {};
  for (const s of settings) result[s.key] = s.value;
  return result;
}

export async function getByKey(key: string) {
  return prisma.siteSetting.findUnique({ where: { key } });
}

export async function upsert(key: string, value: string, group = "general") {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value, group },
    create: { key, value, group },
  });
}

export async function bulkUpsert(settings: { key: string; value: string; group?: string }[]) {
  const operations = settings.map((s) =>
    prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group || "general" },
      create: { key: s.key, value: s.value, group: s.group || "general" },
    })
  );
  return prisma.$transaction(operations);
}

export async function remove(key: string) {
  await prisma.siteSetting.delete({ where: { key } });
}
