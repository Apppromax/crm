import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  // Fast path: supabase UID from middleware header
  const headerStore = await headers()
  const supabaseUid = headerStore.get('x-supabase-uid')

  if (supabaseUid) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUid },
      select: { role: true },
    })
    if (dbUser) {
      switch (dbUser.role) {
        case 'CEO': redirect('/ceo')
        case 'MANAGER':
        case 'ADMIN':
        case 'LEADER': redirect('/manager')
        default: redirect('/sale')
      }
    }
  }

  // Fallback: full auth flow
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    select: { role: true },
  })

  if (!dbUser) redirect('/sale')

  switch (dbUser.role) {
    case 'CEO': redirect('/ceo')
    case 'MANAGER':
    case 'ADMIN':
    case 'LEADER': redirect('/manager')
    default: redirect('/sale')
  }
}

