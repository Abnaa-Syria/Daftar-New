import { Router, Request, Response, NextFunction } from "express";
import * as articlesService from "../articles/articles.service";
import * as sectionsService from "../sections/sections.service";
import * as seriesService from "../series/series.service";
import * as authorsService from "../authors/authors.service";
import * as tagsService from "../tags/tags.service";
import * as breakingService from "../breaking/breaking.service";
import * as infographicsService from "../infographics/infographics.service";
import * as specialFilesService from "../special-files/special-files.service";
import * as pagesService from "../pages/pages.service";
import * as settingsService from "../settings/settings.service";
import * as menusService from "../menus/menus.service";
import * as homepageService from "../homepage/homepage.service";
import { ApiResponse } from "../../utils/ApiResponse";

const router = Router();

// Homepage
router.get("/homepage", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modules = await homepageService.getActiveModules();
    ApiResponse.success(res, modules);
  } catch (err) { next(err); }
});

// Breaking news
router.get("/breaking", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await breakingService.getActive());
  } catch (err) { next(err); }
});

// Sections
router.get("/sections", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await sectionsService.getAll());
  } catch (err) { next(err); }
});

router.get("/sections/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const section = await sectionsService.getBySlug(req.params.slug);
    const articles = await articlesService.list({
      sectionId: String(section.id),
      status: "PUBLISHED",
      sort: "publishedAt",
      limit: req.query.limit as string || "20",
      page: req.query.page as string,
    });
    ApiResponse.success(res, { section, ...articles });
  } catch (err) { next(err); }
});

// Articles
router.get("/articles", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await articlesService.list({ ...req.query as Record<string, string>, status: "PUBLISHED" });
    ApiResponse.paginated(res, data, meta);
  } catch (err) { next(err); }
});

router.get("/articles/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await articlesService.getBySlug(req.params.slug);
    await articlesService.incrementViews((article as { id: number }).id);
    ApiResponse.success(res, article);
  } catch (err) { next(err); }
});

router.get("/articles/:slug/related", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const related = await articlesService.getRelated(req.params.slug, parseInt(req.query.limit as string || "4"));
    ApiResponse.success(res, related);
  } catch (err) { next(err); }
});

// Most read
router.get("/most-read", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await articlesService.getMostRead(parseInt(req.query.limit as string || "10")));
  } catch (err) { next(err); }
});

// Series
router.get("/series/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await seriesService.getBySlug(req.params.slug));
  } catch (err) { next(err); }
});

// Infographics
router.get("/infographics", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await infographicsService.getPublished());
  } catch (err) { next(err); }
});

router.get("/infographics/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await infographicsService.getBySlug(req.params.slug));
  } catch (err) { next(err); }
});

// Special files
router.get("/special-files", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await specialFilesService.getPublished());
  } catch (err) { next(err); }
});

router.get("/special-files/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await specialFilesService.getBySlug(req.params.slug));
  } catch (err) { next(err); }
});

// Authors
router.get("/authors", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await authorsService.getAll());
  } catch (err) { next(err); }
});

router.get("/authors/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = await authorsService.getBySlug(req.params.slug);
    const articles = await articlesService.list({
      authorId: String(author.id),
      status: "PUBLISHED",
      sort: "publishedAt",
      limit: req.query.limit as string || "20",
      page: req.query.page as string,
    });
    ApiResponse.success(res, { author, ...articles });
  } catch (err) { next(err); }
});

// Tags
router.get("/tags", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await tagsService.getAll());
  } catch (err) { next(err); }
});

router.get("/tags/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tag = await tagsService.getBySlug(req.params.slug);
    const articles = await articlesService.list({
      status: "PUBLISHED",
      sort: "publishedAt",
      limit: req.query.limit as string || "20",
      page: req.query.page as string,
    });
    ApiResponse.success(res, { tag, ...articles });
  } catch (err) { next(err); }
});

// Search
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await articlesService.list({
      search: req.query.q as string,
      status: "PUBLISHED",
      sort: (req.query.sort as string) || "publishedAt",
      sectionId: req.query.sectionId as string,
      limit: req.query.limit as string || "20",
      page: req.query.page as string,
    });
    ApiResponse.paginated(res, data, meta);
  } catch (err) { next(err); }
});

// Static pages
router.get("/pages/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await pagesService.getBySlug(req.params.slug));
  } catch (err) { next(err); }
});

// Settings
router.get("/settings", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, await settingsService.getAll());
  } catch (err) { next(err); }
});

// Menus
router.get("/menus", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = req.query.location as string;
    if (location) {
      ApiResponse.success(res, await menusService.getByLocation(location));
    } else {
      ApiResponse.success(res, await menusService.list());
    }
  } catch (err) { next(err); }
});

export default router;
