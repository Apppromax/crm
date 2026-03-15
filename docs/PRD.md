# CRM Pro V2 — Product Requirements Document (PRD)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-14  
> **Trạng thái:** Draft  

---

## 1. Tổng Quan Dự Án (Project Overview)

### 1.1 Mô tả
CRM Pro V2 là hệ thống quản lý quan hệ khách hàng chuyên biệt cho **ngành Bất Động Sản**, thiết kế theo triết lý **"Hệ điều hành bán hàng"** — không chỉ lưu trữ data mà **điều phối hành vi** của đội Sales bằng AI và logic tự động hóa.

### 1.2 Vấn đề cần giải quyết
| Vấn đề | Hiện trạng | Giải pháp CRM Pro V2 |
|---------|-----------|----------------------|
| Lead bị "ngâm" | Sale nhận lead rồi quên xử lý | Quy tắc 72h Vàng + Anti-Hoarding tự động |
| Không biết khách ở đâu trong phễu | Quản lý bằng Excel, gọi hỏi từng người | Hệ thống 5 Mốc + Dashboard Nhiệt độ Team |
| Manager mất thời gian họp giao ban | Họp hàng ngày để nắm tình hình | Weekly Snapshot + SOS Alert tự động |
| CEO không có data real-time | Chờ báo cáo cuối tháng | Revenue Pulse + AI Executive Summary |
| Sale không biết nói gì với khách | Thiếu kỹ năng, thiếu kịch bản | AI Coach gợi ý theo từng mốc & từng khách |

### 1.3 Tầm nhìn sản phẩm
> *"Biến mỗi Sale thành chiến binh kỷ luật, mỗi Manager thành huấn luyện viên chiến thuật, và Giám đốc thành nhà chiến lược nhìn thấu dòng tiền."*

### 1.4 Ngành mục tiêu
- **Primary:** Bất Động Sản (Căn hộ, Biệt thự, Đất nền)
- **Secondary:** Có thể mở rộng sang Bảo hiểm, Ô tô (các ngành có sales pipeline dài)

---

## 2. Đối Tượng Người Dùng (User Personas)

### 2.1 Sale (Nhân viên kinh doanh)
- **Tuổi:** 22-35
- **Đặc điểm:** Dùng điện thoại là chính, ít thời gian ngồi máy tính
- **Pain point:** Quên follow-up, không biết ưu tiên khách nào, thiếu kịch bản xử lý từ chối
- **Mong muốn:** App đơn giản, nhanh, chỉ cần làm theo hướng dẫn là có kết quả
- **Thiết bị chính:** Smartphone (Mobile-first)

### 2.2 Manager / Team Leader
- **Tuổi:** 28-42
- **Đặc điểm:** Quản lý 5-15 Sale, cần nắm toàn cảnh nhưng cũng cần can thiệp cụ thể
- **Pain point:** Tốn thời gian họp, không biết ai cần hỗ trợ, không có data để đánh giá công bằng
- **Mong muốn:** Dashboard trực quan, cảnh báo tự động, can thiệp nhanh không cần hỏi
- **Thiết bị:** Tablet / Desktop + Mobile

### 2.3 Director / CEO (Giám đốc)
- **Tuổi:** 35-55
- **Đặc điểm:** Bận rộn, chỉ cần nhìn số và ra quyết định
- **Pain point:** Không có data real-time, phải chờ báo cáo tổng hợp
- **Mong muốn:** 3 con số + 3 dòng nhận xét = đủ ra quyết định
- **Thiết bị:** Desktop (Dashboard cao cấp)

---

## 3. Tính Năng Cốt Lõi (Core Features)

### 3.1 Màn hình Sale — "The Big Button"

#### 3.1.1 Smart Card System
> ⚠️ **[TBD — Chờ bổ sung Mục I bản Sale]**
> Dựa trên context: Mỗi khách hàng được đại diện bởi 1 "Card" chứa thông tin tóm tắt, mốc hiện tại, độ nóng, và lịch sử tương tác.

