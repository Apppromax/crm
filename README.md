# CRM Pro V2 — Hệ Điều Hành Bán Hàng Bất Động Sản

> **Đọc file này TRƯỚC TIÊN khi bắt đầu bất kỳ phiên làm việc nào.**

---

## 🎯 Dự Án Là Gì?

CRM Pro V2 là ứng dụng **web mobile-first (PWA)** quản lý pipeline bán hàng Bất Động Sản. Hệ thống không chỉ lưu data mà **điều phối hành vi** đội Sales bằng AI Gemini và logic tự động hóa.

### 3 Vai Trò Chính

| Role | Màn hình | Triết lý |
|------|---------|---------|
| **SALE** | Top 3 Cards + Big Button | Thực thi kỷ luật & Chốt đơn |
| **MANAGER** | Heatmap + SOS Jump-in | Hỗ trợ chiến thuật & Cứu deal |
| **CEO/DIRECTOR** | Revenue Pulse + AI Summary | Nhìn dòng tiền & Ra quyết định chiến lược |

### Tính Năng Cốt Lõi
- **5 Mốc Thăng Hạng** (Pipeline 20% → 100%) với cơ chế rớt mốc
- **72h Vàng** — Lead mới được ưu tiên tuyệt đối trong 3 ngày đầu
- **Snooze Logic** — Ẩn/hiện card tự động theo chu kỳ thông minh
- **AI Coach** (Gemini) — Gợi ý kịch bản, Voice-to-Text, tóm tắt timeline
- **Anti-Hoarding** — Tự động dọn rác lead bị bỏ rơi
- **SOS & Jump-in** — Manager can thiệp cứu deal kịp thời
- **Glassmorphism CEO Dashboard** — 3 số + 3 dòng AI = ra quyết định

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **Next.js 16.1** (App Router) + **React 19** |
| Styling | **Tailwind CSS v4** + Custom CSS |
| Language | **TypeScript 5+** |
| ORM | **Prisma 7.5** + `@prisma/adapter-pg` |
| Database | **PostgreSQL** (Supabase) |
| Auth | **Supabase Auth** (JWT) — planned |
| AI | **Google Gemini API** — planned |
| Hosting | **Vercel** |
| State | **Zustand** (persisted) |

---

## 📁 Cấu Trúc Thư Mục

```
CRMPROV2/
├── docs/                    ← 📋 TÀI LIỆU DỰ ÁN
│   ├── PRD.md / SRS.md     ← Yêu cầu sản phẩm + kỹ thuật
│   ├── ARCHITECTURE.md     ← Kiến trúc hệ thống
│   ├── DATABASE.md         ← Schema Prisma (14 tables)
│   ├── CHANGELOG.md        ← Nhật ký thay đổi
│   └── ROADMAP.md          ← Lộ trình phát triển
├── prisma/
│   ├── schema.prisma       ← Database schema (14 tables, 11 enums)
│   └── seed.ts             ← Seed data (5 users, 6 leads)
├── src/
│   ├── app/
│   │   ├── (auth)/         ← Login
│   │   ├── (sale)/         ← Sale: Home, Leads, Detail, Schedule, Stats, Achievements
│   │   ├── (manager)/      ← Manager: Dashboard, SOS, Team, Shadow, Pool, Reports
│   │   ├── (ceo)/          ← CEO: Dashboard, Analytics, Team, Settings
│   │   └── actions/        ← Server Actions (leads, interactions, users, dashboard)
│   ├── components/
│   │   ├── sale/           ← SmartCard, BigButton, VoiceRecorder, Popups
│   │   ├── manager/        ← SendAdviceModal
│   │   ├── shared/         ← NotificationPanel, Gamification, PWA
│   │   └── dev/            ← RoleSwitcher (dev-only)
│   └── lib/                ← prisma.ts, cache.ts, engine.ts, utils.ts, stores.ts
├── prisma.config.ts        ← Prisma v7 config (datasource URL, seed command)
└── package.json
```

