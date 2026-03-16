'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type RealtimeCallback = (payload: { new: Record<string, unknown>; old: Record<string, unknown>; eventType: string }) => void

/**
 * Hook to subscribe to Supabase Realtime changes on a specific table.
 * Automatically subscribes on mount and unsubscribes on unmount.
 * 
 * @example
 * useRealtimeSubscription('notifications', { userId: user.id }, (payload) => {
 *   if (payload.eventType === 'INSERT') refetchNotifications()
 * })
 */
export function useRealtimeSubscription(
    table: string,
    filter?: { column: string; value: string },
    onEvent?: RealtimeCallback
) {
    const stableOnEvent = useCallback(onEvent || (() => { }), [])

    useEffect(() => {
        const supabase = createClient()

        let channel = supabase.channel(`${table}-changes`)

        if (filter) {
            channel = channel.on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table,
                    filter: `${filter.column}=eq.${filter.value}`,
                },
                (payload: any) => {
                    stableOnEvent({
                        new: payload.new || {},
                        old: payload.old || {},
                        eventType: payload.eventType || 'UNKNOWN',
                    })
                }
            )
        } else {
            channel = channel.on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema: 'public',
                    table,
                },
                (payload: any) => {
                    stableOnEvent({
                        new: payload.new || {},
                        old: payload.old || {},
                        eventType: payload.eventType || 'UNKNOWN',
                    })
                }
            )
        }

        channel.subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, filter?.column, filter?.value, stableOnEvent])
}

/**
 * Hook to subscribe to notification updates for a specific user.
 * Triggers refetch when a new notification is created.
 */
export function useNotificationRealtime(userId: string, onNewNotification: () => void) {
    useRealtimeSubscription(
        'notifications',
        { column: 'user_id', value: userId },
        (payload) => {
            if (payload.eventType === 'INSERT') {
                onNewNotification()
            }
        }
    )
}

/**
 * Hook to subscribe to lead changes for real-time dashboard updates.
 */
export function useLeadRealtime(onUpdate: () => void) {
    useRealtimeSubscription(
        'leads',
        undefined,
        (payload) => {
            if (['INSERT', 'UPDATE', 'DELETE'].includes(payload.eventType)) {
                onUpdate()
            }
        }
    )
}

/**
 * Hook to subscribe to SOS alert changes.
 */
export function useSOSRealtime(onUpdate: () => void) {
    useRealtimeSubscription(
        'sos_alerts',
        undefined,
        (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                onUpdate()
            }
        }
    )
}
