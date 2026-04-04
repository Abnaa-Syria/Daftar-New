import { PrismaClient, Role, ArticleStatus, ContentStatus, HomepageModuleType, MenuLocation } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding clean UTF-8 Arabic data...");

  const password = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@aldaftar.com" },
    update: { name: "مدير النظام", role: Role.SUPER_ADMIN, isActive: true },
    create: { email: "admin@aldaftar.com", name: "مدير النظام", password, role: Role.SUPER_ADMIN, isActive: true },
  });

  await prisma.user.upsert({
    where: { email: "editor@aldaftar.com" },
    update: { name: "رئيس التحرير", role: Role.EDITOR_IN_CHIEF, isActive: true },
    create: { email: "editor@aldaftar.com", name: "رئيس التحرير", password, role: Role.EDITOR_IN_CHIEF, isActive: true },
  });

  const sections = await Promise.all([
    prisma.section.upsert({ where: { slug: "events-today" }, update: { name: "أحداث اليوم", color: "#c41e3a", description: "آخر الأخبار اليومية", isActive: true, sortOrder: 1 }, create: { slug: "events-today", name: "أحداث اليوم", color: "#c41e3a", description: "آخر الأخبار اليومية", isActive: true, sortOrder: 1 } }),
    prisma.section.upsert({ where: { slug: "country-affairs" }, update: { name: "شؤون البلد", color: "#1a2744", description: "الشأن الداخلي", isActive: true, sortOrder: 2 }, create: { slug: "country-affairs", name: "شؤون البلد", color: "#1a2744", description: "الشأن الداخلي", isActive: true, sortOrder: 2 } }),
    prisma.section.upsert({ where: { slug: "market-movement" }, update: { name: "حركة السوق", color: "#2e7d32", description: "الاقتصاد والأسواق", isActive: true, sortOrder: 3 }, create: { slug: "market-movement", name: "حركة السوق", color: "#2e7d32", description: "الاقتصاد والأسواق", isActive: true, sortOrder: 3 } }),
    prisma.section.upsert({ where: { slug: "style-stars" }, update: { name: "ستايل ونجوم", color: "#9c27b0", description: "الفن والثقافة", isActive: true, sortOrder: 4 }, create: { slug: "style-stars", name: "ستايل ونجوم", color: "#9c27b0", description: "الفن والثقافة", isActive: true, sortOrder: 4 } }),
    prisma.section.upsert({ where: { slug: "inside-goal" }, update: { name: "جوّه الجون", color: "#1565c0", description: "الرياضة", isActive: true, sortOrder: 5 }, create: { slug: "inside-goal", name: "جوّه الجون", color: "#1565c0", description: "الرياضة", isActive: true, sortOrder: 5 } }),
    prisma.section.upsert({ where: { slug: "egypt-reality" }, update: { name: "الواقع المصري", color: "#e65100", description: "قصص المجتمع", isActive: true, sortOrder: 6 }, create: { slug: "egypt-reality", name: "الواقع المصري", color: "#e65100", description: "قصص المجتمع", isActive: true, sortOrder: 6 } }),
    prisma.section.upsert({ where: { slug: "special-file" }, update: { name: "ملف خاص", color: "#4a148c", description: "تحقيقات خاصة", isActive: true, sortOrder: 7 }, create: { slug: "special-file", name: "ملف خاص", color: "#4a148c", description: "تحقيقات خاصة", isActive: true, sortOrder: 7 } }),
    prisma.section.upsert({ where: { slug: "infographic" }, update: { name: "الانفو جراف", color: "#00838f", description: "المحتوى البصري", isActive: true, sortOrder: 8 }, create: { slug: "infographic", name: "الانفو جراف", color: "#00838f", description: "المحتوى البصري", isActive: true, sortOrder: 8 } }),
    prisma.section.upsert({ where: { slug: "people-street" }, update: { name: "الناس والشارع", color: "#795548", description: "قصص الناس", isActive: true, sortOrder: 9 }, create: { slug: "people-street", name: "الناس والشارع", color: "#795548", description: "قصص الناس", isActive: true, sortOrder: 9 } }),
  ]);

  const [sEvents, sCountry, sMarket, sStyle, sGoal, sReality] = sections;

  const author = await prisma.author.upsert({
    where: { slug: "mariam-hassan" },
    update: { name: "مريم حسن", role: "محررة أولى", bio: "صحفية متخصصة في الشأن السياسي", isActive: true },
    create: { slug: "mariam-hassan", name: "مريم حسن", role: "محررة أولى", bio: "صحفية متخصصة في الشأن السياسي", avatar: "https://picsum.photos/seed/author1/200/200", isActive: true },
  });

  const tagPolitics = await prisma.tag.upsert({ where: { slug: "politics" }, update: { name: "سياسة" }, create: { slug: "politics", name: "سياسة" } });
  const tagEconomy = await prisma.tag.upsert({ where: { slug: "economy" }, update: { name: "اقتصاد" }, create: { slug: "economy", name: "اقتصاد" } });

  const articleSeeds = [
    { slug: "summit-arab-leaders-2026", title: "القمة العربية تنطلق وسط ترقب دولي", excerpt: "انطلاق أعمال القمة العربية بمشاركة واسعة.", sectionId: sEvents.id, views: 5200, isFeatured: true, isBreaking: true },
    { slug: "infrastructure-development-plan", title: "خطة قومية لتطوير البنية التحتية", excerpt: "مشاريع طرق وجسور خلال خمس سنوات.", sectionId: sCountry.id, views: 4100, isFeatured: true, isBreaking: false },
    { slug: "stock-market-record-high", title: "البورصة تسجل أعلى مستوى تاريخي", excerpt: "صعود قوي بقيادة أسهم التكنولوجيا.", sectionId: sMarket.id, views: 6400, isFeatured: true, isBreaking: false },
    { slug: "arab-actress-international-award", title: "ممثلة عربية تحصد جائزة دولية", excerpt: "إنجاز فني جديد للسينما العربية.", sectionId: sStyle.id, views: 3600, isFeatured: false, isBreaking: false },
    { slug: "league-title-race", title: "صراع مشتعل على لقب الدوري", excerpt: "ثلاثة أندية تتنافس على الصدارة.", sectionId: sGoal.id, views: 4800, isFeatured: true, isBreaking: false },
    { slug: "cairo-old-quarter-restoration", title: "مشروع ضخم لترميم القاهرة التاريخية", excerpt: "إحياء التراث المعماري في قلب القاهرة.", sectionId: sReality.id, views: 2300, isFeatured: false, isBreaking: false },
  ];

  const articleIds: number[] = [];
  for (let i = 0; i < articleSeeds.length; i++) {
    const a = articleSeeds[i];
    const row = await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: `<p>${a.excerpt}</p><p>هذا محتوى دينمك من نظام إدارة المحتوى.</p>`,
        image: `https://picsum.photos/seed/${a.slug}/1200/800`,
        sectionId: a.sectionId,
        authorId: author.id,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - i * 3600_000),
        readTime: 4,
        views: a.views,
        isFeatured: a.isFeatured,
        isBreaking: a.isBreaking,
        metaTitle: a.title,
        metaDescription: a.excerpt,
      },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: `<p>${a.excerpt}</p><p>هذا محتوى دينمك من نظام إدارة المحتوى.</p>`,
        image: `https://picsum.photos/seed/${a.slug}/1200/800`,
        sectionId: a.sectionId,
        authorId: author.id,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - i * 3600_000),
        readTime: 4,
        views: a.views,
        isFeatured: a.isFeatured,
        isBreaking: a.isBreaking,
        metaTitle: a.title,
        metaDescription: a.excerpt,
      },
    });
    articleIds.push(row.id);
    await prisma.articleTag.deleteMany({ where: { articleId: row.id } });
    await prisma.articleTag.createMany({ data: [{ articleId: row.id, tagId: tagPolitics.id }, { articleId: row.id, tagId: tagEconomy.id }] });
  }

  await prisma.breakingItem.deleteMany();
  await prisma.breakingItem.createMany({
    data: [
      { title: "عاجل: القمة العربية تصدر بياناً مشتركاً", articleId: articleIds[0], sortOrder: 0, isActive: true, publishedAt: new Date() },
      { title: "عاجل: البورصة تسجل أعلى إغلاق", articleId: articleIds[2], sortOrder: 1, isActive: true, publishedAt: new Date(Date.now() - 1800_000) },
    ],
  });

  const info = await prisma.infographic.upsert({
    where: { slug: "arab-economy-2026" },
    update: { title: "الاقتصاد العربي في أرقام 2026", description: "نظرة بصرية على المؤشرات الاقتصادية", coverImage: "https://picsum.photos/seed/arab-economy-2026/1200/1600", status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    create: { slug: "arab-economy-2026", title: "الاقتصاد العربي في أرقام 2026", description: "نظرة بصرية على المؤشرات الاقتصادية", coverImage: "https://picsum.photos/seed/arab-economy-2026/1200/1600", status: ContentStatus.PUBLISHED, publishedAt: new Date() },
  });
  await prisma.infographicImage.deleteMany({ where: { infographicId: info.id } });
  await prisma.infographicImage.createMany({ data: [0, 1, 2].map((i) => ({ infographicId: info.id, url: `https://picsum.photos/seed/arab-economy-2026-${i}/1200/1600`, sortOrder: i })) });

  const sf = await prisma.specialFile.upsert({
    where: { slug: "ai-reshaping-work" },
    update: { title: "الذكاء الاصطناعي يعيد تشكيل العالم", description: "ملف شامل عن تأثير الذكاء الاصطناعي", coverImage: "https://picsum.photos/seed/ai-reshaping-work/1200/800", status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    create: { slug: "ai-reshaping-work", title: "الذكاء الاصطناعي يعيد تشكيل العالم", description: "ملف شامل عن تأثير الذكاء الاصطناعي", coverImage: "https://picsum.photos/seed/ai-reshaping-work/1200/800", status: ContentStatus.PUBLISHED, publishedAt: new Date() },
  });
  await prisma.specialFileArticle.deleteMany({ where: { specialFileId: sf.id } });
  await prisma.specialFileArticle.createMany({ data: articleIds.slice(0, 3).map((articleId, i) => ({ specialFileId: sf.id, articleId, sortOrder: i })) });

  const pages = [
    { slug: "about", title: "عن الدفتر", content: "<p>محتوى صفحة عن الدفتر يتم إدارته من لوحة التحكم.</p>" },
    { slug: "editorial-policy", title: "السياسة التحريرية", content: "<p>السياسة التحريرية تدار بالكامل من CMS.</p>" },
    { slug: "privacy", title: "سياسة الخصوصية", content: "<p>سياسة الخصوصية قابلة للتعديل من لوحة التحكم.</p>" },
    { slug: "terms", title: "شروط الاستخدام", content: "<p>شروط الاستخدام يتم تعديلها دون تدخل برمجي.</p>" },
    { slug: "contact", title: "تواصل معنا", content: "<p>للتواصل: info@aldaftar.com</p>" },
  ];
  for (const p of pages) {
    await prisma.staticPage.upsert({
      where: { slug: p.slug },
      update: { title: p.title, content: p.content, status: ContentStatus.PUBLISHED },
      create: { slug: p.slug, title: p.title, content: p.content, status: ContentStatus.PUBLISHED },
    });
  }

  const settings = [
    { key: "site_name", value: "الدفتر", group: "general" },
    { key: "site_description", value: "منصة إخبارية عربية شاملة", group: "general" },
    { key: "supervisor_name", value: "عبدالرحمن الناصري", group: "editorial" },
    { key: "editor_in_chief", value: "محمد مجلى", group: "editorial" },
    { key: "contact_email", value: "info@aldaftar.com", group: "contact" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: s, create: s });
  }

  await prisma.menu.deleteMany();
  const headerMenu = await prisma.menu.create({ data: { name: "القائمة الرئيسية", location: MenuLocation.HEADER, isActive: true } });
  const footerMenu = await prisma.menu.create({ data: { name: "قائمة الفوتر", location: MenuLocation.FOOTER, isActive: true } });

  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, label: "الرئيسية", url: "/", sortOrder: 0 },
      { menuId: headerMenu.id, label: "عاجل", url: "/breaking", sortOrder: 1 },
      { menuId: headerMenu.id, label: "أحداث اليوم", url: "/section/events-today", sortOrder: 2 },
      { menuId: headerMenu.id, label: "شؤون البلد", url: "/section/country-affairs", sortOrder: 3 },
    ],
  });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footerMenu.id, label: "عن الدفتر", url: "/about", sortOrder: 0 },
      { menuId: footerMenu.id, label: "السياسة التحريرية", url: "/editorial-policy", sortOrder: 1 },
      { menuId: footerMenu.id, label: "سياسة الخصوصية", url: "/privacy", sortOrder: 2 },
      { menuId: footerMenu.id, label: "شروط الاستخدام", url: "/terms", sortOrder: 3 },
      { menuId: footerMenu.id, label: "تواصل معنا", url: "/contact", sortOrder: 4 },
    ],
  });

  await prisma.homepageModule.deleteMany();
  const moduleDefs = [
    { type: HomepageModuleType.HERO_SLIDER, title: "الهيرو" },
    { type: HomepageModuleType.BREAKING_TICKER, title: "شريط عاجل" },
    { type: HomepageModuleType.FEATURED_WITH_THUMBNAILS, title: "أحداث اليوم", sectionSlug: "events-today" },
    { type: HomepageModuleType.SPLIT_LIST_FEATURED, title: "شؤون البلد", sectionSlug: "country-affairs" },
    { type: HomepageModuleType.CARD_CAROUSEL, title: "حركة السوق", sectionSlug: "market-movement" },
    { type: HomepageModuleType.TWO_ROW_GRID, title: "جوّه الجون", sectionSlug: "inside-goal" },
    { type: HomepageModuleType.GRID_LAYOUT, title: "الواقع المصري", sectionSlug: "egypt-reality" },
    { type: HomepageModuleType.INFOGRAPHIC_CAROUSEL, title: "الانفو جراف" },
    { type: HomepageModuleType.MOST_READ_CAROUSEL, title: "الأكثر قراءة" },
    { type: HomepageModuleType.SPECIAL_FILE_HIGHLIGHT, title: "ملف خاص" },
    { type: HomepageModuleType.NEWSLETTER_CTA, title: "النشرة البريدية" },
  ];

  for (let i = 0; i < moduleDefs.length; i++) {
    const m = moduleDefs[i];
    const mod = await prisma.homepageModule.create({
      data: { type: m.type, title: m.title, sectionSlug: m.sectionSlug || null, sortOrder: i, isActive: true },
    });
    const selected = articleIds.slice(0, 6);
    if (selected.length) {
      await prisma.homepageModuleItem.createMany({
        data: selected.map((articleId, idx) => ({ moduleId: mod.id, articleId, sortOrder: idx })),
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
