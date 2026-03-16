# CRM Pro V2 — Changelog

> Ghi nhận mọi thay đổi quan trọng theo từng phiên làm việc.  
> Format: [Semantic Versioning](https://semver.org/)

---
## [0.2.0] - 2026-03-16 — Session 7: Feature Completion

### 🚀 Added
- **Settings**: Change password (Supabase Auth), FAQ/Help modal (8 questions), Dark mode toggle (Zustand)
- **Gemini AI Coach**: Real Gemini 2.0 Flash integration with smart fallback to curated BĐS tips
- **AI Executive Summary**: CEO dashboard AI insights generation
- **Cron Jobs**: Auto snooze expiry, 72h SOS trigger, stale M4/M5 warnings (15 min interval)
- **In-app Notifications**: DB-backed notification system with Prisma model, server actions, optimistic UI
- **Supabase Realtime**: React hooks for live updates (notifications, leads, SOS)
- **Security Headers**: CSP, HSTS, X-Frame-Options, rate limiting (100 req/min)
- **Error Monitoring**: Vercel Analytics + Speed Insights, /api/health endpoint
- **RLS Policies**: SQL file ready for Supabase (role-based data access)

### 🔧 Fixed
- All 25 E2E tests pass (networkidle → waitForTimeout, Snooze button scroll fix)
- Date serialization from unstable_cache (getTime/toISOString)
- Middleware reverted to getUser() for Vercel production stability

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

### 🚀 Added (2026-03-15 — Session 4: Supabase Integration + Deploy)

#### Supabase Database Connection ✅
- Prisma v7 connected to Supabase PostgreSQL (session pooler port 5432)
- `@prisma/adapter-pg` driver adapter for Prisma v7 client engine
- `prisma db push --force-reset` — dropped all existing tables, created 14 fresh tables
- `prisma generate` — Prisma Client generated
- `prisma.config.ts` — datasource URL + seed command configured
- Files: `prisma.config.ts`, `src/lib/prisma.ts`, `.env`

#### Seed Data ✅
- 1 Organization (CRM Pro Demo Corp)
- 5 Lead Sources (Facebook Ads, Google Ads, Website, Referral, Cold Call)
- 1 Team (Alpha)
- 5 Users: 1 CEO, 1 Manager, 3 Sales
- 6 Leads with realistic BANT, milestones 1-4, BĐS deal values (1.8 tỷ → 8.2 tỷ)
- 5 Interactions (Call, Zalo Chat, Note) with AI labels
- 2 Milestone promotions, 3 Schedules, 2 SOS Alerts, 1 Manager Advice, 1 Daily Metrics
- Files: `prisma/seed.ts`

#### Server Actions (API Layer) ✅
- `leads.ts` — getTopPriorityLeads, getLeadsByUser, getLeadDetail, getLeadPool, createLead, updateMilestone, assignLead, snoozeLead
- `interactions.ts` — createInteraction (auto 72h golden detect), getInteractionsByLead
- `users.ts` — getUserByRole, getUserStats, getTeamMembers, getTeamPerformance
- `dashboard.ts` — getSOSAlerts, resolveSOSAlert, sendAdvice, getSchedulesByUser, getDashboardMetrics
- Files: `src/app/actions/*`

#### Frontend → Real Database ✅
- Sale Home page — SSR, reads top-priority leads + stats from Supabase
- Sale Home client component split (server/client pattern)
- Leads List — SSR, reads leads by assigned user
- Lead Detail — SSR, reads full lead with interactions, milestone history, schedules, advice
- Files: `src/app/(sale)/sale/page.tsx`, `home-client.tsx`, `leads/page.tsx`, `leads-list-client.tsx`, `leads/[id]/page.tsx`

#### Gamification Components ✅
- StreakCelebration modal with animated flames + milestone messages
- AchievementBadges grid (earned vs locked)
- Sale Achievements page — streak card, stats, badges, personal records
- Files: `src/components/shared/gamification.tsx`, `src/app/(sale)/sale/achievements/page.tsx`

#### CEO Dashboard Enhancements ✅
- Analytics sub-page — pipeline funnel, conversion rates, monthly revenue, lead source ROI
- Team Performance sub-page — individual rankings, revenue progress, compliance
- Settings page — profile, report preferences, notifications, security
- Bottom navigation (Dashboard / Analytics / Team / Settings)
- Files: `src/app/(ceo)/ceo/analytics/page.tsx`, `team/page.tsx`, `settings/page.tsx`, `layout.tsx`

#### Sale Enhancements ✅
- Schedule page — weekly calendar + daily agenda
- Lead Detail — VoiceRecorder, Snooze, Anti-Hoarding integration
- Golden 72h timer + Snooze button in note input
- Notification Bell → opens NotificationPanel
- Settings → links to Achievements + Stats pages
- Files: `src/app/(sale)/sale/schedule/page.tsx`, `src/components/sale/lead-detail-client.tsx`

#### Manager Enhancements ✅
- Shadow Mode — real-time monitoring of sales reps
- Lead Pool — unassigned leads with assignment interface
- Send Advice modal — quick commands + custom messages
- Files: `src/app/(manager)/manager/shadow/[id]/page.tsx`, `pool/page.tsx`, `src/components/manager/send-advice-modal.tsx`

#### Dev Tools ✅
- Role Switcher — floating button to switch Sale/Manager/CEO
- PWA Install Prompt — banner with dismiss persistence
- Files: `src/components/dev/role-switcher.tsx`, `src/components/shared/pwa-install-prompt.tsx`

#### Deployment ✅
- GitHub repo: `Apppromax/crm`
- Build script: `prisma generate && next build`
- tsconfig excludes `prisma/seed.ts`, `prisma.config.ts`
- Vercel deployment configured

### 🚀 Added & Fixed (2026-03-15 — Session 5: Vercel Deployment & E2E Testing)

#### Vercel Deployment & Prisma Connection Fix ✅
- Resolved `Module not found: Can't resolve '../../loading'` error on Vercel by converting relative imports to absolute alias paths (`@/app/(sale)/loading`) in `leads`, `schedule`, and `sale` pages.
- Fixed Supabase Prisma `MaxClientsInSessionMode` crash by adjusting `.env` connection strings (`connection_limit`) and confirming serverless pooling topology.
- Successfully built and deployed to production Vercel.

#### End-to-End (E2E) UI Testing with Playwright ✅
- Established comprehensive testing pipeline (`TEST_PLAN.md`).
- Auth & RBAC E2E Test (`e2e/auth.spec.ts`): Verified strict redirection. A Manager attempting to access `/ceo` is accurately redirected to `/manager`.
- User Workflow E2E Test (`e2e/workflow.spec.ts`): Automated login as Sale, creating a target lead ("Shark Hưng"), and verifying DOM propagation in the Leads list.
- Manager Workflow E2E Test (`e2e/manager.spec.ts`): Automated checking Heatmap, Shadowing Sale, and reviewing SOS Alerts.
- CEO Workflow E2E Test (`e2e/ceo.spec.ts`): Automated verification of Strategic Analytics and Team Performance leaderboards.
- Updated `playwright.config.ts` to output list format instead of HTML to prevent blocking terminals in headless modes.

#### Performance & UX Improvements ✅
- Converted Sale `leads`, `schedule`, and `home` pages to utilize React Server Components `<Suspense>` streaming, unblocking router queue for instant navigation transition feedback.
- Integrated `NextTopLoader` in root `layout.tsx` for visual progress feedback during Next.js router transitions.
- Enforced strict boundary redirect mappings dynamically in `users.ts` (`getUserByRole` action) to immediately deflect unauthorized roles (e.g., stopping a Sale from lingering on blank unassigned CEO views).

### 🚀 Performance & Bug Fixes (2026-03-16 — Session 6: Sub-300ms Optimization)

#### Caching Layer (`unstable_cache`) ✅
- Implemented centralized caching in `src/lib/cache.ts` with 120s TTL
- 19 cached query functions covering all Prisma operations
- Tag-based revalidation for granular cache invalidation
- Files: `src/lib/cache.ts`

#### Database Optimization ✅
- Added composite index `[userId, status, scheduledAt]` on `schedules`
- Added composite index `[status, leadId]` on `sos_alerts`
- Files: `prisma/schema.prisma`

#### Page Performance ✅
- All 12 pages now load < 300ms in production
- Sale: Home 102ms, Leads 203ms, Schedule 142ms, New 114ms
- Manager: Dashboard 90ms, SOS 222ms, Team 98ms, Pool 185ms
- CEO: Dashboard 154ms, Team 139ms

#### Suspense Streaming ✅
- Added `<Suspense>` wrappers to Manager Team, Manager Pool, CEO Team pages
- Separated data fetching into async sub-components for streaming
- Files: `src/app/(manager)/manager/team/page.tsx`, `pool/page.tsx`, `src/app/(ceo)/ceo/team/page.tsx`

#### Prefetch Cache Warming ✅
- Created `PrefetchPages` client component for background cache warming
- Integrated into Sale and Manager layouts
- Uses `requestIdleCallback` to avoid main thread blocking
- Files: `src/components/prefetch-pages.tsx`, layouts

#### Bug Fixes ✅
- **Middleware**: Reverted `getSession()` → `getUser()` — `getSession()` caused 500 errors on Vercel due to expired JWT local validation
- **Date Serialization**: Fixed `unstable_cache` Date→string serialization crash (`a.getTime is not a function`)
  - `formatRelativeTime()` now accepts `Date | string`
  - Safe `.toISOString()` guards on `scheduledAt`, `lastInteractionAt`, `updatedAt`
- **Fast-path middleware**: Skip auth for `/_next`, `/api`, static assets
- Files: `src/lib/supabase/middleware.ts`, `src/lib/utils.ts`, multiple page files

#### E2E Test Expansion ✅
- Added Phase 6: Lead Lifecycle tests (milestone, snooze, interaction types)
- Added Phase 7: Manager Actions tests (SOS resolve, shadow view, lead pool)
- Fixed `networkidle` timeout in dev mode (Turbopack HMR websocket)
- Performance benchmark test for all 3 roles
- Files: `e2e/full-test-plan.spec.ts`, `e2e/debug.spec.ts`

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
