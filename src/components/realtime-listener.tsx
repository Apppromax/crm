'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RealtimeListener({ table, orgId, userId }: { table?: string, orgId?: string, userId?: string }) {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Build the filter
        let filter = ''
        if (orgId) filter = `org_id=eq.${orgId}`
        else if (userId) filter = `user_id=eq.${userId}`

        const channel = supabase.channel(`realtime_${table || 'leads'}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table || 'leads',
                    ...(filter ? { filter } : {})
                },
                (payload: any) => {
                    console.log('Realtime change received!', payload)
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, orgId, userId, router, supabase])

    return null // Invisible component purely for side effects
}
