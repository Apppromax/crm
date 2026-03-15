# CRM Pro V2 — Software Requirements Specification (SRS)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-14  
> **Trạng thái:** Draft  
> **Tham chiếu:** [PRD.md](./PRD.md)  

---

## 1. Giới Thiệu

### 1.1 Mục đích
Tài liệu này mô tả chi tiết các yêu cầu chức năng và phi chức năng của hệ thống CRM Pro V2, dùng làm cơ sở cho việc thiết kế, phát triển và kiểm thử.

### 1.2 Phạm vi hệ thống
CRM Pro V2 là ứng dụng web mobile-first (PWA) quản lý pipeline bán hàng Bất Động Sản với 3 tầng người dùng: Sale, Manager, và Director/CEO. Hệ thống tích hợp AI Gemini làm trợ lý tư vấn và phân tích.

### 1.3 Quy ước ID
- `FR-XXX`: Functional Requirement
- `NFR-XXX`: Non-Functional Requirement
- `BR-XXX`: Business Rule

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### 2.1 Module Quản Lý Lead (Lead Management)

#### FR-001: Tạo Lead mới
- **Mô tả:** Người dùng có thể tạo lead mới với thông tin cơ bản
- **Input:** Họ tên, SĐT, nguồn lead, ghi chú ban đầu
- **Output:** Card mới tại Mốc 1 (20%), kích hoạt quy tắc 72h Vàng
- **Actor:** Sale, Manager (phân bổ từ kho chung)
- **Priority:** P0

#### FR-002: Xem danh sách Lead cá nhân (My Leads)
- **Mô tả:** Sale chỉ thấy danh sách lead được phân cho mình
- **Hiển thị:** Smart Card với tóm tắt: Tên, Mốc hiện tại, Độ nóng, Lịch hẹn tiếp theo
- **Sắp xếp:** Theo Priority Score (xem BR-003)
- **Actor:** Sale
- **Priority:** P0

#### FR-003: Xem chi tiết Lead (Card Detail)
- **Mô tả:** Click vào Card để xem toàn bộ thông tin
- **Hiển thị:** Timeline tương tác, Mốc hiện tại (Progress Bar), Chỉ số Nét (BANT), Ghi chú lịch sử, AI Coach gợi ý
- **Actor:** Sale (full), Manager (Shadow Mode), Leader (ẩn SĐT)
- **Priority:** P0

#### FR-004: Kho chung (Lead Pool)
- **Mô tả:** Pool chứa lead chưa phân bổ hoặc bị thu hồi
- **Chức năng:** Xem, nhận lead, phân bổ lại
- **Actor:** Manager/Admin (toàn quyền), Leader (phân bổ trong team)
- **Priority:** P1

#### FR-005: Xóa / Archive Lead
- **Mô tả:** Đánh dấu lead là "Rác" hoặc ép chuyển kho chung khi Anti-Hoarding kích hoạt
- **Actor:** Sale (ép chọn khi trigger), Manager (chủ động)
- **Priority:** P1

### 2.2 Module Hệ Thống Milestone (Pipeline)

#### FR-010: Hiển thị Progress Bar
- **Mô tả:** Mỗi Card hiển thị thanh tiến trình 5 mốc (20% → 100%)
- **Visual:** Progress bar với 5 điểm mốc, highlight mốc hiện tại
- **Màu sắc:** Gradient từ xanh nhạt (Mốc 1) → xanh đậm (Mốc 5)
- **Priority:** P0

#### FR-011: Thăng hạng Mốc (Milestone Promotion)
- **Mô tả:** Sau khi lưu ghi chú, hệ thống hiện bảng xác nhận thăng hạng
- **Flow:**
  1. Sale lưu ghi chú tương tác
  2. Popup hiện "Câu hỏi kích mốc": *"Khách đã [tín hiệu mốc tiếp theo] chưa?"*
  3. Sale nhấn **Có** → Progress Bar nhảy lên mốc tiếp
  4. Sale nhấn **Chưa** → Giữ nguyên mốc, hẹn lịch quay lại
- **Lưu log:** Ghi lại milestone_history (from_milestone, to_milestone, timestamp, reason)
- **Priority:** P0

#### FR-012: Rớt Mốc tự động (Milestone Demotion)
- **Mô tả:** Khi thất bại tại Mốc 4 hoặc 5, Card tự động tụt về Mốc 3
- **Trigger:** Sale xác nhận thất bại tại Mốc 4/5 HOẶC quá hạn lịch hẹn tại Mốc 4/5
- **Action:** Cập nhật milestone = 3, ghi log, kích hoạt SOS cho Manager
- **Priority:** P0

