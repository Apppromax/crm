import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  // Find user role from database
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    select: { role: true },
  })

  if (!dbUser) {
    // User exists in Supabase but not in DB — default to sale
    redirect('/sale')
  }

  // Redirect based on role
  switch (dbUser.role) {
    case 'CEO':
      redirect('/ceo')
    case 'MANAGER':
    case 'ADMIN':
      redirect('/manager')
    case 'LEADER':
      redirect('/manager')
    default:
      redirect('/sale')
  }
}
