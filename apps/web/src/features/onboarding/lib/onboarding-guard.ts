import { redirect } from 'next/navigation'
import { DASHBOARD_URL, SIGNIN_URL } from '@/lib/constants'
import { sessionService } from '@/features/session/services/session-service'

export async function protectOnboarding() {
    const user = await sessionService.get() // 👈 just call it directlyS
    // 1. Kick out if not logged in
    if (!user) {
        redirect(SIGNIN_URL)
        return null
    }
    // 2. Kick out if they already finished onboarding
    if (user.user.onboardingComplete) {
        redirect(DASHBOARD_URL)
        return null
    }
    return user
}