#### FR-013: Lịch sử chuyển Mốc (Milestone History)
- **Mô tả:** Lưu trữ toàn bộ lịch sử thay đổi milestone để phục vụ báo cáo
- **Data:** lead_id, from_milestone, to_milestone, changed_at, changed_by, reason
- **Phục vụ:** Sankey Diagram (CEO), Win-Rate Predictor (Manager)
- **Priority:** P0

### 2.3 Module Logic Vận Hành (The Engine)

#### FR-020: Quy tắc 72h Vàng
- **Mô tả:** Lead mới được ưu tiên tuyệt đối trong 72h đầu
- **Logic:**
  - Card luôn trong Top 3 Priority khi created_at < 72h
  - Bắt buộc tối thiểu 2 tương tác/ngày
  - Nếu chưa đủ 2 tương tác → Highlight card với badge "72h⚡"
- **Hết 72h mà chưa liên lạc được:** Giữ ưu tiên cao nhưng bỏ badge
- **Priority:** P0

#### FR-021: Snooze Logic (Ẩn/Hiện Card)
- **Mô tả:** Card tự động ẩn/hiện theo trạng thái tương tác
- **Kịch bản "Chưa liên lạc được":**
  | Lần | Thời gian ẩn | Hành động |
  |-----|-------------|-----------|
  | 1 | 30 phút | Ẩn card, đếm ngược |
  | 2 | 2 tiếng | Ẩn card, đếm ngược |
  | 3 | 4 tiếng | Ẩn card, đếm ngược |
  | 4 | Sáng hôm sau (8:00 AM) | Ẩn đến 8h sáng |
  | 5+ | Anti-Hoarding trigger | Ép chọn xử lý (FR-040) |
- **Kịch bản "Cập nhật xong":**
  - Card biến mất ngay
  - Hiện lại khi: Đến lịch hẹn do Sale chọn HOẶC AI gợi ý "hâm nóng"
- **Priority:** P0

#### FR-022: Priority Score (Điểm ưu tiên)
- **Mô tả:** Hệ thống tự tính điểm để xếp hạng Top 3 Card
- **Công thức (ưu tiên giảm dần):**
  1. **Khách mới trong 72h** (score: 100)
  2. **Lịch hẹn đến giờ / quá giờ** (score: 90 + overtime_minutes)
  3. **Khách Retry** (vừa hết snooze) (score: 70)
  4. **Khách cũ độ nóng cao** (score: heat_score × 10)
  5. **Khách có "Lệnh sếp"** (score: +30 bonus)
- **Output:** Top 3 cards hiển thị prominent trên màn hình chính Sale
- **Priority:** P0

#### FR-023: Lịch hẹn Follow-up
- **Mô tả:** Sau mỗi tương tác, Sale chọn khung giờ card quay lại
- **Tùy chọn:** Sáng mai, Chiều nay, 2 ngày sau, Tuần sau, Tùy chọn (date picker)
- **Hành vi:** Card ẩn cho đến thời điểm đã chọn, sau đó hiện lại với ưu tiên cao
- **Priority:** P0

### 2.4 Module AI (Gemini Integration)

#### FR-030: AI Coach — Gợi ý vượt mốc
- **Mô tả:** Khi click vào Card, AI phân tích mốc hiện tại + lịch sử để gợi ý
- **Input:** current_milestone, interaction_history, customer_notes, BANT_data
- **Output:** 1-2 câu gợi ý ngắn gọn, thực chiến
- **Ví dụ:**
  - Mốc 2: *"Gợi ý khách căn tầng cao để đo tài chính"*
  - Mốc 3: *"Nếu khách chê xa, nhấn mạnh hạ tầng sắp khởi công"*
- **Priority:** P1

#### FR-031: Voice-to-Text + Chuẩn hóa
- **Mô tả:** Sale nhấn icon Micro để ghi âm → Gemini chuyển thành text
- **Processing pipeline:**
  1. Web Speech API / Gemini Speech → Raw text
  2. Gemini chuẩn hóa: Sửa ngữ pháp, tóm tắt ý chính
  3. Trích xuất nhãn ngầm: [Tài chính], [Nhu cầu], [Niềm tin], [Lịch hẹn]
  4. Hiển thị để Sale review & edit trước khi lưu
- **Priority:** P0 (cơ bản), P1 (chuẩn hóa AI)

