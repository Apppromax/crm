import { getUserByRole } from '@/app/actions/users'
import { NewLeadForm } from './new-lead-form'

export default async function NewLeadPage() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">No user found</div>

    return (
        <NewLeadForm
            userId={user.id}
            orgId={user.org.id}
            teamId={user.team?.id || ''}
        />
    )
}
