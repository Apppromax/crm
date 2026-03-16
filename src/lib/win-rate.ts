// ============================================
// CRM Pro V2 — Win-Rate Predictor
// ML-lite: Score-based prediction model
// ============================================

interface LeadFactors {
    milestone: number
    heatScore: number
    bantBudget: string
    bantAuthority: string
    bantNeed: string
    bantTimeline: string
    daysSinceCreated: number
    interactionCount: number
    consecutiveMissCount: number
    dealValue: number | null
}

interface WinPrediction {
    probability: number      // 0-100
    confidence: 'LOW' | 'MEDIUM' | 'HIGH'
    label: string            // "Rất cao", "Cao", etc.
    factors: PredictionFactor[]
    recommendation: string
}

interface PredictionFactor {
    name: string
    impact: number    // -30 to +30
    description: string
}

const BANT_WEIGHTS: Record<string, number> = {
    UNKNOWN: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4,
}

export function predictWinRate(lead: LeadFactors): WinPrediction {
    const factors: PredictionFactor[] = []
    let baseScore = 0

    // 1. Milestone is the strongest predictor (0-40 points)
    const milestoneScore = lead.milestone * 8
    factors.push({
        name: 'Mốc thăng hạng',
        impact: milestoneScore,
        description: `Mốc ${lead.milestone}/5 — ${['', 'Tiếp cận', 'Chào mồi', 'Niềm tin', 'Dồn chốt', 'Chốt cọc'][lead.milestone]}`,
    })
    baseScore += milestoneScore

    // 2. BANT Score (0-20 points)
    const bantTotal = (
        (BANT_WEIGHTS[lead.bantBudget] || 0) +
        (BANT_WEIGHTS[lead.bantAuthority] || 0) +
        (BANT_WEIGHTS[lead.bantNeed] || 0) +
        (BANT_WEIGHTS[lead.bantTimeline] || 0)
    )
    const bantScore = Math.round((bantTotal / 16) * 20)
    factors.push({
        name: 'BANT Score',
        impact: bantScore,
        description: `B:${lead.bantBudget} A:${lead.bantAuthority} N:${lead.bantNeed} T:${lead.bantTimeline}`,
    })
    baseScore += bantScore

    // 3. Heat Score impact (0-15 points)
    const heatImpact = Math.round((lead.heatScore / 100) * 15)
    factors.push({
        name: 'Độ nóng',
        impact: heatImpact,
        description: `Heat score: ${lead.heatScore}/100`,
    })
    baseScore += heatImpact

    // 4. Interaction frequency (0-10 points, penalize if too few)
    const interactionScore = Math.min(10, lead.interactionCount * 2)
    factors.push({
        name: 'Tần suất tương tác',
        impact: interactionScore,
        description: `${lead.interactionCount} lần tương tác`,
    })
    baseScore += interactionScore

    // 5. Consecutive miss penalty (-15 to 0)
    if (lead.consecutiveMissCount > 0) {
        const missPenalty = -Math.min(15, lead.consecutiveMissCount * 5)
        factors.push({
            name: 'Gọi nhỡ liên tiếp',
            impact: missPenalty,
            description: `${lead.consecutiveMissCount} lần nhỡ liên tiếp`,
        })
        baseScore += missPenalty
    }

    // 6. Aging penalty (negative if too old without progress)
    if (lead.daysSinceCreated > 30 && lead.milestone < 3) {
        const agePenalty = -Math.min(10, Math.floor((lead.daysSinceCreated - 30) / 7) * 3)
        factors.push({
            name: 'Thời gian chăm sóc',
            impact: agePenalty,
            description: `${lead.daysSinceCreated} ngày, vẫn ở Mốc ${lead.milestone}`,
        })
        baseScore += agePenalty
    }

    // 7. Deal value bonus (high value = more serious buyer)
    if (lead.dealValue && lead.dealValue > 0) {
        const valueBonus = lead.dealValue >= 5e9 ? 5 : lead.dealValue >= 2e9 ? 3 : 1
        factors.push({
            name: 'Giá trị deal',
            impact: valueBonus,
            description: `${(lead.dealValue / 1e9).toFixed(1)} tỷ VND`,
        })
        baseScore += valueBonus
    }

    // Clamp to 0-100
    const probability = Math.max(0, Math.min(100, baseScore))

    // Confidence based on data completeness
    const dataPoints = [
        lead.bantBudget !== 'UNKNOWN',
        lead.bantAuthority !== 'UNKNOWN',
        lead.bantNeed !== 'UNKNOWN',
        lead.bantTimeline !== 'UNKNOWN',
        lead.interactionCount > 0,
        lead.heatScore > 0,
    ].filter(Boolean).length

    const confidence: 'LOW' | 'MEDIUM' | 'HIGH' =
        dataPoints >= 5 ? 'HIGH' : dataPoints >= 3 ? 'MEDIUM' : 'LOW'

    // Human-readable label
    const label =
        probability >= 80 ? 'Rất cao' :
            probability >= 60 ? 'Cao' :
                probability >= 40 ? 'Trung bình' :
                    probability >= 20 ? 'Thấp' : 'Rất thấp'

    // Recommendation
    const recommendation = getRecommendation(probability, lead)

    return { probability, confidence, label, factors, recommendation }
}

function getRecommendation(probability: number, lead: LeadFactors): string {
    if (probability >= 80) {
        return 'Lead sẵn sàng chốt! Tạo urgency và đề xuất booking ngay.'
    }
    if (probability >= 60) {
        return 'Khả quan! Focus vào xử lý objection và confirm timeline.'
    }
    if (probability >= 40) {
        if (lead.bantBudget === 'UNKNOWN' || lead.bantAuthority === 'UNKNOWN') {
            return 'Cần khám phá BANT sâu hơn. Budget và Authority chưa rõ.'
        }
        return 'Tiếp tục nurture. Tăng tương tác và build niềm tin.'
    }
    if (probability >= 20) {
        return 'Lead cần nhiều nurture. Focus vào rapport và tìm nhu cầu thật.'
    }
    return 'Lead chưa sẵn sàng. Đặt vào nurture long-term hoặc xem xét release.'
}
