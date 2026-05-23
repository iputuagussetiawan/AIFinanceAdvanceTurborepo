import { api } from '@/lib/api-factory'

import type { IJobseekerResponse, PersonalInfoDTO } from '../types/jobseeker-type'

export const jobseekerService = {
    getProfile: () =>
        api.API<IJobseekerResponse>('/api/jobseeker/me', {
            method: 'GET',
            cache: 'no-store',
        }),

    saveProfile: (data: PersonalInfoDTO) =>
        api.API<IJobseekerResponse>('/api/jobseeker/save', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),
}
