// services/user-service.ts

import { api } from '@/lib/api-factory'

import type { ExperienceDTO } from '../types/experience-type'

export const experienceService = {
    updateAll: (data: ExperienceDTO[]) =>
        api.API<any>('/api/jobseeker/experiences/bulk', {
            method: 'PUT',
            body: JSON.stringify({ experiences: data }),
            cache: 'no-store',
        }),
}
