# CRM Pro V2 — UI/UX Design Specification

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-14  
> **Trạng thái:** Draft  
> **Tham chiếu:** [PRD.md](./PRD.md) | [SRS.md](./SRS.md)  

---

## 1. Design Philosophy

### 1.1 Triết lý thiết kế theo Role

| Role | Triết lý | Keyword |
|------|---------|---------|
| **Sale** | *"Làm theo, không cần nghĩ"* | Đơn giản, nhanh, hành động |
| **Manager** | *"Nhìn toàn cảnh, đánh trúng điểm"* | Trực quan, cảnh báo, can thiệp |
| **CEO** | *"3 số, 3 dòng, ra quyết định"* | Quyền lực, tối giản, sang trọng |

### 1.2 Design Principles
1. **Mobile-first**: Sale dùng smartphone 90% thời gian → thiết kế cho thumb zone
2. **Action-first**: Mỗi màn hình có 1 hành động chính rõ ràng
3. **Progressive Disclosure**: Chỉ hiện info cần thiết, chi tiết ẩn sau tap/click
4. **Real-time Feedback**: Mọi thay đổi phản hồi ngay (animation, toast, vibrate)
5. **Zero Cognitive Load**: Sale không cần nhớ gì — hệ thống nhớ hộ

---

## 2. Design System

### 2.1 Color Palette

#### Light Theme (Sale & Manager)
```
Primary:        #0EA5E9  (Sky Blue — Tin cậy, chuyên nghiệp)
Primary Dark:   #0284C7
Primary Light:  #38BDF8

Success:        #22C55E  (Green — Đúng hạn, thăng hạng)
Warning:        #F59E0B  (Amber — Stagnant, cần chú ý)
Danger:         #EF4444  (Red — At Risk, SOS)
Info:           #6366F1  (Indigo — AI, gợi ý)

Background:     #F8FAFC
Surface:        #FFFFFF
Surface Alt:    #F1F5F9
Text Primary:   #0F172A
Text Secondary: #64748B
Border:         #E2E8F0
```

#### Dark Theme (CEO Dashboard — Glassmorphism)
```
Background:     #0B0F19  (Deep Navy)
Surface:        rgba(255, 255, 255, 0.05) + backdrop-blur(20px)
Surface Hover:  rgba(255, 255, 255, 0.10)
Border:         rgba(255, 255, 255, 0.10)

Neon Cyan:      #00F0FF  (Revenue Actual)
Neon Green:     #00FF88  (Pipeline Value)
Neon Gold:      #FFD700  (Confidence Score)
Neon Red:       #FF3366  (Alert/Danger)

Text Primary:   #F1F5F9
Text Secondary: #94A3B8
Text Glow:      text-shadow: 0 0 20px rgba(0, 240, 255, 0.5)
```

### 2.2 Typography

```
Font Family:    'Inter', -apple-system, sans-serif
Font Import:    Google Fonts (Inter 400, 500, 600, 700)

Headings:
  H1: 28px / 700 (CEO numbers)
  H2: 24px / 700 (Section title)
  H3: 20px / 600 (Card title)
  H4: 16px / 600 (Subsection)

Body:
  Large:  16px / 400 (Main content)
  Normal: 14px / 400 (Secondary)
  Small:  12px / 400 (Caption, meta)

Numbers:
  Big Metric:  48px / 700 (CEO Revenue numbers)
  Score:       32px / 700 (Priority score, heat score)
  Badge:       11px / 600 (Status badges)
```

### 2.3 Spacing & Grid

```
Base unit:     4px
Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Mobile grid:   4 columns, 16px gutter, 16px margin
Tablet grid:   8 columns, 24px gutter, 24px margin
Desktop grid:  12 columns, 24px gutter, 32px margin

Card padding:  16px (mobile), 24px (desktop)
Section gap:   24px (mobile), 32px (desktop)
```

### 2.4 Border Radius

```
Small:   8px  (badges, tags)
Medium:  12px (cards, inputs)
Large:   16px (modals, panels)
Full:    9999px (pills, avatars)
```

### 2.5 Shadows