#### FR-032: AI Phân tích Data tự động
- **Mô tả:** AI đọc nội dung ghi chú để tự điền chỉ số "Nét" (BANT)
- **Chỉ số trích xuất:**
  - **Budget:** Khả năng tài chính (Thấp/Trung bình/Cao/Rất cao)
  - **Authority:** Có quyền quyết định không (Có/Chưa rõ/Cần bàn thêm)
  - **Need:** Nhu cầu cụ thể (Ở thật/Đầu tư/Cho thuê)
  - **Timeline:** Khi nào muốn mua (Gấp/1-3 tháng/6 tháng/Chưa rõ)
- **Priority:** P1

#### FR-033: AI Executive Summary (CEO)
- **Mô tả:** AI tổng hợp 3 dòng nhận xét cho CEO Dashboard
- **Format cố định:**
  - **Điểm sáng:** [metric tăng], [sale xuất sắc]
  - **Điểm nghẽn:** [bottleneck], [cần hành động]
  - **Cơ hội:** [deal lớn], [gợi ý cụ thể]
- **Frequency:** Refresh mỗi 4 giờ hoặc khi CEO mở dashboard
- **Priority:** P2

#### FR-034: Win-Rate Predictor
- **Mô tả:** AI dự báo doanh số dựa trên tốc độ thăng hạng mốc
- **Input:** Milestone velocity (trung bình ngày từ Mốc n → Mốc n+1), deal_value, pipeline_data
- **Output:** "Dự kiến tuần này chốt X căn, đạt Y% kế hoạch"
- **Priority:** P2

#### FR-035: Burnout Alert
- **Mô tả:** Phát hiện Sale suy giảm hiệu suất
- **Signal:** Streak giảm, tần suất tương tác giảm >30%, tỉ lệ "Chưa liên lạc được" tăng
- **Action:** Thông báo cho Manager kèm gợi ý check-in
- **Priority:** P2

#### FR-036: Tóm tắt Timeline
- **Mô tả:** AI biến lịch sử tương tác dài thành 1 dòng trạng thái ngắn
- **Ví dụ:** *"3 lần call trong 5 ngày, đã kết bạn Zalo, chờ tính phương án tài chính"*
- **Priority:** P1

### 2.5 Module Anti-Hoarding

#### FR-040: Đếm liên lạc hụt
- **Mô tả:** Đếm số lần Sale nhấn "Chưa liên lạc được" liên tiếp
- **Trigger:** consecutive_miss_count >= 5
- **Action:** Hiện popup ép chọn: [Xóa rác] hoặc [Đẩy kho chung]
- **Reset:** Bất kỳ tương tác thành công nào reset counter về 0
- **Priority:** P0

#### FR-041: Thu hồi Lead đứng hình
- **Mô tả:** Lead ở Mốc 1-2 không có tương tác mới sau 15 ngày → thu hồi
- **Logic:** `IF milestone IN (1,2) AND last_interaction_at < NOW() - 15 days THEN auto_reclaim`
- **Action:** Card chuyển về kho chung, thông báo cho Sale & Manager
- **Priority:** P1

### 2.6 Module Dashboard Manager

#### FR-050: Team Heatmap
- **Mô tả:** Vòng tròn nhiệt độ team theo real-time
- **Logic:**
  - 🟢 **Xanh (On track):** >80% lead được tương tác đúng hạn
  - 🟡 **Vàng (Stagnant):** Nhiều lead bị ngâm >48h
  - 🔴 **Đỏ (At Risk):** Deal Mốc 4/5 quá hạn hoặc rớt mốc liên tục
- **Cập nhật:** Real-time (WebSocket/Supabase Realtime)
- **Priority:** P0

#### FR-051: Activity Streak Board
- **Mô tả:** Xếp hạng Sale theo số ngày liên tiếp hoàn thành Top 3 Cards
- **Cơ chế:** Mỗi ngày Sale xử lý đủ 3 card ưu tiên = +1 streak
- **Hiển thị:** Bảng xếp hạng với avatar, streak count, badge (🔥 7 ngày, ⚡ 30 ngày)
- **Priority:** P2

#### FR-052: SOS Alert tự động
- **Mô tả:** Hệ thống tự phát hiện và đẩy cảnh báo SOS
- **Trigger conditions:**
  | Loại SOS | Điều kiện | Mức độ |
  |----------|----------|--------|
  | Khách nóng chưa chốt | Mốc 4/5 + Nét cao + >3 ngày chưa chốt | 🔴 Critical |
  | Khách kẹt mốc | Mốc 1/2 + >7 ngày không thăng hạng | 🟡 Warning |
  | Khách rớt mốc | Vừa tụt từ Mốc 4/5 về Mốc 3 | 🔴 Critical |
- **Priority:** P0

#### FR-053: Shadow Mode
- **Mô tả:** Manager xem Timeline khách mà Sale không hay biết
- **Hiển thị:** Toàn bộ timeline (đã được AI tóm tắt), milestone history, BANT data
- **Không log:** Không tạo notification cho Sale
- **Priority:** P1

