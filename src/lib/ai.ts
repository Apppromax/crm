// ============================================
// CRM Pro V2 — Gemini AI Service
// Provides AI Coach tips per milestone
// Falls back to curated tips if no API key
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface AICoachResponse {
    tip: string
    objection: string
    signal: string
}

// Curated fallback tips per milestone (always available)
const FALLBACK_TIPS: Record<number, AICoachResponse> = {
    1: {
        tip: 'Tập trung xây dựng rapport. Hỏi mở: "Anh/chị đang tìm kiếm BĐS cho mục đích gì?" để hiểu nhu cầu thật.',
        objection: 'Nếu khách nói "chưa cần": Đồng ý và hỏi "Vậy anh/chị đang quan tâm điều gì về thị trường hiện tại?" để giữ kết nối.',
        signal: '"Anh/chị đã từng xem dự án nào chưa?" — nếu có = đã tìm hiểu, nên đẩy nhanh.',
    },
    2: {
        tip: 'Đã có thiện cảm, giờ là lúc khám phá BANT. Hỏi Budget: "Anh/chị có khoảng ngân sách bao nhiêu?"',
        objection: 'Nếu khách né câu hỏi ngân sách: "Không sao, em chỉ muốn giới thiệu phù hợp nhất. Mức 2-3 tỷ hay 5 tỷ trở lên ạ?"',
        signal: '"Anh/chị có bao giờ quyết định mua BĐS mà không cần bàn ai không?" — xác định Authority.',
    },
    3: {
        tip: 'Đã có niềm tin! Tạo urgency: "Dự án này còn 5 căn cuối. Tuần trước đã có 3 người đặt cọc."',
        objection: 'Nếu khách muốn "suy nghĩ thêm": Hỏi cụ thể lo lắng gì — thường là tài chính. Đưa phương án vay linh hoạt.',
        signal: '"Khách đã hỏi về phương thức thanh toán chưa?" — nếu có = sẵn sàng chốt.',
    },
    4: {
        tip: 'Khách gần chốt rồi! Tạo urgency: "Căn này chỉ còn 2 suất cuối" hoặc "Chính sách ưu đãi hết ngày X".',
        objection: 'Nếu khách muốn "suy nghĩ thêm": Hỏi cụ thể lo lắng gì — thường là tài chính. Đưa phương án vay linh hoạt.',
        signal: '"Khách đã xác nhận booking hoặc đặt cọc chưa?"',
    },
    5: {
        tip: 'Chúc mừng! Chốt xong rồi. Giữ liên lạc 2 tuần/lần để nurture referral và upsell thêm căn khác.',
        objection: 'Khách muốn đổi ý sau cọc: Tìm hiểu lý do thật, đề xuất đổi căn thay vì hủy. Giữ cọc là ưu tiên số 1.',
        signal: '"Anh/chị có người quen nào cũng đang tìm BĐS không?" — khai thác referral.',
    },
}

export async function getAICoachTips(
    milestone: number,
    leadName: string,
    context?: { dealValue?: number; heatScore?: number; bantSummary?: string }
): Promise<AICoachResponse> {
    // If no API key or key is placeholder, use fallback
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key') {
        return FALLBACK_TIPS[milestone] || FALLBACK_TIPS[1]
    }

    try {
        const prompt = buildPrompt(milestone, leadName, context)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        )

        if (!response.ok) {
            console.error('Gemini API error:', response.status)
            return FALLBACK_TIPS[milestone] || FALLBACK_TIPS[1]
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) return FALLBACK_TIPS[milestone] || FALLBACK_TIPS[1]

        const parsed = JSON.parse(text)
        return {
            tip: parsed.tip || FALLBACK_TIPS[milestone]?.tip || '',
            objection: parsed.objection || FALLBACK_TIPS[milestone]?.objection || '',
            signal: parsed.signal || FALLBACK_TIPS[milestone]?.signal || '',
        }
    } catch (e) {
        console.error('Gemini AI error:', e)
        return FALLBACK_TIPS[milestone] || FALLBACK_TIPS[1]
    }
}

function buildPrompt(
    milestone: number,
    leadName: string,
    context?: { dealValue?: number; heatScore?: number; bantSummary?: string }
): string {
    const milestoneNames: Record<number, string> = {
        1: 'Tiếp cận (20%)',
        2: 'Chào mồi (40%)',
        3: 'Niềm tin (60%)',
        4: 'Dồn chốt (80%)',
        5: 'Chốt cọc (100%)',
    }

    return `Bạn là AI Sales Coach chuyên bất động sản Việt Nam.

Lead: "${leadName}"
Mốc hiện tại: ${milestone} - ${milestoneNames[milestone] || 'Unknown'}
${context?.dealValue ? `Giá trị deal: ${(context.dealValue / 1e9).toFixed(1)} tỷ VND` : ''}
${context?.heatScore ? `Heat Score: ${context.heatScore}/100` : ''}
${context?.bantSummary ? `BANT: ${context.bantSummary}` : ''}

Trả về JSON với 3 trường:
- "tip": Gợi ý chiến thuật để vượt mốc tiếp theo (1-2 câu)
- "objection": Cách xử lý từ chối phổ biến ở mốc này (1-2 câu)
- "signal": Câu hỏi để xác nhận lead sẵn sàng thăng mốc (1 câu)

Vietnamese only. Thực tế, ngắn gọn, áp dụng được ngay.`
}

// ============================================
// AI Executive Summary for CEO
// ============================================

export async function getExecutiveSummary(metrics: {
    revenue: number
    target: number
    activeLeads: number
    wonDeals: number
    conversionRate: number
}): Promise<string[]> {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key') {
        // Fallback summary
        const pct = Math.round((metrics.revenue / metrics.target) * 100)
        return [
            `Doanh thu đạt ${pct}% mục tiêu tháng. ${pct >= 80 ? 'Trên đà hoàn thành.' : 'Cần đẩy mạnh hơn.'}`,
            `${metrics.activeLeads} leads đang active, tỷ lệ chốt ${metrics.conversionRate}%. ${metrics.conversionRate >= 15 ? 'Hiệu suất tốt.' : 'Cần cải thiện follow-up.'}`,
            `${metrics.wonDeals} deals won tháng này. Tập trung vào leads M4-M5 để tăng conversion.`,
        ]
    }

    try {
        const prompt = `Bạn là AI Executive Advisor cho CEO bất động sản.

Metrics tháng này:
- Doanh thu: ${(metrics.revenue / 1e9).toFixed(1)} tỷ / ${(metrics.target / 1e9).toFixed(1)} tỷ (${Math.round((metrics.revenue / metrics.target) * 100)}%)
- Leads active: ${metrics.activeLeads}
- Deals won: ${metrics.wonDeals}
- Tỷ lệ chốt: ${metrics.conversionRate}%

Trả về JSON array 3 strings, mỗi string là 1 insight ngắn (1 câu). Vietnamese. Số liệu cụ thể.`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 300,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        )

        if (!response.ok) return getExecutiveSummary({ ...metrics }) // fallback
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        return text ? JSON.parse(text) : []
    } catch {
        return [
            `Doanh thu đạt ${Math.round((metrics.revenue / metrics.target) * 100)}% mục tiêu.`,
            `${metrics.activeLeads} leads, ${metrics.conversionRate}% conversion.`,
            `Focus: M4-M5 leads.`,
        ]
    }
}
