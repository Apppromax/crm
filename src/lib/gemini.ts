import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

/**
 * Summarizes the interactions with a lead and provides insights.
 */
export async function summarizeLeadInteractions(
    leadName: string,
    interactions: { date: string; type: string; content: string }[]
) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not set. Using mock summary.')
        return `Đây là khách hàng ${leadName}. Đang theo dõi. Cần chăm sóc thêm.`
    }

    if (!interactions || interactions.length === 0) {
        return `Khách hàng ${leadName} chưa có tương tác nào. Hãy bắt đầu liên hệ.`
    }

    const interactionText = interactions
        .map(i => `- [${i.date}] ${i.type}: ${i.content}`)
        .join('\n')

    const prompt = `
        Bạn là một trợ lý ảo chuyên tư vấn bán hàng Bất động sản cao cấp.
        Hãy tóm tắt ngắn gọn tình trạng của khách hàng "${leadName}" dựa trên lịch sử tương tác dưới đây.
        
        Lịch sử tương tác:
        ${interactionText}
        
        Yêu cầu tóm tắt:
        1. Ngắn gọn, súc tích (tối đa 3 câu).
        2. Nếu khách có ý định mua, đánh giá mức độ quan tâm (Nóng/Ấm/Lạnh).
        3. Gợi ý hành động tiếp theo cho Sale.
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        })

        return response.text
    } catch (error) {
        console.error('Error generating AI summary:', error)
        return 'Không thể tạo tóm tắt vào lúc này do lỗi hệ thống.'
    }
}

/**
 * Parses an unstructured note or voice transcript to extract structured data.
 */
export async function parseInteractionNote(note: string) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            cleanSummary: note,
            sentiment: 'NEUTRAL',
            actionItems: [],
        }
    }

    const prompt = `
        Bạn là trợ lý CRM BĐS. Hãy phân tích đoạn ghi chú/giọng nói sau của nhân viên sale về khách hàng.
        Nhiệm vụ của bạn là trích xuất thông tin dưới dạng JSON.
        
        Ghi chú: "${note}"
        
        Yêu cầu trả về KHÔNG CÓ MARKDOWN, CHỈ CÓ JSON:
        {
            "cleanSummary": "tóm tắt ngắn gọn mạch lạc lại ghi chú",
            "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
            "actionItems": ["hành động 1", "hành động 2"] (danh sách các hành động sale cần làm tiếp theo, nếu có)
        }
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
                responseMimeType: 'application/json',
            }
        })

        const text = response.text || '{}'
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
        return JSON.parse(cleanedText)
    } catch (error) {
        console.error('Error parsing interaction note:', error)
        return {
            cleanSummary: note,
            sentiment: 'NEUTRAL',
            actionItems: [],
        }
    }
}
