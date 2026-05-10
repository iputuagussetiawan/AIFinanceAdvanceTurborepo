// services/user-service.ts

import { api } from '@/lib/api-factory'

import type { IJobseekerResponse, PersonalInfoDTO } from '../types/jobseeker-type'

export const jobseekerService = {
    // 1. Add the Register function
    saveProfile: (data: PersonalInfoDTO) =>
        api.API<IJobseekerResponse>('/api/jobseeker/save', {
            method: 'POST',
            body: JSON.stringify(data),
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
}
