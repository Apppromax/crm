# CRM Pro V2 — System Architecture

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-14  
> **Trạng thái:** Draft  
> **Tham chiếu:** [PRD.md](./PRD.md) | [SRS.md](./SRS.md)  

---

## 1. Tech Stack

### 1.1 Lựa chọn & Lý do

| Layer | Technology | Lý do chọn |
|-------|-----------|-----------|
| **Frontend Framework** | Next.js 14+ (App Router) | SSR/SSG, mobile performance, SEO, file-based routing |
| **UI Library** | React 18+ | Component-based, ecosystem lớn |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive nhanh, dark mode native |
| **State Management** | Zustand / React Context | Lightweight, phù hợp app không quá phức tạp |
| **ORM** | Prisma | Type-safe, migration management, query builder |
| **Database** | PostgreSQL (Supabase) | RLS, Realtime, Auth built-in, free tier tốt |
| **Authentication** | Supabase Auth | Email/Password, phone OTP, social login |
| **Real-time** | Supabase Realtime | WebSocket native, tích hợp sẵn với DB |
| **AI** | Google Gemini API | Tiếng Việt tốt, multimodal (text + voice), cost-effective |
| **Speech** | Web Speech API + Gemini | Browser native STT + Gemini refine |
| **Hosting** | Vercel | Edge runtime, tối ưu Next.js, auto-scaling |
| **PWA** | next-pwa / Serwist | Offline support, installable, push notification |
| **Charts** | Recharts / D3.js | Sankey diagram, custom charts, React-friendly |
| **Notification** | Zalo OA API + Telegram Bot | Kênh quen thuộc của user Việt Nam |

### 1.2 Phiên bản yêu cầu
```
Node.js       >= 20.x LTS
Next.js       >= 14.2
React         >= 18.3
Prisma        >= 5.x
TypeScript    >= 5.x
PostgreSQL    >= 15
```

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                           │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ Sale PWA │  │ Manager  │  │ CEO Dashboard         │  │
│  │ (Mobile) │  │ (Tablet) │  │ (Desktop/Glassmorphism)│  │
│  └─────┬────┘  └─────┬────┘  └──────────┬────────────┘  │
│        └──────────────┼─────────────────┘                 │
│                       │                                    │
├───────────────────────┼────────────────────────────────────┤
│              NEXT.JS APP ROUTER                            │
│  ┌────────────────────┼──────────────────────────────┐    │
│  │          API Routes (Route Handlers)                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │    │
│  │  │ Lead API │ │ Auth API │ │ Dashboard API     │  │    │
│  │  └──────────┘ └──────────┘ └───────────────────┘  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │    │
│  │  │ AI API   │ │ Notif API│ │ Analytics API     │  │    │
│  │  └──────────┘ └──────────┘ └───────────────────┘  │    │
│  └───────────────────────────────────────────────────┘    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                   SERVICE LAYER                             │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────────┐     │
│  │ Lead Service │ │ AI Service │ │ Priority Engine  │     │
│  │ (CRUD, RBAC) │ │ (Gemini)   │ │ (Score, Snooze)  │     │
│  └──────────────┘ └────────────┘ └──────────────────┘     │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────────┐     │
│  │ Milestone Svc│ │ Notif Svc  │ │ Analytics Svc   │     │
│  │ (Pipeline)   │ │(Zalo/Tele) │ │ (Reports, KPI)   │     │
│  └──────────────┘ └────────────┘ └──────────────────┘     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                    DATA LAYER                               │
│  ┌──────────────────────────────────────────────────┐     │
│  │              Prisma ORM                            │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │         Supabase (PostgreSQL)             │     │     │
│  │  │  ┌─────┐ ┌────────┐ ┌───────────────┐   │     │     │
│  │  │  │ RLS │ │Realtime│ │ Auth (built-in)│   │     │     │
│  │  │  └─────┘ └────────┘ └───────────────┘   │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                 EXTERNAL SERVICES                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐     │
│  │ Gemini API │ │ Zalo OA    │ │ Telegram Bot       │     │
│  └────────────┘ └────────────┘ └────────────────────┘     │
└────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│  Sale   │────▶│ Next.js API  │────▶│  Prisma +   │
│  (PWA)  │◀────│   Routes     │◀────│  Supabase   │
└─────────┘     └──────┬───────┘     └─────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Gemini API    │
              │ ┌────────────┐ │
              │ │ AI Coach   │ │
              │ │ Voice→Text │ │
              │ │ Summary    │ │
              │ │ Predictor  │ │
              │ └────────────┘ │
              └────────────────┘
