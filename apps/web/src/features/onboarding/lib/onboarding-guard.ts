import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/features/user/actions/user'
import { DASHBOARD_URL, SIGNIN_URL } from '@/lib/constants'

export async function protectOnboarding() {
    const result = await getCurrentUser()
    // 1. Kick out if not logged in
    if (!result) {
        redirect(SIGNIN_URL)
    }
    // 2. Kick out if they already finished onboarding
    if (result.user.onboardingComplete) {
        redirect(DASHBOARD_URL)
    }
    return result
}
