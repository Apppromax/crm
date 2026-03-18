'use client'

import { useState, useTransition } from 'react'
import {
    ArrowLeft, Phone, MessageCircle, Flame, Zap,
    Lightbulb, Shield, ChevronDown, ChevronUp,
    Send, Clock, MapPin, DollarSign, User,
    AlertTriangle, CheckCircle2, Pause, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn, formatCurrencyShort, getMilestoneLabel, getMilestonePercentage, formatRelativeTime } from '@/lib/utils'
import type { MockLead } from '@/lib/mock-data'
import { MilestonePromotionModal } from './milestone-promotion-modal'
import { VoiceRecorder } from './voice-recorder'
import { SnoozePopup } from './snooze-popup'
import { AntiHoardingPopup } from './anti-hoarding-popup'
import { WinRateCard } from './win-rate-card'
import { checkAntiHoarding, getGoldenTimer, calculateSnoozeUntil, type SnoozeOption } from '@/lib/engine'
import { createInteraction } from '@/app/actions/interactions'
import { updateMilestone, snoozeLead } from '@/app/actions/leads'

interface Props {
    lead: MockLead & { assigneeId?: string }
    aiCoach: { tip: string; objection: string; signal: string }
    winRate?: { probability: number; confidence: string; label: string; factors: any[]; recommendation: string }
    userId: string
}

