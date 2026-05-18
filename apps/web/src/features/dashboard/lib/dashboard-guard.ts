import { redirect } from 'next/navigation'
import { DASHBOARD_URL, ONBOARDING_URL, SIGNIN_URL } from '@/lib/constants'
import { sessionService } from '@/features/session/services/session-service'

export async function protectDashboard() {
    const user = await sessionService.get() // 👈 just call it directlyS
    // 1. Kick out if not logged in
    if (!user) {
        redirect(SIGNIN_URL)
    }
    // 2. Kick out if they haven't finished onboarding
    if (user && user.user.onboardingComplete === false) {
        redirect(ONBOARDING_URL)
    }
    return user
}
