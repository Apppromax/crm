# CRM Pro V2 — Changelog

> Ghi nhận mọi thay đổi quan trọng theo từng phiên làm việc.  
> Format: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### 🚀 Added (2026-03-14 — Sprint 1: Foundation)

#### Task 1.1: Setup Next.js + TypeScript + Tailwind ✅
- Init Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
- Turbopack dev mode enabled
- PWA metadata configured (manifest, viewport, apple-web-app)
- Inter font (Vietnamese subset) loaded via Google Fonts
- Files: `package.json`, `layout.tsx`, `globals.css`, `next.config.ts`

#### Task 1.2: Setup Prisma + Supabase ✅
- Prisma 7.5 initialized with `prisma.config.ts`
- Supabase clients created (browser, server, middleware)
- Session management middleware with auth redirect
- Files: `prisma.config.ts`, `src/lib/prisma.ts`, `src/lib/supabase/*`, `src/middleware.ts`

#### Task 1.3: Database Schema ✅ (Partial — Generate only, not pushed)
- 14 tables defined in Prisma schema
- 11 enums defined (UserRole, LeadStatus, BANTLevel, etc.)
- All indexes and relations configured
- `prisma generate` successful
- Files: `prisma/schema.prisma`

#### Task 1.6: Login UI ✅
- Glassmorphism dark login page
- Email + Password form with Supabase Auth
- Loading state + error handling
- Mobile-first responsive
- Files: `src/app/(auth)/login/page.tsx`

#### Sale Dashboard UI (Preview — Demo Data) ✅
- SmartCard component with: priority badges, milestone progress bar, heat score, BANT, AI summary
- BigButton component (primary CTA)
- Sale layout with bottom navigation (floating action button)
- Sale home page with Top 3 Priority Cards
- Design system: custom CSS variables, animations, glassmorphism, neon effects
- Files: `src/components/sale/smart-card.tsx`, `src/components/sale/big-button.tsx`, `src/app/(sale)/*`

#### Infrastructure
- TypeScript types for all entities (`src/types/index.ts`)
- Utility functions: VND formatting, milestone labels, relative time, phone masking
- Environment variables template (`.env`)
- Files: `src/types/index.ts`, `src/lib/utils.ts`, `.env`

### 🚀 Added (2026-03-14 — Session 2: Full UI)

#### Mock Data Layer ✅
- 6 leads with full data (milestones 1-5, BANT, interactions, history)
- AI Coach responses per milestone
- Auth middleware bypassed for dev (no Supabase needed)
- Files: `src/lib/mock-data.ts`, `src/middleware.ts`

#### Sale — Lead Detail Page ✅
- Milestone stepper (5 dots with progress)
- Collapsible AI Coach panel (tip, objection handler, signal question)
- Manager advice ("Lệnh sếp") banner
- BANT customer info (Budget, Authority, Need, Timeline)
- Interaction timeline with type badges, AI labels, 72h indicator
- Milestone history
- Fixed bottom note input with voice recording toggle
- Milestone Promotion modal (promote/skip + schedule picker)
- Files: `src/components/sale/lead-detail-client.tsx`, `src/components/sale/milestone-promotion-modal.tsx`

#### Sale — My Leads List ✅
- Search by name
- Status filter chips (All/Active/Won)
- Milestone quick filter tabs
- Lead list items with avatar initials, heat scores, mini progress bars
- Files: `src/app/(sale)/sale/leads/page.tsx`

#### Sale — New Lead Form ✅
- Form: name, phone, email, source chips, deal value, notes
- Success animation with 72h Vàng reminder
- Files: `src/app/(sale)/sale/new/page.tsx`

#### Sale — Stats Page ✅
- Pipeline Value gradient card
- KPI grid (Won, Streak, M4-5, 72h)
- Visual funnel chart by milestone
- Files: `src/app/(sale)/sale/stats/page.tsx`

#### Sale — Settings Page ✅
- User profile card
- Grouped settings (Notifications, PWA, Dark Mode, Language, Security)
- Logout button
- Files: `src/app/(sale)/sale/settings/page.tsx`

