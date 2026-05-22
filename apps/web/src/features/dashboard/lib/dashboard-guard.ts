import { redirect } from 'next/navigation'
import { ONBOARDING_URL, SIGNIN_URL } from '@/lib/constants'
import { sessionService } from '@/features/session/services/session-service'

export async function protectDashboard() {
    const user = await sessionService.get();

    // 1. Not logged in
    if (!user) {
        redirect(SIGNIN_URL)
        return null
    }

    // 2. Logged in but onboarding incomplete
    if (user.user?.onboardingComplete === false) {
        redirect(ONBOARDING_URL)
        return null
    }

    return user;
}