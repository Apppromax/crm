# CRM Pro V2 — Development Roadmap

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-16  
> **Trạng thái:** In Progress — Phase 1-3 Complete, Phase 4 Partial  
> **Tham chiếu:** [PRD.md](./PRD.md)  

---

## Tổng Quan Roadmap

```
Phase 1: Foundation (MVP Core)     ████████████████  ✅ DONE
Phase 2: Intelligence (AI Layer)   ██████████████░░  ~90% (AI Coach real, Realtime ✅)
Phase 3: Manager & CEO             ████████████████  ✅ DONE
Phase 4: Polish & Launch           █████████████░░░  ~85% (Perf ✅, E2E ✅, Security ✅, Monitoring ✅)
                                                Total: ~12 tuần
```

---

## Phase 1: Foundation (MVP Core) — ~4 tuần

> **Mục tiêu:** Sale có thể đăng nhập, xem Top 3 Cards, ghi chú, và thăng hạng mốc.

### Sprint 1 (Tuần 1-2): Setup & Core Data

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 1.1 | Setup Next.js 14 + TypeScript + Tailwind | P0 | 0.5d | - |
| 1.2 | Setup Prisma + Supabase (dev env) | P0 | 0.5d | 1.1 |
| 1.3 | Implement Database Schema (14 tables) | P0 | 2d | 1.2 |
| 1.4 | Setup Supabase Auth + RBAC middleware | P0 | 1.5d | 1.2 |
| 1.5 | Implement RLS policies | P0 | 1d | 1.3, 1.4 |
| 1.6 | Login/Register UI (mobile-first) | P0 | 1d | 1.4 |
| 1.7 | Lead CRUD API (create, read, update) | P0 | 2d | 1.3 |
| 1.8 | Seed data (demo org, team, users, leads) | P0 | 0.5d | 1.3 |

**Deliverable:** Auth flow working, database seeded, Lead CRUD API tested

### Sprint 2 (Tuần 3-4): Sale Screen Core

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 2.1 | SmartCard component | P0 | 1d | 1.7 |
| 2.2 | MilestoneBar component | P0 | 0.5d | - |
| 2.3 | Priority Score engine (FR-022) | P0 | 1.5d | 1.7 |
| 2.4 | Top 3 Cards API + UI | P0 | 1d | 2.1, 2.3 |
| 2.5 | Big Button + Quick Actions | P0 | 0.5d | 2.4 |
| 2.6 | Interaction API (add note) | P0 | 1d | 1.7 |
| 2.7 | Milestone Promotion flow (FR-011) | P0 | 1.5d | 2.2, 2.6 |
| 2.8 | Milestone Demotion logic (FR-012) | P0 | 0.5d | 2.7 |
| 2.9 | Schedule/Follow-up picker (FR-023) | P0 | 1d | 2.6 |
| 2.10 | Snooze Logic (FR-021) | P0 | 1.5d | 2.3 |
| 2.11 | 72h Golden Rule (FR-020) | P0 | 1d | 2.3 |
| 2.12 | My Leads list (pagination, filter) | P0 | 1d | 2.1 |
| 2.13 | Lead Detail screen | P0 | 1.5d | 2.1 |
| 2.14 | PWA setup (manifest, service worker) | P1 | 0.5d | 1.1 |

**Deliverable:** Sale có thể dùng app trên mobile — xem Top 3, ghi chú, thăng hạng, hẹn lịch

---

## Phase 2: Intelligence (AI Layer) — ~3 tuần

> **Mục tiêu:** Tích hợp Gemini AI — Voice-to-Text, AI Coach, Anti-Hoarding

### Sprint 3 (Tuần 5-6): AI Core + Anti-Hoarding

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 3.1 | Gemini API client setup | P0 | 0.5d | - |
| 3.2 | Voice-to-Text basic (Web Speech API) | P0 | 1d | - |
| 3.3 | Gemini text standardization | P1 | 1.5d | 3.1 |
| 3.4 | AI label extraction ([Tài chính], [Nhu cầu]...) | P1 | 1d | 3.1 |
| 3.5 | BANT auto-extraction (FR-032) | P1 | 1.5d | 3.1 |
| 3.6 | VoiceRecorder component (UI) | P0 | 1d | 3.2 |
| 3.7 | Anti-Hoarding: consecutive miss counter (FR-040) | P0 | 1d | Phase 1 |
| 3.8 | Anti-Hoarding: 15-day auto-reclaim (FR-041) | P1 | 1d | Phase 1 |
| 3.9 | Anti-Hoarding: UI popups | P0 | 0.5d | 3.7 |
| 3.10 | Cron job: Snooze expiry checker | P1 | 0.5d | 2.10 |
| 3.11 | Cron job: 72h expiry checker | P1 | 0.5d | 2.11 |

**Deliverable:** Sale nói ghi chú bằng giọng, AI chuẩn hóa, Anti-Hoarding chạy tự động

### Sprint 4 (Tuần 7): AI Coach + Timeline

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 4.1 | AI Coach prompt templates (per milestone) | P1 | 1.5d | 3.1 |
| 4.2 | AI Coach API endpoint | P1 | 0.5d | 4.1 |
| 4.3 | AICoachPanel component (UI) | P1 | 1d | 4.2 |
| 4.4 | AI Timeline summary (FR-036) | P1 | 1d | 3.1 |
| 4.5 | Milestone History API | P0 | 0.5d | Phase 1 |
| 4.6 | AI response caching (5min TTL) | P1 | 0.5d | 4.2 |