```
Card:     0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
Elevated: 0 4px 12px rgba(0,0,0,0.08)
Modal:    0 16px 48px rgba(0,0,0,0.12)

Glassmorphism (CEO):
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
```

### 2.6 Micro-Animations

```css
/* Milestone Progress */
.milestone-bar { transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Card appear/disappear (Snooze) */
.card-enter { animation: slideUp 0.3s ease-out; }
.card-exit { animation: fadeOut 0.25s ease-in; }

/* Priority card pulse (72h Vàng) */
.golden-badge { animation: pulse 2s ease-in-out infinite; }

/* SOS alert shake */
.sos-icon { animation: shake 0.5s ease-in-out; }

/* Neon glow (CEO) */
.neon-text { animation: glow 2s ease-in-out infinite alternate; }
@keyframes glow {
  from { text-shadow: 0 0 10px currentColor; }
  to { text-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
}

/* Streak fire */
.streak-fire { animation: bounce 1s ease infinite; }
```

---

## 3. Screen Designs — SALE

### 3.1 Main Screen: "The Big Button" + Top 3 Cards

```
┌─────────────────────────────┐
│ ≡  CRM Pro        🔔(3) 👤  │  ← Minimal header
├─────────────────────────────┤
│                              │
│  ┌─── CARD 1 (Top Priority) │
│  │ ⚡ 72h Vàng              │  ← Badge vàng nhấp nháy
│  │ ┌──────────────────────┐ │
│  │ │ Trần Thị B           │ │
│  │ │ ██████████░░░ Mốc 3  │ │  ← Progress bar 60%
│  │ │ 🔥 75 | 💰 HIGH      │ │  ← Heat score + Budget
│  │ │ "2 lần gọi, Zalo..." │ │  ← AI Summary (1 dòng)
│  │ └──────────────────────┘ │
│  └──────────────────────────│
│                              │
│  ┌─── CARD 2 ───────────── │
│  │ 📅 Lịch hẹn 14:00       │  ← Schedule badge
│  │ │ Nguyễn Văn D          │ │
│  │ │ ████████░░░░ Mốc 2    │ │
│  │ └──────────────────────┘ │
│  └──────────────────────────│
│                              │
│  ┌─── CARD 3 ───────────── │
│  │ 🔄 Retry                 │  ← Vừa hết snooze
│  │ │ Lê Thị E              │ │
│  │ │ ████░░░░░░░ Mốc 1     │ │
│  │ └──────────────────────┘ │
│  └──────────────────────────│
│                              │
│ ┌──────────────────────────┐│
│ │     📞 GỌI NGAY          ││  ← BIG BUTTON (primary action)
│ │   (Trần Thị B - Card 1)  ││
│ └──────────────────────────┘│
│                              │
│  📋 Tất cả Lead (45)    →  │  ← Link to full list
│                              │
├──────────────────────────────┤
│  🏠    📋    ➕    📊    ⚙️  │  ← Bottom nav (mobile)
│ Home  Leads  New  Stats  More│
└─────────────────────────────┘
```

### 3.2 Card Detail Screen