- **Top 3 Cards:** Hệ thống tự chọn 3 card ưu tiên nhất để Sale xử lý
- **Big Button:** Nút hành động chính — giảm thiểu thao tác, tập trung vào hành động

#### 3.1.2 Hệ thống 5 Mốc Thăng Hạng (Milestone Pipeline)
| Mốc | Tên | % | Tiêu chí vượt mốc |
|-----|-----|---|-------------------|
| 1 | Tiếp cận | 20% | Kết nối được, xác định nhu cầu & tài chính sơ bộ |
| 2 | Chào mồi & Đo độ nét | 40% | Đưa phương án, khách có phản hồi (Khen/Chê/Hỏi) |
| 3 | Niềm tin | 60% | Tín hiệu tin tưởng (Kết bạn Zalo, chia sẻ lý do mua thật, gửi info) |
| 4 | Dồn chốt | 80% | Gặp trực tiếp hoặc tính bảng dòng tiền chi tiết |
| 5 | Chốt cọc | 100% | Booking/Cọc thành công |

**Cơ chế rớt mốc:** Thất bại tại Mốc 4/5 → Tự động tụt về Mốc 3 để "nuôi lại"

#### 3.1.3 Logic Vận Hành (The Engine)
- **Quy tắc 72h Vàng:** Lead mới luôn Top 3 trong 3 ngày đầu, bắt buộc 2 tương tác/ngày
- **Snooze Logic:** Ẩn/hiện card theo chu kỳ thông minh (30p → 2h → 4h → Sáng hôm sau)
- **Priority Score:** Tự động tính điểm ưu tiên (Lead mới > Lịch hẹn > Retry > Khách cũ nóng)

#### 3.1.4 AI Coach (Trợ lý thực chiến)
- Gợi ý tip vượt mốc theo context khách hàng cụ thể
- Xử lý từ chối: Đưa kịch bản ứng phó
- Voice-to-Text: Thu âm → Gemini chuyển thành văn bản chuẩn hóa → Trích xuất nhãn ngầm

#### 3.1.5 Anti-Hoarding (Dọn rác)
- 5 lần "Chưa liên lạc được" liên tiếp → Ép chọn [Xóa rác] hoặc [Đẩy kho chung]
- Mốc 1-2 không tương tác 15 ngày → Tự động thu hồi về kho chung

### 3.2 Màn hình Manager — "Mắt Thần"

#### 3.2.1 Dashboard Sức Khỏe Phễu (Pipeline Health)
- **Team Heatmap:** Vòng tròn nhiệt độ 3 màu (Xanh/Vàng/Đỏ) theo real-time
- **Activity Streak Board:** Xếp hạng Sale theo chuỗi ngày hoàn thành Top 3 Cards (kiểu Duolingo)

#### 3.2.2 SOS & Jump-in
- **SOS tự động:** Cảnh báo khi khách nóng chưa chốt, khách kẹt mốc >7 ngày, khách rớt mốc
- **Shadow Mode:** Xem Timeline khách mà không cần hỏi Sale
- **Quick Advice:** Gửi "Lệnh sếp" (voice/script) trực tiếp lên Card của Sale

#### 3.2.3 AI Insights
- **Win-Rate Predictor:** Dự báo doanh số tuần/tháng
- **Burnout Alert:** Phát hiện Sale suy giảm hiệu suất để can thiệp tâm lý

#### 3.2.4 Weekly Snapshot
- Sáng thứ 2, gửi tự động qua Zalo/Telegram:
  - Tổng Lead mới
  - Tỉ lệ thăng hạng mốc
  - Sale tiêu biểu
  - Top 5 "Kèo thơm" cần hỗ trợ

### 3.3 Màn hình CEO — "Chỉ Huy Tối Cao"

