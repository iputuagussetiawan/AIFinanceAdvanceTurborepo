import OnboardingJobseeker from '@/features/onboarding/components/onboarding-jobseeker'
import { protectOnboarding } from '@/features/onboarding/lib/onboarding-guard'

const page = async () => {
    const user = await protectOnboarding()
    return (
        <div>
            <OnboardingJobseeker />
        </div>
    )
}

export default page
