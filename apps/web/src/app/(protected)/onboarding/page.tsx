import Onboarding from '@/features/onboarding/components/onboarding'
import { protectOnboarding } from '@/features/onboarding/lib/onboarding-guard'
import { requireAuth } from '@/lib/require-auth'

const OnboardingPage = async () => {
    //const user = await protectOnboarding()
    return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4 antialiased">
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
            <Onboarding />
        </div>
    )
}

export default OnboardingPage