#### 3.3.1 Revenue Pulse (Sức mạnh doanh thu)
- **Actual:** Doanh thu đã chốt cọc
- **Pipeline Value:** Tổng giá trị deal Mốc 4 & 5
- **Confidence Score:** AI đánh giá tỉ lệ đạt KPI tháng

#### 3.3.2 Team Efficiency (Năng lực đội ngũ)
- **Top 3 Chiến binh:** Effort Score + Conversion Speed
- **Lead Burn Rate:** Cảnh báo lead rơi vãi vì không xử lý kịp 72h

#### 3.3.3 AI Executive Summary
- 3 dòng nhận xét đắt giá từ Gemini mỗi ngày:
  - **Điểm sáng:** Chỉ số tốt, Sale xuất sắc
  - **Điểm nghẽn:** Bottleneck trong pipeline
  - **Cơ hội:** Deal lớn cần hành động ngay

#### 3.3.4 Flow Map (Sankey Diagram)
- Biểu đồ dòng chảy: Khách vào Mốc 1 → rơi ở đâu → bao nhiêu bị Anti-Hoarding quét

---

## 4. User Stories

### 4.1 Sale
| ID | Story | Priority |
|----|-------|----------|
| US-S01 | Là Sale, tôi muốn mở app và thấy ngay 3 khách cần gọi nhất để không phí thời gian chọn lựa | P0 |
| US-S02 | Là Sale, tôi muốn nhấn micro nói ghi chú rồi AI tự tóm tắt để tôi không cần gõ phím | P0 |
| US-S03 | Là Sale, tôi muốn AI gợi ý câu nói khi khách từ chối để tôi không bị đuối | P1 |
| US-S04 | Là Sale, tôi muốn được nhắc lịch hẹn đến giờ để không quên follow-up | P0 |
| US-S05 | Là Sale, tôi muốn card biến mất sau khi cập nhật xong để tập trung khách khác | P1 |
| US-S06 | Là Sale, tôi muốn được hỏi "Khách đã [tín hiệu]?" sau mỗi ghi chú để biết mình có vượt mốc không | P0 |

### 4.2 Manager
| ID | Story | Priority |
|----|-------|----------|
| US-M01 | Là Manager, tôi muốn nhìn Heatmap biết ngay team có vấn đề không | P0 |
| US-M02 | Là Manager, tôi muốn nhận SOS khi có deal quan trọng sắp mất | P0 |
| US-M03 | Là Manager, tôi muốn xem lịch sử khách mà không cần gọi Sale hỏi | P1 |
| US-M04 | Là Manager, tôi muốn gửi gợi ý Script cho Sale ngay trên Card | P1 |
| US-M05 | Là Manager, tôi muốn thấy ai có Streak cao để vinh danh | P2 |
| US-M06 | Là Manager, tôi muốn được cảnh báo khi Sale có dấu hiệu burnout | P2 |

### 4.3 Director/CEO
| ID | Story | Priority |
|----|-------|----------|
| US-D01 | Là CEO, tôi muốn mở app thấy ngay 3 con số: Actual, Pipeline, Confidence | P0 |
| US-D02 | Là CEO, tôi muốn AI viết 3 dòng tóm tắt tình hình để không cần đọc report | P0 |
| US-D03 | Là CEO, tôi muốn biết khâu nào trong quy trình bán hàng đang "gãy" | P1 |
| US-D04 | Là CEO, tôi muốn biết ai là top performer và ai đang hoạt động kém | P1 |

---

## 5. Chỉ Số Thành Công (Success Metrics)

| Chỉ số | Mục tiêu | Đo lường bằng |
|--------|---------|---------------|
| Lead Response Time | < 72h cho 100% lead mới | Quy tắc 72h Vàng |
| Pipeline Velocity | Giảm 30% thời gian từ Mốc 1 → Mốc 5 | Milestone History |
| Lead Waste | < 10% lead bị Anti-Hoarding quét | Tỉ lệ thu hồi |
| Manager Time Saved | Giảm 50% thời gian họp giao ban | Weekly Snapshot adoption |
| Sales Adoption | >90% Sale dùng app hàng ngày | Activity Streak |
| Forecast Accuracy | Confidence Score sai lệch < 15% | So sánh dự báo vs thực tế |

