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
| Frontend | **Next.js 14+** (App Router) + **React 18+** |
| Styling | **Tailwind CSS v4** |
| Language | **TypeScript 5+** |
| ORM | **Prisma 5+** |
| Database | **PostgreSQL** (Supabase) |
| Auth | **Supabase Auth** (JWT) |
| Real-time | **Supabase Realtime** (WebSocket) |
| AI | **Google Gemini API** |
| Hosting | **Vercel** (Edge Runtime) |

---

## 📁 Cấu Trúc Thư Mục

```
CRMPROV2/
├── docs/                    ← 📋 TÀI LIỆU DỰ ÁN (BẮT BUỘC ĐỌC)
│   ├── PRD.md              ← Yêu cầu sản phẩm
│   ├── SRS.md              ← Yêu cầu kỹ thuật (35+ FR)
│   ├── ARCHITECTURE.md     ← Kiến trúc hệ thống
│   ├── DATABASE.md         ← Schema Prisma (14 tables)
│   ├── API.md              ← API Specification (25+ endpoints)
│   ├── UI-UX.md            ← Design System + Wireframes
│   ├── ROADMAP.md          ← Lộ trình 4 phases, 7 sprints
│   ├── CHANGELOG.md        ← Nhật ký thay đổi
│   └── AI-GUIDE.md         ← Hướng dẫn AI cập nhật docs
├── src/                     ← 💻 SOURCE CODE
│   ├── app/                ← Next.js App Router
│   │   ├── (auth)/         ← Login, Register
│   │   ├── (sale)/         ← Sale screens
│   │   ├── (manager)/      ← Manager screens
│   │   ├── (ceo)/          ← CEO Dashboard
│   │   └── api/            ← API Route Handlers
│   ├── components/         ← React Components
│   ├── services/           ← Business logic layer
│   ├── lib/                ← Utility, clients
│   ├── hooks/              ← Custom React hooks
│   └── types/              ← TypeScript types
├── prisma/
│   ├── schema.prisma       ← Database schema
│   └── migrations/
└── README.md               ← 📖 FILE NÀY
```

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

# Setup database
npm run db:generate
npm run db:push

# Run development server
npm run dev

# Open Prisma Studio
npm run db:studio
```

---

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
GEMINI_API_KEY="AIza..."
ENCRYPTION_KEY="random-32-char-key"
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
