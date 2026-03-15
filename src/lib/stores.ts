// ============================================
// CRM Pro V2 — Zustand Stores
// ============================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================
// Theme Store (Dark Mode)
// ============================================

interface ThemeStore {
    isDark: boolean
    toggle: () => void
    setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            isDark: false,
            toggle: () => set((state) => ({ isDark: !state.isDark })),
            setDark: (dark) => set({ isDark: dark }),
        }),
        { name: 'crm-theme' }
    )
)

// ============================================
// App State Store (Snooze, Notifications)
// ============================================

interface SnoozeState {
    snoozedLeads: Record<string, number> // leadId -> snooze expiry timestamp
}

interface AppStore {
    snooze: SnoozeState
    snoozeLead: (leadId: string, until: Date) => void
    unsnoozeLead: (leadId: string) => void
    isLeadSnoozed: (leadId: string) => boolean
    notificationCount: number
    setNotificationCount: (count: number) => void
}

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            snooze: { snoozedLeads: {} },
            snoozeLead: (leadId, until) =>
                set((state) => ({
                    snooze: {
                        snoozedLeads: {
                            ...state.snooze.snoozedLeads,
                            [leadId]: until.getTime(),
                        },
                    },
                })),
            unsnoozeLead: (leadId) =>
                set((state) => {
                    const { [leadId]: _, ...rest } = state.snooze.snoozedLeads
                    return { snooze: { snoozedLeads: rest } }
                }),
            isLeadSnoozed: (leadId) => {
                const expiry = get().snooze.snoozedLeads[leadId]
                if (!expiry) return false
                return expiry > Date.now()
            },
            notificationCount: 3,
            setNotificationCount: (count) => set({ notificationCount: count }),
        }),
        { name: 'crm-app-state' }
    )
)
