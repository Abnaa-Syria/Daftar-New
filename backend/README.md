# الدفتر - Backend API

## التقنيات المستخدمة
- Node.js + Express.js
- TypeScript
- Prisma ORM + MySQL
- JWT Authentication
- Zod Validation
- Multer (File uploads)

## البدء السريع

### 1. إعداد قاعدة البيانات
تأكد من وجود MySQL يعمل على الجهاز. أنشئ قاعدة بيانات:
```sql
CREATE DATABASE al_daftar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. إعداد المتغيرات
```bash
cp .env.example .env
# عدّل DATABASE_URL و JWT_SECRET حسب إعداداتك
```

**الإنتاج + Next.js (`next/image`):** استجابات **`/api/public`** تعيد كتابة أي نص يبدأ بـ `/uploads/...` إلى رابط مطلق تلقائياً من `Host` / `X-Forwarded-Host` (مع `trust proxy` في الإنتاج)، أو يمكنك فرض العنوان بـ `PUBLIC_MEDIA_BASE_URL`. على الواجهة **لازم** تضيف في `next.config` ضمن `images.remotePatterns` نطاق الـ API (مثل `back.aldaftar.news`) والمسار `/uploads/**` وإلا يبقى `/_next/image` يعطي 400 حتى مع روابط مطلقة.

**Production + Next.js (`next/image`):** **`/api/public`** JSON rewrites `/uploads/...` strings to absolute URLs using the incoming request host (or `PUBLIC_MEDIA_BASE_URL` if set). Deploy the updated backend, then add **`images.remotePatterns`** in the Next app for your API host and `/uploads/**` — without that, `/_next/image` still returns **400** even with absolute URLs.

### 3. تثبيت التبعيات
```bash
npm install
```

### 4. تطبيق المخطط على قاعدة البيانات
```bash
npm run db:push
```

### 5. تشغيل البذور (Seed)
```bash
npm run db:seed
```

### 6. تشغيل الخادم
```bash
npm run dev
```

الخادم يعمل على `http://localhost:5000`

## بيانات الدخول الافتراضية
- **البريد:** admin@aldaftar.com
- **كلمة المرور:** admin123

## نقاط النهاية (API Endpoints)

### Public APIs
| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | /api/public/homepage | الصفحة الرئيسية |
| GET | /api/public/breaking | الأخبار العاجلة |
| GET | /api/public/sections | الأقسام |
| GET | /api/public/sections/:slug | تفاصيل القسم |
| GET | /api/public/articles | المقالات |
| GET | /api/public/articles/:slug | تفاصيل مقال |
| GET | /api/public/articles/:slug/related | مقالات ذات صلة |
| GET | /api/public/most-read | الأكثر قراءة |
| GET | /api/public/infographics | الانفوجراف |
| GET | /api/public/special-files | ملفات خاصة |
| GET | /api/public/authors | الكتّاب |
| GET | /api/public/tags | الوسوم || GET | /api/public/search | البحث |
| GET | /api/public/pages/:slug | صفحة ثابتة |
| GET | /api/public/settings | الإعدادات |
| GET | /api/public/menus | القوائم |

### Admin APIs (تتطلب JWT)
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | /api/admin/auth/login | تسجيل الدخول |
| GET | /api/admin/auth/me | بيانات المستخدم الحالي |
| CRUD | /api/admin/articles | إدارة المقالات |
| CRUD | /api/admin/sections | إدارة الأقسام |
| CRUD | /api/admin/series | إدارة السلاسل |
| CRUD | /api/admin/breaking | إدارة الأخبار العاجلة |
| CRUD | /api/admin/infographics | إدارة الانفوجراف |
| CRUD | /api/admin/special-files | إدارة الملفات الخاصة |
| CRUD | /api/admin/authors | إدارة الكتّاب |
| CRUD | /api/admin/tags | إدارة الوسوم |
| CRUD | /api/admin/pages | إدارة الصفحات الثابتة |
| CRUD | /api/admin/homepage-modules | إدارة وحدات الصفحة الرئيسية |
| CRUD | /api/admin/settings | إدارة الإعدادات |
| CRUD | /api/admin/users | إدارة المستخدمين |
| CRUD | /api/admin/menus | إدارة القوائم |
| CRUD | /api/admin/media | إدارة الوسائط |

## البنية المعمارية
```
backend/
├── prisma/          # مخطط قاعدة البيانات وملف البذور
├── src/
│   ├── config/      # إعدادات التطبيق
│   ├── lib/         # Prisma client
│   ├── middlewares/  # Auth, Upload, Validation, Error handling
│   ├── modules/     # الوحدات (كل وحدة تحتوي routes, controller, service)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── articles/
│   │   ├── sections/
│   │   ├── ...
│   │   └── public/  # Public API routes
│   ├── utils/       # أدوات مساعدة
│   ├── app.ts       # تطبيق Express
│   └── server.ts    # نقطة البدء
└── uploads/         # ملفات مرفوعة
```