export function LeadDetailClient({ lead, aiCoach, winRate, userId }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showAiCoach, setShowAiCoach] = useState(true)
    const [noteText, setNoteText] = useState('')
    const [showPromotion, setShowPromotion] = useState(false)
    const [showSnooze, setShowSnooze] = useState(false)
    const [showAntiHoarding, setShowAntiHoarding] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [isDismissing, setIsDismissing] = useState(false)
    const [interactionType, setInteractionType] = useState<'NOTE' | 'CALL' | 'ZALO_CHAT' | 'MEETING'>('NOTE')

    const antiHoardingAlert = checkAntiHoarding(lead)
    const goldenTimer = getGoldenTimer(lead)

    function handleVoiceTranscript(text: string) {
        setNoteText(prev => prev ? prev + ' ' + text : text)
        setInteractionType('VOICE_NOTE' as any)
    }

    async function handleSnooze(option: SnoozeOption) {
        const until = calculateSnoozeUntil(option)
        setShowSnooze(false)
        // Navigate immediately — don't wait for server
        router.push('/sale')
        snoozeLead(lead.id, until, option.key === 'tomorrow' ? 'UPDATED' : `UNREACHABLE_1`)
            .catch(err => console.error('Snooze failed:', err))
    }

    const percentage = getMilestonePercentage(lead.currentMilestone)

    async function handleSaveNote() {
        if (!noteText.trim() || isSaving) return
        const savedNote = noteText.trim()
        const savedType = interactionType

        // INSTANT UI feedback
        setSaveSuccess(true)
        setNoteText('')
        setInteractionType('NOTE')

        setTimeout(() => {
            setSaveSuccess(false)
            setShowPromotion(true)
        }, 400)

        // Server call in background
        createInteraction({
            leadId: lead.id,
            userId,
            type: savedType as any,
            content: savedNote,
            aiLabels: [],
        }).catch(err => {
            console.error('Save note failed:', err)
            // Restore note on failure
            setNoteText(savedNote)
            setSaveSuccess(false)
        })
    }

    async function handlePromote() {
        // INSTANT close modal
        setShowPromotion(false)
        setIsDismissing(true)

        // Snooze lead 4h so it drops from queue
        const snoozeUntil = new Date(Date.now() + 4 * 60 * 60 * 1000)
        snoozeLead(lead.id, snoozeUntil, 'UPDATED').catch(console.error)

        // Server call — milestone update
        updateMilestone(
            lead.id,
            userId,
            Math.min(lead.currentMilestone + 1, 5),
            undefined
        ).catch(err => {
            console.error('Promote failed:', err)
        })

        // Animate out then navigate
        setTimeout(() => {
            router.push('/sale')
            router.refresh()
        }, 500)
    }

    function handleSkipPromotion() {
        setShowPromotion(false)
        setIsDismissing(true)

        // Snooze lead 4h so it drops from queue
        const snoozeUntil = new Date(Date.now() + 4 * 60 * 60 * 1000)
        snoozeLead(lead.id, snoozeUntil, 'UPDATED').catch(console.error)

        // Animate out then navigate
        setTimeout(() => {
            router.push('/sale')
            router.refresh()
        }, 500)
    }

    return (
        <div className={cn(
            'mx-auto max-w-lg min-h-dvh transition-all duration-500',
            isDismissing && 'opacity-0 scale-95 translate-y-4'
        )}>
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/40 backdrop-blur-xl px-4 py-3">
                <Link href="/sale" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/50 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-base font-semibold text-slate-800 truncate">{lead.name}</h1>
                    <p className="text-xs text-slate-400">{lead.source} • {formatRelativeTime(lead.createdAt)}</p>
                </div>
                <a href={`tel:${lead.phone}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors">
                    <Phone className="h-5 w-5" />
                </a>
            </header>

            {/* Milestone Progress */}
            <div className="mx-4 mt-3 mgr-glass-card px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Tiến trình bán hàng</span>
                    <span className="text-sm font-bold text-primary-600">{percentage}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/50 overflow-hidden mb-3">
                    <div
                        className="milestone-bar h-full rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map(m => (
                        <div key={m} className="flex flex-col items-center gap-1">
                            <div className={cn(
                                'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                                m <= lead.currentMilestone
                                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                    : m === lead.currentMilestone + 1
                                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-300'
                                        : 'bg-slate-100 text-slate-400'
                            )}>
                                {m <= lead.currentMilestone ? '✓' : m}
                            </div>
                            <span className={cn(
                                'text-[10px] max-w-[52px] text-center leading-tight',
                                m === lead.currentMilestone ? 'text-primary-600 font-semibold' : 'text-slate-400'
                            )}>
                                {getMilestoneLabel(m).split(' ')[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Win Rate Predictor */}
            {winRate && <WinRateCard prediction={winRate as any} />}

            {/* AI Coach Panel */}
            <div className="mx-4 mt-4">
                <button
                    onClick={() => setShowAiCoach(!showAiCoach)}
                    className="flex w-full items-center justify-between rounded-t-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/20"
                >
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        <span className="text-sm font-semibold">AI Coach — Mốc {lead.currentMilestone}</span>
                    </div>
                    {showAiCoach ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showAiCoach && (
                    <div className="rounded-b-2xl bg-white border border-t-0 border-indigo-100 p-4 space-y-3 animate-slide-up">
                        <div className="flex gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-amber-600 mb-1">Tip vượt mốc</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{aiCoach.tip}</p>
                            </div>
                        </div>
                        {aiCoach.objection && (
                            <div className="flex gap-2">
                                <Shield className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-blue-600 mb-1">Xử lý từ chối</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{aiCoach.objection}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2 pt-1 border-t border-slate-50">
                            <AlertTriangle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-indigo-600 mb-1">Câu hỏi kích mốc</p>
                                <p className="text-sm text-slate-600 italic">&ldquo;{aiCoach.signal}&rdquo;</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Manager Advice */}
            {lead.managerAdvice && (
                <div className="mx-4 mt-3 rounded-2xl bg-indigo-50 border border-indigo-100 p-4 animate-slide-up">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-indigo-700">📩 Lệnh sếp</span>
                        <span className="text-[10px] rounded-full bg-indigo-200 text-indigo-700 px-2 py-0.5">Manager</span>
                    </div>
                    <p className="text-sm text-indigo-900 leading-relaxed">{lead.managerAdvice}</p>
                </div>
            )}

            {/* Customer Info */}
            <div className="mx-4 mt-4 mgr-glass-card overflow-hidden">
                <div className="px-4 py-3 border-b border-white/30">
                    <h3 className="text-sm font-semibold text-slate-700">Thông tin khách</h3>
                </div>
                <div className="divide-y divide-white/30">
                    <InfoRow icon={<Phone className="h-4 w-4" />} label="SĐT" value={lead.phone} action={
                        <a href={`tel:${lead.phone}`} className="text-xs text-primary-600 font-medium px-2 py-1 rounded-lg bg-primary-50">Gọi</a>
                    } />
                    <InfoRow icon={<MessageCircle className="h-4 w-4" />} label="Zalo" value={lead.zaloConnected ? 'Đã kết nối ✅' : 'Chưa kết nối'} />
                    <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Budget" value={
                        <span className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-md',
                            lead.bantBudget === 'VERY_HIGH' && 'bg-emerald-100 text-emerald-700',
                            lead.bantBudget === 'HIGH' && 'bg-green-100 text-green-700',
                            lead.bantBudget === 'MEDIUM' && 'bg-yellow-100 text-yellow-700',
                            lead.bantBudget === 'UNKNOWN' && 'bg-slate-100 text-slate-500',
                        )}>
                            {lead.bantBudget === 'VERY_HIGH' ? 'Rất cao' : lead.bantBudget === 'HIGH' ? 'Cao' : lead.bantBudget === 'MEDIUM' ? 'Trung bình' : 'Chưa rõ'}
                            {lead.dealValue ? ` • ${formatCurrencyShort(lead.dealValue)}` : ''}
                        </span>
                    } />
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Nhu cầu" value={lead.bantNeed || 'Chưa xác định'} />
                    <InfoRow icon={<Clock className="h-4 w-4" />} label="Timeline" value={
                        lead.bantTimeline === 'HIGH' ? 'Gấp (< 1 tháng)' :
                            lead.bantTimeline === 'MEDIUM' ? '1-3 tháng' :
                                lead.bantTimeline === 'LOW' ? '> 6 tháng' : 'Chưa rõ'
                    } />
                    <InfoRow icon={<User className="h-4 w-4" />} label="Quyền QĐ" value={
                        lead.bantAuthority === 'HIGH' ? 'Có quyền ✅' :
                            lead.bantAuthority === 'MEDIUM' ? 'Cần bàn thêm' : 'Chưa rõ'
                    } />
                </div>
            </div>

            {/* Timeline */}
            <div className="mx-4 mt-4 mgr-glass-card overflow-hidden mb-4">
                <div className="px-4 py-3 border-b border-white/30 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Lịch sử tương tác</h3>
                    <span className="text-xs text-slate-400">{lead.interactions.length} entries</span>
                </div>
                <div className="divide-y divide-white/30">
                    {lead.interactions.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-slate-400 text-center">Chưa có tương tác nào</p>
                    ) : (
                        lead.interactions.map(interaction => (
                            <div key={interaction.id} className="px-4 py-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        'text-[10px] font-semibold px-1.5 py-0.5 rounded',
                                        interaction.type === 'CALL' && 'bg-green-100 text-green-700',
                                        interaction.type === 'ZALO_CHAT' && 'bg-blue-100 text-blue-700',
                                        interaction.type === 'MEETING' && 'bg-purple-100 text-purple-700',
                                        interaction.type === 'NOTE' && 'bg-slate-100 text-slate-600',
                                        interaction.type === 'VOICE_NOTE' && 'bg-amber-100 text-amber-700',
                                        interaction.type === 'SYSTEM' && 'bg-slate-100 text-slate-500',
                                    )}>
                                        {interaction.type === 'CALL' ? '📞 Call' :
                                            interaction.type === 'ZALO_CHAT' ? '💬 Zalo' :
                                                interaction.type === 'MEETING' ? '🤝 Gặp mặt' :
                                                    interaction.type === 'VOICE_NOTE' ? '🎤 Voice' :
                                                        interaction.type === 'SYSTEM' ? '⚙️ System' : '📝 Note'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{formatRelativeTime(interaction.createdAt)}</span>
                                    {interaction.isGolden72h && (
                                        <span className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5">
                                            <Zap className="h-3 w-3" /> 72h
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{interaction.content}</p>
                                {interaction.aiLabels.length > 0 && (
                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                        {interaction.aiLabels.map(label => (
                                            <span key={label} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-medium">
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Milestone History */}
            {lead.milestoneHistory.length > 0 && (
                <div className="mx-4 mb-4 mgr-glass-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/30">
                        <h3 className="text-sm font-semibold text-slate-700">Lịch sử mốc</h3>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                        {lead.milestoneHistory.map(mh => (
                            <div key={mh.id} className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                                <span className="text-slate-600">
                                    Mốc {mh.fromMilestone} → {mh.toMilestone}
                                </span>
                                {mh.note && <span className="text-slate-400 truncate">• {mh.note}</span>}
                                <span className="text-slate-300 ml-auto shrink-0">{formatRelativeTime(mh.changedAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Golden Timer + Snooze Button */}
            {(goldenTimer || true) && (
                <div className="mx-4 mb-4 flex gap-2">
                    {goldenTimer?.isActive && (
                        <div className={cn(
                            'flex-1 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold',
                            goldenTimer.urgency === 'CRITICAL' ? 'bg-red-50 text-red-600 animate-pulse-golden' :
                                goldenTimer.urgency === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                                    'bg-primary-50 text-primary-600'
                        )}>
                            <Zap className="h-4 w-4" />
                            72h Vàng: {goldenTimer.label}
                        </div>
                    )}
                    <button
                        onClick={() => setShowSnooze(true)}
                        disabled={isPending}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-200 transition-all flex items-center gap-1.5"
                    >
                        <Pause className="h-3.5 w-3.5" />
                        Snooze
                    </button>
                </div>
            )}

            {/* Interaction Type Selector + Note Input — Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-t border-white/40 safe-bottom">
                {/* Type selector */}
                <div className="mx-auto max-w-lg flex gap-1 px-4 pt-2">
                    {([
                        { key: 'NOTE', label: '📝', title: 'Note' },
                        { key: 'CALL', label: '📞', title: 'Call' },
                        { key: 'ZALO_CHAT', label: '💬', title: 'Zalo' },
                        { key: 'MEETING', label: '🤝', title: 'Gặp' },
                    ] as const).map(t => (
                        <button
                            key={t.key}
                            onClick={() => setInteractionType(t.key)}
                            className={cn(
                                'px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
                                interactionType === t.key
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-slate-400 hover:bg-slate-50'
                            )}
                        >
                            {t.label} {t.title}
                        </button>
                    ))}
                </div>
                <div className="mx-auto max-w-lg flex items-end gap-2 px-4 py-2">
                    <VoiceRecorder onTranscript={handleVoiceTranscript} />
                    <div className="relative flex-1">
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Ghi chú tương tác..."
                            rows={1}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20"
                        />
                    </div>
                    <button
                        onClick={handleSaveNote}
                        disabled={!noteText.trim() || isSaving}
                        className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
                            saveSuccess
                                ? 'bg-success text-white shadow-success/20'
                                : 'bg-primary-500 text-white shadow-primary-500/20 hover:bg-primary-600'
                        )}
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> :
                            saveSuccess ? <CheckCircle2 className="h-5 w-5" /> :
                                <Send className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Snooze Popup */}
            {showSnooze && (
                <SnoozePopup
                    onSelect={handleSnooze}
                    onClose={() => setShowSnooze(false)}
                />
            )}

            {/* Anti-Hoarding Popup */}
            {showAntiHoarding && antiHoardingAlert && (
                <AntiHoardingPopup
                    alert={antiHoardingAlert}
                    leadName={lead.name}
                    onAction={() => setShowAntiHoarding(false)}
                    onDismiss={() => setShowAntiHoarding(false)}
                />
            )}

            {/* Promotion Modal */}
            {showPromotion && (
                <MilestonePromotionModal
                    currentMilestone={lead.currentMilestone}
                    signal={aiCoach.signal}
                    leadId={lead.id}
                    userId={userId}
                    onPromote={handlePromote}
                    onSkip={handleSkipPromotion}
                    onClose={() => setShowPromotion(false)}
                />
            )}
        </div>
    )
}

function InfoRow({ icon, label, value, action }: {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
    action?: React.ReactNode
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-slate-400">{icon}</span>
            <span className="text-xs text-slate-400 w-16 shrink-0">{label}</span>
            <span className="text-sm text-slate-700 flex-1 truncate">{typeof value === 'string' ? value : value}</span>
            {action}
        </div>
    )
}