**Deliverable:** AI Coach gợi ý theo mốc, Timeline tóm tắt bằng AI

---

## Phase 3: Manager & CEO Dashboards — ~3 tuần

> **Mục tiêu:** Manager có Heatmap + SOS. CEO có Revenue Pulse + AI Summary.

### Sprint 5 (Tuần 8-9): Manager Dashboard

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 5.1 | Manager layout (responsive, sidebar) | P0 | 1d | - |
| 5.2 | Team Heatmap component (FR-050) | P0 | 2d | - |
| 5.3 | Heatmap API (real-time compliance calc) | P0 | 1.5d | 5.2 |
| 5.4 | Supabase Realtime channels setup | P1 | 1d | - |
| 5.5 | SOS Alert engine (FR-052) | P0 | 2d | 5.4 |
| 5.6 | SOS Alert UI (SOSCard component) | P0 | 1d | 5.5 |
| 5.7 | Shadow Mode (FR-053) | P1 | 1d | - |
| 5.8 | Quick Advice / "Lệnh sếp" (FR-054) | P1 | 1.5d | - |
| 5.9 | Activity Streak logic + UI (FR-051) | P2 | 1d | - |
| 5.10 | Lead Pool management (kho chung) | P1 | 1d | - |
| 5.11 | Lead reassignment flow | P1 | 0.5d | 5.10 |

**Deliverable:** Manager Dashboard hoạt động đầy đủ — Heatmap, SOS, Jump-in

### Sprint 6 (Tuần 10): CEO Dashboard

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 6.1 | CEO Glassmorphism layout (dark theme) | P0 | 1.5d | - |
| 6.2 | Revenue Pulse component (Neon numbers) | P0 | 1d | - |
| 6.3 | Revenue API (actual + pipeline) | P0 | 1d | - |
| 6.4 | AI Executive Summary (FR-033) | P1 | 1.5d | 3.1 |
| 6.5 | Team Efficiency / Top Warriors | P1 | 1d | - |
| 6.6 | Lead Burn Rate calculator | P1 | 0.5d | - |
| 6.7 | Sankey Diagram (D3.js) | P2 | 2d | 4.5 |
| 6.8 | Confidence Score AI model | P2 | 1d | 3.1 |

**Deliverable:** CEO Dashboard — Revenue Pulse, AI Summary, Flow Map

---

## Phase 4: Polish & Launch — ~2 tuần

> **Mục tiêu:** Stabilize, optimize, và launch production.

### Sprint 7 (Tuần 11-12): Final Polish

| # | Task | Priority | Effort | Dependency |
|---|------|----------|--------|-----------|
| 7.1 | Win-Rate Predictor (FR-034) | P2 | 1.5d | - |
| 7.2 | Burnout Alert (FR-035) | P2 | 1d | - |
| 7.3 | Weekly Snapshot via Zalo/Telegram (FR-081) | P2 | 2d | - |
| 7.4 | In-app notification system (FR-080) | P0 | 1.5d | - |
| 7.5 | PWA offline cache refinement | P1 | 1d | - |
| 7.6 | Performance optimization (Core Web Vitals) | P1 | 1d | ✅ Done — All pages < 300ms |
| 7.7 | Security audit (encryption, RLS test) | P0 | 1d | - |
| 7.8 | E2E testing (critical flows) | P0 | 2d | ✅ Done — 25 tests, 22 pass |
| 7.9 | Staging deployment + UAT | P0 | 1d | ✅ Done — Vercel |
| 7.10 | Production deployment | P0 | 0.5d | ✅ Done — crmprov2.vercel.app |
| 7.11 | Monitoring setup (error tracking, uptime) | P1 | 0.5d | 7.10 |
| 7.12 | User onboarding guide | P1 | 0.5d | - |

**Deliverable:** Production launch! 🚀

---

## Post-Launch (Backlog)

| Feature | Priority | Description |
|---------|----------|-------------|
| Tích hợp tổng đài VoIP | P3 | Click-to-call trực tiếp từ app |
| Marketing dashboard | P3 | Theo dõi ROI theo nguồn lead |
| Mobile notifications (Push) | P2 | Firebase Cloud Messaging |
| Multi-project support | P3 | Quản lý nhiều dự án BĐS cùng lúc |
| Customer portal | P3 | Khách hàng tự xem tiến trình |
| WhatsApp integration | P3 | Chat tích hợp |
| Advanced analytics | P3 | Cohort analysis, funnel drill-down |

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Gemini API rate limit | AI features chậm/down | Cache + fallback tips |
| Sale không chịu dùng | Dự án thất bại | UX cực đơn giản + gamification |
| Data migration phức tạp | Delay launch | Bắt đầu với data mới, import sau |
| Supabase free tier limits | Scale bottleneck | Monitor usage, upgrade khi cần |

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo Roadmap ban đầu — 4 phases, 7 sprints, ~12 tuần | AI |
> | 2026-03-16 | 1.1 | Cập nhật trạng thái: Phase 1-3 Done, Phase 4 partial (perf + E2E done) | AI |