```

---

## 3. Component Architecture

### 3.1 Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   └── register/
│   ├── (sale)/                   # Sale role layout
│   │   ├── layout.tsx            # Mobile-optimized layout
│   │   ├── page.tsx              # Top 3 Cards + Big Button
│   │   ├── leads/
│   │   │   ├── page.tsx          # My Leads list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Lead detail + AI Coach
│   │   └── settings/
│   ├── (manager)/                # Manager role layout
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Heatmap + SOS Dashboard
│   │   ├── team/
│   │   ├── sos/
│   │   └── analytics/
│   ├── (ceo)/                    # CEO role layout
│   │   ├── layout.tsx            # Glassmorphism dark layout
│   │   ├── page.tsx              # Revenue Pulse + AI Summary
│   │   └── analytics/
│   └── api/                      # API Route Handlers
│       ├── leads/
│       ├── milestones/
│       ├── ai/
│       ├── notifications/
│       └── analytics/
├── components/
│   ├── ui/                       # Shared UI primitives
│   ├── sale/                     # Sale-specific components
│   │   ├── SmartCard.tsx
│   │   ├── BigButton.tsx
│   │   ├── MilestoneBar.tsx
│   │   ├── VoiceRecorder.tsx
│   │   └── AICoach.tsx
│   ├── manager/                  # Manager components
│   │   ├── TeamHeatmap.tsx
│   │   ├── SOSPanel.tsx
│   │   ├── StreakBoard.tsx
│   │   └── ShadowTimeline.tsx
│   └── ceo/                      # CEO components
│       ├── RevenuePulse.tsx
│       ├── TeamEfficiency.tsx
│       ├── AISummary.tsx
│       └── SankeyFlow.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── supabase.ts               # Supabase client
│   ├── gemini.ts                 # Gemini AI client
│   └── utils.ts                  # Shared utilities
├── services/
│   ├── lead.service.ts           # Lead CRUD logic
│   ├── milestone.service.ts      # Milestone transitions
│   ├── priority.service.ts       # Priority Score calculator
│   ├── snooze.service.ts         # Snooze logic
│   ├── anti-hoarding.service.ts  # Cleanup logic
│   ├── ai.service.ts             # Gemini AI wrapper
│   ├── notification.service.ts   # Push + external notif
│   └── analytics.service.ts      # Dashboard data aggregation
├── hooks/
│   ├── useVoiceRecorder.ts       # Voice recording hook
│   ├── useRealtime.ts            # Supabase realtime hook
│   ├── usePriorityCards.ts       # Top 3 cards hook
│   └── useAuth.ts                # Auth state hook
├── types/
│   ├── lead.ts
│   ├── milestone.ts
│   ├── user.ts
│   └── api.ts
├── middleware.ts                  # Auth + RBAC middleware
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### 3.2 Key Component Relationships

```
Sale Screen:
  TopCards (usePriorityCards)
    ├── SmartCard × 3
    │   ├── MilestoneBar
    │   ├── HeatBadge
    │   └── SnoozeTimer
    └── BigButton
        ├── VoiceRecorder (useVoiceRecorder)
        ├── NoteEditor
        ├── MilestonePromotion (popup)
        └── SchedulePicker

Manager Screen:
  ManagerDashboard
    ├── TeamHeatmap (useRealtime)
    ├── SOSPanel
    │   ├── SOSCard × N
    │   └── JumpInModal
    │       ├── ShadowTimeline
    │       └── QuickAdvice
    └── StreakBoard

CEO Screen:
  CEODashboard (Glassmorphism theme)
    ├── RevenuePulse
    │   ├── ActualRevenue
    │   ├── PipelineValue
    │   └── ConfidenceScore
    ├── TeamEfficiency
    │   ├── TopWarriors
    │   └── BurnRateAlert
    ├── AISummary
    └── SankeyFlow (D3.js)
```

---

## 4. AI Integration Architecture

### 4.1 Gemini Service Layer

```
┌────────────────────────────────────────┐
│           AI Service (ai.service.ts)    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Prompt Templates               │   │
│  │  ├── coach_prompt.ts            │   │
│  │  ├── summary_prompt.ts          │   │
│  │  ├── executive_prompt.ts        │   │
│  │  └── predictor_prompt.ts        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Functions                       │   │
│  │  ├── getCoachAdvice()           │   │
│  │  ├── processVoiceNote()         │   │
│  │  ├── extractBANT()             │   │
│  │  ├── summarizeTimeline()        │   │
│  │  ├── getExecutiveSummary()      │   │
│  │  ├── predictWinRate()           │   │
│  │  └── detectBurnout()            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Caching & Rate Limiting        │   │
│  │  ├── Response cache (5 min TTL) │   │
│  │  ├── Queue for batch requests   │   │
│  │  └── Fallback for API down      │   │
│  └─────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### 4.2 AI Request Flow