---

## 6. Phạm Vi MVP (MVP Scope)

### ✅ MVP Phase 1 (In Scope)
- Quản lý Lead (CRUD) + Smart Card
- Hệ thống 5 Mốc (Pipeline)
- Top 3 Priority Cards + Snooze Logic
- Quy tắc 72h Vàng
- Ghi chú text + Voice-to-Text cơ bản
- Dashboard Manager: Heatmap + SOS Alert
- Phân quyền 3 cấp (Sale/Manager/CEO)
- Dashboard CEO: Revenue Pulse cơ bản

### ⏳ Phase 2 (Post-MVP)
- AI Coach gợi ý kịch bản (Gemini integration)
- AI Executive Summary
- Win-Rate Predictor
- Burnout Alert
- Sankey Diagram (Flow Map)
- Activity Streak Board
- Anti-Hoarding nâng cao
- Tích hợp Zalo/Telegram (Weekly Snapshot)

### ❌ Out of Scope (Không làm trong V2)
- Tích hợp tổng đài điện thoại
- Marketing Automation (Email/SMS campaigns)
- Quản lý hợp đồng & thanh toán
- App native (iOS/Android riêng) — dùng PWA thay thế

---

## 7. Ràng Buộc & Rủi Ro

### 7.1 Ràng buộc kỹ thuật
- Mobile-first (PWA), tối ưu cho smartphone
- Gemini AI API có giới hạn rate limit & chi phí
- Voice-to-Text phụ thuộc Web Speech API / Gemini
- Real-time data cần WebSocket hoặc Supabase Realtime

### 7.2 Rủi ro
| Rủi ro | Xác suất | Ảnh hưởng | Giảm thiểu |
|--------|----------|-----------|------------|
| Sale không chịu dùng app | Cao | Cao | UX cực đơn giản, gamification (Streak) |
| Gemini API thay đổi pricing | Trung bình | Cao | Abstract AI layer, dễ switch provider |
| Data nhạy cảm khách hàng | Cao | Cao | RLS Supabase, phân quyền chặt |
| Voice-to-Text không chính xác | Trung bình | Trung bình | Cho phép edit trước khi lưu |

---

## 8. Thuật Ngữ (Glossary)

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| **Card** | Thẻ đại diện cho 1 khách hàng/lead trong hệ thống |
| **Mốc (Milestone)** | 1 trong 5 giai đoạn tiến trình bán hàng (20%-100%) |
| **Nét** | Mức độ rõ ràng về nhu cầu, tài chính, và sự sẵn sàng mua của khách |
| **72h Vàng** | Khoảng thời gian 3 ngày đầu tiên khi lead mới vào hệ thống |
| **Snooze** | Cơ chế ẩn/hiện card theo lịch trình thông minh |
| **Anti-Hoarding** | Cơ chế tự động dọn dẹp lead bị bỏ rơi |
| **SOS** | Cảnh báo tự động khi deal cần Manager can thiệp |
| **Jump-in** | Tính năng Manager can thiệp trực tiếp vào deal |
| **Shadow Mode** | Chế độ Manager xem thông tin khách mà Sale không biết |
| **Streak** | Chuỗi ngày Sale hoàn thành xử lý Top 3 Cards liên tiếp |
| **Kho chung** | Pool chung chứa lead chưa được phân bổ hoặc bị thu hồi |
| **Pipeline Value** | Tổng giá trị tiềm năng của các deal đang xử lý |
| **Confidence Score** | Chỉ số AI đánh giá khả năng đạt KPI |

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo PRD ban đầu từ 3 bản đặc tả | AI |