#### FR-054: Quick Advice ("Lệnh sếp")
- **Mô tả:** Manager gửi ghi chú / script cho Sale
- **Input:** Voice hoặc text từ Manager
- **Output:** Notification "Lệnh sếp" hiện trên Card của Sale, badge đặc biệt
- **Sale action:** Đọc, áp dụng, ✓ xác nhận đã thực hiện
- **Priority:** P1

### 2.7 Module Dashboard CEO

#### FR-060: Revenue Pulse
- **Mô tả:** 3 chỉ số doanh thu chính
- **Data:**
  - **Actual:** `SUM(deal_value) WHERE milestone = 5 AND status = 'won'`
  - **Pipeline Value:** `SUM(deal_value) WHERE milestone IN (4, 5) AND status = 'active'`
  - **Confidence Score:** AI tính dựa trên milestone velocity + historical conversion rate
- **Visual:** 3 con số lớn, phát sáng Neon trên nền Glassmorphism
- **Priority:** P0

#### FR-061: Team Efficiency Dashboard
- **Mô tả:** Ranking đội ngũ
- **Chỉ số:**
  - **Top 3 Chiến binh:** Effort Score (số tương tác × chất lượng) + Conversion Speed
  - **Lead Burn Rate:** `(new_leads_72h - processed_leads_72h) / new_leads_72h × 100`
- **Alert:** Nếu Burn Rate > 30% → Cảnh báo "Lãng phí lead marketing"
- **Priority:** P1

#### FR-062: Sankey Diagram (Flow Map)
- **Mô tả:** Biểu đồ dòng chảy milestone
- **Data:** Aggregate milestone_history theo thời kỳ (tuần/tháng)
- **Hiển thị:** Mốc 1 → 2 → 3 → 4 → 5 + Drop-off ở mỗi mốc + Anti-Hoarding out
- **Priority:** P2

### 2.8 Module Phân Quyền (Authorization)

#### FR-070: Role-Based Access Control
- **Roles & Permissions:**

| Chức năng | Sale | Leader | Manager/Admin | CEO/Director |
|-----------|------|--------|---------------|-------------|
| Xem Lead của mình | ✅ | ✅ | ✅ | ✅ |
| Xem Lead toàn team | ❌ | ✅ (ẩn SĐT) | ✅ | ✅ |
| Xem Lead team khác | ❌ | ❌ | ✅ | ✅ |
| Cập nhật lead | ✅ (của mình) | ❌ | ✅ (Shadow) | ❌ |
| Voice-to-text | ✅ | ❌ | ❌ | ❌ |
| Phân bổ lead | ❌ | ✅ (trong team) | ✅ (toàn bộ) | ❌ |
| Gửi Quick Advice | ❌ | ✅ | ✅ | ❌ |
| Dashboard Heatmap | ❌ | ✅ (team mình) | ✅ (toàn bộ) | ✅ |
| SOS Alert | ❌ | ❌ | ✅ | ✅ (view-only) |
| Revenue Pulse | ❌ | ❌ | ❌ | ✅ |
| AI Executive Summary | ❌ | ❌ | ❌ | ✅ |
| Quản lý kho chung | ❌ | ❌ | ✅ | ❌ |
| Cấu trúc phễu | ❌ | ❌ | ✅ | ✅ |
| Team management | ❌ | ❌ | ✅ | ✅ |

- **Priority:** P0

### 2.9 Module Thông Báo (Notifications)

#### FR-080: In-app Notification
- **Trigger:** Lịch hẹn đến giờ, Card quay lại sau snooze, SOS alert, Lệnh sếp
- **Hiển thị:** Badge trên icon + popup ngắn
- **Priority:** P0

#### FR-081: Weekly Snapshot (Zalo/Telegram)
- **Mô tả:** Mỗi sáng thứ 2, tự động gửi bản tóm tắt
- **Nội dung:** Tổng lead mới, Tỉ lệ thăng hạng, Sale tiêu biểu, Top 5 kèo thơm
- **Kênh:** Zalo OA API hoặc Telegram Bot API
- **Actor nhận:** Manager, CEO
- **Priority:** P2

---

## 3. Business Rules (Luật nghiệp vụ)

#### BR-001: Mỗi Lead chỉ thuộc 1 Sale tại 1 thời điểm
- Lead chỉ assigned cho 1 Sale. Muốn chuyển phải qua Manager re-assign.

#### BR-002: Milestone chỉ tăng 1 bậc mỗi lần
- Không được nhảy từ Mốc 1 lên Mốc 3. Phải đi tuần tự 1→2→3→4→5.