#### Manager Dashboard ✅
- Team Heatmap with compliance rings (Green/Yellow/Red)
- Overview cards (Compliance %, Active Leads, SOS count)
- SOS alert badge with pulse animation
- Streak leaderboard
- Files: `src/app/(manager)/manager/page.tsx`

#### Manager SOS Alerts ✅
- Critical/Warning severity classification
- Lead info + heat score + deal value
- Action buttons: View Detail, Send Order, Resolve
- Empty state animation
- Files: `src/app/(manager)/manager/sos/page.tsx`

#### CEO Dashboard ✅ 🎨
- Glassmorphism dark theme (deep navy background)
- Revenue Pulse: neon glowing numbers (Actual/Pipeline/Confidence)
- KPI target progress bar
- AI Executive Summary (3-line Gemini insights)
- Top Warriors leaderboard with scores
- Quick metrics (Daily interactions, Burn Rate)
- Files: `src/app/(ceo)/ceo/page.tsx`

### 🚀 Added (2026-03-15 — Session 3: Business Logic + Full Pages)

#### Business Logic Engine ✅
- Priority Score calculator with 8 weighted factors
- 72h Golden timer with urgency levels (NORMAL/WARNING/CRITICAL)
- Snooze system with 6 preset options
- Anti-Hoarding detection (consecutive miss + stale lead)
- Milestone Demotion checker for M4/M5 fallback
- Files: `src/lib/engine.ts`

#### VoiceRecorder Component ✅
- Web Speech API integration (vi-VN)
- Real-time waveform animation + duration counter
- Interim/final transcript display
- Graceful fallback when unsupported
- Files: `src/components/sale/voice-recorder.tsx`

#### Snooze Popup ✅
- Bottom sheet with 6 preset options (15m → tomorrow 9am)
- Files: `src/components/sale/snooze-popup.tsx`

#### Anti-Hoarding Popup ✅
- Severity-based colors (critical/warning)
- Action buttons per type (retry/reclaim/schedule)
- Files: `src/components/sale/anti-hoarding-popup.tsx`

#### Manager — Team List + Detail ✅
- Team member list with status dots
- Member detail: stats grid, Send Order, Shadow Mode, lead list, advice history
- Files: `src/app/(manager)/manager/team/*`

#### Manager — Reports ✅
- KPI cards (calls, meetings, won) with trend arrows
- Weekly activity horizontal bar chart
- Milestone distribution stacked bar
- Pipeline value gradient card
- Files: `src/app/(manager)/manager/reports/page.tsx`

#### Manager — Settings ✅
- Profile card, team management, KPI targets, alert settings
- Files: `src/app/(manager)/manager/settings/page.tsx`

#### Notification Panel ✅
- Slide-in panel with 5 notification types (SOS/Milestone/Advice/Schedule/System)
- Unread badges, mark-all-read, individual marking
- Files: `src/components/shared/notification-panel.tsx`

#### PWA Manifest ✅
- Vietnamese locale, standalone display, portrait lock
- App shortcuts (Thêm Lead, Leads list)
- Files: `public/manifest.json`

#### Zustand Stores ✅
- Theme store (dark mode toggle, persisted)
- App store (snooze timers per-lead, notification count, persisted)
- Files: `src/lib/stores.ts`

---

## Convention

### Phân loại thay đổi
- **Added**: Tính năng mới
- **Changed**: Thay đổi tính năng hiện có
- **Deprecated**: Tính năng sẽ bị loại bỏ
- **Removed**: Tính năng đã bị loại bỏ
- **Fixed**: Sửa lỗi
- **Security**: Vá lỗ hổng bảo mật
- **Documentation**: Cập nhật tài liệu
- **Refactored**: Tái cấu trúc code (không thay đổi chức năng)

### Format mỗi entry
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Category
- **Component/Module**: Mô tả thay đổi (link to PR/commit nếu có)
  - Chi tiết bổ sung nếu cần
  - Files affected: `file1.ts`, `file2.ts`
```

---

> 📌 File này được cập nhật tự động theo hướng dẫn trong [AI-GUIDE.md](./AI-GUIDE.md)