```
User Action → API Route → AI Service → Prompt Template
                                            │
                                    ┌───────▼───────┐
                                    │   Gemini API   │
                                    │  (gemini-pro)  │
                                    └───────┬───────┘
                                            │
                                    ┌───────▼───────┐
                                    │ Response Parser│
                                    │ (JSON/struct)  │
                                    └───────┬───────┘
                                            │
                              ┌─────────────▼──────────────┐
                              │  Cache + Store in DB        │
                              │  (ai_insights table)        │
                              └─────────────────────────────┘
```

---

## 5. Real-time Architecture

### 5.1 Supabase Realtime Channels

| Channel | Subscribers | Events |
|---------|------------|--------|
| `leads:{team_id}` | Manager | Lead updated, milestone changed |
| `sos:{manager_id}` | Manager | New SOS alert |
| `advice:{sale_id}` | Sale | New "Lệnh sếp" |
| `dashboard:heatmap` | Manager, CEO | Team status update |
| `dashboard:revenue` | CEO | Revenue data update |

### 5.2 Event Flow

```
Sale cập nhật Lead → Prisma save → DB trigger
                                        │
                            ┌───────────▼───────────┐
                            │  Supabase Realtime     │
                            │  Broadcast to channel  │
                            └───────────┬───────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
              Sale (snooze)    Manager (heatmap)    CEO (revenue)
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
User → Login (email/phone) → Supabase Auth → JWT Token
                                                  │
                                          ┌───────▼───────┐
                                          │  Middleware    │
                                          │  (verify JWT) │
                                          │  (check role) │
                                          │  (enforce RLS)│
                                          └───────────────┘
```

### 6.2 Row Level Security (RLS)

```sql
-- Sale chỉ thấy lead của mình
CREATE POLICY "sale_own_leads" ON leads
  FOR SELECT USING (assigned_to = auth.uid());

-- Leader thấy lead team mình (ẩn phone)
CREATE POLICY "leader_team_leads" ON leads
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM users WHERE id = auth.uid() AND role = 'leader')
  );

-- Manager thấy tất cả
CREATE POLICY "manager_all_leads" ON leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('manager', 'admin', 'ceo'))
  );
```

### 6.3 Data Masking

```typescript
// Leader không thấy SĐT khách team khác
function maskLeadForLeader(lead: Lead, viewerTeamId: string): Lead {
  if (lead.team_id !== viewerTeamId) {
    return { ...lead, phone: '****' };
  }
  return lead;
}
```

---

## 7. Deployment Architecture

```
┌─────────────────────────────────┐
│          Vercel Edge             │
│  ┌────────────────────────────┐ │
│  │   Next.js App              │ │
│  │   ├── SSR Pages            │ │
│  │   ├── API Routes           │ │
│  │   └── Edge Middleware      │ │
│  └────────────────────────────┘ │
└──────────────┬──────────────────┘
               │ HTTPS
        ┌──────▼──────┐
        │  Supabase   │
        │  (Cloud)    │
        │  ├── Auth   │
        │  ├── DB     │
        │  ├── RLS    │
        │  └── RT     │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ Google Cloud│
        │  Gemini API │
        └─────────────┘
```

### 7.1 Environment Strategy

| Env | Domain | Database | Purpose |
|-----|--------|----------|---------|
| **dev** | localhost:3000 | Supabase local (Docker) | Development |
| **staging** | staging.crmpro.vn | Supabase project (staging) | QA & testing |
| **production** | app.crmpro.vn | Supabase project (prod) | Live |

---

## 8. Performance Optimization Strategy

### 8.1 Mobile-First Optimizations
- **Code splitting**: Dynamic imports cho CEO dashboard (heavy charts)
- **Image optimization**: Next.js Image component, WebP format
- **PWA caching**: Service Worker cache API responses (stale-while-revalidate)
- **Prefetch**: Prefetch Top 3 card data khi app mở

### 8.2 Database Optimizations
- **Indexes**: Priority score, milestone, assigned_to, team_id, created_at
- **Materialized views**: Dashboard aggregates (heatmap, revenue)
- **Connection pooling**: PgBouncer via Supabase
- **Query optimization**: Lean queries cho mobile (select only needed fields)

### 8.3 AI Cost Optimization
- **Cache AI responses**: 5-minute TTL cho coach advice
- **Batch requests**: Aggregate multiple insights into single API call
- **Model selection**: Gemini Flash cho simple tasks, Gemini Pro cho complex analysis
- **Fallback**: Hardcoded tips khi AI unavailable

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo Architecture ban đầu | AI |
