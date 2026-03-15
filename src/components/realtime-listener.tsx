'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function RealtimeListener({ table, orgId, userId }: { table?: string, orgId?: string, userId?: string }) {
    const router = useRouter()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const debouncedRefresh = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            router.refresh()
        }, 500)
    }, [router])

    useEffect(() => {
        let filter = ''
        if (orgId) filter = `org_id=eq.${orgId}`
        else if (userId) filter = `user_id=eq.${userId}`

        const channelName = `rt_${table || 'leads'}_${orgId || userId || 'all'}`
        const channel = supabase.channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table || 'leads',
                    ...(filter ? { filter } : {})
                },
                () => debouncedRefresh()
            )
            .subscribe()

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            supabase.removeChannel(channel)
        }
    }, [table, orgId, userId, debouncedRefresh])

    return null
}