### 📊 Trạng Thái Hiện Tại

| Module | Pages | DB Connected | Performance | Status |
|--------|-------|-------------|-------------|--------|
| **Sale** | 7 pages | ✅ SSR + Cache | ✅ < 300ms | 🟢 Live |
| **Manager** | 7 pages | ✅ SSR + Cache | ✅ < 300ms | 🟢 Live |
| **CEO** | 4 pages | ✅ SSR + Cache | ✅ < 300ms | 🟢 Live |
| **Auth** | 1 page | ✅ Supabase Auth | N/A | 🟢 Live |
| **E2E Tests** | 25 tests | N/A | N/A | 🟢 22/25 Pass |

---

## 🤖 HƯỚNG DẪN CHO AI — QUY TRÌNH LÀM VIỆC

### ⚡ Bắt Đầu Phiên Mới (BẮT BUỘC)

```
Bước 1: Đọc README.md (file này) → Hiểu tổng quan dự án
Bước 2: Đọc docs/CHANGELOG.md → Biết phiên trước làm gì
Bước 3: Đọc docs/ROADMAP.md → Biết task tiếp theo là gì
Bước 4: Đọc docs/[file liên quan].md theo task cụ thể
```

### ⚡ Kết Thúc Phiên (BẮT BUỘC)

```
Bước 1: Cập nhật docs/CHANGELOG.md → Ghi lại thay đổi
Bước 2: Cập nhật docs/ROADMAP.md → Đánh dấu task hoàn thành
Bước 3: Cập nhật docs khác nếu spec thay đổi
```

### ⚡ Dependency Chain

```
Thêm feature    → PRD → SRS → DATABASE → API → UI-UX → ROADMAP → CHANGELOG
Sửa database    → DATABASE → API → SRS → CHANGELOG
Sửa API         → API → SRS → CHANGELOG
Fix bug         → CHANGELOG
```

---

## 📐 QUY TẮC CODE

- **Server Components mặc định** — `"use client"` chỉ khi cần interactivity
- **Service Layer** cho business logic — Không để logic trong components
- **Mobile-first** — Code cho mobile trước
- **Type-safe** — Mọi function phải có TypeScript types

---

## 🚀 Chạy Dự Án

```bash
# Install dependencies
npm install

# Setup database (first time)
npm run db:generate
npm run db:push
npm run db:seed          # Seed demo data

# Run development server
npm run dev              # → http://localhost:3000

# Prisma tools
npm run db:studio        # Visual DB editor
```

### 🌐 Deploy

- **GitHub**: [Apppromax/crm](https://github.com/Apppromax/crm)
- **Vercel**: Import from GitHub → Add env vars → Deploy
- **Build**: `prisma generate && next build` (auto in `npm run build`)

---

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://...@supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📎 Liên Kết Tài Liệu

| Cần gì? | Đọc file |
|---------|---------|
| Tổng quan features | [docs/PRD.md](./docs/PRD.md) |
| Yêu cầu kỹ thuật | [docs/SRS.md](./docs/SRS.md) |
| Kiến trúc hệ thống | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Database Schema | [docs/DATABASE.md](./docs/DATABASE.md) |
| API Endpoints | [docs/API.md](./docs/API.md) |
| Design System + UI | [docs/UI-UX.md](./docs/UI-UX.md) |
| Lộ trình phát triển | [docs/ROADMAP.md](./docs/ROADMAP.md) |
| Lịch sử thay đổi | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| Hướng dẫn cập nhật docs | [docs/AI-GUIDE.md](./docs/AI-GUIDE.md) |

---

> ⚠️ Docs luôn phải phản ánh trạng thái THỰC TẾ của code.
> Mỗi phiên làm việc PHẢI kết thúc bằng cập nhật CHANGELOG + ROADMAP.