#### BR-003: Rớt mốc chỉ từ Mốc 4/5 về Mốc 3
- Không rớt từ Mốc 3 về Mốc 2 hay Mốc 1. Rớt mốc luôn về Mốc 3 ("nuôi lại niềm tin").

#### BR-004: Anti-Hoarding ưu tiên kho chung hơn xóa
- Khi trigger anti-hoarding, option "Đẩy kho chung" hiển thị trước "Xóa rác".

#### BR-005: Streak chỉ tính khi hoàn thành tất cả Top 3
- Nếu chỉ xử lý 2/3 card ưu tiên trong ngày → Streak bị reset về 0.

#### BR-006: 72h Vàng override mọi Priority khác
- Lead trong 72h Vàng luôn có priority cao nhất, bất kể lead khác có lịch hẹn đến giờ.

---

## 4. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 4.1 Hiệu năng (Performance)
| ID | Yêu cầu | Tiêu chuẩn |
|----|---------|-----------|
| NFR-001 | Thời gian tải trang đầu tiên (FCP) | < 1.5 giây (3G) |
| NFR-002 | Thời gian tải danh sách lead | < 500ms |
| NFR-003 | Cập nhật Heatmap real-time | Delay < 2 giây |
| NFR-004 | Voice-to-text processing | < 5 giây cho 30s audio |
| NFR-005 | AI Coach response | < 3 giây |
| NFR-006 | Concurrent users | > 200 users đồng thời |

### 4.2 Bảo mật (Security)
| ID | Yêu cầu |
|----|---------|
| NFR-010 | HTTPS bắt buộc cho mọi request |
| NFR-011 | JWT/Session-based authentication |
| NFR-012 | Row Level Security (RLS) trên Supabase |
| NFR-013 | Mã hóa SĐT khách hàng trong database |
| NFR-014 | API rate limiting (100 req/min/user) |
| NFR-015 | Audit log cho mọi thao tác quan trọng |

### 4.3 Khả dụng (Availability)
| ID | Yêu cầu |
|----|---------|
| NFR-020 | Uptime > 99.5% |
| NFR-021 | PWA offline support (xem data cached) |
| NFR-022 | Graceful degradation khi AI service down |

### 4.4 Tương thích (Compatibility)
| ID | Yêu cầu |
|----|---------|
| NFR-030 | Mobile browsers: Chrome, Safari (iOS 15+, Android 10+) |
| NFR-031 | Desktop: Chrome, Firefox, Edge (latest 2 versions) |
| NFR-032 | Responsive: 320px → 1920px |
| NFR-033 | PWA installable trên Android & iOS |

### 4.5 Khả năng mở rộng (Scalability)
| ID | Yêu cầu |
|----|---------|
| NFR-040 | Database hỗ trợ > 100,000 leads |
| NFR-041 | Horizontal scaling cho API layer |
| NFR-042 | AI request queuing với retry logic |

---

## 5. Tích Hợp Bên Ngoài (External Integrations)

| # | Service | Mục đích | Priority |
|---|---------|---------|----------|
| 1 | **Google Gemini API** | AI Coach, Voice chuẩn hóa, Executive Summary, Dự báo | P0 |
| 2 | **Web Speech API** | Voice-to-text cơ bản (browser native) | P0 |
| 3 | **Supabase Auth** | Authentication & Authorization | P0 |
| 4 | **Supabase Realtime** | Real-time dashboard updates | P1 |
| 5 | **Zalo OA API** | Weekly Snapshot notification | P2 |
| 6 | **Telegram Bot API** | Weekly Snapshot notification (alternative) | P2 |

---

## 6. Ràng Buộc Thiết Kế (Design Constraints)

### 6.1 Sale Screen
- **Triết lý:** Tối giản, hành động ngay, không cần suy nghĩ
- **Max 3 cards** hiển thị trên màn hình chính
- **1 nút lớn (Big Button)** cho hành động chính
- **Voice-first:** Ưu tiên nhập liệu bằng giọng nói

### 6.2 Manager Screen
- **Triết lý:** Toàn cảnh chiến thuật, can thiệp nhanh
- **Heatmap trung tâm:** Focal point của layout
- **SOS Badge:** Nổi bật, không bỏ qua được

### 6.3 CEO Dashboard
- **Triết lý:** 3 số + 3 dòng = đủ ra quyết định
- **Design:** Glassmorphism đặc quyền, Neon glow, tối giản quyền lực
- **Nền tối (Dark theme):** Bắt buộc cho CEO view

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo SRS ban đầu — 35+ Functional Requirements | AI |
