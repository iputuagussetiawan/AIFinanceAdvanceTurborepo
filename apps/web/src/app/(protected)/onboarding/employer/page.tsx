import React from 'react'

import { protectOnboarding } from '@/features/onboarding/lib/onboarding-guard'

const page = async () => {
    await protectOnboarding()
    return <div>Employer</div>
}

export default page
