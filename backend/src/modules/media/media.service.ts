import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import fs from "fs";
import path from "path";
import { config } from "../../config";

export async function list(query: { page?: string; limit?: string; search?: string; mimeType?: string }) {
  const { page, limit, skip } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.search) where.OR = [{ filename: { contains: query.search } }, { alt: { contains: query.search } }];
  if (query.mimeType) where.mimeType = { startsWith: query.mimeType };
  const [data, total] = await Promise.all([
    prisma.media.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.media.count({ where }),
  ]);
  return { data, meta: getPaginationMeta(total, page, limit) };
}

export async function getById(id: number) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw ApiError.notFound("الملف غير موجود");
  return media;
}

export async function createFromUpload(file: Express.Multer.File, alt?: string) {
  const relativePath = path
    .relative(configuredUploadRoot(), file.path)
    .split(path.sep)
    .join("/");
  const publicUrl = `/uploads/${relativePath}`;

  return prisma.media.create({
    data: {
      filename: file.originalname,
      url: publicUrl,
      mimeType: file.mimetype,
      size: file.size,
      alt: alt || file.originalname,
    },
  });
}

export async function update(id: number, data: { alt?: string }) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw ApiError.notFound("الملف غير موجود");
  return prisma.media.update({ where: { id }, data });
}

export async function remove(id: number) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw ApiError.notFound("الملف غير موجود");

  const mediaRelative = media.url.replace(/^\/uploads\/?/, "");
  const filePath = path.join(configuredUploadRoot(), mediaRelative);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  await prisma.media.delete({ where: { id } });
}

function configuredUploadRoot() {
  return path.resolve(process.cwd(), config.upload.dir);
}