```
┌─────────────────────────────┐
│  ← Back    Trần Thị B   ⋮  │
├─────────────────────────────┤
│                              │
│  ███████████████░░░░ 60%     │  ← Full-width milestone bar
│  Mốc 1 · Mốc 2 · [Mốc 3]  │
│         · Mốc 4 · Mốc 5     │
│                              │
│  ┌──── AI COACH ──────────┐ │
│  │ 💡 Khách đã kết bạn    │ │
│  │ Zalo → Mời xem nhà mẫu │ │
│  │ cuối tuần để đẩy Mốc 4 │ │
│  │                         │ │
│  │ 🛡️ Nếu khách nói "giá  │ │
│  │ cao": Nhấn mạnh trả góp │ │
│  │ 0% trong 18 tháng       │ │
│  └─────────────────────────┘ │
│                              │
│  ┌── THÔNG TIN ────────────┐│
│  │ 📞 0901234567    [Call] ││
│  │ 💬 Zalo ✅              ││
│  │ 💰 Budget: CAO          ││
│  │ 🏠 Nhu cầu: Ở thật 2PN ││
│  │ ⏰ Timeline: 1-3 tháng  ││
│  │ 📊 Nguồn: Facebook Ads  ││
│  └──────────────────────────┘│
│                              │
│  ┌── TIMELINE ────────────┐ │
│  │ 📋 Hôm nay 08:30       │ │
│  │ Gọi điện, khách hỏi    │ │
│  │ tầng 15 căn 2PN...     │ │
│  │ [Tài chính][Nhu cầu]   │ │
│  │                         │ │
│  │ 📋 Hôm qua 15:00       │ │
│  │ Chat Zalo, gửi brochure│ │
│  │ [Niềm tin]             │ │
│  └─────────────────────────┘ │
│                              │
│  ⚠️ "Lệnh sếp" từ Manager: │  ← Quick Advice highlight
│  "Chốt trong tuần, mời xem  │
│   nhà mẫu thứ 7"            │
│                              │
├──────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🎤  Ghi chú mới...      │ │  ← Input + Voice button
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3.3 Post-Note Popup (Milestone Check + Schedule)

```
┌─────────────────────────────┐
│                              │
│  ✅ Đã lưu ghi chú!         │
│                              │
│  ┌──────────────────────────┐│
│  │ 🎯 Kiểm tra thăng hạng  ││
│  │                          ││
│  │ "Khách đã GẶP MẶT       ││
│  │  TRỰC TIẾP hoặc tính    ││
│  │  bảng dòng tiền          ││
│  │  chi tiết chưa?"         ││
│  │                          ││
│  │  [  CÓ → Lên Mốc 4  ]  ││  ← Green button
│  │  [  CHƯA             ]  ││  ← Gray button
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ 📅 Hẹn liên lạc lại     ││
│  │                          ││
│  │ [Sáng mai] [Chiều nay]  ││
│  │ [2 ngày]  [Tuần sau]    ││
│  │ [📅 Chọn ngày...]       ││
│  └──────────────────────────┘│
│                              │
│  [    HOÀN TẤT    ]         │  ← Submit everything
│                              │
└─────────────────────────────┘
```

---

## 4. Screen Designs — MANAGER

### 4.1 Dashboard: Heatmap + SOS

```
┌──────────────────────────────────────────────────────┐
│  ≡  Manager Dashboard            🔔(5) 🔴SOS(2) 👤  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─── TEAM HEATMAP ────────────────────────────────┐ │
│  │                                                  │ │
│  │    🟡 OVERALL: 65% On Track                     │ │
│  │                                                  │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │ │
│  │  │ Team     │ │ Team     │ │ Team     │        │ │
│  │  │ Alpha    │ │ Beta     │ │ Gamma    │        │ │
│  │  │  🟢 85%  │ │  🟡 62%  │ │  🔴 45%  │        │ │
│  │  │ 15 leads │ │ 20 leads │ │ 10 leads │        │ │
│  │  └──────────┘ └──────────┘ └──────────┘        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─── SOS ALERTS (2 Active) ────────────────────────┐│
│  │                                                   ││
│  │ 🔴 CRITICAL: Trần Thị B (Mốc 4, Nét cao)        ││
│  │    Sale: Nguyễn Văn A | 3 ngày chưa chốt         ││
│  │    [👁️ Shadow] [💬 Gửi mẹo] [✅ Resolve]        ││
│  │                                                   ││
│  │ 🟡 WARNING: Lê Văn F (Mốc 1, kẹt 8 ngày)        ││
│  │    Sale: Trần Văn C | Chưa thăng hạng             ││
│  │    [👁️ Shadow] [🔄 Re-assign] [✅ Resolve]       ││
│  │                                                   ││
│  └───────────────────────────────────────────────────┘│
│                                                       │
│  ┌─── STREAK BOARD 🏆 ─────────────────────────────┐ │
│  │ 1. 🔥 Nguyễn Văn A — 15 ngày liên tiếp          │ │
│  │ 2. ⚡ Trần Văn C   — 8 ngày liên tiếp           │ │
│  │ 3. ✨ Lê Thị D     — 5 ngày liên tiếp           │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
├───────────────────────────────────────────────────────┤
│  🏠      📊      🚨      👥      ⚙️                  │
│ Home   Analytics  SOS   Team   Settings               │
└───────────────────────────────────────────────────────┘
```

### 4.2 Shadow Mode (Card Detail - Manager View)

```
┌─────────────────────────────────────┐
│  ← Back    Trần Thị B    🔒Shadow  │  ← Shadow badge
├─────────────────────────────────────┤
│                                      │
│  Sale phụ trách: Nguyễn Văn A       │
│  ███████████████████░░ 80% Mốc 4    │
│                                      │
│  ┌── AI TIMELINE SUMMARY ─────────┐ │
│  │ "3 lần call, 2 lần Zalo trong  │ │
│  │  7 ngày. Đã gặp mặt ngày 10/3 │ │
│  │  Khách quan tâm căn A-1502,    │ │
│  │  chờ tính phương án vay NH"    │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌── FULL TIMELINE ────────────── │ │
│  │ (đầy đủ interactions...)       │ │
│  └─────────────────────────────────┘ │
│                                      │
│  ┌─── QUICK ADVICE ──────────────┐  │
│  │ 🎤 Ghi voice cho Sale...      │  │
│  │ ✍️  Hoặc gõ text...            │  │
│  │                                │  │
│  │ [  GỬI "LỆNH SẾP"  ]         │  │
│  └────────────────────────────────┘  │
│                                      │
└─────────────────────────────────────┘
```

---

## 5. Screen Designs — CEO

### 5.1 CEO Dashboard: "Chỉ Huy Tối Cao"

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─── GLASSMORPHISM DARK THEME ────────────────────────────┐ │
│  │  ✧ CRM Pro V2 — Command Center                  ⚙️ 👤  │ │
│  │─────────────────────────────────────────────────────────│ │
│  │                                                         │ │
│  │  ┌─── REVENUE PULSE ── (Phát sáng Neon) ─────────────┐│ │
│  │  │                                                     ││ │
│  │  │  ✦ 25 TỶ        ✦ 35 TỶ        ✦ 75%              ││ │
│  │  │  ───────        ───────        ──────              ││ │
│  │  │  Actual         Pipeline       Confidence          ││ │
│  │  │  (Cyan glow)   (Green glow)   (Gold glow)         ││ │
│  │  │                                                     ││ │
│  │  │  Target: 100 TỶ  ████████░░░░░░░░ 25%              ││ │
│  │  │                                                     ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │                                                         │ │
│  │  ┌─── AI EXECUTIVE SUMMARY ───────────────────────────┐│ │
│  │  │                                                     ││ │
│  │  │  💬 "Chào sếp, đây là tình hình hôm nay:"         ││ │
│  │  │                                                     ││ │
│  │  │  🟢 Điểm sáng: Tỉ lệ Mốc 2→3 tăng 20%           ││ │
│  │  │     nhờ kịch bản mới. Sale A phong độ xuất sắc.    ││ │
│  │  │                                                     ││ │
│  │  │  🟡 Điểm nghẽn: 30% Lead mới kẹt Mốc 1 >24h.     ││ │
│  │  │     Cần điều phối nhân sự xử lý nhanh.             ││ │
│  │  │                                                     ││ │
│  │  │  🔴 Cơ hội: 5 deal lớn Mốc 4, "Nét" cực độ.      ││ │
│  │  │     Nên nhắc Manager Jump-in ngay chiều nay.       ││ │
│  │  │                                                     ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │                                                         │ │
│  │  ┌── TEAM EFFICIENCY ─┐  ┌── FLOW MAP (Sankey) ──────┐│ │
│  │  │                     │  │                            ││ │
│  │  │ Top 3 Warriors:     │  │  Mốc 1 ═══╗              ││ │
│  │  │ 1. 🥇 Nguyễn A     │  │       60    ╠══ Mốc 2     ││ │
│  │  │    Effort: 92       │  │             ║    45        ││ │
│  │  │    Speed: 8.5 days  │  │  Pool ◀═╦══╝    ║        ││ │
│  │  │                     │  │    ↑  12║   Mốc 3 ═╗      ││ │
│  │  │ 2. 🥈 Trần C       │  │    ↑   8║    30    ║      ││ │
│  │  │ 3. 🥉 Lê D         │  │         ║         Mốc 4   ││ │
│  │  │                     │  │         ║  ↙ 5    18      ││ │
│  │  │ ⚠️ Burn Rate: 15%   │  │         ╚══════ Mốc 5    ││ │
│  │  │ (Lead chưa xử lý)  │  │                  8 (Won)  ││ │
│  │  └─────────────────────┘  └────────────────────────────┘│ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Component Library

### 6.1 Shared Components

| Component | Props | Usage |
|-----------|-------|-------|
| `MilestoneBar` | milestone (1-5), animated | Everywhere lead is shown |
| `HeatBadge` | score (0-100), size | Lead cards |
| `StatusBadge` | status (active/pool/won/...) | Lead list |
| `VoiceRecorder` | onTranscript, onStop | Note input |
| `SchedulePicker` | onSelect, presets[] | Post-note popup |
| `Toast` | message, type, duration | Global feedback |
| `Avatar` | src, name, size, badge | User displays |
| `Badge` | text, variant, pulse | Golden72h, SOS, Streak |
| `BottomNav` | items[], activeIndex | Mobile navigation |
| `GlassCard` | children, glow | CEO dashboard |
| `NeonNumber` | value, label, color | Revenue Pulse |
| `SankeyChart` | flows[], config | CEO Flow Map |

### 6.2 Role-Specific Components

**Sale:**
- `SmartCard` — Compact lead card with priority info
- `BigButton` — Primary action CTA
- `AICoachPanel` — Collapsible AI advice
- `MilestonePromotion` — Post-note confirmation popup
- `ManagerAdviceBanner` — "Lệnh sếp" notification

**Manager:**
- `TeamHeatmap` — 3-color team status overview
- `SOSCard` — Expandable alert card with actions
- `StreakBoard` — Gamification leaderboard
- `ShadowTimeline` — Read-only lead timeline
- `QuickAdviceInput` — Voice/text input for advice

**CEO:**
- `RevenuePulse` — 3 neon metrics
- `AISummary` — Glassmorphism text block
- `TeamRanking` — Top warriors + burn rate
- `SankeyFlow` — D3.js Sankey diagram

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout | Target |
|-----------|-------|--------|--------|
| **xs** | < 375px | Stack, compact | Small phones |
| **sm** | 375-639px | Stack, comfortable | Standard phones |
| **md** | 640-767px | Stack, spacious | Large phones |
| **lg** | 768-1023px | 2-column | Tablets |
| **xl** | 1024-1279px | 3-column | Small desktops |
| **2xl** | ≥1280px | Full dashboard | Desktops |

### Mobile Thumb Zone Optimization

```
┌─────────────────────┐
│    HARD TO REACH     │  ← Header only (brand, notifications)
│                      │
│    OKAY ZONE         │  ← Information display (cards, stats)
│                      │
│    NATURAL ZONE      │  ← Primary actions (Big Button, input)
│                      │
│    BOTTOM NAV        │  ← Navigation tabs
└─────────────────────┘
```

---

## 8. Accessibility (A11y)

| Aspect | Standard | Implementation |
|--------|---------|---------------|
| Color contrast | WCAG 2.1 AA (4.5:1) | All text on backgrounds |
| Touch target | Min 44×44px | All buttons and interactive elements |
| Focus indicator | Visible ring | Tab navigation support |
| Screen reader | aria-labels | All icons, badges, status |
| Motion | prefers-reduced-motion | Disable animations when set |
| Font scaling | Support up to 200% | rem-based typography |

---

## 9. PWA Configuration

```json
{
  "name": "CRM Pro V2",
  "short_name": "CRM Pro",
  "description": "Hệ điều hành bán hàng BĐS",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0EA5E9",
  "background_color": "#F8FAFC",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192" },
    { "src": "/icons/512.png", "sizes": "512x512" }
  ]
}
```

**Offline Strategy:**
- Cache: App shell, static assets, fonts
- Stale-while-revalidate: Lead data, dashboard data
- Network-first: AI responses, real-time updates

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo UI/UX Spec — Design System + Wireframes 3 roles | AI |
