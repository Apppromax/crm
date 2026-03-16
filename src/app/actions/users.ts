'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
    getCachedUser,
    getCachedUserStats,
    getCachedTeamMembers,
    getCachedTeamPerformance,
} from '@/lib/cache'

// Fast path: supabase UID from middleware → cached Prisma lookup
// Fallback: full Supabase auth
export const getCurrentUser = cache(async () => {
    const headerStore = await headers()
    const supabaseUid = headerStore.get('x-supabase-uid')

    if (supabaseUid) {
        return getCachedUser(supabaseUid)
    }

    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return null

    return getCachedUser(authUser.id)
})

export async function getUserByRole(role: 'SALE' | 'MANAGER' | 'CEO') {
    const currentUser = await getCurrentUser()
    if (!currentUser) redirect('/login')

    let hasAccess = false
    if (role === 'CEO' && currentUser.role === 'CEO') hasAccess = true
    if (role === 'SALE' && currentUser.role === 'SALE') hasAccess = true
    if (role === 'MANAGER' && ['MANAGER', 'ADMIN', 'LEADER'].includes(currentUser.role)) hasAccess = true

    if (!hasAccess) {
        switch (currentUser.role) {
            case 'CEO': redirect('/ceo'); break
            case 'MANAGER':
            case 'ADMIN':
            case 'LEADER': redirect('/manager'); break
            case 'SALE': redirect('/sale'); break
            default: redirect('/login')
        }
    }

    return currentUser
}

export async function getUserStats(userId: string) {
    return getCachedUserStats(userId)
}

export async function getTeamMembers(teamId: string) {
    return getCachedTeamMembers(teamId)
}

export async function getTeamPerformance(teamId: string) {
    return getCachedTeamPerformance(teamId)
}

