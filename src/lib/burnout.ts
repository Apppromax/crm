// ============================================
// CRM Pro V2 — Burnout Detection
// Detects signs of sale burnout from activity patterns
// ============================================

interface ActivityPattern {
    interactionsLast7Days: number
    interactionsLast30Days: number
    avgDailyInteractions: number
    streakCount: number
    missedSchedules7Days: number
    activeLeadCount: number
}

interface BurnoutResult {
    level: 'HEALTHY' | 'WATCH' | 'WARNING' | 'CRITICAL'
    score: number // 0-100 (higher = more burned out)
    signals: BurnoutSignal[]
    recommendation: string
}

interface BurnoutSignal {
    name: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
    description: string
}

export function detectBurnout(pattern: ActivityPattern): BurnoutResult {
    const signals: BurnoutSignal[] = []
    let burnoutScore = 0

    // 1. Activity drop-off (comparing recent vs historical)
    if (pattern.interactionsLast30Days > 0) {
        const weeklyAvg = pattern.interactionsLast30Days / 4
        const recentRatio = pattern.interactionsLast7Days / Math.max(1, weeklyAvg)

        if (recentRatio < 0.3) {
            signals.push({
                name: 'Giảm tương tác mạnh',
                severity: 'HIGH',
                description: `Tuần này chỉ ${pattern.interactionsLast7Days} tương tác (trung bình ${Math.round(weeklyAvg)}/tuần)`,
            })
            burnoutScore += 30
        } else if (recentRatio < 0.6) {
            signals.push({
                name: 'Giảm tương tác',
                severity: 'MEDIUM',
                description: `Tuần này ${pattern.interactionsLast7Days} tương tác (trung bình ${Math.round(weeklyAvg)}/tuần)`,
            })
            burnoutScore += 15
        }
    }

    // 2. Low daily average
    if (pattern.avgDailyInteractions < 2) {
        signals.push({
            name: 'Tương tác ít',
            severity: pattern.avgDailyInteractions < 1 ? 'HIGH' : 'MEDIUM',
            description: `Trung bình ${pattern.avgDailyInteractions.toFixed(1)} tương tác/ngày`,
        })
        burnoutScore += pattern.avgDailyInteractions < 1 ? 20 : 10
    }

    // 3. Broken streak
    if (pattern.streakCount === 0 && pattern.interactionsLast30Days > 10) {
        signals.push({
            name: 'Mất streak',
            severity: 'MEDIUM',
            description: 'Đã mất chuỗi hoạt động liên tiếp',
        })
        burnoutScore += 10
    }

    // 4. Missed schedules
    if (pattern.missedSchedules7Days >= 3) {
        signals.push({
            name: 'Bỏ lỡ lịch hẹn',
            severity: pattern.missedSchedules7Days >= 5 ? 'HIGH' : 'MEDIUM',
            description: `${pattern.missedSchedules7Days} lịch hẹn bị bỏ lỡ trong 7 ngày`,
        })
        burnoutScore += pattern.missedSchedules7Days >= 5 ? 25 : 15
    }

    // 5. Overloaded (too many active leads without enough activity)
    if (pattern.activeLeadCount > 20 && pattern.avgDailyInteractions < 3) {
        signals.push({
            name: 'Quá tải lead',
            severity: 'MEDIUM',
            description: `${pattern.activeLeadCount} leads đang chăm sóc, chỉ ${pattern.avgDailyInteractions.toFixed(1)} tương tác/ngày`,
        })
        burnoutScore += 15
    }

    // Determine level
    const level: BurnoutResult['level'] =
        burnoutScore >= 60 ? 'CRITICAL' :
            burnoutScore >= 40 ? 'WARNING' :
                burnoutScore >= 20 ? 'WATCH' : 'HEALTHY'

    // Recommendation
    const recommendation =
        level === 'CRITICAL'
            ? '⚠️ Có dấu hiệu kiệt sức nghiêm trọng. Manager nên trao đổi 1:1 và xem xét giảm tải lead.'
            : level === 'WARNING'
                ? '🔶 Cần lưu ý. Tăng cường hỗ trợ và xem xét phân bổ lại lead.'
                : level === 'WATCH'
                    ? '👀 Đang theo dõi. Duy trì tương tác hàng ngày và giữ streak.'
                    : '✅ Sức khỏe tốt! Tiếp tục duy trì nhịp độ hiện tại.'

    return { level, score: Math.min(100, burnoutScore), signals, recommendation }
}
