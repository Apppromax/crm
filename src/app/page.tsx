import { redirect } from 'next/navigation'

export default function HomePage() {
  // TODO: Check user role and redirect accordingly
  // For now, redirect to sale dashboard
  redirect('/sale')
}
